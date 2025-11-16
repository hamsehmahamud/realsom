
import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../context/AuthContext';
import { SearchResultCard } from '../components/SearchResultCard';
import type { Property } from '../types';
import { PropertyType } from '../types';


const NoPropertiesIllustration: React.FC = () => (
  <div className="relative w-48 h-48 flex items-center justify-center">
    <div className="absolute inset-0 bg-brand-green-light rounded-full"></div>
     <svg className="relative w-24 h-24 text-brand-green" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 54V34H40V54" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 54V38H24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M40 54V42H44V54" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="28" y="46" width="4" height="8" fill="#F0FFF4" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="34" y="46" width="4" height="8" fill="#F0FFF4" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="28" y="40" width="4" height="4" fill="#F0FFF4" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="34" y="40" width="4" height="4" fill="#F0FFF4" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="28" y="34" width="4" height="4" fill="#F0FFF4" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="34" y="34" width="4" height="4" fill="#F0FFF4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 24L24 34L26 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 44H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="47" r="1.5" fill="currentColor"/>
    </svg>
  </div>
);

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="px-6 pt-6 pb-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
            {Array.from({ length: 3 }).map((_, index) => {
                const step = index + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-brand-green text-white' : isCompleted ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {isCompleted ? '✓' : step}
                            </div>
                        </div>
                        {step < 3 && <div className={`flex-1 h-1 mx-2 ${isCompleted || isActive ? 'bg-brand-green' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                )
            })}
        </div>
    </div>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
        {children}
    </div>
);

const ToggleButton: React.FC<{ options: string[]; selected: string; onSelect: (option: string) => void }> = ({ options, selected, onSelect }) => (
    <div className="flex space-x-3">
        {options.map(option => (
            <button key={option} type="button" onClick={() => onSelect(option)} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${selected === option ? 'bg-brand-green-light text-brand-green border border-brand-green/30' : 'bg-gray-100 text-gray-600'}`}>
                {option}
            </button>
        ))}
    </div>
);

const NumberSelector: React.FC<{ label: string, options: string[], selected: string, onSelect: (value: string) => void }> = ({ label, options, selected, onSelect }) => (
     <FormSection title={label}>
        <div className="flex space-x-2">
            {options.map(opt => (
                <button key={opt} type="button" onClick={() => onSelect(opt)} className={`w-10 h-10 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${selected === opt ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {opt}
                </button>
            ))}
        </div>
    </FormSection>
);

const PropertyForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { currentUser } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        propertyName: '',
        price: '',
        lookingTo: 'Sell',
        category: 'Residential',
        address: '',
        area: '',
        city: '',
        landmark: '',
        totalArea: '',
        bedrooms: '2',
        bathrooms: '2',
        furnishing: 'Fully Furnished',
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        if (!currentUser) {
            alert("You must be logged in to submit a property.");
            return;
        }

        const newProperty: Property = {
            id: `userprop_${Date.now()}`,
            title: formData.propertyName,
            address: `${formData.address}, ${formData.city}`,
            price: parseInt(formData.price, 10) || 0,
            bedrooms: parseInt(formData.bedrooms, 10) || 0,
            bathrooms: parseInt(formData.bathrooms, 10) || 0,
            area: parseInt(formData.totalArea, 10) || 0,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
            type: formData.category as PropertyType, // Simple casting
            description: `A lovely ${formData.bedrooms} bed, ${formData.bathrooms} bath ${formData.category.toLowerCase()} located in ${formData.city}.`,
        };
        
        const storageKey = `my_properties_${currentUser.email}`;
        const existingPropertiesRaw = localStorage.getItem(storageKey);
        const existingProperties: Property[] = existingPropertiesRaw ? JSON.parse(existingPropertiesRaw) : [];
        const updatedProperties = [...existingProperties, newProperty];
        localStorage.setItem(storageKey, JSON.stringify(updatedProperties));

        alert("Property submitted successfully!");
        onBack(); // Go back to the list view
    };

    return (
        <div className="flex flex-col h-full bg-brand-light text-brand-dark">
            <header className="bg-brand-green text-white p-4 shadow-md w-full flex-shrink-0">
                <div className="container mx-auto flex items-center">
                <button onClick={step === 1 ? onBack : handlePrev} aria-label="Go back" className="p-2 -ml-2">
                    <Icon name="arrow-left" className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-center flex-grow">Post a Property</h1>
                </div>
            </header>
            <ProgressBar currentStep={step} />

            <main className="flex-grow overflow-y-auto p-6">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Details</h2>
                        <FormSection title="Property Name">
                            <input type="text" placeholder="e.g., 'Sunny 2BHK Apartment'" value={formData.propertyName} onChange={(e) => handleChange('propertyName', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-green focus:border-brand-green" />
                        </FormSection>
                         <FormSection title="Price (USD)">
                            <input type="number" placeholder="e.g., 250000" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-green focus:border-brand-green" />
                        </FormSection>
                        <FormSection title="Looking To">
                           <ToggleButton options={['Sell', 'Rent']} selected={formData.lookingTo} onSelect={(val) => handleChange('lookingTo', val)} />
                        </FormSection>
                        <FormSection title="Category">
                             <ToggleButton options={['House', 'Apartment', 'Condo', 'Land']} selected={formData.category} onSelect={(val) => handleChange('category', val)} />
                        </FormSection>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Details</h2>
                        <div className="space-y-4">
                            <div className="relative">
                                <input type="text" placeholder="Address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-green focus:border-brand-green pr-10" />
                                <Icon name="target" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-green"/>
                            </div>
                            <input type="text" placeholder="Area / Neighborhood" value={formData.area} onChange={(e) => handleChange('area', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-green focus:border-brand-green" />
                            <input type="text" placeholder="City" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-green focus:border-brand-green" />
                        </div>
                    </div>
                )}
                 {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                         <FormSection title="Total Area (sqft)">
                            <input type="number" placeholder="Enter Total Area" value={formData.totalArea} onChange={e => handleChange('totalArea', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                        </FormSection>
                        <NumberSelector label="Bedrooms" options={['1','2','3','4','5+']} selected={formData.bedrooms} onSelect={(v) => handleChange('bedrooms', v)} />
                        <NumberSelector label="Bathrooms" options={['1','2','3','4','5+']} selected={formData.bathrooms} onSelect={(v) => handleChange('bathrooms', v)} />
                        <FormSection title="Furnishing">
                             <ToggleButton options={['Fully Furnished', 'Semi Furnished', 'Unfurnished']} selected={formData.furnishing} onSelect={(val) => handleChange('furnishing', val)} />
                        </FormSection>
                    </div>
                )}
            </main>

            <footer className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between">
                    {step > 1 && <button onClick={handlePrev} className="font-bold text-gray-700 px-6 py-3">Back</button>}
                    <button onClick={step === 3 ? handleSubmit : handleNext} className="w-full bg-brand-green text-white rounded-lg font-bold py-4 hover:bg-opacity-90 transition-colors disabled:bg-gray-400 ml-auto">
                        {step === 3 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

const MyPropertiesList: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
    const { navigate } = useRouter();
    const { currentUser } = useAuth();
    const [myProperties, setMyProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (currentUser) {
            const storageKey = `my_properties_${currentUser.email}`;
            const storedProperties = localStorage.getItem(storageKey);
            if (storedProperties) {
                setMyProperties(JSON.parse(storedProperties));
            }
        }
    }, [currentUser]);


    return (
        <div className="flex flex-col h-full bg-dark-bg text-dark-text">
            <header className="bg-dark-surface text-white p-4 shadow-md w-full flex-shrink-0">
                <div className="container mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('home')} aria-label="Go back" className="p-2 -ml-2">
                        <Icon name="arrow-left" className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold">My Properties</h1>
                    <button onClick={onAdd} aria-label="Add new property" className="p-2 -mr-2">
                        <Icon name="plus" className="h-7 w-7" />
                    </button>
                </div>
            </header>
        
            <div className="p-4 bg-dark-bg">
                <div className="relative">
                    <input type="text" placeholder="Search your Properties" className="w-full pl-5 pr-12 py-3 rounded-full bg-dark-surface border-transparent focus:bg-dark-surface focus:ring-accent-blue focus:border-accent-blue transition text-white"/>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Icon name="search" className="h-6 w-6 text-gray-400" />
                    </div>
                </div>
            </div>
            
            {myProperties.length > 0 ? (
                 <main className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {myProperties.map(p => <SearchResultCard key={p.id} property={p} />)}
                </main>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4 -mt-8">
                    <NoPropertiesIllustration />
                    <h3 className="text-2xl font-bold text-dark-text mt-6">No Properties Found</h3>
                    <p className="text-gray-400 mt-2">Click the '+' button to add your first property.</p>
                </div>
            )}
        </div>
    );
};

export const AddPropertyPage: React.FC = () => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const { currentUser } = useAuth();
    const { navigate } = useRouter();

    useEffect(() => {
        if (!currentUser) {
            // This component should not be reachable without a user,
            // but as a safeguard, redirect to home.
            navigate('home');
        }
    }, [currentUser, navigate]);

    // When returning to the list view from the form, re-render to see the new property.
    const handleBackFromForm = () => {
      setView('list');
      // A simple trick to force re-render and re-check localStorage
      setTimeout(() => setView('list'), 0); 
    };

    if (!currentUser) return null; // Render nothing while redirecting

    if (view === 'form') {
        return <PropertyForm onBack={handleBackFromForm} />;
    }
    
    return <MyPropertiesList onAdd={() => setView('form')} />;
};
