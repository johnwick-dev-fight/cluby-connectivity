
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-cluby-700 to-cluby-900 text-white">
        <div className="cluby-container py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect with Campus Clubs</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-white/90">
            Discover, join, and engage with clubs and events that match your interests
          </p>
          
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="text-lg py-6 px-8">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="text-lg py-6 px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg py-6 px-8 bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-20 bg-gray-50">
        <div className="cluby-container">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to engage with campus life</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-cluby-100 text-cluby-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Clubs</h3>
              <p className="text-gray-600">Browse and explore all the clubs and organizations on campus in one place.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-cluby-100 text-cluby-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Apply for Positions</h3>
              <p className="text-gray-600">Find and apply for open positions and opportunities within clubs and departments.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-cluby-100 text-cluby-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Join the Community</h3>
              <p className="text-gray-600">Stay updated on club events, announcements, and engage with the campus community.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-auto">
        <div className="cluby-container text-center">
          <p className="text-gray-600">© 2023 Cluby - Your Campus Connection Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
