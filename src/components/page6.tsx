import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Hospital, 
  Ambulance, 
  ShieldAlert, 
  Share2, 
  Crosshair, 
  Search, 
  Clock, 
  HeartPulse, 
  Mountain, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  X,
  Navigation,
  Languages,
  BookHeart,
  ChevronRight,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MOCK DATA ---
const EMERGENCY_CONTACTS = [
  { id: 1, name: 'Tourist Police', number: '1144', category: 'Police', available: '24/7', verified: true },
  { id: 2, name: 'Police Control', number: '100', category: 'Police', available: '24/7', verified: true },
  { id: 3, name: 'Ambulance', number: '102', category: 'Ambulance', available: '24/7', verified: true },
  { id: 4, name: 'Fire Brigade', number: '101', category: 'Fire', available: '24/7', verified: true },
  { id: 5, name: 'Himalayan Rescue Assoc.', number: '01-4440292', category: 'Mountain Rescue', available: 'Office Hours', verified: true },
];

const HEALTHCARE_FACILITIES = [
  {
    id: 1,
    name: 'CIWEC Hospital',
    type: 'Hospital',
    specialty: 'Travel Medicine',
    distance: '1.2 km',
    address: 'Kapurdhara Marg, Kathmandu',
    phone: '01-4424111',
    isOpen: true,
    hasEmergency: true,
    verified: true,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Grande International Hospital',
    type: 'Hospital',
    specialty: 'General / Emergency',
    distance: '3.5 km',
    address: 'Dhapasi, Kathmandu',
    phone: '01-5159266',
    isOpen: true,
    hasEmergency: true,
    verified: true,
    rating: 4.5
  },
  {
    id: 3,
    name: 'Pokhara Alpine Clinic',
    type: 'Clinic',
    specialty: 'Primary Care',
    distance: '0.8 km',
    address: 'Lakeside, Pokhara',
    phone: '061-462000',
    isOpen: true,
    hasEmergency: false,
    verified: true,
    rating: 4.2
  },
  {
    id: 4,
    name: 'Himalayan Pharmacy',
    type: 'Pharmacy',
    specialty: 'Medicine',
    distance: '0.3 km',
    address: 'Thamel, Kathmandu',
    phone: '01-4112233',
    isOpen: false,
    hasEmergency: false,
    verified: false,
    rating: 3.9
  }
];

const FIRST_AID_TOPICS = [
  { title: 'Altitude Sickness', desc: 'Descend immediately if symptoms worsen. Rest, hydrate, and avoid alcohol.', icon: Mountain },
  { title: 'Dehydration', desc: 'Drink clean, safe water regularly. Use oral rehydration salts if necessary.', icon: HeartPulse },
  { title: 'Sprains', desc: 'Rest, Ice, Compress, Elevate (RICE). Seek medical attention if unable to bear weight.', icon: BookHeart },
];

// --- COMPONENTS ---

export default function HealthcareEmergencyPage() {
  // States
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState<any>(null);
  
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'loading' | 'granted' | 'denied'>('prompt');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handlers
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const requestLocation = () => {
    setLocationStatus('loading');
    setTimeout(() => {
      setLocationStatus('granted');
      showToast('Location updated successfully.');
    }, 1500);
  };

  const initiateCall = (contact: any) => {
    setActiveCallContact(contact);
  };

  const confirmCall = () => {
    window.location.href = `tel:${activeCallContact.number}`;
    setActiveCallContact(null);
  };

  const handleLocationShare = () => {
    showToast('Location link copied to clipboard. (Demo)');
    setShowEmergencyModal(false);
  };

  // Filter facilities
  const filteredFacilities = HEALTHCARE_FACILITIES.filter(f => {
    const matchCat = activeCategory === 'All' || f.type === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-transparent text-slate-200 font-sans selection:bg-red-500/30 pb-20">
      
      {/* Global Header */}


      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 border-b border-slate-800 bg-gradient-to-b from-red-950/20 to-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Need Help?</h1>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Quickly find healthcare and emergency services anywhere in Nepal. Fast, verified, and accessible.
          </p>
          
          <button 
            onClick={() => setShowEmergencyModal(true)}
            className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
          >
            <AlertTriangle className="w-7 h-7" /> ONE-TAP EMERGENCY
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-colors">
              <Hospital className="w-5 h-5 text-blue-400" /> Find Nearby Hospital
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-colors">
              <Crosshair className="w-5 h-5 text-emerald-400" /> Find Pharmacy
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Healthcare Search */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Location Request */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${locationStatus === 'granted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Healthcare Near Me</h2>
                  <p className="text-sm text-slate-400">
                    {locationStatus === 'granted' ? 'Showing verified facilities near Thamel, Kathmandu' : 'Allow location access to find services near you.'}
                  </p>
                </div>
              </div>
              {locationStatus !== 'granted' && (
                <button 
                  onClick={requestLocation}
                  disabled={locationStatus === 'loading'}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  {locationStatus === 'loading' ? 'Detecting...' : 'Detect Location'}
                </button>
              )}
            </div>
            
            {/* Search and Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search Kathmandu, Pokhara, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex bg-transparent border border-slate-700 rounded-xl p-1 overflow-x-auto no-scrollbar">
                {['All', 'Hospital', 'Clinic', 'Pharmacy'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Facility List */}
          <div className="space-y-4">
            {filteredFacilities.map(facility => (
              <div key={facility.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-colors shadow-lg flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full">{facility.type}</span>
                    {facility.hasEmergency && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Emergency
                      </span>
                    )}
                    {facility.verified ? (
                      <span className="px-2 py-1 flex items-center gap-1 text-emerald-400 text-xs font-bold" title="Verified Information">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="px-2 py-1 flex items-center gap-1 text-amber-500 text-xs font-bold" title="Needs Verification">
                        <Info className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{facility.name}</h3>
                  <p className="text-sm text-blue-400 mb-3">{facility.specialty}</p>
                  
                  <div className="space-y-2 text-sm text-slate-400">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {facility.address} <span className="font-bold text-slate-300">({facility.distance})</span></p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {facility.phone}</p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 
                      {facility.isOpen ? <span className="text-emerald-400 font-bold">Open Now (Verified)</span> : <span>Hours Unverified</span>}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-48">
                  <button 
                    onClick={() => initiateCall({ name: facility.name, number: facility.phone })}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                    <Navigation className="w-4 h-4" /> Directions
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Contacts & Safety */}
        <div className="space-y-8">
          
          {/* Official Contacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-400" /> Official Contacts
            </h2>
            <div className="space-y-4">
              {EMERGENCY_CONTACTS.map(contact => (
                <div key={contact.id} className="p-4 bg-transparent border border-slate-800 rounded-2xl flex items-center justify-between group">
                  <div>
                    <h4 className="font-bold text-white text-sm">{contact.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      {contact.category} <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    </p>
                  </div>
                  <button 
                    onClick={() => initiateCall(contact)}
                    className="w-10 h-10 rounded-full bg-slate-900 group-hover:bg-red-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors border border-slate-800 group-hover:border-red-500"
                    title={`Call ${contact.number}`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Emergency numbers are verified. Local network connection required to place calls.</p>
            </div>
          </div>

          {/* First Aid & Safety */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookHeart className="w-5 h-5 text-emerald-400" /> Safety & First Aid
            </h2>
            <div className="space-y-4">
              {FIRST_AID_TOPICS.map((topic, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-transparent border border-slate-800 flex items-center justify-center flex-shrink-0">
                    <topic.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{topic.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-transparent border border-slate-800 hover:border-slate-600 text-white text-sm font-bold rounded-xl transition-colors">
              View All Safety Guides
            </button>
          </div>
          
          {/* Trusted Contacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> Trusted Contacts
            </h2>
            <p className="text-xs text-slate-400 mb-6">Store emergency contacts securely. Only shared when you choose.</p>
            
            <div className="border border-dashed border-slate-700 rounded-2xl p-6 text-center">
              <p className="text-sm font-bold text-slate-300 mb-2">No contacts saved</p>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors">
                + Add Trusted Contact
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* EMERGENCY ACTION MODAL */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent/90 backdrop-blur-sm"
              onClick={() => setShowEmergencyModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/50 rounded-3xl shadow-2xl shadow-red-900/20 overflow-hidden"
            >
              <div className="p-6 bg-red-600 text-center relative">
                <AlertTriangle className="w-12 h-12 text-white mx-auto mb-2" />
                <h2 className="text-2xl font-black text-white">EMERGENCY ASSISTANCE</h2>
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="absolute top-4 right-4 p-2 text-red-200 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-center text-slate-300 font-medium mb-6">What do you need?</p>

                <button onClick={() => initiateCall(EMERGENCY_CONTACTS[1])} className="w-full py-4 bg-transparent hover:bg-red-900/30 border border-slate-800 hover:border-red-500/50 text-white font-bold rounded-xl flex items-center justify-between px-6 transition-colors group">
                  <span className="flex items-center gap-3"><ShieldAlert className="w-5 h-5 text-red-500 group-hover:animate-pulse" /> Call Official Police</span>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button onClick={() => initiateCall(EMERGENCY_CONTACTS[2])} className="w-full py-4 bg-transparent hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl flex items-center justify-between px-6 transition-colors group">
                  <span className="flex items-center gap-3"><Ambulance className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" /> Find Ambulance</span>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button onClick={() => { setShowEmergencyModal(false); document.getElementById('search')?.focus(); }} className="w-full py-4 bg-transparent hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl flex items-center justify-between px-6 transition-colors group">
                  <span className="flex items-center gap-3"><Hospital className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" /> Find Nearest Hospital</span>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button onClick={handleLocationShare} className="w-full py-4 bg-transparent hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl flex items-center justify-between px-6 transition-colors group">
                  <span className="flex items-center gap-3"><Share2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" /> Share My Location</span>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-full mt-4 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CALL CONFIRMATION MODAL */}
      <AnimatePresence>
        {activeCallContact && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent/90 backdrop-blur-sm"
              onClick={() => setActiveCallContact(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-500/30">
                <Phone className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Call</h3>
              <p className="text-slate-400 mb-6">You are about to call the verified official number for <strong className="text-white">{activeCallContact.name}</strong>.</p>
              
              <div className="text-3xl font-black text-white mb-8 tracking-wider">{activeCallContact.number}</div>
              
              <div className="flex gap-4">
                <button onClick={() => setActiveCallContact(null)} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={confirmCall} className="flex-1 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-colors">
                  Call Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] px-6 py-3 bg-slate-800 text-white font-bold rounded-full shadow-2xl border border-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
