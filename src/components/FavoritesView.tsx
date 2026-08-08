import React from 'react';
import { Heart, Compass, ArrowRight } from 'lucide-react';
import { Destination } from '../types';
import { DestinationCard } from './DestinationCard';

interface FavoritesViewProps {
  favorites: Destination[];
  favoriteIds: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectDestination: (dest: Destination) => void;
  onExploreClick: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  favoriteIds,
  onToggleFavorite,
  onSelectDestination,
  onExploreClick
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            Saved Destinations ({favorites.length})
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Your personal collection of saved tourist spots and dream travel locations.
          </p>
        </div>

        <button
          onClick={onExploreClick}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-blue-300" />
          Explore More Spots
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto my-12 backdrop-blur-2xl shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4 backdrop-blur-md">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Saved Spots Yet</h3>
          <p className="text-xs text-white/60 leading-relaxed mb-6">
            Click the heart icon on any destination card while exploring to add it to your saved list.
          </p>
          <button
            onClick={onExploreClick}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-2"
          >
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectDestination}
            />
          ))}
        </div>
      )}
    </div>
  );
};
