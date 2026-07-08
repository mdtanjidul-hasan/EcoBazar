import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Search, Moon, Sun, Globe, Settings } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, cart, wishlist, logout, searchQuery, setSearchQuery, theme, toggleTheme, lang, setLang, currency, setCurrency } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchEndX - touchStartX < -60) {
        setIsMobileMenuOpen(false);
      }
    }
    setTouchStartX(null);
  };

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

  const [searchType, setSearchType] = useState<'products' | 'suppliers' | 'rfq'>('products');

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 dark:border-zinc-850 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm transition-all duration-300 w-full">
      
      {/* Fix 12: Announcement Bar Mobile & Desktop Responsive */}
      <div className="announcement-bar bg-gradient-to-r from-[#008D7F] to-[#00B894] text-white font-semibold tracking-wider w-full shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Mobile view (< 640px): Infinite Scroll Marquee */}
          <div className="announcement-bar-mobile sm:hidden h-8 overflow-hidden relative">
            <div className="inline-flex items-center h-full animate-marquee-scroll text-[11px] whitespace-nowrap">
              <span className="px-4">🇧🇩 Handcrafted in Dhaka</span>
              <span className="px-4">• Pure Gold & Silver Accents</span>
              <span className="px-4">• 100% Secure Checkout</span>
              <span className="px-4">🇧🇩 Handcrafted in Dhaka</span>
              <span className="px-4">• Pure Gold & Silver Accents</span>
              <span className="px-4">• 100% Secure Checkout</span>
            </div>
          </div>
          {/* Desktop & Tablet view (>= 640px): Standard layout */}
          <div className="announcement-bar-desktop tablet-announcement-bar hidden sm:flex justify-between items-center h-10 px-4 md:h-8 lg:h-10 text-[11px]">
            <div className="flex items-center gap-4">
              <span>🇧🇩 Handcrafted in Dhaka</span>
              <span className="hidden sm:inline">• Pure Gold & Silver Accents</span>
              <span>• 100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/about')}>About Sourcing</span>
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/contact')}>Help Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP MODE: TWO DISTINCT ROWS ================= */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: BRAND LOGO + REAL-TIME SEARCH + PREMIUM ACTIONS */}
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="tablet-logo-container flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="tablet-logo-badge w-10 h-10 rounded-xl bg-[#008D7F] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#008D7F]/20 group-hover:bg-[#00B894] transition duration-300">
              EB
            </div>
            <div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-[#008D7F] to-[#00B894] bg-clip-text text-transparent group-hover:from-[#00B894] group-hover:to-[#008D7F] transition duration-300">
                EcoBazar
              </span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase -mt-1">
                B2B and B2C
              </p>
            </div>
          </div>

          {/* Expanded Center Search Input (Alibaba Style with Products/Suppliers selector) */}
          <div className="tablet-search-container flex items-center relative w-96 lg:w-[480px] mx-4 border-2 border-[#008D7F] rounded-xl overflow-hidden shadow-sm">
            {/* Type selector */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="tablet-search-select bg-gray-50 dark:bg-zinc-900 text-xs font-bold text-gray-700 dark:text-gray-300 px-3 py-2.5 border-r border-gray-200 dark:border-zinc-800 outline-none cursor-pointer hover:bg-gray-100 transition"
            >
              <option value="products">Products</option>
              <option value="suppliers">Suppliers</option>
              <option value="rfq">RFQs</option>
            </select>
            
            <div className="flex-1 flex items-center relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder={
                  searchType === 'products' ? "Search bulk products by keyword..." :
                  searchType === 'suppliers' ? "Search manufacturing suppliers..." :
                  "Search open requests for quote..."
                }
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 pl-10 pr-8 py-2 text-xs focus:outline-none font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-655"
                  title="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Premium Utility & Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Switch */}
            <div className="tablet-theme-container flex items-center gap-2 rounded-xl p-1 transition-all duration-300">
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  theme === 'dark' ? 'bg-[#008D7F]' : 'bg-emerald-200'
                }`}
                title={theme === 'light' ? 'Switch to Obsidian Green Dark' : 'Switch to Sage Green Light'}
              >
                <span
                  className={`pointer-events-none inline-flex h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out items-center justify-center ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {theme === 'light' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3 h-3 text-[#008D7F] -translate-x-[1px]" />
                  )}
                </span>
              </button>
            </div>

            {/* Currency Switcher */}
            <button
              onClick={() => {
                const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
                const idx = list.indexOf(currency);
                setCurrency(list[(idx + 1) % list.length]);
              }}
              className="hidden md:flex tablet-currency-button items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-655 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F] text-xs font-bold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150 cursor-pointer"
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
              className="hidden md:flex tablet-language-button items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-655 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F] text-xs font-bold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150 cursor-pointer"
              title="Change Language"
            >
              <Globe className="tablet-globe-icon w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
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
              className="tablet-wishlist-button relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-full transition duration-150 cursor-pointer"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#008D7F] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger Badge */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
              className="tablet-cart-button relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-full transition duration-150 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 sm:right-auto sm:top-1 bg-[#008D7F] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="tablet-cart-label hidden sm:inline text-xs font-semibold text-[#008D7F] dark:text-emerald-400 ml-1">
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </>
              )}
            </button>

            {/* Elegant Login / Profile with Motion Animation */}
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
                  <ChevronDown className="hidden sm:block w-4 h-4 text-gray-455" />
                </motion.button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 rounded-2xl shadow-xl py-3 z-50 text-left">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-zinc-800 mb-2">
                      <p className="text-xs font-bold text-[#008D7F] capitalize">
                        {user.role} Account (Wholesaler)
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-250 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-[#008D7F] dark:hover:text-[#008D7F] font-semibold flex items-center gap-2 cursor-pointer"
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
                className="tablet-signin-button hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008D7F] to-[#00B894] text-white hover:opacity-95 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#008D7F]/10 cursor-pointer"
              >
                <User className="tablet-signin-icon w-4 h-4" />
                Sign In
              </motion.button>
            )}

          </div>

        </div>

        {/* ROW 2: CLEAN ACCESSIBLE CATEGORICAL NAV MENU LINKS */}
        <div className="tablet-nav-row border-t border-gray-100 dark:border-zinc-800/80 py-3.5 flex justify-center items-center">
          <nav className="tablet-nav-list flex items-center gap-9 lg:gap-11">
            {navLinks.map((link) => {
              const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`tablet-nav-link font-semibold text-xs tracking-wider uppercase transition-all duration-205 relative py-1 hover:text-[#008D7F] dark:hover:text-[#008D7F] cursor-pointer ${
                    isActive ? 'text-[#008D7F] dark:text-emerald-400 font-bold scale-[1.03]' : 'text-gray-555 dark:text-gray-300'
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
      <div className="md:hidden w-full bg-white dark:bg-zinc-950">
        <div className="flex flex-col relative">
          
          {/* Row 1: Brand Logo + Icons */}
          <div className="flex justify-between items-center px-4 h-[60px] border-b border-gray-100 dark:border-zinc-800 relative z-20 bg-white dark:bg-zinc-950">
            {/* Logo left */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-[44px] h-[44px] rounded-lg bg-[#008D7F] flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                EB
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display text-base font-bold bg-gradient-to-r from-[#008D7F] to-[#00B894] bg-clip-text text-transparent leading-none mb-0.5">
                  EcoBazar
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">
                  B2B & B2C
                </span>
              </div>
            </div>

            {/* Right side compact actions */}
            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                style={{ touchAction: 'manipulation' }}
                className="w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#008D7F] rounded-full tap-target-44"
                title="Wishlist"
              >
                <Heart className="w-[22px] h-[22px]" />
              </button>

              {/* Cart */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
                style={{ touchAction: 'manipulation' }}
                className="relative w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#008D7F] rounded-full tap-target-44"
                title="Cart"
              >
                <ShoppingBag className="w-[22px] h-[22px]" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#008D7F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ touchAction: 'manipulation' }}
                className="w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#008D7F] rounded-full tap-target-44"
                title="Menu"
              >
                <Menu className="w-[24px] h-[24px]" />
              </button>
            </div>
          </div>

          {/* Row 2: Search Bar */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex w-full h-[48px] border-2 border-[#008D7F] rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
              {/* Products Dropdown */}
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-[80px] shrink-0 bg-gray-50 dark:bg-zinc-900 text-[16px] font-semibold text-gray-700 dark:text-gray-300 px-2 border-r border-gray-200 dark:border-zinc-800 outline-none h-full focus:outline-none appearance-none cursor-pointer"
              >
                <option value="products">Prod</option>
                <option value="suppliers">Supp</option>
                <option value="rfq">RFQs</option>
              </select>

              {/* Search Input */}
              <div className="flex-1 flex items-center relative h-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-full bg-transparent pl-3 pr-8 text-[16px] focus:outline-none font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 tap-target-44"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={() => navigate('/shop')}
                className="w-[64px] h-full shrink-0 bg-[#008D7F] hover:bg-[#00B894] text-white text-[16px] font-bold flex items-center justify-center transition tap-target-44"
              >
                GO
              </button>
            </div>
          </div>

          {/* Row 3: Horizontal Scroll Nav */}
          <div className="w-full overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-zinc-800 horizontal-scrollable">
            <nav className="flex items-center whitespace-nowrap">
              {navLinks.map((link) => {
                const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    style={{ touchAction: 'manipulation' }}
                    className={`inline-block px-[16px] py-[12px] text-[14px] font-[600] uppercase tracking-wide transition-colors duration-200 shrink-0 ${
                      isActive 
                        ? 'text-[#008D7F] dark:text-emerald-400 border-b-[3px] border-[#008D7F]' 
                        : 'text-gray-600 dark:text-gray-300 border-b-[3px] border-transparent'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

        </div>
      </div>
      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[998] bg-black/50"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="fixed top-0 left-0 h-[100vh] w-[300px] max-w-[80vw] bg-white dark:bg-zinc-950 z-[999] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-[60px] border-b border-gray-100 dark:border-zinc-800 shrink-0">
                <span className="font-display font-bold text-lg bg-gradient-to-r from-[#008D7F] to-[#00B894] bg-clip-text text-transparent">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-[44px] h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full -mr-3"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col px-6 py-4 flex-1">
                {/* Main Navigation Links */}
                <div className="flex flex-col mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</span>
                  {navLinks.map(link => (
                    <button
                      key={link.path}
                      onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                      className="flex items-center h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300 text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2"></div>

                {/* Settings & Extras */}
                <div className="flex flex-col mt-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Settings</span>
                  
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between h-[48px]">
                    <span className="text-[16px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Moon className="w-5 h-5 text-gray-500" /> Dark Mode
                    </span>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none ${
                        theme === 'dark' ? 'bg-[#008D7F]' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-[20px] h-[20px] bg-white rounded-full transition-transform duration-300 ${
                          theme === 'dark' ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Currency Selector */}
                  <button 
                    onClick={() => {
                      const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
                      const idx = list.indexOf(currency);
                      setCurrency(list[(idx + 1) % list.length]);
                    }}
                    className="flex items-center justify-between h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <span>Currency</span>
                    <span className="text-[#008D7F] font-bold">
                      {currency === 'BDT' ? '৳ BDT' : 
                       currency === 'USD' ? '$ USD' : 
                       currency === 'GBP' ? '£ GBP' : 
                       currency === 'EUR' ? '€ EUR' : 
                       'A$ AUD'}
                    </span>
                  </button>

                  {/* Language Selector */}
                  <button 
                    onClick={() => {
                      const list: ('EN' | 'AR' | 'FR' | 'ES')[] = ['EN', 'AR', 'FR', 'ES'];
                      const idx = list.indexOf(lang);
                      setLang(list[(idx + 1) % list.length]);
                    }}
                    className="flex items-center justify-between h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <span>Language</span>
                    <span className="text-[#008D7F] font-bold">
                      {lang === 'EN' ? '🇬🇧 EN' : 
                       lang === 'AR' ? '🇸🇦 AR' : 
                       lang === 'FR' ? '🇫🇷 FR' : 
                       '🇪🇸 ES'}
                    </span>
                  </button>

                  <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4"></div>

                  <button 
                    onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
                    className="flex items-center h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    About Sourcing
                  </button>
                  <button 
                    onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }}
                    className="flex items-center h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    Help Center
                  </button>
                  {!user && (
                    <button 
                      onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      className="flex items-center h-[48px] text-[16px] font-bold text-[#008D7F] text-left"
                    >
                      Sign In
                    </button>
                  )}
                  {user && (
                    <button 
                      onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                      className="flex items-center h-[48px] text-[16px] font-bold text-[#008D7F] text-left"
                    >
                      Dashboard
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
