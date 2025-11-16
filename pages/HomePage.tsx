import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Property, SearchCriteria } from '../types';
import { fetchProperties } from '../services/geminiService';
import { Icon } from '../components/Icon';
import { useRouter } from '../hooks/useRouter';
import { SOMALIA_CITIES } from '../constants';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { SidebarMenu } from '../components/SidebarMenu';
import { NotificationPanel } from '../components/NotificationPanel';

// --- Local Components for HomePage ---

const CategoryButton: React.FC<{ icon: string; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-2 cursor-pointer group w-full">
        <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center transition-colors group-hover:bg-accent-blue">
            <Icon name={icon} className="h-7 w-7 text-dark-text-secondary transition-colors group-hover:text-white" />
        </div>
        <span className="text-sm font-medium text-dark-text">{label}</span>
    </button>
);

const FeaturedPropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const { navigate } = useRouter();
    const handleCardClick = () => navigate('propertyDetails', { property });
    const formatPrice = (price: number) => {
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `$${Math.round(price / 1000)}K`;
        return `$${price}`;
    };

    return (
        <div onClick={handleCardClick} className="bg-dark-surface rounded-xl p-3 flex space-x-3 w-80 md:w-96 flex-shrink-0 cursor-pointer transform hover:-translate-y-1 transition-transform duration-300">
            <img src={property.imageUrl} alt={property.title} className="w-28 h-full object-cover rounded-lg" />
            <div className="flex flex-col space-y-1 justify-between flex-grow text-xs">
                <div>
                    <h3 className="text-base font-bold text-dark-text truncate">{property.title}</h3>
                    <div className="flex items-center space-x-1.5 my-1">
                        <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-medium text-[10px]">Featured</span>
                        <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-medium text-[10px]">For Rent</span>
                    </div>
                    <p className="text-dark-text-secondary flex items-center truncate"><Icon name="location" className="h-3 w-3 mr-1.5 flex-shrink-0" />{property.address}</p>
                </div>
                <div className="flex items-center space-x-3 text-dark-text-secondary pt-1">
                    <span className="flex items-center"><Icon name="bed" className="h-4 w-4 mr-1"/>{property.bedrooms}</span>
                    <span className="flex items-center"><Icon name="bath" className="h-4 w-4 mr-1"/>{property.bathrooms}</span>
                    <span className="flex items-center"><Icon name="area" className="h-4 w-4 mr-1"/>{property.area} Sqft</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-dark-text-secondary font-semibold">{property.type.toUpperCase()}</span>
                    <span className="font-bold text-base text-dark-text">{formatPrice(property.price)}</span>
                </div>
            </div>
        </div>
    );
};

const LatestPropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    const { navigate } = useRouter();
    const handleCardClick = () => navigate('propertyDetails', { property });
    
    return (
        <div onClick={handleCardClick} className="bg-dark-surface rounded-xl p-2.5 w-52 flex-shrink-0 cursor-pointer transform hover:-translate-y-1 transition-transform duration-300">
            <img src={property.imageUrl} alt={property.title} className="w-full h-32 object-cover rounded-lg mb-2" />
            <h3 className="font-bold text-dark-text truncate">{property.title}</h3>
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded font-medium">For Sale</span>
        </div>
    );
};

const FeaturedCardSkeleton = () => (
    <div className="bg-dark-surface rounded-xl p-3 flex space-x-3 w-80 md:w-96 flex-shrink-0 animate-pulse">
        <div className="w-28 h-full bg-gray-700 rounded-lg"></div>
        <div className="flex flex-col space-y-2 justify-between flex-grow">
            <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            <div className="flex space-x-2">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-5 bg-gray-700 rounded w-1/3 self-end"></div>
        </div>
    </div>
);

const LatestCardSkeleton = () => (
    <div className="bg-dark-surface rounded-xl p-2.5 w-52 flex-shrink-0 animate-pulse">
        <div className="w-full h-32 bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-5 bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
    </div>
);

// --- HomePage Component ---

export const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('Loading...');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  const { navigate } = useRouter();

  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProperties = await fetchProperties(criteria);
      setProperties(fetchedProperties);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategoryClick = (categoryLabel: string) => {
    navigate('searchResults', { category: categoryLabel });
  };
  
  const handleSelectCity = (city: string) => {
      setLocation(city);
      setIsCityModalOpen(false);
  }

  // Effect to get user's location on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setLocation("Mogadishu"); // Fallback for non-supporting browsers
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error('Failed to fetch location details');
          
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Current Area";
          setLocation(city);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setLocation("Mogadishu"); // Fallback on geocoding error
        }
      },
      (error) => {
        console.warn(`Geolocation error: ${error.message}`);
        setLocation("Mogadishu"); // Fallback on permission denial or other errors
      }
    );
  }, []);

  // Effect to fetch properties once the location is determined
  useEffect(() => {
    if (location && location !== 'Loading...') {
      const searchCriteria: SearchCriteria = {
        location: location,
        propertyType: 'any',
        priceRange: '$50k - $1.5M',
      };
      handleSearch(searchCriteria);
    }
  }, [location, handleSearch]);

  // Effect to handle clicks outside the notification panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationPanelRef, notificationButtonRef]);


  const NoResults = ({ message }: { message: string }) => (
    <div className="w-full text-center py-10 px-4 bg-dark-surface rounded-lg">
      <p className="text-dark-text-secondary">{message}</p>
    </div>
  );

  return (
    <>
    <div className="bg-dark-bg text-dark-text min-h-full p-4 space-y-6">
        {/* Header section */}
        <header className="flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(true)} aria-label="Menu" className="p-2 -ml-2"><Icon name="menu" className="h-6 w-6 text-dark-text" /></button>
            <div className="text-center cursor-pointer" onClick={() => setIsCityModalOpen(true)}>
                <p className="text-xs text-dark-text-secondary uppercase">Current Location</p>
                <div className="flex items-center space-x-1">
                    <Icon name="location" className="h-4 w-4 text-dark-text" />
                    <span className="font-bold text-dark-text">{location}</span>
                    <Icon name="chevron-down" className="h-4 w-4 text-dark-text-secondary" />
                </div>
            </div>
             <div className="relative">
                <button ref={notificationButtonRef} onClick={() => setIsNotificationOpen(!isNotificationOpen)} aria-label="Notifications" className="p-2 -mr-2 relative">
                    <Icon name="bell" className="h-6 w-6 text-dark-text" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-dark-bg"></span>
                </button>
                <NotificationPanel 
                  isOpen={isNotificationOpen} 
                  onClose={() => setIsNotificationOpen(false)} 
                  panelRef={notificationPanelRef}
                />
            </div>
        </header>

        {/* Search Bar */}
        <div className="flex items-center space-x-3">
            <button onClick={() => navigate('searchResults')} className="flex-grow flex items-center bg-dark-surface px-4 py-3 rounded-lg space-x-3 text-left">
                <Icon name="search" className="h-5 w-5 text-dark-text-secondary" />
                <span className="text-dark-text-secondary font-medium">Search</span>
            </button>
            <button onClick={() => navigate('filters')} aria-label="Filters" className="bg-dark-surface p-3 rounded-lg">
                <Icon name="sliders" className="h-6 w-6 text-dark-text" />
            </button>
        </div>

        {/* Categories */}
        <section>
            <h2 className="text-xl font-bold mb-4">What are you looking for?</h2>
            <div className="grid grid-cols-4 gap-1">
                <CategoryButton icon="key" label="For Rent" onClick={() => handleCategoryClick('For Rent')} />
                <CategoryButton icon="cash" label="For Sale" onClick={() => handleCategoryClick('For Sale')} />
                <CategoryButton icon="building" label="Commercial" onClick={() => handleCategoryClick('Commercial')} />
                <CategoryButton icon="home-modern" label="Residential" onClick={() => handleCategoryClick('Residential')} />
            </div>
        </section>

        {/* Featured Properties */}
        <section>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Featured Properties</h2>
                <button onClick={() => navigate('searchResults', { title: 'Featured Properties', preFilter: 'featured' })} className="text-sm font-medium text-accent-blue">See All &gt;</button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {isLoading ? Array.from({ length: 3 }).map((_, i) => <FeaturedCardSkeleton key={i} />)
                 : error ? <NoResults message={error} />
                 : properties.length > 0 ? properties.slice(0, 3).map(p => <FeaturedPropertyCard key={p.id} property={p} />)
                 : <NoResults message="No featured properties found." />}
            </div>
        </section>

        {/* Latest Properties */}
        <section>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Latest Properties in {location === 'Loading...' ? 'your area' : location}</h2>
                <button onClick={() => navigate('searchResults', { title: `Latest Properties in ${location}`, preFilter: 'latest' })} className="text-sm font-medium text-accent-blue">See All &gt;</button>
            </div>
             <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {isLoading ? Array.from({ length: 4 }).map((_, i) => <LatestCardSkeleton key={i} />)
                 : error ? <NoResults message={error} />
                 : properties.length > 3 ? properties.slice(3).map(p => <LatestPropertyCard key={p.id} property={p} />)
                 : <NoResults message="No latest properties found." />}
            </div>
        </section>
    </div>
    <CitySelectorModal 
        isOpen={isCityModalOpen} 
        onClose={() => setIsCityModalOpen(false)}
        onSelectCity={handleSelectCity}
        cities={SOMALIA_CITIES}
    />
    <SidebarMenu 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
    />
    </>
  );
};
