import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Create = () => {
  return (
    <MainLayout>
      <div className="py-16 bg-gradient-to-br from-pink-50 via-white to-pink-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Create</h1>
                <p className="text-xl text-muted-foreground">Plan faster with AI-powered lesson creation tools</p>
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                  Lesson Planner
                </CardTitle>
                <CardDescription>
                  Generate complete lesson plans with objectives, activities, and assessments in minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Start Creating
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4 4V12z"/>
                    </svg>
                  </div>
                  Rubric Generator
                </CardTitle>
                <CardDescription>
                  Create detailed rubrics for any assignment or project with customizable criteria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Generate Rubric
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  Warm-up Activities
                </CardTitle>
                <CardDescription>
                  Generate engaging warm-up activities to start your classes with energy and focus.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Create Warm-ups
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M8 2v4l-4 4 4 4v4h8v-4l4-4-4-4V2z"/>
                    </svg>
                  </div>
                  Worksheet Builder
                </CardTitle>
                <CardDescription>
                  Build custom worksheets and practice materials tailored to your curriculum.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Build Worksheet
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M7 8h10M7 12h4m1 8l-2-2 2-2"/>
                    </svg>
                  </div>
                  Presentation Maker
                </CardTitle>
                <CardDescription>
                  Create engaging presentations with AI-generated slides and content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Make Presentation
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  </div>
                  Activity Templates
                </CardTitle>
                <CardDescription>
                  Access a library of customizable activity templates for various subjects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Browse Templates
                </GradientButton>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to revolutionize your lesson planning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start creating engaging, effective lessons with our AI-powered tools. Save hours of planning time every week.
            </p>
            <GradientButton className="text-lg px-8 py-3">
              Get Started for Free
            </GradientButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Create;