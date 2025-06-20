
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownHover = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const productItems = [
    { name: 'Python', href: '/tech/python', description: 'Learn Python programming fundamentals' },
    { name: 'DevOps', href: '/tech/devops', description: 'Master DevOps practices and tools' },
    { name: 'Cloud Computing', href: '/tech/cloud', description: 'Explore cloud platforms and services' },
    { name: 'Linux', href: '/tech/linux', description: 'Command line and system administration' },
    { name: 'Networking', href: '/tech/networking', description: 'Network protocols and configurations' },
    { name: 'AI & Machine Learning', href: '/tech/ai', description: 'Artificial intelligence and ML' },
  ];

  const resourceItems = [
    { name: 'Playground', href: '/playground', description: 'Interactive coding environment' },
    { name: 'Certifications', href: '/certifications', description: 'Industry recognized certificates' },
    { name: 'About', href: '/about', description: 'Learn more about our platform' },
    { name: 'Contact', href: '/contact', description: 'Get in touch with our team' },
    { name: 'Pricing', href: '/pricing', description: 'Choose the right plan for you' },
    { name: 'Corporate', href: '/corporate', description: 'Enterprise solutions' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6 mb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Split Navigation */}
        <div className="hidden lg:flex lg:justify-between lg:gap-8">
          
          {/* Left Section - Logo and Navigation */}
          <div className="bg-white/60 backdrop-blur-lg border border-gray-200/30 rounded-2xl shadow-lg px-8 py-4">
            <div className="flex items-center space-x-10">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Internsify" className="h-8 w-auto" />
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center space-x-8">
                
                {/* Product Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => handleDropdownHover('product')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 font-medium">
                    <span>Product</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute left-0 top-full mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform ${activeDropdown === 'product' ? 'translate-y-0' : 'translate-y-2'}`}>
                    <div className="bg-white/80 backdrop-blur-lg border border-gray-200/30 rounded-xl shadow-lg p-6">
                      <div className="space-y-1">
                        {productItems.map((item) => (
                          <Link 
                            key={item.name}
                            to={item.href} 
                            className="block p-3 rounded-lg hover:bg-gray-50/60 transition-colors duration-200 group"
                          >
                            <div className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resources Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => handleDropdownHover('resources')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2 font-medium">
                    <span>Resources</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute left-0 top-full mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform ${activeDropdown === 'resources' ? 'translate-y-0' : 'translate-y-2'}`}>
                    <div className="bg-white/80 backdrop-blur-lg border border-gray-200/30 rounded-xl shadow-lg p-6">
                      <div className="space-y-1">
                        {resourceItems.map((item) => (
                          <Link 
                            key={item.name}
                            to={item.href} 
                            className="block p-3 rounded-lg hover:bg-gray-50/60 transition-colors duration-200 group"
                          >
                            <div className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Changelog Link */}
                <Link to="/changelog" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Changelog
                </Link>

                {/* AI Tutor Button */}
                <Link 
                  to="/playground" 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  AI Tutor
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - CTA Buttons */}
          <div className="bg-white/60 backdrop-blur-lg border border-gray-200/30 rounded-2xl shadow-lg px-8 py-4">
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button onClick={() => navigate('/dashboard')} variant="ghost" className="font-medium text-gray-700 hover:text-gray-900">
                    Dashboard
                  </Button>
                  {user.email === "admin@example.com" && (
                    <Button onClick={() => navigate('/admin/courses')} variant="ghost" className="font-medium text-gray-700 hover:text-gray-900">
                      Admin
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="ghost" className="font-medium text-gray-700 hover:text-gray-900">
                    Get a demo
                  </Button>
                  <Button onClick={() => navigate('/login')} variant="ghost" className="font-medium text-gray-700 hover:text-gray-900">
                    Log in
                  </Button>
                  <Button onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90 font-medium px-6 shadow-sm">
                    Start for free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex justify-between items-center gap-4">
            <div className="bg-white/60 backdrop-blur-lg border border-gray-200/30 rounded-2xl shadow-lg px-4 py-3">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Internsify" className="h-8 w-auto" />
              </Link>
            </div>

            <div className="bg-white/60 backdrop-blur-lg border border-gray-200/30 rounded-2xl shadow-lg px-4 py-3">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 animate-fade-in">
              <div className="bg-white/70 backdrop-blur-lg border border-gray-200/30 rounded-2xl shadow-lg p-6 space-y-4">
                
                {/* Mobile Product Section */}
                <div>
                  <div className="font-medium text-gray-900 mb-3">Product</div>
                  <div className="space-y-2">
                    {productItems.slice(0, 4).map((item) => (
                      <Link key={item.name} to={item.href} className="block text-sm text-gray-600 hover:text-primary transition-colors duration-200 py-1">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Resources Section */}
                <div>
                  <div className="font-medium text-gray-900 mb-3">Resources</div>
                  <div className="space-y-2">
                    {resourceItems.slice(0, 4).map((item) => (
                      <Link key={item.name} to={item.href} className="block text-sm text-gray-600 hover:text-primary transition-colors duration-200 py-1">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/changelog" className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium py-2">
                  Changelog
                </Link>

                {/* Mobile Auth Buttons */}
                {user ? (
                  <>
                    <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                      Dashboard
                    </Button>
                    {user.email === "admin@example.com" && (
                      <Button onClick={() => navigate('/admin/courses')} variant="outline" className="w-full">
                        Admin
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full">
                      Get a demo
                    </Button>
                    <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                      Log in
                    </Button>
                    <Button onClick={() => navigate('/signup')} className="w-full">
                      Start for free
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
