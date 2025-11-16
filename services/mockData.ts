import { Property, Agency, Agent, PropertyType } from '../types';

export const MOCK_PROPERTIES: Property[] = [
  {
    "id": "prop001",
    "title": "Luxurious 5-Bedroom Villa in Kilometre 4",
    "address": "KM4, Near Jazeera Road, Mogadishu",
    "city": "Mogadishu",
    "areaName": "Kilometre 4",
    "price": 380000,
    "bedrooms": 5,
    "bathrooms": 4,
    "area": 3200,
    "imageUrl": "https://picsum.photos/seed/prop001/800/600",
    "type": PropertyType.HOUSE,
    "description": "Expansive villa with modern amenities, perfect for a large family. Features a spacious garden and secure perimeter.",
    "latitude": 2.045,
    "longitude": 45.335,
    "tags": ["Featured", "For Sale", "Luxury"]
  },
  {
    "id": "prop002",
    "title": "Modern 2-Bedroom Apartment in Hamarweyne",
    "address": "Hamarweyne District, Near Lighthouse, Mogadishu",
    "city": "Mogadishu",
    "areaName": "Hamarweyne",
    "price": 850,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1000,
    "imageUrl": "https://picsum.photos/seed/prop002/800/600",
    "type": PropertyType.APARTMENT,
    "description": "Comfortable and secure apartment in a vibrant district, close to market and beach. Ideal for small families or professionals.",
    "latitude": 2.049,
    "longitude": 45.348,
    "tags": ["For Rent", "Coastal View"],
    "priceSuffix": "/mo"
  },
  {
    "id": "prop003",
    "title": "Prime Residential Plot in Borama",
    "address": "Downtown Area, Borama",
    "city": "Borama",
    "areaName": "Downtown",
    "price": 75000,
    "bedrooms": 0,
    "bathrooms": 0,
    "area": 6500,
    "imageUrl": "https://picsum.photos/seed/prop003/800/600",
    "type": PropertyType.LAND,
    "description": "Large plot of land suitable for building your dream home. Developing area with good access roads.",
    "latitude": 9.936,
    "longitude": 43.183,
    "tags": ["For Sale", "Investment Opportunity"]
  },
  {
    "id": "prop004",
    "title": "Cozy 3-Bedroom Home in Hargeisa",
    "address": "Jigjiga Yar, Hargeisa",
    "city": "Hargeisa",
    "areaName": "Jigjiga Yar",
    "price": 185000,
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 1800,
    "imageUrl": "https://picsum.photos/seed/prop004/800/600",
    "type": PropertyType.HOUSE,
    "description": "A charming family home in a quiet and secure neighborhood. Recently renovated with a small private yard.",
    "latitude": 9.560,
    "longitude": 44.066,
    "tags": ["For Sale", "Family Friendly"]
  },
  {
    "id": "prop005",
    "title": "Strategic Commercial Building in Bosaso",
    "address": "Port Road, Bosaso",
    "city": "Bosaso",
    "areaName": "Port Area",
    "price": 450000,
    "bedrooms": 0,
    "bathrooms": 0,
    "area": 8500,
    "imageUrl": "https://picsum.photos/seed/prop005/800/600",
    "type": PropertyType.COMMERCIAL,
    "description": "Excellent opportunity for commercial development. High-traffic location with great visibility near the port.",
    "latitude": 11.282,
    "longitude": 49.179,
    "tags": ["For Sale", "Commercial", "Prime Location"]
  }
];

export const MOCK_AGENCIES: Agency[] = [
    { id: 'agency01', name: 'Somali Real Estate', logoUrl: 'https://picsum.photos/seed/agency01/200/200', address: 'Maka Al-Mukarramah Road, Mogadishu', description: 'Leading the market with premium properties.', propertiesCount: 78 },
    { id: 'agency02', name: 'Puntland Properties', logoUrl: 'https://picsum.photos/seed/agency02/200/200', address: 'Main Street, Bosaso', description: 'Your trusted partner in Puntland.', propertiesCount: 55 },
    { id: 'agency03', name: 'Hargeisa Homes', logoUrl: 'https://picsum.photos/seed/agency03/200/200', address: 'Independence Avenue, Hargeisa', description: 'Finding you the perfect home in Somaliland.', propertiesCount: 120 },
];

export const MOCK_AGENTS: Agent[] = [
    { id: 'agent01', name: 'Amina Yusuf', imageUrl: 'https://i.pravatar.cc/150?u=amina', agency: 'Somali Real Estate' },
    { id: 'agent02', name: 'Omar Hassan', imageUrl: 'https://i.pravatar.cc/150?u=omar', agency: 'Puntland Properties' },
    { id: 'agent03', name: 'Fatima Ali', imageUrl: 'https://i.pravatar.cc/150?u=fatima', agency: 'Hargeisa Homes' },
    { id: 'agent04', name: 'Said Ibrahim', imageUrl: 'https://i.pravatar.cc/150?u=said', agency: 'Somali Real Estate' },
];
