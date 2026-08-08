export type Category = 
  | 'All' 
  | 'Historic' 
  | 'Nature' 
  | 'Beach & Coastal' 
  | 'Mountain' 
  | 'Cultural' 
  | 'Adventure' 
  | 'City Breaks';

export interface Attraction {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distanceKm: number;
  description: string;
  photoUrl: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Destination {
  id: string;
  title: string;
  location: string;
  country: string;
  category: Category;
  rating: number;
  reviewCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  entryFee: string;
  altitude?: string;
  imageUrl: string;
  gallery: string[];
  description: string;
  highlights: string[];
  bestSeason: string;
  recommendedDays: number;
  lat: number;
  lng: number;
  tags: string[];
  featured?: boolean;
  attractions: Attraction[];
  reviews: Review[];
}

export interface WeatherData {
  city: string;
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number;
  windKmH: number;
  uvIndex: number;
  feelsLikeC: number;
  forecast: {
    day: string;
    tempC: number;
    condition: string;
    icon: string;
  }[];
}

export interface ItineraryItem {
  id: string;
  destinationId: string;
  destinationTitle: string;
  destinationLocation: string;
  imageUrl: string;
  lat: number;
  lng: number;
  date: string; // YYYY-MM-DD
  timeSlot?: string; // e.g. "09:00 AM - 12:00 PM"
  notes?: string;
  estimatedCostUSD?: number;
  orderIndex: number;
}

export interface Itinerary {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  items: ItineraryItem[];
}

export interface Favorite {
  id: string;
  destinationId: string;
  createdAt: string;
}
