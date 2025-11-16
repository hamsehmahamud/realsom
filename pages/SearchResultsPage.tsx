import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../hooks/useRouter';
import { fetchProperties } from '../services/geminiService';
import type { Property, SearchCriteria, AppliedFilters } from '../types';
import { PropertyType } from '../types';
import { SearchResultCard } from '../components/SearchResultCard';
import { Icon } from '../components/Icon';

// --- Local Components for SearchResultsPage ---

const SearchResultSkeleton: React.FC = () => (
    <div className="bg-dark-surface rounded-xl p-3 flex space-x-4 animate-pulse">
        <div className="w-28 h-auto md:w-32 bg-gray-700 rounded-lg flex-shrink-0"></div>
        <div className="flex-grow flex flex-col justify-between">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-700 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-3"></div>
            <div className="h-5 bg-gray-700 rounded w-1/3 self-end"></div>
        </div>
    </div>
);

const FilterChip: React.FC<{ icon: string; label: string; value: string; onClick: () => void; }> = ({ icon, label, value, onClick }) => (
    <button onClick={onClick} className="flex-shrink-0 bg-dark-surface rounded-lg px-3 py-2 flex items-center space-x-2 text-sm">
        <Icon name={icon} className="h-4 w-4 text-dark-text-secondary" />
        <span className="font-semibold text-dark-text">{label}:</span>
        <span className="text-dark-text-secondary">{value}</span>
    </button>
);

const ActionChip: React.FC<{ icon: string; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex-shrink-0 bg-dark-surface rounded-lg px-3 py-2 flex items-center space-x-2 text-sm">
        <Icon name={icon} className="h-4 w-4 text-dark-text-secondary" />
        <span className="font-semibold text-dark-text">{label}</span>
    </button>
);


const SelectionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: string[];
    selected: string[];
    onToggle: (option: string) => void;
    isMultiSelect?: boolean;
}> = ({ isOpen, onClose, title, options, selected, onToggle, isMultiSelect = true }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col animate-fade-in-fast">
            <header className="flex items-center p-4 border-b border-dark-surface flex-shrink-0">
                <button onClick={onClose} aria-label="Close" className="p-2 -ml-2"><Icon name="x" className="h-6 w-6 text-dark-text" /></button>
                <h2 className="text-lg font-bold text-dark-text text-center flex-grow">{title}</h2>
                <div className="w-10"></div>
            </header>
            <div className="overflow-y-auto flex-grow p-4">
                <ul className="space-y-2">
                    {options.map(option => (
                        <li key={option}>
                            <button 
                                onClick={() => onToggle(option)}
                                className="w-full text-left px-4 py-3 text-dark-text hover:bg-dark-surface transition-colors rounded-lg flex items-center justify-between"
                            >
                                <span>{option}</span>
                                {selected.includes(option) && <Icon name="check-circle" className="h-5 w-5 text-accent-blue" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <footer className="p-4 bg-dark-bg border-t border-dark-surface/50">
                <button onClick={onClose} className="w-full bg-accent-blue text-white rounded-lg font-bold py-4">Done</button>
            </footer>
        </div>
    );
};


// --- Main SearchResultsPage Component ---

type ModalFilterKey = 'status' | 'type' | 'city' | 'areaName';

export const SearchResultsPage: React.FC = () => {
    const { navigate, params } = useRouter();
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    
    const initialFilters = params.preFilter === 'featured' ? { status: ['Featured'] } : {};
    const [onPageFilters, setOnPageFilters] = useState<Partial<AppliedFilters>>(initialFilters);
    const [activeModal, setActiveModal] = useState<ModalFilterKey | null>(null);

    const pageTitle = params.title || 'Search Results';
    const appliedFilters: AppliedFilters | undefined = params.appliedFilters;

    useEffect(() => {
        const loadProperties = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const searchCriteria: SearchCriteria = { 
                    location: 'Mogadishu', 
                    propertyType: 'any', 
                    priceRange: 'any',
                    category: params.category,
                };
                const fetchedProperties = await fetchProperties(searchCriteria);
                setProperties(fetchedProperties);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        loadProperties();
    }, [params.category]);

    const filteredProperties = useMemo(() => {
        let results = properties;
        
        if (appliedFilters) {
            results = results.filter(p => {
                const { price, area, bedrooms, bathrooms, status, type, keyword } = appliedFilters;
                if (p.price < price.min || p.price > price.max) return false;
                if (p.area < area.min || p.area > area.max) return false;
                if (bedrooms.length > 0 && !bedrooms.includes(p.bedrooms)) return false;
                if (bathrooms.length > 0 && !bathrooms.includes(p.bathrooms)) return false;
                if (status.length > 0 && !p.tags?.some(tag => status.includes(tag))) return false;
                if (type.length > 0 && !type.includes(p.type)) return false;
                if (keyword && !p.title.toLowerCase().includes(keyword.toLowerCase()) && !p.description.toLowerCase().includes(keyword.toLowerCase())) return false;
                return true;
            });
        }
        
        const { status, type, city, areaName } = onPageFilters;
        if (status?.length) results = results.filter(p => p.tags?.some(tag => status.includes(tag)));
        if (type?.length) results = results.filter(p => type.includes(p.type));
        if (city?.length) results = results.filter(p => p.city && city.includes(p.city));
        if (areaName?.length) results = results.filter(p => p.areaName && areaName.includes(p.areaName));

        return results;

    }, [properties, appliedFilters, onPageFilters]);

    const handleFilterToggle = (field: ModalFilterKey, value: string) => {
        setOnPageFilters(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    const uniqueCities = useMemo(() => [...new Set(properties.map(p => p.city).filter(Boolean) as string[])].sort(), [properties]);
    const uniqueAreas = useMemo(() => [...new Set(properties.map(p => p.areaName).filter(Boolean) as string[])].sort(), [properties]);

    const filterOptions: { [key in ModalFilterKey]: string[] } = {
        status: ['For Sale', 'For Rent', 'Featured'],
        type: Object.values(PropertyType),
        city: uniqueCities,
        areaName: uniqueAreas,
    };

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-20 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back"><Icon name="arrow-left" className="h-6 w-6 text-dark-text" /></button>
                <h1 className="font-bold text-lg text-dark-text text-center flex-grow truncate">{pageTitle}</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => window.location.reload()} className="p-2" aria-label="Refresh"><Icon name="refresh" className="h-6 w-6 text-dark-text" /></button>
                    <button onClick={() => navigate('mapSearch', { properties: filteredProperties })} className="p-2" aria-label="Map view"><Icon name="map" className="h-6 w-6 text-dark-text" /></button>
                </div>
            </header>
            
            <div className="p-4 sticky top-[65px] z-20 bg-dark-bg">
                 <div className="space-y-3">
                    {/* Row 1 */}
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <ActionChip icon="sliders-alt" label="All Filters" onClick={() => navigate('filters', { appliedFilters })} />
                        <FilterChip icon="tag" label="Status" value={onPageFilters.status?.join(', ') || 'Any'} onClick={() => setActiveModal('status')} />
                        <FilterChip icon="building" label="Type" value={onPageFilters.type?.join(', ') || 'Any'} onClick={() => setActiveModal('type')} />
                    </div>
                    {/* Row 2 */}
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <FilterChip icon="location" label="City" value={onPageFilters.city?.join(', ') || 'Any'} onClick={() => setActiveModal('city')} />
                        <FilterChip icon="map" label="Area" value={onPageFilters.areaName?.join(', ') || 'Any'} onClick={() => setActiveModal('areaName')} />
                        <ActionChip icon="map" label="Search Map" onClick={() => navigate('mapSearch', { properties: filteredProperties })} />
                    </div>
                </div>
            </div>

            <main className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-dark-text">{filteredProperties.length} results found</p>
                    <div className="flex items-center space-x-1">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-accent-blue' : 'bg-dark-surface'}`}><Icon name="view-list" className="h-5 w-5 text-dark-text"/></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-accent-blue' : 'bg-dark-surface'}`}><Icon name="view-grid" className="h-5 w-5 text-dark-text"/></button>
                    </div>
                </div>

                {isLoading && Array.from({ length: 5 }).map((_, i) => <SearchResultSkeleton key={i} />)}
                {error && <div className="text-center py-10 px-4 bg-dark-surface rounded-lg"><p className="text-red-400">Error: {error}</p></div>}
                {!isLoading && !error && filteredProperties.length === 0 && (
                    <div className="text-center py-10 px-4 bg-dark-surface rounded-lg">
                        <h3 className="text-lg font-bold">No Properties Found</h3>
                        <p className="text-dark-text-secondary mt-1">Try adjusting your filters or search criteria.</p>
                    </div>
                )}
                {!isLoading && !error && filteredProperties.length > 0 && (
                     <div className="space-y-4">
                        {filteredProperties.map(p => <SearchResultCard key={p.id} property={p} />)}
                    </div>
                )}
            </main>
            
            {activeModal && (
                <SelectionModal
                    isOpen={!!activeModal}
                    onClose={() => setActiveModal(null)}
                    title={`Select ${activeModal.replace('Name', '')}`}
                    options={filterOptions[activeModal] || []}
                    selected={onPageFilters[activeModal] || []}
                    onToggle={(opt) => handleFilterToggle(activeModal, opt)}
                />
            )}
        </div>
    );
};