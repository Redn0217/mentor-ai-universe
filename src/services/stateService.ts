// State persistence service to maintain component state across tab switches and page reloads

interface CourseState {
  courseSlug: string;
  moduleId?: string;
  currentLessonIndex?: number;
  selectedExercise?: any;
  scrollPosition?: number;
  lastAccessed: number;
}

interface LessonState {
  lessonId: string;
  scrollPosition: number;
  lastAccessed: number;
}

interface ExerciseState {
  exerciseId: string;
  code: string;
  timeSpent: number;
  showHints: boolean;
  showSolution: boolean;
  output: string;
  isCompleted: boolean;
  lastAccessed: number;
}

class StateService {
  private readonly COURSE_STATE_KEY = 'course_state';
  private readonly LESSON_STATE_KEY = 'lesson_state';
  private readonly EXERCISE_STATE_KEY = 'exercise_state';
  private readonly STATE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

  // Course state management
  saveCourseState(state: Partial<CourseState>): void {
    try {
      const existingState = this.getCourseState();
      const newState: CourseState = {
        ...existingState,
        ...state,
        lastAccessed: Date.now()
      };
      
      localStorage.setItem(this.COURSE_STATE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving course state:', error);
    }
  }

  getCourseState(): CourseState | null {
    try {
      const stateStr = localStorage.getItem(this.COURSE_STATE_KEY);
      if (!stateStr) return null;

      const state: CourseState = JSON.parse(stateStr);
      
      // Check if state is expired
      if (Date.now() - state.lastAccessed > this.STATE_EXPIRY_TIME) {
        this.clearCourseState();
        return null;
      }

      return state;
    } catch (error) {
      console.error('Error getting course state:', error);
      return null;
    }
  }

  clearCourseState(): void {
    try {
      localStorage.removeItem(this.COURSE_STATE_KEY);
    } catch (error) {
      console.error('Error clearing course state:', error);
    }
  }

  // Lesson state management
  saveLessonState(lessonId: string, state: Partial<Omit<LessonState, 'lessonId'>>): void {
    try {
      const existingStates = this.getAllLessonStates();
      const newState: LessonState = {
        lessonId,
        scrollPosition: 0,
        ...existingStates[lessonId],
        ...state,
        lastAccessed: Date.now()
      };
      
      existingStates[lessonId] = newState;
      localStorage.setItem(this.LESSON_STATE_KEY, JSON.stringify(existingStates));
    } catch (error) {
      console.error('Error saving lesson state:', error);
    }
  }

  getLessonState(lessonId: string): LessonState | null {
    try {
      const states = this.getAllLessonStates();
      const state = states[lessonId];
      
      if (!state) return null;

      // Check if state is expired
      if (Date.now() - state.lastAccessed > this.STATE_EXPIRY_TIME) {
        delete states[lessonId];
        localStorage.setItem(this.LESSON_STATE_KEY, JSON.stringify(states));
        return null;
      }

      return state;
    } catch (error) {
      console.error('Error getting lesson state:', error);
      return null;
    }
  }

  private getAllLessonStates(): Record<string, LessonState> {
    try {
      const statesStr = localStorage.getItem(this.LESSON_STATE_KEY);
      return statesStr ? JSON.parse(statesStr) : {};
    } catch (error) {
      console.error('Error getting all lesson states:', error);
      return {};
    }
  }

  clearLessonState(lessonId: string): void {
    try {
      const states = this.getAllLessonStates();
      delete states[lessonId];
      localStorage.setItem(this.LESSON_STATE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Error clearing lesson state:', error);
    }
  }

  // Exercise state management
  saveExerciseState(exerciseId: string, state: Partial<Omit<ExerciseState, 'exerciseId'>>): void {
    try {
      const existingStates = this.getAllExerciseStates();
      const newState: ExerciseState = {
        exerciseId,
        code: '',
        timeSpent: 0,
        showHints: false,
        showSolution: false,
        output: '',
        isCompleted: false,
        ...existingStates[exerciseId],
        ...state,
        lastAccessed: Date.now()
      };
      
      existingStates[exerciseId] = newState;
      localStorage.setItem(this.EXERCISE_STATE_KEY, JSON.stringify(existingStates));
    } catch (error) {
      console.error('Error saving exercise state:', error);
    }
  }

  getExerciseState(exerciseId: string): ExerciseState | null {
    try {
      const states = this.getAllExerciseStates();
      const state = states[exerciseId];
      
      if (!state) return null;

      // Check if state is expired
      if (Date.now() - state.lastAccessed > this.STATE_EXPIRY_TIME) {
        delete states[exerciseId];
        localStorage.setItem(this.EXERCISE_STATE_KEY, JSON.stringify(states));
        return null;
      }

      return state;
    } catch (error) {
      console.error('Error getting exercise state:', error);
      return null;
    }
  }

  private getAllExerciseStates(): Record<string, ExerciseState> {
    try {
      const statesStr = localStorage.getItem(this.EXERCISE_STATE_KEY);
      return statesStr ? JSON.parse(statesStr) : {};
    } catch (error) {
      console.error('Error getting all exercise states:', error);
      return {};
    }
  }

  clearExerciseState(exerciseId: string): void {
    try {
      const states = this.getAllExerciseStates();
      delete states[exerciseId];
      localStorage.setItem(this.EXERCISE_STATE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Error clearing exercise state:', error);
    }
  }

  // Utility methods
  saveScrollPosition(key: string, position: number): void {
    try {
      const scrollPositions = JSON.parse(localStorage.getItem('scroll_positions') || '{}');
      scrollPositions[key] = {
        position,
        timestamp: Date.now()
      };
      localStorage.setItem('scroll_positions', JSON.stringify(scrollPositions));
    } catch (error) {
      console.error('Error saving scroll position:', error);
    }
  }

  getScrollPosition(key: string): number {
    try {
      const scrollPositions = JSON.parse(localStorage.getItem('scroll_positions') || '{}');
      const saved = scrollPositions[key];
      
      if (!saved) return 0;
      
      // Return saved position if it's less than 1 hour old
      if (Date.now() - saved.timestamp < 60 * 60 * 1000) {
        return saved.position;
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting scroll position:', error);
      return 0;
    }
  }

  // Clean up expired states
  cleanupExpiredStates(): void {
    try {
      const now = Date.now();
      
      // Clean course state
      const courseState = this.getCourseState();
      if (courseState && now - courseState.lastAccessed > this.STATE_EXPIRY_TIME) {
        this.clearCourseState();
      }
      
      // Clean lesson states
      const lessonStates = this.getAllLessonStates();
      Object.keys(lessonStates).forEach(lessonId => {
        if (now - lessonStates[lessonId].lastAccessed > this.STATE_EXPIRY_TIME) {
          delete lessonStates[lessonId];
        }
      });
      localStorage.setItem(this.LESSON_STATE_KEY, JSON.stringify(lessonStates));
      
      // Clean exercise states
      const exerciseStates = this.getAllExerciseStates();
      Object.keys(exerciseStates).forEach(exerciseId => {
        if (now - exerciseStates[exerciseId].lastAccessed > this.STATE_EXPIRY_TIME) {
          delete exerciseStates[exerciseId];
        }
      });
      localStorage.setItem(this.EXERCISE_STATE_KEY, JSON.stringify(exerciseStates));
      
    } catch (error) {
      console.error('Error cleaning up expired states:', error);
    }
  }
}

export const stateService = new StateService();

// Auto-cleanup on service initialization
stateService.cleanupExpiredStates();
