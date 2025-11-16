
import React from 'react';
import type { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="bg-gray-300 h-56 w-full"></div>
        <div className="p-6">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                <div className="h-5 bg-gray-300 rounded w-full"></div>
                <div className="h-5 bg-gray-300 rounded w-full"></div>
                <div className="h-5 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    </div>
);


export const PropertyList: React.FC<PropertyListProps> = ({ properties, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-16 px-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <h3 className="text-2xl font-semibold text-red-700">Oops! Something went wrong.</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <p className="text-gray-500 mt-4">Please try refreshing the page or adjust your search criteria.</p>
        </div>
    );
  }

  if (properties.length === 0) {
    return (
        <div className="text-center py-16 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <h3 className="text-2xl font-semibold text-brand-dark">No Properties Found</h3>
            <p className="text-gray-600 mt-2">We couldn't find any properties matching your search.</p>
            <p className="text-gray-500 mt-1">Try broadening your search criteria.</p>
        </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
