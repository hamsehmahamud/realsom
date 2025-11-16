
import React, { useState, useEffect } from 'react';
import { useRouter } from '../hooks/useRouter';
import { fetchAgents } from '../services/geminiService';
import type { Agent } from '../types';
import { Icon } from '../components/Icon';
import { AgentCard } from '../components/AgentCard';

const AgentCardSkeleton: React.FC = () => (
    <div className="bg-dark-surface rounded-lg shadow-lg p-4 text-center animate-pulse">
        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto"></div>
        <div className="h-5 bg-gray-700 rounded w-3/4 mx-auto mt-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mt-2"></div>
        <div className="h-8 bg-gray-700 rounded-full w-3/4 mx-auto mt-4"></div>
    </div>
);

export const AgentsPage: React.FC = () => {
    const { navigate } = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAgents = async () => {
            try {
                const data = await fetchAgents();
                setAgents(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load agents.');
            } finally {
                setIsLoading(false);
            }
        };
        loadAgents();
    }, []);

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Find an Agent</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {isLoading && Array.from({ length: 8 }).map((_, i) => <AgentCardSkeleton key={i} />)}
                    {error && <div className="col-span-full text-center py-10 px-4 bg-dark-surface rounded-lg"><p className="text-red-400">Error: {error}</p></div>}
                    {!isLoading && !error && agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
                </div>
            </main>
        </div>
    );
};
