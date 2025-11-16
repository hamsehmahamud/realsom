import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// A simple mock user type
interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for a saved user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock login function
  const login = async (email: string, pass: string): Promise<void> => {
    // In a real app, you'd call an API. Here we'll just mock it.
    console.log('Logging in with', email, pass);
    const user: User = { name: 'Jane Doe', email: email };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Mock signup function
  const signup = async (name: string, email: string, pass: string): Promise<void> => {
    console.log('Signing up with', name, email, pass);
    const user: User = { name, email };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
