import React, { useState } from 'react';
import { X, DollarSign, ShieldCheck, Plane, Compass, AlertTriangle, PhoneCall, Info, Calculator, CheckCircle2 } from 'lucide-react';

interface NepalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NepalGuideModal: React.FC<NepalGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'visa' | 'currency' | 'permits' | 'culture' | 'emergency'>('visa');

  // Currency converter state
  const [usdAmount, setUsdAmount] = useState<number>(100);
  const nprRate = 135.5; // Approx current rate 1 USD = 135.5 NPR

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-white backdrop-blur-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 backdrop-blur-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Nepal Tourist Travel Essentials Guide</h3>
              <p className="text-xs text-white/60">Important information for international travelers visiting Nepal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 mb-5 overflow-x-auto text-xs backdrop-blur-md">
          <button
            onClick={() => setActiveTab('visa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all flex-shrink-0 ${
              activeTab === 'visa' ? 'bg-blue-500 text-white font-bold shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            Visa on Arrival
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all flex-shrink-0 ${
              activeTab === 'currency' ? 'bg-blue-500 text-white font-bold shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Currency Calculator
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all flex-shrink-0 ${
              activeTab === 'permits' ? 'bg-blue-500 text-white font-bold shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Trekking Permits
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all flex-shrink-0 ${
              activeTab === 'culture' ? 'bg-blue-500 text-white font-bold shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Culture & Rules
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all flex-shrink-0 ${
              activeTab === 'emergency' ? 'bg-blue-500 text-white font-bold shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Emergency & Safety
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          {activeTab === 'visa' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl">
                <h4 className="font-bold text-blue-300 text-sm mb-1 flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  Tourist Visa on Arrival at Tribhuvan International Airport (TIA), Kathmandu
                </h4>
                <p className="text-white/80 leading-relaxed">
                  Most international passport holders can obtain a Tourist Visa on Arrival at Kathmandu Airport or overland border checkpoints (Kakarbhitta, Birgunj, Belahiya, Kodari, Rasuwagadhi).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-white/60 block mb-1">15-Day Tourist Visa</span>
                  <span className="text-xl font-extrabold text-blue-300">$30 USD</span>
                  <span className="text-[10px] text-white/50 block mt-1">Multiple Entry</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-white/60 block mb-1">30-Day Tourist Visa</span>
                  <span className="text-xl font-extrabold text-teal-300">$50 USD</span>
                  <span className="text-[10px] text-white/50 block mt-1">Multiple Entry</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-white/60 block mb-1">90-Day Tourist Visa</span>
                  <span className="text-xl font-extrabold text-amber-300">$125 USD</span>
                  <span className="text-[10px] text-white/50 block mt-1">Multiple Entry</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <h5 className="font-bold text-white text-sm">Requirements for Visa Application:</h5>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  <li>Passport valid for at least 6 months from arrival date</li>
                  <li>At least 1 blank passport page</li>
                  <li>Payment in major foreign currency cash (USD, EUR, GBP, AUD) or card at airport kiosk</li>
                  <li>Online pre-arrival visa form filled at official Nepal Immigration site</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'currency' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl">
                <h4 className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Nepalese Rupee (NPR - रू) Travel Converter
                </h4>
                <p className="text-white/80">
                  Official Currency: <strong>Nepalese Rupee (NPR)</strong>. ATMs are widely available in Kathmandu and Pokhara (Nabil Bank, Himalayan Bank accept Visa/Mastercard). Carry cash NPR in mountain regions!
                </p>
              </div>

              {/* Calculator Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-white/70 mb-1 font-semibold">Amount in USD ($)</label>
                    <input
                      type="number"
                      min={1}
                      value={usdAmount}
                      onChange={(e) => setUsdAmount(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <span className="block text-white/70 mb-1 font-semibold">Equivalent in Nepalese Rupees (NPR)</span>
                    <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-2.5 text-xl font-extrabold text-emerald-300">
                      रू {(usdAmount * nprRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })} NPR
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-white/50 border-t border-white/10 pt-3 flex items-center justify-between">
                  <span>Estimated Exchange Rate: 1 USD ≈ {nprRate} NPR</span>
                  <span>100 NPR ≈ $0.74 USD</span>
                </div>
              </div>

              {/* Typical Local Costs */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h5 className="font-bold text-white mb-2">Typical Tourist Prices in Nepal:</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <span className="text-white/50 block">Plate of Momos</span>
                    <span className="font-bold text-teal-300">150 - 300 NPR</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <span className="text-white/50 block">Dal Bhat Set</span>
                    <span className="font-bold text-teal-300">300 - 600 NPR</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <span className="text-white/50 block">Tea House Lodge</span>
                    <span className="font-bold text-teal-300">500 - 1500 NPR</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl">
                    <span className="text-white/50 block">Taxi (Kathmandu)</span>
                    <span className="font-bold text-teal-300">400 - 800 NPR</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permits' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-500/10 border border-teal-400/30 rounded-2xl">
                <h4 className="font-bold text-teal-300 text-sm mb-1">
                  Trekking Permits & Entry Conservation Cards
                </h4>
                <p className="text-white/80">
                  Before trekking in Nepal's mountain regions, ensure you obtain the required national park permits and TIMS card.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Annapurna Conservation Area Permit (ACAP)</h5>
                    <p className="text-white/70 mt-0.5">Required for Annapurna Circuit, Poon Hill, ABC, Mardi Himal. Fee: NPR 3,000 (~$23 USD) per foreign trekker.</p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Sagarmatha National Park Permit (Everest Region)</h5>
                    <p className="text-white/70 mt-0.5">Required for Everest Base Camp, Gokyo Lakes. Fee: NPR 3,000 (~$23 USD) + Khumbu Pasang Lhamu Rural Entry Fee NPR 2,000.</p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">TIMS Card (Trekkers' Information Management System)</h5>
                    <p className="text-white/70 mt-0.5">Mandatory for safety tracking. Obtain via registered agency or NTB (Nepal Tourism Board) offices in Kathmandu/Pokhara.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'culture' && (
            <div className="space-y-3">
              <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl">
                <h4 className="font-bold text-amber-300 text-sm mb-1">Cultural Etiquette & Respectful Travel</h4>
                <p className="text-white/80">
                  Nepal is rich in Hindu and Buddhist traditions. Following local customs ensures warm hospitality and meaningful connections.
                </p>
              </div>

              <ul className="space-y-2 text-white/80">
                <li className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <span className="text-lg">🙏</span>
                  <span><strong>Namaste Greeting:</strong> Press palms together at chest level and say "Namaste" when greeting locals.</span>
                </li>
                <li className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <span className="text-lg">⛩️</span>
                  <span><strong>Clockwise Stupas:</strong> Walk clockwise around Buddhist stupas, chortens, and prayer wheel walls.</span>
                </li>
                <li className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <span className="text-lg">👟</span>
                  <span><strong>Shoes Off:</strong> Always remove shoes before entering Hindu temples, Buddhist monasteries, or traditional homes.</span>
                </li>
                <li className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <span className="text-lg">📷</span>
                  <span><strong>Photography:</strong> Ask permission before photographing worshippers, Sadhus (holy men), or inside sacred temple inner sanctums.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-3">
              <div className="p-4 bg-rose-500/10 border border-rose-400/30 rounded-2xl">
                <h4 className="font-bold text-rose-300 text-sm mb-1 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  Emergency Contacts & Altitude Safety
                </h4>
                <p className="text-white/80">
                  Keep these contact numbers saved while traveling in Nepal:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-white/60 block text-[11px]">Nepal Tourist Police Hotline</span>
                  <span className="text-base font-extrabold text-white block mt-0.5">+977-1-4247041 / 1144</span>
                  <span className="text-[10px] text-blue-300">Bhrikutimandip, Kathmandu</span>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-white/60 block text-[11px]">General Emergency Services</span>
                  <span className="text-base font-extrabold text-white block mt-0.5">100 (Police) / 102 (Ambulance)</span>
                  <span className="text-[10px] text-teal-300">Toll free within Nepal</span>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-xs space-y-1">
                <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  Altitude Sickness (AMS) Prevention Rules:
                </h5>
                <p className="text-white/80 leading-relaxed">
                  When trekking above 3,000m (e.g. Everest, Annapurna, Mustang): ascent limit max 300-500m per day, drink 3-4 liters of water daily, take rest days at Namche/Manang, and descend immediately if severe headache or nausea occurs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            Close Travel Guide
          </button>
        </div>
      </div>
    </div>
  );
};
