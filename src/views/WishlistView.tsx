import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ChevronRight, 
  ArrowRight, 
  ShoppingBag, 
  Star,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

interface WishlistViewProps {
  navigate: (path: string) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ navigate }) => {
  const { 
    wishlist, 
    removeFromWishlist, 
    addToCart, 
    formatPrice, 
    lang 
  } = useStore();

  const handleMoveToCart = (p: Product) => {
    addToCart(p, 1);
    removeFromWishlist(p._id);
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm(
      lang === 'EN' 
        ? 'Are you sure you want to remove all items from your wishlist?' 
        : 'আপনি কি আপনার উইশলিস্টের সব আইটেম মুছে ফেলতে চান?'
    );
    if (!confirmClear) return;
    
    // Remove all items sequentially
    wishlist.forEach(item => removeFromWishlist(item._id));
  };

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Visual Elegant Jumbotron Header */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#981849_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] bg-rose-50 dark:bg-rose-950/30 text-[#981849] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {lang === 'EN' ? 'My Collections' : 'আমার সংগ্রহসমূহ'}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {lang === 'EN' ? 'Saved Wishlist' : 'প্রিয় তালিকা'}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed max-w-xl">
              {lang === 'EN' 
                ? 'Review and manage your curated handcrafted items. Move them to your shopping cart to complete your premium craft purchase.' 
                : 'আপনার প্রিয় কারুশিল্পের পণ্যগুলো পরিচালনা করুন। আপনার প্রিমিয়াম কারুশীল ক্রয়ের জন্য ডোর টু ডোর কার্টে স্থানান্তর করুন।'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 hover:border-[#008D7F] text-gray-650 dark:text-gray-300 dark:hover:text-[#008D7F] text-xs font-bold rounded-xl transition flex-shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              {lang === 'EN' ? 'Continue Shopping' : 'আরো কেনাকাটা করুন'}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {wishlist.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-5 py-3 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition flex-shrink-0 cursor-pointer"
              >
                {lang === 'EN' ? 'Clear All Items' : 'সব আইটেম বাদ দিন'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid Showcase of Wishlist Items */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-6 max-w-lg mx-auto shadow-sm"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-[#981849] rounded-full flex items-center justify-center mx-auto text-2xl relative">
                <Heart className="w-8 h-8 fill-currentColor" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping"></span>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-lg text-gray-950 dark:text-gray-100">
                  {lang === 'EN' ? 'Your Wishlist is Empty' : 'আপনার উইশলিস্ট খালি রয়েছে'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold max-w-xs mx-auto leading-relaxed">
                  {lang === 'EN' 
                    ? "See something you love in our boutique gallery? Tap the heart icon on any craft product to preserve it here." 
                    : "আমাদের চমৎকার গ্যালারিতে কি কোনো কারুশিল্প পণ্য পছন্দ হয়েছে? তা এখানে রাখতে যেকোনো পণ্যে থাকা হার্ট বাটনটিতে চাপুন।"}
                </p>
              </div>
              
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#008D7F] to-[#017267] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#008D7F]/10 hover:opacity-95 hover:scale-[1.01] transition duration-200 cursor-pointer"
              >
                <span>{lang === 'EN' ? 'Browse Exquisite Catalog' : 'আমাদের ক্যাটালগ দেখুন'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((p) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  
                  {/* Remove Button Hover Accent */}
                  <button
                    onClick={() => removeFromWishlist(p._id)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 dark:bg-zinc-950/85 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-400 hover:text-rose-600 dark:text-gray-500 shadow-md backdrop-blur-sm z-10 transition duration-200 cursor-pointer"
                    title={lang === 'EN' ? 'Remove from Wishlist' : 'উইশলিস্ট থেকে বাদ দিন'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Rating Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-950/85 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full shadow-sm z-10 flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] sm:text-xs font-black">{p.rating} / 5</span>
                  </div>

                  {/* Product Image Stage */}
                  <div 
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="h-48 overflow-hidden bg-gray-50 dark:bg-zinc-950 relative cursor-pointer"
                  >
                    <img 
                      src={p.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=350'} 
                      alt={p.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    />
                  </div>

                  {/* Content space */}
                  <div className="p-5 flex-1 flex flex-col text-left space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded uppercase tracking-wider">
                        {p.category}
                      </span>
                      <h3 
                        onClick={() => navigate(`/product/${p._id}`)}
                        className="font-display font-extrabold text-sm text-gray-850 dark:text-gray-150 line-clamp-2 hover:text-[#008D7F] dark:hover:text-teal-400 cursor-pointer transition pt-1"
                      >
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed font-semibold flex-1">
                      {p.description}
                    </p>

                    {/* Pricing, stock levels and Actions block */}
                    <div className="pt-2.5 border-t border-gray-50 dark:border-zinc-800/60 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide leading-none">{lang === 'EN' ? 'Selling Price' : 'বিক্রয় মূল্য'}</p>
                          <span className="font-display font-black text-base text-[#008D7F] dark:text-teal-400 mt-1 block">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide leading-none">{lang === 'EN' ? 'Stock status' : 'স্টকের খবর'}</p>
                          <span className={`text-[10px] font-extrabold mt-1 block ${
                            p.quantity > 0 ? 'text-emerald-600' : 'text-rose-500'
                          }`}>
                            {p.quantity > 0 
                              ? `${p.quantity} BDT ${lang === 'EN' ? 'In Stock' : 'টি স্টকে আছে'}` 
                              : (lang === 'EN' ? 'Out of stock' : 'স্টক শেষ')}
                          </span>
                        </div>
                      </div>

                      {/* Direct move button */}
                      <button
                        onClick={() => handleMoveToCart(p)}
                        disabled={p.quantity <= 0}
                        className={`w-full py-3 px-4 ${
                          p.quantity > 0 
                            ? 'bg-[#008D7F] hover:bg-[#007065] text-white cursor-pointer hover:scale-[1.01]' 
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        } text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-95`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{lang === 'EN' ? 'Move to Cart' : 'কার্ট-এ আনুন'}</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
