import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  ArrowRightLeft, 
  Mic, 
  Volume2, 
  Copy, 
  Save, 
  Share2, 
  Trash2, 
  History, 
  Bookmark, 
  MessageSquare, 
  Camera, 
  Sparkles, 
  ChevronDown, 
  Menu,
  CheckCircle2,
  AlertTriangle,
  Play,
  SquareSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MOCK DATA & CONSTANTS ---
const POPULAR_LANGUAGES = [
  'English', 'Nepali', 'Hindi', 'Chinese', 'Japanese', 'Korean', 'Spanish', 'French', 'German'
];

const REGIONAL_LANGUAGES = [
  'Maithili', 'Bhojpuri', 'Tharu', 'Tamang', 'Newari / Nepal Bhasa', 'Magar', 'Gurung', 'Sherpa'
];

const QUICK_PHRASES = {
  Emergency: [
    { en: 'I need help.', ne: 'मलाई मद्दत चाहियो।' },
    { en: 'I need a doctor.', ne: 'मलाई डाक्टर चाहियो।' },
    { en: 'Where is the hospital?', ne: 'अस्पताल कहाँ छ?' },
    { en: 'Please call emergency services.', ne: 'कृपया आपतकालीन सेवालाई कल गर्नुहोस्।' },
    { en: 'I am lost.', ne: 'म हराएँ।' }
  ],
  Hotel: [
    { en: 'I have a reservation.', ne: 'मेरो बुकिङ छ।' },
    { en: 'What time is check-in?', ne: 'चेक-इन गर्ने समय कति बजे हो?' },
    { en: 'Is breakfast included?', ne: 'के बिहानको खाजा समावेश छ?' },
    { en: 'Can I get Wi-Fi?', ne: 'के मैले वाई-फाई पाउन सक्छु?' },
    { en: 'I need a taxi.', ne: 'मलाई ट्याक्सी चाहियो।' }
  ],
  Restaurant: [
    { en: 'How much does this cost?', ne: 'यसको कति पर्छ?' },
    { en: 'Is this vegetarian?', ne: 'के यो शाकाहारी हो?' },
    { en: 'I don\'t eat meat.', ne: 'म मासु खान्न।' },
    { en: 'Is this spicy?', ne: 'के यो पिरो छ?' },
    { en: 'Can I have water?', ne: 'के म पानी पाउन सक्छु?' }
  ],
  Trekking: [
    { en: 'Where is the trail?', ne: 'बाटो कहाँ छ?' },
    { en: 'How far is the next village?', ne: 'अर्को गाउँ कति टाढा छ?' },
    { en: 'Where can I find a guide?', ne: 'मैले गाइड कहाँ पाउन सक्छु?' },
    { en: 'Is there a lodge nearby?', ne: 'के नजिकै कुनै लज छ?' }
  ]
};

// --- COMPONENTS ---

export default function TranslationPage() {
  // State
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('Nepali');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'translate' | 'conversation'>('translate');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'phrases' | 'history' | 'saved'>('phrases');
  const [activePhraseCategory, setActivePhraseCategory] = useState('Emergency');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock History
  const [history, setHistory] = useState([
    { id: 1, source: 'Where is the nearest hotel?', target: 'नजिकैको होटल कहाँ छ?', sourceLang: 'English', targetLang: 'Nepali', time: 'Today, 4:32 PM' }
  ]);
  const [saved, setSaved] = useState<any[]>([]);

  // Refs
  const sourceInputRef = useRef<HTMLTextAreaElement>(null);

  // --- HANDLERS ---

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSwap = () => {
    if (sourceLang === 'Auto Detect') {
      showToast('Cannot swap with Auto Detect. Please select a specific language.');
      return;
    }
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    // Simulate API delay
    setTimeout(() => {
      // Mock translation logic
      let result = `[Translated to ${targetLang}]: ${sourceText}`;
      
      // Check phrases for exact matches to show realistic demo
      for (const cat of Object.values(QUICK_PHRASES)) {
        const phrase = cat.find(p => p.en.toLowerCase() === sourceText.toLowerCase());
        if (phrase && targetLang === 'Nepali') result = phrase.ne;
      }
      
      setTranslatedText(result);
      if (sourceLang === 'Auto Detect') {
        // Mock detection
        setSourceLang('English'); 
      }
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        source: sourceText,
        target: result,
        sourceLang: sourceLang === 'Auto Detect' ? 'English' : sourceLang,
        targetLang,
        time: 'Just now'
      };
      setHistory([newEntry, ...history]);
      
      setIsTranslating(false);
    }, 800);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('Translation copied!');
  };

  const handleSave = () => {
    if (!translatedText) return;
    const newSaved = {
      id: Date.now(),
      source: sourceText,
      target: translatedText,
      sourceLang,
      targetLang
    };
    setSaved([newSaved, ...saved]);
    showToast('Translation saved!');
  };

  const handleClear = () => {
    if (sourceText.length > 50) {
      if (!window.confirm('Clear all text?')) return;
    }
    setSourceText('');
    setTranslatedText('');
  };

  const handleListen = () => {
    if (!translatedText) return;
    showToast('Playing audio...');
    // Real implementation would use SpeechSynthesis API
    // const utterance = new SpeechSynthesisUtterance(translatedText);
    // utterance.lang = 'ne-NP'; // map targetLang to locale
    // window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    setIsListening(true);
    showToast('Listening...');
    setTimeout(() => {
      setIsListening(false);
      setSourceText('I need a taxi to the airport.');
      showToast('Speech recognized.');
    }, 2000);
  };

  const selectPhrase = (phrase: {en: string, ne: string}) => {
    setSourceText(phrase.en);
    setSourceLang('English');
    setTargetLang('Nepali');
    setTranslatedText(phrase.ne);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDER HELPERS ---

  const renderLanguageSelector = (value: string, onChange: (v: string) => void, allowAuto: boolean) => (
    <div className="relative group flex-1">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
      >
        {allowAuto && <option value="Auto Detect">Auto Detect</option>}
        <optgroup label="Popular">
          {POPULAR_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </optgroup>
        <optgroup label="Nepal Regional">
          {REGIONAL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </optgroup>
      </select>
      <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-white transition-colors" />
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      


      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6">
            <Languages className="w-4 h-4" /> Universal Translator
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Explore Nepal Without <br className="hidden md:block"/> Language Barriers
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Translate conversations, travel information, hotel requests, menus, and local phrases wherever your journey takes you.
          </motion.p>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Mode Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-slate-900 border border-slate-800 rounded-full p-1 shadow-lg">
            <button 
              onClick={() => setActiveTab('translate')}
              className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'translate' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Languages className="w-4 h-4" /> Text
            </button>
            <button 
              onClick={() => setActiveTab('conversation')}
              className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'conversation' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" /> Conversation
            </button>
          </div>
        </div>

        {activeTab === 'translate' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Language Selection Row */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
              {renderLanguageSelector(sourceLang, setSourceLang, true)}
              <button 
                onClick={handleSwap}
                className="mx-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors border border-slate-700"
                title="Swap languages"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              {renderLanguageSelector(targetLang, setTargetLang, false)}
            </div>

            {/* Translation Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Source Area */}
              <div className="relative flex flex-col bg-transparent/50">
                <textarea 
                  ref={sourceInputRef}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Type or paste text here..."
                  className="w-full h-48 md:h-64 bg-transparent text-white text-xl p-6 focus:outline-none resize-none placeholder:text-slate-600"
                ></textarea>
                
                {/* Source Controls */}
                <div className="p-4 flex items-center justify-between border-t border-slate-800/50 bg-slate-900/30">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleSpeak}
                      className={`p-3 rounded-full transition-colors border ${isListening ? 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'}`}
                      title="Speak"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    {sourceText && (
                      <button onClick={handleClear} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700" title="Clear">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{sourceText.length} / 5000</span>
                </div>
              </div>

              {/* Target Area */}
              <div className="relative flex flex-col bg-slate-900/50">
                <div className="w-full h-48 md:h-64 p-6 overflow-y-auto">
                  {isTranslating ? (
                    <div className="flex items-center gap-3 text-blue-400 font-medium">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      Translating...
                    </div>
                  ) : translatedText ? (
                    <p className="text-xl text-white whitespace-pre-wrap">{translatedText}</p>
                  ) : (
                    <p className="text-xl text-slate-600 font-medium">Translation will appear here</p>
                  )}
                </div>

                {/* Target Controls */}
                <div className="p-4 flex items-center justify-between border-t border-slate-800/50 bg-slate-900/30">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleListen}
                      disabled={!translatedText}
                      className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 transition-colors border border-slate-700"
                      title="Listen"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleCopy(translatedText)}
                      disabled={!translatedText}
                      className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700"
                      title="Copy"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!translatedText}
                      className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700"
                      title="Save"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button 
                      disabled={!translatedText}
                      className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700 hidden sm:block"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={handleTranslate}
                    disabled={!sourceText || isTranslating}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    Translate
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'conversation' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-center"
          >
            <MessageSquare className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Conversation Mode</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Have a real-time, bilingual conversation with locals. Tap the microphone for your language and start speaking.</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex flex-col items-center">
                <span className="font-bold text-white mb-4">You (English)</span>
                <button className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105">
                  <Mic className="w-8 h-8" />
                </button>
              </div>
              <ArrowRightLeft className="w-8 h-8 text-slate-600 hidden md:block" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-white mb-4">Local (Nepali)</span>
                <button className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105">
                  <Mic className="w-8 h-8" />
                </button>
              </div>
            </div>
            
            <div className="bg-transparent border border-slate-800 rounded-2xl p-4 h-64 overflow-y-auto flex flex-col justify-end">
              <p className="text-slate-500 text-sm">Tap a microphone to begin conversing.</p>
            </div>
          </motion.div>
        )}

        {/* Feature Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors group">
            <Sparkles className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-300">AI Assistant</span>
          </button>
          <button className="bg-slate-900 border border-slate-800 hover:border-pink-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors group">
            <Camera className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-300">Camera</span>
          </button>
          <button className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors group">
            <SquareSquare className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-300">Menu Translate</span>
          </button>
          <button className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors group">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-300">Offline Pack</span>
          </button>
        </div>

      </main>

      {/* Bottom Data Section (Phrases, History, Saved) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/50">
            <button 
              onClick={() => setActiveHistoryTab('phrases')}
              className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeHistoryTab === 'phrases' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Travel Phrases
            </button>
            <button 
              onClick={() => setActiveHistoryTab('history')}
              className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeHistoryTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveHistoryTab('saved')}
              className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${activeHistoryTab === 'saved' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Saved
            </button>
          </div>

          <div className="p-6">
            {activeHistoryTab === 'phrases' && (
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(QUICK_PHRASES).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActivePhraseCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors border ${activePhraseCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUICK_PHRASES[activePhraseCategory as keyof typeof QUICK_PHRASES].map((phrase, i) => (
                    <div key={i} className="bg-transparent border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-blue-500/50 transition-colors">
                      <div>
                        <p className="font-bold text-white mb-1">{phrase.en}</p>
                        <p className="text-sm text-slate-400">{phrase.ne}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => selectPhrase(phrase)} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-blue-400 transition-colors">
                          <Languages className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeHistoryTab === 'history' && (
              <div className="space-y-4">
                {history.length > 0 ? history.map(item => (
                  <div key={item.id} className="bg-transparent border border-slate-800 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <span>{item.sourceLang}</span>
                        <ArrowRightLeft className="w-3 h-3" />
                        <span>{item.targetLang}</span>
                      </div>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                    <p className="font-bold text-white mb-1">{item.source}</p>
                    <p className="text-sm text-slate-400">{item.target}</p>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-500">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Your translation history will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeHistoryTab === 'saved' && (
              <div className="space-y-4">
                {saved.length > 0 ? saved.map(item => (
                  <div key={item.id} className="bg-transparent border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white mb-1">{item.source}</p>
                      <p className="text-sm text-slate-400">{item.target}</p>
                    </div>
                    <Bookmark className="w-5 h-5 text-blue-500 fill-blue-500" />
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-500">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>You haven't saved any translations yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

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
