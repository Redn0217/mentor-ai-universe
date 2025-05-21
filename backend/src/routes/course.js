
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { supabase, checkSupabaseConnection } = require('../lib/supabase');

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

// Create a default courses.json if it doesn't exist
const createDefaultCoursesIfNeeded = async () => {
  try {
    await fs.access(dataPath);
  } catch (error) {
    // File doesn't exist, create default data
    const defaultCourses = [
      {
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
              },
              {
                id: "lesson2",
                title: "Installation & Setup",
                content: "Setting up your development environment.",
                duration: 25
              }
            ],
            exercises: [
              {
                id: "ex1",
                title: "Hello World",
                description: "Create your first program.",
                difficulty: "beginner",
                estimatedTime: 10
              }
            ],
            resources: [
              {
                id: "res1",
                title: "Official Documentation",
                type: "article",
                url: "https://docs.python.org/"
              }
            ]
          },
          {
            id: "module2",
            title: "Core Concepts",
            description: "Master the fundamental concepts and syntax.",
            lessons: [
              {
                id: "lesson3",
                title: "Data Types",
                content: "Learn about different data types.",
                duration: 30
              }
            ],
            exercises: [
              {
                id: "ex2",
                title: "Working with Data",
                description: "Practice with different data types.",
                difficulty: "beginner",
                estimatedTime: 20
              }
            ],
            resources: [
              {
                id: "res2",
                title: "Interactive Tutorial",
                type: "tutorial",
                url: "https://www.learnpython.org/"
              }
            ]
          }
        ],
        tutor: {
          name: "Dr. Ana Python",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
        },
        lastUpdated: "2023-05-15"
      },
      {
        id: "devops",
        slug: "devops",
        title: "DevOps",
        description: "Master continuous integration, delivery, and deployment practices.",
        icon: "settings",
        color: "#EE3424",
        modules: [
          {
            id: "module1",
            title: "Introduction to DevOps",
            description: "Understand the DevOps philosophy and practices.",
            lessons: [
              {
                id: "lesson1",
                title: "What is DevOps?",
                content: "Overview of DevOps principles and benefits.",
                duration: 20
              }
            ],
            exercises: [],
            resources: []
          }
        ],
        tutor: {
          name: "Sam Jenkins",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"
        },
        lastUpdated: "2023-06-20"
      }
    ];

    await fs.writeFile(dataPath, JSON.stringify(defaultCourses, null, 2));
    console.log('Created default courses data');
  }
};

// Initialize data
const initializeData = async () => {
  await ensureDataDirExists();
  await createDefaultCoursesIfNeeded();
};

// Read all courses
const readCourses = async () => {
  try {
    // First try to get data from Supabase
    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      console.log('Reading courses from Supabase...');
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        console.error('Error fetching courses from Supabase:', error);
        // Fall back to local file
      } else if (data && data.length > 0) {
        console.log(`Found ${data.length} courses in Supabase`);
        // Convert from Supabase format to app format
        return data.map(course => ({
          ...course,
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
      return courses;
    } catch (fileError) {
      console.error('Error reading local file:', fileError);
      return [];
    }
  } catch (error) {
    console.error('Error reading courses data:', error);
    return [];
  }
};

// Read single course by slug
const readCourse = async (slug) => {
  try {
    const courses = await readCourses();
    return courses.find(course => course.slug === slug);
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

// GET all courses (simplified for list view)
router.get('/', async (req, res) => {
  try {
    const courses = await readCourses();

    // Return simplified course list for admin view
    const courseList = courses.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      color: course.color,
      modules: course.modules.length,
      lastUpdated: course.lastUpdated || new Date().toISOString().split('T')[0]
    }));

    res.json(courseList);
  } catch (error) {
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
    const updatedCourse = req.body;
    const courses = await readCourses();

    const index = courses.findIndex(course => course.slug === req.params.slug);

    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update the course
    updatedCourse.lastUpdated = new Date().toISOString().split('T')[0];
    courses[index] = updatedCourse;

    await writeCourses(courses);

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE a course
router.delete('/:slug', async (req, res) => {
  try {
    const courses = await readCourses();
    const filteredCourses = courses.filter(course => course.slug !== req.params.slug);

    if (filteredCourses.length === courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await writeCourses(filteredCourses);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
