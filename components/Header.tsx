import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS } from '../constants';
import { Icon } from './Icon';
import { PropertyType } from '../types';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { useRouter } from '../hooks/useRouter';

const Dropdown: React.FC<{
  label: string;
  items: string[];
}> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-base font-semibold hover:opacity-80 transition-opacity"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <Icon name="chevron-down" className={`h-5 w-5 ml-1.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 ring-1 ring-black ring-opacity-5 py-1 text-brand-dark">
          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {items.map((item) => (
              <li key={item}>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  
  const somaliaCities = ['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Galkayo'];
  const realEstateCategories = Object.values(PropertyType);

  const openModal = (view: 'login' | 'signup') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-brand-green text-white sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Logo and Filters */}
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('home')} aria-label="Go to homepage">
                <Icon name="logo" className="h-9 w-9" />
              </button>
              <div className="hidden md:flex items-center space-x-6">
                 <Dropdown label="All Cities" items={somaliaCities} />
                 <Dropdown label="All Categories" items={realEstateCategories} />
              </div>
            </div>
            
            {/* Right Side: Language and Profile */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold hidden sm:block">EN</span>
              {currentUser ? (
                <button onClick={() => navigate('profile')} aria-label="Open profile">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${currentUser.email}`} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-white/50 object-cover" 
                  />
                </button>
              ) : (
                <button onClick={() => openModal('login')} aria-label="Login or Sign up">
                   <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center bg-white/20">
                      <Icon name="user" className="h-5 w-5" />
                   </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView={authModalView} />
    </>
  );
};