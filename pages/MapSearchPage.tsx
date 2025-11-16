import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from '../hooks/useRouter';
import type { Property } from '../types';
import { Icon } from '../components/Icon';
import { SearchResultCard } from '../components/SearchResultCard';

// FIX: Added namespace declaration for google.maps.Icon to resolve TypeScript error.
declare namespace google.maps {
    interface Icon {
        url: string;
        scaledSize: any;
        anchor: any;
    }
}

declare global {
    interface Window {
        google: any;
    }
}

// Helper to generate a custom SVG marker to avoid complex API features
const getMarkerIcon = (priceText: string, isActive: boolean): google.maps.Icon => {
    const color = isActive ? '#EF4444' : '#FFFFFF';
    const textColor = isActive ? '#FFFFFF' : '#1A1A1A';
    const stroke = isActive ? '#DC2626' : '#9CA3AF';
    const size = isActive ? 44 : 40;

    const svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color}" stroke="${stroke}" stroke-width="2"/>
            <text x="50%" y="50%" dy=".3em" font-size="12" font-weight="bold" fill="${textColor}" text-anchor="middle">${priceText}</text>
        </svg>`;
    
    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(size, size),
        anchor: new window.google.maps.Point(size / 2, size / 2),
    };
};


export const MapSearchPage: React.FC = () => {
  const { navigate, params } = useRouter();
  const properties: Property[] = params.properties || [];
  const mapRef = useRef<HTMLDivElement>(null);
  const cardCarouselRef = useRef<HTMLDivElement>(null);

  const [activePropertyId, setActivePropertyId] = useState<string | null>(properties.length > 0 ? properties[0].id : null);
  const [map, setMap] = useState<any>(null);
  
  const markersRef = useRef<{ [key: string]: any }>({});

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;
    
    const bounds = new window.google.maps.LatLngBounds();
    let hasValidCoordinates = false;
    properties.forEach(p => {
        if (p.latitude && p.longitude) {
            bounds.extend({ lat: p.latitude, lng: p.longitude });
            hasValidCoordinates = true;
        }
    });

    const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 4.77, lng: 46.82 }, // Default center on Somalia
        zoom: 6,
        disableDefaultUI: true,
    });

    if (hasValidCoordinates && !bounds.isEmpty()) {
        mapInstance.fitBounds(bounds, 50);
    }
    
    setMap(mapInstance);
  }, [properties]);

  useEffect(() => {
    const checkGoogleAndInit = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        setTimeout(checkGoogleAndInit, 100);
      }
    };
    checkGoogleAndInit();
  }, [initMap]);

  // Effect to create/recreate markers when map or properties change
  useEffect(() => {
    if (!map || !properties.length || !window.google.maps.Size) return;

    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    properties.forEach(property => {
      if (property.latitude && property.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map,
        });

        marker.addListener('click', () => setActivePropertyId(property.id));
        markersRef.current[property.id] = marker;
      }
    });

    return () => {
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      markersRef.current = {};
    };
  }, [map, properties]);

  // Effect to update marker styles when active property or properties list changes
  useEffect(() => {
    if (!Object.keys(markersRef.current).length || !window.google.maps.Size) return;

    properties.forEach(property => {
      const marker = markersRef.current[property.id];
      if (marker) {
        const isActive = property.id === activePropertyId;
        marker.setOptions({
          icon: getMarkerIcon(`$${(property.price / 1000).toFixed(0)}K`, isActive),
          zIndex: isActive ? 999 : 1,
        });
      }
    });
  }, [activePropertyId, properties]);

  // Effect to pan map and scroll carousel
  useEffect(() => {
    if (activePropertyId && map) {
        const activeProperty = properties.find(p => p.id === activePropertyId);
        if (activeProperty?.latitude && activeProperty.longitude) {
            map.panTo({ lat: activeProperty.latitude, lng: activeProperty.longitude });
        }
        
        const cardIndex = properties.findIndex(p => p.id === activePropertyId);
        if (cardCarouselRef.current && cardIndex !== -1) {
            const cardElement = cardCarouselRef.current.children[cardIndex] as HTMLElement;
            if (cardElement) {
                cardCarouselRef.current.scrollTo({
                    left: cardElement.offsetLeft - cardCarouselRef.current.offsetWidth / 2 + cardElement.offsetWidth / 2,
                    behavior: 'smooth',
                });
            }
        }
    }
  }, [activePropertyId, map, properties]);

  const handleCardClick = (propertyId: string) => {
    setActivePropertyId(propertyId);
  };

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
        <header className="flex items-center p-4 z-20 bg-dark-bg border-b border-dark-surface/50 flex-shrink-0">
            <button onClick={() => navigate('searchResults')} className="p-2 -ml-2" aria-label="Go back"><Icon name="arrow-left" className="h-6 w-6 text-dark-text" /></button>
            <h1 className="font-bold text-lg text-center flex-grow truncate">Map Search</h1>
            <div className="flex items-center space-x-2">
                <button className="p-2" aria-label="Refresh" onClick={() => window.location.reload()}><Icon name="refresh" className="h-6 w-6 text-dark-text" /></button>
                <button className="p-2" aria-label="List view" onClick={() => navigate('searchResults')}><Icon name="view-list" className="h-6 w-6 text-dark-text" /></button>
            </div>
        </header>

        <div className="flex-grow relative">
            <div ref={mapRef} className="absolute inset-0 bg-gray-800"></div>
            {properties.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-dark-bg/80 p-4 rounded-lg">
                        <p className="text-dark-text-secondary">{!params.properties ? 'Loading properties...' : 'No properties to display on the map.'}</p>
                    </div>
                </div>
            )}

            {properties.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <div ref={cardCarouselRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                        {properties.map(property => (
                            <div key={property.id} onClick={() => handleCardClick(property.id)} className={`w-80 flex-shrink-0 transition-all duration-300 ${activePropertyId === property.id ? 'transform scale-105' : 'opacity-90'}`}>
                            <SearchResultCard property={property} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
