import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (view === 'login') {
        if (!email || !password) {
          setError('Email and password are required.');
          setIsLoading(false);
          return;
        }
        await login(email, password);
      } else {
         if (!name || !email || !password) {
          setError('Name, email, and password are required.');
          setIsLoading(false);
          return;
        }
        await signup(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-brand-dark mb-2">{view === 'login' ? 'Welcome Back!' : 'Create an Account'}</h2>
          <p className="text-center text-gray-500 mb-6">{view === 'login' ? 'Sign in to continue' : 'Join us to find your dream home'}</p>
          
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-full flex">
              <button onClick={() => setView('login')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'login' ? 'bg-white shadow' : 'text-gray-600'}`}>Login</button>
              <button onClick={() => setView('signup')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'signup' ? 'bg-white shadow' : 'text-gray-600'}`}>Sign Up</button>
            </div>
          </div>

          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm" placeholder="John Doe" />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm" placeholder="••••••••" />
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-400">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (view === 'login' ? 'Login' : 'Sign Up')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};