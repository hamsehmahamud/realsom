import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { RouterProvider, useRouter } from './hooks/useRouter';
import { Footer } from './components/Footer';

// Import all page components
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AddPropertyPage } from './pages/AddPropertyPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { CartPage } from './pages/CartPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AuthPage } from './pages/AuthPage';
import { AgenciesPage } from './pages/AgenciesPage';
import { AgentsPage } from './pages/AgentsPage';
import { QuickAddPropertyPage } from './pages/QuickAddPropertyPage';
import { SettingsPage } from './pages/SettingsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FiltersPage } from './pages/FiltersPage';
import { MapSearchPage } from './pages/MapSearchPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { FaqsPage } from './pages/FaqsPage';


const PageRenderer: React.FC = () => {
    const { page } = useRouter();

    switch (page) {
        case 'home':
            return <HomePage />;
        case 'categories':
            return <CategoriesPage />;
        case 'add':
            return <AddPropertyPage />;
        case 'favorites':
            return <FavoritesPage />;
        case 'profile':
            return <ProfilePage />;
        case 'dashboard':
            return <DashboardPage />;
        case 'propertyDetails':
            return <PropertyDetailsPage />;
        case 'cart':
            return <CartPage />;
        case 'searchResults':
            return <SearchResultsPage />;
        case 'auth':
            return <AuthPage />;
        case 'agencies':
            return <AgenciesPage />;
        case 'agents':
            return <AgentsPage />;
        case 'quickAddProperty':
            return <QuickAddPropertyPage />;
        case 'settings':
            return <SettingsPage />;
        case 'contactUs':
            return <ContactUsPage />;
        case 'filters':
            return <FiltersPage />;
        case 'mapSearch':
            return <MapSearchPage />;
        case 'privacyPolicy':
            return <PrivacyPolicyPage />;
        case 'faqs':
            return <FaqsPage />;
        default:
            return <HomePage />;
    }
};

const App: React.FC = () => {
  useEffect(() => {
    const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';
    // Prevent adding the script more than once
    if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) {
        return;
    }

    const script = document.createElement('script');
    // IMPORTANT: This key is managed externally and should not be modified.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}`;
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    document.head.appendChild(script);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
            <RouterProvider>
                <div className="relative min-h-screen">
                    <main className="pb-20 md:pb-0">
                        <PageRenderer />
                    </main>
                    <Footer />
                </div>
            </RouterProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;