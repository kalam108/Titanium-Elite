import React from 'react';
import { Search, Sparkles, SlidersHorizontal, CloudSun, MapPin, X } from 'lucide-react';
import { Category } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalResultsCount: number;
}

const CATEGORIES: Category[] = [
  'All',
  'Historic',
  'Nature',
  'Beach & Coastal',
  'Mountain',
  'Cultural',
  'Adventure',
  'City Breaks'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  totalResultsCount
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-10 border-b border-white/10">
      {/* Decorative Background Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-12 right-1/4 w-96 h-96 bg-purple-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Weather Highlight Bar */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs mb-6 backdrop-blur-xl shadow-lg">
          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <CloudSun className="w-4 h-4 text-amber-300" />
            Nepal Climate Tracker:
          </span>
          <span className="hidden sm:inline">Kathmandu 22°C ☀️</span>
          <span className="hidden md:inline text-white/20">•</span>
          <span className="hidden md:inline">Pokhara 24°C 🏔️</span>
          <span className="hidden lg:inline text-white/20">•</span>
          <span className="hidden lg:inline">Everest BC -2°C ❄️</span>
          <span className="hidden xl:inline text-white/20">•</span>
          <span className="hidden xl:inline">Chitwan 28°C 🌿</span>
        </div>

        {/* Hero Headings */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">Nepal’s Majestic</span> Wonders
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
            Explore world-renowned Himalayan peaks, sacred ancient temples, wildlife jungle safaris, and plan your ideal Nepal tourist itinerary.
          </p>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-2xl mb-6">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Nepal spots (e.g., 'Pokhara', 'Everest', 'Kathmandu', 'Chitwan', 'UNESCO')..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white/80 w-full md:w-auto backdrop-blur-md">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span className="text-white/50 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-slate-900 text-white">Featured First</option>
                  <option value="rating" className="bg-slate-900 text-white">Highest Rated</option>
                  <option value="popular" className="bg-slate-900 text-white">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-500/80 border border-white/20 text-white font-semibold backdrop-blur-md shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-white/50 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              Showing <span className="text-white font-bold">{totalResultsCount}</span> spot{totalResultsCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
