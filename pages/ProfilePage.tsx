import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import { useRouter } from '../hooks/useRouter';

const ProfileMenuItem: React.FC<{ icon: string; label: string; onClick?: () => void; isDanger?: boolean }> = ({ icon, label, onClick, isDanger }) => (
    <button onClick={onClick} className="w-full flex items-center p-3 text-left text-dark-text hover:bg-dark-surface/50 transition-colors rounded-lg">
        <div className={`w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center mr-4 ${isDanger ? 'text-red-400' : 'text-dark-text-secondary'}`}>
            <Icon name={icon} className="h-5 w-5" />
        </div>
        <span className="font-semibold flex-grow">{label}</span>
        <Icon name="chevron-right" className="h-5 w-5 text-dark-text-secondary" />
    </button>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xs font-bold uppercase text-dark-text-secondary px-3 mb-2">{children}</h2>
);


export const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { navigate } = useRouter();

  const handleLogout = () => {
      logout();
      navigate('home');
  };

  if (!currentUser) {
     return (
        <div className="bg-dark-bg text-dark-text min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center p-8 bg-dark-surface rounded-lg max-w-sm w-full">
                <Icon name="user" className="h-16 w-16 text-dark-text-secondary mx-auto mb-4"/>
                <h3 className="text-2xl font-semibold text-dark-text">You are not logged in.</h3>
                <p className="text-dark-text-secondary mt-2 mb-6">Please log in to view your profile.</p>
                <button onClick={() => navigate('auth')} className="w-full bg-accent-blue text-white py-3 rounded-lg font-bold">
                    Login / Sign Up
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-dark-bg text-dark-text min-h-full">
        <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
            <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
            </button>
            <h1 className="font-bold text-lg text-dark-text mx-auto">Profile</h1>
            <div className="w-6 h-6"></div>
        </header>

        <main className="p-4">
            {/* Profile Info */}
            <div className="flex items-center space-x-4 mb-8">
                 <img src={`https://i.pravatar.cc/150?u=${currentUser.email}`} alt="Profile" className="w-16 h-16 rounded-full border-2 border-dark-surface" />
                 <div>
                    <h2 className="text-xl font-bold">{currentUser.name}</h2>
                    <p className="text-sm text-dark-text-secondary">{currentUser.email}</p>
                 </div>
            </div>
            
            {/* Menu List */}
            <div className="space-y-6">
                <section>
                    <SectionTitle>My Account</SectionTitle>
                     <div className="bg-dark-surface rounded-lg p-2 space-y-1">
                        <ProfileMenuItem icon="user-circle" label="Manage Profile" onClick={() => navigate('settings')} />
                        <ProfileMenuItem icon="document-text" label="My Properties" onClick={() => navigate('add')} />
                        <ProfileMenuItem icon="plus-circle" label="Add Property" onClick={() => navigate('add', { view: 'form' })} />
                        <ProfileMenuItem icon="plus" label="Quick Add Property" onClick={() => navigate('quickAddProperty')} />
                     </div>
                </section>

                <section>
                    <SectionTitle>Support</SectionTitle>
                     <div className="bg-dark-surface rounded-lg p-2 space-y-1">
                        <ProfileMenuItem icon="shield-check" label="Privacy Policy" onClick={() => navigate('privacyPolicy')} />
                        <ProfileMenuItem icon="question-mark-circle" label="FAQs" onClick={() => navigate('faqs')} />
                     </div>
                </section>
                
                 <section>
                     <div className="bg-dark-surface rounded-lg p-2">
                        <ProfileMenuItem icon="logout" label="Logout" onClick={handleLogout} isDanger />
                     </div>
                 </section>
            </div>
        </main>
    </div>
  );
};