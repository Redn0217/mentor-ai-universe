import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { AICourseProgressModal } from './AICourseProgressModal';

// API URL - Use Render backend for production, localhost for development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://internsify-backend-2.onrender.com'
  : 'http://localhost:3003';

interface AICourseGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProgressLog {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}

export function AICourseGeneratorModal({ open, onOpenChange }: AICourseGeneratorModalProps) {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [estimatedHours, setEstimatedHours] = useState('10');
  const [color, setColor] = useState('#3B82F6');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [currentModule, setCurrentModule] = useState<number>();
  const [totalModules, setTotalModules] = useState<number>();
  const [currentLesson, setCurrentLesson] = useState<number>();
  const [totalLessonsInModule, setTotalLessonsInModule] = useState<number>();
  const [completedLessons, setCompletedLessons] = useState<number>();
  const [totalLessons, setTotalLessons] = useState<number>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    // Validate inputs
    if (!courseName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a course name',
        variant: 'destructive',
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a detailed prompt describing the course',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressStage('starting');
    setProgressMessage('Initializing...');
    setProgressLogs([{ timestamp: new Date(), message: 'Starting AI course generation...', type: 'info' }]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-courses/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          description,
          prompt,
          difficultyLevel,
          estimatedHours: parseInt(estimatedHours) || 10,
          color,
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log('📥 Received SSE:', data);

              if (data.type === 'progress') {
                setProgress(data.progress || 0);
                setProgressStage(data.stage || '');
                setProgressMessage(data.message || '');
                setProgressLogs(prev => [...prev, {
                  timestamp: new Date(),
                  message: data.message,
                  type: 'info'
                }]);

                // Update module/lesson counters
                if (data.currentModule) setCurrentModule(data.currentModule);
                if (data.totalModules) setTotalModules(data.totalModules);
                if (data.currentLesson) setCurrentLesson(data.currentLesson);
                if (data.totalLessonsInModule) setTotalLessonsInModule(data.totalLessonsInModule);
                if (data.completedLessons !== undefined) setCompletedLessons(data.completedLessons);
                if (data.totalLessons) setTotalLessons(data.totalLessons);
              } else if (data.type === 'complete') {
                setProgress(100);
                setProgressLogs(prev => [...prev, {
                  timestamp: new Date(),
                  message: 'Course generated successfully!',
                  type: 'success'
                }]);

                toast({
                  title: '🎉 Course Generated Successfully!',
                  description: `"${data.course.title}" has been created with ${data.course.modules?.length || 0} modules.`,
                });

                // Reset form
                setCourseName('');
                setDescription('');
                setPrompt('');
                setDifficultyLevel('beginner');
                setEstimatedHours('10');
                setColor('#3B82F6');

                // Navigate to the course page
                if (data.course.slug) {
                  setTimeout(() => {
                    navigate(`/course/${data.course.slug}`);
                    onOpenChange(false);
                    setIsGenerating(false);
                  }, 1500);
                }
              } else if (data.type === 'error') {
                throw new Error(data.message || 'Failed to generate course');
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error generating course:', error);
      setProgressLogs(prev => [...prev, {
        timestamp: new Date(),
        message: error instanceof Error ? error.message : 'Failed to generate course',
        type: 'error'
      }]);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate course with AI',
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Create Course with AI
          </DialogTitle>
          <DialogDescription>
            Describe your course and let AI generate a complete curriculum with modules, lessons, and exercises.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Course Name */}
          <div className="space-y-2">
            <Label htmlFor="courseName">
              Course Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="courseName"
              placeholder="e.g., Data Structures and Algorithms"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              placeholder="Brief one-line description of the course"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={difficultyLevel}
              onValueChange={setDifficultyLevel}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Hours */}
          <div className="space-y-2">
            <Label htmlFor="hours">Estimated Duration (hours)</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="100"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Theme Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isGenerating}
                className="w-20 h-10"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isGenerating}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* AI Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">
              Course Requirements (AI Prompt) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt"
              placeholder="Example: Create a comprehensive DSA course covering arrays, strings, linked lists, stacks, queues, trees, and graphs. Include basic to advanced algorithms with practical examples. Add coding exercises for each topic. The course should have around 6-8 modules with 3-4 lessons each."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about topics, structure, number of modules, exercises, and any special requirements.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Course...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Course
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Progress Modal */}
    <AICourseProgressModal
      open={isGenerating}
      progress={progress}
      stage={progressStage}
      message={progressMessage}
      logs={progressLogs}
      currentModule={currentModule}
      totalModules={totalModules}
      currentLesson={currentLesson}
      totalLessonsInModule={totalLessonsInModule}
      completedLessons={completedLessons}
      totalLessons={totalLessons}
    />
  </>
  );
}

