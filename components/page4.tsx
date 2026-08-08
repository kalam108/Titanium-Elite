import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Calendar, Users, Star, Filter, Heart, 
  ChevronRight, ChevronLeft, Check, CreditCard, ShieldCheck, 
  Wifi, Coffee, Car, Dumbbell, Waves, Wind, Map, CheckCircle2, Menu, X, Bed
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MOCK DATA ---
const DESTINATIONS = ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Nagarkot', 'Everest Region', 'Annapurna Region'];

const AMENITIES_MAP = {
  'Free Wi-Fi': <Wifi className="w-4 h-4" />,
  'Breakfast': <Coffee className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Swimming Pool': <Waves className="w-4 h-4" />,
  'Gym': <Dumbbell className="w-4 h-4" />,
  'Air Conditioning': <Wind className="w-4 h-4" />,
};

const HOTELS = [
  {
    id: 1,
    name: 'Himalayan View Hotel & Spa',
    destination: 'Pokhara',
    location: 'Lakeside, Pokhara (0.5 km from center)',
    description: 'Experience luxury with uninterrupted views of the Annapurna range and Phewa Lake. Features a world-class spa and infinity pool.',
    stars: 5,
    rating: 9.4,
    reviews: 428,
    type: 'Resort',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800'
    ],
    amenities: ['Free Wi-Fi', 'Breakfast', 'Swimming Pool', 'Spa', 'Air Conditioning'],
    freeCancellation: true,
    rooms: [
      { id: 'r1', name: 'Deluxe Mountain View', maxGuests: 2, size: '32 sq.m', bed: '1 King Bed', price: 15000, available: 3 },
      { id: 'r2', name: 'Premium Suite', maxGuests: 3, size: '45 sq.m', bed: '1 King + 1 Sofa Bed', price: 22000, available: 1 }
    ]
  },
  {
    id: 2,
    name: 'Kathmandu Heritage Home',
    destination: 'Kathmandu',
    location: 'Thamel, Kathmandu (1.2 km from center)',
    description: 'A beautifully restored traditional Newari house in the heart of Thamel, offering modern comforts with authentic cultural charm.',
    stars: 4,
    rating: 8.8,
    reviews: 312,
    type: 'Boutique Hotel',
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800'
    ],
    amenities: ['Free Wi-Fi', 'Breakfast', 'Air Conditioning', 'Restaurant'],
    freeCancellation: true,
    rooms: [
      { id: 'r3', name: 'Standard Heritage Room', maxGuests: 2, size: '20 sq.m', bed: '1 Queen Bed', price: 8500, available: 5 },
      { id: 'r4', name: 'Family Room', maxGuests: 4, size: '35 sq.m', bed: '2 Queen Beds', price: 12000, available: 2 }
    ]
  },
  {
    id: 3,
    name: 'Everest Base Camp Lodge',
    destination: 'Everest Region',
    location: 'Namche Bazaar',
    description: 'Comfortable acclimatization lodge with warm dining hall, hot showers, and stunning views of Thamserku.',
    stars: 3,
    rating: 9.1,
    reviews: 156,
    type: 'Lodge',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1518398401344-7798b3687313?auto=format&fit=crop&w=800'
    ],
    amenities: ['Restaurant', 'Free Wi-Fi'],
    freeCancellation: false,
    rooms: [
      { id: 'r5', name: 'Standard Twin Room', maxGuests: 2, size: '12 sq.m', bed: '2 Twin Beds', price: 4500, available: 8 }
    ]
  }
];

// --- COMPONENTS ---

export default function HotelBookingPage() {
  // App State Navigation
  const [currentView, setCurrentView] = useState<'search' | 'details' | 'booking' | 'confirmation'>('search');
  
  // Search State
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  
  // Filter State
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Selection State
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // --- Handlers ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !checkIn || !checkOut) {
      alert("Please fill in destination and dates.");
      return;
    }
    setCurrentView('search');
  };

  const handleViewHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room);
    setCurrentView('booking');
    window.scrollTo(0, 0);
  };

  const handleConfirmBooking = (guestInfo: any) => {
    // Calculate final
    const checkInDate = new Date(checkIn || new Date());
    const checkOutDate = new Date(checkOut || new Date(Date.now() + 86400000));
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)));
    
    const subtotal = selectedRoom.price * nights * roomsCount;
    const tax = subtotal * 0.13;
    const serviceFee = subtotal * 0.10;
    const total = subtotal + tax + serviceFee;

    setBookingDetails({
      id: `ENP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      hotel: selectedHotel,
      room: selectedRoom,
      guestInfo,
      checkIn,
      checkOut,
      nights,
      guests,
      roomsCount,
      subtotal,
      tax,
      serviceFee,
      total
    });
    setCurrentView('confirmation');
    window.scrollTo(0, 0);
  };

  // Filter Logic
  const filteredHotels = useMemo(() => {
    return HOTELS.filter(hotel => {
      const matchDest = destination ? hotel.destination.toLowerCase().includes(destination.toLowerCase()) : true;
      const matchPrice = hotel.price <= priceRange;
      const matchStars = selectedStars.length > 0 ? selectedStars.includes(hotel.stars) : true;
      return matchDest && matchPrice && matchStars;
    });
  }, [destination, priceRange, selectedStars]);

  // --- SUB-VIEWS ---

  const renderSearchHero = () => (
    <div className="relative pt-24 pb-16 px-6 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">Find Your Perfect Stay in Nepal</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover comfortable hotels, resorts, lodges, and unique stays near Nepal's most beautiful destinations.
          </p>
        </div>

        {/* Search Panel */}
        <form onSubmit={handleSearch} className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-blue-400" />
              <select 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 appearance-none focus:outline-none focus:border-blue-500"
              >
                <option value="">Where are you going?</option>
                {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-teal-400" />
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-teal-400" />
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="w-full md:w-auto flex-1">
            <button type="submit" className="w-full h-[50px] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className={`lg:w-1/4 ${showMobileFilters ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : 'hidden lg:block'}`}>
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button onClick={() => setShowMobileFilters(false)} className="p-2 text-slate-400"><X /></button>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Filter Results</h3>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Price Range (Max: NPR {priceRange.toLocaleString()})
            </label>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">Star Rating</label>
            <div className="space-y-2">
              {[5, 4, 3].map(star => (
                <label key={star} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={selectedStars.includes(star)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedStars([...selectedStars, star]);
                      else setSelectedStars(selectedStars.filter(s => s !== star));
                    }}
                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-slate-950 border-slate-700"
                  />
                  <span className="flex items-center text-sm text-slate-400 group-hover:text-white transition-colors">
                    {star} <Star className="w-3.5 h-3.5 text-amber-400 ml-1 fill-amber-400" />
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="w-full lg:w-3/4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {filteredHotels.length} stays found {destination ? `in ${destination}` : ''}
          </h2>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white"
          >
            <Filter className="w-4 h-4" /> Filter & Sort
          </button>
        </div>

        <div className="space-y-6">
          {filteredHotels.map(hotel => (
            <div key={hotel.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl group hover:border-slate-700 transition-colors">
              <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <button className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/50 backdrop-blur-md text-slate-300 hover:text-pink-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                {hotel.type && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                    {hotel.type}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({length: hotel.stars}).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{hotel.name}</h3>
                      <p className="text-sm text-blue-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-500/20">
                        <span className="text-sm font-bold text-white">{hotel.rating}</span>
                        <span className="text-xs text-blue-300">({hotel.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    {hotel.amenities.slice(0, 3).map(am => (
                      <span key={am} className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        {AMENITIES_MAP[am as keyof typeof AMENITIES_MAP]} {am}
                      </span>
                    ))}
                    {hotel.freeCancellation && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 px-2.5 py-1.5 rounded-lg border border-emerald-900/50">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Free Cancellation
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-800/50">
                  <div>
                    <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Price per night from</span>
                    <span className="text-2xl font-black text-white">NPR {hotel.price.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">+Taxes & fees</span>
                  </div>
                  <button 
                    onClick={() => handleViewHotel(hotel)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <div className="py-20 text-center border border-dashed border-slate-700 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-400 mb-2">No hotels found</h3>
              <p className="text-slate-500">Try adjusting your filters or destination.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedHotel) return null;
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => setCurrentView('search')} className="flex items-center gap-2 text-sm text-blue-400 font-bold mb-6 hover:text-blue-300 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to search results
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{selectedHotel.type}</span>
              <div className="flex items-center gap-1">
                {Array.from({length: selectedHotel.stars}).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{selectedHotel.name}</h1>
            <p className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedHotel.location}</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-lg">
            <div className="text-right">
              <div className="font-bold text-white text-lg">Excellent</div>
              <div className="text-xs text-slate-400">{selectedHotel.reviews} verified reviews</div>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-black text-white">
              {selectedHotel.rating}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 h-[400px]">
          <div className="md:col-span-2 h-full rounded-3xl overflow-hidden relative group">
            <img src={selectedHotel.images[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {selectedHotel.images.slice(1, 3).map((img: string, idx: number) => (
              <div key={idx} className="flex-1 rounded-3xl overflow-hidden relative group">
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {idx === 1 && selectedHotel.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-colors">
                    <span className="text-white font-bold text-lg">+{selectedHotel.images.length - 3} photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="lg:w-2/3 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">About this hotel</h2>
              <p className="text-slate-300 leading-relaxed text-lg">{selectedHotel.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Popular Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedHotel.amenities.map((am: string) => (
                  <div key={am} className="flex items-center gap-3 text-slate-300 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <div className="text-blue-400">{AMENITIES_MAP[am as keyof typeof AMENITIES_MAP] || <Check className="w-4 h-4"/>}</div>
                    <span className="font-medium text-sm">{am}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Select your room</h2>
              <div className="space-y-4">
                {selectedHotel.rooms.map((room: any) => (
                  <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 mb-6">
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Max {room.maxGuests} guests</span>
                        <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> {room.bed}</span>
                        <span className="flex items-center gap-1.5"><Map className="w-4 h-4" /> {room.size}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {selectedHotel.freeCancellation && (
                          <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Free Cancellation
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                          <Coffee className="w-4 h-4" /> Breakfast Included
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full mb-4">
                        <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Price per night</span>
                        <span className="text-2xl font-black text-white">NPR {room.price.toLocaleString()}</span>
                        {room.available < 5 && (
                          <span className="block text-xs font-bold text-red-400 mt-2">Only {room.available} rooms left!</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleSelectRoom(room)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:w-1/3 hidden lg:block">
            <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" /> Explore {selectedHotel.destination}</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Check out community posts, travel tips, and calculate your total budget for {selectedHotel.destination}.
              </p>
              <div className="space-y-3">
                <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors border border-slate-700">
                  Calculate Trip Budget
                </button>
                <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors border border-slate-700">
                  View Community Reels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBooking = () => {
    if (!selectedRoom || !selectedHotel) return null;
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <button onClick={() => setCurrentView('details')} className="flex items-center gap-2 text-sm text-blue-400 font-bold mb-8 hover:text-blue-300 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to hotel details
        </button>

        <h1 className="text-3xl font-black text-white mb-8">Complete Your Booking</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            {/* Guest Details Form */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Guest Details</h2>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleConfirmBooking({ name: 'Demo User', email: 'user@example.com' }); }}
                id="bookingForm"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">First Name *</label>
                    <input required type="text" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" defaultValue="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Last Name *</label>
                    <input required type="text" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" defaultValue="Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address *</label>
                    <input required type="email" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" defaultValue="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                    <input type="tel" className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" defaultValue="+977 9800000000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Special Requests (Optional)</label>
                  <textarea rows={3} className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                </div>
              </form>
            </section>

            {/* Payment Section */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-400" /> Payment Details</h2>
              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-4 flex items-start gap-4 mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-emerald-100">Your payment is secure. We use industry-standard encryption to protect your personal and payment information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label className="border-2 border-blue-500 bg-blue-900/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-500" />
                  <span className="font-bold text-white text-sm">Pay at Hotel</span>
                </label>
                <label className="border-2 border-slate-800 bg-slate-950 rounded-xl p-4 flex items-center gap-3 cursor-pointer opacity-50">
                  <input type="radio" name="payment" disabled className="w-4 h-4 text-slate-600 bg-slate-950 border-slate-700" />
                  <span className="font-bold text-white text-sm">Online Payment (Coming Soon)</span>
                </label>
              </div>
            </section>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-white text-lg mb-4">Your Booking Summary</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-800">
                <img src={selectedHotel.images[0]} alt="Hotel" className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight mb-1">{selectedHotel.name}</h4>
                  <p className="text-xs text-slate-400">{selectedRoom.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-white">{selectedHotel.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-800 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Check-in</span>
                  <span className="font-bold text-white">{checkIn || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Check-out</span>
                  <span className="font-bold text-white">{checkOut || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guests & Rooms</span>
                  <span className="font-bold text-white">{guests} Guests, {roomsCount} Room</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Room rate ({roomsCount}x)</span>
                  <span className="text-white">NPR {selectedRoom.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxes & Fees (13%)</span>
                  <span className="text-white">NPR {Math.round(selectedRoom.price * 0.13).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800">
                  <span className="font-bold text-white text-base">Total</span>
                  <span className="font-black text-blue-400 text-xl">NPR {Math.round(selectedRoom.price * 1.13 * roomsCount).toLocaleString()}</span>
                </div>
              </div>

              <button 
                form="bookingForm"
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!bookingDetails) return null;
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/30"
        >
          <Check className="w-12 h-12 text-emerald-400" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white mb-4">Your Stay is Confirmed 🎉</h1>
        <p className="text-lg text-slate-400 mb-12">We've sent a confirmation email to {bookingDetails.guestInfo.email}</p>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-left max-w-xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-800">
            <div>
              <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Booking ID</span>
              <span className="text-xl font-bold text-white">{bookingDetails.id}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Status</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/50 text-emerald-400 text-xs font-bold rounded-full border border-emerald-900/50">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-white text-lg">{bookingDetails.hotel.name}</h3>
            <p className="text-sm text-slate-400">{bookingDetails.room.name} — {bookingDetails.guests} Guests</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="block text-xs text-slate-500 mb-1">Check-in</span>
                <span className="font-bold text-white text-sm">{bookingDetails.checkIn}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">Check-out</span>
                <span className="font-bold text-white text-sm">{bookingDetails.checkOut}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-800">
            <span className="font-bold text-slate-300">Total Amount Paid</span>
            <span className="text-2xl font-black text-blue-400">NPR {bookingDetails.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors">
            View My Bookings
          </button>
          <button onClick={() => setCurrentView('search')} className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors">
            Back to Hotels
          </button>
        </div>
      </div>
    );
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">EN</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight hidden sm:block">Explore Nepal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Destinations</a>
            <a href="#" className="text-blue-400 font-bold border-b-2 border-blue-400 py-5">Hotels</a>
            <a href="#" className="hover:text-white transition-colors">Budget Calculator</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors hidden sm:block">Login</button>
            <button className="md:hidden p-2 text-slate-300"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      {/* Main Content routing */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {currentView === 'search' && (
            <>
              {renderSearchHero()}
              {renderSearchResults()}
            </>
          )}
          {currentView === 'details' && renderDetails()}
          {currentView === 'booking' && renderBooking()}
          {currentView === 'confirmation' && renderConfirmation()}
        </motion.div>
      </AnimatePresence>

      {/* Footer CTA (hidden on confirmation) */}
      {currentView !== 'confirmation' && (
        <footer className="border-t border-slate-800 bg-slate-950 py-16 mt-8">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Your Nepal Adventure Starts With the Right Stay.</h2>
            <p className="text-slate-400 mb-8">Find a comfortable place to stay and get closer to the experiences you've been dreaming about.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => { setCurrentView('search'); window.scrollTo(0,0); }} className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors">
                Browse Hotels
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors">
                Calculate My Budget
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
