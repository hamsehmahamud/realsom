
import React from 'react';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-4 text-center transition-transform transform hover:scale-105">
      <img src={agent.imageUrl} alt={agent.name} className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-dark-bg" />
      <h3 className="text-md font-bold text-dark-text mt-3 truncate">{agent.name}</h3>
      <p className="text-xs text-dark-text-secondary truncate">{agent.agency}</p>
      <button className="mt-4 w-full bg-accent-blue text-white py-2 px-3 rounded-full font-bold text-sm">
        Contact
      </button>
    </div>
  );
};
