import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { generateCourseAwareTutorResponse } from '@/services/openaiService';
import { useAuth } from '@/contexts/AuthContext';
import { CourseTutor } from '@/data/courseTutors';
import { MessageCircle, X, ChevronDown, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
}

interface CourseContext {
  courseTitle: string;
  courseSlug: string;
  currentModule?: string;
  currentLesson?: string;
  modules?: Array<{ title: string; lessons: Array<{ title: string }> }>;
}

interface CourseTutorChatProps {
  tutor: CourseTutor;
  courseContext: CourseContext;
  techColor?: string;
}

// Session storage key for chat history
const getChatStorageKey = (courseSlug: string) => `tutor_chat_${courseSlug}`;

export const CourseTutorChat = ({
  tutor,
  courseContext,
  techColor = '#00D4AA'
}: CourseTutorChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load chat history from session storage
  useEffect(() => {
    const storageKey = getChatStorageKey(courseContext.courseSlug);
    const savedMessages = sessionStorage.getItem(storageKey);
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        // Initialize with greeting if no saved messages
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, [courseContext.courseSlug, tutor.name]);

  const initializeChat = () => {
    const contextualGreeting = courseContext.currentLesson
      ? `${tutor.greeting} I see you're working on "${courseContext.currentLesson}" in the ${courseContext.courseTitle} course. Feel free to ask me anything!`
      : tutor.greeting;

    setMessages([{
      id: '1',
      content: contextualGreeting,
      sender: 'tutor',
      timestamp: new Date(),
    }]);
  };

  // Save messages to session storage
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = getChatStorageKey(courseContext.courseSlug);
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, courseContext.courseSlug]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const responseContent = await generateCourseAwareTutorResponse(
        apiMessages,
        courseContext,
        tutor
      );
      
      const tutorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'tutor',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, tutorResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Floating chat button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white"
        style={{ backgroundColor: techColor }}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">Ask {tutor.name.split(' ')[0]}</span>
        <Sparkles className="w-4 h-4" />
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 w-80 rounded-t-xl shadow-2xl overflow-hidden"
        style={{ borderTop: `3px solid ${techColor}` }}
      >
        <div
          className="flex items-center justify-between p-3 bg-white cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <img src={tutor.avatar} alt={tutor.name} />
            </Avatar>
            <span className="font-medium text-sm">{tutor.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full chat panel
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: techColor + '10' }}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
            <img src={tutor.avatar} alt={tutor.name} />
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
            <p className="text-xs text-gray-500">{courseContext.courseTitle} Expert</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(true)}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tutor Bio */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <p className="text-xs text-gray-600 line-clamp-2">{tutor.bio}</p>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
                style={{
                  borderLeft: message.sender === 'tutor' ? `3px solid ${techColor}` : undefined
                }}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className={`text-[10px] ${message.sender === 'user' ? 'text-gray-400' : 'text-gray-500'} block mt-1`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]" style={{ borderLeft: `3px solid ${techColor}` }}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask about ${courseContext.courseTitle}...`}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            style={{ backgroundColor: techColor }}
            className="hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
