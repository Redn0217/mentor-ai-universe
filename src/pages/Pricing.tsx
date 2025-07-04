
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: PlanFeature[];
  highlighted?: boolean;
  buttonText: string;
}

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic access to learning resources',
      price: '$0',
      buttonText: 'Get Started',
      features: [
        { name: 'Access to basic modules', included: true },
        { name: 'Limited AI tutor assistance', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Advanced lessons', included: false },
        { name: 'Code reviews', included: false },
        { name: 'Certification', included: false },
        { name: 'Mentorship', included: false },
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Enhanced learning with AI tutors',
      price: '$19.99/month',
      buttonText: 'Subscribe',
      highlighted: true,
      features: [
        { name: 'Access to all modules', included: true },
        { name: 'Unlimited AI tutor assistance', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Advanced progress analytics', included: true },
        { name: 'Advanced lessons', included: true },
        { name: 'Personal code reviews', included: true },
        { name: 'Certification', included: true },
        { name: 'Mentorship', included: false },
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for teams',
      price: 'Custom pricing',
      buttonText: 'Contact Sales',
      features: [
        { name: 'Everything in Premium', included: true },
        { name: 'Team management', included: true },
        { name: 'Custom learning paths', included: true },
        { name: 'API access', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'White-label option', included: true },
        { name: 'Direct mentorship', included: true },
      ]
    }
  ];

  const handlePlanSelection = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your subscription",
      });
      navigate('/login', { state: { redirectTo: '/pricing' } });
      return;
    }

    if (plan.id === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're all set with our Free plan!",
      });
      navigate('/dashboard');
      return;
    }

    if (plan.id === 'enterprise') {
      navigate('/contact', { state: { subject: 'Enterprise Plan Inquiry' } });
      return;
    }

    // For Premium plan, we'd normally redirect to checkout
    // This is a placeholder for the Stripe integration
    toast({
      title: "Premium Plan Selected",
      description: "Redirecting to payment...",
    });
    // In a real implementation, redirect to Stripe checkout or similar
    // For now, we'll just simulate this with a timeout
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <MainLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Learning Path</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the plan that fits your learning goals, from free access to premium features with personalized support.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <Badge className="bg-primary text-white px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.id === 'premium' && <span className="text-sm text-muted-foreground ml-1">per month</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="h-5 w-5 flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handlePlanSelection(plan)}
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.id === 'premium' && <Zap className="mr-2 h-4 w-4" />}
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Additional Services</h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Validate your skills with official certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">Our certifications are recognized by top tech companies and validate your expertise in specific technologies.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Python Developer Certificate</span>
                      <span className="font-semibold">$99</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>DevOps Professional Certificate</span>
                      <span className="font-semibold">$149</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>AI Engineer Certificate</span>
                      <span className="font-semibold">$199</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => navigate('/certifications')} className="w-full">
                    Explore Certifications
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corporate Training</CardTitle>
                  <CardDescription>Custom solutions for your organization</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-6">We offer customized training programs for teams and organizations of all sizes.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Tailored learning paths</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Team progress tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Custom skill assessments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Volume discounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => navigate('/contact', { state: { subject: 'Corporate Training' } })} className="w-full">
                    Contact Our Team
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mt-16 text-center bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="text-left max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I switch plans later?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade, downgrade, or cancel your plan at any time.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Are there discounts for annual billing?</h3>
                <p className="text-muted-foreground">Yes, we offer a 20% discount when you choose annual billing.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do certifications work?</h3>
                <p className="text-muted-foreground">Complete the required courses, pass the assessment, and receive your digital certificate.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">We offer a 14-day money-back guarantee for all premium plans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing;
