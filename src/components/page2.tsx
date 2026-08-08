import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  MapPin,
  Users,
  Calendar,
  Bed,
  Utensils,
  Car,
  Tent,
  UserPlus,
  ShieldCheck,
  MoreHorizontal,
  Download,
  Share2,
  RotateCcw,
  Menu,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Types & Constants ---
type TravelStyle = 'Budget' | 'Standard' | 'Premium' | 'Luxury';
type AccommodationType = 'Hostel' | 'Budget Hotel' | '3-Star Hotel' | '4-Star Hotel' | '5-Star Hotel' | 'Resort';
type FoodType = 'Budget meals' | 'Standard meals' | 'Premium dining';

const DESTINATIONS = ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Everest Region', 'Annapurna Region', 'Mustang', 'Janakpur', 'Nagarkot', 'Other'];

const TRAVEL_STYLE_MULTIPLIERS = {
  Budget: 0.7,
  Standard: 1.0,
  Premium: 1.5,
  Luxury: 2.5
};

const ACCOMMODATION_BASE_RATES: Record<AccommodationType, number> = {
  'Hostel': 800,
  'Budget Hotel': 1500,
  '3-Star Hotel': 3500,
  '4-Star Hotel': 7500,
  '5-Star Hotel': 15000,
  'Resort': 20000
};

const FOOD_BASE_RATES: Record<FoodType, number> = {
  'Budget meals': 800,
  'Standard meals': 1800,
  'Premium dining': 4000
};

const TRANSPORT_OPTIONS = [
  { name: 'Local Bus', price: 500 },
  { name: 'Tourist Bus', price: 1500 },
  { name: 'Taxi', price: 3000 },
  { name: 'Private Car', price: 5000 },
  { name: 'Jeep', price: 8000 },
  { name: 'Domestic Flight', price: 12000 },
  { name: 'Rental Vehicle', price: 6000 }
];

const ACTIVITIES = [
  { name: 'Everest Mountain Flight', price: 25000 },
  { name: 'Trekking Permit (TIMS/ACAP)', price: 3000 },
  { name: 'Paragliding', price: 8000 },
  { name: 'Bungee Jumping', price: 9000 },
  { name: 'Zipline', price: 6000 },
  { name: 'Jungle Safari', price: 4000 },
  { name: 'Boating', price: 1000 },
  { name: 'Temple Tours (Entry Fees)', price: 1500 },
  { name: 'Cultural Tours', price: 2000 },
  { name: 'Museum Visits', price: 500 }
];

const GUIDE_OPTIONS = [
  { name: 'No Guide', price: 0 },
  { name: 'Local Guide', price: 2500 },
  { name: 'Professional Guide', price: 4000 }
];

const PORTER_OPTIONS = [
  { name: 'No Porter', price: 0 },
  { name: '1 Porter', price: 2000 },
  { name: '2 Porters', price: 4000 }
];

const formatCurrency = (amount: number) => `NPR ${amount.toLocaleString('en-US')}`;

export default function SmartBudgetCalculator() {
  // --- State ---
  const [destination, setDestination] = useState<string>('Kathmandu');
  const [travelers, setTravelers] = useState<number>(1);
  const [days, setDays] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Standard');
  
  const nights = Math.max(0, days - 1);
  const [rooms, setRooms] = useState<number>(1);
  const [accType, setAccType] = useState<AccommodationType>('3-Star Hotel');
  const [customAccRate, setCustomAccRate] = useState<number | null>(null);
  const [foodType, setFoodType] = useState<FoodType>('Standard meals');

  const [selectedTransports, setSelectedTransports] = useState<Array<{ name: string, price: number, qty: number }>>([]);
  
  const [selectedActivities, setSelectedActivities] = useState<Array<{ name: string, price: number }>>([]);
  
  const [guideType, setGuideType] = useState<string>('No Guide');
  const [porterType, setPorterType] = useState<string>('No Porter');
  
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  
  const [miscExpense, setMiscExpense] = useState<number>(0);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // --- Derived Calculations ---
  const multiplier = TRAVEL_STYLE_MULTIPLIERS[travelStyle];
  
  // Base rates adjustment by destination (simplified mock logic)
  const destMultiplier = destination === 'Everest Region' ? 1.5 : destination === 'Pokhara' ? 1.1 : 1.0;

  const accRate = customAccRate !== null ? customAccRate : Math.round(ACCOMMODATION_BASE_RATES[accType] * destMultiplier);
  const totalAcc = accRate * nights * rooms;

  const dailyFoodRate = Math.round(FOOD_BASE_RATES[foodType] * destMultiplier * multiplier);
  const totalFood = dailyFoodRate * travelers * days;

  const totalTransport = selectedTransports.reduce((sum, t) => sum + (t.price * t.qty), 0);

  const totalActivities = selectedActivities.reduce((sum, a) => sum + a.price, 0) * travelers;

  const guideRate = GUIDE_OPTIONS.find(g => g.name === guideType)?.price || 0;
  const totalGuide = guideRate * days;

  const porterRate = PORTER_OPTIONS.find(p => p.name === porterType)?.price || 0;
  const totalPorter = porterRate * days;

  const totalInsurance = includeInsurance ? (500 * travelers * days) : 0;

  const totalBudget = totalAcc + totalFood + totalTransport + totalActivities + totalGuide + totalPorter + totalInsurance + miscExpense;
  const costPerPerson = travelers > 0 ? Math.round(totalBudget / travelers) : 0;
  const dailyCost = days > 0 ? Math.round(totalBudget / days) : 0;

  // --- Actions ---
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all budget values?')) {
      setDestination('Kathmandu');
      setTravelers(1);
      setDays(3);
      setTravelStyle('Standard');
      setRooms(1);
      setAccType('3-Star Hotel');
      setCustomAccRate(null);
      setFoodType('Standard meals');
      setSelectedTransports([]);
      setSelectedActivities([]);
      setGuideType('No Guide');
      setPorterType('No Porter');
      setIncludeInsurance(false);
      setMiscExpense(0);
      setSaveStatus('idle');
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const toggleActivity = (activity: {name: string, price: number}) => {
    if (selectedActivities.some(a => a.name === activity.name)) {
      setSelectedActivities(selectedActivities.filter(a => a.name !== activity.name));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const addTransport = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const option = TRANSPORT_OPTIONS.find(t => t.name === val);
    if (option) {
      const existing = selectedTransports.find(t => t.name === option.name);
      if (existing) {
        setSelectedTransports(selectedTransports.map(t => t.name === option.name ? { ...t, qty: t.qty + 1 } : t));
      } else {
        setSelectedTransports([...selectedTransports, { ...option, qty: 1 }]);
      }
    }
    e.target.value = '';
  };

  const removeTransport = (name: string) => {
    setSelectedTransports(selectedTransports.filter(t => t.name !== name));
  };

  // --- Chart Data ---
  const chartData = [
    { label: 'Hotel', value: totalAcc, color: '#3b82f6' },
    { label: 'Food', value: totalFood, color: '#10b981' },
    { label: 'Transport', value: totalTransport, color: '#f59e0b' },
    { label: 'Activities', value: totalActivities, color: '#8b5cf6' },
    { label: 'Other', value: totalGuide + totalPorter + totalInsurance + miscExpense, color: '#64748b' }
  ].filter(d => d.value > 0);

  let cumulativePercent = 0;
  const svgPieces = chartData.map(slice => {
    const percent = totalBudget > 0 ? slice.value / totalBudget : 0;
    const startAngle = cumulativePercent * 2 * Math.PI;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 2 * Math.PI;
    
    const x1 = Math.cos(startAngle);
    const y1 = Math.sin(startAngle);
    const x2 = Math.cos(endAngle);
    const y2 = Math.sin(endAngle);
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    // SVG path for a donut slice
    const d = `
      M ${x1} ${y1}
      A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}
    `;
    return { d, color: slice.color, label: slice.label, percent };
  });

  // --- Recommendations ---
  const getRecommendations = () => {
    const recs = [];
    if (totalAcc > totalBudget * 0.4 && travelStyle !== 'Luxury') {
      recs.push("You can reduce your hotel cost by choosing a budget hotel or hostel.");
    }
    if (totalTransport > totalBudget * 0.2) {
      recs.push("Traveling by tourist bus instead of private options can reduce transportation expenses.");
    }
    if (totalActivities > 0) {
      recs.push(`Your activities represent ${Math.round((totalActivities / totalBudget) * 100)}% of your total budget.`);
    }
    if (totalBudget < 30000) {
      recs.push("Your current budget is suitable for a budget-friendly Nepal trip.");
    } else if (totalBudget < 75000) {
      recs.push("Your current budget is suitable for a comfortable Nepal trip.");
    } else {
      recs.push("You're planning a premium experience! Consider adding a professional guide.");
    }
    return recs;
  };

  const budgetLevel = totalBudget < 30000 ? 'Budget Trip' : totalBudget <= 75000 ? 'Comfortable Trip' : totalBudget <= 150000 ? 'Premium Trip' : 'Luxury Trip';
  const budgetColor = totalBudget < 30000 ? 'text-green-400' : totalBudget <= 75000 ? 'text-blue-400' : totalBudget <= 150000 ? 'text-purple-400' : 'text-amber-400';

  return (
    <div className="min-h-screen bg-transparent text-slate-200 font-sans">


      {/* Hero Section */}
      <section className="relative py-20 px-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6">
            <Calculator className="w-4 h-4" /> Smart Planning Tool
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Plan Your Nepal Trip Budget
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Estimate your travel expenses and plan your perfect Nepal adventure with confidence using real-time local rates.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full 2xl:px-12 mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form Sections */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* 1. Trip Details */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl"><MapPin className="w-5 h-5 text-blue-400" /></div>
                <h2 className="text-xl font-bold text-white">Trip Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Destination</label>
                  <div className="relative">
                    <select 
                      value={destination} 
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Travelers</label>
                    <div className="flex items-center bg-transparent border border-slate-700 rounded-xl overflow-hidden">
                      <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">-</button>
                      <input type="number" min="1" value={travelers} onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-transparent text-center text-white font-semibold focus:outline-none" />
                      <button onClick={() => setTravelers(travelers + 1)} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Days <span className="text-xs text-slate-500 font-normal">({nights} Nights)</span></label>
                    <div className="flex items-center bg-transparent border border-slate-700 rounded-xl overflow-hidden">
                      <button onClick={() => setDays(Math.max(1, days - 1))} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">-</button>
                      <input type="number" min="1" value={days} onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-transparent text-center text-white font-semibold focus:outline-none" />
                      <button onClick={() => setDays(days + 1)} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Travel Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['Budget', 'Standard', 'Premium', 'Luxury'] as TravelStyle[]).map(style => (
                    <button
                      key={style}
                      onClick={() => setTravelStyle(style)}
                      className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                        travelStyle === style 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                          : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Accommodation */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/20 rounded-xl"><Bed className="w-5 h-5 text-indigo-400" /></div>
                  <h2 className="text-xl font-bold text-white">Accommodation</h2>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(totalAcc)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Hotel Type</label>
                  <div className="relative">
                    <select 
                      value={accType} 
                      onChange={(e) => { setAccType(e.target.value as AccommodationType); setCustomAccRate(null); }}
                      className="w-full bg-transparent border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {Object.keys(ACCOMMODATION_BASE_RATES).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Rooms</label>
                  <div className="flex items-center bg-transparent border border-slate-700 rounded-xl overflow-hidden">
                    <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">-</button>
                    <input type="number" min="1" value={rooms} onChange={(e) => setRooms(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-transparent text-center text-white font-semibold focus:outline-none" />
                    <button onClick={() => setRooms(rooms + 1)} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">+</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center justify-between">
                  <span>Price Per Night (NPR)</span>
                  <span className="text-xs text-slate-500 font-normal">Auto-calculated based on destination</span>
                </label>
                <input 
                  type="number" 
                  value={accRate}
                  onChange={(e) => setCustomAccRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </section>

            {/* 3. Food & Dining */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500/20 rounded-xl"><Utensils className="w-5 h-5 text-orange-400" /></div>
                  <h2 className="text-xl font-bold text-white">Food & Dining</h2>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(totalFood)}</span>
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-400 mb-3">Dining Preference</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.keys(FOOD_BASE_RATES) as FoodType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setFoodType(type)}
                    className={`py-4 px-3 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-2 ${
                      foodType === type 
                        ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                        : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <span>{type}</span>
                    <span className={`text-xs font-normal ${foodType === type ? 'text-orange-200' : 'text-slate-500'}`}>~NPR {FOOD_BASE_RATES[type]}/day</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 4. Transportation */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500/20 rounded-xl"><Car className="w-5 h-5 text-teal-400" /></div>
                  <h2 className="text-xl font-bold text-white">Transportation</h2>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(totalTransport)}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">Add Route/Transport</label>
                <div className="relative">
                  <select 
                    onChange={addTransport}
                    className="w-full bg-transparent border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="">-- Select Transport Option --</option>
                    {TRANSPORT_OPTIONS.map(t => (
                      <option key={t.name} value={t.name}>{t.name} (est. {formatCurrency(t.price)})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {selectedTransports.length > 0 && (
                <div className="space-y-2 mt-4">
                  {selectedTransports.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-transparent border border-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold">{t.qty}x</span>
                        <span className="text-sm font-medium text-slate-300">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-white">{formatCurrency(t.price * t.qty)}</span>
                        <button onClick={() => removeTransport(t.name)} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 5. Activities & Attractions */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-pink-500/20 rounded-xl"><Tent className="w-5 h-5 text-pink-400" /></div>
                  <h2 className="text-xl font-bold text-white">Activities</h2>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(totalActivities)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ACTIVITIES.map(activity => {
                  const isSelected = selectedActivities.some(a => a.name === activity.name);
                  return (
                    <label 
                      key={activity.name} 
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? 'bg-pink-500/10 border-pink-500/50' : 'bg-transparent border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleActivity(activity)}
                          className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500 focus:ring-offset-slate-950 bg-slate-800 border-slate-600"
                        />
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{activity.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{formatCurrency(activity.price)}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-4">* Activity costs are multiplied by the number of travelers.</p>
            </section>

            {/* 6. Guide & Porter */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-500/20 rounded-xl"><UserPlus className="w-5 h-5 text-yellow-400" /></div>
                  <h2 className="text-xl font-bold text-white">Guide & Porter</h2>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-bold text-white">{formatCurrency(totalGuide + totalPorter)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Guide Service</label>
                  <div className="relative">
                    <select 
                      value={guideType} 
                      onChange={(e) => setGuideType(e.target.value)}
                      className="w-full bg-transparent border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-yellow-500 transition-colors"
                    >
                      {GUIDE_OPTIONS.map(g => (
                        <option key={g.name} value={g.name}>{g.name} ({formatCurrency(g.price)}/day)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Porter Service</label>
                  <div className="relative">
                    <select 
                      value={porterType} 
                      onChange={(e) => setPorterType(e.target.value)}
                      className="w-full bg-transparent border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-yellow-500 transition-colors"
                    >
                      {PORTER_OPTIONS.map(p => (
                        <option key={p.name} value={p.name}>{p.name} ({formatCurrency(p.price)}/day)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Misc & Insurance */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-500/20 rounded-xl"><ShieldCheck className="w-5 h-5 text-emerald-400" /></div>
                    <h2 className="text-xl font-bold text-white">Insurance</h2>
                  </div>
                  <label className="flex items-start gap-3 p-4 rounded-xl border bg-transparent border-slate-800 cursor-pointer hover:border-emerald-500/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={includeInsurance}
                      onChange={(e) => setIncludeInsurance(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 bg-slate-800 border-slate-600"
                    />
                    <div>
                      <span className="block text-sm font-bold text-white mb-1">Include Travel Insurance</span>
                      <span className="block text-xs text-slate-400">Est. NPR 500 /person /day</span>
                      {includeInsurance && <span className="block mt-2 text-sm font-bold text-emerald-400">+{formatCurrency(totalInsurance)}</span>}
                    </div>
                  </label>
                </div>

                <div>
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-slate-700 rounded-xl"><MoreHorizontal className="w-5 h-5 text-slate-300" /></div>
                    <h2 className="text-xl font-bold text-white">Misc Expenses</h2>
                  </div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Shopping, SIM, Tips, etc.</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 font-bold">NPR</span>
                    <input 
                      type="number" 
                      value={miscExpense || ''}
                      onChange={(e) => setMiscExpense(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full bg-transparent border border-slate-700 text-white rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:border-slate-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Summary Panel */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 flex flex-col gap-6">
              
              {/* Main Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
                {/* Decorative background blur */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <h2 className="text-lg font-bold text-slate-300 mb-2">Your Estimated Trip Budget</h2>
                <div className="mb-6">
                  <span className="text-4xl lg:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                    {formatCurrency(totalBudget).replace('NPR ', '')}
                    <span className="text-xl text-slate-500 font-bold">NPR</span>
                  </span>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-transparent border border-slate-800 ${budgetColor}`}>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    {budgetLevel}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-transparent rounded-xl p-3 border border-slate-800">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Per Person</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(costPerPerson)}</span>
                  </div>
                  <div className="bg-transparent rounded-xl p-3 border border-slate-800">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Per Day (Avg)</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(dailyCost)}</span>
                  </div>
                </div>

                {/* Donut Chart Visualization */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-300 mb-4">Budget Breakdown</h3>
                  
                  {totalBudget > 0 ? (
                    <div className="flex items-center gap-6">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
                          {svgPieces.map((piece, i) => (
                            <path
                              key={i}
                              d={piece.d}
                              fill="none"
                              stroke={piece.color}
                              strokeWidth="0.4"
                              strokeLinecap="round"
                              className="transition-all duration-500"
                            />
                          ))}
                        </svg>
                      </div>
                      <div className="flex-1 space-y-2.5">
                        {chartData.map((d, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: d.color}}></span>
                              <span className="text-slate-400">{d.label}</span>
                            </div>
                            <span className="font-bold text-white">{Math.round((d.value/totalBudget)*100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-700 rounded-xl">
                      <span className="text-sm text-slate-500">Enter details to see chart</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button 
                    onClick={handleSave}
                    disabled={saveStatus === 'saving' || totalBudget === 0}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    {saveStatus === 'saving' ? (
                      <span className="animate-pulse">Saving...</span>
                    ) : saveStatus === 'success' ? (
                      <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</>
                    ) : (
                      'Save My Budget'
                    )}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                  <button onClick={handleReset} className="w-full py-3 text-slate-500 hover:text-red-400 font-medium text-sm flex items-center justify-center gap-2 transition-colors mt-2">
                    <RotateCcw className="w-4 h-4" /> Reset Budget
                  </button>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                  <Info className="w-16 h-16 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Smart Suggestions
                </h3>
                
                {getRecommendations().length > 0 ? (
                  <ul className="space-y-3 relative z-10">
                    {getRecommendations().map((rec, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">Add trip details to get personalized money-saving tips.</p>
                )}
              </div>

              {/* Integration Banner */}
              <button className="w-full group bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 text-left transition-all">
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Find Hotels Within My Budget</h4>
                <p className="text-xs text-slate-400">Discover accommodations in {destination} matching your {formatCurrency(totalAcc)} estimate.</p>
              </button>

            </div>
          </div>
        </div>
      </main>
      
      {/* Footer CTA */}
      <footer className="border-t border-white/10 bg-transparent py-16 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore Nepal?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors">
              Explore Destinations
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors">
              Find Hotels
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
