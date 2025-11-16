import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-4xl font-bold text-brand-dark font-serif mb-8">Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-brand-dark mb-4">Welcome to your Dashboard</h2>
        <p className="text-gray-600">This page is currently under construction. Check back soon for more features!</p>
      </div>
    </div>
  );
};
