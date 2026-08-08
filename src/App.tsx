import React, { useState, useEffect } from 'react';
import { Destination, Category, Itinerary } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { MapView } from './components/MapView';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { FavoritesView } from './components/FavoritesView';
import { AddDestinationModal } from './components/AddDestinationModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { NepalGuideModal } from './components/NepalGuideModal';
import { Compass, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasMapsKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'itinerary' | 'favorites'>('explore');

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Data States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDestinations, setFavoriteDestinations] = useState<Destination[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Spot for Modal
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Modals
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Fetch Destinations from API
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('q', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/destinations?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }

      // Also fetch unfiltered list for Map view completeness if needed
      if (!allDestinations.length || (!searchQuery && selectedCategory === 'All')) {
        const allRes = await fetch('/api/destinations');
        if (allRes.ok) {
          const allData = await allRes.json();
          setAllDestinations(allData);
        }
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Favorites from API
  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }

      const favDestRes = await fetch('/api/favorites/destinations');
      if (favDestRes.ok) {
        const favDestData = await favDestRes.json();
        setFavoriteDestinations(favDestData);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  // Fetch Itineraries from API
  const fetchItineraries = async () => {
    try {
      const res = await fetch('/api/itineraries');
      if (res.ok) {
        const data = await res.json();
        setItineraries(data);
      }
    } catch (err) {
      console.error('Error fetching itineraries:', err);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    fetchFavorites();
    fetchItineraries();
  }, []);

  // Toggle Favorite
  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationId: id })
      });
      if (res.ok) {
        fetchFavorites();
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Create Itinerary
  const handleCreateItinerary = async (title: string, startDate: string, endDate: string, description?: string) => {
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, startDate, endDate, description })
      });
      if (res.ok) {
        fetchItineraries();
      }
    } catch (err) {
      console.error('Error creating itinerary:', err);
    }
  };

  // Add Item to Itinerary
  const handleAddToItinerary = async (itineraryId: string, itemData: any) => {
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        fetchItineraries();
      }
    } catch (err) {
      console.error('Error adding item to itinerary:', err);
    }
  };

  // Create Itinerary and Add Item
  const handleCreateItineraryAndAdd = async (title: string, startDate: string, endDate: string, itemData: any) => {
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, startDate, endDate })
      });
      if (res.ok) {
        const newTrip = await res.json();
        await handleAddToItinerary(newTrip.id, itemData);
      }
    } catch (err) {
      console.error('Error creating & adding to itinerary:', err);
    }
  };

  // Delete Itinerary
  const handleDeleteItinerary = async (id: string) => {
    try {
      const res = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItineraries();
      }
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };

  // Delete Item
  const handleDeleteItineraryItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/itineraries/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItineraries();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Add Custom Destination
  const handleAddDestination = async (destData: Partial<Destination>) => {
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destData)
      });
      if (res.ok) {
        fetchDestinations();
      }
    } catch (err) {
      console.error('Error adding destination:', err);
    }
  };

  // Add Review
  const handleAddReview = async (destinationId: string, review: { author: string; rating: number; comment: string }) => {
    try {
      const res = await fetch(`/api/destinations/${destinationId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        // Refresh active selected spot & destinations list
        const updatedRes = await fetch(`/api/destinations/${destinationId}`);
        if (updatedRes.ok) {
          const updated = await updatedRes.json();
          setSelectedDestination(updated);
        }
        fetchDestinations();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        hasMapsKey={hasMapsKey}
      />

      {/* Main Content Sections */}
      <main>
        {activeTab === 'explore' && (
          <div>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalResultsCount={destinations.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-80 bg-slate-900 border border-slate-800 rounded-2xl" />
                  ))}
                </div>
              ) : destinations.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
                  <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">No Destinations Found</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Try searching with different keywords or clearing category filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      isFavorite={favorites.includes(dest.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(d) => setSelectedDestination(d)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <MapView
            destinations={allDestinations.length > 0 ? allDestinations : destinations}
            selectedDestination={selectedDestination}
            onSelectDestination={(d) => setSelectedDestination(d)}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            itineraries={itineraries}
            onCreateItinerary={handleCreateItinerary}
            onDeleteItinerary={handleDeleteItinerary}
            onDeleteItem={handleDeleteItineraryItem}
            onExploreDestinations={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favoriteDestinations}
            favoriteIds={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectDestination={(d) => setSelectedDestination(d)}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}
      </main>

      {/* Destination Detail View Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        isFavorite={selectedDestination ? favorites.includes(selectedDestination.id) : false}
        onToggleFavorite={handleToggleFavorite}
        itineraries={itineraries}
        onAddToItinerary={handleAddToItinerary}
        onCreateItineraryAndAdd={handleCreateItineraryAndAdd}
        onAddReview={handleAddReview}
      />

      {/* Add Spot Modal */}
      <AddDestinationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDestination={handleAddDestination}
      />

      {/* Nepal Travel Essentials Guide Modal */}
      <NepalGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* API Key Instructions Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        hasKey={hasMapsKey}
      />
    </div>
  );
}
