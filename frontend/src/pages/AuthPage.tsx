import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans text-gray-800 p-4">
      <div className="w-full max-w-md px-8 py-8 bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h3>
        <p className="text-center text-gray-600 mb-6 text-sm">
          {isLogin ? 'Sign in to continue' : 'Get started with a new account'}
        </p>
        <div className="mt-4">
          {isLogin ? <Login /> : <Register />}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 w-full text-center text-indigo-600 hover:text-indigo-800 font-semibold text-sm focus:outline-none focus:underline"
          >
            {isLogin
              ? 'Need an account? Register'
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
