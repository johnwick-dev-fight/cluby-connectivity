
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Briefcase, Calendar, MessageSquare, Search, ArrowDownCircle } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with improved design */}
      <div className="relative bg-gradient-to-br from-cluby-700 to-cluby-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        
        <div className="cluby-container relative py-24 md:py-36 flex flex-col items-center text-center z-10">
          <Badge variant="outline" className="mb-4 py-1 px-4 text-sm bg-white/10 border-white/20 backdrop-blur-sm">
            Campus Connection Hub
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="block">Connect with Campus</span>
            <span className="text-cluby-200">Clubs & Events</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Discover, join, and engage with clubs and events that match your interests
          </p>
          
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="text-lg py-6 px-8 group">
                Go to Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link to="/auth">
                <Button size="lg" className="text-lg py-6 px-8 bg-white text-cluby-700 hover:bg-white/90 group">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg py-6 px-8 bg-white/10 hover:bg-white/20 text-white border-white/20 group">
                  Explore Features
                  <ArrowDownCircle className="ml-2 group-hover:translate-y-1 transition-transform" />
                </Button>
              </a>
            </div>
          )}
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="cluby-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-cluby-600 dark:text-cluby-400">50+</p>
              <p className="text-gray-600 dark:text-gray-400">Active Clubs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-cluby-600 dark:text-cluby-400">100+</p>
              <p className="text-gray-600 dark:text-gray-400">Events per Month</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-cluby-600 dark:text-cluby-400">500+</p>
              <p className="text-gray-600 dark:text-gray-400">Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-cluby-600 dark:text-cluby-400">200+</p>
              <p className="text-gray-600 dark:text-gray-400">Opportunities</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section with improved design */}
      <div id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="cluby-container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 py-1 px-4 text-sm border-cluby-200 text-cluby-700 dark:border-cluby-800 dark:text-cluby-400">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything you need to engage with campus life</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Cluby provides a comprehensive platform for students to connect with clubs, events, and opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Discover Clubs</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse and explore all the clubs and organizations on campus in one place.</p>
              <Link to="/clubs" className="mt-4 inline-flex items-center text-cluby-600 dark:text-cluby-400 font-medium hover:text-cluby-700 dark:hover:text-cluby-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Apply for Positions</h3>
              <p className="text-gray-600 dark:text-gray-300">Find and apply for open positions and opportunities within clubs and departments.</p>
              <Link to="/recruit" className="mt-4 inline-flex items-center text-cluby-600 dark:text-cluby-400 font-medium hover:text-cluby-700 dark:hover:text-cluby-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Event Calendar</h3>
              <p className="text-gray-600 dark:text-gray-300">Stay updated on upcoming events, workshops, and activities from various clubs.</p>
              <Link to="/events" className="mt-4 inline-flex items-center text-cluby-600 dark:text-cluby-400 font-medium hover:text-cluby-700 dark:hover:text-cluby-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Community</h3>
              <p className="text-gray-600 dark:text-gray-300">Engage with the campus community through discussions, posts, and announcements.</p>
              <Link to="/community" className="mt-4 inline-flex items-center text-cluby-600 dark:text-cluby-400 font-medium hover:text-cluby-700 dark:hover:text-cluby-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* How it works section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="cluby-container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 py-1 px-4 text-sm border-cluby-200 text-cluby-700 dark:border-cluby-800 dark:text-cluby-400">
              Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">How Cluby Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform makes it simple to connect with clubs and opportunities in just a few steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 flex items-center justify-center mx-auto mb-6 relative">
                <Search className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-cluby-600 text-white flex items-center justify-center font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Discover</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse through clubs and events that match your interests and skills.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 flex items-center justify-center mx-auto mb-6 relative">
                <Users className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-cluby-600 text-white flex items-center justify-center font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">Join clubs or apply for positions that align with your goals.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cluby-100 dark:bg-cluby-900/50 text-cluby-700 dark:text-cluby-400 flex items-center justify-center mx-auto mb-6 relative">
                <Calendar className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-cluby-600 text-white flex items-center justify-center font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Engage</h3>
              <p className="text-gray-600 dark:text-gray-300">Participate in events, contribute to discussions, and build your network.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-cluby-700 text-white py-16">
        <div className="cluby-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to connect with campus life?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join Cluby today and discover all the amazing opportunities waiting for you
          </p>
          
          <Link to="/auth">
            <Button size="lg" className="text-lg py-6 px-8 bg-white text-cluby-700 hover:bg-white/90">
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12 mt-auto">
        <div className="cluby-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 dark:text-white">Cluby</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Your campus connection hub for clubs, events, and opportunities.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 dark:text-white">Features</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/clubs" className="hover:text-cluby-700 dark:hover:text-cluby-400">Discover Clubs</Link></li>
                <li><Link to="/recruit" className="hover:text-cluby-700 dark:hover:text-cluby-400">Recruitment</Link></li>
                <li><Link to="/events" className="hover:text-cluby-700 dark:hover:text-cluby-400">Event Calendar</Link></li>
                <li><Link to="/community" className="hover:text-cluby-700 dark:hover:text-cluby-400">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 dark:text-white">Resources</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-cluby-700 dark:hover:text-cluby-400">Help Center</a></li>
                <li><a href="#" className="hover:text-cluby-700 dark:hover:text-cluby-400">Guidelines</a></li>
                <li><a href="#" className="hover:text-cluby-700 dark:hover:text-cluby-400">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 dark:text-white">Connect</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-cluby-700 dark:hover:text-cluby-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-cluby-700 dark:hover:text-cluby-400">Feedback</a></li>
                <li><a href="#" className="hover:text-cluby-700 dark:hover:text-cluby-400">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Cluby - Your Campus Connection Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
