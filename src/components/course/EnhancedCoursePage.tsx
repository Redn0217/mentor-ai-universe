import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Star, TrendingUp, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import CourseOverview from './CourseOverview';
import ModuleCard from './ModuleCard';
import { getCourseWithHierarchy } from '../../services/apiService';
import { progressService, ModuleProgress } from '@/services/progressService';
import { enrollmentService } from '@/services/enrollmentService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const EnhancedCoursePage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'reviews'>('overview');
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch progress data
  const fetchProgress = async (courseData: any) => {
    if (!user || !courseData) return;

    try {
      const progress = await progressService.getModuleProgress(user.id, courseData.id);
      setModuleProgress(progress);

      // Check if user is enrolled
      const enrolled = await enrollmentService.isEnrolled(user.id, courseData.id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        const courseData = await getCourseWithHierarchy(courseSlug);
        setCourse(courseData);

        // Fetch real progress data if user is logged in
        await fetchProgress(courseData);
      } catch (err) {
        setError('Failed to load course data');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug, user]);

  // Refetch progress when page becomes visible (user returns from lesson)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && course && user) {
        fetchProgress(course);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [course, user]);

  const handleEnrollCourse = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in this course",
        variant: "destructive"
      });
      navigate('/login', { state: { redirectTo: `/course/${courseSlug}` } });
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      await enrollmentService.enrollInCourse(user.id, course.id);
      setIsEnrolled(true);
      toast({
        title: "Successfully enrolled!",
        description: `You're now enrolled in ${course.title}. Start learning now!`,
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Enrollment failed",
        description: "Unable to enroll in this course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartModule = async (moduleId: string) => {
    // Track module start
    if (user && course) {
      try {
        await progressService.trackProgress({
          user_id: user.id,
          course_id: course.id,
          module_id: moduleId,
          progress_type: 'module_started',
          completion_percentage: 0,
          time_spent_minutes: 0
        });
      } catch (error) {
        console.error('Error tracking module start:', error);
      }
    }

    navigate(`/course/${courseSlug}/module/${moduleId}`);
  };

  const calculateModuleProgress = (module: any) => {
    if (!user || !moduleProgress[module.id]) {
      return 0; // No progress if not logged in or no data
    }

    const progress = moduleProgress[module.id];
    const totalItems = (module.lessons?.length || 0) + (module.exercises?.length || 0);
    const completedItems = progress.completed_lessons + progress.completed_exercises;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const isModuleUnlocked = (moduleIndex: number) => {
    // Unlock all modules as requested
    return true;
  };

  const isModuleCompleted = (module: any) => {
    if (!user || !moduleProgress[module.id]) {
      return false;
    }

    const progress = moduleProgress[module.id];
    const totalLessons = module.lessons?.length || 0;
    const totalExercises = module.exercises?.length || 0;

    return progress.completed_lessons >= totalLessons &&
           progress.completed_exercises >= totalExercises;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
          <p className="text-gray-600">{error || 'The course you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress based on lessons (not modules) for consistency with Dashboard
  const calculateOverallProgress = () => {
    if (!user || !course.modules) return 0;

    // Count total lessons across all modules
    let totalLessons = 0;
    let completedLessons = 0;

    course.modules.forEach((module: any) => {
      const moduleLessons = module.lessons?.length || 0;
      totalLessons += moduleLessons;

      // Count completed lessons in this module
      if (moduleProgress[module.id]) {
        completedLessons += moduleProgress[module.id].completed_lessons;
      }
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();
  const totalModules = course.modules?.length || 0;
  const completedModules = course.modules?.filter((module: any) => isModuleCompleted(module)).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Courses</span>
            </button>

            <div className="flex items-center gap-4">
              {/* Enrollment Button */}
              {user && (
                <button
                  onClick={handleEnrollCourse}
                  disabled={isEnrolled || enrolling}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                    isEnrolled
                      ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" />
                      <span>Enrolled</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-5 h-5" />
                      <span>{enrolling ? 'Enrolling...' : 'Enroll Now'}</span>
                    </>
                  )}
                </button>
              )}
              {!user && (
                <button
                  onClick={() => navigate('/login', { state: { redirectTo: `/course/${courseSlug}` } })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
                >
                  <BookmarkPlus className="w-5 h-5" />
                  <span>Enroll Now</span>
                </button>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-500">Your Progress</div>
                <div className="text-lg font-semibold text-gray-900">{overallProgress}% Complete</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray={`${overallProgress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{overallProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'modules', label: 'Course Content', icon: Users },
              { id: 'reviews', label: 'Reviews', icon: Star }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeTab === 'overview' && <CourseOverview course={course} />}
        
        {activeTab === 'modules' && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Course Content</h2>
              <p className="text-gray-600">
                {totalModules} modules • {course.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0)} lessons
              </p>
            </div>

            {/* Enrollment Notice for Non-Enrolled Users */}
            {user && !isEnrolled && (
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <BookmarkPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Enroll to Start Learning
                    </h3>
                    <p className="text-gray-700 mb-4">
                      You need to enroll in this course to access the modules and start your learning journey.
                    </p>
                    <button
                      onClick={handleEnrollCourse}
                      disabled={enrolling}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <BookmarkPlus className="w-5 h-5" />
                      <span>{enrolling ? 'Enrolling...' : 'Enroll Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!user && (
              <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-600 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                      <BookmarkPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Sign In to Access Course Content
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Please sign in to enroll in this course and unlock all modules and lessons.
                    </p>
                    <button
                      onClick={() => navigate('/login', { state: { redirectTo: `/course/${courseSlug}` } })}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      Sign In to Enroll
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {course.modules?.map((module: any, index: number) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isUnlocked={user && isEnrolled ? isModuleUnlocked(index) : false}
                  isCompleted={isModuleCompleted(module)}
                  progress={calculateModuleProgress(module)}
                  onStartModule={() => handleStartModule(module.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center py-16">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reviews Coming Soon</h3>
              <p className="text-gray-600">Student reviews and ratings will be available here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCoursePage;
