import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Star, Compass, Key, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { Destination } from '../types';

interface MapViewProps {
  destinations: Destination[];
  selectedDestination?: Destination | null;
  onSelectDestination: (dest: Destination) => void;
  onOpenKeyModal: () => void;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  onOpenKeyModal
}) => {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(
    selectedDestination ? selectedDestination.id : null
  );

  const defaultCenter = selectedDestination
    ? { lat: selectedDestination.lat, lng: selectedDestination.lng }
    : { lat: 28.3949, lng: 84.1240 }; // Nepal center

  const activeDest = destinations.find((d) => d.id === activeMarkerId) || selectedDestination;

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-transparent flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900/60 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full z-10 shadow-2xl">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Nepal Map ({destinations.length})
            </h3>
            <span className="text-[11px] text-white/50">Click a spot to view coordinates</span>
          </div>

          {!hasValidKey && (
            <button
              onClick={onOpenKeyModal}
              className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-200 rounded-xl text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/25 transition-all"
            >
              <Key className="w-3 h-3" />
              Add Key
            </button>
          )}
        </div>

        {/* Scrollable Spots */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {destinations.map((dest) => {
            const isActive = activeMarkerId === dest.id;
            return (
              <div
                key={dest.id}
                onClick={() => {
                  setActiveMarkerId(dest.id);
                  onSelectDestination(dest);
                }}
                className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 backdrop-blur-md ${
                  isActive
                    ? 'bg-blue-500/20 border border-blue-400/50 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                      {dest.category}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-300" /> {dest.rating}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{dest.title}</h4>
                  <span className="text-[11px] text-white/60 truncate block">{dest.location}, {dest.country}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={defaultCenter}
              defaultZoom={selectedDestination ? 10 : 7}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              {destinations.map((dest) => (
                <AdvancedMarker
                  key={dest.id}
                  position={{ lat: dest.lat, lng: dest.lng }}
                  onClick={() => {
                    setActiveMarkerId(dest.id);
                    onSelectDestination(dest);
                  }}
                >
                  <Pin
                    background={activeMarkerId === dest.id ? '#3b82f6' : '#0f172a'}
                    glyphColor="#ffffff"
                    borderColor="#60a5fa"
                  />
                </AdvancedMarker>
              ))}

              {activeDest && (
                <InfoWindow
                  position={{ lat: activeDest.lat, lng: activeDest.lng }}
                  onCloseClick={() => setActiveMarkerId(null)}
                >
                  <div className="p-1 max-w-xs text-slate-900">
                    <img
                      src={activeDest.imageUrl}
                      alt={activeDest.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">
                      {activeDest.category}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
                      {activeDest.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-2">
                      {activeDest.location}, {activeDest.country}
                    </p>
                    <button
                      onClick={() => onSelectDestination(activeDest)}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center justify-center gap-1"
                    >
                      Explore Spot <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Fallback Map Interface with High-Res World Canvas & Interactive Spot Markers */
          <div className="relative w-full h-full bg-transparent flex flex-col items-center justify-center p-6 text-slate-200 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            {/* Simulated World Map Canvas with Interactive Pin Points */}
            <div className="relative w-full max-w-4xl h-96 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-sm text-white">Interactive World Tourism Radar</span>
                </div>
                <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                  GPS Radar Active
                </span>
              </div>

              {/* Grid of Spots */}
              <div className="relative flex-1 my-4 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-wrap items-center justify-center gap-3 overflow-y-auto backdrop-blur-md">
                {destinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => {
                      setActiveMarkerId(dest.id);
                      onSelectDestination(dest);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      activeMarkerId === dest.id
                        ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-300" />
                    <span>{dest.title}</span>
                    <span className="text-[10px] opacity-70">({dest.lat.toFixed(1)}°, {dest.lng.toFixed(1)}°)</span>
                  </button>
                ))}
              </div>

              {/* Bottom Instructions Banner */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs backdrop-blur-md">
                <div className="flex items-center gap-2 text-white/80">
                  <Key className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Connect Google Maps API key for live satellite terrain & route rendering</span>
                </div>
                <button
                  onClick={onOpenKeyModal}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow transition-all whitespace-nowrap"
                >
                  Configure Maps Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
