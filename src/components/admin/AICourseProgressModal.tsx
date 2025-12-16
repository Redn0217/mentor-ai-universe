import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ProgressLog {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface AICourseProgressModalProps {
  open: boolean;
  progress: number;
  stage: string;
  message: string;
  logs: ProgressLog[];
  currentModule?: number;
  totalModules?: number;
  currentLesson?: number;
  totalLessonsInModule?: number;
  completedLessons?: number;
  totalLessons?: number;
}

export function AICourseProgressModal({
  open,
  progress,
  stage,
  message,
  logs,
  currentModule,
  totalModules,
  currentLesson,
  totalLessonsInModule,
  completedLessons,
  totalLessons,
}: AICourseProgressModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[650px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Generating AI Course
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{message}</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Module/Lesson Counters */}
          {currentModule && totalModules && (
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
                <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">Module</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {currentModule} / {totalModules}
                </div>
              </div>
              {currentLesson && totalLessonsInModule && (
                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 border border-green-200 dark:border-green-800">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-1">Lesson</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {currentLesson} / {totalLessonsInModule}
                  </div>
                </div>
              )}
              {completedLessons !== undefined && totalLessons && (
                <div className="rounded-lg bg-purple-50 dark:bg-purple-950 p-3 border border-purple-200 dark:border-purple-800">
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-1">Total</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {completedLessons} / {totalLessons}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logs */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Generation Log</div>
            <ScrollArea className="h-[250px] rounded-md border bg-muted/30 p-4">
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {log.type === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    {log.type === 'error' && (
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    {log.type === 'info' && (
                      <div className="h-4 w-4 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-muted-foreground text-xs">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <div className={`break-words ${log.type === 'error' ? 'text-red-500' : ''}`}>
                        {log.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Stage Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${['outline', 'content', 'lesson', 'validating', 'saving'].includes(stage) ? 'bg-green-500' : stage === 'starting' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
              <span>Outline</span>
            </div>
            <div className="h-px w-6 bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${['content', 'lesson', 'validating', 'saving'].includes(stage) ? 'bg-green-500' : stage === 'outline' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
              <span>Content</span>
            </div>
            <div className="h-px w-6 bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${['validating', 'saving'].includes(stage) ? 'bg-green-500' : ['content', 'lesson'].includes(stage) ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
              <span>Validate</span>
            </div>
            <div className="h-px w-6 bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${stage === 'saving' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
              <span>Save</span>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Please wait... This may take several minutes depending on the course size.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

