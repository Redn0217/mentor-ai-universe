
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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

// Course type definition
interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  modules: number;
  lastUpdated: string;
}

// Fetch courses from API
const fetchCourses = async (): Promise<CourseListItem[]> => {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Fallback to sample data for development
    return getMockCourses();
  }
};

// Delete course via API
const deleteCourse = async (slug: string): Promise<void> => {
  try {
    const response = await fetch(`/api/courses/${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete course');
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Mock data for development
const getMockCourses = (): CourseListItem[] => {
  return [
    {
      id: '1',
      slug: 'python',
      title: 'Python',
      description: 'Learn Python programming from basics to advanced concepts with practical exercises.',
      color: '#3776AB',
      modules: 8,
      lastUpdated: '2023-05-15'
    },
    {
      id: '2',
      slug: 'devops',
      title: 'DevOps',
      description: 'Master continuous integration, delivery, and deployment practices.',
      color: '#EE3424',
      modules: 6,
      lastUpdated: '2023-06-20'
    },
    {
      id: '3',
      slug: 'cloud',
      title: 'Cloud Computing',
      description: 'Learn to deploy and manage applications on major cloud platforms.',
      color: '#4285F4',
      modules: 7,
      lastUpdated: '2023-07-05'
    },
    {
      id: '4',
      slug: 'linux',
      title: 'Linux',
      description: 'Master Linux administration, shell scripting, and system configuration.',
      color: '#FCC624',
      modules: 5,
      lastUpdated: '2023-04-12'
    },
    {
      id: '5',
      slug: 'networking',
      title: 'Networking',
      description: 'Understand network protocols, configuration, and troubleshooting.',
      color: '#00BCF2',
      modules: 6,
      lastUpdated: '2023-08-30'
    },
    {
      id: '6',
      slug: 'ai',
      title: 'AI & Machine Learning',
      description: 'Explore artificial intelligence concepts, machine learning algorithms, and their applications.',
      color: '#9B30FF',
      modules: 8,
      lastUpdated: '2023-09-15'
    }
  ];
};

export default function CoursesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
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
                              onClick={() => navigate(`/tech/${course.slug}`)}
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
    </MainLayout>
  );
}
