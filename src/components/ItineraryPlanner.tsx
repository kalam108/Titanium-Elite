import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  MapPin,
  DollarSign,
  Download,
  CheckCircle2,
  Compass,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Itinerary, ItineraryItem } from '../types';

interface ItineraryPlannerProps {
  itineraries: Itinerary[];
  onCreateItinerary: (title: string, startDate: string, endDate: string, description?: string) => void;
  onDeleteItinerary: (id: string) => void;
  onDeleteItem: (itemId: string) => void;
  onExploreDestinations: () => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  itineraries,
  onCreateItinerary,
  onDeleteItinerary,
  onDeleteItem,
  onExploreDestinations
}) => {
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(
    itineraries.length > 0 ? itineraries[0].id : null
  );

  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newStartDate, setNewStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [newDesc, setNewDesc] = useState<string>('');

  const activeTrip = itineraries.find((it) => it.id === selectedItineraryId) || itineraries[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateItinerary(newTitle.trim(), newStartDate, newEndDate, newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setShowNewModal(false);
  };

  const calculateTotalCost = (items: ItineraryItem[]) => {
    return items.reduce((acc, curr) => acc + (curr.estimatedCostUSD || 0), 0);
  };

  const handleExportTxt = (trip: Itinerary) => {
    let content = `=======================================\n`;
    content += `WANDERLUST TRIP ITINERARY: ${trip.title.toUpperCase()}\n`;
    content += `Dates: ${trip.startDate} to ${trip.endDate}\n`;
    content += `Description: ${trip.description || 'No description'}\n`;
    content += `=======================================\n\n`;

    if (trip.items.length === 0) {
      content += `No places added to this trip yet.\n`;
    } else {
      trip.items.forEach((item, index) => {
        content += `${index + 1}. ${item.destinationTitle} (${item.date} - ${item.timeSlot || 'Anytime'})\n`;
        content += `   Location: ${item.destinationLocation}\n`;
        content += `   Est. Cost: $${item.estimatedCostUSD || 0}\n`;
        if (item.notes) content += `   Notes: ${item.notes}\n`;
        content += `---------------------------------------\n`;
      });
      content += `\nTOTAL ESTIMATED TRIP BUDGET: $${calculateTotalCost(trip.items)} USD\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100 min-h-[calc(100vh-4rem)]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-8 h-8 text-blue-400" />
            Travel Trip Planner
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Build day-by-day travel schedules, estimate budgets, and manage custom itineraries.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 bg-blue-500/80 hover:bg-blue-500 text-white border border-white/20 font-bold text-xs rounded-2xl shadow-xl shadow-blue-500/20 backdrop-blur-md transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Trip Plan
        </button>
      </div>

      {itineraries.length === 0 ? (
        /* Empty State */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto my-12 backdrop-blur-2xl shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 mx-auto mb-4 backdrop-blur-md">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Trip Plans Created Yet</h3>
          <p className="text-xs text-white/60 leading-relaxed mb-6">
            Start planning your dream journey! Create a new itinerary or browse featured destinations to add places to your schedule.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Create First Trip
            </button>
            <button
              onClick={onExploreDestinations}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 backdrop-blur-md transition-all"
            >
              Browse Destinations
            </button>
          </div>
        </div>
      ) : (
        /* Main Itinerary Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Trip List Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider px-1">
              My Saved Trips ({itineraries.length})
            </h3>

            <div className="space-y-2.5">
              {itineraries.map((it) => {
                const isSelected = activeTrip?.id === it.id;
                return (
                  <div
                    key={it.id}
                    onClick={() => setSelectedItineraryId(it.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-400/50 shadow-xl shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-white truncate">{it.title}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete itinerary "${it.title}"?`)) {
                            onDeleteItinerary(it.id);
                          }
                        }}
                        className="text-white/40 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete itinerary"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-white/60 flex items-center gap-1 mb-2">
                      <Calendar className="w-3 h-3 text-teal-300" />
                      <span>{it.startDate} ~ {it.endDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-blue-300 font-semibold">{it.items.length} stop{it.items.length !== 1 ? 's' : ''}</span>
                      <span className="text-emerald-300 font-bold">${calculateTotalCost(it.items)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Active Trip Timeline & Details */}
          {activeTrip && (
            <div className="lg:col-span-3 space-y-6">
              {/* Trip Overview Banner */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-2 backdrop-blur-md">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeTrip.startDate} to {activeTrip.endDate}
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">{activeTrip.title}</h2>
                  {activeTrip.description && (
                    <p className="text-xs text-white/60 mt-1">{activeTrip.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-right backdrop-blur-md">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider block">Estimated Total</span>
                    <span className="text-lg font-extrabold text-emerald-300">${calculateTotalCost(activeTrip.items)} USD</span>
                  </div>

                  <button
                    onClick={() => handleExportTxt(activeTrip)}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/15 transition-all backdrop-blur-md"
                    title="Export Itinerary as Text File"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Timeline Items */}
              {activeTrip.items.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/15 rounded-3xl p-10 text-center backdrop-blur-xl">
                  <p className="text-xs text-white/60 mb-4">No places added to this trip yet.</p>
                  <button
                    onClick={onExploreDestinations}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
                  >
                    Explore Destinations to Add
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTrip.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                          {idx + 1}
                        </div>

                        <img
                          src={item.imageUrl}
                          alt={item.destinationTitle}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />

                        <div>
                          <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold mb-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.date} • {item.timeSlot || 'All Day'}</span>
                          </div>

                          <h4 className="font-bold text-base text-white">{item.destinationTitle}</h4>

                          <div className="flex items-center gap-1 text-xs text-white/60 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-teal-300" />
                            <span>{item.destinationLocation}</span>
                          </div>

                          {item.notes && (
                            <p className="text-xs text-white/70 mt-1 italic bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 inline-block backdrop-blur-md">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-white/10">
                        <span className="text-sm font-extrabold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-xl backdrop-blur-md">
                          ${item.estimatedCostUSD}
                        </span>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-2 text-white/40 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* New Trip Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl">
          <div className="relative w-full max-w-md bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-white backdrop-blur-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Create New Travel Plan
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 font-medium mb-1">Trip Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Nepal Himalayan & Cultural Expedition"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Description (Optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Kathmandu Valley temples, Pokhara Phewa Lake, and Everest Base Camp trek..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
