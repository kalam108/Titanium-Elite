import React from 'react';
import { motion } from 'motion/react';
import { Map, MapPin, Clock, Route, Car, Info } from 'lucide-react';

export default function Page1() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full 2xl:px-12 mx-auto mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-2">
          Your Journey Details
        </h1>
        <p className="text-slate-400 text-lg">Interactive map and estimated travel times for your adventure.</p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="w-full 2xl:px-12 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Section (Spans 2 columns on large screens) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative h-[500px] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
        >
          {/* Simulated Map Background - you could replace this with the actual MapView component */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/80 to-slate-950"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
              <Map className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Interactive Route Map</h3>
            <p className="text-slate-400 max-w-md">
              Connect your Google Maps API key to render real-time satellite terrain and dynamic routing between your chosen destinations.
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
              <Route className="w-5 h-5" />
              Enable Live Map
            </button>
          </div>
        </motion.div>

        {/* Travel Time & Stats Sidebar */}
        <div className="space-y-6">
          
          {/* Estimated Travel Time Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Clock className="w-24 h-24" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Travel Time</h3>
            </div>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-orange-500">
                4h 30m
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 border-b border-white/5 pb-4">
              Estimated total driving time for the optimal route.
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400"/> Distance</span>
                <span className="text-white font-semibold">245 km</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Car className="w-4 h-4 text-teal-400"/> Mode</span>
                <span className="text-white font-semibold">Driving</span>
              </div>
            </div>
          </motion.div>

          {/* Route Highlights Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-teal-500/20 rounded-xl border border-teal-500/30">
                <Route className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Route Stops</h3>
            </div>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-teal-500 before:to-transparent">
              
              <div className="relative">
                <div className="absolute left-[-29px] w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <h4 className="font-bold text-white text-sm">Kathmandu (Start)</h4>
                <p className="text-xs text-slate-400 mt-1">Departure: 08:00 AM</p>
              </div>
              
              <div className="relative">
                <div className="absolute left-[-29px] w-4 h-4 rounded-full bg-teal-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                <h4 className="font-bold text-white text-sm">Pokhara (Waypoint)</h4>
                <p className="text-xs text-slate-400 mt-1">Arrival: 11:15 AM</p>
              </div>
              
              <div className="relative">
                <div className="absolute left-[-29px] w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <h4 className="font-bold text-white text-sm">Chitwan (Destination)</h4>
                <p className="text-xs text-slate-400 mt-1">Arrival: 12:30 PM</p>
              </div>
              
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
