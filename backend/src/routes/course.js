
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { supabase, checkSupabaseConnection } = require('../lib/supabase');

// Helper function to get course with full hierarchy
const getCourseWithHierarchy = async (courseSlug) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules:modules(
          *,
          lessons:lessons(
            *,
            exercises:exercises(*)
          ),
          exercises:exercises(*)
        )
      `)
      .eq('slug', courseSlug)
      .single();

    if (error) {
      console.error('Error fetching course hierarchy:', error);
      return null;
    }

    // Sort modules by order_index
    if (data && data.modules) {
      data.modules.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

      // Sort lessons within each module by order_index
      data.modules.forEach(module => {
        if (module.lessons) {
          module.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

          // Sort exercises within each lesson
          module.lessons.forEach(lesson => {
            if (lesson.exercises) {
              lesson.exercises.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            }
          });
        }

        // Sort module-level exercises
        if (module.exercises) {
          module.exercises.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }
      });
    }

    return data;
  } catch (error) {
    console.error('Exception fetching course hierarchy:', error);
    return null;
  }
};

// Helper function to get courses with counts
const getCoursesWithCounts = async () => {
  try {
    // Get courses with related data
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        slug,
        title,
        description,
        short_description,
        color,
        difficulty_level,
        estimated_duration_hours,
        tags,
        is_featured,
        tutor_name,
        tutor_avatar,
        updated_at,
        modules:modules(
          id,
          lessons:lessons(id),
          exercises:exercises(id)
        )
      `);

    if (error) {
      console.error('Error fetching courses with counts:', error);
      return null;
    }

    // Transform the data to include counts
    return data.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      color: course.color,
      difficulty_level: course.difficulty_level,
      estimated_duration_hours: course.estimated_duration_hours,
      tags: course.tags || [],
      is_featured: course.is_featured,
      tutor: {
        name: course.tutor_name || 'Course Instructor',
        avatar: course.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
      },
      modules_count: course.modules?.length || 0,
      lessons_count: course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0,
      exercises_count: course.modules?.reduce((total, module) => total + (module.exercises?.length || 0), 0) || 0,
      updated_at: course.updated_at
    }));
  } catch (error) {
    console.error('Exception fetching courses with counts:', error);
    return null;
  }
};

// Path to the mock data file (fallback)
const dataPath = path.join(__dirname, '../data/courses.json');
console.log('Data file path:', dataPath);

// Ensure the data directory exists
const ensureDataDirExists = async () => {
  const dir = path.dirname(dataPath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
};

// Removed default courses - all courses should come from database

// Initialize data
const initializeData = async () => {
  await ensureDataDirExists();
  // Removed createDefaultCoursesIfNeeded - all courses should come from database
};

// Read all courses (updated for new structure)
const readCourses = async () => {
  try {
    // First try to get data from Supabase with new structure
    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      console.log('Reading courses from Supabase (new structure)...');

      // Try new structure first
      const coursesWithCounts = await getCoursesWithCounts();
      if (coursesWithCounts && coursesWithCounts.length > 0) {
        console.log(`Found ${coursesWithCounts.length} courses in new structure`);
        return coursesWithCounts;
      }

      // Fallback to old structure if new doesn't exist
      console.log('Trying old structure...');
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        console.error('Error fetching courses from Supabase:', error);
        // Fall back to local file
      } else if (data && data.length > 0) {
        console.log(`Found ${data.length} courses in old structure`);
        // Convert from old Supabase format to app format
        return data.map(course => ({
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          color: course.color,
          modules_count: Array.isArray(course.modules) ? course.modules.length : 0,
          tutor: course.tutor || { name: 'Course Instructor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor' },
          updated_at: course.last_updated || course.updated_at || new Date().toISOString(),
          lastUpdated: course.last_updated || course.lastUpdated,
        }));
      } else {
        console.log('No courses found in Supabase, falling back to local file');
      }
    }

    // Fall back to local file
    console.log('Reading courses from local file...');
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      const courses = JSON.parse(data);
      console.log(`Found ${courses.length} courses in local file:`, courses.map(c => c.slug).join(', '));

      // Convert local file format to new API format
      return courses.map(course => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        color: course.color,
        modules_count: Array.isArray(course.modules) ? course.modules.length : 0,
        tutor: course.tutor || { name: 'Course Instructor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor' },
        updated_at: course.lastUpdated || new Date().toISOString(),
        lastUpdated: course.lastUpdated || new Date().toISOString().split('T')[0]
      }));
    } catch (fileError) {
      console.error('Error reading local file:', fileError);
      return [];
    }
  } catch (error) {
    console.error('Error reading courses data:', error);
    return [];
  }
};

// Read single course by slug (updated for new structure)
const readCourse = async (slug) => {
  try {
    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      console.log(`Reading course ${slug} from Supabase (new structure)...`);

      // Try new hierarchical structure first
      const hierarchicalCourse = await getCourseWithHierarchy(slug);
      if (hierarchicalCourse) {
        console.log(`Found course ${slug} in new structure`);

        return {
          id: hierarchicalCourse.id,
          slug: hierarchicalCourse.slug,
          title: hierarchicalCourse.title,
          description: hierarchicalCourse.description,
          short_description: hierarchicalCourse.short_description,
          icon: hierarchicalCourse.icon || 'code',
          color: hierarchicalCourse.color,
          difficulty_level: hierarchicalCourse.difficulty_level,
          estimated_duration_hours: hierarchicalCourse.estimated_duration_hours,
          learning_objectives: hierarchicalCourse.learning_objectives || [],
          tags: hierarchicalCourse.tags || [],
          modules: (hierarchicalCourse.modules || []).map(module => ({
            id: module.id,
            title: module.title,
            description: module.description,
            slug: module.slug,
            order_index: module.order_index,
            estimated_duration_minutes: module.estimated_duration_minutes,
            difficulty_level: module.difficulty_level,
            learning_objectives: module.learning_objectives || [],
            lessons: (module.lessons || []).map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              slug: lesson.slug,
              content: lesson.content,
              content_type: lesson.content_type,
              order_index: lesson.order_index,
              estimated_duration_minutes: lesson.estimated_duration_minutes,
              difficulty_level: lesson.difficulty_level,
              learning_objectives: lesson.learning_objectives || [],
              key_concepts: lesson.key_concepts || [],
              code_examples: lesson.code_examples || [],
              exercises: lesson.exercises || []
            })),
            exercises: module.exercises || [],
            resources: []
          })),
          tutor: {
            name: hierarchicalCourse.tutor_name || 'Course Instructor',
            avatar: hierarchicalCourse.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
            bio: hierarchicalCourse.tutor_bio
          },
          lastUpdated: hierarchicalCourse.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          created_at: hierarchicalCourse.created_at,
          updated_at: hierarchicalCourse.updated_at
        };
      }

      // Fallback to old structure
      console.log(`Trying old structure for course ${slug}...`);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error(`Error fetching course ${slug} from Supabase:`, error);
      } else if (data) {
        console.log(`Found course ${slug} in old structure`);
        return {
          ...data,
          lastUpdated: data.last_updated || data.lastUpdated,
        };
      }
    }

    // Fall back to local file
    console.log(`Reading course ${slug} from local file...`);
    const courses = await readCourses();
    const course = courses.find(course => course.slug === slug);

    if (course) {
      console.log(`Found course ${slug} in local file`);
      return course;
    }

    console.log(`Course ${slug} not found`);
    return null;
  } catch (error) {
    console.error(`Error reading course with slug ${slug}:`, error);
    return null;
  }
};

// Write courses data
const writeCourses = async (courses) => {
  try {
    // First try to write to Supabase
    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      console.log('Writing courses to Supabase...');

      // Convert from app format to Supabase format
      const supabaseData = courses.map(course => {
        // Create a new object with the correct field names for Supabase
        const supabaseCourse = {
          ...course,
          last_updated: course.lastUpdated,
        };
        // Remove the lastUpdated field to avoid conflicts
        delete supabaseCourse.lastUpdated;
        return supabaseCourse;
      });

      // Upsert data to Supabase
      const { error } = await supabase
        .from('courses')
        .upsert(supabaseData, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error writing courses to Supabase:', error);
        // Fall back to local file
      } else {
        console.log('Successfully wrote courses to Supabase');
      }
    }

    // Always write to local file as backup
    console.log('Writing courses to local file...');
    await fs.writeFile(dataPath, JSON.stringify(courses, null, 2));
  } catch (error) {
    console.error('Error writing courses data:', error);
    throw error;
  }
};

// Initialize data on server start
initializeData().catch(error => {
  console.error('Failed to initialize courses data:', error);
});

// GET database status (for debugging)
router.get('/db-status', async (req, res) => {
  try {
    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      // Get count from Supabase
      const { data, error, count } = await supabase
        .from('courses')
        .select('*', { count: 'exact' });

      return res.json({
        status: 'connected',
        database: 'Supabase',
        coursesCount: data?.length || 0,
        courses: data?.map(c => ({ id: c.id, slug: c.slug, title: c.title })) || []
      });
    }

    // Check local file
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      const courses = JSON.parse(data);
      return res.json({
        status: 'disconnected',
        database: 'Local File',
        coursesCount: courses.length,
        courses: courses.map(c => ({ id: c.id, slug: c.slug, title: c.title }))
      });
    } catch (fileError) {
      return res.json({
        status: 'error',
        database: 'None',
        coursesCount: 0,
        error: fileError.message
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all courses (updated for new structure)
router.get('/', async (req, res) => {
  try {
    const courses = await readCourses();

    // Return course list with proper structure
    const courseList = courses.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      color: course.color,
      difficulty_level: course.difficulty_level,
      estimated_duration_hours: course.estimated_duration_hours,
      tags: course.tags || [],
      is_featured: course.is_featured || false,
      tutor: course.tutor || {
        name: 'Course Instructor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
      },
      modules_count: course.modules_count || (Array.isArray(course.modules) ? course.modules.length : 0),
      lessons_count: course.lessons_count || 0,
      exercises_count: course.exercises_count || 0,
      updated_at: course.updated_at || course.lastUpdated || new Date().toISOString(),
      // Keep backward compatibility
      modules: course.modules_count || (Array.isArray(course.modules) ? course.modules.length : 0),
      lastUpdated: course.lastUpdated || course.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]
    }));

    res.json(courseList);
  } catch (error) {
    console.error('Error in GET /courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET a template for a new course
router.get('/new', async (req, res) => {
  try {
    // Return a template for a new course
    const newCourseTemplate = {
      id: 'new',
      slug: 'new-course', // Default slug that will be changed by the user
      title: 'New Course',
      description: 'Course description goes here',
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
            }
          ],
          exercises: [],
          resources: []
        }
      ],
      tutor: {
        name: 'Course Instructor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    res.json(newCourseTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course template' });
  }
});

// GET a specific course by slug
router.get('/:slug', async (req, res) => {
  try {
    const course = await readCourse(req.params.slug);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST a new course
router.post('/', async (req, res) => {
  try {
    const newCourse = req.body;
    console.log('📝 Creating new course:', newCourse.title);

    // Check if Supabase is connected
    const isConnected = await checkSupabaseConnection();
    console.log('🔌 Supabase connection status:', isConnected ? 'CONNECTED' : 'DISCONNECTED');

    if (isConnected) {
      console.log('💾 Saving to Supabase database...');
      // Generate slug if not provided
      let slug = newCourse.slug;
      if (!slug || slug === 'new-course' || slug === 'new') {
        const baseSlug = newCourse.title
          ? newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : 'course';

        // Check for unique slug in Supabase
        let counter = 1;
        slug = baseSlug;
        let exists = true;

        while (exists) {
          const { data } = await supabase
            .from('courses')
            .select('id')
            .eq('slug', slug)
            .single();

          if (!data) {
            exists = false;
          } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }
      } else {
        // Check if slug already exists
        const { data: existingCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('slug', slug)
          .single();

        if (existingCourse) {
          return res.status(400).json({ error: 'Course with this slug already exists' });
        }
      }

      // Prepare course data for Supabase
      const courseData = {
        slug: slug,
        title: newCourse.title || 'New Course',
        description: newCourse.description || '',
        short_description: newCourse.short_description || newCourse.description?.substring(0, 150) || '',
        color: newCourse.color || '#3776AB',
        difficulty_level: newCourse.difficulty_level || 'beginner',
        estimated_duration_hours: newCourse.estimated_duration_hours || 10,
        tags: newCourse.tags || [],
        is_featured: newCourse.is_featured || false,
        is_published: newCourse.is_published !== undefined ? newCourse.is_published : true,
        tutor_name: newCourse.tutor?.name || newCourse.tutor_name || 'Course Instructor',
        tutor_avatar: newCourse.tutor?.avatar || newCourse.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        tutor_bio: newCourse.tutor?.bio || newCourse.tutor_bio || '',
        prerequisites: newCourse.prerequisites || [],
        learning_objectives: newCourse.learning_objectives || []
      };

      // Insert into Supabase
      console.log('📤 Inserting course into Supabase with slug:', slug);
      console.log('📦 Course data being inserted:', JSON.stringify(courseData, null, 2));

      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating course in Supabase:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        console.error('❌ Course data that failed:', JSON.stringify(courseData, null, 2));
        return res.status(500).json({
          error: 'Failed to create course in database',
          details: error.message,
          hint: error.hint,
          code: error.code
        });
      }

      console.log('✅ Course created successfully in Supabase!', { id: data.id, slug: data.slug, title: data.title });

      // If course has modules, create them too
      if (newCourse.modules && Array.isArray(newCourse.modules)) {
        for (let i = 0; i < newCourse.modules.length; i++) {
          const module = newCourse.modules[i];
          const { data: moduleData, error: moduleError } = await supabase
            .from('modules')
            .insert({
              course_id: data.id,
              title: module.title || `Module ${i + 1}`,
              description: module.description || '',
              slug: module.slug || module.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `module-${i + 1}`,
              order_index: i,
              estimated_duration_minutes: module.estimated_duration_minutes || 0
            })
            .select()
            .single();

          if (moduleError) {
            console.error('Error creating module:', moduleError);
          }
        }
      }

      return res.status(201).json({
        ...data,
        tutor: {
          name: data.tutor_name,
          avatar: data.tutor_avatar,
          bio: data.tutor_bio
        }
      });
    }

    // Fallback to local file system
    console.log('⚠️ Using local file system fallback');
    const courses = await readCourses();

    // Ensure the course has a slug
    if (!newCourse.slug || newCourse.slug === 'new-course' || newCourse.slug === 'new') {
      // Generate a slug from the title if not provided or if it's the default
      const baseSlug = newCourse.title
        ? newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : 'course';

      // Make sure the slug is unique
      let slug = baseSlug;
      let counter = 1;
      while (courses.some(course => course.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      newCourse.slug = slug;
    } else {
      // Check if the provided slug already exists
      if (courses.some(course => course.slug === newCourse.slug)) {
        return res.status(400).json({ error: 'Course with this slug already exists' });
      }
    }

    // If the ID is 'new', generate a proper ID
    if (newCourse.id === 'new') {
      newCourse.id = newCourse.slug; // Use the slug as the ID
    }

    // Add creation date
    newCourse.lastUpdated = new Date().toISOString().split('T')[0];

    courses.push(newCourse);
    await writeCourses(courses);

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT (update) a course
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const updatedCourse = req.body;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      // Prepare update data
      const updateData = {
        title: updatedCourse.title,
        description: updatedCourse.description,
        short_description: updatedCourse.short_description || updatedCourse.description?.substring(0, 150),
        color: updatedCourse.color,
        difficulty_level: updatedCourse.difficulty_level,
        estimated_duration_hours: updatedCourse.estimated_duration_hours,
        tags: updatedCourse.tags || [],
        is_featured: updatedCourse.is_featured,
        is_published: updatedCourse.is_published,
        tutor_name: updatedCourse.tutor?.name || updatedCourse.tutor_name,
        tutor_avatar: updatedCourse.tutor?.avatar || updatedCourse.tutor_avatar,
        tutor_bio: updatedCourse.tutor?.bio || updatedCourse.tutor_bio,
        prerequisites: updatedCourse.prerequisites || [],
        learning_objectives: updatedCourse.learning_objectives || [],
        updated_at: new Date().toISOString()
      };

      // Update in Supabase
      const { data, error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('slug', slug)
        .select()
        .single();

      if (error) {
        console.error('Error updating course in Supabase:', error);
        return res.status(500).json({ error: 'Failed to update course in database' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Course not found' });
      }

      return res.json({
        ...data,
        tutor: {
          name: data.tutor_name,
          avatar: data.tutor_avatar,
          bio: data.tutor_bio
        }
      });
    }

    // Fallback to local file system
    const courses = await readCourses();

    const index = courses.findIndex(course => course.slug === slug);

    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update the course
    updatedCourse.lastUpdated = new Date().toISOString().split('T')[0];
    courses[index] = updatedCourse;

    await writeCourses(courses);

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE a course
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      // Delete from Supabase (cascade will delete related modules, lessons, exercises)
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('slug', slug);

      if (error) {
        console.error('Error deleting course from Supabase:', error);
        return res.status(500).json({ error: 'Failed to delete course from database' });
      }

      return res.status(200).json({ message: 'Course deleted successfully' });
    }

    // Fallback to local file system
    const courses = await readCourses();
    const filteredCourses = courses.filter(course => course.slug !== slug);

    if (filteredCourses.length === courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await writeCourses(filteredCourses);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// ==================== MODULE ROUTES ====================

// POST - Add a new module to a course
router.post('/:slug/modules', async (req, res) => {
  try {
    const { slug } = req.params;
    const newModule = req.body;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      // Get the course first
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .single();

      if (courseError || !course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Insert the new module
      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          title: newModule.title,
          description: newModule.description,
          slug: newModule.slug || newModule.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          order_index: newModule.order_index || 0,
          estimated_duration_minutes: newModule.estimated_duration_minutes || 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating module:', error);
        return res.status(500).json({ error: 'Failed to create module' });
      }

      return res.status(201).json(data);
    }

    // Fallback to local file
    const courses = await readCourses();
    const courseIndex = courses.findIndex(c => c.slug === slug);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!courses[courseIndex].modules) {
      courses[courseIndex].modules = [];
    }

    const moduleId = `module${courses[courseIndex].modules.length + 1}`;
    const module = {
      id: moduleId,
      title: newModule.title || 'New Module',
      description: newModule.description || '',
      lessons: [],
      exercises: [],
      resources: []
    };

    courses[courseIndex].modules.push(module);
    await writeCourses(courses);

    res.status(201).json(module);
  } catch (error) {
    console.error('Error adding module:', error);
    res.status(500).json({ error: 'Failed to add module' });
  }
});

// PUT - Update a module
router.put('/:slug/modules/:moduleId', async (req, res) => {
  try {
    const { slug, moduleId } = req.params;
    const updatedModule = req.body;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      const { data, error } = await supabase
        .from('modules')
        .update({
          title: updatedModule.title,
          description: updatedModule.description,
          slug: updatedModule.slug,
          order_index: updatedModule.order_index,
          estimated_duration_minutes: updatedModule.estimated_duration_minutes
        })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) {
        console.error('Error updating module:', error);
        return res.status(500).json({ error: 'Failed to update module' });
      }

      return res.json(data);
    }

    // Fallback to local file
    const courses = await readCourses();
    const courseIndex = courses.findIndex(c => c.slug === slug);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);

    if (moduleIndex === -1) {
      return res.status(404).json({ error: 'Module not found' });
    }

    courses[courseIndex].modules[moduleIndex] = {
      ...courses[courseIndex].modules[moduleIndex],
      ...updatedModule
    };

    await writeCourses(courses);

    res.json(courses[courseIndex].modules[moduleIndex]);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// DELETE - Remove a module
router.delete('/:slug/modules/:moduleId', async (req, res) => {
  try {
    const { slug, moduleId } = req.params;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) {
        console.error('Error deleting module:', error);
        return res.status(500).json({ error: 'Failed to delete module' });
      }

      return res.json({ message: 'Module deleted successfully' });
    }

    // Fallback to local file
    const courses = await readCourses();
    const courseIndex = courses.findIndex(c => c.slug === slug);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    courses[courseIndex].modules = courses[courseIndex].modules.filter(m => m.id !== moduleId);
    await writeCourses(courses);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// ==================== LESSON ROUTES ====================

// POST - Add a new lesson to a module
router.post('/:slug/modules/:moduleId/lessons', async (req, res) => {
  try {
    const { slug, moduleId } = req.params;
    const newLesson = req.body;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: newLesson.title,
          content: newLesson.content || '',
          description: newLesson.description || '',
          slug: newLesson.slug || newLesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          order_index: newLesson.order_index || 0,
          estimated_duration_minutes: newLesson.duration || newLesson.estimated_duration_minutes || newLesson.duration_minutes || 15,
          video_url: newLesson.videoUrl || newLesson.video_url,
          is_published: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating lesson:', error);
        return res.status(500).json({ error: 'Failed to create lesson' });
      }

      return res.status(201).json(data);
    }

    // Fallback to local file
    const courses = await readCourses();
    const courseIndex = courses.findIndex(c => c.slug === slug);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);

    if (moduleIndex === -1) {
      return res.status(404).json({ error: 'Module not found' });
    }

    if (!courses[courseIndex].modules[moduleIndex].lessons) {
      courses[courseIndex].modules[moduleIndex].lessons = [];
    }

    const lessonId = `lesson${courses[courseIndex].modules[moduleIndex].lessons.length + 1}`;
    const lesson = {
      id: lessonId,
      title: newLesson.title || 'New Lesson',
      content: newLesson.content || '',
      duration: newLesson.duration || 15,
      videoUrl: newLesson.videoUrl
    };

    courses[courseIndex].modules[moduleIndex].lessons.push(lesson);
    await writeCourses(courses);

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// PUT - Update a lesson
router.put('/:slug/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const { slug, moduleId, lessonId } = req.params;
    const updatedLesson = req.body;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      const { data, error } = await supabase
        .from('lessons')
        .update({
          title: updatedLesson.title,
          content: updatedLesson.content,
          description: updatedLesson.description,
          slug: updatedLesson.slug,
          order_index: updatedLesson.order_index,
          estimated_duration_minutes: updatedLesson.duration || updatedLesson.estimated_duration_minutes || updatedLesson.duration_minutes,
          video_url: updatedLesson.videoUrl || updatedLesson.video_url
        })
        .eq('id', lessonId)
        .select()
        .single();

      if (error) {
        console.error('Error updating lesson:', error);
        return res.status(500).json({ error: 'Failed to update lesson' });
      }

      return res.json(data);
    }

    // Fallback to local file
    const courses = await readCourses();
    const courseIndex = courses.findIndex(c => c.slug === slug);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);

    if (moduleIndex === -1) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lessonIndex = courses[courseIndex].modules[moduleIndex].lessons.findIndex(l => l.id === lessonId);

    if (lessonIndex === -1) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    courses[courseIndex].modules[moduleIndex].lessons[lessonIndex] = {
      ...courses[courseIndex].modules[moduleIndex].lessons[lessonIndex],
      ...updatedLesson
    };

    await writeCourses(courses);

    res.json(courses[courseIndex].modules[moduleIndex].lessons[lessonIndex]);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// DELETE - Remove a lesson
router.delete('/:slug/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const { slug, moduleId, lessonId } = req.params;

    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) {
        console.error('Error deleting lesson:', error);
        return res.status(500).json({ error: 'Failed to delete lesson' });
      }

      return res.json({ message: 'Lesson deleted successfully' });
    }

    // Fallback to local file
    const courses = await readCourses();
    const courseIndex = courses.findIndex(c => c.slug === slug);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const moduleIndex = courses[courseIndex].modules.findIndex(m => m.id === moduleId);

    if (moduleIndex === -1) {
      return res.status(404).json({ error: 'Module not found' });
    }

    courses[courseIndex].modules[moduleIndex].lessons =
      courses[courseIndex].modules[moduleIndex].lessons.filter(l => l.id !== lessonId);

    await writeCourses(courses);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

module.exports = router;
