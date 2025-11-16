import React, { useState, useCallback } from 'react';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import type { Property } from '../types';
import { PropertyType } from '../types';

// --- Local Reusable Components for the Form ---

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode; subtext?: string; }> = ({ label, required, children, subtext }) => (
    <div>
        <label className="text-sm font-bold text-dark-text mb-2 block">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        {children}
        {subtext && <p className="text-xs text-dark-text-secondary mt-1.5">{subtext}</p>}
    </div>
);

// FIX: Update TextInput component to accept name, type, and disabled props.
// FIX: Made placeholder optional to allow for disabled inputs without placeholders.
const TextInput: React.FC<{ placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; type?: string; disabled?: boolean; }> = ({ placeholder, value, onChange, name, type, disabled }) => (
    <input
        name={name}
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue text-dark-text"
    />
);

// FIX: Update TextAreaInput component to accept a name prop.
const TextAreaInput: React.FC<{ placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string; }> = ({ placeholder, value, onChange, name }) => (
    <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue text-dark-text"
    />
);

// FIX: Update SelectInput component to accept a name prop.
const SelectInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; name: string; }> = ({ value, onChange, options, name }) => (
    <div className="relative">
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue text-dark-text"
        >
            <option value="" disabled>Select</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <Icon name="chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-text-secondary pointer-events-none" />
    </div>
);

const StepperInput: React.FC<{ value: number; onchange: (newValue: number) => void; }> = ({ value, onchange }) => (
    <div className="flex items-center space-x-3">
        <button type="button" onClick={() => onchange(Math.max(0, value - 1))} className="w-10 h-10 bg-dark-surface rounded-md flex items-center justify-center font-bold text-2xl text-dark-text-secondary">-</button>
        <input
            type="number"
            value={value}
            onChange={(e) => onchange(parseInt(e.target.value, 10) || 0)}
            className="w-20 h-10 bg-dark-surface border border-gray-700 rounded-md text-center font-bold text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
        <button type="button" onClick={() => onchange(value + 1)} className="w-10 h-10 bg-dark-surface rounded-md flex items-center justify-center font-bold text-xl text-dark-text-secondary">+</button>
    </div>
);


export const QuickAddPropertyPage: React.FC = () => {
    const { navigate } = useRouter();
    const { currentUser } = useAuth();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        currency: '$',
        price: '',
        enablePricePlaceholder: false,
        type: '',
        status: '',
        label: '',
        areaSize: '',
        sizePostfix: '',
        landArea: '',
        landAreaPostfix: '',
        address: '',
        bedrooms: 0,
        bathrooms: 0,
        files: [] as File[],
        consent: false,
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleStepperChange = (field: 'bedrooms' | 'bathrooms', value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, files: Array.from(e.target.files) }));
        }
    };


    if (!currentUser) {
        navigate('auth');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!formData.title || !formData.description || !formData.price || !formData.address || !formData.consent) {
            setError('Please fill in all required fields and accept the agreement.');
            window.scrollTo(0,0);
            return;
        }
        setIsLoading(true);
        setError('');

        // Mock property creation
        const newProperty: Property = {
            id: `userprop_quick_${Date.now()}`,
            title: formData.title,
            address: formData.address,
            price: parseInt(formData.price, 10),
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            area: parseInt(formData.areaSize, 10) || 1200,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
            type: (formData.type as PropertyType) || PropertyType.APARTMENT,
            description: formData.description,
        };

        try {
            const storageKey = `my_properties_${currentUser.email}`;
            const existingPropertiesRaw = localStorage.getItem(storageKey);
            const existingProperties: Property[] = existingPropertiesRaw ? JSON.parse(existingPropertiesRaw) : [];
            const updatedProperties = [...existingProperties, newProperty];
            localStorage.setItem(storageKey, JSON.stringify(updatedProperties));

            setTimeout(() => {
                setIsLoading(false);
                alert('Property added successfully!');
                navigate('add');
            }, 1000);
        } catch (err) {
            setIsLoading(false);
            setError('Failed to save property. Please try again.');
        }
    };

    return (
        <div className="bg-dark-bg text-dark-text min-h-full">
            <header className="flex items-center p-4 sticky top-0 z-10 bg-dark-bg border-b border-dark-surface/50">
                <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                    <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
                </button>
                <h1 className="font-bold text-lg text-dark-text mx-auto">Add Property</h1>
                <div className="w-6 h-6"></div>
            </header>

            <main className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm">{error}</p>}
                    
                    <FormField label="Property Title" required>
                        <TextInput name="title" placeholder="Enter your property title" value={formData.title} onChange={handleInputChange} />
                    </FormField>
                    
                    <FormField label="Content" required>
                        <TextAreaInput name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                    </FormField>

                    <FormField label="Currency">
                        <TextInput name="currency" value={formData.currency} onChange={handleInputChange} disabled />
                        <p className="text-xs text-dark-text-secondary mt-1.5">Automatically set to the default currency</p>
                    </FormField>

                    <FormField label="Sale or Rent Price" required>
                        <TextInput name="price" type="number" placeholder="Enter the price" value={formData.price} onChange={handleInputChange} />
                    </FormField>
                    
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="price-placeholder" name="enablePricePlaceholder" checked={formData.enablePricePlaceholder} onChange={handleInputChange} className="h-4 w-4 rounded bg-dark-surface border-gray-600 text-accent-blue focus:ring-accent-blue" />
                        <label htmlFor="price-placeholder" className="text-sm font-medium text-dark-text">Enable Price Placeholder</label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField label="Type">
                            <SelectInput name="type" value={formData.type} onChange={handleInputChange} options={['House', 'Apartment', 'Condo', 'Land']} />
                        </FormField>
                         <FormField label="Status">
                            <SelectInput name="status" value={formData.status} onChange={handleInputChange} options={['For Sale', 'For Rent', 'Sold', 'Rented']} />
                        </FormField>
                         <FormField label="Label">
                            <SelectInput name="label" value={formData.label} onChange={handleInputChange} options={['Featured', 'Hot Offer', 'New']} />
                        </FormField>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Area Size" subtext="Only digits">
                            <TextInput name="areaSize" type="number" placeholder="Enter area size" value={formData.areaSize} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Size Postfix" subtext="For example: Sq Ft">
                            <TextInput name="sizePostfix" placeholder="Enter size postfix" value={formData.sizePostfix} onChange={handleInputChange} />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Land Area" subtext="Only digits">
                            <TextInput name="landArea" type="number" placeholder="Enter land area" value={formData.landArea} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Land Area Size Postfix" subtext="For example: Sq Ft">
                            <TextInput name="landAreaPostfix" placeholder="Enter land area size postfix" value={formData.landAreaPostfix} onChange={handleInputChange} />
                        </FormField>
                    </div>

                    <FormField label="Address" required>
                         <TextInput name="address" placeholder="Enter your property address" value={formData.address} onChange={handleInputChange} />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField label="Bedrooms">
                           <StepperInput value={formData.bedrooms} onchange={(v) => handleStepperChange('bedrooms', v)} />
                        </FormField>
                        <FormField label="Bathrooms">
                           <StepperInput value={formData.bathrooms} onchange={(v) => handleStepperChange('bathrooms', v)} />
                        </FormField>
                    </div>
                    
                     <FormField label="Select and Upload" required>
                        <p className="text-sm text-dark-text-secondary mb-2">{formData.files.length}/25 files</p>
                        <label htmlFor="file-upload" className="w-full text-center cursor-pointer bg-dark-surface hover:bg-gray-700 text-dark-text font-bold py-3 px-4 rounded-md transition-colors">
                           Upload Media
                        </label>
                        <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
                    </FormField>

                    <div className="flex items-start space-x-3">
                        <input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleInputChange} className="h-5 w-5 mt-0.5 rounded bg-dark-surface border-gray-600 text-accent-blue focus:ring-accent-blue flex-shrink-0" />
                        <label htmlFor="consent" className="text-sm text-dark-text-secondary">
                            I consent to having this website to store my submitted information, read more information: <a href="#" className="text-accent-blue underline">GDPR Agreement</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-accent-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Add Property'}
                    </button>
                </form>
            </main>
        </div>
    );
};