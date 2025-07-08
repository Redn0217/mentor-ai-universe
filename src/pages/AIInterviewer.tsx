import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Star, 
  MessageSquare, 
  FileText, 
  Upload, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward,
  Code,
  Download,
  CheckCircle
} from 'lucide-react';

type InterviewStage = 
  | 'role-selection'
  | 'resume-upload'
  | 'warmup'
  | 'basic-assessment'
  | 'deep-dive'
  | 'follow-up'
  | 'analytics';

const stages = [
  { id: 'role-selection', label: 'Role Selection', icon: GraduationCap },
  { id: 'resume-upload', label: 'Resume Upload', icon: Upload },
  { id: 'warmup', label: 'Warm-up', icon: MessageSquare },
  { id: 'basic-assessment', label: 'Basic Assessment', icon: Star },
  { id: 'deep-dive', label: 'Deep Dive', icon: FileText },
  { id: 'follow-up', label: 'Follow-up', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics Report', icon: Download },
];

const roles = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'React, TypeScript, CSS, and modern web technologies',
    icon: Code,
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'backend',
    title: 'Backend Developer', 
    description: 'Node.js, Python, databases, and API development',
    icon: GraduationCap,
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'End-to-end web development with modern frameworks',
    icon: Star,
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'CI/CD, cloud platforms, containerization, and automation',
    icon: MessageSquare,
    color: 'bg-orange-50 border-orange-200'
  },
];

export default function AIInterviewer() {
  const [currentStage, setCurrentStage] = useState<InterviewStage>('role-selection');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [transcript, setTranscript] = useState<Array<{id: number, speaker: 'AI' | 'Candidate', text: string, timestamp: string}>>([]);

  const currentStageIndex = stages.findIndex(stage => stage.id === currentStage);
  const progress = ((currentStageIndex + 1) / stages.length) * 100;

  const handleStageChange = (stageId: InterviewStage) => {
    setCurrentStage(stageId);
  };

  const handleNext = () => {
    const nextIndex = currentStageIndex + 1;
    if (nextIndex < stages.length) {
      setCurrentStage(stages[nextIndex].id as InterviewStage);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStageIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStage(stages[prevIndex].id as InterviewStage);
    }
  };

  const mockTranscript = [
    { id: 1, speaker: 'AI' as const, text: 'Hello! Welcome to your interview. Can you please introduce yourself?', timestamp: '00:01' },
    { id: 2, speaker: 'Candidate' as const, text: 'Hi, my name is John and I\'m a software developer with 3 years of experience...', timestamp: '00:15' },
    { id: 3, speaker: 'AI' as const, text: 'That\'s great! Tell me about your experience with React.', timestamp: '00:45' },
  ];

  const renderStageContent = () => {
    switch (currentStage) {
      case 'role-selection':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Select Your Target Role</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the position you'd like to interview for. This will customize the questions and assessment criteria.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {roles.map((role) => (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRole === role.id 
                      ? 'ring-2 ring-primary ring-offset-2 shadow-lg' 
                      : 'hover:ring-1 hover:ring-gray-300'
                  } ${role.color}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-white/80 w-fit">
                      <role.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{role.description}</p>
                    {selectedRole === role.id && (
                      <div className="flex justify-center mt-4">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'resume-upload':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Upload Your Resume</h2>
              <p className="text-muted-foreground">
                Upload your resume to personalize the interview questions based on your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="space-y-6">
                <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                  <CardContent className="p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Drag or click to upload</h3>
                    <p className="text-muted-foreground mb-4">Supports PDF, DOC, DOCX (Max 5MB)</p>
                    <Button variant="outline">Browse Files</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resume Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Upload a resume to see the parsed preview here.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'warmup':
      case 'basic-assessment':
      case 'deep-dive':
      case 'follow-up':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* AI Avatar & Question Panel */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Interview Session</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={isPaused ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setIsPaused(!isPaused)}
                        >
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col">
                    {/* AI Avatar */}
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <MessageSquare className="h-12 w-12 text-primary" />
                      </div>
                    </div>

                    {/* Current Question */}
                    <Card className="mb-6 bg-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <p className="text-lg font-medium">
                          {currentStage === 'warmup' 
                            ? "Hello! Let's start with a warm-up question. Can you tell me about yourself and what interests you about this role?"
                            : currentStage === 'basic-assessment'
                            ? "Great! Now let's test some basic knowledge. Can you explain the difference between let, const, and var in JavaScript?"
                            : currentStage === 'deep-dive'
                            ? "I see you have experience with React. Can you walk me through how you would optimize a React component that's rendering slowly?"
                            : "Thank you for your detailed answers. Is there anything you'd like to clarify or add to your previous responses?"
                          }
                        </p>
                      </CardContent>
                    </Card>

                    {/* Voice Controls */}
                    <div className="flex justify-center gap-4 mt-auto">
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        onClick={() => setIsRecording(!isRecording)}
                        className="px-8"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-5 w-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNotepad(!showNotepad)}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        {showNotepad ? 'Hide' : 'Show'} Notepad
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transcript Panel */}
              <div className="space-y-6">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Live Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full overflow-y-auto">
                    <div className="space-y-4">
                      {mockTranscript.map((entry) => (
                        <div key={entry.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.speaker === 'AI' ? 'default' : 'secondary'}>
                              {entry.speaker}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                          </div>
                          <p className="text-sm">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notepad Panel */}
                {showNotepad && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Code Notepad
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full h-32 p-3 border rounded-md font-mono text-sm resize-none"
                        placeholder="Write your code here..."
                      />
                      <Button size="sm" className="mt-2">
                        Analyze Code
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Interview Analytics Report</h2>
              <p className="text-muted-foreground">
                Here's a comprehensive analysis of your interview performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">85%</div>
                    <p className="text-muted-foreground">Strong Performance</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">JavaScript</span>
                      <span className="text-sm">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">React</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Problem Solving</span>
                      <span className="text-sm">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Communication */}
              <Card>
                <CardHeader>
                  <CardTitle>Communication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Clarity</span>
                      <span className="text-sm">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Confidence</span>
                      <span className="text-sm">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Strong technical knowledge in JavaScript fundamentals</li>
                    <li>• Clear communication and structured thinking</li>
                    <li>• Good problem-solving approach</li>
                    <li>• Relevant work experience examples</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Could elaborate more on system design concepts</li>
                    <li>• Practice explaining complex topics more simply</li>
                    <li>• Consider preparing more specific examples</li>
                    <li>• Work on answering questions more concisely</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg">
                <Download className="h-5 w-5 mr-2" />
                Download Full Report
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">AI Interviewer</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practice your interview skills with our AI-powered interviewer. Get real-time feedback and detailed analytics.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStageIndex + 1} of {stages.length}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-6" />
              
              {/* Stage Navigation */}
              <div className="grid grid-cols-7 gap-2">
                {stages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isActive = stage.id === currentStage;
                  const isCompleted = index < currentStageIndex;
                  
                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleStageChange(stage.id as InterviewStage)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                        isActive 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : isCompleted
                          ? 'border-green-200 bg-green-50 text-green-600'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <StageIcon className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-xs font-medium">{stage.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            {renderStageContent()}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStageIndex === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={currentStageIndex === stages.length - 1 || (currentStage === 'role-selection' && !selectedRole)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}