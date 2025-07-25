import React, { useState, useEffect } from 'react';
import {
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
  Activity,
  TrendingUp,
  Users,
  Award,
  LineChart,
  PieChart,
  Zap,
  Filter,
  CheckSquare
} from 'lucide-react';
import RobustAnimatedSphere from '@/components/RobustAnimatedSphere';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface StageData {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
  icon: React.ReactNode;
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



const AIInterviewerDashboard: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{id: string, speaker: 'ai' | 'user', message: string, timestamp: string}>>([]);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0.3); // Default amplitude for visual effect
  const [showNotepad, setShowNotepad] = useState(true);
  const [notepadContent, setNotepadContent] = useState(`// AI Interview Code Challenge
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// TODO: Optimize this solution
console.log(fibonacci(10));`);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'analysis',
      message: 'AI analyzed code complexity: O(n²) detected',
      timestamp: '2 min ago',
      status: 'warning'
    },
    {
      id: '2',
      type: 'system',
      message: 'Optimization suggestion: Consider memoization',
      timestamp: '1 min ago',
      status: 'info'
    },
    {
      id: '3',
      type: 'system',
      message: 'Code formatting completed successfully',
      timestamp: '30 sec ago',
      status: 'success'
    }
  ]);

  // Stage-specific conversation starters
  const getStageConversation = (stage: number) => {
    const stageConversations = {
      2: [{ // Warm-up
        id: '1',
        speaker: 'ai' as const,
        message: 'Hello! I\'m your AI interviewer. I\'m excited to get to know you better. Shall we begin with you telling me a bit about yourself?',
        timestamp: new Date().toLocaleTimeString()
      }],
      3: [{ // Knowledge Assessment
        id: '1',
        speaker: 'ai' as const,
        message: 'Great! Now let\'s dive into some technical questions to assess your knowledge. Can you explain the difference between \'let\', \'const\', and \'var\' in JavaScript and when you would use each one?',
        timestamp: new Date().toLocaleTimeString()
      }],
      4: [{ // Deep Dive
        id: '1',
        speaker: 'ai' as const,
        message: 'Excellent technical knowledge! Now I\'d like to learn more about your practical experience. Can you walk me through a challenging project you\'ve worked on recently? What technologies did you use and what obstacles did you overcome?',
        timestamp: new Date().toLocaleTimeString()
      }],
      5: [{ // Follow-up
        id: '1',
        speaker: 'ai' as const,
        message: 'Thank you for sharing those insights! I have a few follow-up questions to better understand your experience. You mentioned working with React - can you describe a specific performance optimization you implemented and the impact it had?',
        timestamp: new Date().toLocaleTimeString()
      }]
    };
    return stageConversations[stage] || [];
  };


  const stageTemplates = [
    { id: 0, title: 'Role Selection', icon: <Target className="w-4 h-4" /> },
    { id: 1, title: 'Resume Upload', icon: <Upload className="w-4 h-4" /> },
    { id: 2, title: 'Warm-up', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 3, title: 'Knowledge Assessment', icon: <Brain className="w-4 h-4" /> },
    { id: 4, title: 'Deep Dive', icon: <FileText className="w-4 h-4" /> },
    { id: 5, title: 'Follow-up', icon: <User className="w-4 h-4" /> },
    { id: 6, title: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const stages: StageData[] = stageTemplates.map((stage, index) => ({
    ...stage,
    status: index < currentStage ? 'completed' : index === currentStage ? 'current' : 'pending'
  }));

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
      title: 'Session Duration',
      value: '15:32',
      change: +2,
      trend: 'up',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-purple-600'
    }
  ];





  // Initialize conversation when stage changes
  useEffect(() => {
    const stageConversation = getStageConversation(currentStage);
    if (stageConversation.length > 0) {
      setConversationHistory(stageConversation);
    }

    // Automatically activate AI sphere when entering conversational stages
    if (currentStage >= 2) {
      setIsListening(true);

      // Add activity feed item when code editor becomes available
      if (currentStage === 2) {
        setActivityFeed(prev => [{
          id: Date.now().toString(),
          type: 'system',
          message: 'AI Code Assistant activated - Ready for technical challenges',
          timestamp: 'Just now',
          status: 'success'
        }, ...prev]);
      }

      // Enhanced voice amplitude simulation for more dynamic visual effects
      const amplitudeInterval = setInterval(() => {
        if (!isAISpeaking) {
          // Listening state: moderate, natural amplitude variations
          setVoiceAmplitude(0.3 + Math.sin(Date.now() * 0.003) * 0.2 + Math.random() * 0.1);
        }
      }, 50); // Faster updates for smoother animation

      return () => clearInterval(amplitudeInterval);
    } else {
      setIsListening(false);
      setVoiceAmplitude(0.1);
    }
  }, [currentStage, isAISpeaking]);

  const simulateAIResponse = () => {
    setIsAISpeaking(true);

    // Enhanced voice amplitude during AI speaking with more realistic patterns
    const speakingInterval = setInterval(() => {
      // Create more natural speaking patterns with pauses and emphasis
      const time = Date.now() * 0.001;
      const baseAmplitude = 0.7;
      const variation = Math.sin(time * 3) * 0.2 + Math.sin(time * 7) * 0.1;
      const randomNoise = (Math.random() - 0.5) * 0.3;
      const finalAmplitude = Math.max(0.4, Math.min(1.0, baseAmplitude + variation + randomNoise));
      setVoiceAmplitude(finalAmplitude);
    }, 30); // Even faster updates for more fluid animation

    setTimeout(() => {
      const stageResponses = {
        2: [ // Warm-up
          "That's interesting! Can you tell me more about that experience?",
          "I see. How did you handle the challenges you faced?",
          "Great! What would you say was your biggest learning from that project?",
          "That sounds like a complex problem. Walk me through your thought process.",
          "Excellent! How do you think that experience prepared you for this role?"
        ],
        3: [ // Knowledge Assessment
          "Good explanation! Now, can you describe what happens during the event loop in JavaScript?",
          "Interesting approach! How would you optimize a React component that's re-rendering too frequently?",
          "That's correct! Can you explain the difference between SQL and NoSQL databases and when you'd use each?",
          "Nice! What are some common security vulnerabilities in web applications and how do you prevent them?",
          "Excellent! How would you implement authentication and authorization in a modern web application?"
        ],
        4: [ // Deep Dive
          "That's a fascinating project! What was the most challenging technical decision you had to make?",
          "Impressive! How did you ensure code quality and maintainability across the team?",
          "Great problem-solving! Can you describe how you handled scalability concerns?",
          "Interesting architecture! What would you do differently if you were to rebuild this project today?",
          "Excellent leadership! How did you handle disagreements or conflicts within the development team?"
        ],
        5: [ // Follow-up
          "That's a great insight! Can you elaborate on the specific metrics you used to measure success?",
          "Interesting point! How do you stay updated with the latest technologies and best practices?",
          "Good approach! What's your process for debugging complex issues in production?",
          "Excellent! How do you balance technical debt with feature development in your projects?",
          "Great perspective! What advice would you give to junior developers joining your team?"
        ]
      };

      const responses = stageResponses[currentStage] || stageResponses[2];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setConversationHistory(prev => [...prev, {
        id: Date.now().toString(),
        speaker: 'ai',
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString()
      }]);

      clearInterval(speakingInterval);
      setIsAISpeaking(false);
      // Return to normal listening amplitude
      setVoiceAmplitude(0.2 + Math.random() * 0.3);
    }, 2000);
  };

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  // Reusable conversational interface component
  const ConversationalInterface = () => (
    <div className="space-y-8">
      {/* AI Avatar - Centered at Top */}
      <div className="flex justify-center">
        <Card className="border-orange-100 shadow-lg p-8 text-center">
          <div className="relative mb-6">
            {/* AI Animated Sphere - Enlarged */}
            <div className="w-96 h-96 mx-auto lg:w-[28rem] lg:h-[28rem]">
              <RobustAnimatedSphere
                voiceAmplitude={voiceAmplitude}
                isListening={isListening}
                isSpeaking={isAISpeaking}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            {/* Enhanced Status indicator */}
            <div className="mt-6 space-y-3">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
                isAISpeaking
                  ? 'bg-gradient-to-r from-pink-50 to-red-50 text-pink-700 border-pink-200 shadow-lg'
                  : isListening
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-lg'
                  : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200'
              }`}>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isAISpeaking
                    ? 'bg-pink-500 animate-pulse shadow-lg shadow-pink-300'
                    : isListening
                    ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-300'
                    : 'bg-gray-500'
                }`}></div>
                <span className="font-semibold">
                  {isAISpeaking ? 'AI Speaking...' : isListening ? 'Listening...' : 'Ready'}
                </span>
                <div className="text-xs opacity-75 ml-2">
                  Amplitude: {voiceAmplitude.toFixed(2)}
                </div>
              </div>

              {/* Visual amplitude bar */}
              <div className="w-32 mx-auto">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${
                      isAISpeaking
                        ? 'bg-gradient-to-r from-pink-400 to-red-500'
                        : isListening
                        ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${voiceAmplitude * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Conversation Panel - Below AI Avatar */}
      <Card className="border-orange-100 shadow-lg">
        <CardHeader className="border-b border-orange-50 bg-gradient-to-r from-orange-50 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Live Conversation
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4 pr-4">
              {conversationHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-xl shadow-sm border ${
                    msg.speaker === 'ai'
                      ? 'bg-orange-50 border-orange-100 text-orange-900'
                      : 'bg-blue-50 border-blue-100 text-blue-900'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        msg.speaker === 'ai' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-xs font-medium capitalize">{msg.speaker === 'ai' ? 'AI Interviewer' : 'You'}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
              {/* Typing indicator when AI is speaking */}
              {isAISpeaking && (
                <div className="flex justify-start">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Voice Input Area */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your response..."
                className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentMessage.trim()) {
                    setConversationHistory(prev => [...prev, {
                      id: Date.now().toString(),
                      speaker: 'user',
                      message: currentMessage,
                      timestamp: new Date().toLocaleTimeString()
                    }]);
                    setCurrentMessage('');
                    simulateAIResponse();
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (currentMessage.trim()) {
                    setConversationHistory(prev => [...prev, {
                      id: Date.now().toString(),
                      speaker: 'user',
                      message: currentMessage,
                      timestamp: new Date().toLocaleTimeString()
                    }]);
                    setCurrentMessage('');
                    simulateAIResponse();
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Send
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                💡 This is a real-time conversation. The AI will respond naturally to your answers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStageContent = () => {
    switch (currentStage) {
      case 0:
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

      case 1:
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

      case 2:
        return <ConversationalInterface />;

      case 6:
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

      case 3:
        return <ConversationalInterface />;

      case 4:
        return <ConversationalInterface />;

      case 5:
        return <ConversationalInterface />;

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{stageTemplates[currentStage]?.title || `Stage ${currentStage + 1}`} - In Progress</h2>
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
                    <Activity className="w-3 h-3 text-green-500" />
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
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Audio: 98.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
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
                <MessageSquare className="w-4 h-4" />
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
        {/* Enhanced Tech AI Progress Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative overflow-hidden rounded-lg border border-orange-200/50 bg-gradient-to-br from-orange-50/80 via-orange-50/30 to-orange-100/20 backdrop-blur-sm shadow-lg">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-400/20 to-orange-600/20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="grid grid-cols-12 h-full opacity-30">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-r border-orange-200/30 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-orange-400/60 rounded-full animate-bounce"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + i * 0.3}s`
                  }}
                />
              ))}
            </div>

            <div className="relative p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Enhanced Stage Icon */}
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-all duration-500 ${
                      stages[currentStage]?.status === 'completed'
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-600'
                        : 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-600'
                    }`}>
                      {stages[currentStage]?.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 animate-pulse" />
                      ) : (
                        <div className="relative">
                          {React.cloneElement(stages[currentStage]?.icon as React.ReactElement, { className: "w-4 h-4" })}
                          <div className="absolute inset-0 animate-ping opacity-30">
                            {React.cloneElement(stages[currentStage]?.icon as React.ReactElement, { className: "w-4 h-4" })}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Neural Network Nodes */}
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }}></div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {stages[currentStage]?.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      <span className="text-orange-600 font-semibold">STAGE_{String(currentStage + 1).padStart(2, '0')}</span>
                      <span className="mx-1 text-slate-400">|</span>
                      <span className="text-orange-500">{Math.round(((currentStage + 1) / stages.length) * 100)}%</span>
                      <span className="mx-1 text-slate-400">|</span>
                      <span className="text-orange-600">PROCESSING</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold font-mono bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {Math.round(((currentStage + 1) / stages.length) * 100)}%
                  </div>
                  <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                    COMPLETION
                  </div>
                </div>
              </div>

              {/* Advanced Progress Bar */}
              <div className="relative mb-2">
                {/* Background Track */}
                <div className="h-2 bg-gradient-to-r from-orange-100/50 to-orange-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                  {/* Animated Progress Fill */}
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                    style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                  >
                    {/* Data Flow Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>

                {/* Enhanced Stage Markers */}
                <div className="flex justify-between absolute -top-1 left-0 right-0">
                  {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className={`relative w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        index <= currentStage
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-white shadow-md'
                          : 'bg-slate-200 border-slate-300'
                      }`}
                    >
                      {index <= currentStage && (
                        <>
                          <CheckCircle className="w-2 h-2 text-white" />
                          {index === currentStage && (
                            <div className="absolute inset-0 rounded-full bg-orange-400/30 animate-ping"></div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Simplified Stage Labels */}
              <div className="flex justify-between text-xs font-mono mt-2">
                {stages.map((stage, index) => (
                  <span
                    key={stage.id}
                    className={`transition-all duration-300 ${
                      index === currentStage
                        ? 'text-orange-600 font-semibold'
                        : index < currentStage
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.title.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next Button - Outside the progress bar */}
          <Button
            onClick={nextStage}
            className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg border-0 px-4 py-2 group transition-all duration-300 flex-shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 font-medium text-sm">
              {currentStage === stages.length - 1 ? 'Complete' : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Advanced Metrics Dashboard - Only show in Analytics stage */}
        {currentStage === 6 && (
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
                     metric.trend === 'down' ? <TrendingUp className="w-3 h-3 rotate-180" /> :
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Advanced Sidebar - Progress Tracker & System Monitoring */}
          <div className="lg:col-span-1 space-y-6">


            {/* Conversation Insights */}
            <Card className="border-orange-100">
              <CardHeader className="border-b border-orange-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  {currentStage >= 2 ? 'Conversation Insights' : 'Stage Overview'}
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                      {currentStage >= 2 ? 'Live' : 'Ready'}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStage >= 2 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{conversationHistory.length}</div>
                        <div className="text-xs text-muted-foreground">Messages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {conversationHistory.filter(msg => msg.speaker === 'user').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Your Responses</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Conversation Flow</div>
                      <div className="flex items-center gap-1">
                        {conversationHistory.slice(-8).map((msg, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              msg.speaker === 'ai' ? 'bg-orange-400' : 'bg-blue-400'
                            }`}
                            title={msg.speaker === 'ai' ? 'AI Message' : 'Your Message'}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        isAISpeaking
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          isAISpeaking ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                        }`}></div>
                        {isAISpeaking ? 'AI is thinking...' : 'Ready for your response'}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Complete the setup stages to begin your AI interview conversation
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-400">--</div>
                        <div className="text-xs text-muted-foreground">Messages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-400">--</div>
                        <div className="text-xs text-muted-foreground">Responses</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions - Only show in Analytics stage */}
            {currentStage === 6 && (
              <Card className="border-slate-100">
                <CardHeader className="border-b border-slate-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-slate-500" />
                    Quick Actions
                    <Button variant="ghost" size="sm" className="ml-auto p-1">
                      <Settings className="w-3 h-3" />
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
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                      <Clock className="w-3 h-3 mr-1" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                      <Brain className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                  </div>

                  <Separator className="my-3" />

                  <Button variant="outline" className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    End Interview
                  </Button>

                  <div className="pt-2 space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      <Settings className="w-3 h-3 mr-2" />
                      Security Settings
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                      <Users className="w-3 h-3 mr-2" />
                      Share Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px] shadow-lg border-slate-100">
              <CardContent className="p-6">
                {renderStageContent()}
              </CardContent>
            </Card>


          </div>

          {/* Advanced Right Panel - Activity Feed & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Advanced Code Editor & AI Assistant - Only show during live interview (stage 2+) but not in Analytics */}
            {showNotepad && currentStage >= 2 && currentStage !== 6 && (
              <Card className="border-slate-200 shadow-lg animate-in slide-in-from-right-5 duration-500">
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

            {/* Real-time Activity Feed - Hide in Analytics Dashboard */}
            {currentStage !== 6 && (
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
            )}

            {/* Enhanced Session Stats - Only show in Analytics stage */}
            {currentStage === 6 && (
              <Card className="border-emerald-100">
              <CardHeader className="border-b border-emerald-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-emerald-500" />
                  Session Analytics
                  <Button variant="ghost" size="sm" className="ml-auto p-1">
                    <BarChart3 className="w-3 h-3" />
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
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Response Quality</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                  <Progress value={94} className="h-1" />

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Confidence Score</span>
                    <span className="font-medium text-blue-600">87/100</span>
                  </div>
                  <Progress value={87} className="h-1" />

                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg Response Time</span>
                    <span className="font-medium text-orange-600">1.2s</span>
                  </div>
                  <Progress value={75} className="h-1" />
                </div>
              </CardContent>
            </Card>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewerDashboard;