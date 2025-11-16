import React from 'react';
import { Icon } from './Icon';
import { useRouter, Page } from '../hooks/useRouter';
import { useAuth } from '../context/AuthContext';

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-accent-blue' : 'text-dark-text-secondary hover:text-dark-text'
    }`}
  >
    <Icon name={icon} className="h-6 w-6" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export const Footer: React.FC = () => {
  const { page, navigate } = useRouter();
  const { currentUser } = useAuth();

  const handleProtectedNavigate = (targetPage: Page) => {
    if (currentUser) {
      navigate(targetPage);
    } else {
      navigate('auth');
    }
  };

  const navItems = [
    { icon: 'home', label: 'Home', targetPage: 'home', action: () => navigate('home') },
    { icon: 'search', label: 'Search', targetPage: 'searchResults', action: () => navigate('searchResults') },
    { icon: 'bookmark', label: 'Saved', targetPage: 'favorites', action: () => handleProtectedNavigate('favorites') },
    { icon: 'user', label: 'Profile', targetPage: 'profile', action: () => handleProtectedNavigate('profile') },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-gray-700/50 z-30 md:hidden print:hidden">
      <nav className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={page === item.targetPage || (page === 'mapSearch' && item.targetPage === 'searchResults')}
            onClick={item.action}
          />
        ))}
      </nav>
    </footer>
  );
};