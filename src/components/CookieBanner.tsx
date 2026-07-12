import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('eb_cookie_consent');
    if (!consent) {
      // Delay display slightly for better user experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('eb_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('eb_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 text-left">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Cookie Consent & Privacy Assurance
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl leading-relaxed">
                  EcoBazar uses cookies to enrich your boutique wholesale browsing experience, measure organic site performance, and remember your display currency preference. By selecting "Accept All", you agree to our standard storage policy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition cursor-pointer"
              >
                Decline
              </button>
              
              <button
                onClick={handleAccept}
                className="px-5 py-2.5 bg-gradient-to-r from-[#008D7F] to-[#00B894] hover:opacity-95 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition shadow-md shadow-[#008D7F]/10 cursor-pointer"
              >
                Accept All
              </button>

              <button
                onClick={() => setIsVisible(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                title="Dismiss Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
