import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Property, AppliedFilters } from '../types';

export type Page = 
  | 'home'
  | 'searchResults'
  | 'propertyDetails'
  | 'favorites'
  | 'cart'
  | 'profile'
  | 'auth'
  | 'add'
  | 'quickAddProperty'
  | 'agencies'
  | 'agents'
  | 'settings'
  | 'contactUs'
  | 'filters'
  | 'categories'
  | 'dashboard'
  | 'mapSearch'
  | 'privacyPolicy'
  | 'faqs';

export type RouterParams = {
  property?: Property;
  category?: string;
  title?: string;
  preFilter?: 'featured' | 'latest';
  appliedFilters?: AppliedFilters;
  properties?: Property[];
  view?: 'form';
};

interface RouterContextType {
  page: Page;
  params: RouterParams;
  navigate: (page: Page, params?: RouterParams) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<RouterParams>({});

  const navigate = (page: Page, params: RouterParams = {}) => {
    setPage(page);
    setParams(params);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const value = { page, params, navigate };

  return React.createElement(RouterContext.Provider, { value: value }, children);
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
