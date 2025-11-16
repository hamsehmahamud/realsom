import React from 'react';
import { Icon } from './Icon';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement>;
}

const mockNotifications = [
    { id: 1, icon: 'home-modern', title: 'New Listing Nearby', message: 'A 3-bed apartment just went up for sale in your area.', time: '5m ago' },
    { id: 2, icon: 'tag', title: 'Price Drop Alert', message: 'The price for "Luxury Villa" was reduced by $25,000.', time: '1h ago' },
    { id: 3, icon: 'chat-bubble', title: 'New Message', message: 'Agent Omar Hassan replied to your inquiry.', time: '3h ago' },
    { id: 4, icon: 'star', title: 'Review Request', message: 'How was your recent tour of the Seaside Condo?', time: '1d ago' },
];

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, panelRef }) => {
  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-80 bg-dark-surface rounded-lg shadow-2xl border border-gray-700/50 z-50 animate-fade-in-fast"
    >
        <div className="p-3 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="font-bold text-dark-text">Notifications</h3>
            <button className="text-xs font-semibold text-accent-blue flex items-center space-x-1">
                <Icon name="check" className="h-3.5 w-3.5" />
                <span>Mark all as read</span>
            </button>
        </div>
        
        {mockNotifications.length > 0 ? (
            <ul className="divide-y divide-gray-700/50 max-h-96 overflow-y-auto">
                {mockNotifications.map(notif => (
                    <li key={notif.id} className="p-3 hover:bg-dark-bg/40 transition-colors cursor-pointer flex items-start space-x-3">
                        <div className="w-8 h-8 bg-dark-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Icon name={notif.icon} className="h-4 w-4 text-dark-text-secondary" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm text-dark-text">{notif.title}</p>
                            <p className="text-xs text-dark-text-secondary">{notif.message}</p>
                        </div>
                        <span className="text-xs text-dark-text-secondary flex-shrink-0">{notif.time}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="p-6 text-center text-sm text-dark-text-secondary">
                You have no new notifications.
            </div>
        )}
    </div>
  );
};