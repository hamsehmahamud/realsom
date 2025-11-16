
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../hooks/useRouter';
import { Icon } from '../components/Icon';

export const AuthPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const { navigate } = useRouter();

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
      navigate('home'); // Redirect to home on successful auth
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {view === 'signup' && (
        <div>
          <label htmlFor="name" className="text-sm font-medium text-dark-text-secondary">Full Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-3 bg-dark-surface border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-blue focus:border-accent-blue sm:text-sm text-dark-text" placeholder="John Doe" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-dark-text-secondary">Email Address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-3 bg-dark-surface border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-blue focus:border-accent-blue sm:text-sm text-dark-text" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-dark-text-secondary">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-3 bg-dark-surface border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-accent-blue focus:border-accent-blue sm:text-sm text-dark-text" placeholder="••••••••" />
      </div>
      
      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-accent-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue disabled:bg-gray-600 disabled:cursor-not-allowed">
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (view === 'login' ? 'Login' : 'Sign Up')}
      </button>
    </form>
  );

  return (
    <div className="bg-dark-bg min-h-screen flex flex-col">
      <header className="flex items-center p-4">
          <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
              <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
          </button>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-dark-text mb-2">{view === 'login' ? 'Welcome Back!' : 'Create an Account'}</h2>
            <p className="text-center text-dark-text-secondary mb-8">{view === 'login' ? 'Sign in to continue' : 'Join us to find your dream home'}</p>
            
            <div className="flex justify-center mb-8">
              <div className="bg-dark-surface p-1 rounded-full flex">
                <button onClick={() => setView('login')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'login' ? 'bg-dark-bg shadow-lg text-dark-text' : 'text-dark-text-secondary'}`}>Login</button>
                <button onClick={() => setView('signup')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'signup' ? 'bg-dark-bg shadow-lg text-dark-text' : 'text-dark-text-secondary'}`}>Sign Up</button>
              </div>
            </div>

            {error && <p className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm mb-4">{error}</p>}
            
            {renderForm()}
        </div>
      </main>
    </div>
  );
};
