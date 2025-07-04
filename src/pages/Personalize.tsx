import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Personalize = () => {
  return (
    <MainLayout>
      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Personalize</h1>
                <p className="text-xl text-muted-foreground">Differentiate instruction for every learner</p>
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  Learning Styles Adapter
                </CardTitle>
                <CardDescription>
                  Generate content tailored to different learning styles - visual, auditory, and kinesthetic.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Adapt Content
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                      <path d="M12 2v2"/>
                      <path d="M12 22v-2"/>
                      <path d="M2 12h2"/>
                      <path d="M20 12h2"/>
                    </svg>
                  </div>
                  Difficulty Adjuster
                </CardTitle>
                <CardDescription>
                  Automatically adjust content difficulty based on individual student needs and abilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Adjust Difficulty
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="M8 9h8"/>
                      <path d="M8 13h6"/>
                    </svg>
                  </div>
                  IEP Support Tools
                </CardTitle>
                <CardDescription>
                  Create accommodations and modifications aligned with Individualized Education Programs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Support IEP
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </div>
                  Language Learner Support
                </CardTitle>
                <CardDescription>
                  Generate multilingual content and scaffolding for English Language Learners.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Support ELL
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
                  Enrichment Activities
                </CardTitle>
                <CardDescription>
                  Create challenging extensions for advanced learners and gifted students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Create Extensions
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 12h.01"/>
                      <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      <path d="M22 13a18.15 18.15 0 0 1-20 0"/>
                      <rect width="20" height="14" x="2" y="6" rx="2"/>
                    </svg>
                  </div>
                  Intervention Builder
                </CardTitle>
                <CardDescription>
                  Design targeted interventions for students who need additional support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Build Intervention
                </GradientButton>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Every student deserves personalized learning
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use AI to create tailored educational experiences that meet each student where they are and help them reach their full potential.
            </p>
            <GradientButton className="text-lg px-8 py-3">
              Start Personalizing
            </GradientButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Personalize;