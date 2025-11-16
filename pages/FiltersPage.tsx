import React, { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import type { AppliedFilters } from '../types';
import { PropertyType } from '../types';
import { Icon } from '../components/Icon';

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4">
        <h3 className="text-lg font-bold text-dark-text mb-3">{title}</h3>
        {children}
    </div>
);

const MultiSelectButton: React.FC<{ options: (string|number)[]; selected: (string|number)[]; onToggle: (option: string|number) => void; }> = ({ options, selected, onToggle }) => (
    <div className="flex flex-wrap gap-2">
        {options.map(opt => (
            <button
                key={opt}
                type="button"
                onClick={() => onToggle(opt)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${selected.includes(opt) ? 'bg-accent-blue text-white' : 'bg-dark-surface text-dark-text'}`}
            >
                {opt}
            </button>
        ))}
    </div>
);

const defaultFilters: AppliedFilters = {
    price: { min: 0, max: 2000000 },
    area: { min: 0, max: 10000 },
    bedrooms: [],
    bathrooms: [],
    status: [],
    type: [],
    keyword: '',
};

export const FiltersPage: React.FC = () => {
    const { navigate, params } = useRouter();
    const [filters, setFilters] = useState<AppliedFilters>(params.appliedFilters || defaultFilters);

    const handleMultiSelectToggle = (field: 'bedrooms' | 'bathrooms' | 'status' | 'type', value: string | number) => {
        setFilters(prev => {
            const currentValues = prev[field] as (string | number)[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    const handleRangeChange = (field: 'price' | 'area', subfield: 'min' | 'max', value: string) => {
        const numValue = parseInt(value, 10);
        setFilters(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subfield]: isNaN(numValue) ? 0 : numValue
            }
        }));
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleApplyFilters = () => {
        navigate('searchResults', { appliedFilters: filters });
    };

    const handleResetFilters = () => {
        setFilters(defaultFilters);
    };

    return (
        <div className="bg-dark-bg text-dark-text min-h-screen flex flex-col">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('searchResults')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text text-center flex-grow truncate">Filters</h1>
                <button onClick={handleResetFilters} className="text-sm font-semibold text-accent-blue p-2 -mr-2">Reset</button>
            </header>

            <main className="flex-grow p-4 space-y-4 overflow-y-auto">
                <FilterSection title="Keyword">
                    <input
                        type="text"
                        name="keyword"
                        value={filters.keyword}
                        onChange={handleInputChange}
                        placeholder="Search by keyword..."
                        className="w-full px-4 py-3 bg-dark-surface border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    />
                </FilterSection>

                <FilterSection title="Price Range (USD)">
                    <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.price.min || ''}
                            onChange={(e) => handleRangeChange('price', 'min', e.target.value)}
                            className="w-full px-4 py-3 bg-dark-surface border-transparent rounded-md text-center"
                        />
                        <span className="text-dark-text-secondary">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.price.max || ''}
                            onChange={(e) => handleRangeChange('price', 'max', e.target.value)}
                            className="w-full px-4 py-3 bg-dark-surface border-transparent rounded-md text-center"
                        />
                    </div>
                </FilterSection>

                <FilterSection title="Area (sqft)">
                     <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.area.min || ''}
                            onChange={(e) => handleRangeChange('area', 'min', e.target.value)}
                            className="w-full px-4 py-3 bg-dark-surface border-transparent rounded-md text-center"
                        />
                        <span className="text-dark-text-secondary">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.area.max || ''}
                            onChange={(e) => handleRangeChange('area', 'max', e.target.value)}
                            className="w-full px-4 py-3 bg-dark-surface border-transparent rounded-md text-center"
                        />
                    </div>
                </FilterSection>

                <FilterSection title="Bedrooms">
                    <MultiSelectButton
                        options={[1, 2, 3, 4, 5]}
                        selected={filters.bedrooms}
                        onToggle={(opt) => handleMultiSelectToggle('bedrooms', opt)}
                    />
                </FilterSection>
                
                <FilterSection title="Bathrooms">
                     <MultiSelectButton
                        options={[1, 2, 3, 4, 5]}
                        selected={filters.bathrooms}
                        onToggle={(opt) => handleMultiSelectToggle('bathrooms', opt)}
                    />
                </FilterSection>

                <FilterSection title="Status">
                     <MultiSelectButton
                        options={['For Sale', 'For Rent']}
                        selected={filters.status}
                        onToggle={(opt) => handleMultiSelectToggle('status', opt)}
                    />
                </FilterSection>
                
                <FilterSection title="Property Type">
                    <MultiSelectButton
                        options={Object.values(PropertyType)}
                        selected={filters.type}
                        onToggle={(opt) => handleMultiSelectToggle('type', opt)}
                    />
                </FilterSection>

                <div className="pt-6 pb-4">
                    <button
                        onClick={handleApplyFilters}
                        className="w-full bg-accent-blue text-white rounded-lg font-bold py-4 hover:bg-opacity-90 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </main>
        </div>
    );
};