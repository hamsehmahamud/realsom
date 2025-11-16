
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';

interface CitySelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCity: (city: string) => void;
    cities: string[];
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({ isOpen, onClose, onSelectCity, cities }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCities = useMemo(() => 
        cities.filter(city => 
            city.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort(), 
    [cities, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col animate-fade-in-fast">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-dark-surface flex-shrink-0">
                <button onClick={onClose} aria-label="Close" className="p-2 -ml-2">
                    <Icon name="x" className="h-6 w-6 text-dark-text" />
                </button>
                <h2 className="text-lg font-bold text-dark-text text-center flex-grow">Select City</h2>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {/* Search Input */}
            <div className="p-4 flex-shrink-0">
                <div className="relative">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search for a city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-surface border-transparent rounded-lg py-3 pl-11 pr-4 text-dark-text placeholder-dark-text-secondary focus:ring-2 focus:ring-accent-blue focus:outline-none"
                    />
                </div>
            </div>

            {/* City List */}
            <div className="overflow-y-auto flex-grow">
                <ul className="divide-y divide-dark-surface">
                    {filteredCities.map(city => (
                        <li key={city}>
                            <button 
                                onClick={() => onSelectCity(city)}
                                className="w-full text-left px-4 py-4 text-dark-text hover:bg-dark-surface transition-colors"
                            >
                                {city}
                            </button>
                        </li>
                    ))}
                </ul>
                {filteredCities.length === 0 && (
                    <div className="text-center py-10 text-dark-text-secondary">
                        <p>No cities found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};
