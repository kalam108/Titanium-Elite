import React from 'react';
import { Key, ExternalLink, X, CheckCircle2, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, hasKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent/80 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl text-white backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 backdrop-blur-md">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Google Maps API Key</h3>
            <span className="text-xs text-white/60">Enable full interactive map features</span>
          </div>
        </div>

        {hasKey ? (
          <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4 mb-5 flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-emerald-300 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-200">API Key Configured!</h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Google Maps JavaScript SDK is active and connected to your AI Studio secrets.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl p-4 mb-5 text-xs text-amber-200 backdrop-blur-md">
            <p className="font-semibold mb-1">Interactive Map Preview Active (Demo Mode)</p>
            To enable real Google Maps satellite, street views, and place markers:
          </div>
        )}

        <div className="space-y-3 text-xs text-white/80">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <span className="font-bold text-blue-300 block mb-1">Step 1: Get Google Maps API Key</span>
            <a
              href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-300 hover:underline font-medium"
            >
              Get an API Key from Google Cloud Console
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <span className="font-bold text-blue-300 block mb-1">Step 2: Save Key in AI Studio Secrets</span>
            <ol className="list-decimal list-inside space-y-1 text-white/60 pl-1">
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Add secret name: <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 border border-white/10">GOOGLE_MAPS_PLATFORM_KEY</code></li>
              <li>Paste your API key and press <strong>Enter</strong></li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            Got it, Continue
          </button>
        </div>
      </div>
    </div>
  );
};
