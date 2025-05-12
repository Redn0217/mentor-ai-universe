
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProgressTracker } from '@/components/dashboard/ProgressTracker';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in a real application, this would come from a database
  const mockProgress = [
    {
      name: 'JavaScript',
      progress: 65,
      level: 'intermediate' as const,
      lastPracticed: '2 days ago'
    },
    {
      name: 'React',
      progress: 42,
      level: 'beginner' as const,
      lastPracticed: '1 week ago'
    },
    {
      name: 'Python',
      progress: 78,
      level: 'advanced' as const,
      lastPracticed: 'Yesterday'
    },
    {
      name: 'TypeScript',
      progress: 35,
      level: 'beginner' as const,
      lastPracticed: '3 days ago'
    }
  ];

  const mockCertifications = [
    { id: 'cert1', name: 'JavaScript Foundations', date: 'May 15, 2023', status: 'completed' },
    { id: 'cert2', name: 'React Developer', date: 'In progress', status: 'in-progress' },
    { id: 'cert3', name: 'Python for Data Science', date: 'Not started', status: 'not-started' }
  ];

  const mockEnrolledCourses = [
    { id: 'course1', name: 'Advanced React Patterns', progress: 65, instructor: 'Jane Smith' },
    { id: 'course2', name: 'Full Stack Development', progress: 32, instructor: 'John Doe' },
    { id: 'course3', name: 'Data Structures & Algorithms', progress: 18, instructor: 'Alex Johnson' }
  ];

  return (
    <MainLayout>
      <div className="px-4 py-8 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.email || 'Learner'}
            </p>
          </div>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
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
              <ProgressTracker skills={mockProgress} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Streaks</CardTitle>
                  <CardDescription>Your consistent learning progress</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-12 rounded-md ${
                          i % 2 === 0 || i === 6 ? 'bg-primary' : 'bg-gray-200'
                        } flex items-center justify-center`}
                      >
                        <span className={`text-xs font-medium ${i % 2 === 0 || i === 6 ? 'text-white' : ''}`}>
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current streak: <span className="font-medium">5 days</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Longest streak: <span className="font-medium">14 days</span>
                  </p>
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
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1.1 0 2 .9 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4c0-1.1.9-2 2-2h2Z"/><path d="M12 17.5v-5"/><path d="m8.8 18.4-5.4 1.8a1 1 0 0 1-1.3-1.3l1.8-5.4c.2-.5.6-.8 1.1-.9 3.3-.4 5.9-3 5.9-6.2V4"/><path d="m15.2 18.4 5.4 1.8a1 1 0 0 0 1.3-1.3l-1.8-5.4c-.2-.5-.6-.8-1.1-.9-3.3-.4-5.9-3-5.9-6.2V4"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completed JavaScript Challenge</p>
                      <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Started Python for Data Science course</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 4:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 19h8"/><path d="M8 5h8a7 7 0 0 1 0 14H8A7 7 0 0 1 8 5Z"/><circle cx="16" cy="12" r="2"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Earned "Quick Learner" badge</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recommended next steps */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
                <CardDescription>Personalized recommendations to continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-medium mb-2">Complete React Basics</h3>
                    <p className="text-sm text-muted-foreground mb-4">Finish your React fundamentals to unlock advanced courses.</p>
                    <Button size="sm" variant="outline">Continue Learning</Button>
                  </div>
                  
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                    <h3 className="font-medium mb-2">Try TypeScript Challenge</h3>
                    <p className="text-sm text-muted-foreground mb-4">Test your TypeScript skills with our new challenge.</p>
                    <Button size="sm" variant="outline">Start Challenge</Button>
                  </div>
                  
                  <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium mb-2">Join Python Study Group</h3>
                    <p className="text-sm text-muted-foreground mb-4">Connect with others learning Python every Wednesday.</p>
                    <Button size="sm" variant="outline">Join Group</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">My Courses</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockEnrolledCourses.map(course => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>Instructor: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">Progress:</div>
                        <Progress value={course.progress} className="h-2 flex-1" />
                        <div className="text-sm">{course.progress}%</div>
                      </div>
                      <div className="mt-4">
                        <Button size="sm">Continue Learning</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-dashed flex flex-col items-center justify-center p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </div>
                  <h3 className="font-medium mb-2">Explore New Courses</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">Discover courses tailored to your learning goals</p>
                  <Button variant="outline">Browse Catalog</Button>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="certifications">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Certifications</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockCertifications.map(cert => (
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
                  <Button>Browse Forums</Button>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Groups</CardTitle>
                    <CardDescription>Learn together with peers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h3 className="font-medium">React Study Group</h3>
                        <p className="text-sm text-muted-foreground">Thursdays at 7 PM</p>
                        <Button size="sm" variant="outline" className="mt-2">Join</Button>
                      </div>
                      <div className="border-b pb-3">
                        <h3 className="font-medium">Python for Beginners</h3>
                        <p className="text-sm text-muted-foreground">Tuesdays at 6 PM</p>
                        <Button size="sm" variant="outline" className="mt-2">Join</Button>
                      </div>
                      <div>
                        <h3 className="font-medium">JavaScript Deep Dive</h3>
                        <p className="text-sm text-muted-foreground">Saturdays at 10 AM</p>
                        <Button size="sm" variant="outline" className="mt-2">Join</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Webinars and workshops</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <h3 className="font-medium">Web Performance Optimization</h3>
                        <p className="text-sm text-muted-foreground">May 25, 2023 • 1 PM</p>
                        <Button size="sm" variant="outline" className="mt-2">Register</Button>
                      </div>
                      <div className="border-b pb-3">
                        <h3 className="font-medium">Career in Tech Panel Discussion</h3>
                        <p className="text-sm text-muted-foreground">June 2, 2023 • 5 PM</p>
                        <Button size="sm" variant="outline" className="mt-2">Register</Button>
                      </div>
                      <div>
                        <h3 className="font-medium">Building AI Applications</h3>
                        <p className="text-sm text-muted-foreground">June 10, 2023 • 11 AM</p>
                        <Button size="sm" variant="outline" className="mt-2">Register</Button>
                      </div>
                    </div>
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
