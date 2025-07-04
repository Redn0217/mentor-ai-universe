
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, CheckCircle, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Corporate = () => {
  const navigate = useNavigate();

  const handleContactSales = () => {
    navigate('/contact', { state: { subject: 'Corporate Training Partnership' } });
  };

  return (
    <MainLayout>
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Enterprise Training Solutions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Customized learning experiences for teams and organizations of all sizes.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Upskill Your Team with AI-Powered Learning</h2>
              <p className="text-lg mb-6">
                Our enterprise solutions provide customized learning paths tailored to your organization's specific needs and objectives.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Customized Learning Paths</span>
                    <p className="text-muted-foreground">Tailored curriculum designed for your team's specific skill gaps and objectives.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Centralized Management</span>
                    <p className="text-muted-foreground">Administrative dashboard to track team progress and performance.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Volume Discounts</span>
                    <p className="text-muted-foreground">Special pricing for team accounts with bulk user licenses.</p>
                  </div>
                </li>
              </ul>
              <Button size="lg" onClick={handleContactSales}>
                Contact Sales
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex justify-between mb-8">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Current Partners Include:</h3>
                </div>
                <Badge variant="outline" className="h-fit">
                  Enterprise Partners
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
                  <span className="text-lg font-bold text-gray-400">ACME Corp</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
                  <span className="text-lg font-bold text-gray-400">TechGiant</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
                  <span className="text-lg font-bold text-gray-400">InnovateCo</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg h-24">
                  <span className="text-lg font-bold text-gray-400">FutureTech</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Enterprise Training Solutions</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-3 w-fit rounded-lg mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Team Training</CardTitle>
                  <CardDescription>Perfect for department-level skill development</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>10-50 user licenses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Team progress dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basic customization options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Shared learning projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Group analytics</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-6" onClick={handleContactSales}>
                    Get a Quote
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <div className="bg-primary/10 p-3 w-fit rounded-lg mb-4">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle>Organization Plan</CardTitle>
                    <Badge className="bg-primary">Popular</Badge>
                  </div>
                  <CardDescription>Complete solution for mid-size companies</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>50-500 user licenses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Advanced admin controls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Custom learning paths</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" onClick={handleContactSales}>
                    <Zap className="mr-2 h-4 w-4" />
                    Get a Quote
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="bg-primary/10 p-3 w-fit rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 17V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z"/>
                      <path d="M16 3v4"/>
                      <path d="M4 7h2"/>
                      <path d="M4 11h2"/>
                      <path d="M4 15h2"/>
                      <path d="M4 19h2"/>
                    </svg>
                  </div>
                  <CardTitle>Enterprise Solution</CardTitle>
                  <CardDescription>For large organizations with complex needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>500+ user licenses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Full white-label options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>API access & integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Custom content development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>24/7 dedicated support</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-6" onClick={handleContactSales}>
                    Get a Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </div>
                <p className="mb-6 italic">
                  "Implementing this AI-driven learning platform has significantly accelerated our team's skill development. The customized learning paths and detailed analytics have been invaluable for our L&D strategy."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">CTO, TechGiant Inc.</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </div>
                <p className="mb-6 italic">
                  "We've seen a 40% improvement in technical proficiency across our engineering team since adopting this platform. The AI tutors provide personalized support that scales with our growing organization."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">VP of Engineering, InnovateCo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your team's skills?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Schedule a consultation with our enterprise team to create a customized training solution.
            </p>
            <Button size="lg" onClick={handleContactSales}>
              Request a Demo
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Corporate;
