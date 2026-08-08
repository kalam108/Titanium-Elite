import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  Play, 
  Image as ImageIcon,
  Video,
  PlusCircle,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MOCK DATA ---
const FILTERS = ['For You', 'Trending', 'Latest', 'Reels', 'Photos', 'Stories', 'Travel Tips', 'Trekking', 'Food', 'Culture'];

const TRENDING_HASHTAGS = ['#VisitNepal', '#ExploreNepal', '#AnnapurnaBaseCamp', '#KathmanduDurbar', '#MomoLovers'];

const MOCK_POSTS = [
  {
    id: 1,
    user: {
      name: 'Sarah Jenkins',
      handle: '@sarahjtravels',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      type: 'Creator',
      verified: true,
    },
    location: 'Annapurna Base Camp, Nepal',
    time: '2 hours ago',
    caption: 'Sunrise over the Annapurna range was absolutely unforgettable. The 5-day trek was challenging but every step was worth this view. Highly recommend traveling with a local guide! #Nepal #Annapurna #Trekking',
    media: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800'
    ],
    mediaType: 'carousel',
    likes: 1240,
    comments: 84,
    saves: 342,
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    user: {
      name: 'Himalayan Guides',
      handle: '@himalayanguides_official',
      avatar: 'https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?w=150',
      type: 'Tourism Business',
      verified: true,
    },
    location: 'Pokhara, Nepal',
    time: '5 hours ago',
    caption: 'Discover the hidden gems of Phewa Lake. Boat tours available daily from 6 AM to 6 PM. Escape the city noise and find your peace here. 📍 #Pokhara #PhewaLake #TravelNepal',
    media: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=800'],
    mediaType: 'image',
    likes: 856,
    comments: 42,
    saves: 156,
    isLiked: true,
    isSaved: false
  },
  {
    id: 3,
    user: {
      name: 'Rabin Shrestha',
      handle: '@rabin_captures',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      type: 'Photographer',
      verified: false,
    },
    location: 'Bhaktapur Durbar Square',
    time: '1 day ago',
    caption: 'Capturing the intricate wood carvings and vibrant culture of Bhaktapur. The heritage here is alive. #Culture #Heritage #Bhaktapur',
    media: ['https://images.unsplash.com/photo-1589311685892-0b1d30327f2f?auto=format&fit=crop&w=800'],
    mediaType: 'image',
    likes: 2105,
    comments: 112,
    saves: 560,
    isLiked: false,
    isSaved: true
  }
];

// --- COMPONENTS ---

// 1. Post Card Component
const PostCard = ({ post, onInteraction }: { post: any, onInteraction: (id: number, type: string) => void }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const renderCaption = (text: string) => {
    return text.split(' ').map((word, i) => {
      if (word.startsWith('#')) {
        return <span key={i} className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">{word} </span>;
      }
      return word + ' ';
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6 shadow-xl"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800" />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-sm">{post.user.name}</h4>
              {post.user.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{post.user.handle}</span>
              <span>•</span>
              <span>{post.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase font-bold rounded-full">
            {post.user.type}
          </span>
          <button className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors">Follow</button>
          <button className="text-slate-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Post Content */}
      <div className="relative group bg-transparent flex items-center justify-center overflow-hidden max-h-[600px]">
        {post.mediaType === 'carousel' ? (
          <>
            <img src={post.media[currentImageIdx]} alt="Post media" className="w-full object-contain max-h-[600px]" />
            {currentImageIdx > 0 && (
              <button 
                onClick={() => setCurrentImageIdx(p => p - 1)}
                className="absolute left-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all hover:bg-black/70"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentImageIdx < post.media.length - 1 && (
              <button 
                onClick={() => setCurrentImageIdx(p => p + 1)}
                className="absolute right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all hover:bg-black/70"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
              {currentImageIdx + 1} / {post.media.length}
            </div>
          </>
        ) : (
          <img src={post.media[0]} alt="Post media" className="w-full object-contain max-h-[600px]" />
        )}
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onInteraction(post.id, 'like')} className="flex items-center gap-1.5 group">
              <Heart className={`w-6 h-6 transition-colors ${post.isLiked ? 'fill-pink-500 text-pink-500' : 'text-slate-400 group-hover:text-pink-400'}`} />
              <span className={`text-sm font-medium ${post.isLiked ? 'text-pink-500' : 'text-slate-400'}`}>{post.likes}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group">
              <MessageCircle className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium text-slate-400">{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 group">
              <Share2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </button>
          </div>
          <button onClick={() => onInteraction(post.id, 'save')} className="group">
            <Bookmark className={`w-6 h-6 transition-colors ${post.isSaved ? 'fill-blue-500 text-blue-500' : 'text-slate-400 group-hover:text-blue-400'}`} />
          </button>
        </div>

        {/* Caption */}
        <div className="mb-2">
          {post.location && (
            <button className="flex items-center gap-1 text-sm font-bold text-teal-400 mb-2 hover:text-teal-300 transition-colors">
              <MapPin className="w-4 h-4" /> {post.location}
            </button>
          )}
          <p className="text-sm text-slate-200 leading-relaxed">
            <span className="font-bold mr-2">{post.user.handle}</span>
            {renderCaption(post.caption)}
          </p>
        </div>

        {/* Comments Section Toggle */}
        {!showComments ? (
          <button onClick={() => setShowComments(true)} className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
            View all {post.comments} comments
          </button>
        ) : (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex gap-2 text-sm">
                <span className="font-bold text-slate-300">@trekker_joe</span>
                <span className="text-slate-400">Absolutely stunning! Added to my bucket list.</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="font-bold text-slate-300">@nepal_lover</span>
                <span className="text-slate-400">Did you use a porter for this route?</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Share your thoughts..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent border border-slate-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-slate-600 transition-colors"
              />
              <button 
                disabled={!commentText.trim()} 
                className="text-blue-500 font-bold text-sm px-2 disabled:text-slate-600 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};


// 2. Create Post Modal (Mock)
const CreatePostModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-transparent/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-lg font-bold text-white">Create New Post</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Media Upload Area */}
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-center mb-6 hover:bg-slate-800/50 transition-colors cursor-pointer group">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <p className="text-white font-bold mb-1">Drag photos and videos here</p>
            <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP, MP4 (Max 50MB)</p>
            <button className="mt-4 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              Select from computer
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Caption</label>
              <textarea 
                rows={4} 
                className="w-full bg-transparent border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell the community about your experience..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Destination Tag</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="e.g. Pokhara, Nepal" className="w-full bg-transparent border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <select className="w-full bg-transparent border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none">
                  <option>Travel Story</option>
                  <option>Travel Tip</option>
                  <option>Adventure</option>
                  <option>Food</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-transparent">
          <button className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-4 h-4" /> AI Assist
          </button>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
            Publish Post
          </button>
        </div>
      </motion.div>
    </div>
  );
};


// 3. Main Page Component
export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState('For You');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleInteraction = (id: number, type: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        if (type === 'like') {
          return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
        }
        if (type === 'save') {
          return { ...p, isSaved: !p.isSaved, saves: p.isSaved ? p.saves - 1 : p.saves + 1 };
        }
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
          >
            Explore Nepal Through <br className="hidden md:block"/> Our Community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Discover real stories, hidden places, unforgettable moments, and travel inspiration from people exploring Nepal.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto mb-10 group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-full p-2 shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search destinations, creators, or hashtags..." 
                className="w-full bg-transparent text-white px-4 py-2 focus:outline-none placeholder:text-slate-500 text-sm md:text-base"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors flex-shrink-0">
                Search
              </button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Share Your Journey
            </button>
            <button className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-white border border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Explore Reels
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content Filters - Sticky on Mobile */}
      <div className="sticky top-16 z-40 bg-transparent/90 backdrop-blur-md border-b border-slate-800">
        <div className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 py-3 overflow-x-auto custom-scrollbar flex items-center gap-2">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                activeFilter === filter 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <main className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Feed Column */}
          <div className="w-full lg:w-2/3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onInteraction={handleInteraction} />
            ))}
            
            {/* Loading Indicator */}
            <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading more stories...</span>
            </div>
          </div>

          {/* Right Sidebar - Trending & Discover */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Trending Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Trending in Nepal
              </h3>
              
              <div className="space-y-4">
                {TRENDING_HASHTAGS.map((tag, i) => (
                  <div key={tag} className="flex flex-col group cursor-pointer">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{tag}</span>
                    <span className="text-xs text-slate-500">{12.4 - i * 2.1}K posts this week</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Creators */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Discover Creators
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Yeti Adventures', handle: '@yeti_adv', type: 'Local Guide', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                  { name: 'Namaste Stays', handle: '@namastestays', type: 'Hotel', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
                  { name: 'Ktm Foodie', handle: '@ktm_eats', type: 'Creator', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }
                ].map(creator => (
                  <div key={creator.handle} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={creator.img} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight hover:underline cursor-pointer">{creator.name}</h4>
                        <span className="text-xs text-slate-500">{creator.type}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-full transition-colors border border-slate-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Community Integration Info */}
            <div className="bg-gradient-to-br from-blue-900/40 to-teal-900/20 border border-blue-500/20 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-blue-300 mb-2">Planning a Trip?</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Connect this community content directly to your budget calculator and hotel bookings via our Destination pages.
              </p>
              <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm font-bold border border-blue-500/30 rounded-xl transition-colors">
                Explore Destinations
              </button>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-medium px-2">
              <a href="#" className="hover:text-slate-300">About</a>
              <a href="#" className="hover:text-slate-300">Help</a>
              <a href="#" className="hover:text-slate-300">Community Guidelines</a>
              <a href="#" className="hover:text-slate-300">Privacy</a>
              <a href="#" className="hover:text-slate-300">Terms</a>
              <span className="w-full mt-2 block">© 2026 Explore Nepal</span>
            </div>

          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="border-t border-slate-800 bg-transparent py-16 mt-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Your Nepal Story Could Inspire Someone.</h2>
          <p className="text-slate-400 mb-8">Share your journey, discover new places, and connect with travelers from around the world.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Share Your Story
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors">
              Explore Nepal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
    </div>
  );
}

// Internal CSS for custom scrollbars added globally or within the component
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
