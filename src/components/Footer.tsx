import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { lang } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setMessage({
        text: lang === 'EN' ? 'Please supply a valid email address.' : 'অনুগ্রহ করে একটি সঠিক ইমেল প্রবেশ করান।',
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulate backend response
    setTimeout(() => {
      try {
        const storedSubs = localStorage.getItem('eb_newsletter_subscribers');
        let subscribersList: string[] = [];
        if (storedSubs) {
          subscribersList = JSON.parse(storedSubs);
        }

        if (subscribersList.includes(emailInput.trim().toLowerCase())) {
          setMessage({
            text: lang === 'EN' ? 'Thank you! This email is already subscribed.' : 'ধন্যবাদ! এই ইমেলটি ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে।',
            isError: false,
          });
          setIsSubmitting(false);
          setEmailInput('');
          return;
        }

        subscribersList.push(emailInput.trim().toLowerCase());
        localStorage.setItem('eb_newsletter_subscribers', JSON.stringify(subscribersList));

        setMessage({
          text: lang === 'EN' ? 'Success! You have subscribed to the EcoBazar newsletter.' : 'সফল হয়েছে! আপনি ইকোবাজার নিউজলেটারে সাবস্ক্রাইব করেছেন।',
          isError: false,
        });
        setEmailInput('');
      } catch (err) {
        setMessage({
          text: lang === 'EN' ? 'Failed to process subscription. Please try again.' : 'সাবস্ক্রাইব করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          isError: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <footer className="bg-[#0b1b1a] text-gray-300 pt-16 pb-8 border-t border-[#1e3432]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Block */}
        <div className="pb-12 mb-12 border-b border-teal-950/40 flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-br from-[#0c201e] to-[#081514] p-8 md:p-10 rounded-3xl border border-teal-900/45 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#008D7F]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 text-center lg:text-left max-w-xl z-10">
            <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-tight">
              {lang === 'EN' ? 'Join the EcoBazar Club' : 'ইকোবাজার ক্লাবে যোগ দিন'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-semibold">
              {lang === 'EN' 
                ? 'Subscribe to our newsletter to receive updates on new arrivals, curated artisan stories, and exclusive subscriber-only rewards.' 
                : 'আমাদের নিউজলেটারে যুক্ত হয়ে নতুন কালেকশন, ঐতিহ্যবাহী কারিগরদের গল্প এবং আকর্ষণীয় প্রচারণামূলক অফারের নিয়মিত আপডেট ও পুরস্কার পান।'}
            </p>
          </div>

          <div className="w-full lg:w-auto max-w-md shrink-0 z-10 space-y-3">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={lang === 'EN' ? 'Enter your email address' : 'আপনার ইমেল ঠিকানা লিখুন'}
                className="w-full sm:min-w-[265px] bg-[#0c1e1c] border border-teal-800/40 focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] text-white px-4 py-3 rounded-2xl text-xs placeholder-gray-500 outline-none transition font-sans font-bold shadow-inner"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#008D7F] hover:bg-[#981849] active:scale-95 text-white font-extrabold text-xs rounded-2xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow hover:shadow-lg disabled:opacity-60"
              >
                <span>{lang === 'EN' ? 'Subscribe' : 'সাবস্ক্রাইব'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {message && (
              <p className={`text-xs font-black uppercase tracking-wider text-center lg:text-left ${
                message.isError ? 'text-rose-400' : 'text-teal-400'
              }`}>
                {message.isError ? '❌ ' : '✨ '} {message.text}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-[#008D7F] flex items-center justify-center text-white font-bold text-xl shadow-md">
                EB
              </div>
              <div>
                <span className="font-display text-xl font-bold bg-gradient-to-r from-[#008D7F] to-[#01b5a3] bg-clip-text text-transparent">
                  EcoBazar
                </span>
                <p className="text-[10px] text-teal-500 font-medium tracking-widest uppercase -mt-1">
                  Luxury Crafts
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crafting premium and lightweight jewelry sets, bespoke earrings, and luxury lifestyle accessories. Curating timeless beauty with exceptional reliability and service.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-[#122b29] hover:bg-[#008D7F] hover:text-white rounded-lg transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#122b29] hover:bg-[#008D7F] hover:text-white rounded-lg transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#122b29] hover:bg-[#008D7F] hover:text-white rounded-lg transition-colors duration-200">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white tracking-wider text-sm uppercase mb-5 border-l-2 border-[#008D7F] pl-3">
              Explore Collections
            </h3>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  Exquisite Earrings
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  Jewelry Matching Sets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  Kids Jewelry sets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  Premium Mini Hand Fans
                </button>
              </li>
            </ul>
          </div>

          {/* Information & Support */}
          <div>
            <h3 className="font-display font-semibold text-white tracking-wider text-sm uppercase mb-5 border-l-2 border-[#008D7F] pl-3">
              Useful Information
            </h3>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About Our Brand
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">
                  Our Stories & Blogs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">
                  Customer Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display font-semibold text-white tracking-wider text-sm uppercase mb-5 border-l-2 border-[#008D7F] pl-3">
              Contact us
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#008D7F] shrink-0 mt-0.5" />
                <span>Sector 11, Uttara, Dhaka-1230, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#008D7F] shrink-0" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#008D7F] shrink-0" />
                <span>support@ecobazar.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-gray-500 gap-4">
          <p>© 2026 EcoBazar Luxury Crafts. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};
