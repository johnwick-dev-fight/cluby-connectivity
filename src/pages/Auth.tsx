
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-cluby-50 to-blue-50">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-2 text-cluby-700">Cluby</h1>
        <p className="text-xl text-gray-600">Your campus connection hub</p>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        {isLogin ? (
          <LoginForm 
            onRegisterClick={() => setIsLogin(false)} 
          />
        ) : (
          <RegisterForm 
            onLoginClick={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
