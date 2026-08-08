import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Heart,
  Calendar,
  Clock,
  Compass,
  PlusCircle,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  Share2,
  Sparkles,
  Send
} from 'lucide-react';
import { Destination, Itinerary, Review } from '../types';
import { WeatherWidget } from './WeatherWidget';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  itineraries: Itinerary[];
  onAddToItinerary: (itineraryId: string, itemData: any) => void;
  onCreateItineraryAndAdd: (title: string, startDate: string, endDate: string, itemData: any) => void;
  onAddReview: (destinationId: string, review: { author: string; rating: number; comment: string }) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  isFavorite,
  onToggleFavorite,
  itineraries,
  onAddToItinerary,
  onCreateItineraryAndAdd,
  onAddReview
}) => {
  if (!destination) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'reviews'>('overview');
  const [selectedImage, setSelectedImage] = useState<string>(destination.imageUrl);

  // Itinerary Add state
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>(
    itineraries.length > 0 ? itineraries[0].id : 'new'
  );
  const [newTripTitle, setNewTripTitle] = useState<string>(`${destination.location} Getaway`);
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 12:00 PM');
  const [notes, setNotes] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  // Review state
  const [authorName, setAuthorName] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const handleAddItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      destinationId: destination.id,
      destinationTitle: destination.title,
      destinationLocation: `${destination.location}, ${destination.country}`,
      imageUrl: destination.imageUrl,
      lat: destination.lat,
      lng: destination.lng,
      date: visitDate,
      timeSlot,
      notes: notes || `Explore ${destination.title}`,
      estimatedCostUSD: destination.priceLevel === '$$$$' ? 150 : destination.priceLevel === '$$$' ? 90 : 40
    };

    if (selectedItineraryId === 'new') {
      const endDate = new Date(new Date(visitDate).getTime() + 86400000 * (destination.recommendedDays || 3))
        .toISOString()
        .split('T')[0];
      onCreateItineraryAndAdd(newTripTitle, visitDate, endDate, itemData);
    } else {
      onAddToItinerary(selectedItineraryId, itemData);
    }

    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    onAddReview(destination.id, {
      author: authorName.trim() || 'Avid Traveler',
      rating: userRating,
      comment: userComment.trim()
    });

    setUserComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl my-8 bg-slate-900/90 border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white max-h-[90vh] flex flex-col backdrop-blur-2xl">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-2xl">
          <div className="flex items-center gap-2.5">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
              {destination.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              <span>{destination.location}, {destination.country}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(destination.id, e)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                  : 'bg-white/10 border-white/15 text-white/80 hover:text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Hero & Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner">
                <img
                  src={selectedImage}
                  alt={destination.title}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {destination.title}
                  </h1>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {destination.gallery && destination.gallery.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {destination.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === img ? 'border-blue-400 scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weather & Quick Stats Panel */}
            <div className="space-y-4">
              <WeatherWidget lat={destination.lat} lng={destination.lng} cityName={destination.location} />

              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-3 text-xs backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    Traveler Rating
                  </span>
                  <span className="font-bold text-white">
                    {destination.rating} / 5.0 ({destination.reviewCount} reviews)
                  </span>
                </div>

                {destination.altitude && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-indigo-300" />
                      Elevation / Altitude
                    </span>
                    <span className="font-bold text-white">{destination.altitude}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-300" />
                    Best Season
                  </span>
                  <span className="font-bold text-white">{destination.bestSeason}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-300" />
                    Recommended Stay
                  </span>
                  <span className="font-bold text-white">{destination.recommendedDays} Days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
                    Entry / Cost Level
                  </span>
                  <span className="font-bold text-white">{destination.priceLevel} ({destination.entryFee})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-white/10 flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Overview & Guide
            </button>
            <button
              onClick={() => setActiveTab('attractions')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'attractions'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Nearby Attractions ({destination.attractions.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-blue-400 text-blue-300'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Traveler Reviews ({destination.reviews.length})
            </button>
          </div>

          {/* Tab Content 1: Overview & Add to Trip */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                    About Destination
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {destination.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Top Experience Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {destination.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-white/80 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-blue-300 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                    Destination Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-blue-300 text-xs rounded-xl font-medium backdrop-blur-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Itinerary Form Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Calendar className="w-5 h-5 text-blue-300" />
                  <h4 className="font-bold text-sm text-white">Add to Trip Itinerary</h4>
                </div>

                {addSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 rounded-2xl text-xs flex items-center gap-2 backdrop-blur-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                    <span>Added to itinerary successfully!</span>
                  </div>
                )}

                <form onSubmit={handleAddItinerary} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-white/70 font-medium mb-1">Select Itinerary</label>
                    <select
                      value={selectedItineraryId}
                      onChange={(e) => setSelectedItineraryId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10"
                    >
                      <option value="new" className="bg-slate-900 text-white">+ Create New Itinerary</option>
                      {itineraries.map((it) => (
                        <option key={it.id} value={it.id} className="bg-slate-900 text-white">
                          {it.title} ({it.startDate})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedItineraryId === 'new' && (
                    <div>
                      <label className="block text-white/70 font-medium mb-1">Trip Name</label>
                      <input
                        type="text"
                        value={newTripTitle}
                        onChange={(e) => setNewTripTitle(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/70 font-medium mb-1">Date of Visit</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1">Preferred Time Slot</label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      placeholder="e.g. 09:00 AM - 12:00 PM"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-medium mb-1">Notes / Reminders</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Buy morning tickets online in advance..."
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Save to My Trip Plan
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab Content 2: Attractions */}
          {activeTab === 'attractions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.attractions.map((att) => (
                <div key={att.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 backdrop-blur-xl">
                  <img
                    src={att.photoUrl}
                    alt={att.name}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">
                      {att.category} • {att.distanceKm} km away
                    </span>
                    <h4 className="font-bold text-sm text-white mb-1">{att.name}</h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {att.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Add Review Form */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl">
                <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-300" />
                  Leave a Traveler Review
                </h4>

                {reviewSubmitted && (
                  <div className="p-3 mb-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 rounded-xl text-xs flex items-center gap-2 backdrop-blur-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Review submitted and saved to database!
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 mb-1 font-medium">Your Name</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Sarah J."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1 font-medium">Rating (1 to 5 Stars)</label>
                      <select
                        value={userRating}
                        onChange={(e) => setUserRating(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10"
                      >
                        <option value={5} className="bg-slate-900 text-white">⭐⭐⭐⭐⭐ 5 Stars - Spectacular</option>
                        <option value={4} className="bg-slate-900 text-white">⭐⭐⭐⭐ 4 Stars - Great</option>
                        <option value={3} className="bg-slate-900 text-white">⭐⭐⭐ 3 Stars - Average</option>
                        <option value={2} className="bg-slate-900 text-white">⭐⭐ 2 Stars - Below Expectations</option>
                        <option value={1} className="bg-slate-900 text-white">⭐ 1 Star - Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-medium">Comment / Tip</label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your travel tips, best photo spots, or experience..."
                      rows={2}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Review List */}
              <div className="space-y-3">
                {destination.reviews.map((r) => (
                  <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={r.avatar}
                          alt={r.author}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <span className="font-bold text-white block">{r.author}</span>
                          <span className="text-[10px] text-white/40">{r.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-300 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
