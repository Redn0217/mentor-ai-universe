import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';

const Communicate = () => {
  return (
    <DashboardLayout>
      <div className="py-16 bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2 17 6.5"/>
                  <path d="m21.5 2-5.5 5.5L14 4l-1 1-2-2-4 4v4l2 2 1-1h4l4-4-2-2 1-1 3.5 2.5Z"/>
                  <path d="M7.5 8.5 4 12l6 6h8l-6-6Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Communicate</h1>
                <p className="text-xl text-muted-foreground">Write clear, thoughtful messages for everyone</p>
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="M8 9h8"/>
                      <path d="M8 13h6"/>
                    </svg>
                  </div>
                  Parent Communication
                </CardTitle>
                <CardDescription>
                  Generate thoughtful messages for parent-teacher conferences and updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Write to Parents
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
                  Student Feedback
                </CardTitle>
                <CardDescription>
                  Create personalized, encouraging feedback messages for student work and behavior.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Give Feedback
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  Email Templates
                </CardTitle>
                <CardDescription>
                  Professional email templates for various school communication scenarios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Create Email
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  Newsletter Creator
                </CardTitle>
                <CardDescription>
                  Generate engaging classroom newsletters to keep families informed and connected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Create Newsletter
                </GradientButton>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  Behavior Reports
                </CardTitle>
                <CardDescription>
                  Write clear, objective behavior reports and incident documentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Write Report
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
                  Colleague Collaboration
                </CardTitle>
                <CardDescription>
                  Craft professional messages for team meetings, planning sessions, and collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientButton className="w-full">
                  Collaborate
                </GradientButton>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Build stronger connections through better communication
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Save time writing emails, messages, and reports while maintaining a professional, caring tone that strengthens relationships.
            </p>
            <GradientButton className="text-lg px-8 py-3">
              Start Communicating
            </GradientButton>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Communicate;