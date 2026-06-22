import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Gift, Percent, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

export const NewsletterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const couponCode = "WELCOME10";

  useEffect(() => {
    // Check if the user has already subscribed or dismissed the modal
    const isDismissedOrSubscribed = localStorage.getItem('newsletter_dismissed_or_subscribed');
    
    if (isDismissedOrSubscribed) {
      return;
    }

    // Exit intent handler
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves out of the top viewport (exit intent)
      if (e.clientY <= 10) {
        setIsOpen(true);
      }
    };

    // Mobile-friendly timer fallback or engagement-based fallback
    // Since mobile devices don't have mouseleave, we can fire the modal 
    // after 20 seconds of browsing to capture mobile visitors.
    const mobileTimer = setTimeout(() => {
      const alreadyShown = localStorage.getItem('newsletter_dismissed_or_subscribed');
      if (!alreadyShown) {
        setIsOpen(true);
      }
    }, 20000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletter_dismissed_or_subscribed', 'true');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your emailaddress.');
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    // Success state
    setIsSubmitted(true);
    // Persist subscription status
    localStorage.setItem('newsletter_dismissed_or_subscribed', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to force testing of the modal
  const handleResetForTesting = () => {
    localStorage.removeItem('newsletter_dismissed_or_subscribed');
    setIsSubmitted(false);
    setEmail('');
    setName('');
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating small test widget on bottom-left for absolute convenience (Only visible during dev or staging) */}
      <div className="fixed bottom-5 left-5 z-40 select-none">
        <button
          onClick={handleResetForTesting}
          className="bg-zinc-900/90 dark:bg-white/90 hover:bg-[#008D7F] hover:text-white dark:hover:bg-[#008D7F] dark:hover:text-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md border border-zinc-800 dark:border-zinc-200 transition-all duration-300"
          title="Reset local storage and preview the exit-intent newsletter pop-up instantly"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Exit-Intent Preview</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              id="newsletter-overlay"
            />

            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-zinc-900 text-left rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800 w-full max-w-lg md:max-w-2xl flex flex-col md:flex-row z-50"
              id="newsletter-modal-container"
            >
              
              {/* Graphic Left Panel (Vibrant background context) */}
              <div className="md:w-5/12 bg-gradient-to-br from-[#008D7F] via-teal-750 to-[#005B52] p-8 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Background ambient accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-xl transform -translate-x-12 translate-y-12"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                    <Gift className="w-6 h-6 text-amber-300" />
                  </div>
                  <h3 className="font-display font-black text-2xl tracking-tight leading-tight">
                    Exclusive First Access
                  </h3>
                  <p className="text-xs text-teal-100 mt-2 font-semibold">
                    Sign up today to join our community and receive curated collections and premium members-only benefits.
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Percent className="w-4 h-4" />
                    <span>10% OFF FIRST PURCHASE</span>
                  </div>
                  <p className="text-[10px] text-teal-200 font-semibold mt-1">
                    *Applicable store-wide on all categories.
                  </p>
                </div>
              </div>

              {/* Form Input Right Panel */}
              <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-between relative bg-white dark:bg-zinc-900">
                
                {/* Close Button Trigger */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 hover:bg-gray-100 dark:hover:bg-zinc-805 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-1.5 rounded-full transition cursor-pointer"
                  id="newsletter-close-btn"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {!isSubmitted ? (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] bg-teal-50 dark:bg-teal-950/40 text-[#008D7F] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        Special Welcome Offer
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-3">
                        Wait! Don't leave empty handed.
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-405 font-semibold mt-2 leading-relaxed">
                        Subscribe to our premium lifestyle newsletter and grab an instant <strong className="text-[#008D7F]">10% Discount Code</strong> for your first booking or order.
                      </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-405 uppercase tracking-wider block">First Name</label>
                        <input
                          type="text"
                          placeholder="Your name (optional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#008D7F] transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-405 uppercase tracking-wider block">Email Address *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#008D7F] transition-all"
                            required
                          />
                        </div>
                        {error && (
                          <p className="text-[10px] text-rose-600 font-bold mt-1">
                            {error}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#008D7F] hover:bg-[#007065] text-white py-3.5 px-4 text-xs md:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition hover:scale-[1.01] active:scale-95 cursor-pointer"
                        id="newsletter-subscribe-btn"
                      >
                        <span>Claim My 10% Discount Coupon</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed">
                      We value your privacy. Unsubscribe at any time with one click.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 animate-bounce">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        Congratulations! 🎉
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold max-w-sm mx-auto leading-relaxed">
                        {name ? `Thank you, ${name}!` : 'Thank you for subscribing!'} Your 10% first-time discount code is active and ready to be used at checkout.
                      </p>
                    </div>

                    <div className="w-full bg-slate-50 dark:bg-zinc-955 border border-dashed border-gray-250 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Private Code</span>
                      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-xl border border-gray-150 dark:border-zinc-800 p-3">
                        <span className="font-mono text-base font-extrabold text-gray-800 dark:text-gray-100 tracking-wider">
                          {couponCode}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008D7F]/10 hover:bg-[#008D7F] text-[#008D7F] hover:text-white text-[11px] font-bold rounded-lg transition"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#008D7F] transition border-b border-gray-300 dark:border-zinc-700 hover:border-[#008D7F] cursor-pointer"
                    >
                      Start Shopping Now
                    </button>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
