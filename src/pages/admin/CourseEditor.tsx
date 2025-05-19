
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'tutorial';
  url: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: Module[];
  tutor: {
    name: string;
    avatar: string;
  }
}

// Fetch course data from API
const fetchCourseData = async (slug: string): Promise<CourseData> => {
  try {
    const response = await fetch(`/api/courses/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching course data:', error);
    // Fallback to sample data for development
    return getMockCourseData(slug);
  }
};

// Save course data via API
const saveCourseData = async (courseData: CourseData): Promise<CourseData> => {
  try {
    const response = await fetch(`/api/courses/${courseData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save course data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error saving course data:', error);
    // For development, just return the data that was passed in
    return courseData;
  }
};

// Mock data for development
const getMockCourseData = (slug: string): CourseData => {
  return {
    id: slug,
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Learn ${slug} from basics to advanced concepts with hands-on projects.`,
    icon: 'code',
    color: '#3776AB',
    modules: [
      {
        id: 'module1',
        title: 'Getting Started',
        description: 'Learn the basics and set up your development environment.',
        lessons: [
          {
            id: 'lesson1',
            title: 'Introduction',
            content: 'Overview of the course and what you will learn.',
            duration: 15
          },
          {
            id: 'lesson2',
            title: 'Installation & Setup',
            content: 'Setting up your development environment.',
            duration: 25
          }
        ],
        exercises: [
          {
            id: 'ex1',
            title: 'Hello World',
            description: 'Create your first program.',
            difficulty: 'beginner',
            estimatedTime: 10
          }
        ],
        resources: [
          {
            id: 'res1',
            title: 'Official Documentation',
            type: 'article',
            url: '#'
          }
        ]
      },
      {
        id: 'module2',
        title: 'Core Concepts',
        description: 'Master the fundamental concepts and syntax.',
        lessons: [
          {
            id: 'lesson3',
            title: 'Data Types',
            content: 'Learn about different data types.',
            duration: 30
          }
        ],
        exercises: [
          {
            id: 'ex2',
            title: 'Working with Data',
            description: 'Practice with different data types.',
            difficulty: 'beginner',
            estimatedTime: 20
          }
        ],
        resources: [
          {
            id: 'res2',
            title: 'Interactive Tutorial',
            type: 'tutorial',
            url: '#'
          }
        ]
      }
    ],
    tutor: {
      name: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Expert`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}`
    }
  };
};

export default function CourseEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch course data
  const { data, isLoading, error } = useQuery({
    queryKey: ['courseEdit', slug],
    queryFn: () => fetchCourseData(slug || ''),
    enabled: !!slug
  });

  // Save course data mutation
  const mutation = useMutation({
    mutationFn: saveCourseData,
    onSuccess: (data) => {
      toast({
        title: "Changes saved",
        description: "Course content has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (data) {
      setCourseData(data);
      if (data.modules.length > 0) {
        setActiveModule(data.modules[0].id);
      }
    }
  }, [data]);

  // Check if user is admin (simplified check - in real app, use proper role-based auth)
  useEffect(() => {
    if (user && user.email !== "hadaa914@gmail.com") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  const handleSave = () => {
    if (courseData) {
      mutation.mutate(courseData);
    }
  };

  const updateCourseField = (field: string, value: string) => {
    if (courseData) {
      setCourseData({
        ...courseData,
        [field]: value
      });
    }
  };

  // Handle module updates
  const updateModule = (moduleId: string, field: string, value: string) => {
    if (courseData) {
      const updatedModules = courseData.modules.map(module => {
        if (module.id === moduleId) {
          return { ...module, [field]: value };
        }
        return module;
      });
      
      setCourseData({
        ...courseData,
        modules: updatedModules
      });
    }
  };

  // Add a new module
  const addNewModule = () => {
    if (courseData) {
      const newModuleId = `module${courseData.modules.length + 1}`;
      const newModule: Module = {
        id: newModuleId,
        title: 'New Module',
        description: 'Module description goes here',
        lessons: [],
        exercises: [],
        resources: []
      };
      
      setCourseData({
        ...courseData,
        modules: [...courseData.modules, newModule]
      });
      
      setActiveModule(newModuleId);
      toast({
        title: "Module added",
        description: "New module has been added to the course.",
      });
    }
  };

  // Delete a module
  const deleteModule = (moduleId: string) => {
    if (courseData && window.confirm("Are you sure you want to delete this module?")) {
      const updatedModules = courseData.modules.filter(module => module.id !== moduleId);
      setCourseData({
        ...courseData,
        modules: updatedModules
      });
      
      if (activeModule === moduleId && updatedModules.length > 0) {
        setActiveModule(updatedModules[0].id);
      }
      
      toast({
        title: "Module deleted",
        description: "The module has been removed from the course.",
      });
    }
  };

  // Add lesson to current module
  const addLesson = (moduleId: string) => {
    if (courseData) {
      const currentModule = courseData.modules.find(m => m.id === moduleId);
      if (currentModule) {
        const newLessonId = `lesson${currentModule.lessons.length + 1}`;
        const newLesson: Lesson = {
          id: newLessonId,
          title: 'New Lesson',
          content: 'Lesson content goes here',
          duration: 15
        };
        
        const updatedModules = courseData.modules.map(module => {
          if (module.id === moduleId) {
            return {
              ...module,
              lessons: [...module.lessons, newLesson]
            };
          }
          return module;
        });
        
        setCourseData({
          ...courseData,
          modules: updatedModules
        });
        
        toast({
          title: "Lesson added",
          description: "New lesson has been added to the module.",
        });
      }
    }
  };

  // Update lesson in current module
  const updateLesson = (moduleId: string, lessonId: string, field: string, value: string | number) => {
    if (courseData) {
      const updatedModules = courseData.modules.map(module => {
        if (module.id === moduleId) {
          const updatedLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, [field]: value };
            }
            return lesson;
          });
          
          return {
            ...module,
            lessons: updatedLessons
          };
        }
        return module;
      });
      
      setCourseData({
        ...courseData,
        modules: updatedModules
      });
    }
  };

  // Delete lesson
  const deleteLesson = (moduleId: string, lessonId: string) => {
    if (courseData && window.confirm("Are you sure you want to delete this lesson?")) {
      const updatedModules = courseData.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
          };
        }
        return module;
      });
      
      setCourseData({
        ...courseData,
        modules: updatedModules
      });
      
      toast({
        title: "Lesson deleted",
        description: "The lesson has been removed from the module.",
      });
    }
  };

  // Add exercise to module
  const addExercise = (moduleId: string) => {
    if (courseData) {
      const currentModule = courseData.modules.find(m => m.id === moduleId);
      if (currentModule) {
        const newExerciseId = `ex${currentModule.exercises.length + 1}`;
        const newExercise: Exercise = {
          id: newExerciseId,
          title: 'New Exercise',
          description: 'Exercise description goes here',
          difficulty: 'beginner',
          estimatedTime: 15
        };
        
        const updatedModules = courseData.modules.map(module => {
          if (module.id === moduleId) {
            return {
              ...module,
              exercises: [...module.exercises, newExercise]
            };
          }
          return module;
        });
        
        setCourseData({
          ...courseData,
          modules: updatedModules
        });
        
        toast({
          title: "Exercise added",
          description: "New exercise has been added to the module.",
        });
      }
    }
  };

  // Add resource to module
  const addResource = (moduleId: string) => {
    if (courseData) {
      const currentModule = courseData.modules.find(m => m.id === moduleId);
      if (currentModule) {
        const newResourceId = `res${currentModule.resources.length + 1}`;
        const newResource: Resource = {
          id: newResourceId,
          title: 'New Resource',
          type: 'article',
          url: '#'
        };
        
        const updatedModules = courseData.modules.map(module => {
          if (module.id === moduleId) {
            return {
              ...module,
              resources: [...module.resources, newResource]
            };
          }
          return module;
        });
        
        setCourseData({
          ...courseData,
          modules: updatedModules
        });
        
        toast({
          title: "Resource added",
          description: "New resource has been added to the module.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-16 w-16 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading course editor...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !courseData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
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
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Course Editor</h1>
            <p className="text-gray-600">Edit course content for {courseData.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/tech/${slug}`)}>
              Preview Course
            </Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Course Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>Edit the main course information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="courseTitle">Course Title</Label>
                  <Input 
                    id="courseTitle" 
                    value={courseData.title} 
                    onChange={(e) => updateCourseField('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="courseDesc">Course Description</Label>
                  <Textarea 
                    id="courseDesc" 
                    value={courseData.description}
                    onChange={(e) => updateCourseField('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="courseColor">Theme Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="courseColor" 
                      value={courseData.color}
                      onChange={(e) => updateCourseField('color', e.target.value)}
                    />
                    <div 
                      className="w-10 h-10 rounded" 
                      style={{ backgroundColor: courseData.color }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>Course Tutor</CardTitle>
                <CardDescription>Update tutor information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tutorName">Tutor Name</Label>
                  <Input 
                    id="tutorName" 
                    value={courseData.tutor.name}
                    onChange={(e) => setCourseData({
                      ...courseData,
                      tutor: { ...courseData.tutor, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="tutorAvatar">Tutor Avatar URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="tutorAvatar" 
                      value={courseData.tutor.avatar}
                      onChange={(e) => setCourseData({
                        ...courseData,
                        tutor: { ...courseData.tutor, avatar: e.target.value }
                      })}
                    />
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={courseData.tutor.avatar} 
                        alt="Tutor avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Modules List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Modules</CardTitle>
                  <CardDescription>Manage course modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {courseData.modules.map((module) => (
                      <div 
                        key={module.id} 
                        className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                          activeModule === module.id ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setActiveModule(module.id)}
                      >
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {module.lessons.length} lessons · {module.exercises.length} exercises
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteModule(module.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={addNewModule} className="w-full">
                    Add New Module
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Module Editor */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Module Editor</CardTitle>
                  <CardDescription>Edit module content</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentModule ? (
                    <Tabs defaultValue="details">
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="lessons">Lessons</TabsTrigger>
                        <TabsTrigger value="exercises">Exercises</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <div>
                          <Label htmlFor="moduleTitle">Module Title</Label>
                          <Input 
                            id="moduleTitle" 
                            value={currentModule.title}
                            onChange={(e) => updateModule(currentModule.id, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="moduleDesc">Module Description</Label>
                          <Textarea 
                            id="moduleDesc" 
                            value={currentModule.description}
                            onChange={(e) => updateModule(currentModule.id, 'description', e.target.value)}
                            rows={4}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="lessons">
                        <div className="space-y-4">
                          {currentModule.lessons.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {currentModule.lessons.map((lesson) => (
                                  <TableRow key={lesson.id}>
                                    <TableCell>
                                      <Input 
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(currentModule.id, lesson.id, 'title', e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input 
                                        type="number"
                                        value={lesson.duration}
                                        onChange={(e) => updateLesson(currentModule.id, lesson.id, 'duration', parseInt(e.target.value))}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => deleteLesson(currentModule.id, lesson.id)}
                                      >
                                        Delete
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center p-4 border rounded-md text-muted-foreground">
                              No lessons added yet
                            </div>
                          )}
                          
                          <Button onClick={() => addLesson(currentModule.id)}>
                            Add Lesson
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="exercises">
                        <div className="space-y-4">
                          {currentModule.exercises.length > 0 ? (
                            <div className="space-y-4">
                              {currentModule.exercises.map((exercise) => (
                                <Card key={exercise.id}>
                                  <CardHeader className="pb-2">
                                    <Input 
                                      value={exercise.title}
                                      onChange={(e) => {
                                        const updatedModules = courseData.modules.map(module => {
                                          if (module.id === currentModule.id) {
                                            const updatedExercises = module.exercises.map(ex => {
                                              if (ex.id === exercise.id) {
                                                return { ...ex, title: e.target.value };
                                              }
                                              return ex;
                                            });
                                            
                                            return {
                                              ...module,
                                              exercises: updatedExercises
                                            };
                                          }
                                          return module;
                                        });
                                        
                                        setCourseData({
                                          ...courseData,
                                          modules: updatedModules
                                        });
                                      }}
                                    />
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <Textarea 
                                      value={exercise.description}
                                      onChange={(e) => {
                                        const updatedModules = courseData.modules.map(module => {
                                          if (module.id === currentModule.id) {
                                            const updatedExercises = module.exercises.map(ex => {
                                              if (ex.id === exercise.id) {
                                                return { ...ex, description: e.target.value };
                                              }
                                              return ex;
                                            });
                                            
                                            return {
                                              ...module,
                                              exercises: updatedExercises
                                            };
                                          }
                                          return module;
                                        });
                                        
                                        setCourseData({
                                          ...courseData,
                                          modules: updatedModules
                                        });
                                      }}
                                      rows={3}
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label>Difficulty</Label>
                                        <select 
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          value={exercise.difficulty}
                                          onChange={(e) => {
                                            const updatedModules = courseData.modules.map(module => {
                                              if (module.id === currentModule.id) {
                                                const updatedExercises = module.exercises.map(ex => {
                                                  if (ex.id === exercise.id) {
                                                    return { 
                                                      ...ex, 
                                                      difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                                                    };
                                                  }
                                                  return ex;
                                                });
                                                
                                                return {
                                                  ...module,
                                                  exercises: updatedExercises
                                                };
                                              }
                                              return module;
                                            });
                                            
                                            setCourseData({
                                              ...courseData,
                                              modules: updatedModules
                                            });
                                          }}
                                        >
                                          <option value="beginner">Beginner</option>
                                          <option value="intermediate">Intermediate</option>
                                          <option value="advanced">Advanced</option>
                                        </select>
                                      </div>
                                      <div>
                                        <Label>Estimated Time (min)</Label>
                                        <Input 
                                          type="number"
                                          value={exercise.estimatedTime}
                                          onChange={(e) => {
                                            const updatedModules = courseData.modules.map(module => {
                                              if (module.id === currentModule.id) {
                                                const updatedExercises = module.exercises.map(ex => {
                                                  if (ex.id === exercise.id) {
                                                    return { 
                                                      ...ex, 
                                                      estimatedTime: parseInt(e.target.value) 
                                                    };
                                                  }
                                                  return ex;
                                                });
                                                
                                                return {
                                                  ...module,
                                                  exercises: updatedExercises
                                                };
                                              }
                                              return module;
                                            });
                                            
                                            setCourseData({
                                              ...courseData,
                                              modules: updatedModules
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </CardContent>
                                  <CardFooter>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        const updatedModules = courseData.modules.map(module => {
                                          if (module.id === currentModule.id) {
                                            return {
                                              ...module,
                                              exercises: module.exercises.filter(ex => ex.id !== exercise.id)
                                            };
                                          }
                                          return module;
                                        });
                                        
                                        setCourseData({
                                          ...courseData,
                                          modules: updatedModules
                                        });
                                      }}
                                    >
                                      Delete Exercise
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-4 border rounded-md text-muted-foreground">
                              No exercises added yet
                            </div>
                          )}
                          
                          <Button onClick={() => addExercise(currentModule.id)}>
                            Add Exercise
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources">
                        <div className="space-y-4">
                          {currentModule.resources.length > 0 ? (
                            <div className="space-y-4">
                              {currentModule.resources.map((resource) => (
                                <Card key={resource.id}>
                                  <CardHeader className="pb-2">
                                    <Input 
                                      value={resource.title}
                                      onChange={(e) => {
                                        const updatedModules = courseData.modules.map(module => {
                                          if (module.id === currentModule.id) {
                                            const updatedResources = module.resources.map(res => {
                                              if (res.id === resource.id) {
                                                return { ...res, title: e.target.value };
                                              }
                                              return res;
                                            });
                                            
                                            return {
                                              ...module,
                                              resources: updatedResources
                                            };
                                          }
                                          return module;
                                        });
                                        
                                        setCourseData({
                                          ...courseData,
                                          modules: updatedModules
                                        });
                                      }}
                                    />
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label>Type</Label>
                                        <select 
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                          value={resource.type}
                                          onChange={(e) => {
                                            const updatedModules = courseData.modules.map(module => {
                                              if (module.id === currentModule.id) {
                                                const updatedResources = module.resources.map(res => {
                                                  if (res.id === resource.id) {
                                                    return { 
                                                      ...res, 
                                                      type: e.target.value as 'article' | 'video' | 'book' | 'tutorial'
                                                    };
                                                  }
                                                  return res;
                                                });
                                                
                                                return {
                                                  ...module,
                                                  resources: updatedResources
                                                };
                                              }
                                              return module;
                                            });
                                            
                                            setCourseData({
                                              ...courseData,
                                              modules: updatedModules
                                            });
                                          }}
                                        >
                                          <option value="article">Article</option>
                                          <option value="video">Video</option>
                                          <option value="book">Book</option>
                                          <option value="tutorial">Tutorial</option>
                                        </select>
                                      </div>
                                      <div>
                                        <Label>URL</Label>
                                        <Input 
                                          value={resource.url}
                                          onChange={(e) => {
                                            const updatedModules = courseData.modules.map(module => {
                                              if (module.id === currentModule.id) {
                                                const updatedResources = module.resources.map(res => {
                                                  if (res.id === resource.id) {
                                                    return { ...res, url: e.target.value };
                                                  }
                                                  return res;
                                                });
                                                
                                                return {
                                                  ...module,
                                                  resources: updatedResources
                                                };
                                              }
                                              return module;
                                            });
                                            
                                            setCourseData({
                                              ...courseData,
                                              modules: updatedModules
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </CardContent>
                                  <CardFooter>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        const updatedModules = courseData.modules.map(module => {
                                          if (module.id === currentModule.id) {
                                            return {
                                              ...module,
                                              resources: module.resources.filter(res => res.id !== resource.id)
                                            };
                                          }
                                          return module;
                                        });
                                        
                                        setCourseData({
                                          ...courseData,
                                          modules: updatedModules
                                        });
                                      }}
                                    >
                                      Delete Resource
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-4 border rounded-md text-muted-foreground">
                              No resources added yet
                            </div>
                          )}
                          
                          <Button onClick={() => addResource(currentModule.id)}>
                            Add Resource
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground mb-4">No module selected or no modules exist.</p>
                      <Button onClick={addNewModule}>Create First Module</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
