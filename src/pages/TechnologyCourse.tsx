
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { TutorChat } from '@/components/tutors/TutorChat';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCourse, CourseData } from '@/services/apiService';
import { progressService, ModuleProgress } from '@/services/progressService';
import ExerciseViewer from '@/components/course/ExerciseViewer';
import { Clock, BookOpen, Trophy, Star, Users, PlayCircle } from 'lucide-react';

// Define the interface for module content
interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exercises: Exercise[];
  resources: Resource[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starter_code?: string;
  solution_code?: string;
  hints: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes: number;
  points: number;
  tags: string[];
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'tutorial';
  url: string;
}

export default function TechnologyCourse() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => fetchCourse(slug || ''),
    enabled: !!slug
  });

  useEffect(() => {
    // Initialize with first module when data loads
    if (courseData?.modules && courseData.modules.length > 0) {
      setActiveModule(courseData.modules[0].id);

      // Fetch real progress data if user is logged in
      if (user && courseData) {
        const fetchProgress = async () => {
          try {
            const progress = await progressService.getModuleProgress(user.id, courseData.id);
            setModuleProgress(progress);
          } catch (error) {
            console.error('Error fetching progress:', error);
          }
        };
        fetchProgress();
      }
    }
  }, [courseData, user]);

  const handleEnrollCourse = () => {
    toast({
      title: "Enrolled Successfully",
      description: "You've been enrolled in this course!",
    });
  };

  const handleStartModule = async (moduleId: string) => {
    setActiveModule(moduleId);

    // Track module start
    if (user && courseData) {
      try {
        await progressService.trackProgress({
          user_id: user.id,
          course_id: courseData.id,
          module_id: moduleId,
          progress_type: 'module_started',
          completion_percentage: 0,
          time_spent_minutes: 0
        });
      } catch (error) {
        console.error('Error tracking module start:', error);
      }
    }

    toast({
      title: "Module Started",
      description: "Good luck with your learning journey!",
    });
  };

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    // Refresh progress data
    if (user && courseData) {
      try {
        const progress = await progressService.getModuleProgress(user.id, courseData.id);
        setModuleProgress(progress);
      } catch (error) {
        console.error('Error refreshing progress:', error);
      }
    }
    // Don't close modal here - let the completion modal handle navigation
  };

  const handleContinueToNext = () => {
    setSelectedExercise(null);
    // Navigate to next module or back to course overview
    // This could be enhanced to navigate to the next module
    // For now, just close the exercise
  };

  // Get navigation context for exercises
  const getExerciseNavigationInfo = (currentModuleId: string, exerciseId: string) => {
    if (!courseData?.modules) return { hasNextLesson: false, hasNextModule: false };

    const currentModuleIndex = courseData.modules.findIndex((m: any) => m.id === currentModuleId);
    const currentModule = courseData.modules[currentModuleIndex];

    // Check if there are more lessons in current module
    const hasMoreLessonsInModule = currentModule?.lessons && currentModule.lessons.length > 1;

    // Check if there are more modules
    const hasNextModule = currentModuleIndex < courseData.modules.length - 1;
    const nextModule = hasNextModule ? courseData.modules[currentModuleIndex + 1] : null;

    return {
      hasNextLesson: hasMoreLessonsInModule,
      hasNextModule,
      nextModuleTitle: nextModule?.title
    };
  };

  const calculateModuleProgress = (module: Module) => {
    if (!user || !moduleProgress[module.id]) {
      return 0;
    }

    const progress = moduleProgress[module.id];
    const totalItems = (module.lessons?.length || 0) + (module.exercises?.length || 0);
    const completedItems = progress.completed_lessons + progress.completed_exercises;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-16 w-16 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading course content...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !courseData) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Error Loading Course</h2>
              <p className="text-lg text-gray-600 mb-6">
                We couldn't load the course content. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentModule = courseData.modules.find(m => m.id === activeModule);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Course Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: courseData.color }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 13.5h2.5a2 2 0 0 0 2-1.5 2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2 2 2 0 0 0 2 2H10"/>
                <path d="M10 17V5.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5"/>
                <path d="M14 6.5v11a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{courseData.title} Course</h1>
              <p className="text-gray-600">{courseData.description}</p>
            </div>
          </div>

          {!user && (
            <Card className="bg-muted/20 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="font-medium">Sign in to track your progress and earn certificates!</p>
                <Button onClick={handleEnrollCourse}>Enroll Now</Button>
              </div>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Course Modules Sidebar */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4">Course Modules</h2>
            <div className="space-y-4">
              {courseData.modules.map((module) => (
                <Card
                  key={module.id}
                  className={`cursor-pointer hover:border-primary transition-colors ${activeModule === module.id ? 'border-primary' : ''}`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="text-sm text-muted-foreground mb-2">{module.description}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {module.lessons.length} Lessons • {module.exercises.length} Exercises
                    </div>
                    {user && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{calculateModuleProgress(module)}%</span>
                        </div>
                        <Progress value={calculateModuleProgress(module)} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="sm"
                      variant={calculateModuleProgress(module) > 0 ? "outline" : "default"}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartModule(module.id);
                      }}
                    >
                      {calculateModuleProgress(module) > 0 ? "Continue" : "Start"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Chat with Tutor */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat with Tutor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={courseData.tutor.avatar}
                      alt={courseData.tutor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{courseData.tutor.name}</p>
                      <p className="text-sm text-muted-foreground">Course Expert</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      toast({
                        title: "Chat Initialized",
                        description: `You can now chat with ${courseData.tutor.name}`,
                      });
                    }}
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Module Content */}
          <div className="md:col-span-2">
            {currentModule && (
              <>
                <h2 className="text-2xl font-bold mb-6">{currentModule.title}</h2>

                <Tabs defaultValue="lessons">
                  <TabsList className="mb-6">
                    <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lessons" className="space-y-6">
                    {currentModule.lessons.map((lesson, index) => (
                      <Card key={lesson.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>Lesson {index + 1}: {lesson.title}</CardTitle>
                            <span className="text-sm text-muted-foreground">{lesson.duration} min</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{lesson.content}</p>
                          {lesson.videoUrl && (
                            <div className="mt-4 aspect-video bg-muted rounded-md flex items-center justify-center">
                              <Button>Watch Video</Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="exercises" className="space-y-6">
                    {currentModule.exercises.map((exercise, index) => (
                      <Card key={exercise.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>Exercise {index + 1}: {exercise.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {exercise.difficulty}
                              </span>
                              <span className="text-sm text-muted-foreground">{exercise.estimatedTime} min</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{exercise.description}</p>
                          <Button onClick={() => handleStartExercise(exercise)}>
                            Start Exercise
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    {currentModule.resources.map((resource) => (
                      <Card key={resource.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              resource.type === 'article' ? 'bg-blue-100 text-blue-800' :
                              resource.type === 'video' ? 'bg-purple-100 text-purple-800' :
                              resource.type === 'book' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {resource.type}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" asChild className="w-full">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              View Resource
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Viewer Modal */}
      {selectedExercise && courseData && (
        <div className="fixed inset-0 z-50 bg-white">
          <ExerciseViewer
            exercise={selectedExercise}
            courseId={courseData.id}
            moduleId={activeModule || ''}
            onBack={() => setSelectedExercise(null)}
            onComplete={handleExerciseComplete}
            onContinueToNext={handleContinueToNext}
            {...getExerciseNavigationInfo(activeModule || '', selectedExercise.id)}
          />
        </div>
      )}
    </MainLayout>
  );
}
