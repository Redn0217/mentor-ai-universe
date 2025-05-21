
import { supabase } from '@/lib/supabase';

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: Module[];
  tutor: {
    name: string;
    avatar: string;
  };
  lastUpdated: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exercises: Exercise[];
  resources: Resource[];
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  duration: number;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
};

export type Resource = {
  id: string;
  title: string;
  type: string;
  url: string;
};

// Function to get all courses (simplified for list view)
export const getCourses = async (): Promise<Partial<Course>[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, slug, title, description, color, last_updated');

    if (error) {
      console.error('Error fetching courses from Supabase:', error);
      console.warn('Falling back to local data');

      // Return sample data as fallback
      return [
        {
          id: "python",
          slug: "python",
          title: "Python",
          description: "Learn Python programming from basics to advanced concepts with practical exercises.",
          color: "#3776AB",
          lastUpdated: "2023-05-15",
          modules: [] as Module[],
        },
        {
          id: "javascript",
          slug: "javascript",
          title: "JavaScript",
          description: "Master modern JavaScript with practical web development projects.",
          color: "#F7DF1E",
          lastUpdated: "2023-06-10",
          modules: [] as Module[],
        }
      ];
    }

    return data.map(course => ({
      ...course,
      lastUpdated: course.last_updated,
      modules: [] as Module[], // Fix: Use empty array instead of number
    }));
  } catch (error) {
    console.error('Error in getCourses:', error);
    console.warn('Falling back to local data');

    // Return sample data as fallback
    return [
      {
        id: "python",
        slug: "python",
        title: "Python",
        description: "Learn Python programming from basics to advanced concepts with practical exercises.",
        color: "#3776AB",
        lastUpdated: "2023-05-15",
        modules: [] as Module[],
      }
    ];
  }
};

// Function to get a specific course by slug
export const getCourse = async (slug: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching course with slug ${slug} from Supabase:`, error);
      console.warn('Falling back to local data');

      // Return sample data as fallback based on the requested slug
      if (slug === 'python') {
        return {
          id: "python",
          slug: "python",
          title: "Python",
          description: "Learn Python programming from basics to advanced concepts with practical exercises.",
          icon: "code",
          color: "#3776AB",
          modules: [
            {
              id: "module1",
              title: "Getting Started",
              description: "Learn the basics and set up your development environment.",
              lessons: [
                {
                  id: "lesson1",
                  title: "Introduction",
                  content: "Overview of the course and what you will learn.",
                  duration: 15
                }
              ],
              exercises: [],
              resources: []
            }
          ],
          tutor: {
            name: "Dr. Ana Python",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
          },
          lastUpdated: "2023-05-15"
        };
      } else if (slug === 'javascript') {
        return {
          id: "javascript",
          slug: "javascript",
          title: "JavaScript",
          description: "Master modern JavaScript with practical web development projects.",
          icon: "code",
          color: "#F7DF1E",
          modules: [
            {
              id: "module1",
              title: "JavaScript Fundamentals",
              description: "Learn the core concepts of JavaScript programming.",
              lessons: [
                {
                  id: "lesson1",
                  title: "Introduction to JavaScript",
                  content: "Overview of JavaScript and its role in web development.",
                  duration: 20
                }
              ],
              exercises: [],
              resources: []
            }
          ],
          tutor: {
            name: "John Script",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          },
          lastUpdated: "2023-06-10"
        };
      }

      // For any other slug, return null
      return null;
    }

    // If we have data from Supabase, make sure to convert last_updated to lastUpdated
    if (data.last_updated && !data.lastUpdated) {
      data.lastUpdated = data.last_updated;
    }

    return data;
  } catch (error) {
    console.error(`Error in getCourse for slug ${slug}:`, error);
    console.warn('Falling back to local data');

    // Return a generic sample course as fallback
    return {
      id: slug,
      slug: slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      description: `Learn ${slug} from basics to advanced concepts.`,
      icon: "code",
      color: "#3776AB",
      modules: [
        {
          id: "module1",
          title: "Getting Started",
          description: "Introduction to the basics.",
          lessons: [
            {
              id: "lesson1",
              title: "Introduction",
              content: "Overview of the course.",
              duration: 15
            }
          ],
          exercises: [],
          resources: []
        }
      ],
      tutor: {
        name: "Course Instructor",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}`
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
};

// Function to create a new course
export const createCourse = async (course: Course): Promise<Course> => {
  try {
    // Convert lastUpdated field to last_updated for Supabase
    const courseData = {
      ...course,
      last_updated: course.lastUpdated,
    };
    delete courseData.lastUpdated; // Remove the original lastUpdated field

    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw error;
    }

    // Convert back to our app format
    return {
      ...data,
      lastUpdated: data.last_updated,
    };
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
};

// Function to update an existing course
export const updateCourse = async (course: Course): Promise<Course> => {
  try {
    // Convert lastUpdated field to last_updated for Supabase
    const courseData = {
      ...course,
      last_updated: course.lastUpdated,
    };
    delete courseData.lastUpdated; // Remove the original lastUpdated field

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('slug', course.slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      throw error;
    }

    // Convert back to our app format
    return {
      ...data,
      lastUpdated: data.last_updated,
    };
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
};

// Function to delete a course
export const deleteCourse = async (slug: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Error deleting course:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    throw error;
  }
};

// Function to migrate courses data from JSON to Supabase
export const migrateCoursesToSupabase = async (coursesData: Course[]): Promise<void> => {
  try {
    console.log('Starting migration of courses to Supabase...');

    // First, check if migration is needed by checking if courses exist
    console.log('Checking if courses already exist in Supabase...');

    // Use a simpler query to check if courses exist
    const { data, error: countError } = await supabase
      .from('courses')
      .select('id')
      .limit(5);  // Just get a few records to check

    if (countError) {
      console.error('Error checking if courses exist:', countError);
      // Don't throw here, we'll try to continue with the migration
      console.log('Continuing with migration despite error...');
    } else if (data && data.length > 0) {
      console.log(`Courses already exist in Supabase (${data.length} found), skipping migration`);
      return;
    } else {
      console.log('No existing courses found, proceeding with migration');
    }

    if (!coursesData || coursesData.length === 0) {
      console.warn('No courses data provided for migration');
      return;
    }

    console.log(`Preparing to migrate ${coursesData.length} courses to Supabase...`);

    // Convert each course to the format expected by Supabase
    const supabaseCoursesData = coursesData.map(course => {
      // Create a new object with the correct field names for Supabase
      const supabaseCourse = {
        ...course,
        last_updated: course.lastUpdated,
      };
      // Remove the lastUpdated field to avoid duplicate fields
      delete supabaseCourse.lastUpdated;
      return supabaseCourse;
    });

    // Log the first course data for debugging
    console.log('Sample course data for migration:', JSON.stringify(supabaseCoursesData[0], null, 2));

    // Insert all courses
    console.log('Inserting courses into Supabase...');
    const { error } = await supabase
      .from('courses')
      .insert(supabaseCoursesData);

    if (error) {
      console.error('Error migrating courses to Supabase:', error);

      // Try inserting one by one if bulk insert fails
      console.log('Attempting to insert courses one by one...');
      let successCount = 0;

      for (const course of supabaseCoursesData) {
        try {
          const { error: singleInsertError } = await supabase
            .from('courses')
            .insert([course]);

          if (singleInsertError) {
            console.error(`Error inserting course ${course.id}:`, singleInsertError);
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Exception inserting course ${course.id}:`, err);
        }
      }

      if (successCount > 0) {
        console.log(`Successfully migrated ${successCount} out of ${supabaseCoursesData.length} courses`);
      } else {
        throw new Error('Failed to migrate any courses');
      }
    } else {
      console.log(`Successfully migrated all ${supabaseCoursesData.length} courses to Supabase`);
    }
  } catch (error) {
    console.error('Error in migrateCoursesToSupabase:', error);
    throw error;
  }
};
