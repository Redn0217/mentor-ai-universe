import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Assess = () => {
  return (
    <MainLayout>
      <div className="py-16 bg-gradient-to-br from-purple-50 via-white to-purple-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Assess</h1>
                <p className="text-xl text-muted-foreground">Design quizzes, generate feedback, and track progress</p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4 4V12z"/>
                    </svg>
                  </div>
                  Quiz Generator
                </CardTitle>
                <CardDescription>
                  Create custom quizzes with multiple choice, short answer, and essay questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Generate Quiz
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                    </svg>
                  </div>
                  Automated Grading
                </CardTitle>
                <CardDescription>
                  Save time with AI-powered grading for objective questions and basic assessments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Start Grading
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="M13 8H7"/>
                      <path d="M17 12H7"/>
                    </svg>
                  </div>
                  Feedback Generator
                </CardTitle>
                <CardDescription>
                  Generate personalized, constructive feedback for student work and assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Create Feedback
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M3 3v18h18"/>
                      <path d="M18 8l-3-3-4 4-4-4-3 3"/>
                    </svg>
                  </div>
                  Progress Tracker
                </CardTitle>
                <CardDescription>
                  Monitor student progress with detailed analytics and visual progress reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  View Progress
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  Class Analytics
                </CardTitle>
                <CardDescription>
                  Analyze class performance trends and identify areas for improvement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  View Analytics
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  Rubric Assessor
                </CardTitle>
                <CardDescription>
                  Use AI to score assignments against custom rubrics consistently and fairly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Assess with Rubric
                </GradientButton>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Transform your assessment process
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline grading, provide better feedback, and track student progress with our comprehensive assessment tools.
            </p>
            <GradientButton className="text-lg px-8 py-3">
              Start Assessing
            </GradientButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Assess;