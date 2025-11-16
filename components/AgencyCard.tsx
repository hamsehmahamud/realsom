
import React from 'react';
import type { Agency } from '../types';
import { Icon } from './Icon';

interface AgencyCardProps {
  agency: Agency;
}

export const AgencyCard: React.FC<AgencyCardProps> = ({ agency }) => {
  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-4 flex items-center space-x-4 cursor-pointer transition-transform transform hover:scale-[1.02]">
      <img src={agency.logoUrl} alt={`${agency.name} logo`} className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-gray-700" />
      <div className="flex-grow min-w-0">
        <h3 className="text-md font-bold text-dark-text truncate">{agency.name}</h3>
        <p className="text-xs text-dark-text-secondary mt-1 flex items-center truncate">
          <Icon name="location" className="h-3 w-3 mr-1.5 flex-shrink-0" />
          {agency.address}
        </p>
        <p className="text-xs text-dark-text-secondary mt-2">{agency.description}</p>
        <div className="mt-2 text-sm font-semibold text-accent-blue">
          {agency.propertiesCount} Properties Listed
        </div>
      </div>
    </div>
  );
};
