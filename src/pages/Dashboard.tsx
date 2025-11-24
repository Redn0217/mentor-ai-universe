
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProgressTracker } from '@/components/dashboard/ProgressTracker';
import { Progress as UIProgress } from '@/components/ui/progress';
import { enrollmentService, EnrolledCourse } from '@/services/enrollmentService';
import { getCourseIcon } from '@/utils/courseIcons';
import { BookOpen, Flame, LogOut, Award, MessageSquare, Users, Calendar, PlayCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Fetch real data from database
  const progress: any[] = [];
  const certifications: any[] = [];

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const courses = await enrollmentService.getEnrolledCourses(user.id);
        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  // Get user display name or email
  const userDisplayName = user?.email ? user.email.split('@')[0] : 'Learner';

  return (
    <MainLayout>
      <div className="px-4 py-8 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {userDisplayName}
            </p>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Progress tracking section */}
            <div className="grid gap-6 md:grid-cols-2">
              {progress.length > 0 ? (
                <ProgressTracker skills={progress} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Track your learning journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Start learning to see your progress here.</p>
                    <Button
                      onClick={() => navigate('/courses')}
                      className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <BookOpen className="w-4 h-4" />
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Learning Streaks</CardTitle>
                  <CardDescription>Your consistent learning progress</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground mb-4">Start learning to build your streak!</p>
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                    onClick={() => navigate('/courses')}
                  >
                    <Flame className="w-4 h-4" />
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">No recent activity yet. Start learning to see your progress here!</p>
              </CardContent>
            </Card>

            {/* Recommended next steps */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Begin your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Explore our courses and start learning today!</p>
                <Button
                  onClick={() => navigate('/courses')}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Search className="w-4 h-4" />
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">My Courses</h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map(course => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${course.color}20` }}>
                              <div className="h-6 w-6" style={{ color: course.color }}>
                                {getCourseIcon(course.slug)}
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{course.title}</CardTitle>
                              {course.tutor_name && (
                                <CardDescription className="text-xs mt-1">
                                  {course.tutor_name}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {course.short_description || course.description}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{course.completion_percentage}%</span>
                            </div>
                            <UIProgress value={course.completion_percentage} className="h-2" />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                              onClick={() => navigate(`/course/${course.slug}`)}
                            >
                              <PlayCircle className="w-4 h-4" />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed flex flex-col items-center justify-center p-12">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">Start your learning journey by enrolling in a course tailored to your goals</p>
                  <Button
                    onClick={() => navigate('/courses')}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <BookOpen className="w-5 h-5" />
                    Browse Courses
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="certifications">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Certifications</h2>

              {certifications.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certifications.map(cert => (
                    <Card key={cert.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <CardDescription>{cert.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${cert.status === 'completed' ? 'bg-green-100 text-green-800' :
                            cert.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {cert.status === 'completed' ? 'Completed' :
                            cert.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                        </div>

                        <div className="mt-4">
                          <Button
                            size="sm"
                            disabled={cert.status !== 'completed'}
                            variant={cert.status === 'completed' ? 'default' : 'outline'}
                          >
                            {cert.status === 'completed' ? 'View Certificate' :
                              cert.status === 'in-progress' ? 'Continue' : 'Start'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed flex flex-col items-center justify-center p-12">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Certifications Yet</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">Complete courses to earn certifications and showcase your skills</p>
                  <Button
                    onClick={() => navigate('/certifications')}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg"
                  >
                    <Award className="w-5 h-5" />
                    View Available Certifications
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Community</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forums</CardTitle>
                  <CardDescription>Connect with other learners and share knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Join our vibrant community to ask questions and share your projects.</p>
                  <Button
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Browse Forums
                  </Button>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Groups</CardTitle>
                    <CardDescription>Learn together with peers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">No study groups available yet. Check back soon!</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Webinars and workshops</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">No upcoming events at the moment. Stay tuned!</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
