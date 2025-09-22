// Database Types for Mentor AI Universe Platform
// These types match the new relational database structure

export interface DatabaseCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  icon: string;
  color: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_hours: number;
  prerequisites: string[];
  learning_objectives: string[];
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  tutor_name?: string;
  tutor_avatar?: string;
  tutor_bio?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface DatabaseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  slug: string;
  order_index: number;
  estimated_duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  prerequisites: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseLesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  slug: string;
  order_index: number;
  content: string;
  content_type: 'text' | 'markdown' | 'html' | 'video' | 'interactive';
  estimated_duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  key_concepts: string[];
  code_examples: CodeExample[];
  video_url?: string;
  video_duration_seconds?: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseExercise {
  id: string;
  lesson_id?: string;
  module_id?: string;
  title: string;
  description: string;
  slug: string;
  order_index: number;
  exercise_type: 'coding' | 'quiz' | 'project' | 'assignment' | 'practice';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes: number;
  instructions: string;
  starter_code?: string;
  solution_code?: string;
  test_cases: TestCase[];
  hints: string[];
  tags: string[];
  points: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseResource {
  id: string;
  course_id?: string;
  module_id?: string;
  lesson_id?: string;
  title: string;
  description?: string;
  resource_type: 'article' | 'video' | 'book' | 'documentation' | 'tutorial' | 'tool' | 'cheatsheet' | 'reference';
  url: string;
  is_external: boolean;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes?: number;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserProgress {
  id: string;
  user_id: string;
  course_id?: string;
  module_id?: string;
  lesson_id?: string;
  exercise_id?: string;
  progress_type: 'course_enrolled' | 'course_completed' | 'module_started' | 'module_completed' | 
                 'lesson_viewed' | 'lesson_completed' | 'exercise_attempted' | 'exercise_completed';
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseExerciseSubmission {
  id: string;
  user_id: string;
  exercise_id: string;
  submission_code: string;
  is_correct: boolean;
  score: number;
  feedback?: string;
  execution_time_ms?: number;
  submitted_at: string;
  created_at: string;
}

// Supporting types
export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  description: string;
}

// Hierarchical types for frontend use
export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  icon: string;
  color: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_hours: number;
  prerequisites: string[];
  learning_objectives: string[];
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  tutor: {
    name: string;
    avatar: string;
    bio?: string;
  };
  modules: Module[];
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  slug: string;
  order_index: number;
  estimated_duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  prerequisites: string[];
  is_published: boolean;
  lessons: Lesson[];
  exercises: Exercise[];
  resources: Resource[];
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  slug: string;
  order_index: number;
  content: string;
  content_type: 'text' | 'markdown' | 'html' | 'video' | 'interactive';
  estimated_duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  key_concepts: string[];
  code_examples: CodeExample[];
  video_url?: string;
  video_duration_seconds?: number;
  is_published: boolean;
  exercises: Exercise[];
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  slug: string;
  order_index: number;
  exercise_type: 'coding' | 'quiz' | 'project' | 'assignment' | 'practice';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes: number;
  instructions: string;
  starter_code?: string;
  solution_code?: string;
  test_cases: TestCase[];
  hints: string[];
  tags: string[];
  points: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  resource_type: 'article' | 'video' | 'book' | 'documentation' | 'tutorial' | 'tool' | 'cheatsheet' | 'reference';
  url: string;
  is_external: boolean;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes?: number;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Progress tracking types
export interface UserProgress {
  course_progress: CourseProgress[];
  module_progress: ModuleProgress[];
  lesson_progress: LessonProgress[];
  exercise_progress: ExerciseProgress[];
}

export interface CourseProgress {
  course_id: string;
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed_at: string;
  completed_at?: string;
  is_enrolled: boolean;
}

export interface ModuleProgress {
  module_id: string;
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed_at: string;
  completed_at?: string;
  is_started: boolean;
}

export interface LessonProgress {
  lesson_id: string;
  is_viewed: boolean;
  is_completed: boolean;
  time_spent_minutes: number;
  last_accessed_at: string;
  completed_at?: string;
}

export interface ExerciseProgress {
  exercise_id: string;
  is_attempted: boolean;
  is_completed: boolean;
  best_score: number;
  attempts_count: number;
  time_spent_minutes: number;
  last_attempted_at: string;
  completed_at?: string;
}

// API Response types
export interface CourseListResponse {
  courses: CourseListItem[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  color: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_hours: number;
  tags: string[];
  is_featured: boolean;
  tutor: {
    name: string;
    avatar: string;
  };
  modules_count: number;
  lessons_count: number;
  exercises_count: number;
  updated_at: string;
}
