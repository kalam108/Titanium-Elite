import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Layout() {
  const getNavClass = (isActive: boolean, isEmergency = false) => {
    if (isActive) {
      if (isEmergency) return "text-red-400 font-bold border-b-2 border-red-500 py-5";
      return "text-blue-400 font-bold border-b-2 border-blue-400 py-5";
    }
    return "hover:text-white transition-colors py-5";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <span className="font-bold text-white text-sm">ST</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight hidden sm:block">Smart Tourism</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <NavLink to="/" className={({ isActive }) => getNavClass(isActive)}>Map</NavLink>
            <NavLink to="/budget" className={({ isActive }) => getNavClass(isActive)}>Budget</NavLink>
            <NavLink to="/community" className={({ isActive }) => getNavClass(isActive)}>Community</NavLink>
            <NavLink to="/hotels" className={({ isActive }) => getNavClass(isActive)}>Hotels</NavLink>
            <NavLink to="/translate" className={({ isActive }) => getNavClass(isActive)}>Translate</NavLink>
            <NavLink to="/emergency" className={({ isActive }) => getNavClass(isActive, true)}>Healthcare & Emergency</NavLink>
            <NavLink to="/support" className={({ isActive }) => getNavClass(isActive)}>Support</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors hidden sm:block">
              Login
            </button>
            <button className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}
