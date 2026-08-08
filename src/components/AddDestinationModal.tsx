import React, { useState } from 'react';
import { X, PlusCircle, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Category, Destination } from '../types';

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDestination: (destData: Partial<Destination>) => void;
}

const CATEGORIES: Category[] = [
  'Historic',
  'Nature',
  'Beach & Coastal',
  'Mountain',
  'Cultural',
  'Adventure',
  'City Breaks'
];

export const AddDestinationModal: React.FC<AddDestinationModalProps> = ({
  isOpen,
  onClose,
  onAddDestination
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Kathmandu');
  const [country, setCountry] = useState('Nepal');
  const [category, setCategory] = useState<Category>('Cultural');
  const [priceLevel, setPriceLevel] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');
  const [entryFee, setEntryFee] = useState('Free');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [bestSeason, setBestSeason] = useState('Autumn & Spring');
  const [recommendedDays, setRecommendedDays] = useState(2);
  const [lat, setLat] = useState('27.7104');
  const [lng, setLng] = useState('85.3487');
  const [highlights, setHighlights] = useState('Scenic Views, Local Culture');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !country) return;

    onAddDestination({
      title,
      location,
      country,
      category,
      priceLevel,
      entryFee: entryFee || 'Free',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      description,
      bestSeason,
      recommendedDays: Number(recommendedDays) || 2,
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      highlights: highlights.split(',').map((h) => h.trim()).filter(Boolean),
      tags: [category, country, 'Custom Spot']
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent/80 backdrop-blur-2xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 backdrop-blur-md">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Add Tourist Spot</h3>
            <span className="text-xs text-white/60">Submit a new destination to the global database</span>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-500/20 border border-emerald-400/30 rounded-2xl backdrop-blur-md">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-emerald-200">Destination Created!</h4>
            <p className="text-xs text-emerald-300/80 mt-1">Saved to database successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 font-medium mb-1">Spot Title / Landmark Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pashupatinath Sacred Temple"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">City / Region</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Yamanashi"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Japan"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Price Level & Entry Fee</label>
                <div className="flex gap-2">
                  <select
                    value={priceLevel}
                    onChange={(e) => setPriceLevel(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                  >
                    <option value="$" className="bg-slate-900 text-white">$ (Budget)</option>
                    <option value="$$" className="bg-slate-900 text-white">$$ (Moderate)</option>
                    <option value="$$$" className="bg-slate-900 text-white">$$$ (Premium)</option>
                    <option value="$$$$" className="bg-slate-900 text-white">$$$$ (Luxury)</option>
                  </select>
                  <input
                    type="text"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    placeholder="e.g. Free or $15"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-1">Image Photo URL (Unsplash or direct image link)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 font-medium mb-1">Best Season</label>
                <input
                  type="text"
                  value={bestSeason}
                  onChange={(e) => setBestSeason(e.target.value)}
                  placeholder="e.g. Spring & Autumn"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Recommended Days</label>
                <input
                  type="number"
                  value={recommendedDays}
                  onChange={(e) => setRecommendedDays(Number(e.target.value))}
                  min={1}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why travelers should visit this spot..."
                rows={3}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-1">Highlights (comma separated)</label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="e.g. Sunrise views, Walking trails, Local snacks"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 transition-all border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all"
              >
                Save Spot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
