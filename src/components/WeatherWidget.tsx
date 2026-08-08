import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Sun, RefreshCw, Thermometer } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  cityName: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lng, cityName }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lng}&city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.error('Failed to load weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lng, cityName]);

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 text-center backdrop-blur-xl animate-pulse">
        <div className="w-8 h-8 rounded-full bg-white/10 mx-auto mb-2" />
        <div className="h-4 w-32 bg-white/10 mx-auto rounded mb-3" />
        <div className="h-8 w-20 bg-white/10 mx-auto rounded" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-300" />
          <h4 className="font-bold text-sm text-white">Real-Time Climate</h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="text-xs font-mono bg-white/10 hover:bg-white/20 text-blue-300 px-2.5 py-1 rounded-xl border border-white/15 transition-all backdrop-blur-md"
          >
            °{unit}
          </button>
          <button
            onClick={fetchWeather}
            className="text-white/60 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
            title="Refresh weather"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Temperature Main Display */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white flex items-baseline gap-1 tracking-tight">
            {unit === 'C' ? weather.tempC : weather.tempF}°
            <span className="text-lg font-normal text-white/50">
              {unit === 'C' ? 'C' : 'F'}
            </span>
          </div>
          <div className="text-xs font-medium text-blue-300 mt-0.5">
            {weather.condition} • Feels like {unit === 'C' ? weather.feelsLikeC : Math.round((weather.feelsLikeC * 9/5) + 32)}°
          </div>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center p-2 backdrop-blur-md">
          <img src={weather.icon} alt={weather.condition} className="w-12 h-12" />
        </div>
      </div>

      {/* Climate Metrics */}
      <div className="grid grid-cols-3 gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 text-center text-xs mb-4 backdrop-blur-md">
        <div>
          <div className="flex items-center justify-center gap-1 text-white/50 mb-0.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Humidity</span>
          </div>
          <span className="font-bold text-white">{weather.humidity}%</span>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-white/50 mb-0.5">
            <Wind className="w-3.5 h-3.5 text-teal-300" />
            <span>Wind</span>
          </div>
          <span className="font-bold text-white">{weather.windKmH} km/h</span>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-white/50 mb-0.5">
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>UV Index</span>
          </div>
          <span className="font-bold text-white">{weather.uvIndex} / 10</span>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div>
        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-2">
          3-Day Travel Forecast
        </span>
        <div className="grid grid-cols-3 gap-2">
          {weather.forecast.map((f, i) => (
            <div key={i} className="bg-white/5 p-2 rounded-xl border border-white/10 text-center text-xs backdrop-blur-md">
              <span className="text-white/50 text-[10px] block mb-1">{f.day}</span>
              <img src={f.icon} alt={f.condition} className="w-7 h-7 mx-auto my-0.5" />
              <span className="font-bold text-white block">
                {unit === 'C' ? f.tempC : Math.round((f.tempC * 9/5) + 32)}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
