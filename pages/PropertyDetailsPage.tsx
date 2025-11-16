
import React, { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import type { Property } from '../types';
import { Icon } from '../components/Icon';
import { useFavorites } from '../context/FavoritesContext';

// --- Reusable Local Components for the New Design ---

const DetailsHeader: React.FC<{ property: Property }> = ({ property }) => {
    const { navigate } = useRouter();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const isFav = isFavorite(property.id);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFav) {
            removeFavorite(property.id);
        } else {
            addFavorite(property);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: `Check out this property: ${property.title}`,
                    url: window.location.origin, // FIX: Use origin for a more reliable URL
                });
            } catch (error) {
                // Don't log an error if the user cancels the share dialog
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            alert('Sharing is not supported on this browser. You can copy the link manually.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleFlag = () => {
        alert('This property has been reported. Thank you for your feedback.');
    };

    return (
        <header className="flex items-center justify-between p-4 bg-dark-bg sticky top-0 z-20 print:hidden">
            <button onClick={() => navigate('home')} className="p-2 -ml-2" aria-label="Go back">
                <Icon name="arrow-left" className="h-6 w-6 text-dark-text" />
            </button>
            <h1 className="font-bold text-lg text-dark-text truncate mx-4 flex-1 text-center">{property.title}</h1>
            <div className="flex items-center space-x-2">
                <button onClick={toggleFavorite} className="p-2" aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                    <Icon name="heart" className={`h-6 w-6 transition-colors ${isFav ? 'text-red-500 fill-current' : 'text-dark-text'}`} />
                </button>
                <button onClick={handleShare} className="p-2" aria-label="Share property">
                    <Icon name="share" className="h-6 w-6 text-dark-text" />
                </button>
                <button onClick={handlePrint} className="p-2" aria-label="Print page">
                    <Icon name="printer" className="h-6 w-6 text-dark-text" />
                </button>
                <button onClick={handleFlag} className="p-2 -mr-2" aria-label="Report property">
                    <Icon name="flag" className="h-6 w-6 text-dark-text" />
                </button>
            </div>
        </header>
    );
};

const Section: React.FC<{ title: string; linkText?: string; linkHref?: string; children: React.ReactNode }> = ({ title, linkText, linkHref, children }) => (
    <section className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark-text">{title}</h2>
            {linkText && linkHref && (
                 <a href={linkHref} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent-blue">{linkText}</a>
            )}
            {linkText && !linkHref && (
                 <button className="text-sm font-medium text-accent-blue">{linkText}</button>
            )}
        </div>
        <div>{children}</div>
    </section>
);

const FeatureIcon: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <div className="flex flex-col items-center space-y-2 text-center">
        <div className="w-14 h-14 bg-dark-surface rounded-full flex items-center justify-center">
            <Icon name={icon} className="h-7 w-7 text-dark-text-secondary" />
        </div>
        <span className="text-sm text-dark-text-secondary">{label}</span>
    </div>
);

const StarRating: React.FC<{ rating: number; max?: number }> = ({ rating, max = 5 }) => (
    <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => (
            <Icon key={i} name="star" className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
        ))}
    </div>
);

const ActionFooter: React.FC = () => (
    <footer className="fixed bottom-0 left-0 right-0 bg-dark-surface p-3 flex items-center space-x-3 z-20 border-t border-gray-700 print:hidden">
        <button className="flex-1 bg-accent-blue text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
            <Icon name="envelope" className="h-5 w-5" />
            <span>EMAIL</span>
        </button>
        <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
            <Icon name="phone" className="h-5 w-5" />
            <span>CALL</span>
        </button>
        <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
            <Icon name="chat-bubble" className="h-5 w-5" />
            <span>MESSAGE</span>
        </button>
    </footer>
);

// --- Main Page Component ---

export const PropertyDetailsPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const property: Property | undefined = params?.property;
  const [isTourOpen, setIsTourOpen] = useState(false);

  if (!property) {
    // This part is kept from the old design for graceful error handling.
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">Property not found</h2>
        <button onClick={() => navigate('home')} className="mt-4 bg-brand-green text-white px-6 py-2 rounded-full font-semibold">
          Back to Home
        </button>
      </div>
    );
  }

  // Mock data for new sections as it's not in the Property type
  const mockFeatures = [
      { icon: 'snowflake', label: 'Air Con' }, { icon: 'dumbbell', label: 'Gym' }, { icon: 'swimmer', label: 'Swimm' }, { icon: 'tv', label: 'TV' }, { icon: 'wifi', label: 'WiFi' },
  ];

  const mockReviews = [
      { name: 'Phabian Bernard', date: '6 months ago', rating: 5, text: 'Amazing place, loved the view and the pool!' },
  ];
  
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`;
  const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`;


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="bg-dark-bg text-dark-text min-h-screen">
        <DetailsHeader property={property} />

        <main className="pb-28">
            <img src={property.imageUrl} alt={property.title} className="w-full h-64 object-cover" />

            <div className="p-4 space-y-8">
                {/* --- Main Info --- */}
                <div className="bg-dark-surface p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-2">
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-medium">Featured</span>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-medium">For Rent</span>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-medium">Open House</span>
                    </div>
                    <h1 className="text-2xl font-bold text-dark-text">{property.title}</h1>
                    <p className="text-4xl font-bold">{formatPrice(property.price)}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="flex items-center text-sm space-x-2"><Icon name="bed" className="h-5 w-5 text-dark-text-secondary"/><span>{property.bedrooms} Bedrooms</span></div>
                        <div className="flex items-center text-sm space-x-2"><Icon name="bath" className="h-5 w-5 text-dark-text-secondary"/><span>{property.bathrooms} Bathrooms</span></div>
                        <div className="flex items-center text-sm space-x-2"><Icon name="area" className="h-5 w-5 text-dark-text-secondary"/><span>{property.area} sqft</span></div>
                    </div>
                </div>

                {/* --- Features --- */}
                <Section title="Features" linkText="Show More">
                    <div className="grid grid-cols-5 gap-4">
                        {mockFeatures.map(f => <FeatureIcon key={f.label} icon={f.icon} label={f.label} />)}
                    </div>
                </Section>
                
                {/* --- Description --- */}
                <Section title="Description" linkText="Read More">
                    <p className="text-dark-text-secondary text-sm leading-relaxed">{property.description}</p>
                </Section>
                
                {/* --- Address & Map --- */}
                <Section title="Address" linkText="Open in Map >" linkHref={mapLinkUrl}>
                    <div className="space-y-3">
                        <p className="text-dark-text-secondary text-sm">{property.address}</p>
                        <div className="flex space-x-8 text-sm">
                            <div><span className="font-bold text-dark-text">City:</span> <span className="text-dark-text-secondary">{property.city || 'N/A'}</span></div>
                            <div><span className="font-bold text-dark-text">Area:</span> <span className="text-dark-text-secondary">{property.areaName || 'N/A'}</span></div>
                        </div>
                        <div className="h-40 rounded-lg overflow-hidden">
                           <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={mapEmbedUrl}>
                            </iframe>
                        </div>
                    </div>
                </Section>
                
                {/* --- Floor Plans --- */}
                <Section title="Floor Plans">
                    <div className="space-y-4">
                        {['First', 'Second'].map(floor => (
                            <div key={floor} className="bg-dark-surface p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold">{floor} Floor</h3>
                                    <button className="text-accent-blue text-sm font-medium">View Floor Plan &gt;</button>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-dark-text-secondary">
                                    <p><span className="font-semibold text-dark-text">670 Sqft</span></p>
                                    <p><span className="font-semibold text-dark-text">530 Sqft</span></p>
                                    <p>$1,650</p>
                                    <p>1267 Sqft</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* --- 3D Video Tour --- */}
                <Section title="3D Video Tour">
                   <div
                      className="relative h-56 rounded-lg overflow-hidden cursor-pointer group bg-black"
                      onClick={() => setIsTourOpen(true)}
                    >
                      <img src={property.imageUrl} alt="3D Tour Thumbnail" className="w-full h-full object-cover blur-sm brightness-50 transition-all duration-300 group-hover:blur-none group-hover:brightness-75" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                        <Icon name="play-circle" className="h-16 w-16 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <p className="font-bold text-lg text-center">Watch 3D Video Tour</p>
                      </div>
                    </div>
                </Section>

                {/* --- Contact Information --- */}
                <Section title="Contact Information">
                    <div className="bg-dark-surface p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <img src="https://i.pravatar.cc/150?u=agency" alt="Agency Logo" className="w-12 h-12 rounded-full bg-gray-500" />
                                <div>
                                    <p className="font-bold text-dark-text">Modern House Realty</p>
                                    <p className="text-xs text-dark-text-secondary">Agency</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center"><Icon name="envelope" className="h-5 w-5 text-white" /></button>

                                <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"><Icon name="phone" className="h-5 w-5 text-white" /></button>
                                <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center"><Icon name="chat-bubble" className="h-5 w-5 text-white" /></button>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-gray-700 divide-y divide-gray-700 text-sm">
                            {['Enquire Info', 'Setup Tour', 'Watch Video', 'Virtual Tour'].map(item => (
                                <button key={item} className="w-full flex justify-between items-center py-3 text-dark-text">
                                    <span>{item}</span>
                                    <Icon name="chevron-right" className="h-5 w-5 text-dark-text-secondary" />
                                </button>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* --- Reviews --- */}
                <Section title="Reviews">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <StarRating rating={4} />
                            <span className="text-sm font-medium text-dark-text-secondary">(4 out of 5)</span>
                        </div>
                        {mockReviews.map((review, i) => (
                            <div key={i} className="bg-dark-surface p-4 rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-sm text-dark-text">{review.name}</p>
                                    <p className="text-xs text-dark-text-secondary">{review.date}</p>
                                </div>
                                <StarRating rating={review.rating} />
                                <p className="text-sm text-dark-text-secondary pt-1">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
        
        <ActionFooter />

        {isTourOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fade-in-fast p-4" onClick={() => setIsTourOpen(false)}>
            <div className="relative w-full max-w-4xl aspect-video bg-black" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsTourOpen(false)} className="absolute -top-10 right-0 text-white p-2" aria-label="Close video tour">
                <Icon name="x" className="h-8 w-8" />
              </button>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&rel=0"
                title="Property 3D Video Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
    </div>
  );
};