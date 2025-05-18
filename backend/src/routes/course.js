
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to the mock data file
const dataPath = path.join(__dirname, '../data/courses.json');

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
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
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
    
    // Check if the slug already exists
    if (courses.some(course => course.slug === newCourse.slug)) {
      return res.status(400).json({ error: 'Course with this slug already exists' });
    }
    
    // Add creation date
    newCourse.lastUpdated = new Date().toISOString().split('T')[0];
    
    courses.push(newCourse);
    await writeCourses(courses);
    
    res.status(201).json(newCourse);
  } catch (error) {
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
