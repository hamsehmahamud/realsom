import React from 'react';
import { PropertyType } from '../types';
import { Icon } from '../components/Icon';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-serif mb-8 text-center">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.values(PropertyType).map(type => (
          <div key={type} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer">
            <Icon name="building" className="h-12 w-12 text-brand-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-dark">{type}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};