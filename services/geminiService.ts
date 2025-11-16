import { GoogleGenAI, Type } from "@google/genai";
import type { Property, SearchCriteria, Agency, Agent } from '../types';
import { MOCK_PROPERTIES, MOCK_AGENCIES, MOCK_AGENTS } from './mockData';

// IMPORTANT: This key is managed externally and should not be modified.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateContentWithSchema = async (prompt: string, schema: any, cacheKey: string, fallbackData: any) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonText = response.text.trim();
        const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.warn(
            `Gemini API call failed for key "${cacheKey}". Falling back to mock data.`,
            error
        );
        return fallbackData;
    }
};

export const fetchProperties = async (criteria: SearchCriteria): Promise<Property[]> => {
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                address: { type: Type.STRING },
                city: { type: Type.STRING },
                areaName: { type: Type.STRING },
                price: { type: Type.NUMBER },
                bedrooms: { type: Type.INTEGER },
                bathrooms: { type: Type.INTEGER },
                area: { type: Type.NUMBER },
                imageUrl: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['House', 'Apartment', 'Condo', 'Land', 'Commercial', 'Residential'] },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                priceSuffix: { type: Type.STRING },
                latitude: { type: Type.NUMBER, description: "The latitude of the property, must be a realistic coordinate within Somalia." },
                longitude: { type: Type.NUMBER, description: "The longitude of the property, must be a realistic coordinate within Somalia." },
            },
            required: ['id', 'title', 'description', 'address', 'price', 'bedrooms', 'bathrooms', 'area', 'imageUrl', 'type', 'latitude', 'longitude']
        }
    };

    const prompt = `Generate a realistic list of 10-15 property listings in various cities in Somalia based on these criteria: ${JSON.stringify(criteria)}. Ensure each property has realistic latitude and longitude coordinates within Somalia. For image URLs, use picsum.photos with unique seeds. Include relevant tags like 'For Sale' or 'Featured'.`;
    
    return generateContentWithSchema(prompt, schema, `properties_${JSON.stringify(criteria)}`, MOCK_PROPERTIES);
};


export const fetchAgencies = async (): Promise<Agency[]> => {
     const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                logoUrl: { type: Type.STRING },
                address: { type: Type.STRING },
                description: { type: Type.STRING },
                propertiesCount: { type: Type.INTEGER },
            },
            required: ['id', 'name', 'logoUrl', 'address', 'description', 'propertiesCount']
        }
    };
    const prompt = "Generate a list of 8 realistic real estate agencies in Somalia. For logo URLs, use picsum.photos with unique seeds.";
    return generateContentWithSchema(prompt, schema, 'agencies', MOCK_AGENCIES);
};

export const fetchAgents = async (): Promise<Agent[]> => {
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                agency: { type: Type.STRING },
            },
            required: ['id', 'name', 'imageUrl', 'agency']
        }
    };
    const prompt = "Generate a list of 12 realistic real estate agents in Somalia. For image URLs, use i.pravatar.cc with unique seeds.";
    return generateContentWithSchema(prompt, schema, 'agents', MOCK_AGENTS);
};