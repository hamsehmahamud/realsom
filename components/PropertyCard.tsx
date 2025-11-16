import React from 'react';
import type { Property } from '../types';
import { Icon } from './Icon';
import { useFavorites } from '../context/FavoritesContext';
import { useRouter } from '../hooks/useRouter';

interface PropertyCardProps {
  property: Property;
}

const InfoPill: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <div className="flex items-center text-sm text-dark-text-secondary">
        <Icon name={icon} className="h-5 w-5 mr-2 text-accent-blue" />
        <span>{text}</span>
    </div>
);

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { navigate } = useRouter();
  const isFav = isFavorite(property.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click-through if any
    if (isFav) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  const handleCardClick = () => {
    navigate('propertyDetails', { property });
  };

  return (
    <div 
      className="bg-dark-surface rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img src={property.imageUrl} alt={property.title} className="w-full h-56 object-cover" />
        <div className="absolute top-4 left-4 bg-dark-bg text-white text-xs font-bold px-3 py-1 rounded-full">{property.type}</div>
        <button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-dark-bg/80 backdrop-blur-sm p-2 rounded-full text-dark-text hover:text-red-500 transition-colors duration-200"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon name="heart" className={`h-6 w-6 ${isFav ? 'fill-red-500 text-red-500' : 'fill-none'}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-white text-xl font-bold font-serif">{property.title}</h3>
            <p className="text-gray-300 text-sm">{property.address}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <span className="text-3xl font-bold text-dark-text">{formatPrice(property.price)}</span>
        </div>
        <p className="text-dark-text-secondary mb-6 h-12 overflow-hidden">{property.description}</p>
        <div className="grid grid-cols-3 gap-4 border-t border-gray-700 pt-4">
            <InfoPill icon="bed" text={`${property.bedrooms} beds`} />
            <InfoPill icon="bath" text={`${property.bathrooms} baths`} />
            <InfoPill icon="area" text={`${property.area} sqft`} />
        </div>
      </div>
    </div>
  );
};