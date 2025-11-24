import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Colorful dark theme
import './LessonEditor.css';

// Configure syntax highlighting
(window as any).hljs = hljs;

interface Lesson {
  id: string;
  title: string;
  content: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  estimated_duration_minutes?: number;
}

interface LessonEditorModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
}

// Quill toolbar configuration with syntax highlighting
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline'],
    ['code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline',
  'code-block',
  'list', 'bullet',
  'link'
];

export function LessonEditorModal({ lesson, isOpen, onClose, onSave }: LessonEditorModalProps) {
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (lesson) {
      setEditedLesson({ ...lesson });
    }
  }, [lesson]);

  // Handle content change and ensure cursor can move after code blocks
  const handleContentChange = (value: string) => {
    updateField('content', value);
  };

  // Handle keyboard shortcuts for better code block navigation
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Add custom keyboard binding to exit code block with Enter
      quill.keyboard.addBinding({
        key: 13, // Enter key
        shiftKey: true,
        handler: function(range: any) {
          const format = quill.getFormat(range.index);
          if (format['code-block']) {
            // Exit code block and insert normal paragraph
            quill.insertText(range.index, '\n', 'user');
            quill.setSelection(range.index + 1, 0);
            quill.removeFormat(range.index + 1, 1);
            return false;
          }
          return true;
        }
      });
    }
  }, []);

  const handleSave = () => {
    if (editedLesson) {
      onSave(editedLesson);
      onClose();
    }
  };

  const updateField = (field: keyof Lesson, value: string | number) => {
    if (editedLesson) {
      setEditedLesson({
        ...editedLesson,
        [field]: value
      });
    }
  };

  if (!editedLesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>
            Update the lesson content, title, and other details
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="lesson-content">Lesson Content</Label>
              <div className="mt-2 lesson-editor">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={editedLesson.content || ''}
                  onChange={handleContentChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your lesson content here..."
                  className="bg-white"
                  style={{ height: '400px', marginBottom: '50px' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use the toolbar to format text, add headings, code blocks, and more. Code blocks will have colorful syntax highlighting.
                <br />
                <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Shift + Enter</kbd> to exit a code block and continue typing normal text.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="lesson-title">Lesson Title</Label>
              <Input
                id="lesson-title"
                value={editedLesson.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter lesson title"
              />
            </div>

            <div>
              <Label htmlFor="lesson-description">Description (Optional)</Label>
              <Textarea
                id="lesson-description"
                value={editedLesson.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="Brief description of the lesson"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                <Input
                  id="lesson-duration"
                  type="number"
                  value={editedLesson.duration || editedLesson.estimated_duration_minutes || 0}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    updateField('duration', value);
                    updateField('estimated_duration_minutes', value);
                  }}
                  min="1"
                  placeholder="15"
                />
              </div>

              <div>
                <Label htmlFor="lesson-video">Video URL (Optional)</Label>
                <Input
                  id="lesson-video"
                  value={editedLesson.videoUrl || ''}
                  onChange={(e) => updateField('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

