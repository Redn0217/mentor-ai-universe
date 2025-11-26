import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TechnologyCard } from '@/components/technologies/TechnologyCard';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCourseIcon } from '@/utils/courseIcons';
import { fetchCourses } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  color: string;
  icon?: string;
  difficulty_level?: string;
  estimated_duration_hours?: number;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
  tutor?: {
    name: string;
    avatar: string;
    bio?: string;
  };
  modules_count?: number;
  lessons_count?: number;
  exercises_count?: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();

      console.log('📚 Fetched courses:', data);
      console.log('📚 Course slugs:', data.map((c: Course) => c.slug));

      // Filter only published courses for the main website
      const publishedCourses = data.filter((course: Course) => course.is_published !== false);

      setCourses(publishedCourses);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.difficulty_level === filter;
  });

  const featuredCourses = courses.filter(course => course.is_featured);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Animated Background Elements - matching main website */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#007c87]/30 to-[#007c87]/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-bl from-[#f15a29]/30 to-[#f15a29]/10 rounded-full blur-3xl animate-first"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#007c87]/15 via-transparent to-[#f15a29]/15 rounded-full blur-3xl animate-second"></div>
          </div>

          <div className="relative max-w-7xl mx-auto text-center z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Explore Our <span className="bg-gradient-to-r from-[#007c87] to-[#f15a29] bg-clip-text text-transparent">Courses</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Master new skills with our comprehensive courses. Learn from expert tutors and build real-world projects.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-[#007c87] to-[#f15a29] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Courses ({courses.length})
              </button>
              <button
                onClick={() => setFilter('beginner')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === 'beginner'
                    ? 'bg-gradient-to-r from-[#007c87] to-[#00a8b5] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setFilter('intermediate')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === 'intermediate'
                    ? 'bg-gradient-to-r from-[#f15a29] to-[#ff7a50] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Intermediate
              </button>
              <button
                onClick={() => setFilter('advanced')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === 'advanced'
                    ? 'bg-gradient-to-r from-[#007c87] to-[#f15a29] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Advanced
              </button>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        {featuredCourses.length > 0 && (
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                ⭐ Featured Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCourses.map((course) => (
                  <TechnologyCard
                    key={course.id}
                    title={course.title}
                    description={course.short_description || course.description}
                    slug={course.slug}
                    color={course.color}
                    icon={getCourseIcon(course.slug)}
                    modules={course.modules_count || 0}
                    lessons={course.lessons_count || 0}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Courses Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {filter === 'all' ? 'All Courses' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Courses`}
            </h2>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading courses...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredCourses.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">No courses found</p>
                <p className="text-gray-500">
                  {filter !== 'all' 
                    ? `No ${filter} courses available at the moment.`
                    : 'Check back soon for new courses!'}
                </p>
              </div>
            )}

            {/* Courses Grid */}
            {!loading && !error && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <TechnologyCard
                    key={course.id}
                    title={course.title}
                    description={course.short_description || course.description}
                    slug={course.slug}
                    color={course.color}
                    icon={getCourseIcon(course.slug)}
                    modules={course.modules_count || 0}
                    lessons={course.lessons_count || 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        {!loading && !error && courses.length > 0 && (
          <section className="py-16 px-4 bg-gradient-to-r from-[#007c87] to-[#f15a29]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <div className="text-4xl font-bold mb-2">{courses.length}</div>
                  <div className="text-white/80">Total Courses</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {courses.reduce((sum, course) => sum + (course.modules_count || 0), 0)}
                  </div>
                  <div className="text-white/80">Modules</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {courses.reduce((sum, course) => sum + (course.lessons_count || 0), 0)}
                  </div>
                  <div className="text-white/80">Lessons</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {courses.reduce((sum, course) => sum + (course.exercises_count || 0), 0)}
                  </div>
                  <div className="text-white/80">Exercises</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - Only show if not logged in */}
        {!user && (
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of students already learning with our expert tutors.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-[#007c87] to-[#f15a29] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-[#007c87] hover:text-[#007c87] transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;

