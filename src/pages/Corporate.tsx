
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

          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Upskill Your Team with AI-Powered Learning</h2>
              <p className="text-lg mb-8">
                Our enterprise solutions provide customized learning paths tailored to your organization's specific needs and objectives.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-2">Customized Learning Paths</span>
                    <p className="text-muted-foreground text-sm">Tailored curriculum designed for your team's specific skill gaps and objectives.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-2">Centralized Management</span>
                    <p className="text-muted-foreground text-sm">Administrative dashboard to track team progress and performance.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-2">Volume Discounts</span>
                    <p className="text-muted-foreground text-sm">Special pricing for team accounts with bulk user licenses.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button size="lg" onClick={handleContactSales}>
                Contact Sales
              </Button>
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
