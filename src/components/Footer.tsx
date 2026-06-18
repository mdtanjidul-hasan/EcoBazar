import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#0b1b1a] text-gray-300 pt-16 pb-8 border-t border-[#1e3432]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
