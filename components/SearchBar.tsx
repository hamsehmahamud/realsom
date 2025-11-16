
import React, { useState } from 'react';
import type { SearchCriteria } from '../types';
import { PropertyType } from '../types';
import { Icon } from './Icon';

interface SearchBarProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('New York, NY');
  const [propertyType, setPropertyType] = useState<PropertyType | 'any'>('any');
  const [priceRange, setPriceRange] = useState('$500k - $1M');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, propertyType, priceRange });
  };
  
  const priceRanges = ['$100k - $500k', '$500k - $1M', '$1M - $3M', '$3M+'];

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-2xl flex flex-col lg:flex-row items-center gap-4 w-full max-w-4xl">
      {/* Location Input */}
      <div className="w-full lg:w-1/3 flex items-center border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 py-2 lg:py-0 lg:pr-4">
        <Icon name="location" className="h-6 w-6 text-gray-400 mr-3" />
        <div className="flex flex-col w-full">
            <label htmlFor="location" className="text-xs font-bold text-gray-500">LOCATION</label>
            <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="font-semibold text-brand-dark w-full bg-transparent focus:outline-none"
            placeholder="e.g. 'New York, NY'"
            />
        </div>
      </div>

      {/* Property Type Dropdown */}
      <div className="w-full lg:w-1/3 flex items-center border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 py-2 lg:py-0 lg:px-4">
        <Icon name="building" className="h-6 w-6 text-gray-400 mr-3" />
        <div className="flex flex-col w-full">
            <label htmlFor="propertyType" className="text-xs font-bold text-gray-500">PROPERTY TYPE</label>
            <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType | 'any')}
            className="font-semibold text-brand-dark w-full bg-transparent focus:outline-none appearance-none"
            >
            <option value="any">Any Type</option>
            {Object.values(PropertyType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
      </div>

      {/* Price Range Dropdown */}
      <div className="w-full lg:w-1/3 flex items-center py-2 lg:py-0 lg:pl-4">
         <Icon name="cash" className="h-6 w-6 text-gray-400 mr-3" />
         <div className="flex flex-col w-full">
            <label htmlFor="priceRange" className="text-xs font-bold text-gray-500">PRICE RANGE</label>
            <select
            id="priceRange"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="font-semibold text-brand-dark w-full bg-transparent focus:outline-none appearance-none"
            >
            {priceRanges.map(range => <option key={range} value={range}>{range}</option>)}
            </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full lg:w-auto bg-brand-green text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
            </>
        ) : "Search" }
      </button>
    </form>
  );
};