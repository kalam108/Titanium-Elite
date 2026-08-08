import React from 'react';
import { Star, MapPin, Heart, Calendar, ArrowUpRight, DollarSign, CloudSun } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  return (
    <div
      onClick={() => onSelect(destination)}
      className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col h-full shadow-xl"
    >
      {/* Image Container with Badges */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={destination.imageUrl}
          alt={destination.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
            {destination.category}
          </span>

          <button
            onClick={(e) => onToggleFavorite(destination.id, e)}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                : 'bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Info on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-200 backdrop-blur-md px-2.5 py-0.5 rounded-lg font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{destination.rating}</span>
            <span className="text-amber-200/70 text-[10px]">({destination.reviewCount})</span>
          </div>

          <span className="bg-white/10 text-white/90 backdrop-blur-md border border-white/15 px-2.5 py-0.5 rounded-lg text-[10px] font-mono">
            {destination.priceLevel} • {destination.entryFee}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-blue-400 font-medium mb-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              <span>{destination.location}, {destination.country}</span>
            </div>
            {destination.altitude && (
              <span className="text-[10px] text-teal-300/80 font-mono bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                {destination.altitude}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 tracking-tight">
            {destination.title}
          </h3>

          <p className="mt-1.5 text-xs text-white/60 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1 text-[11px] text-white/60">
            <Calendar className="w-3.5 h-3.5 text-teal-300" />
            <span className="truncate max-w-[140px]">{destination.bestSeason}</span>
          </div>

          <span className="flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            View Spot
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
