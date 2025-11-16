export enum PropertyType {
  HOUSE = 'House',
  APARTMENT = 'Apartment',
  CONDO = 'Condo',
  LAND = 'Land',
  COMMERCIAL = 'Commercial',
  RESIDENTIAL = 'Residential',
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city?: string;
  areaName?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  type: PropertyType;
  tags?: string[];
  priceSuffix?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchCriteria {
  location: string;
  propertyType: PropertyType | 'any';
  priceRange: string;
  category?: string;
}

export interface Agency {
  id: string;
  name: string;
  logoUrl: string;
  address: string;
  description: string;
  propertiesCount: number;
}

export interface Agent {
  id:string;
  name: string;
  imageUrl: string;
  agency: string;
}

export interface AppliedFilters {
    price: { min: number; max: number };
    area: { min: number; max: number };
    bedrooms: (string|number)[];
    bathrooms: (string|number)[];
    status: string[];
    type: string[];
    keyword: string;
    city?: string[];
    areaName?: string[];
}
