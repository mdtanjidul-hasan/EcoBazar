import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Search, Moon, Sun, Globe } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, cart, wishlist, logout, searchQuery, setSearchQuery, theme, toggleTheme, lang, setLang, currency, setCurrency } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value && currentPath !== '/shop') {
      navigate('/shop');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Compare', path: '/compare' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Track Order', path: '/track' },
    { label: 'Blog', path: '/blog' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 dark:border-zinc-850 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm transition-all duration-300 w-full">
      
      {/* ================= DESKTOP MODE: TWO DISTINCT ROWS ================= */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: BRAND LOGO + REAL-TIME SEARCH + PREMIUM ACTIONS */}
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#008D7F] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#008D7F]/20 group-hover:bg-[#981849] transition duration-300">
              EB
            </div>
            <div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-[#008D7F] to-[#006e63] bg-clip-text text-transparent group-hover:from-[#981849] group-hover:to-[#791137] transition duration-300">
                EcoBazar
              </span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase -mt-1">
                Luxury Crafts
              </p>
            </div>
          </div>

          {/* Expanded Center Search Input */}
          <div className="flex items-center relative w-72 lg:w-96 mx-4">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4 text-gray-450 dark:text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-gray-55 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-90 w rounded-xl pl-10 pr-8 py-2.5 text-xs focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-450 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Premium Utility & Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-550 dark:text-gray-300 hover:text-[#008D7F] hover:bg-teal-50/50 dark:hover:bg-teal-950/30 rounded-full transition duration-150 cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>

            {/* Currency Switcher */}
            <button
              onClick={() => {
                const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
                const idx = list.indexOf(currency);
                setCurrency(list[(idx + 1) % list.length]);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F] text-xs font-bold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150 cursor-pointer"
              title="Change Display Currency"
            >
              <span className="font-mono">
                {currency === 'BDT' ? '৳ BDT' : 
                 currency === 'USD' ? '$ USD' : 
                 currency === 'GBP' ? '£ GBP' : 
                 currency === 'EUR' ? '€ EUR' : 
                 'A$ AUD'}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                const list: ('EN' | 'AR' | 'FR' | 'ES')[] = ['EN', 'AR', 'FR', 'ES'];
                const idx = list.indexOf(lang);
                setLang(list[(idx + 1) % list.length]);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-655 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F] text-xs font-bold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150 cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-605 animate-spin-slow" />
              <span>
                {lang === 'EN' ? '🇬🇧 EN' : 
                 lang === 'AR' ? '🇸🇦 AR' : 
                 lang === 'FR' ? '🇫🇷 FR' : 
                 '🇪🇸 ES'}
              </span>
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#981849] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition duration-150 cursor-pointer"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#981849] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger Badge */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 rounded-full transition duration-150 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 sm:right-auto sm:top-1 bg-[#008D7F] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="hidden sm:inline text-xs font-semibold text-[#008D7F] dark:text-teal-400 ml-1">
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </>
              )}
            </button>

            {/* Elegant Login / Profile with Motion Animation for Extremely Smooth Clicks */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-150 dark:border-zinc-800 p-1.5 rounded-xl transition duration-150 cursor-pointer mb-[-1px]"
                >
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="hidden lg:inline text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="hidden sm:block w-4 h-4 text-gray-450" />
                </motion.button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 rounded-2xl shadow-xl py-3 z-50 text-left">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-zinc-800 mb-2">
                      <p className="text-xs font-bold text-[#008D7F] capitalize">
                        {user.role} Account
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-250 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-[#008D7F] dark:hover:text-[#008D7F] font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-655 hover:bg-rose-50 dark:hover:bg-rose-955/25 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008D7F] to-[#01776c] text-white hover:opacity-95 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#008D7F]/10 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
            )}

          </div>

        </div>

        {/* ROW 2: CLEAN ACCESSIBLE CATEGORICAL NAV MENU LINKS */}
        <div className="border-t border-gray-100 dark:border-zinc-800/80 py-3.5 flex justify-center items-center">
          <nav className="flex items-center gap-9 lg:gap-11">
            {navLinks.map((link) => {
              const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`font-semibold text-xs tracking-wider uppercase transition-all duration-205 relative py-1 hover:text-[#008D7F] dark:hover:text-[#008D7F] cursor-pointer ${
                    isActive ? 'text-[#008D7F] dark:text-teal-400 font-bold scale-[1.03]' : 'text-gray-555 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activeCatalogUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#008D7F] rounded-full" 
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* ================= MOBILE MODE: HIGHLY COMPACT SINGLE BAR ================= */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#008D7F] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              EB
            </div>
            <span className="font-display text-base font-bold bg-gradient-to-r from-[#008D7F] to-[#006e63] bg-clip-text text-transparent">
              EcoBazar
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#981849] rounded-full"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Cart Trigger Badge */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] rounded-full"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#008D7F] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Avatar / Smooth Tap login */}
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1 border border-gray-100 rounded-full"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-2.5 py-1.5 bg-[#008D7F] text-white rounded-lg text-[10px] font-bold"
              >
                Login
              </motion.button>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-650 dark:text-gray-305 hover:text-[#008D7F]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 py-4 px-6 space-y-4 shadow-inner">
          {/* Mobile Real-time Search */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-450 dark:text-gray-400">
              <Search className="w-4 h-4 text-gray-450 dark:text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-855 rounded-xl pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-4 text-left">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-semibold text-[15px] py-1 transition ${
                    isActive ? 'text-[#008D7F]' : 'text-gray-655 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
          
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-3">
            {/* Mobile Mode Toggle */}
            <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl">
              <span className="text-xs font-semibold text-gray-605 dark:text-gray-355">
                {lang === 'EN' ? 'Dark Mode' : 'ডার্ক মোড'}
              </span>
              <button
                onClick={() => toggleTheme()}
                className="p-1.5 text-gray-500 hover:text-[#008D7F] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition duration-150"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-500" />}
              </button>
            </div>


            
            {!user && (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#008D7F] to-[#01776c] text-white font-semibold text-sm rounded-xl text-center flex items-center justify-center gap-2 shadow"
              >
                <User className="w-4 h-4" />
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
