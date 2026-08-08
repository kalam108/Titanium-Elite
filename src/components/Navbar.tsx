import React from 'react';
import { Compass, Map, Calendar, Heart, PlusCircle, Key, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'map' | 'itinerary' | 'favorites';
  setActiveTab: (tab: 'explore' | 'map' | 'itinerary' | 'favorites') => void;
  favoritesCount: number;
  onOpenAddModal: () => void;
  onOpenKeyModal: () => void;
  onOpenGuideModal: () => void;
  hasMapsKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenAddModal,
  onOpenKeyModal,
  onOpenGuideModal,
  hasMapsKey
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/80 border border-white/20 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center backdrop-blur-md">
            <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Nepal Travel
            </span>
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest block -mt-1">
              Tourism Hub
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'explore'
                ? 'bg-white/15 border border-white/20 text-white shadow-lg backdrop-blur-md font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 opacity-80" />
            Explore
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-white/15 border border-white/20 text-white shadow-lg backdrop-blur-md font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Map className="w-4 h-4 opacity-80" />
            Interactive Map
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'itinerary'
                ? 'bg-white/15 border border-white/20 text-white shadow-lg backdrop-blur-md font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 opacity-80" />
            Trip Planner
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'favorites'
                ? 'bg-white/15 border border-white/20 text-white shadow-lg backdrop-blur-md font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Saved Spots
            {favoritesCount > 0 && (
              <span className="ml-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold border border-blue-400/30 transition-all backdrop-blur-md shadow-sm"
            title="Nepal Visa, Currency & Permits Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Travel Guide</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/15 transition-all backdrop-blur-md shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span className="hidden lg:inline">Add Spot</span>
          </button>

          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all ${
              hasMapsKey
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25 animate-pulse'
            }`}
            title="Google Maps API Key Status"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{hasMapsKey ? 'Maps Active' : 'Configure Key'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900/80 backdrop-blur-2xl border-t border-white/10 px-2 py-2">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg ${
            activeTab === 'explore' ? 'text-blue-400 font-bold' : 'text-white/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          Explore
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg ${
            activeTab === 'map' ? 'text-blue-400 font-bold' : 'text-white/50'
          }`}
        >
          <Map className="w-4 h-4" />
          Map
        </button>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg ${
            activeTab === 'itinerary' ? 'text-blue-400 font-bold' : 'text-white/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Planner
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-3 rounded-lg ${
            activeTab === 'favorites' ? 'text-blue-400 font-bold' : 'text-white/50'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          Saved ({favoritesCount})
        </button>
      </div>
    </header>
  );
};
