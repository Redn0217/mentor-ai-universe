import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { stateService } from '@/services/stateService';
import hljs from 'highlight.js';
import './LessonContent.css';

interface LessonViewerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    content: string;
    content_type: string;
    estimated_duration_minutes: number;
    learning_objectives: string[];
    key_concepts: string[];
    exercises?: any[];
  };
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  onStartExercise?: (exercise: any) => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  isCompleted?: boolean;
  // Navigation context
  hasNextLesson?: boolean;
  hasNextModule?: boolean;
  nextLessonTitle?: string;
  nextModuleTitle?: string;
  onContinueToNext?: () => void;
  // Course info
  courseTitle?: string;
  courseSlug?: string;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onPrevious,
  onNext,
  onComplete,
  onStartExercise,
  hasPrevious = false,
  hasNext = false,
  isCompleted = false,
  hasNextLesson = false,
  hasNextModule = false,
  nextLessonTitle,
  nextModuleTitle,
  onContinueToNext,
  courseTitle,
  courseSlug
}) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const scrollPositionRef = useRef(0);
  const hasRestoredStateRef = useRef(false);

  // Restore lesson state on mount
  useEffect(() => {
    if (!hasRestoredStateRef.current && lesson.id) {
      const savedState = stateService.getLessonState(lesson.id);
      if (savedState) {
        scrollPositionRef.current = savedState.scrollPosition;

        // Restore scroll position after a short delay
        setTimeout(() => {
          window.scrollTo(0, savedState.scrollPosition);
        }, 100);
      }
      hasRestoredStateRef.current = true;
    }
  }, [lesson.id]);

  // Apply syntax highlighting to code blocks after content loads
  useEffect(() => {
    if (lesson.content && lesson.content.includes('<')) {
      // Wait for DOM to update, then highlight code blocks
      setTimeout(() => {
        document.querySelectorAll('pre.ql-syntax').forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }, 100);
    }
  }, [lesson.content]);

  // Save lesson state periodically
  useEffect(() => {
    if (hasRestoredStateRef.current && lesson.id) {
      const saveState = () => {
        stateService.saveLessonState(lesson.id, {
          scrollPosition: window.scrollY
        });
      };

      const interval = setInterval(saveState, 5000); // Save every 5 seconds
      return () => clearInterval(interval);
    }
  }, [lesson.id]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompleteLesson = () => {
    setShowCompletionModal(true);
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimated_duration_minutes} min</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Complete Button */}
              <button
                onClick={handleCompleteLesson}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isCompleted
                    ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </button>

              {/* Back to Course Button */}
              {courseSlug && (
                <button
                  onClick={() => window.location.href = `/course/${courseSlug}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Course</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="prose prose-lg max-w-none lesson-content">
                {/* Check if content is HTML (from WYSIWYG editor) or Markdown */}
                {lesson.content && lesson.content.includes('<') ? (
                  // Render HTML content from WYSIWYG editor
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                    className="ql-editor"
                  />
                ) : (
                  // Fallback to Markdown rendering for legacy content
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                    }}
                  >
                    {lesson.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>

            {/* Exercises */}
            {lesson.exercises && lesson.exercises.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Practice Exercises</h3>
                <div className="space-y-4">
                  {lesson.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{exercise.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                      <button
                        onClick={() => {
                          if (onStartExercise) {
                            onStartExercise(exercise);
                          } else {
                            console.log('Starting exercise:', exercise.id);
                          }
                        }}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                      >
                        Start Exercise
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Learning Objectives */}
            {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {lesson.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Concepts */}
            {lesson.key_concepts && lesson.key_concepts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.key_concepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              hasPrevious
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Lesson
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              hasNext
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next Lesson
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lesson Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Lesson Completed!</h3>
              <p className="text-gray-600 mb-6">🎉 Great job! You've finished this lesson.</p>

              <div className="space-y-3">
                {hasNextLesson && (
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onContinueToNext?.();
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Next Lesson: {nextLessonTitle}
                  </button>
                )}

                {!hasNextLesson && hasNextModule && (
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onContinueToNext?.();
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Next Module: {nextModuleTitle}
                  </button>
                )}

                {!hasNextLesson && !hasNextModule && (
                  <div className="text-center">
                    <p className="text-green-600 font-medium mb-3">🏆 Course Complete!</p>
                    <button
                      onClick={() => {
                        setShowCompletionModal(false);
                        onContinueToNext?.();
                      }}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Return to Course Overview
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Stay on This Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
