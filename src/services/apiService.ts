// API service for making requests to the backend

// API URL - Use Render backend URL for both production and development
const API_BASE_URL = 'https://internsify-backend-2.onrender.com'; // Your Render backend URL // Your Render backend URL

// Course type definition
export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  color: string;
  modules: number;
  lastUpdated: string;
}

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: any[];
  tutor: {
    name: string;
    avatar: string;
  };
  lastUpdated: string;
}

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

// Fetch a single course by slug
export const fetchCourse = async (slug: string): Promise<CourseData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData: CourseData): Promise<CourseData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create course');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Update an existing course
export const updateCourse = async (slug: string, courseData: CourseData): Promise<CourseData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update course');
    }
    
    return response.json();
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
