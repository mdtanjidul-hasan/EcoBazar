import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Form Validation and Submission using FormSubmit.co AJAX endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict client-side validation
    if (!name.trim()) {
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }
    if (!message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/strategyconsumer2026@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          _subject: subject || `EcoBazar Support Enquiry - ${name}`,
          message,
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Contact Form Submission Error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 text-left px-4 max-w-7xl mx-auto relative">
      
      {/* Intro block */}
      <section className="bg-emerald-50/50 dark:bg-zinc-900 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-emerald-100/30 dark:border-zinc-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-block text-[10px] font-black tracking-widest text-[#008D7F] uppercase bg-emerald-100/30 dark:bg-emerald-950/20 px-3 py-1 rounded-full">
            EcoBazar Helpdesk
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Contact Support & Enquiries
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 font-semibold leading-relaxed">
            Have questions regarding boutique custom jewelry, wholesale earring combos, or custom battery support for mini fans? Reach out now.
          </p>
        </div>
      </section>

      {/* Grid container */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-zinc-800 pb-4">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Send an Enquiry</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-0.5">We will respond with full detail within 12 standard business hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest">Full Name *</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  placeholder="e.g. Anika Kabir"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  placeholder="e.g. anika@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest">Subject Reference</label>
              <input
                type="text"
                disabled={isSubmitting}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 disabled:opacity-50"
                placeholder="e.g. Wholesale custom combo bulk orders"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest">Message details *</label>
              <textarea
                required
                rows={5}
                disabled={isSubmitting}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 disabled:opacity-50"
                placeholder="Write your comments, order-enquiry, or complaints..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#008D7F] hover:opacity-90 disabled:opacity-70 text-white font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Dispatching Enquiry...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Enquiry Message
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right column coordinates */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#0b1b1a] text-gray-300 p-6 md:p-8 rounded-3xl space-y-6 shadow">
            <h3 className="font-display font-bold text-lg text-white border-b border-[#1e3432] pb-3">Corporate Coordinates</h3>
            
            <ul className="space-y-5 text-xs font-semibold leading-relaxed">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold mb-0.5">Principal Showroom</p>
                  <span>Sector 11, Uttara, Dhaka-1230, Bangladesh</span>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold mb-0.5">Assistance Hotline</p>
                  <span>+880 1712-345678 (10AM to 8PM BDT)</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold mb-0.5">Inquiry Email</p>
                  <span>strategyconsumer2026@gmail.com</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Google Map embed */}
          <div className="h-64 rounded-3xl border border-gray-150 dark:border-zinc-800 overflow-hidden shadow-inner grayscale contrast-110 relative bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d14592.571408845013!2d90.3804561!3d23.8828941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c46b1479831f%3A0xe7268d8ef53b2ce2!2sUttara%20Sector%2011%2C%20Dhaka%201230!5e0!3m2!1sen!2sbd!4v1718220000000!5m2!1sen!2sbd"
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </section>

      {/* Elegant visual confirmation modal */}
      <AnimatePresence>
        {submitStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubmitStatus(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-3xl shadow-2xl relative max-w-sm w-full text-center z-10"
            >
              {submitStatus === 'success' ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">
                    Enquiry Submitted Successfully
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    Thank you! Your message has been safely delivered to our customer support queue. A representative will get in touch within 12 business hours.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-9 h-9" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">
                    Failed to Send Message
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    Our servers couldn't dispatch the request. Please check your internet connectivity or try again later.
                  </p>
                </>
              )}

              <button
                onClick={() => setSubmitStatus(null)}
                className="w-full py-3 bg-[#008D7F] hover:opacity-95 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition shadow cursor-pointer"
              >
                Dismiss Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
