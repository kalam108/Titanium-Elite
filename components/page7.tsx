import React, { useState, useRef } from 'react';
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Hotel, 
  MapPin, 
  Users, 
  Languages, 
  HeartPulse, 
  Laptop, 
  Paperclip, 
  Send, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Menu,
  ChevronLeft,
  X,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MOCK DATA ---
const MOCK_TICKETS = [
  {
    id: 'ENP-REQ-2026-001245',
    subject: 'Unable to modify booking',
    category: 'Hotel & Booking',
    priority: 'Medium',
    status: 'In Progress',
    date: 'Aug 8, 2026',
    messages: [
      { sender: 'You', text: 'Hi, I need to change the check-in date for my stay at Himalayan View Hotel but the website throws an error.', time: 'Aug 8, 10:00 AM' },
      { sender: 'Explore Nepal Support', text: 'Hello! I can help with that. Could you please confirm the new check-in date you prefer?', time: 'Aug 8, 10:15 AM' }
    ]
  },
  {
    id: 'ENP-REQ-2026-001190',
    subject: 'Incorrect location for Pokhara Clinic',
    category: 'Healthcare',
    priority: 'High',
    status: 'Resolved',
    date: 'Aug 5, 2026',
    messages: [
      { sender: 'You', text: 'The map pin for Pokhara Alpine Clinic is off by about 500 meters.', time: 'Aug 5, 2:00 PM' },
      { sender: 'Explore Nepal Support', text: 'Thank you for reporting this. Our healthcare verification team has updated the coordinates.', time: 'Aug 6, 9:00 AM' }
    ]
  }
];

const FAQS = [
  { q: 'How to cancel a hotel booking?', a: 'You can cancel your booking from your profile under "My Bookings". Please note the hotel\'s cancellation policy.' },
  { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption. We do not store your raw credit card numbers.' },
  { q: 'How do I report fake community content?', a: 'Click the "Report" button on the post or reel, or submit a Community Report ticket here.' }
];

// --- COMPONENTS ---

export default function SupportPage() {
  const [activeView, setActiveView] = useState<'home' | 'submit' | 'list' | 'ticket' | 'feedback'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [ticketCategory, setTicketCategory] = useState('Hotel & Booking');
  const [ticketPriority, setTicketPriority] = useState('Low');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Ticket View State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      // Reset form
      setTicketSubject('');
      setTicketDesc('');
    }, 1000);
  };

  const handleOpenTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setActiveView('ticket');
    window.scrollTo(0, 0);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    // In a real app, this would append to the backend
    selectedTicket.messages.push({
      sender: 'You',
      text: replyText,
      time: 'Just now'
    });
    
    setReplyText('');
  };

  // --- RENDERERS ---

  const renderHome = () => (
    <div className="space-y-12">
      {/* Quick Categories */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Support Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <button onClick={() => { setTicketCategory('Hotel & Booking'); setActiveView('submit'); window.scrollTo(0,0); }} className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-left transition-colors group flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Hotel className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Hotel & Booking</h3>
              <p className="text-sm text-slate-400">Reservations, cancellations, payment issues.</p>
            </div>
          </button>

          <button onClick={() => { setTicketCategory('Destination'); setActiveView('submit'); window.scrollTo(0,0); }} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-left transition-colors group flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Destination Query</h3>
              <p className="text-sm text-slate-400">Locations, transportation, travel info.</p>
            </div>
          </button>

          <button onClick={() => { setTicketCategory('Community'); setActiveView('submit'); window.scrollTo(0,0); }} className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 text-left transition-colors group flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Community Report</h3>
              <p className="text-sm text-slate-400">Report posts, spam, or fake content.</p>
            </div>
          </button>

          <button onClick={() => { setTicketCategory('Healthcare'); setActiveView('submit'); window.scrollTo(0,0); }} className="bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl p-6 text-left transition-colors group flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Healthcare Info</h3>
              <p className="text-sm text-slate-400">Report outdated facility information.</p>
            </div>
          </button>

          <button onClick={() => { setTicketCategory('Technical'); setActiveView('submit'); window.scrollTo(0,0); }} className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-6 text-left transition-colors group flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Laptop className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Technical Issue</h3>
              <p className="text-sm text-slate-400">Website bugs, login issues, errors.</p>
            </div>
          </button>
          
          <button onClick={() => { setTicketCategory('Other'); setActiveView('submit'); window.scrollTo(0,0); }} className="bg-slate-900 border border-slate-800 hover:border-slate-500/50 rounded-2xl p-6 text-left transition-colors group flex items-start gap-4 shadow-lg">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-slate-700">
              <HelpCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Other Support</h3>
              <p className="text-sm text-slate-400">General feedback or suggestions.</p>
            </div>
          </button>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <summary className="font-bold text-white p-4 cursor-pointer flex items-center justify-between hover:bg-slate-900 transition-colors">
                {faq.q}
                <ChevronRight className="w-5 h-5 text-slate-500 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="p-4 pt-0 text-slate-400 border-t border-slate-800">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );

  const renderSubmit = () => (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-sm text-blue-400 font-bold mb-6 hover:text-blue-300 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Support Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-2">Submit Your Request</h2>
        <p className="text-slate-400 mb-8">Please provide as much detail as possible so we can assist you quickly.</p>

        <form onSubmit={handleSubmitTicket} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
              <select 
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option>Hotel & Booking</option>
                <option>Destination</option>
                <option>Community</option>
                <option>Healthcare</option>
                <option>Technical</option>
                <option>Feedback/Suggestion</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Priority</label>
              <select 
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low (General Query/Feedback)</option>
                <option value="Medium">Medium (Affects normal use)</option>
                <option value="High">High (Important issue)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Subject</label>
            <input 
              required
              type="text" 
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="Briefly describe your issue..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
            <textarea 
              required
              rows={5}
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              placeholder="Tell us what happened..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 transition-colors bg-slate-950 rounded-xl p-6 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,.pdf" />
              <Paperclip className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-300">Click to upload screenshots or receipts</p>
              <p className="text-xs text-slate-500 mt-1">Max file size: 5MB. Support images and PDFs.</p>
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-100">
              If this is a real-world emergency, do not use this form. Please use the <a href="#" className="font-bold text-blue-400 underline">Healthcare & Emergency</a> page to contact official emergency services.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-blue-300 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderTicketList = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white">My Requests</h2>
        <button onClick={() => { setActiveView('submit'); window.scrollTo(0,0); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
          + New Request
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_TICKETS.map(ticket => (
          <div key={ticket.id} className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 shadow-lg transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer" onClick={() => handleOpenTicket(ticket)}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{ticket.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  ticket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                  ticket.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mb-1 group-hover:text-blue-400 transition-colors">{ticket.subject}</h3>
              <p className="text-sm text-slate-400">{ticket.category} • Updated {ticket.date}</p>
            </div>
            
            <button className="hidden sm:flex px-4 py-2 bg-slate-950 border border-slate-800 group-hover:bg-blue-600 group-hover:border-blue-500 text-white text-sm font-bold rounded-xl transition-colors items-center gap-2">
              View Request <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTicketView = () => {
    if (!selectedTicket) return null;
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setActiveView('list')} className="flex items-center gap-2 text-sm text-blue-400 font-bold mb-6 hover:text-blue-300 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to My Requests
        </button>

        {/* Ticket Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-t-3xl p-6 shadow-xl border-b-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-black text-white mb-2">{selectedTicket.subject}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {selectedTicket.id}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Created {selectedTicket.date}</span>
                <span>Priority: <strong className="text-white">{selectedTicket.priority}</strong></span>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
              selectedTicket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {selectedTicket.status}
            </span>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="bg-slate-950 border border-slate-800 p-6 space-y-6 max-h-[500px] overflow-y-auto">
          {selectedTicket.messages.map((msg: any, i: number) => {
            const isUser = msg.sender === 'You';
            return (
              <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <span className="text-xs font-bold text-slate-500 mb-1">{msg.sender} • {msg.time}</span>
                <div className={`p-4 max-w-[85%] sm:max-w-[75%] rounded-2xl ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-lg'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-b-3xl p-6 shadow-xl">
          {selectedTicket.status === 'Resolved' ? (
            <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-emerald-400 font-bold">This request is marked as resolved.</p>
              <p className="text-sm text-slate-400 mt-1">If you need further assistance, please open a new request.</p>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="relative flex-1">
                <textarea 
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none pr-12"
                ></textarea>
                <button className="absolute right-3 top-3 p-2 text-slate-500 hover:text-white transition-colors" title="Attach file">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFeedback = () => (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-center">
      <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
      <h2 className="text-3xl font-black text-white mb-2">Share Your Feedback</h2>
      <p className="text-slate-400 mb-8">How was your Explore Nepal experience? Your insights help us improve.</p>

      <div className="flex justify-center gap-4 mb-8">
        {[1,2,3,4,5].map(rating => (
          <button key={rating} className="w-12 h-12 rounded-full border border-slate-700 bg-slate-950 hover:bg-slate-800 hover:border-yellow-500 flex items-center justify-center group transition-colors">
            <Star className="w-6 h-6 text-slate-500 group-hover:text-yellow-400 transition-colors" />
          </button>
        ))}
      </div>

      <div className="text-left space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">What did you like?</label>
          <textarea rows={2} className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">What could we improve?</label>
          <textarea rows={2} className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"></textarea>
        </div>
      </div>

      <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors">
        Submit Feedback
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      
      {/* Global Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">EN</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight hidden sm:block">Explore Nepal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Destinations</a>
            <a href="#" className="hover:text-white transition-colors">Hotels</a>
            <a href="#" className="text-blue-400 font-bold border-b-2 border-blue-400 py-5">Feedback & Support</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors hidden sm:block">Login</button>
            <button className="md:hidden p-2 text-slate-300"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      {/* Dynamic Hero */}
      {activeView !== 'ticket' && activeView !== 'submit' && (
        <section className="pt-16 pb-12 px-4 sm:px-6 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">How Can We Help?</h1>
            <p className="text-lg text-slate-400 mb-8">Share your feedback, report an issue, or ask us anything about your Nepal travel experience.</p>
            
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 hover:border-slate-500 text-white rounded-2xl pl-14 pr-4 py-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xl"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setActiveView('submit')}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-colors"
              >
                Submit a Query
              </button>
              <button 
                onClick={() => setActiveView('list')}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-colors"
              >
                View My Requests
              </button>
              <button 
                onClick={() => setActiveView('feedback')}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-colors"
              >
                Give Feedback
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'home' && renderHome()}
            {activeView === 'submit' && renderSubmit()}
            {activeView === 'list' && renderTicketList()}
            {activeView === 'ticket' && renderTicketView()}
            {activeView === 'feedback' && renderFeedback()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Request Submitted</h2>
              <p className="text-slate-400 mb-6">Your request has been successfully submitted to the Explore Nepal support team.</p>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-8 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 uppercase font-bold">Ticket ID</span>
                  <span className="text-sm font-black text-blue-400">ENP-REQ-2026-001246</span>
                </div>
                <div className="text-sm text-slate-300">
                  You will receive an email confirmation shortly.
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { setShowSuccessModal(false); setActiveView('home'); }} 
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setShowSuccessModal(false); setActiveView('list'); }} 
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-colors"
                >
                  Track Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <footer className="border-t border-slate-800 bg-slate-950 py-16 mt-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Your Feedback Helps Us Improve Nepal Travel.</h2>
          <p className="text-slate-400 mb-8">Every question, report, and suggestion helps us make Explore Nepal better for travelers and local communities.</p>
          <button onClick={() => { setActiveView('submit'); window.scrollTo(0,0); }} className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors">
            Ask a Question
          </button>
        </div>
      </footer>

    </div>
  );
}
