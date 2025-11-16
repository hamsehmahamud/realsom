
import React from 'react';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';
import { useRouter, Page } from '../hooks/useRouter';

interface SidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MenuItem: React.FC<{ icon: string; label: string; onClick: () => void; isDanger?: boolean }> = ({ icon, label, onClick, isDanger }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${isDanger ? 'text-red-400 hover:bg-red-500/10' : 'text-dark-text hover:bg-dark-surface/50'}`}
    >
        <Icon name={icon} className={`h-6 w-6 mr-4 ${isDanger ? 'text-red-400' : 'text-dark-text-secondary'}`} />
        <span className="font-semibold">{label}</span>
    </button>
);

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
    const { currentUser, logout } = useAuth();
    const { navigate } = useRouter();

    const handleNavigate = (page: Page) => {
        onClose();
        navigate(page);
    };

    const handleProtectedNavigate = (page: Page) => {
        if (currentUser) {
            handleNavigate(page);
        } else {
            handleNavigate('auth');
        }
    };
    
    const handleLogout = () => {
        onClose();
        logout();
        navigate('home');
    }

    const menuItems: { icon: string; label: string; page: Page; protected?: boolean }[] = [
        { icon: 'plus-circle', label: 'Quick Add Property', page: 'quickAddProperty', protected: true },
        { icon: 'office-building', label: 'Agencies', page: 'agencies' },
        { icon: 'users', label: 'Agents', page: 'agents' },
        { icon: 'heart', label: 'Favorites', page: 'favorites', protected: true },
        { icon: 'cog', label: 'Settings', page: 'settings', protected: true },
        { icon: 'envelope', label: 'Contact Us', page: 'contactUs' },
    ];


    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isOpen ? 'opacity-60' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 h-full w-72 bg-dark-surface shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        {currentUser ? (
                             <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleProtectedNavigate('profile')}>
                                 <img 
                                    src={`https://i.pravatar.cc/150?u=${currentUser.email}`}
                                    alt="Profile" 
                                    className="w-10 h-10 rounded-full object-cover" 
                                  />
                                  <div>
                                    <p className="font-bold text-dark-text">{currentUser.name}</p>
                                    <p className="text-xs text-dark-text-secondary">{currentUser.email}</p>
                                  </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                 <div className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center">
                                    <Icon name="user" className="h-6 w-6 text-dark-text-secondary" />
                                 </div>
                                  <div>
                                    <p className="font-bold text-dark-text">Guest User</p>
                                  </div>
                            </div>
                        )}
                        <button onClick={onClose} aria-label="Close menu" className="p-2 -mr-2">
                            <Icon name="x" className="h-6 w-6 text-dark-text" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-grow p-4 space-y-1">
                        {!currentUser && <MenuItem icon="login" label="Login / Sign Up" onClick={() => handleNavigate('auth')} />}
                        
                        {menuItems.map(item => (
                             <MenuItem 
                                key={item.label} 
                                icon={item.icon} 
                                label={item.label} 
                                onClick={() => item.protected ? handleProtectedNavigate(item.page) : handleNavigate(item.page)} 
                             />
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        {currentUser && <MenuItem icon="logout" label="Logout" onClick={handleLogout} isDanger />}
                    </div>
                </div>
            </aside>
        </>
    );
};
