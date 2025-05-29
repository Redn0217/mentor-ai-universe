
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

  const technologies = [
    { name: 'Python', href: '/tech/python', description: 'Learn Python programming fundamentals' },
    { name: 'DevOps', href: '/tech/devops', description: 'Master DevOps practices and tools' },
    { name: 'Cloud Computing', href: '/tech/cloud', description: 'Explore cloud platforms and services' },
    { name: 'Linux', href: '/tech/linux', description: 'Command line and system administration' },
    { name: 'Networking', href: '/tech/networking', description: 'Network protocols and configurations' },
    { name: 'Storage', href: '/tech/storage', description: 'Data storage solutions and management' },
    { name: 'Virtualization', href: '/tech/virtualization', description: 'Virtual machines and containers' },
    { name: 'Object Storage', href: '/tech/objectstorage', description: 'Modern object storage systems' },
    { name: 'AI & Machine Learning', href: '/tech/ai', description: 'Artificial intelligence and ML' },
  ];

  const resources = [
    { name: 'Playground', href: '/playground', description: 'Interactive coding environment' },
    { name: 'Certifications', href: '/certifications', description: 'Industry recognized certificates' },
    { name: 'About', href: '/about', description: 'Learn more about our platform' },
    { name: 'Contact', href: '/contact', description: 'Get in touch with our team' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Internsify Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {/* Technologies Mega Menu */}
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownHover('technologies')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200 py-2">
                <span className="font-medium">Technologies</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'technologies' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute left-0 mt-2 w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform ${activeDropdown === 'technologies' ? 'translate-y-0' : 'translate-y-2'}`}>
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {technologies.map((tech) => (
                      <Link 
                        key={tech.name}
                        to={tech.href} 
                        className="block p-3 rounded-md hover:bg-gray-50/80 transition-colors duration-200 group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                          {tech.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {tech.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Mega Menu */}
            <div 
              className="relative group"
              onMouseEnter={() => handleDropdownHover('resources')}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors duration-200 py-2">
                <span className="font-medium">Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform ${activeDropdown === 'resources' ? 'translate-y-0' : 'translate-y-2'}`}>
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-xl p-6">
                  <div className="space-y-2">
                    {resources.map((resource) => (
                      <Link 
                        key={resource.name}
                        to={resource.href} 
                        className="block p-3 rounded-md hover:bg-gray-50/80 transition-colors duration-200 group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                          {resource.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {resource.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Navigation Items */}
            <Link to="/pricing" className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium">
              Pricing
            </Link>
            <Link to="/corporate" className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium">
              Corporate
            </Link>

            {/* AI Tutor Button */}
            <Link to="/playground" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
              AI Tutor
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button onClick={() => navigate('/dashboard')} variant="ghost" className="font-medium">
                  Dashboard
                </Button>
                {user.email === "admin@example.com" && (
                  <Button onClick={() => navigate('/admin/courses')} variant="ghost" className="font-medium">
                    Admin
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium">
                  Log in
                </Link>
                <Button onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90 font-medium">
                  Start for free
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary focus:outline-none transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-lg border border-gray-200/50 p-4 space-y-4">
              {/* Mobile Technologies */}
              <div>
                <div className="font-medium text-gray-900 mb-2">Technologies</div>
                <div className="ml-4 space-y-2">
                  {technologies.slice(0, 6).map((tech) => (
                    <Link key={tech.name} to={tech.href} className="block text-sm text-gray-600 hover:text-primary transition-colors duration-200">
                      {tech.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Resources */}
              <div>
                <div className="font-medium text-gray-900 mb-2">Resources</div>
                <div className="ml-4 space-y-2">
                  {resources.map((resource) => (
                    <Link key={resource.name} to={resource.href} className="block text-sm text-gray-600 hover:text-primary transition-colors duration-200">
                      {resource.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/pricing" className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium">
                Pricing
              </Link>
              <Link to="/corporate" className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium">
                Corporate
              </Link>

              {/* Mobile Auth */}
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
    </header>
  );
};
