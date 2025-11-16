
import React, { useState, useEffect } from 'react';
import { useRouter } from '../hooks/useRouter';
import { fetchAgencies } from '../services/geminiService';
import type { Agency } from '../types';
import { Icon } from '../components/Icon';
import { AgencyCard } from '../components/AgencyCard';

const AgencyCardSkeleton: React.FC = () => (
    <div className="bg-dark-surface rounded-lg shadow-lg p-4 flex items-center space-x-4 animate-pulse">
        <div className="w-20 h-20 bg-gray-700 rounded-md flex-shrink-0"></div>
        <div className="flex-grow space-y-3">
            <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
);

export const AgenciesPage: React.FC = () => {
    const { navigate } = useRouter();
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAgencies = async () => {
            try {
                const data = await fetchAgencies();
                setAgencies(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load agencies.');
            } finally {
                setIsLoading(false);
            }
        };
        loadAgencies();
    }, []);

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Real Estate Agencies</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4 space-y-4">
                {isLoading && Array.from({ length: 6 }).map((_, i) => <AgencyCardSkeleton key={i} />)}
                {error && <div className="text-center py-10 px-4 bg-dark-surface rounded-lg"><p className="text-red-400">Error: {error}</p></div>}
                {!isLoading && !error && agencies.map(agency => <AgencyCard key={agency.id} agency={agency} />)}
            </main>
        </div>
    );
};
