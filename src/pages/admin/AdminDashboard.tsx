import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/adminAuth';
import { fetchCourses } from '@/services/apiService';
import {
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  BarChart3,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const adminStatus = await isAdmin(user);

      if (!adminStatus) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate('/');
      } else {
        setIsCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [user, navigate, toast]);

  // Fetch courses data for statistics
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  // Calculate statistics
  const totalCourses = courses.length;
  const totalModules = courses.reduce((sum, course) => sum + (course.modules_count || 0), 0);
  const totalLessons = courses.reduce((sum, course) => sum + (course.lessons_count || 0), 0);
  const totalExercises = courses.reduce((sum, course) => sum + (course.exercises_count || 0), 0);

  const stats = [
    {
      title: 'Total Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Active courses'
    },
    {
      title: 'Total Modules',
      value: totalModules,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Across all courses'
    },
    {
      title: 'Total Lessons',
      value: totalLessons,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Learning content'
    },
    {
      title: 'Total Exercises',
      value: totalExercises,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Practice activities'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Courses',
      description: 'View, edit, and delete courses',
      icon: BookOpen,
      action: () => navigate('/admin/courses'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create New Course',
      description: 'Add a new course to the platform',
      icon: Plus,
      action: () => navigate('/admin/courses/new'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Edit Content',
      description: 'Modify existing course content',
      icon: Edit,
      action: () => navigate('/admin/courses'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Settings',
      description: 'Configure admin settings',
      icon: Settings,
      action: () => toast({ title: 'Coming Soon', description: 'Settings page is under development' }),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  if (isCheckingAdmin) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying admin access...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your courses, modules, and content</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {isLoading ? '...' : stat.value}
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`h-auto flex flex-col items-start p-6 ${action.color} text-white`}
                >
                  <action.icon className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-white/80 text-left">{action.description}</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Courses</CardTitle>
                <CardDescription>Latest updated courses</CardDescription>
              </div>
              <Button onClick={() => navigate('/admin/courses')} variant="outline">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No courses available</p>
                <Button onClick={() => navigate('/admin/courses/new')}>
                  Create Your First Course
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: course.color }}
                      >
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-gray-500">
                          {course.modules_count || 0} modules · {course.lessons_count || 0} lessons
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/course/${course.slug}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/courses/${course.slug}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

