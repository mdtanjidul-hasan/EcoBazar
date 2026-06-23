import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, CheckCircle, Tag, ArrowRight } from 'lucide-react';

interface ToastContainerProps {
  navigate: (path: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ navigate }) => {
  const { toasts, dismissNotificationToast, lang, formatPrice } = useStore();

  return (
    <div 
      id="global-toast-container" 
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isSale = toast.type === 'sale';
          
          return (
            <motion.div
              key={toast._id}
              id={`toast-item-${toast._id}`}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="group relative flex gap-3.5 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md overflow-hidden"
            >
              {/* Decorative side badge color */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                toast.type === 'sale' ? 'bg-[#00B894]' :
                toast.type === 'success' ? 'bg-emerald-500' :
                toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />

              {/* Icon Panel */}
              <div className="flex items-start shrink-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  toast.type === 'sale' ? 'bg-[#00B894]/10 text-[#00B894]' :
                  toast.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                  toast.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                }`}>
                  {toast.type === 'sale' ? (
                    <Tag className="w-4.5 h-4.5 fill-current" />
                  ) : toast.type === 'success' ? (
                    <CheckCircle className="w-4.5 h-4.5" />
                  ) : (
                    <AlertCircle className="w-4.5 h-4.5" />
                  )}
                </div>
              </div>

              {/* Notification Message Details */}
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 leading-snug uppercase tracking-wider flex items-center gap-1.5">
                  {toast.title}
                  {toast.type === 'sale' && (
                    <span className="inline-block animate-pulse w-1.5 h-1.5 bg-[#00B894] rounded-full" />
                  )}
                </h4>
                <p className="text-[11px] font-semibold text-slate-505 dark:text-zinc-400 mt-1 leading-relaxed">
                  {toast.message}
                </p>

                {/* Inline Product Interaction Card (Specifically for Sale/Price Drop alert on Wishlisted products) */}
                {toast.product && (
                  <div 
                    onClick={() => {
                      if (toast.product) {
                        navigate(`/product/${toast.product._id}`);
                        dismissNotificationToast(toast._id);
                      }
                    }}
                    className="mt-3 flex items-center gap-2.5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/80 p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-all group/btn"
                  >
                    <img 
                      src={toast.product.gallery?.[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100'} 
                      alt="" 
                      className="w-9 h-9 object-cover rounded-lg border border-slate-205 dark:border-zinc-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 truncate">
                        {toast.product.title}
                      </div>
                      <div className="text-[10px] flex items-center gap-1.5 font-extrabold mt-0.5">
                        {toast.priceDropDetails ? (
                          <>
                            <span className="text-slate-400 line-through">
                              {formatPrice(toast.priceDropDetails.oldPrice)}
                            </span>
                            <span className="text-[#00B894] ">
                              {formatPrice(toast.priceDropDetails.newPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500">
                            {formatPrice(toast.product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-400 group-hover/btn:text-[#00B894] group-hover/btn:border-[#00B894] transition shadow-sm shrink-0">
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button Trigger */}
              <button
                onClick={() => dismissNotificationToast(toast._id)}
                id={`toast-close-${toast._id}`}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-650 dark:hover:text-zinc-200 transition"
                type="button"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Auto dismissal line animation indicator on bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 dark:bg-zinc-800">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className={`h-full ${
                    toast.type === 'sale' ? 'bg-[#00B894]' :
                    toast.type === 'success' ? 'bg-emerald-500' :
                    toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
