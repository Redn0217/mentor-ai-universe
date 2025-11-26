
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/adminAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { fetchCourses, deleteCourse } from '@/services/apiService';
import { AICourseGeneratorModal } from '@/components/admin/AICourseGeneratorModal';
import { Sparkles } from 'lucide-react';

export default function CoursesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
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
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate('/');
      } else {
        setIsCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [user, navigate, toast]);

  // Fetch courses data
  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle course deletion
  const handleDeleteCourse = async (slug: string) => {
    if (window.confirm(`Are you sure you want to delete the ${slug} course?`)) {
      try {
        await deleteCourse(slug);
        toast({
          title: "Course Deleted",
          description: `The ${slug} course has been deleted successfully.`
        });
        refetch(); // Refresh the courses list
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the course. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-gray-600">Manage and update your technology courses</p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search courses..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              onClick={() => setShowAIModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create with AI
            </Button>
            <Button onClick={() => navigate('/admin/courses/new')}>
              Add New Course
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>View and manage all available technology courses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-16 w-16 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-lg text-red-600 mb-4">Error loading courses</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-lg mb-4">No courses found</p>
                <Button onClick={() => navigate('/admin/courses/new')}>
                  Create First Course
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Modules</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: course.color }}
                          ></div>
                        </TableCell>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.slug}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {course.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{course.modules}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteCourse(course.slug)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Course Generator Modal */}
      <AICourseGeneratorModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
      />
    </MainLayout>
  );
}
