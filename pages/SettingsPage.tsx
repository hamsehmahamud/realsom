
import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';

const SettingsItem: React.FC<{ icon: string; title: string; subtitle: string; onClick?: () => void; isToggle?: boolean }> = ({ icon, title, subtitle, onClick, isToggle }) => (
    <button onClick={onClick} className="w-full flex items-center p-3 text-left hover:bg-dark-surface/50 rounded-lg transition-colors">
        <div className="w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center mr-4">
            <Icon name={icon} className="h-5 w-5 text-dark-text-secondary" />
        </div>
        <div className="flex-grow">
            <p className="font-semibold text-dark-text">{title}</p>
            <p className="text-xs text-dark-text-secondary">{subtitle}</p>
        </div>
        {isToggle ? (
            <div className="w-12 h-6 bg-green-500 rounded-full p-1 flex items-center">
                <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6"></div>
            </div>
        ) : (
             <Icon name="chevron-right" className="h-5 w-5 text-dark-text-secondary" />
        )}
    </button>
);

export const SettingsPage: React.FC = () => {
    const { navigate } = useRouter();
    const { currentUser } = useAuth();

    if (!currentUser) {
        navigate('auth');
        return null;
    }

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Settings</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4 space-y-6">
                <section>
                    <h2 className="text-xs font-bold uppercase text-dark-text-secondary px-3 mb-2">Account</h2>
                    <div className="bg-dark-surface rounded-lg p-2 space-y-1">
                        <SettingsItem icon="user" title="Edit Profile" subtitle="Update your name, photo, etc." onClick={() => navigate('profile')} />
                        <SettingsItem icon="key" title="Change Password" subtitle="Update your security" />
                    </div>
                </section>
                <section>
                    <h2 className="text-xs font-bold uppercase text-dark-text-secondary px-3 mb-2">Notifications</h2>
                     <div className="bg-dark-surface rounded-lg p-2 space-y-1">
                        <SettingsItem icon="bell" title="Push Notifications" subtitle="New properties & updates" isToggle />
                        <SettingsItem icon="envelope" title="Email Marketing" subtitle="Promotions & newsletters" isToggle />
                    </div>
                </section>
                 <section>
                    <h2 className="text-xs font-bold uppercase text-dark-text-secondary px-3 mb-2">More</h2>
                     <div className="bg-dark-surface rounded-lg p-2 space-y-1">
                        <SettingsItem icon="document-text" title="Privacy Policy" subtitle="How we handle your data" />
                        <SettingsItem icon="question-mark-circle" title="Help & Support" subtitle="Get assistance" />
                    </div>
                </section>
            </main>
        </div>
    );
};
