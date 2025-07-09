import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward, 
  Upload, 
  FileText, 
  Code, 
  Download, 
  CheckCircle, 
  Clock, 
  User, 
  Brain, 
  MessageSquare, 
  BarChart3,
  Radar,
  ChevronRight,
  ChevronDown,
  Volume2,
  Edit3,
  Eye,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TranscriptEntry {
  id: string;
  speaker: 'ai' | 'candidate';
  text: string;
  timestamp: string;
}

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  highlighted: boolean;
}

interface AnalyticsData {
  overallScore: number;
  skills: { name: string; score: number }[];
  strengths: string[];
  improvements: string[];
}

export default function AIInterviewer() {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [showNotepad, setShowNotepad] = useState(false);
  const [notepadContent, setNotepadContent] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    { id: 0, title: 'Role Selection', icon: <User className="w-4 h-4" /> },
    { id: 1, title: 'Resume Upload', icon: <FileText className="w-4 h-4" /> },
    { id: 2, title: 'Warm-up', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 3, title: 'Knowledge Assessment', icon: <Brain className="w-4 h-4" /> },
    { id: 4, title: 'Deep Dive', icon: <Eye className="w-4 h-4" /> },
    { id: 5, title: 'Follow-up', icon: <Edit3 className="w-4 h-4" /> },
    { id: 6, title: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const roles: Role[] = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'React, TypeScript, CSS, UI/UX',
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      description: 'Node.js, Python, Databases, APIs',
      icon: <Settings className="w-6 h-6" />
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      description: 'Frontend + Backend + DevOps',
      icon: <Brain className="w-6 h-6" />
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      description: 'CI/CD, Cloud, Infrastructure as Code',
      icon: <Radar className="w-6 h-6" />
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Machine Learning, Statistics, Python',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      id: 'ux-designer',
      title: 'UX Designer',
      description: 'User Research, Wireframing, Prototyping',
      icon: <Eye className="w-6 h-6" />
    }
  ];

  const sampleTranscript: TranscriptEntry[] = [
    {
      id: '1',
      speaker: 'ai',
      text: 'Hello! Welcome to your interview. Let\'s start with a simple question - can you tell me about yourself?',
      timestamp: '10:30:15'
    },
    {
      id: '2',
      speaker: 'candidate',
      text: 'Hi! I\'m a frontend developer with 3 years of experience in React and TypeScript...',
      timestamp: '10:30:45'
    }
  ];

  const resumeSections: ResumeSection[] = [
    {
      id: '1',
      title: 'Experience',
      content: 'Frontend Developer at TechCorp (2021-2024)\n• Built responsive web applications using React\n• Implemented TypeScript for better code quality',
      highlighted: false
    },
    {
      id: '2',
      title: 'Skills',
      content: 'React, TypeScript, JavaScript, CSS, HTML, Git, Node.js',
      highlighted: true
    }
  ];

  const analyticsData: AnalyticsData = {
    overallScore: 85,
    skills: [
      { name: 'React', score: 90 },
      { name: 'TypeScript', score: 85 },
      { name: 'Problem Solving', score: 80 },
      { name: 'Communication', score: 88 }
    ],
    strengths: ['Strong technical knowledge', 'Clear communication', 'Good problem-solving approach'],
    improvements: ['Could improve algorithm complexity understanding', 'More experience with testing frameworks needed']
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setResumeUploaded(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTranscript(sampleTranscript);
    }
  };

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const prevStage = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 0: // Role Selection
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Select Your Role</h2>
              <p className="text-muted-foreground">Choose the position you're interviewing for</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-6 cursor-pointer transition-all ${
                      selectedRole === role.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-primary">{role.icon}</div>
                      <h3 className="font-semibold text-foreground">{role.title}</h3>
                      <p className="text-sm text-muted-foreground text-center">{role.description}</p>
                      {selectedRole === role.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 1: // Resume Upload
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Upload Your Resume</h2>
              <Card className="p-8">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">Drag or click to upload</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
                {resumeUploaded && (
                  <div className="mt-4 flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Resume uploaded successfully!</span>
                  </div>
                )}
              </Card>
            </div>
            {resumeUploaded && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Resume Preview</h3>
                <Card className="p-4 space-y-4">
                  {resumeSections.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <h4 className="font-medium text-foreground">{section.title}</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                      <Separator />
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        );

      case 2: // Warm-up
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 bg-primary">
                  <div className="w-full h-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">AI Interviewer</h3>
                  <p className="text-sm text-muted-foreground">Let's get started with some warm-up questions</p>
                </div>
              </div>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-foreground">
                      "Hello! Welcome to your interview. I'm excited to learn more about you. 
                      Let's start with a simple question - can you tell me about yourself and 
                      what interests you about this role?"
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={toggleRecording}
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      className="rounded-full"
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                    {isRecording && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm text-muted-foreground">Recording...</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Live Transcript</h3>
              <Card className="p-4 h-96 overflow-y-auto">
                <div className="space-y-3">
                  {transcript.map((entry) => (
                    <div key={entry.id} className={`flex ${entry.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        entry.speaker === 'ai' 
                          ? 'bg-muted text-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        <p className="text-sm">{entry.text}</p>
                        <p className="text-xs opacity-70 mt-1">{entry.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case 3: // Knowledge Assessment
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Technical Assessment</h2>
              <p className="text-muted-foreground">Let's test your technical knowledge</p>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Question 1 of 5</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">5:00</span>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground">
                    "Can you explain the difference between `useState` and `useEffect` in React? 
                    When would you use each one?"
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => setShowNotepad(!showNotepad)}
                    variant="outline"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    {showNotepad ? 'Hide' : 'Show'} Notepad
                  </Button>
                  <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"}>
                    {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </div>
                {showNotepad && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Code/Notes Editor</h4>
                        <Textarea
                          value={notepadContent}
                          onChange={(e) => setNotepadContent(e.target.value)}
                          placeholder="Write your code or notes here..."
                          className="min-h-32 font-mono"
                        />
                        <Button size="sm" variant="outline">
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze with AI
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        );

      case 4: // Deep Dive
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Resume Deep Dive</h2>
              <Card className="p-4">
                <div className="space-y-4">
                  {resumeSections.map((section) => (
                    <div 
                      key={section.id} 
                      className={`p-3 rounded-lg transition-all ${
                        section.highlighted 
                          ? 'bg-primary/10 border border-primary' 
                          : 'bg-muted'
                      }`}
                    >
                      <h4 className="font-medium text-foreground mb-2">{section.title}</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Follow-up Questions</h3>
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-foreground">
                      "I see you have experience with React and TypeScript. Can you walk me through 
                      a challenging project where you used these technologies? What obstacles did you face?"
                    </p>
                  </div>
                  <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"}>
                    {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 5: // Follow-up
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Clarification & Follow-up</h2>
              <p className="text-muted-foreground">Let's clarify a few points from our conversation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { topic: 'React Hooks', question: 'Can you elaborate on useEffect dependencies?' },
                { topic: 'TypeScript', question: 'How do you handle type safety in large projects?' }
              ].map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{item.topic}</Badge>
                      <span className="text-xs text-muted-foreground">Flagged for clarification</span>
                    </div>
                    <p className="text-sm text-foreground">{item.question}</p>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Clarification
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6: // Analytics
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Interview Analytics</h2>
              <p className="text-muted-foreground">Here's your comprehensive performance report</p>
            </div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">{analyticsData.overallScore}%</div>
                    <p className="text-lg font-semibold text-foreground">Overall Score</p>
                    <Progress value={analyticsData.overallScore} className="w-full" />
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="skills" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyticsData.skills.map((skill) => (
                    <Card key={skill.name} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.score}%</span>
                        </div>
                        <Progress value={skill.score} className="w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="feedback" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 text-green-600">Strengths</h3>
                    <div className="space-y-2">
                      {analyticsData.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-foreground">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 text-orange-600">Areas for Improvement</h3>
                    <div className="space-y-2">
                      {analyticsData.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-foreground">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                <div className="flex justify-center">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">AI Interviewer</h1>
                  <p className="text-sm text-muted-foreground">Intelligent Interview Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Candidate: John Doe</Badge>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Progress value={75} className="w-16" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Progress Tracker */}
            <div className="col-span-12 lg:col-span-3">
              <Card className="p-4 sticky top-6">
                <h3 className="font-semibold text-foreground mb-4">Interview Progress</h3>
                <div className="space-y-3">
                  {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer ${
                        currentStage === index
                          ? 'bg-primary text-primary-foreground'
                          : currentStage > index
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => setCurrentStage(index)}
                    >
                      <div className={`p-1 rounded ${
                        currentStage === index
                          ? 'bg-primary-foreground text-primary'
                          : currentStage > index
                          ? 'bg-green-600 text-white'
                          : 'bg-muted'
                      }`}>
                        {currentStage > index ? <CheckCircle className="w-4 h-4" /> : stage.icon}
                      </div>
                      <span className="text-sm font-medium">{stage.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(((currentStage + 1) / stages.length) * 100)}%</span>
                  </div>
                  <Progress value={((currentStage + 1) / stages.length) * 100} className="w-full" />
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStageContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                <Button
                  onClick={prevStage}
                  disabled={currentStage === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Interview
                  </Button>
                  <Button
                    onClick={nextStage}
                    disabled={
                      (currentStage === 0 && !selectedRole) ||
                      (currentStage === 1 && !resumeUploaded) ||
                      currentStage === stages.length - 1
                    }
                  >
                    {currentStage === stages.length - 1 ? 'Complete' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}