
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { generateCodeFeedback, trackCodingProgress } from '@/services/openaiService';
import { useAuth } from '@/contexts/AuthContext';

interface CodeEditorProps {
  defaultLanguage?: 'javascript' | 'python' | 'java' | 'cpp';
}

export const CodeEditor = ({ defaultLanguage = 'javascript' }: CodeEditorProps) => {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>(defaultLanguage);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTrackingProgress, setIsTrackingProgress] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [progress, setProgress] = useState<{
    overall: number;
    strengths: string[];
    areasToImprove: string[];
    nextChallenge?: string;
  }>({
    overall: 0,
    strengths: [],
    areasToImprove: []
  });
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Sample language templates
  useEffect(() => {
    const templates = {
      javascript: '// JavaScript example\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      python: '# Python example\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
      java: '// Java example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '// C++ example\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'
    };
    
    setCode(templates[language]);
    setOutput('');
    setFeedback('');
    // Reset timer when language changes
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimeSpent(0);
    }
  }, [language]);

  // Start timer when user begins coding
  useEffect(() => {
    // Start the timer when user modifies code
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [code]);

  // Format time spent
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    
    // This is a simple simulation of code execution
    // In a real implementation, you would use a sandboxed execution environment
    try {
      let simulatedOutput = '';
      
      // Simplified simulation based on language
      if (language === 'javascript') {
        // Simple and very limited JS execution simulation
        if (code.includes('console.log')) {
          // Extract content inside console.log's parentheses 
          const match = code.match(/console\.log\((.*)\)/);
          if (match && match[1]) {
            let value = match[1];
            // Handle string literals
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            // Very simple string template handling
            if (value.includes('`') && value.includes('${')) {
              value = value.replace(/`(.*)\${(.*)}(.*)`/, (_, before, expr, after) => {
                if (expr.trim() === 'name') {
                  return `${before}World${after}`;
                }
                return `${before}${expr}${after}`;
              });
            }
            simulatedOutput = value;
          }
        }
      } else if (language === 'python') {
        // Simulate Python print output
        if (code.includes('print')) {
          const match = code.match(/print\((.*)\)/);
          if (match && match[1]) {
            simulatedOutput = match[1].replace(/["']/g, '');
            // Very simple f-string handling
            if (simulatedOutput.includes('f"') || simulatedOutput.includes("f'")) {
              simulatedOutput = simulatedOutput.replace(/f["'](.*)\{(.*)\}(.*)["']/, (_, before, expr, after) => {
                if (expr.trim() === 'name') {
                  return `${before}World${after}`;
                }
                return `${before}${expr}${after}`;
              });
            }
          }
        }
      } else {
        // For other languages, just return Hello, World!
        simulatedOutput = "Hello, World!";
      }
      
      setOutput(simulatedOutput);
      
      toast({
        title: "Code executed",
        description: "Your code was executed successfully.",
      });
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code. Please try again.');
      
      toast({
        title: "Execution Error",
        description: "There was a problem running your code.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    
    try {
      const feedbackText = await generateCodeFeedback(code, language);
      setFeedback(feedbackText);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setFeedback('Error analyzing your code. Please try again later.');
      
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your code.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTrackProgress = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to track your coding progress.",
        variant: "destructive"
      });
      return;
    }

    setIsTrackingProgress(true);
    
    try {
      const progressData = await trackCodingProgress(
        user.uid || 'anonymous',
        language,
        {
          code,
          challenge: selectedChallenge || undefined,
          timeSpent,
          completed: !!output && output !== 'Error executing code. Please try again.'
        }
      );
      
      setProgress({
        overall: progressData.progress,
        strengths: progressData.strengths,
        areasToImprove: progressData.areasToImprove,
        nextChallenge: progressData.nextChallengeRecommendation
      });
      
      toast({
        title: "Progress Updated",
        description: "Your coding progress has been analyzed and updated.",
      });
    } catch (error) {
      console.error('Error tracking progress:', error);
      
      toast({
        title: "Progress Tracking Error",
        description: "There was a problem updating your progress.",
        variant: "destructive"
      });
    } finally {
      setIsTrackingProgress(false);
    }
  };

  // Sample challenges for each language
  const challenges = {
    javascript: [
      { id: 'js1', name: 'FizzBuzz', description: 'Write a function that prints numbers from 1 to 100, but for multiples of 3 print "Fizz" and for multiples of 5 print "Buzz".' },
      { id: 'js2', name: 'Array Manipulation', description: 'Write a function that takes an array of numbers and returns the sum of all even numbers.' },
    ],
    python: [
      { id: 'py1', name: 'Palindrome Checker', description: 'Write a function that checks if a string is a palindrome (reads the same backward as forward).' },
      { id: 'py2', name: 'List Comprehension', description: 'Create a list of squares of even numbers from 1 to 20 using list comprehension.' },
    ],
    java: [
      { id: 'java1', name: 'String Reverse', description: 'Write a method that reverses a string without using built-in reverse functions.' },
      { id: 'java2', name: 'Prime Numbers', description: 'Write a function that checks if a number is prime.' },
    ],
    cpp: [
      { id: 'cpp1', name: 'Vector Operations', description: 'Implement a function that finds the second largest element in a vector.' },
      { id: 'cpp2', name: 'Memory Management', description: 'Create a simple class that demonstrates proper memory management with constructors and destructors.' },
    ]
  };

  const handleSelectChallenge = (challenge: { id: string, name: string, description: string }) => {
    setSelectedChallenge(challenge.id);
    // Reset timer when starting a new challenge
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimeSpent(0);
    }
    
    // Start a new timer
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    toast({
      title: "Challenge Selected",
      description: `You've started the "${challenge.name}" challenge. Good luck!`,
    });
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Code Playground</h2>
        <p className="text-gray-500 text-sm mt-1">Practice coding and get AI feedback</p>
      </div>
      
      <Tabs defaultValue={language} className="w-full" onValueChange={(value) => setLanguage(value as any)}>
        <div className="p-4 border-b">
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="java">Java</TabsTrigger>
            <TabsTrigger value="cpp">C++</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          {/* Challenges sidebar */}
          <div className="col-span-1 border rounded-md bg-gray-50 p-4">
            <h3 className="font-medium text-sm mb-3">Coding Challenges</h3>
            <ScrollArea className="h-72">
              <div className="space-y-3">
                {challenges[language].map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`cursor-pointer border rounded p-3 hover:border-primary transition-colors ${
                      selectedChallenge === challenge.id ? 'border-primary bg-primary/10' : 'bg-white'
                    }`}
                    onClick={() => handleSelectChallenge(challenge)}
                  >
                    <h4 className="font-medium text-sm">{challenge.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{challenge.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Code editor and output area */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            {/* Timer and progress */}
            <div className="flex justify-between items-center">
              <div className="text-sm">
                Time spent: <span className="font-mono">{formatTime(timeSpent)}</span>
              </div>
              {progress.overall > 0 && (
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <span className="text-sm">Progress:</span>
                  <Progress value={progress.overall} className="h-2" />
                  <span className="text-sm">{progress.overall}%</span>
                </div>
              )}
            </div>
            
            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 font-mono p-4 border rounded-md bg-gray-50"
              spellCheck={false}
            />
            
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleRunCode} disabled={isRunning}>
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button onClick={handleAnalyzeCode} variant="outline" disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Get AI Feedback'}
              </Button>
              <Button 
                onClick={handleTrackProgress} 
                variant="outline" 
                disabled={isTrackingProgress}
                className="ml-auto"
              >
                {isTrackingProgress ? 'Analyzing Progress...' : 'Track My Progress'}
              </Button>
            </div>
          </div>
        </div>

        <Separator />
        
        {/* Output and feedback area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="border rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-medium mb-2">Output</h3>
            <ScrollArea className="h-48">
              <pre className="font-mono text-sm">{output || 'Run your code to see output'}</pre>
            </ScrollArea>
          </div>
          
          <div className="border rounded-md bg-gray-50 p-4">
            <h3 className="text-sm font-medium mb-2">AI Feedback</h3>
            <ScrollArea className="h-48">
              <div className="prose prose-sm">
                {feedback ? (
                  <div className="whitespace-pre-wrap">{feedback}</div>
                ) : (
                  <p className="text-gray-500">Click "Get AI Feedback" to receive code analysis</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Progress insights section */}
        {progress.overall > 0 && (
          <div className="p-4 border-t">
            <h3 className="text-lg font-medium mb-3">Learning Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {progress.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Areas to Improve</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {progress.areasToImprove.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {progress.nextChallenge && (
              <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
                <h4 className="text-sm font-medium">Recommended Next Challenge:</h4>
                <p className="text-sm mt-1">{progress.nextChallenge}</p>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
};
