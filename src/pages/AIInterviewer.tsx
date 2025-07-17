import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  SkipForward, 
  Upload, 
  FileText, 
  Code, 
  MessageSquare, 
  User, 
  Brain, 
  Target, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Download,
  ChevronRight,
  ChevronDown,
  Settings,
  Volume2,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Globe,
  Headphones,
  MonitorSpeaker,
  Signal,
  Wifi,
  Database,
  Server,
  Bell,
  Filter,
  Search,
  Calendar,
  Timer,
  Eye,
  AlertTriangle,
  CheckSquare,
  XCircle,
  Users,
  Award,
  Briefcase,
  LineChart,
  PieChart,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StageData {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
  icon: React.ReactNode;
}

interface TranscriptMessage {
  id: string;
  speaker: 'ai' | 'candidate';
  message: string;
  timestamp: string;
}

interface SkillScore {
  skill: string;
  score: number;
  maxScore: number;
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'question' | 'answer' | 'analysis' | 'system';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

interface SystemMetric {
  label: string;
  value: number;
  maxValue: number;
  status: 'good' | 'warning' | 'critical';
}

const AIInterviewerDashboard: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(3);
  const [isRecording, setIsRecording] = useState(true);
  const [showNotepad, setShowNotepad] = useState(true);
  const [notepadContent, setNotepadContent] = useState('// Real-time code analysis\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\n\n// AI Suggestion: Consider memoization for optimization');
  const [isSystemMonitoring, setIsSystemMonitoring] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([
    {
      id: '1',
      speaker: 'ai',
      message: 'Hello! Welcome to your AI interview. Let\'s start with some basic questions to get you comfortable.',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      speaker: 'candidate',
      message: 'Thank you, I\'m ready to begin.',
      timestamp: '10:30 AM'
    },
    {
      id: '3',
      speaker: 'ai',
      message: 'Can you walk me through your approach to solving complex algorithm problems?',
      timestamp: '10:32 AM'
    }
  ]);

  const stages: StageData[] = [
    { id: 1, title: 'Role Selection', status: 'completed', icon: <Target className="w-4 h-4" /> },
    { id: 2, title: 'Resume Upload', status: 'completed', icon: <Upload className="w-4 h-4" /> },
    { id: 3, title: 'Warm-up', status: 'current', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 4, title: 'Knowledge Assessment', status: 'pending', icon: <Brain className="w-4 h-4" /> },
    { id: 5, title: 'Deep Dive', status: 'pending', icon: <FileText className="w-4 h-4" /> },
    { id: 6, title: 'Follow-up', status: 'pending', icon: <User className="w-4 h-4" /> },
    { id: 7, title: 'Analytics', status: 'pending', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const skillScores: SkillScore[] = [
    { skill: 'Technical Knowledge', score: 85, maxScore: 100 },
    { skill: 'Communication', score: 92, maxScore: 100 },
    { skill: 'Problem Solving', score: 78, maxScore: 100 },
    { skill: 'Leadership', score: 88, maxScore: 100 }
  ];

  const metricsCards: MetricCard[] = [
    {
      title: 'Response Quality',
      value: '94%',
      change: +12,
      trend: 'up',
      icon: <Award className="w-4 h-4" />,
      color: 'text-emerald-600'
    },
    {
      title: 'Confidence Score',
      value: '87',
      change: +5,
      trend: 'up',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Processing Time',
      value: '1.2s',
      change: -8,
      trend: 'down',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-orange-600'
    },
    {
      title: 'Active Sessions',
      value: '247',
      change: +23,
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-600'
    }
  ];

  const activityFeed: ActivityItem[] = [
    {
      id: '1',
      type: 'analysis',
      message: 'AI analyzed code complexity: O(n²) detected',
      timestamp: '2 min ago',
      status: 'warning'
    },
    {
      id: '2',
      type: 'answer',
      message: 'Candidate completed technical question #4',
      timestamp: '3 min ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'system',
      message: 'Voice recognition accuracy: 98.5%',
      timestamp: '5 min ago',
      status: 'info'
    },
    {
      id: '4',
      type: 'question',
      message: 'Advanced algorithm question triggered',
      timestamp: '7 min ago',
      status: 'info'
    },
    {
      id: '5',
      type: 'analysis',
      message: 'Real-time sentiment analysis: Confident tone detected',
      timestamp: '8 min ago',
      status: 'success'
    }
  ];

  const systemMetrics: SystemMetric[] = [
    { label: 'AI Processing', value: 87, maxValue: 100, status: 'good' },
    { label: 'Memory Usage', value: 64, maxValue: 100, status: 'good' },
    { label: 'Network Latency', value: 23, maxValue: 100, status: 'warning' },
    { label: 'Voice Quality', value: 95, maxValue: 100, status: 'good' }
  ];

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const nextStage = () => {
    if (currentStage < stages.length) {
      setCurrentStage(currentStage + 1);
    }
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Role</h2>
              <p className="text-muted-foreground">Choose the position you're interviewing for</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager', 'UI/UX Designer'].map((role) => (
                <Card key={role} className="cursor-pointer hover:border-orange-500 transition-colors group hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Code className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">{role}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
              <p className="text-muted-foreground">Upload your resume for personalized questions</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-dashed border-2 border-orange-200 hover:border-orange-400 transition-colors">
                <CardContent className="p-8 text-center">
                  <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Drag & Drop</h3>
                  <p className="text-muted-foreground mb-4">or click to browse files</p>
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                    Browse Files
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Resume Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">Senior Frontend Developer</p>
                    </div>
                    <Separator />
                    <div>
                      <h5 className="font-medium mb-2">Experience</h5>
                      <p className="text-sm text-muted-foreground">5+ years in React, TypeScript, Node.js</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">AI Interview Session</h2>
              <p className="text-muted-foreground">Real-time conversation with advanced AI analysis</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-orange-100 shadow-lg">
                <CardHeader className="border-b border-orange-50 bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 border-2 border-orange-200">
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold">AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-lg">AI Interviewer Pro</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Processing voice...
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <p className="text-foreground font-medium leading-relaxed">
                      "Can you walk me through your approach to solving complex algorithm problems? I'm particularly interested in your thought process and optimization strategies."
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <Button
                      onClick={toggleRecording}
                      className={`relative overflow-hidden ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} shadow-lg`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                      {isRecording && (
                        <div className="absolute inset-0 bg-red-400 opacity-30 animate-pulse"></div>
                      )}
                    </Button>
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        <span className="text-sm font-medium">Live Recording</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="border-b border-blue-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-blue-500" />
                      <span>Live Transcript & Analysis</span>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      Real-time
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4 pr-4">
                      {transcript.map((msg, index) => (
                        <div key={msg.id} className={`flex ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[85%] p-4 rounded-xl shadow-sm border ${
                            msg.speaker === 'ai' 
                              ? 'bg-orange-50 border-orange-100 text-foreground' 
                              : 'bg-blue-50 border-blue-100 text-foreground'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                              {msg.speaker === 'candidate' && (
                                <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                  Analyzed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isRecording && (
                        <div className="flex justify-end animate-pulse">
                          <div className="max-w-[85%] p-4 rounded-xl bg-blue-50 border border-blue-100">
                            <p className="text-sm text-blue-600">Speaking...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Advanced Analytics Dashboard</h2>
              <p className="text-muted-foreground">Comprehensive performance analysis and insights</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-emerald-100">
                <CardHeader className="border-b border-emerald-50">
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-emerald-500" />
                    Skill Assessment Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {skillScores.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{skill.score}/{skill.maxScore}</span>
                          <Badge variant="outline" className={
                            skill.score >= 90 ? "border-green-200 text-green-700" :
                            skill.score >= 80 ? "border-blue-200 text-blue-700" :
                            "border-orange-200 text-orange-700"
                          }>
                            {skill.score >= 90 ? "Excellent" : skill.score >= 80 ? "Good" : "Average"}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(skill.score / skill.maxScore) * 100} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="border-purple-100">
                <CardHeader className="border-b border-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="text-6xl font-bold text-orange-500 mb-2">85%</div>
                      <Badge variant="outline" className="border-orange-200 text-orange-700 absolute -top-2 -right-4">
                        A-
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">Overall Interview Score</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-700">92%</div>
                      <div className="text-xs text-green-600">Communication</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">87%</div>
                      <div className="text-xs text-blue-600">Problem Solving</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 w-full py-2">
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Strong Technical Foundation
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-full py-2">
                      <Award className="w-3 h-3 mr-2" />
                      Excellent Communication
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 w-full py-2">
                      <Brain className="w-3 h-3 mr-2" />
                      Advanced Problem Solving
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Stage {currentStage} - In Progress</h2>
            <p className="text-muted-foreground">AI is preparing advanced assessment content...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Advanced Dashboard Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    AI Interviewer Pro
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                      v2.0
                    </Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Signal className="w-3 h-3 text-green-500" />
                    Enterprise Interview Platform • Live Session
                  </p>
                </div>
              </div>
              
              {/* Real-time Status Indicators */}
              <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">AI Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Audio: 98.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Latency: 23ms</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Metrics Summary */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-orange-50 rounded-lg border border-orange-100">
                <div className="text-center">
                  <div className="text-sm font-semibold text-orange-700">94%</div>
                  <div className="text-xs text-orange-600">Quality</div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-orange-700">15:32</div>
                  <div className="text-xs text-orange-600">Duration</div>
                </div>
              </div>
              
              <Badge variant="outline" className="border-orange-200 text-orange-700 px-3 py-1">
                <User className="w-3 h-3 mr-2" />
                John Doe
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              </Badge>
              
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Advanced Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metricsCards.map((metric, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                    <div className={metric.color}>{metric.icon}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                     metric.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                     <Activity className="w-3 h-3" />}
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{metric.title}</h3>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Advanced Sidebar - Progress Tracker & System Monitoring */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="border-b border-orange-50 bg-gradient-to-r from-orange-50 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Interview Progress
                  <Badge variant="outline" className="ml-auto text-xs border-orange-200 text-orange-700">
                    Stage {currentStage}/7
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stage.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : stage.status === 'current'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {stage.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          stage.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          stage.status === 'current' ? 'text-orange-600' : 'text-foreground'
                        }`}>
                          {stage.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{stage.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((currentStage / stages.length) * 100)}%</span>
                  </div>
                  <Progress value={(currentStage / stages.length) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Voice Controls */}
            <Card className="border-orange-100">
              <CardHeader className="border-b border-orange-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MonitorSpeaker className="w-5 h-5 text-orange-500" />
                  Voice Controls
                  <div className="ml-auto flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-orange-500" />
                    <div className="w-12 bg-orange-100 h-1 rounded">
                      <div className="bg-orange-500 h-1 rounded w-8"></div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Button
                    onClick={toggleRecording}
                    className={`w-full relative overflow-hidden ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                    {isRecording && (
                      <div className="absolute inset-0 bg-red-400 opacity-30 animate-pulse"></div>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                    <Pause className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                    <SkipForward className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50">
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Real-time audio visualization */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Audio Levels</div>
                  <div className="flex items-center gap-1 h-8">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm transition-all duration-150 ${
                          isRecording && i < 8
                            ? 'bg-orange-500'
                            : 'bg-gray-200'
                        }`}
                        style={{
                          height: isRecording ? `${Math.random() * 100 + 10}%` : '20%',
                          animationDelay: `${i * 50}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* System Monitoring */}
            <Card className="border-blue-100">
              <CardHeader className="border-b border-blue-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  System Health
                  <Badge variant="outline" className="ml-auto text-xs border-green-200 text-green-700">
                    Optimal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className={`font-medium ${
                        metric.status === 'good' ? 'text-green-600' :
                        metric.status === 'warning' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded">
                      <div 
                        className={`h-1 rounded transition-all duration-500 ${
                          metric.status === 'good' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px] shadow-lg border-slate-100">
              <CardContent className="p-6">
                {renderStageContent()}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" disabled={currentStage === 1} className="border-slate-200">
                Previous Stage
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNotepad(!showNotepad)}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  {showNotepad ? 'Hide' : 'Show'} AI Assistant
                </Button>
                <Button onClick={nextStage} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg">
                  {currentStage === stages.length ? 'Complete Interview' : 'Continue to Next Stage'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Right Panel - Activity Feed & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Advanced Code Editor & AI Assistant */}
            {showNotepad && (
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-slate-600" />
                      <span>AI Code Assistant</span>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Filter className="w-3 h-3 mr-1" />
                        Format
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotepad(false)}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Code Editor Header */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        solution.js
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                          Modified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Auto-save</span>
                      </div>
                    </div>
                    
                    <Textarea
                      value={notepadContent}
                      onChange={(e) => setNotepadContent(e.target.value)}
                      className="min-h-[250px] font-mono text-sm border-0 resize-none focus-visible:ring-0 bg-slate-50/50"
                      placeholder="// Write your code here...\n// AI will provide real-time suggestions"
                    />
                    
                    {/* AI Analysis Panel */}
                    <div className="p-3 bg-orange-50 border-t border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">AI Analysis</span>
                        <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 ml-auto">
                          Complexity: O(n²)
                        </Badge>
                      </div>
                      <p className="text-xs text-orange-600 mb-3">Consider memoization for optimization. Current solution has exponential time complexity.</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                          Optimize
                        </Button>
                        <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50 text-xs">
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Real-time Activity Feed */}
            <Card className="border-purple-100">
              <CardHeader className="border-b border-purple-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Live Activity
                  <Badge variant="outline" className="ml-auto text-xs border-purple-200 text-purple-700">
                    {activityFeed.length} events
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {activityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 group">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-orange-500' :
                          'bg-blue-500'
                        } group-hover:scale-125 transition-transform`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Enhanced Session Stats */}
            <Card className="border-emerald-100">
              <CardHeader className="border-b border-emerald-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-emerald-500" />
                  Session Analytics
                  <Button variant="ghost" size="sm" className="ml-auto p-1">
                    <Eye className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-lg font-bold text-emerald-700">15:32</div>
                    <div className="text-xs text-emerald-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-lg font-bold text-blue-700">8/12</div>
                    <div className="text-xs text-blue-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="text-lg font-bold text-orange-700">94%</div>
                    <div className="text-xs text-orange-600">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-lg font-bold text-purple-700">A+</div>
                    <div className="text-xs text-purple-600">Grade</div>
                  </div>
                </div>
                
                {/* Mini Progress Indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Interview Progress</span>
                    <span className="font-medium">{Math.round((currentStage / 7) * 100)}%</span>
                  </div>
                  <Progress value={(currentStage / 7) * 100} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Response Quality</span>
                    <span className="font-medium text-green-600">High</span>
                  </div>
                  <Progress value={87} className="h-1" />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Quick Actions */}
            <Card className="border-slate-100">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-slate-500" />
                  Quick Actions
                  <Button variant="ghost" size="sm" className="ml-auto p-1">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Eye className="w-3 h-3 mr-1" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                  <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Brain className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                </div>
                
                <Separator className="my-3" />
                
                <Button variant="outline" className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <XCircle className="w-4 h-4 mr-2" />
                  End Interview
                </Button>
                
                <div className="pt-2 space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                    <Shield className="w-3 h-3 mr-2" />
                    Security Settings
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                    <Globe className="w-3 h-3 mr-2" />
                    Share Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewerDashboard;