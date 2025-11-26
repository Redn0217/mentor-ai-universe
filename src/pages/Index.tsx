import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TechnologyCard } from '@/components/technologies/TechnologyCard';
import { TutorChat } from '@/components/tutors/TutorChat';
import { GradientButton } from '@/components/ui/gradient-button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { FeaturesDemo } from '@/components/ui/features-demo';
import { fetchCourses } from '@/services/apiService';
import { getCourseIcon } from '@/utils/courseIcons';

import { Link } from 'react-router-dom';
import Typewriter from 'react-typewriter-effect';

interface Technology {
  title: string;
  slug: string;
  description: string;
  color: string;
  icon: any;
  modules: number;
  lessons: number;
  tutor: {
    name: string;
    avatar: string;
  };
}

const Index = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTech, setActiveTech] = useState<Technology | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 });
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch courses from database
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const courses = await fetchCourses();

        // Transform courses to technologies format
        const techs: Technology[] = courses.map(course => ({
          title: course.title,
          slug: course.slug,
          description: course.short_description || course.description,
          color: course.color,
          icon: getCourseIcon(course.slug),
          modules: course.modules_count || 0,
          lessons: course.lessons_count || 0,
          tutor: {
            name: course.tutor?.name || 'Instructor',
            avatar: course.tutor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.slug}`
          }
        }));

        setTechnologies(techs);
        if (techs.length > 0) {
          setActiveTech(techs[0]);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Auto-rotation functionality
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      rotationIntervalRef.current = setInterval(() => {
        setCurrentRotation(prev => prev + 0.5); // Slower rotation: 0.5 degrees per interval
      }, 50); // 50ms interval for smooth rotation
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [isAutoRotating, isDragging]);

  const handleManualRotation = (direction: 'left' | 'right') => {
    setIsAutoRotating(false); // Pause auto-rotation
    const rotationAmount = 360 / technologies.length; // Rotate to next/previous item
    setCurrentRotation(prev =>
      direction === 'left'
        ? prev - rotationAmount
        : prev + rotationAmount
    );
    // Resume auto-rotation after 3 seconds
    setTimeout(() => setIsAutoRotating(true), 3000);
  };

  const handleCardClick = (tech: typeof technologies[0], index: number) => {
    setActiveTech(tech);
    setIsAutoRotating(false); // Pause auto-rotation
    const rotationAmount = 360 / technologies.length;
    setCurrentRotation(-index * rotationAmount); // Rotate to bring selected card to front
    // Resume auto-rotation after 3 seconds
    setTimeout(() => setIsAutoRotating(true), 3000);
  };

  // Mouse drag controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false); // Pause auto-rotation while dragging
    setDragStart({ x: e.clientX, rotation: currentRotation });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const rotationDelta = deltaX * 0.5; // Sensitivity factor
    setCurrentRotation(dragStart.rotation + rotationDelta);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Resume auto-rotation after 2 seconds of inactivity
    setTimeout(() => setIsAutoRotating(true), 2000);
  };

  const changingTexts = [
    "AI toolkit",
    "AI platform",
    "AI ecosystem",
    "AI solution",
    "AI framework",
    "AI engine"
  ];
  
  return (
    <MainLayout>
      {/* Act I: Hero Section - Shared Vision */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 pb-24 overflow-hidden min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-gray-900">
              The world's most advanced <span className="bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent relative inline-block min-w-[300px]">
                <Typewriter
                  textStyle={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    color: 'transparent',
                    background: 'linear-gradient(to right, #007c87, #f15a29)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                  startDelay={500}
                  cursorColor="#f15a29"
                  multiText={changingTexts}
                  multiTextDelay={3000}
                  typeSpeed={150}
                  multiTextLoop
                />
              </span> for tech education
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Internsify is the first AI platform that delivers personalized tech education at scale.
              Use our AI tutors alongside your existing learning, or as your complete AI-powered skill development solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <GradientButton className="text-lg px-8 py-4 w-auto">
                  Start for free
                </GradientButton>
              </Link>
              <Link to="/contact">
                <InteractiveHoverButton
                  text="Get a demo"
                  className="text-lg px-8 py-3 w-auto bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Animated Background Elements - Extended to cover navbar area */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-10 w-72 h-72 bg-gradient-to-br from-brand-teal/40 to-brand-teal/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-bl from-brand-orange/40 to-brand-orange/10 rounded-full blur-3xl animate-first"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-teal/20 via-transparent to-brand-orange/20 rounded-full blur-3xl animate-second"></div>
          <div className="absolute -top-10 right-20 w-48 h-48 bg-gradient-to-br from-brand-orange/30 to-brand-teal/20 rounded-full blur-2xl animate-third"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-gradient-to-tr from-brand-teal/30 to-brand-orange/20 rounded-full blur-2xl animate-fourth"></div>
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-gradient-to-br from-brand-teal/25 to-brand-orange/15 rounded-full blur-3xl animate-fifth"></div>
          <div className="absolute -top-32 right-1/3 w-56 h-56 bg-gradient-to-bl from-brand-orange/35 to-brand-teal/25 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-brand-orange/20 to-brand-teal/30 rounded-full blur-xl animate-third"></div>
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
            Our AI-powered platform combines cutting-edge artificial intelligence with proven educational methodologies,
            delivering personalized learning experiences that adapt to each student's unique needs and learning style.
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
                lessons={tech.lessons}
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

      {/* Act V: AI Features Showcase */}
      <FeaturesDemo />

      {/* Interactive AI Tutor Demo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Experience AI-powered learning</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a taste of our interactive learning experience by chatting with one of our specialized AI tutors.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* 3D Rotating Carousel */}
            {technologies.length > 0 && (
              <div className="relative mb-2 h-[300px] flex items-center justify-center">
                {/* Navigation Buttons */}
                <button
                  onClick={() => handleManualRotation('left')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                  aria-label="Rotate left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>

                <button
                  onClick={() => handleManualRotation('right')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
                  aria-label="Rotate right"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>



              {/* 3D Carousel Container */}
              <div
                className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ perspective: '1500px' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  className="relative preserve-3d"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${currentRotation}deg) rotateX(-3deg)`,
                    transition: 'transform 0.8s ease-out',
                    width: '400px',
                    height: '400px',
                  }}
                >
                  {technologies.map((tech, index) => {
                    const angle = (360 / technologies.length) * index;
                    const radius = 380; // Reduced spacing between cards

                    return (
                      <div
                        key={tech.slug}
                        onClick={() => handleCardClick(tech, index)}
                        className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                          activeTech?.slug === tech.slug
                            ? 'ring-2 ring-brand-teal shadow-2xl'
                            : 'hover:shadow-xl'
                        }`}
                        style={{
                          transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                          transformOrigin: 'center center',
                          width: '180px', // Slightly wider
                          height: '130px', // Even shorter height
                          left: '50%',
                          top: '50%',
                          marginLeft: '-90px', // Adjusted for wider width
                          marginTop: '-65px', // Adjusted for shorter height
                        }}
                      >
                        <div
                          className="w-full h-full bg-gradient-to-br from-white via-white to-gray-50 backdrop-blur-sm rounded-xl p-2 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300"
                          style={{
                            boxShadow: `0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)`,
                          }}
                        >
                          <div className="flex flex-col items-center text-center h-full justify-center">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center mb-1 shadow-lg"
                              style={{
                                backgroundColor: tech.color + '20',
                                color: tech.color,
                                boxShadow: `0 6px 12px ${tech.color}20`
                              }}
                            >
                              <div className="w-8 h-8">
                                {tech.icon}
                              </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-0.5 text-xs leading-tight">{tech.title}</h3>
                            <p className="text-xs text-gray-600 font-medium mb-0.5">{tech.tutor.name}</p>
                            <p className="text-gray-600 line-clamp-2 leading-tight text-[8px]">{tech.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </div>
            )}

            {/* Active Tutor Chat */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courses...</p>
              </div>
            ) : activeTech ? (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <TutorChat
                  tutorName={activeTech.tutor.name}
                  tutorAvatar={activeTech.tutor.avatar}
                  technology={activeTech.title}
                  techColor={activeTech.color}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-600">No courses available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Internsify? */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Why Choose Internsify?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge AI with proven learning methodologies to provide the best tech education.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Tutors</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Personalized learning with dedicated AI tutors for each technology domain, available 24/7.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 11 2-2-2-2"/><path d="m13 17 2-2-2-2"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Hands-on Learning</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Interactive projects and exercises to apply what you've learned in real-world scenarios.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 5h20"/><path d="M3 3v2"/><path d="M7 3v2"/><path d="M17 3v2"/><path d="M21 3v2"/><path d="m19 5-7 7-7-7"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Advanced Chatbots</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Access to cutting-edge AI assistants including Grok, Co-Pilot, and Chat-GPT for research support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Detailed analytics and feedback on your learning journey to help you improve continuously.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3 3-3"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Personalized Learning</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Adaptive learning pathways tailored to your skill level, goals, and learning pace.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-orange rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Industry-Relevant</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Curriculum designed by industry experts to ensure you learn the skills employers value most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New AI Tools Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              New AI Tools, Designed to Support Great Teaching
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              From lesson planning to family communication, our AI tools take the busywork off your plate, 
              giving you more time for creativity, student connection, and classroom impact.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Create Card */}
            <Link to="/create" className="group">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      Create
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Plan faster with tools that build lessons, rubrics, and warm-ups in seconds.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                      Explore tools →
                    </span>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Assess Card */}
            <Link to="/assess" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      Assess
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Design quizzes, generate feedback, and track progress, without all the paperwork.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                      Explore tools →
                    </span>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Personalize Card */}
            <Link to="/personalize" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      Personalize
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Differentiate instruction and support every learner with tailored content tools.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                      Explore tools →
                    </span>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Communicate Card */}
            <Link to="/communicate" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      Communicate
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Write clear, thoughtful messages for students, families, and colleagues, quickly.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                      Explore tools →
                    </span>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21.5 2 17 6.5"/>
                        <path d="m21.5 2-5.5 5.5L14 4l-1 1-2-2-4 4v4l2 2 1-1h4l4-4-2-2 1-1 3.5 2.5Z"/>
                        <path d="M7.5 8.5 4 12l6 6h8l-6-6Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
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
            <Link to="/signup">
              <GradientButton className="text-lg px-8 py-4 w-auto">
                Start for free
              </GradientButton>
            </Link>
            <Link to="/pricing">
              <InteractiveHoverButton
                text="View pricing"
                className="text-lg px-8 py-3 w-auto bg-white/10 border-2 border-white/20 text-white hover:bg-white hover:text-gray-900"
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
