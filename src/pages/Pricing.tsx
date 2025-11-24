
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Calendar, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { razorpayService, RazorpayPaymentResponse } from '@/services/razorpayService';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  features: PlanFeature[];
  highlighted?: boolean;
  buttonText: string;
  icon: any;
  savings?: string;
}

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processingPayment, setProcessingPayment] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: '1-month',
      name: '1 Month',
      duration: '1 Month',
      description: 'Perfect for trying out our platform',
      price: 499,
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'AI-powered learning assistant', included: true },
        { name: 'Progress tracking & analytics', included: true },
        { name: 'Interactive coding exercises', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Certificate of completion', included: true },
        { name: 'Priority support', included: false },
        { name: 'Downloadable resources', included: false },
      ],
      buttonText: 'Purchase',
      icon: Calendar,
    },
    {
      id: '3-months',
      name: '3 Months',
      duration: '3 Months',
      description: 'Great for focused learning',
      price: 1299,
      originalPrice: 1497,
      discount: '13% OFF',
      savings: 'Save ₹198',
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'AI-powered learning assistant', included: true },
        { name: 'Progress tracking & analytics', included: true },
        { name: 'Interactive coding exercises', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Certificate of completion', included: true },
        { name: 'Priority support', included: true },
        { name: 'Downloadable resources', included: true },
      ],
      buttonText: 'Purchase',
      icon: TrendingUp,
    },
    {
      id: '6-months',
      name: '6 Months',
      duration: '6 Months',
      description: 'Best for career growth',
      price: 2399,
      originalPrice: 2994,
      discount: '20% OFF',
      savings: 'Save ₹595',
      highlighted: true,
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'AI-powered learning assistant', included: true },
        { name: 'Progress tracking & analytics', included: true },
        { name: 'Interactive coding exercises', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Certificate of completion', included: true },
        { name: 'Priority support', included: true },
        { name: 'Downloadable resources', included: true },
        { name: 'Career guidance', included: true },
      ],
      buttonText: 'Purchase',
      icon: Crown,
    },
    {
      id: '12-months',
      name: '12 Months',
      duration: '1 Year',
      description: 'Best value for serious learners',
      price: 3999,
      originalPrice: 5988,
      discount: '33% OFF',
      savings: 'Save ₹1,989',
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'AI-powered learning assistant', included: true },
        { name: 'Progress tracking & analytics', included: true },
        { name: 'Interactive coding exercises', included: true },
        { name: 'Community forum access', included: true },
        { name: 'Certificate of completion', included: true },
        { name: 'Priority support', included: true },
        { name: 'Downloadable resources', included: true },
        { name: 'Career guidance & resume review', included: true },
        { name: 'Job placement assistance', included: true },
        { name: 'Lifetime access to course updates', included: true },
      ],
      buttonText: 'Purchase',
      icon: Sparkles,
    },
  ];

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive"
      });
      navigate('/login', { state: { redirectTo: '/pricing' } });
      return;
    }

    if (processingPayment) {
      return;
    }

    setProcessingPayment(true);

    try {
      // Get duration in months
      const durationMap: Record<string, number> = {
        '1-month': 1,
        '3-months': 3,
        '6-months': 6,
        '12-months': 12,
      };

      const durationMonths = durationMap[plan.id] || 1;

      // Get user details
      const userName = user.email?.split('@')[0] || 'User';
      const userEmail = user.email || '';

      // Open Razorpay checkout
      await razorpayService.openCheckout(
        plan.price,
        plan.name,
        plan.id,
        userEmail,
        userName,
        async (response: RazorpayPaymentResponse) => {
          // Payment successful
          try {
            // Verify payment
            const verified = await razorpayService.verifyPayment(response);

            if (verified) {
              // Save subscription to database
              const subscriptionData = {
                user_id: user.id,
                plan_id: plan.id,
                plan_name: plan.name,
                amount: plan.price,
                duration_months: durationMonths,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                status: 'active' as const,
              };

              const saved = await razorpayService.saveSubscription(subscriptionData);

              if (saved) {
                toast({
                  title: "Payment Successful! 🎉",
                  description: `You've successfully subscribed to the ${plan.name} plan. Welcome aboard!`,
                });

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } else {
                toast({
                  title: "Subscription Error",
                  description: "Payment successful but failed to activate subscription. Please contact support.",
                  variant: "destructive",
                });
              }
            } else {
              toast({
                title: "Payment Verification Failed",
                description: "Unable to verify your payment. Please contact support.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            toast({
              title: "Payment Processing Error",
              description: "An error occurred while processing your payment. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setProcessingPayment(false);
          }
        },
        (error: any) => {
          // Payment failed or cancelled
          console.error('Payment error:', error);

          if (error.message === 'Payment cancelled by user') {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
            });
          } else {
            toast({
              title: "Payment Failed",
              description: error.message || "An error occurred during payment. Please try again.",
              variant: "destructive",
            });
          }

          setProcessingPayment(false);
        }
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setProcessingPayment(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Subscription Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock unlimited access to all courses and features. Save more with longer subscriptions!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className="relative flex flex-col transition-all hover:shadow-xl hover:border-orange-300"
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-bold shadow-lg">
                        ⭐ Most Popular
                      </Badge>
                    </div>
                  )}

                  {plan.discount && (
                    <div className="absolute -top-3 -left-3 z-10">
                      <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-bold shadow-md">
                        {plan.discount}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-orange-100">
                      <Icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>

                    <div className="mt-6">
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        for {plan.duration}
                      </div>
                      {plan.savings && (
                        <div className="text-sm font-semibold text-green-600 mt-2">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow pt-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <div className="h-5 w-5 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button
                      onClick={() => handlePlanSelection(plan)}
                      disabled={processingPayment}
                      className="w-full font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {processingPayment ? 'Processing...' : plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
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
                  <p className="text-muted-foreground text-center py-4">Certification details will be available soon.</p>
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

          {/* Value Proposition */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-semibold text-lg mb-2">100+ Courses</h3>
                <p className="text-blue-100">Access comprehensive courses across all major technologies</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-semibold text-lg mb-2">AI-Powered Learning</h3>
                <p className="text-blue-100">Get personalized recommendations and instant help</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-semibold text-lg mb-2">Industry Certificates</h3>
                <p className="text-blue-100">Earn recognized certifications to boost your career</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center bg-white p-10 rounded-2xl shadow-sm border">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="text-left max-w-3xl mx-auto space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">💳 What payment methods do you accept?</h3>
                <p className="text-muted-foreground">We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">🔄 Can I upgrade or downgrade my plan?</h3>
                <p className="text-muted-foreground">Yes! You can upgrade to a longer plan anytime. The remaining balance will be adjusted towards your new subscription.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">💻 Can I access courses on any device?</h3>
                <p className="text-muted-foreground">Yes! Our platform is fully responsive and works seamlessly on desktop, laptop, tablet, and mobile browsers.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">🎓 Do I get certificates?</h3>
                <p className="text-muted-foreground">Yes, you'll receive a certificate of completion for every course you finish, which you can share on LinkedIn and your resume.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">💰 Do you offer refunds?</h3>
                <p className="text-muted-foreground">We offer a 7-day money-back guarantee. If you're not satisfied, contact us within 7 days for a full refund.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🎯 What happens after my subscription expires?</h3>
                <p className="text-muted-foreground">Your progress is saved! You can renew anytime to continue learning from where you left off.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing;
