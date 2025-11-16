import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { PropertyCard } from '../components/PropertyCard';
import { Icon } from '../components/Icon';
import { useRouter } from '../hooks/useRouter';

// Mock data for saved searches as the save functionality is not yet implemented
const mockSavedSearches = [
  {
    id: '1',
    name: 'Apartments in Mogadishu',
    filters: 'Type: Apartment, Status: For Rent, Price: $500-$1500',
  },
  {
    id: '2',
    name: 'Houses with 3+ Bedrooms',
    filters: 'Type: House, Bedrooms: 3, 4, 5+',
  },
];


const SavedSearchCard: React.FC<{ search: typeof mockSavedSearches[0] }> = ({ search }) => {
    const { navigate } = useRouter();

    const handleView = () => {
        // In a real implementation, this would pass the filters to the search page
        navigate('searchResults'); 
    };

    const handleDelete = () => {
        // In a real implementation, this would call a context function to remove the search
        alert(`Search "${search.name}" would be deleted.`);
    };

    return (
        <div className="bg-dark-surface p-4 rounded-lg flex items-center justify-between">
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-dark-text truncate">{search.name}</h3>
                <p className="text-sm text-dark-text-secondary truncate">{search.filters}</p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                <button onClick={handleView} className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-bold">View</button>
                <button onClick={handleDelete} className="p-2 text-dark-text-secondary hover:text-red-400">
                    <Icon name="trash" className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};


export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'favorites' | 'searches'>('favorites');

  return (
    <div className="bg-dark-bg text-dark-text min-h-full">
        <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
            <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
            </button>
            <h1 className="font-bold text-lg text-dark-text mx-auto">Saved</h1>
            <div className="w-6 h-6"></div>
        </header>

        <main className="p-4">
            {/* Tab Switcher */}
            <div className="flex justify-center mb-6">
              <div className="bg-dark-surface p-1 rounded-full flex">
                <button 
                    onClick={() => setActiveTab('favorites')} 
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'favorites' ? 'bg-dark-bg shadow-lg text-dark-text' : 'text-dark-text-secondary'}`}
                >
                    Favorites
                </button>
                <button 
                    onClick={() => setActiveTab('searches')} 
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'searches' ? 'bg-dark-bg shadow-lg text-dark-text' : 'text-dark-text-secondary'}`}
                >
                    Saved Searches
                </button>
              </div>
            </div>

            {/* Content based on tab */}
            {activeTab === 'favorites' && (
                <>
                    {favorites.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-4 bg-dark-surface rounded-lg">
                            <Icon name="heart" className="h-16 w-16 text-dark-text-secondary mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold text-dark-text">Your Favorites List is Empty</h3>
                            <p className="text-dark-text-secondary mt-2">Click the heart icon on any property to save it here.</p>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'searches' && (
                <div className="space-y-4">
                    {mockSavedSearches.length > 0 ? (
                       mockSavedSearches.map(search => <SavedSearchCard key={search.id} search={search} />)
                    ) : (
                         <div className="text-center py-16 px-4 bg-dark-surface rounded-lg">
                            <Icon name="search" className="h-16 w-16 text-dark-text-secondary mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold text-dark-text">You have no saved searches.</h3>
                            <p className="text-dark-text-secondary mt-2">Save a search from the results page to see it here.</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    </div>
  );
};