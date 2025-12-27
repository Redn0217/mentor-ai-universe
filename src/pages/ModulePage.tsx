import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import LessonViewer from '../components/course/LessonViewer';
import ExerciseViewer from '../components/course/ExerciseViewer';
import CourseSidebar from '../components/course/CourseSidebar';
import { getCourseWithHierarchy } from '../services/apiService';
import { progressService } from '@/services/progressService';
import { stateService } from '@/services/stateService';
import { useAuth } from '@/contexts/AuthContext';
import { CourseTutorChat } from '@/components/tutors/CourseTutorChat';
import { getTutorForCourse } from '@/data/courseTutors';

const ModulePage: React.FC = () => {
  const { courseSlug, moduleId } = useParams<{ courseSlug: string; moduleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [stateLoaded, setStateLoaded] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseSlug || !moduleId) return;

      try {
        const courseData = await getCourseWithHierarchy(courseSlug);
        setCourse(courseData);

        const module = courseData.modules?.find((m: any) => m.id === moduleId);
        if (module) {
          setCurrentModule(module);

          // Check if there's a lesson query parameter
          const lessonParam = searchParams.get('lesson');
          if (lessonParam !== null) {
            const lessonIndex = parseInt(lessonParam, 10);
            if (!isNaN(lessonIndex) && lessonIndex >= 0 && lessonIndex < module.lessons.length) {
              setCurrentLessonIndex(lessonIndex);
            }
          } else if (!stateLoaded && !hasMountedRef.current) {
            // Restore state after course data is loaded only if no lesson param
            restoreState();
            hasMountedRef.current = true;
          }

          // Fetch completed lessons for ALL modules in the course
          if (user && courseData.id) {
            fetchAllCompletedLessons(courseData.id, courseData.modules);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseSlug, moduleId, user, searchParams]);

  // Fetch completed lessons from database for ALL modules
  const fetchAllCompletedLessons = async (courseId: string, modules: any[]) => {
    if (!user || !modules) return;

    try {
      // Fetch all completed lessons for this course
      const completedLessonIds = new Set<string>();

      // Check each lesson in ALL modules
      for (const module of modules) {
        if (module.lessons) {
          for (const lesson of module.lessons) {
            const isCompleted = await progressService.isLessonCompleted(user.id, lesson.id);
            if (isCompleted) {
              completedLessonIds.add(lesson.id);
            }
          }
        }
      }

      setCompletedLessons(completedLessonIds);
    } catch (error) {
      console.error('Error fetching completed lessons:', error);
    }
  };

  // Restore state from localStorage
  const restoreState = () => {
    try {
      const savedState = stateService.getCourseState();
      if (savedState && savedState.courseSlug === courseSlug && savedState.moduleId === moduleId) {
        if (savedState.currentLessonIndex !== undefined) {
          setCurrentLessonIndex(savedState.currentLessonIndex);
        }
        if (savedState.selectedExercise) {
          setSelectedExercise(savedState.selectedExercise);
        }
      }
      setStateLoaded(true);
    } catch (error) {
      console.error('Error restoring state:', error);
      setStateLoaded(true);
    }
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (stateLoaded && courseSlug && moduleId) {
      stateService.saveCourseState({
        courseSlug,
        moduleId,
        currentLessonIndex,
        selectedExercise
      });
    }
  }, [courseSlug, moduleId, currentLessonIndex, selectedExercise, stateLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentModule || !currentModule.lessons || currentModule.lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">📚</div>
          <h2 className="text-2xl font-bold text-gray-900">No Lessons Found</h2>
          <p className="text-gray-600">This module doesn't have any lessons yet.</p>
          <button
            onClick={() => navigate(`/course/${courseSlug}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const currentLesson = currentModule.lessons[currentLessonIndex];
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < currentModule.lessons.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      // If this is the last lesson, go back to course overview
      navigate(`/course/${courseSlug}`);
    }
  };

  const handleComplete = async () => {
    // Track lesson completion
    if (user && course) {
      try {
        await progressService.trackProgress({
          user_id: user.id,
          course_id: course.id,
          module_id: moduleId!,
          lesson_id: currentLesson.id,
          progress_type: 'lesson_completed',
          completion_percentage: 100,
          time_spent_minutes: 0 // You could track actual time spent
        });

        // Update local state to mark lesson as completed
        setCompletedLessons(prev => new Set(prev).add(currentLesson.id));
      } catch (error) {
        console.error('Error tracking lesson completion:', error);
      }
    }

    console.log('Lesson completed:', currentLesson.id);

    // Don't auto-advance - let the completion modal handle navigation
    // The modal will show options to continue to next lesson or stay
  };

  const handleStartExercise = (exercise: any) => {
    setSelectedExercise(exercise);
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    // Exercise completion is already tracked in ExerciseViewer
    // Don't close modal here - let the completion modal handle navigation
  };

  const handleContinueToNext = () => {
    setSelectedExercise(null);
    // Navigate to next lesson or module
    if (hasNext) {
      handleNext();
    } else {
      // If no more lessons in this module, go to course overview
      navigate(`/course/${courseSlug}`);
    }
  };

  // Get navigation context for lessons and exercises
  const getNavigationInfo = () => {
    if (!course?.modules || !currentModule) {
      return {
        hasNextLesson: false,
        hasNextModule: false,
        nextLessonTitle: undefined,
        nextModuleTitle: undefined
      };
    }

    // Check if there's a next lesson in current module
    const hasNextLessonInModule = hasNext && currentModule.lessons && currentLessonIndex < currentModule.lessons.length - 1;
    const nextLesson = hasNextLessonInModule ? currentModule.lessons[currentLessonIndex + 1] : null;

    // Check if there's a next module
    const currentModuleIndex = course.modules.findIndex((m: any) => m.id === moduleId);
    const hasNextModuleInCourse = currentModuleIndex < course.modules.length - 1;
    const nextModule = hasNextModuleInCourse ? course.modules[currentModuleIndex + 1] : null;

    return {
      hasNextLesson: hasNextLessonInModule,
      hasNextModule: !hasNextLessonInModule && hasNextModuleInCourse,
      nextLessonTitle: nextLesson?.title,
      nextModuleTitle: nextModule?.title
    };
  };

  const handleLessonContinueToNext = () => {
    const navInfo = getNavigationInfo();

    if (navInfo.hasNextLesson) {
      // Go to next lesson in current module
      handleNext();
    } else if (navInfo.hasNextModule) {
      // Go to next module
      const currentModuleIndex = course?.modules?.findIndex((m: any) => m.id === moduleId) || 0;
      const nextModule = course?.modules?.[currentModuleIndex + 1];
      if (nextModule) {
        navigate(`/course/${courseSlug}/module/${nextModule.id}`);
      }
    } else {
      // Go back to course overview
      navigate(`/course/${courseSlug}`);
    }
  };

  // Show exercise viewer if an exercise is selected
  if (selectedExercise) {
    const navInfo = getNavigationInfo();

    return (
      <div className="fixed inset-0 z-50 bg-white">
        <ExerciseViewer
          exercise={selectedExercise}
          courseId={course?.id || ''}
          moduleId={moduleId || ''}
          lessonId={currentLesson?.id}
          onBack={() => setSelectedExercise(null)}
          onComplete={handleExerciseComplete}
          onContinueToNext={handleContinueToNext}
          hasNextLesson={navInfo.hasNextLesson}
          hasNextModule={navInfo.hasNextModule}
          nextLessonTitle={navInfo.nextLessonTitle}
          nextModuleTitle={navInfo.nextModuleTitle}
        />
      </div>
    );
  }

  const navInfo = getNavigationInfo();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <CourseSidebar
        course={course}
        currentModuleId={moduleId || ''}
        currentLessonId={currentLesson.id}
        completedLessons={completedLessons}
        courseSlug={courseSlug || ''}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <LessonViewer
          lesson={currentLesson}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          onStartExercise={handleStartExercise}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          isCompleted={completedLessons.has(currentLesson.id)}
          hasNextLesson={navInfo.hasNextLesson}
          hasNextModule={navInfo.hasNextModule}
          nextLessonTitle={navInfo.nextLessonTitle}
          nextModuleTitle={navInfo.nextModuleTitle}
          onContinueToNext={handleLessonContinueToNext}
          courseTitle={course?.title}
          courseSlug={courseSlug}
        />
      </div>

      {/* Course-Specific AI Tutor Chat */}
      {course && (
        <CourseTutorChat
          tutor={getTutorForCourse(courseSlug || '', course?.tutor)}
          courseContext={{
            courseTitle: course?.title || '',
            courseSlug: courseSlug || '',
            currentModule: currentModule?.title,
            currentLesson: currentLesson?.title,
            modules: course?.modules?.map((m: any) => ({
              title: m.title,
              lessons: m.lessons?.map((l: any) => ({ title: l.title })) || []
            })) || []
          }}
          techColor={course?.color || '#00D4AA'}
        />
      )}
    </div>
  );
};

export default ModulePage;
