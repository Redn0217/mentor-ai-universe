
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, Code, FileCheck, FileText, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Certification {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  duration: string;
  modules: number;
  requirements: string[];
  icon: React.ReactNode;
}

const Certifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const certifications: Certification[] = [
    {
      id: 'python-dev',
      title: 'Python Developer',
      description: 'Master Python programming from basics to advanced concepts',
      level: 'beginner',
      price: 99,
      duration: '3 months',
      modules: 12,
      requirements: [
        'Complete all Python modules',
        'Build 3 projects',
        'Pass the final assessment with 80% or higher'
      ],
      icon: <Code className="h-10 w-10" />
    },
    {
      id: 'devops',
      title: 'DevOps Professional',
      description: 'Learn CI/CD, containerization, and cloud deployment',
      level: 'intermediate',
      price: 149,
      duration: '4 months',
      modules: 15,
      requirements: [
        'Complete all DevOps modules',
        'Set up a CI/CD pipeline',
        'Deploy applications to cloud platforms',
        'Pass the final assessment with 80% or higher'
      ],
      icon: <FileCheck className="h-10 w-10" />
    },
    {
      id: 'ai-engineer',
      title: 'AI Engineer',
      description: 'Develop skills in machine learning and artificial intelligence',
      level: 'advanced',
      price: 199,
      duration: '6 months',
      modules: 20,
      requirements: [
        'Complete all AI & ML modules',
        'Build a machine learning model',
        'Complete a capstone project',
        'Pass the final assessment with 80% or higher'
      ],
      icon: <Star className="h-10 w-10" />
    },
    {
      id: 'cloud-architect',
      title: 'Cloud Architect',
      description: 'Design and implement scalable cloud solutions',
      level: 'advanced',
      price: 249,
      duration: '5 months',
      modules: 18,
      requirements: [
        'Complete all Cloud Computing modules',
        'Design a multi-tier cloud architecture',
        'Implement security best practices',
        'Pass the final assessment with 80% or higher'
      ],
      icon: <FileText className="h-10 w-10" />
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'advanced':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleEnroll = (certification: Certification) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in this certification program",
      });
      navigate('/login', { state: { redirectTo: '/certifications' } });
      return;
    }

    toast({
      title: "Redirecting to Payment",
      description: `Preparing your enrollment for ${certification.title} certification`,
    });
    
    // In a real implementation, redirect to payment processing
    // This is a placeholder for the actual payment flow
    setTimeout(() => {
      toast({
        title: "Enrollment Successful",
        description: "You've been enrolled in the certification program",
      });
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Industry-Recognized Certifications</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Validate your skills with our comprehensive certification programs designed by industry experts.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {certifications.map((cert) => (
              <Card key={cert.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        {cert.icon}
                      </div>
                      <div>
                        <CardTitle>{cert.title}</CardTitle>
                        <Badge className={`mt-2 ${getLevelColor(cert.level)}`}>
                          {cert.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${cert.price}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {cert.duration}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-4">{cert.description}</p>
                  <div className="bg-muted p-3 rounded mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{cert.modules} Modules</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Complete structured learning path with hands-on projects
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {cert.requirements.map((req, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleEnroll(cert)} className="w-full">
                    <Award className="mr-2 h-4 w-4" />
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Why Get Certified?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Badge className="mt-1 bg-primary text-white">1</Badge>
                    <div>
                      <h3 className="font-semibold mb-1">Industry Recognition</h3>
                      <p className="text-muted-foreground">Our certifications are recognized by leading tech companies worldwide.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="mt-1 bg-primary text-white">2</Badge>
                    <div>
                      <h3 className="font-semibold mb-1">Practical Skills</h3>
                      <p className="text-muted-foreground">Gain hands-on experience through real-world projects and assessments.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="mt-1 bg-primary text-white">3</Badge>
                    <div>
                      <h3 className="font-semibold mb-1">Career Advancement</h3>
                      <p className="text-muted-foreground">Add valuable credentials to your resume and stand out to employers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="mt-1 bg-primary text-white">4</Badge>
                    <div>
                      <h3 className="font-semibold mb-1">Structured Learning</h3>
                      <p className="text-muted-foreground">Follow a clear path from beginner to expert with curated content.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <span className="block w-8 h-8 flex items-center justify-center font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Enroll in a Certification Program</h3>
                      <p className="text-muted-foreground">Choose a certification that matches your career goals and current skill level.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <span className="block w-8 h-8 flex items-center justify-center font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Complete the Required Courses</h3>
                      <p className="text-muted-foreground">Work through the modules at your own pace with AI tutor guidance.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <span className="block w-8 h-8 flex items-center justify-center font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Pass the Final Assessment</h3>
                      <p className="text-muted-foreground">Demonstrate your knowledge with a comprehensive exam and practical project.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <span className="block w-8 h-8 flex items-center justify-center font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Receive Your Certificate</h3>
                      <p className="text-muted-foreground">Get your digital certificate and share it on LinkedIn and other platforms.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Certifications;
