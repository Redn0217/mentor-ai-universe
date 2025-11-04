import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import CourseOverview from './CourseOverview';
import ModuleCard from './ModuleCard';
import { getCourseWithHierarchy } from '../../services/apiService';
import { progressService, ModuleProgress } from '@/services/progressService';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedCoursePage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'reviews'>('overview');
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        const courseData = await getCourseWithHierarchy(courseSlug);
        setCourse(courseData);

        // Fetch real progress data if user is logged in
        if (user && courseData) {
          const progress = await progressService.getModuleProgress(user.id, courseData.id);
          setModuleProgress(progress);
        }
      } catch (err) {
        setError('Failed to load course data');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug, user]);

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

  const totalModules = course.modules?.length || 0;
  const completedModules = course.modules?.filter((module: any) => isModuleCompleted(module)).length || 0;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

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
            
            <div className="space-y-6">
              {course.modules?.map((module: any, index: number) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isUnlocked={isModuleUnlocked(index)}
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
