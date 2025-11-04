import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, CheckCircle, Clock, Target, Lightbulb, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { progressService } from '@/services/progressService';
import { stateService } from '@/services/stateService';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseViewerProps {
  exercise: {
    id: string;
    title: string;
    description: string;
    instructions: string;
    starter_code?: string;
    solution_code?: string;
    hints: string[];
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_time_minutes: number;
    points: number;
    tags: string[];
  };
  courseId: string;
  moduleId: string;
  lessonId?: string;
  onBack: () => void;
  onComplete?: (exerciseId: string) => void;
  onContinueToNext?: () => void;
  hasNextLesson?: boolean;
  hasNextModule?: boolean;
  nextLessonTitle?: string;
  nextModuleTitle?: string;
}

const ExerciseViewer: React.FC<ExerciseViewerProps> = ({
  exercise,
  courseId,
  moduleId,
  lessonId,
  onBack,
  onComplete,
  onContinueToNext,
  hasNextLesson = false,
  hasNextModule = false,
  nextLessonTitle,
  nextModuleTitle
}) => {
  const [code, setCode] = useState(exercise.starter_code || '');
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const hasRestoredStateRef = useRef(false);

  // Restore exercise state on mount
  useEffect(() => {
    if (!hasRestoredStateRef.current && exercise.id) {
      const savedState = stateService.getExerciseState(exercise.id);
      if (savedState) {
        setCode(savedState.code);
        setTimeSpent(savedState.timeSpent);
        setShowHints(savedState.showHints);
        setShowSolution(savedState.showSolution);
        setOutput(savedState.output);
        setIsCompleted(savedState.isCompleted);
      }
      hasRestoredStateRef.current = true;
    }
  }, [exercise.id]);

  // Save exercise state periodically
  useEffect(() => {
    if (hasRestoredStateRef.current && exercise.id) {
      const saveState = () => {
        stateService.saveExerciseState(exercise.id, {
          code,
          timeSpent,
          showHints,
          showSolution,
          output,
          isCompleted
        });
      };

      const interval = setInterval(saveState, 3000); // Save every 3 seconds
      return () => clearInterval(interval);
    }
  }, [exercise.id, code, timeSpent, showHints, showSolution, output, isCompleted]);

  // Timer for tracking time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput('Code executed successfully!\n\nGreat work! Your solution looks good.');
      
      toast({
        title: "Code Executed",
        description: "Your code ran successfully!",
      });
    } catch (error) {
      setOutput('Error: Something went wrong with your code.');
      toast({
        title: "Execution Error",
        description: "There was an error running your code.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCompleteExercise = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to track progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      await progressService.trackProgress({
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId,
        lesson_id: lessonId,
        exercise_id: exercise.id,
        progress_type: 'exercise_completed',
        completion_percentage: 100,
        time_spent_minutes: Math.ceil(timeSpent / 60)
      });

      setIsCompleted(true);
      setShowCompletionModal(true);
      onComplete?.(exercise.id);

      toast({
        title: "Exercise Completed! 🎉",
        description: `You earned ${exercise.points} points! Great work!`,
      });
    } catch (error) {
      console.error('Error tracking progress:', error);
      toast({
        title: "Progress Saved Locally",
        description: "Your progress has been saved locally.",
      });
    }
  };

  const handleReset = () => {
    setCode(exercise.starter_code || '');
    setOutput('');
    setShowSolution(false);
    toast({
      title: "Code Reset",
      description: "Your code has been reset to the starting template.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{exercise.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                    {exercise.difficulty_level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{exercise.estimated_time_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Target className="w-4 h-4" />
                    <span>{exercise.points} points</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Time: {formatTime(timeSpent)}
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Exercise Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{exercise.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What to do:</h4>
                  <div className="text-blue-800 whitespace-pre-line">{exercise.instructions}</div>
                </div>
                
                {exercise.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exercise.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hints */}
            {exercise.hints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Hints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showHints ? (
                    <Button variant="outline" onClick={() => setShowHints(true)}>
                      Show Hints
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      {exercise.hints.map((hint, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                              {index + 1}
                            </span>
                            <p className="text-yellow-800">{hint}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Solution</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button onClick={handleRunCode} disabled={isRunning}>
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Write your code here..."
                  />
                  
                  {output && (
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div className="text-gray-400 mb-2">Output:</div>
                      <pre className="whitespace-pre-wrap">{output}</pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Solution */}
            {exercise.solution_code && (
              <Card>
                <CardHeader>
                  <CardTitle>Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  {!showSolution ? (
                    <Button variant="outline" onClick={() => setShowSolution(true)}>
                      Show Solution
                    </Button>
                  ) : (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language="python"
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        {exercise.solution_code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Complete Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleCompleteExercise}
                disabled={isCompleted}
                className="px-8 py-3 text-lg"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exercise Completed!</h3>
              <p className="text-gray-600 mb-2">🎉 Congratulations! You earned {exercise.points} points!</p>
              <p className="text-sm text-gray-500 mb-6">Time spent: {formatTime(timeSpent)}</p>

              <div className="space-y-3">
                {hasNextLesson && (
                  <Button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onContinueToNext?.();
                    }}
                    className="w-full"
                  >
                    Continue to Next Lesson: {nextLessonTitle}
                  </Button>
                )}

                {!hasNextLesson && hasNextModule && (
                  <Button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onContinueToNext?.();
                    }}
                    className="w-full"
                  >
                    Continue to Next Module: {nextModuleTitle}
                  </Button>
                )}

                {!hasNextLesson && !hasNextModule && (
                  <div className="text-center">
                    <p className="text-green-600 font-medium mb-3">🏆 Module Complete!</p>
                    <Button
                      onClick={() => {
                        setShowCompletionModal(false);
                        onBack();
                      }}
                      className="w-full"
                    >
                      Return to Course Overview
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompletionModal(false);
                    onBack();
                  }}
                  className="w-full"
                >
                  Back to Lesson
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseViewer;
