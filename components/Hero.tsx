
import React from 'react';
import type { SearchCriteria } from '../types';
import { SearchBar } from './SearchBar';

interface HeroProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  return (
    <div className="relative bg-cover bg-center h-[500px]" style={{ backgroundImage: "url('https://picsum.photos/seed/realestate/1600/800')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">
          Find Your Dream Home
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
          With our advanced search, you can find the perfect property that fits your lifestyle and budget. Let's get started.
        </p>
        <div className="w-full px-4 md:px-0 md:max-w-4xl">
           <SearchBar onSearch={onSearch} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
