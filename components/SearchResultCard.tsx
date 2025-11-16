import React from 'react';
import type { Property } from '../types';
import { Icon } from './Icon';
import { useRouter } from '../hooks/useRouter';

export const SearchResultCard: React.FC<{ property: Property }> = ({ property }) => {
    const { navigate } = useRouter();

    const formatPrice = (price: number) => {
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `$${Math.round(price / 1000)}K`;
        return `$${price}`;
    };

    const handleCardClick = () => {
        navigate('propertyDetails', { property });
    };

    return (
        <div 
            onClick={handleCardClick}
            className="bg-dark-surface rounded-xl p-3 flex space-x-4 cursor-pointer transition-transform transform hover:scale-[1.02]"
        >
            <img src={property.imageUrl} alt={property.title} className="w-28 h-auto md:w-32 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-grow flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        {property.tags?.map(tag => (
                             <span key={tag} className="bg-gray-700 text-gray-300 text-[10px] px-2 py-0.5 rounded font-medium">{tag}</span>
                        ))}
                    </div>
                    <h3 className="font-bold text-lg text-dark-text truncate">{property.title}</h3>
                    <p className="text-xs text-dark-text-secondary mt-1 flex items-center truncate">
                        <Icon name="location" className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        {property.address}
                    </p>
                </div>
                <div className="flex items-center space-x-3 text-xs text-dark-text-secondary mt-2">
                    <span className="flex items-center"><Icon name="bed" className="h-4 w-4 mr-1"/>{property.bedrooms}</span>
                    <span className="flex items-center"><Icon name="bath" className="h-4 w-4 mr-1"/>{property.bathrooms}</span>
                    <span className="flex items-center"><Icon name="area" className="h-4 w-4 mr-1"/>{property.area} Sq Ft</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-dark-text-secondary font-semibold text-xs">{property.type.toUpperCase()}</span>
                    <span className="font-bold text-lg text-dark-text">{formatPrice(property.price)}<span className="text-sm font-medium text-dark-text-secondary">{property.priceSuffix}</span></span>
                </div>
            </div>
        </div>
    );
};