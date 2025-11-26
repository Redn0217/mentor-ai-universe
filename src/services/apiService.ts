// API service for making requests to the backend

import type { CourseListItem, Course } from '@/types/database';

// API URL - Use Render backend for production, localhost for development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://internsify-backend-2.onrender.com'
  : 'http://localhost:3003';

// Legacy interface for backward compatibility
export interface CourseData extends Course {}

// Export the types for external use
export type { CourseListItem, Course };

// Fetch all courses
export const fetchCourses = async (): Promise<CourseListItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`);
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Fetch a single course by slug (updated for new structure)
export const fetchCourse = async (slug: string): Promise<Course> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    const data = await response.json();

    // Transform the response to match the new Course interface
    return {
      ...data,
      // Ensure tutor is properly structured
      tutor: data.tutor || {
        name: data.tutor_name || 'Course Instructor',
        avatar: data.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        bio: data.tutor_bio
      },
      // Ensure modules is an array
      modules: Array.isArray(data.modules) ? data.modules : [],
      // Handle backward compatibility
      short_description: data.short_description || data.description?.substring(0, 150),
      difficulty_level: data.difficulty_level || 'beginner',
      estimated_duration_hours: data.estimated_duration_hours || 10,
      prerequisites: data.prerequisites || [],
      learning_objectives: data.learning_objectives || [],
      tags: data.tags || [],
      is_published: data.is_published !== undefined ? data.is_published : true,
      is_featured: data.is_featured || false,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || data.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error);
    throw error;
  }
};

// Create a new course (updated for new structure)
export const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
  try {
    // Transform the data to match backend expectations
    const backendData = {
      ...courseData,
      // Handle tutor data transformation
      tutor_name: courseData.tutor?.name,
      tutor_avatar: courseData.tutor?.avatar,
      tutor_bio: courseData.tutor?.bio,
      // Ensure required fields have defaults
      icon: courseData.icon || 'code',
      color: courseData.color || '#3776AB',
      difficulty_level: courseData.difficulty_level || 'beginner',
      estimated_duration_hours: courseData.estimated_duration_hours || 0,
      prerequisites: courseData.prerequisites || [],
      learning_objectives: courseData.learning_objectives || [],
      tags: courseData.tags || [],
      is_published: courseData.is_published || false,
      is_featured: courseData.is_featured || false
    };

    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error('Failed to create course');
    }

    const data = await response.json();

    // Transform response back to frontend format
    return {
      ...data,
      tutor: {
        name: data.tutor_name || data.tutor?.name || 'Course Instructor',
        avatar: data.tutor_avatar || data.tutor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        bio: data.tutor_bio || data.tutor?.bio
      },
      modules: data.modules || []
    };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update an existing course (updated for new structure)
export const updateCourse = async (slug: string, courseData: Partial<Course>): Promise<Course> => {
  try {
    // Transform the data to match backend expectations
    const backendData = {
      ...courseData,
      tutor_name: courseData.tutor?.name,
      tutor_avatar: courseData.tutor?.avatar,
      tutor_bio: courseData.tutor?.bio
    };

    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error('Failed to update course');
    }

    const data = await response.json();

    // Transform response back to frontend format
    return {
      ...data,
      tutor: {
        name: data.tutor_name || data.tutor?.name || 'Course Instructor',
        avatar: data.tutor_avatar || data.tutor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        bio: data.tutor_bio || data.tutor?.bio
      },
      modules: data.modules || []
    };
  } catch (error) {
    console.error(`Error updating course ${slug}:`, error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (slug: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete course');
    }
  } catch (error) {
    console.error(`Error deleting course ${slug}:`, error);
    throw error;
  }
};

// Create a new lesson
export const createLesson = async (courseSlug: string, moduleId: string, lessonData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      throw new Error('Failed to create lesson');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

// Update a lesson
export const updateLesson = async (courseSlug: string, moduleId: string, lessonId: string, lessonData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      throw new Error('Failed to update lesson');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

// Fetch course with full hierarchy (modules, lessons, exercises)
export const getCourseWithHierarchy = async (slug: string): Promise<Course> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course with hierarchy');
    }
    const data = await response.json();

    // Transform the response to match the Course interface with full hierarchy
    return {
      ...data,
      // Ensure tutor is properly structured
      tutor: data.tutor || {
        name: data.tutor_name || 'Course Instructor',
        avatar: data.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        bio: data.tutor_bio
      },
      // Ensure modules is an array with lessons and exercises
      modules: Array.isArray(data.modules) ? data.modules.map((module: any) => ({
        ...module,
        lessons: Array.isArray(module.lessons) ? module.lessons.map((lesson: any) => ({
          ...lesson,
          exercises: Array.isArray(lesson.exercises) ? lesson.exercises : []
        })) : [],
        exercises: Array.isArray(module.exercises) ? module.exercises : []
      })) : [],
      // Handle backward compatibility
      short_description: data.short_description || data.description?.substring(0, 150),
      difficulty_level: data.difficulty_level || 'beginner',
      estimated_duration_hours: data.estimated_duration_hours || 10,
      prerequisites: data.prerequisites || [],
      learning_objectives: data.learning_objectives || [],
      tags: data.tags || [],
      is_published: data.is_published !== undefined ? data.is_published : true,
      is_featured: data.is_featured || false,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || data.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching course with hierarchy ${slug}:`, error);
    throw error;
  }
};

// ==================== MODULE MANAGEMENT ====================

// Add a new module to a course
export const addModule = async (courseSlug: string, moduleData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleData),
    });

    if (!response.ok) {
      throw new Error('Failed to add module');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding module:', error);
    throw error;
  }
};

// Update a module
export const updateModule = async (courseSlug: string, moduleId: string, moduleData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules/${moduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleData),
    });

    if (!response.ok) {
      throw new Error('Failed to update module');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
};

// Delete a module
export const deleteModule = async (courseSlug: string, moduleId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules/${moduleId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete module');
    }
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
};

// ==================== LESSON MANAGEMENT ====================

// Add a new lesson to a module
export const addLesson = async (courseSlug: string, moduleId: string, lessonData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules/${moduleId}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      throw new Error('Failed to add lesson');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding lesson:', error);
    throw error;
  }
};

// Delete a lesson
export const deleteLesson = async (courseSlug: string, moduleId: string, lessonId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseSlug}/modules/${moduleId}/lessons/${lessonId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete lesson');
    }
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};
