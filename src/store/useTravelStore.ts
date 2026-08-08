import { create } from 'zustand';

interface TravelState {
  // Budget & Dates
  destination: string;
  days: number;
  travelers: number;
  selectedHotel: any | null; // From page4
  
  // Actions
  setDestination: (dest: string) => void;
  setDays: (days: number) => void;
  setTravelers: (travelers: number) => void;
  setSelectedHotel: (hotel: any | null) => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  destination: 'Kathmandu',
  days: 7,
  travelers: 2,
  selectedHotel: null,

  setDestination: (dest) => set({ destination: dest }),
  setDays: (days) => set({ days }),
  setTravelers: (travelers) => set({ travelers }),
  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
}));
