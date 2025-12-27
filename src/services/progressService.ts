import { supabase } from '@/lib/supabase';

export interface UserProgress {
  user_id: string;
  course_id?: string;
  module_id?: string;
  lesson_id?: string;
  exercise_id?: string;
  progress_type: 'course_enrolled' | 'module_started' | 'lesson_viewed' | 'lesson_completed' | 'exercise_attempted' | 'exercise_completed';
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed_at: string;
  completed_at?: string;
}

export interface ProgressSummary {
  course_id: string;
  total_modules: number;
  completed_modules: number;
  total_lessons: number;
  completed_lessons: number;
  total_exercises: number;
  completed_exercises: number;
  overall_progress: number;
  time_spent_minutes: number;
  last_accessed_at: string;
}

export interface ModuleProgress {
  module_id: string;
  is_started: boolean;
  is_completed: boolean;
  progress_percentage: number;
  completed_lessons: number;
  total_lessons: number;
  completed_exercises: number;
  total_exercises: number;
  time_spent_minutes: number;
  last_accessed_at?: string;
}

// Local storage keys for offline progress
const PROGRESS_STORAGE_KEY = 'course_progress';
const MODULE_PROGRESS_KEY = 'module_progress';

class ProgressService {
  // Track user progress
  async trackProgress(progressData: Omit<UserProgress, 'last_accessed_at'>): Promise<UserProgress> {
    const now = new Date().toISOString();
    const fullProgressData: UserProgress = {
      ...progressData,
      last_accessed_at: now,
      completed_at: progressData.completion_percentage === 100 ? now : undefined
    };

    try {
      // Try to save to database
      const { data, error } = await supabase
        .from('user_progress')
        .upsert([fullProgressData])
        .select()
        .single();

      if (error) {
        console.error('Database error, saving locally:', error);
        this.saveProgressLocally(fullProgressData);
        return fullProgressData;
      }

      // Also save locally as backup
      this.saveProgressLocally(fullProgressData);
      return data;
    } catch (error) {
      console.error('Error tracking progress, saving locally:', error);
      this.saveProgressLocally(fullProgressData);
      return fullProgressData;
    }
  }

  // Get user's course progress summary
  async getCourseProgress(userId: string, courseId: string): Promise<ProgressSummary> {
    try {
      const { data, error } = await supabase.rpc('get_user_course_progress', {
        user_uuid: userId,
        course_uuid: courseId
      });

      if (error) {
        console.error('Database error, using local progress:', error);
        return this.getLocalCourseProgress(userId, courseId);
      }

      return data || this.getLocalCourseProgress(userId, courseId);
    } catch (error) {
      console.error('Error fetching course progress, using local:', error);
      return this.getLocalCourseProgress(userId, courseId);
    }
  }

  // Get module progress for a user
  async getModuleProgress(userId: string, courseId: string): Promise<Record<string, ModuleProgress>> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) {
        console.error('Database error, using local progress:', error);
        return this.getLocalModuleProgress(userId, courseId);
      }

      // Process the data to create module progress summary
      const moduleProgress: Record<string, ModuleProgress> = {};

      // Track unique completed lessons and exercises per module to avoid counting duplicates
      const completedLessonsPerModule: Record<string, Set<string>> = {};
      const completedExercisesPerModule: Record<string, Set<string>> = {};

      if (data) {
        data.forEach(progress => {
          if (progress.module_id) {
            if (!moduleProgress[progress.module_id]) {
              moduleProgress[progress.module_id] = {
                module_id: progress.module_id,
                is_started: false,
                is_completed: false,
                progress_percentage: 0,
                completed_lessons: 0,
                total_lessons: 0,
                completed_exercises: 0,
                total_exercises: 0,
                time_spent_minutes: 0,
                last_accessed_at: progress.last_accessed_at
              };
              completedLessonsPerModule[progress.module_id] = new Set();
              completedExercisesPerModule[progress.module_id] = new Set();
            }

            const moduleData = moduleProgress[progress.module_id];

            if (progress.progress_type === 'module_started') {
              moduleData.is_started = true;
            }

            if (progress.progress_type === 'lesson_completed' && progress.lesson_id) {
              // Track unique lessons only
              completedLessonsPerModule[progress.module_id].add(progress.lesson_id);
            }

            if (progress.progress_type === 'exercise_completed' && progress.exercise_id) {
              // Track unique exercises only
              completedExercisesPerModule[progress.module_id].add(progress.exercise_id);
            }

            moduleData.time_spent_minutes += progress.time_spent_minutes || 0;
            
            // Update last accessed time if this is more recent
            if (progress.last_accessed_at > (moduleData.last_accessed_at || '')) {
              moduleData.last_accessed_at = progress.last_accessed_at;
            }
          }
        });

        // Set the unique counts from the Sets
        Object.keys(moduleProgress).forEach(moduleId => {
          moduleProgress[moduleId].completed_lessons = completedLessonsPerModule[moduleId]?.size || 0;
          moduleProgress[moduleId].completed_exercises = completedExercisesPerModule[moduleId]?.size || 0;
        });
      }

      // Also merge with local progress
      const localProgress = this.getLocalModuleProgress(userId, courseId);
      Object.keys(localProgress).forEach(moduleId => {
        if (!moduleProgress[moduleId]) {
          moduleProgress[moduleId] = localProgress[moduleId];
        } else {
          // Merge local and remote progress (take the higher values)
          const remote = moduleProgress[moduleId];
          const local = localProgress[moduleId];

          remote.completed_lessons = Math.max(remote.completed_lessons, local.completed_lessons);
          remote.completed_exercises = Math.max(remote.completed_exercises, local.completed_exercises);
          remote.time_spent_minutes = Math.max(remote.time_spent_minutes, local.time_spent_minutes);
          remote.is_started = remote.is_started || local.is_started;
          remote.is_completed = remote.is_completed || local.is_completed;
        }
      });

      return moduleProgress;
    } catch (error) {
      console.error('Error fetching module progress, using local:', error);
      return this.getLocalModuleProgress(userId, courseId);
    }
  }

  // Check if a lesson is completed
  async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('completion_percentage')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .eq('progress_type', 'lesson_completed')
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid 406 when no rows found

      if (error) {
        console.warn('Error fetching lesson progress:', error.message);
        return this.isLessonCompletedLocally(userId, lessonId);
      }

      if (!data) {
        // No progress record found - check local storage
        return this.isLessonCompletedLocally(userId, lessonId);
      }

      return data.completion_percentage === 100;
    } catch (error) {
      return this.isLessonCompletedLocally(userId, lessonId);
    }
  }

  // Check if an exercise is completed
  async isExerciseCompleted(userId: string, exerciseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('completion_percentage')
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .eq('progress_type', 'exercise_completed')
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid 406 when no rows found

      if (error) {
        console.warn('Error fetching exercise progress:', error.message);
        return this.isExerciseCompletedLocally(userId, exerciseId);
      }

      if (!data) {
        // No progress record found - check local storage
        return this.isExerciseCompletedLocally(userId, exerciseId);
      }

      return data.completion_percentage === 100;
    } catch (error) {
      return this.isExerciseCompletedLocally(userId, exerciseId);
    }
  }

  // Local storage methods for offline functionality
  private saveProgressLocally(progress: UserProgress): void {
    try {
      const existingProgress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '[]');
      
      // Find existing progress entry or add new one
      const existingIndex = existingProgress.findIndex((p: UserProgress) => 
        p.user_id === progress.user_id &&
        p.course_id === progress.course_id &&
        p.module_id === progress.module_id &&
        p.lesson_id === progress.lesson_id &&
        p.exercise_id === progress.exercise_id &&
        p.progress_type === progress.progress_type
      );

      if (existingIndex >= 0) {
        existingProgress[existingIndex] = progress;
      } else {
        existingProgress.push(progress);
      }

      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(existingProgress));
    } catch (error) {
      console.error('Error saving progress locally:', error);
    }
  }

  private getLocalCourseProgress(userId: string, courseId: string): ProgressSummary {
    try {
      const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '[]');
      const courseProgress = progress.filter((p: UserProgress) => 
        p.user_id === userId && p.course_id === courseId
      );

      const completedLessons = courseProgress.filter((p: UserProgress) => 
        p.progress_type === 'lesson_completed' && p.completion_percentage === 100
      ).length;

      const completedExercises = courseProgress.filter((p: UserProgress) => 
        p.progress_type === 'exercise_completed' && p.completion_percentage === 100
      ).length;

      const totalTimeSpent = courseProgress.reduce((total: number, p: UserProgress) => 
        total + (p.time_spent_minutes || 0), 0
      );

      const lastAccessed = courseProgress.reduce((latest: string, p: UserProgress) => 
        p.last_accessed_at > latest ? p.last_accessed_at : latest, ''
      );

      return {
        course_id: courseId,
        total_modules: 8, // Default for Python course
        completed_modules: 0, // Will be calculated based on lessons/exercises
        total_lessons: 13, // Default for Python course
        completed_lessons: completedLessons,
        total_exercises: 13, // Default for Python course
        completed_exercises: completedExercises,
        overall_progress: Math.round(((completedLessons + completedExercises) / 26) * 100),
        time_spent_minutes: totalTimeSpent,
        last_accessed_at: lastAccessed || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting local course progress:', error);
      return {
        course_id: courseId,
        total_modules: 8,
        completed_modules: 0,
        total_lessons: 13,
        completed_lessons: 0,
        total_exercises: 13,
        completed_exercises: 0,
        overall_progress: 0,
        time_spent_minutes: 0,
        last_accessed_at: new Date().toISOString()
      };
    }
  }

  private getLocalModuleProgress(userId: string, courseId: string): Record<string, ModuleProgress> {
    try {
      const progress = JSON.parse(localStorage.getItem(MODULE_PROGRESS_KEY) || '{}');
      const key = `${userId}_${courseId}`;
      return progress[key] || {};
    } catch (error) {
      console.error('Error getting local module progress:', error);
      return {};
    }
  }

  private isLessonCompletedLocally(userId: string, lessonId: string): boolean {
    try {
      const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '[]');
      return progress.some((p: UserProgress) => 
        p.user_id === userId && 
        p.lesson_id === lessonId && 
        p.progress_type === 'lesson_completed' && 
        p.completion_percentage === 100
      );
    } catch (error) {
      return false;
    }
  }

  private isExerciseCompletedLocally(userId: string, exerciseId: string): boolean {
    try {
      const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '[]');
      return progress.some((p: UserProgress) => 
        p.user_id === userId && 
        p.exercise_id === exerciseId && 
        p.progress_type === 'exercise_completed' && 
        p.completion_percentage === 100
      );
    } catch (error) {
      return false;
    }
  }
}

export const progressService = new ProgressService();
