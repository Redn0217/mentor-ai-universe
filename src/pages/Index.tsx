import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TechnologyCard } from '@/components/technologies/TechnologyCard';
import { TutorChat } from '@/components/tutors/TutorChat';
import { GradientButton } from '@/components/ui/gradient-button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const technologies = [
  {
    title: "Python",
    slug: "python",
    description: "Learn Python programming from basics to advanced concepts with practical exercises.",
    color: "#3776AB",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5a2 2 0 0 0 2-1.5 2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2 2 2 0 0 0 2 2H10"/><path d="M10 17V5.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5"/><path d="M14 6.5v11a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-5"/></svg>,
    modules: 8,
    exercises: 24,
    tutor: {
      name: "Dr. Ana Python",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
    }
  },
  {
    title: "DevOps",
    slug: "devops",
    description: "Master continuous integration, delivery, and deployment practices.",
    color: "#EE3424",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="6"/><circle cx="8" cy="16" r="6"/><circle cx="12" cy="8" r="6"/><line x1="12" y1="2" x2="12" y2="14"/><line x1="16" y1="16" x2="8" y2="16"/></svg>,
    modules: 6,
    exercises: 18,
    tutor: {
      name: "Sam Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"
    }
  },
  {
    title: "Cloud Computing",
    slug: "cloud",
    description: "Learn to deploy and manage applications on major cloud platforms.",
    color: "#4285F4",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
    modules: 7,
    exercises: 21,
    tutor: {
      name: "Alex Cloud",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    }
  },
  {
    title: "Linux",
    slug: "linux",
    description: "Master Linux administration, shell scripting, and system configuration.",
    color: "#FCC624",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
    modules: 5,
    exercises: 15,
    tutor: {
      name: "Lina Penguin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina"
    }
  },
  {
    title: "Networking",
    slug: "networking",
    description: "Understand network protocols, configuration, and troubleshooting.",
    color: "#00BCF2",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>,
    modules: 6,
    exercises: 18,
    tutor: {
      name: "Mike Router",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    }
  },
  {
    title: "Storage",
    slug: "storage",
    description: "Learn about storage systems, RAID configurations, and data backup solutions.",
    color: "#FF6F00",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>,
    modules: 4,
    exercises: 12,
    tutor: {
      name: "Sarah Storage",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    }
  },
  {
    title: "Virtualization",
    slug: "virtualization",
    description: "Master virtualization technologies and hypervisor management.",
    color: "#0F9D58",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="M3 9h12"/><path d="M3 15h12"/><path d="M9 9v6"/></svg>,
    modules: 5,
    exercises: 15,
    tutor: {
      name: "Victor VM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victor"
    }
  },
  {
    title: "Object Storage",
    slug: "objectstorage",
    description: "Understand object storage concepts, implementation, and best practices.",
    color: "#FF9900",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
    modules: 4,
    exercises: 12,
    tutor: {
      name: "Olivia Object",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia"
    }
  },
  {
    title: "AI & Machine Learning",
    slug: "ai",
    description: "Explore artificial intelligence concepts, machine learning algorithms, and their applications.",
    color: "#9B30FF",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 5h20"/><path d="M3 3v2"/><path d="M7 3v2"/><path d="M17 3v2"/><path d="M21 3v2"/><path d="m19 5-7 7-7-7"/></svg>,
    modules: 8,
    exercises: 24,
    tutor: {
      name: "Dr. Alan Neural",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alan"
    }
  }
];

const Index = () => {
  const [activeTech, setActiveTech] = useState(technologies[0]);
  
  return (
    <MainLayout>
      {/* Act I: Hero Section - Shared Vision */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-gray-900">
              The world's most advanced <span className="bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent">AI toolkit</span> for tech education
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Internsify is the first AI platform that delivers personalized tech education at scale. 
              Use our AI tutors alongside your existing learning, or as your complete AI-powered skill development solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton className="text-lg px-8 py-4">
                Start for free
              </GradientButton>
              <InteractiveHoverButton
                text="Get a demo"
                className="text-lg px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-brand-teal/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-bl from-brand-orange/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Act II: Shared Vision & Pain Points */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12">
            In tech education, we all share the same goal: to deliver personalized learning experiences that inspire every professional and graduate.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Internsify offers a transformative new approach - not just to achieve that goal - but to redefine it. 
            Our AI-powered platform is built by experienced technologists, bringing unmatched expertise in software development, 
            DevOps practices, and artificial intelligence education.
          </p>
        </div>
      </section>

      {/* Act III: The Solution - Our Platform */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              AI that empowers your tech journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI tutors personalize instruction for every learner. Advanced coding environments and real-time feedback 
              make learning efficient and engaging.
            </p>
          </div>
          
          {/* Visual Demo */}
          <div className="relative mb-20">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-sm text-gray-500">AI Tutor Session</div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <div className="bg-gradient-to-r from-brand-teal/10 to-brand-orange/10 rounded-lg p-4 max-w-[80%]">
                    <p className="text-gray-800">Hello! I'm your Python tutor. I see you're working on data structures. Let's start with lists and dictionaries.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                    <p className="text-gray-800">Can you help me understand when to use lists vs dictionaries?</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-gradient-to-r from-brand-teal/10 to-brand-orange/10 rounded-lg p-4 max-w-[80%]">
                    <p className="text-gray-800">Great question! Let me show you with a practical example. Lists are perfect for ordered data...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Act IV: Feature Breakdown */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Complete AI-powered learning toolkit</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to master modern technology skills, from beginner concepts to advanced implementations.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {technologies.map((tech) => (
              <TechnologyCard
                key={tech.slug}
                title={tech.title}
                description={tech.description}
                icon={tech.icon}
                color={tech.color}
                slug={tech.slug}
                modules={tech.modules}
                exercises={tech.exercises}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Tutors</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Personalized learning with dedicated AI tutors for each technology domain, available 24/7 to guide your journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="3" rx="1"/><rect width="18" height="8" x="3" y="15" rx="1"/><line x1="7" y1="7" x2="17" y2="7"/><line x1="7" y1="19" x2="17" y2="19"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Interactive Playground</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Hands-on coding environments where you can practice, experiment, and build real projects with instant feedback.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Progress Tracking</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Advanced analytics and personalized insights to track your learning progress and optimize your skill development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Act V: Credibility & Trust Signals */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Built by experienced technologists</h2>
          
          {/* Founder/Team Section */}
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-teal to-brand-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">JS</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">John Smith</h3>
              <p className="text-gray-600">Co-Founder, CEO</p>
              <p className="text-sm text-gray-500 mt-2">Former Senior Engineer at Google</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-teal to-brand-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AD</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Alice Davis</h3>
              <p className="text-gray-600">Co-Founder, CTO</p>
              <p className="text-sm text-gray-500 mt-2">Former Principal Engineer at Microsoft</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-teal to-brand-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">RJ</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Robert Johnson</h3>
              <p className="text-gray-600">VP of Engineering</p>
              <p className="text-sm text-gray-500 mt-2">Former Tech Lead at Amazon</p>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
              "Internsify transformed how I approach learning new technologies. The AI tutors provide personalized guidance that's impossible to get elsewhere."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-teal to-brand-orange rounded-full mr-4 flex items-center justify-center">
                <span className="text-white font-bold">MK</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Michael Kim</p>
                <p className="text-gray-600">Senior DevOps Engineer, Netflix</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Tutor Demo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Experience AI-powered learning</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a taste of our interactive learning experience by chatting with one of our specialized AI tutors.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="python" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-8">
                {technologies.map((tech) => (
                  <TabsTrigger 
                    key={tech.slug} 
                    value={tech.slug}
                    onClick={() => setActiveTech(tech)}
                    className="text-xs sm:text-sm"
                  >
                    {tech.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {technologies.map((tech) => (
                <TabsContent key={tech.slug} value={tech.slug}>
                  <TutorChat 
                    tutorName={tech.tutor.name}
                    tutorAvatar={tech.tutor.avatar}
                    technology={tech.title}
                    techColor={tech.color}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Act VI: Final CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Ready to accelerate your tech career?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who are mastering cutting-edge technologies with Internsify's AI-powered learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton className="text-lg px-8 py-4">
              Start for free
            </GradientButton>
            <Link to="/pricing">
              <InteractiveHoverButton
                text="View pricing"
                className="text-lg px-8 py-4 bg-white/10 border-2 border-white/20 text-white hover:bg-white hover:text-gray-900"
              />
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6">No credit card required • 14-day free trial</p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
