import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export default function QuickViewModal({ product, isOpen, onClose, navigate }: QuickViewModalProps) {
  const { cart, addToCart, removeFromCart, currency, formatPrice, lang } = useStore();

  if (!isOpen || !product) return null;

  const inCart = cart.some(item => item.product._id === product._id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product._id);
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product._id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 hover:bg-gray-100 dark:hover:bg-black/80 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Gallery */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-50 dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800">
              <img
                src={product.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto scrollbar-none">
                {product.gallery.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-md overflow-hidden border-2 border-white dark:border-zinc-800 shadow-sm flex-shrink-0 bg-white">
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {product.title}
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                {product.description}
              </p>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800/80">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pricing</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-[#008D7F]">
                    {formatPrice(product.price)}
                  </span>
                </div>
                {product.priceTiers && product.priceTiers.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {product.priceTiers.map((tier, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200 dark:border-zinc-700/50 pb-1">
                        <span>{tier.minQty}+ units</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatPrice(tier.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex gap-3">
                  {inCart ? (
                    <button
                      onClick={handleRemoveFromCart}
                      className="flex-1 py-3.5 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-500/20"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {lang === 'EN' ? 'Remove from Cart' : 'কার্ট থেকে মুছুন'}
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 px-4 bg-[#008D7F] text-white hover:bg-[#007b6f] rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {lang === 'EN' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleViewDetails}
                  className="w-full py-3.5 px-4 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-sm font-bold border-2 border-gray-200 dark:border-zinc-800 transition"
                >
                  {lang === 'EN' ? 'View Full Details' : 'বিস্তারিত দেখুন'}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
