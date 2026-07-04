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
          <div className="announcement-bar-desktop hidden sm:flex justify-between items-center h-10 px-4 md:h-8 lg:h-10 text-[11px]">
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
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#008D7F] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#008D7F]/20 group-hover:bg-[#00B894] transition duration-300">
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
          <div className="flex items-center relative w-96 lg:w-[480px] mx-4 border-2 border-[#008D7F] rounded-xl overflow-hidden shadow-sm">
            {/* Type selector */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="bg-gray-50 dark:bg-zinc-900 text-xs font-bold text-gray-700 dark:text-gray-300 px-3 py-2.5 border-r border-gray-200 dark:border-zinc-800 outline-none cursor-pointer hover:bg-gray-100 transition"
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  title="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#008D7F] hover:bg-[#00B894] text-white text-xs font-bold px-5 py-2.5 transition"
            >
              Search
            </button>
          </div>

          {/* Premium Utility & Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Switch */}
            <div className="flex items-center gap-2 border border-gray-150 dark:border-zinc-800 rounded-xl p-1 bg-gray-50 dark:bg-zinc-900 shadow-sm transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 pl-1.5 hidden lg:inline select-none">
                {theme === 'light' ? 'Sage Light' : 'Obsidian Dark'}
              </span>
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
              <Globe className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
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
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-full transition duration-150 cursor-pointer"
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
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-full transition duration-150 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 sm:right-auto sm:top-1 bg-[#008D7F] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="hidden sm:inline text-xs font-semibold text-[#008D7F] dark:text-emerald-400 ml-1">
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
                  <ChevronDown className="hidden sm:block w-4 h-4 text-gray-450" />
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
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#008D7F] to-[#00B894] text-white hover:opacity-95 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-[#008D7F]/10 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Sign In
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
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col py-3 space-y-3">
          
          {/* Row 2: Main navbar (EB logo left, only cart + login + hamburger right) */}
          <div className="flex justify-between items-center h-12">
            {/* Logo left */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-lg bg-[#008D7F] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                EB
              </div>
              <div>
                <span className="font-display text-base font-bold bg-gradient-to-r from-[#008D7F] to-[#00B894] bg-clip-text text-transparent">
                  EcoBazar
                </span>
                <p className="text-[8px] text-gray-450 dark:text-gray-500 font-bold uppercase tracking-wider -mt-1">
                  B2B & B2C
                </p>
              </div>
            </div>

            {/* Right side compact actions */}
            <div className="flex items-center gap-1">
              {/* Cart Trigger Badge (Fix 2: 22px icon, 44px container) */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
                className="relative w-11 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#008D7F] rounded-full hover:bg-gray-50 dark:hover:bg-zinc-900 transition tap-target-44"
                title="Cart"
              >
                <ShoppingBag className="w-5.5 h-5.5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#008D7F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar or Login */}
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-11 h-11 flex items-center justify-center border border-gray-100 dark:border-zinc-800 rounded-full bg-slate-50 dark:bg-zinc-900 hover:bg-gray-100 transition tap-target-44"
                  title="Dashboard"
                >
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 h-11 flex items-center justify-center bg-gradient-to-r from-[#008D7F] to-[#00B894] text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer tap-target-44"
                >
                  Sign In
                </button>
              )}

              {/* Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center text-gray-655 dark:text-gray-300 hover:text-[#008D7F] hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-full transition tap-target-44"
                title="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search bar below logo: full width, height 48px, font 15px (Fix 4) */}
          <div className="w-full">
            <div className="flex items-center relative w-full border-2 border-[#008D7F] rounded-lg overflow-hidden bg-white dark:bg-zinc-950 h-[48px] shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5 text-gray-450" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent pl-11 pr-10 py-3 text-[15px] focus:outline-none font-semibold text-gray-850 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-20 pr-2 flex items-center text-gray-400 hover:text-gray-600 tap-target-44"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#008D7F] hover:bg-[#00B894] text-white text-[14px] font-bold px-4 h-full uppercase tracking-wider transition w-[80px] shrink-0"
              >
                GO
              </button>
            </div>
          </div>

          {/* Row 3: Navigation Links horizontal scroll (Fix 3) */}
          <div className="w-full overflow-x-auto scrollbar-none whitespace-nowrap border-t border-b border-gray-100 dark:border-zinc-800/80 py-1.5">
            <nav className="flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`inline-block px-4 py-3 text-[14px] font-semibold tracking-wide uppercase transition-all duration-200 shrink-0 ${
                      isActive 
                        ? 'text-[#008D7F] dark:text-emerald-400 border-b-[3px] border-[#008D7F] font-bold' 
                        : 'text-gray-600 dark:text-gray-300'
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

      {/* Mobile Hamburger Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 py-4 px-6 space-y-4 shadow-inner">
          <nav className="flex flex-col gap-2.5 text-left">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-semibold text-[15px] py-2 px-3 rounded-lg transition h-11 flex items-center ${
                    isActive ? 'text-[#008D7F] bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-gray-655 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
          
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-3">
            {/* Obsidian Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl h-12">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {theme === 'light' ? 'Sage Light' : 'Obsidian Dark'}
              </span>
              <button
                onClick={() => toggleTheme()}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none bg-emerald-200 dark:bg-[#008D7F] tap-target-44"
              >
                <span
                  className={`pointer-events-none inline-flex h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out items-center justify-center ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {theme === 'light' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3 h-3 text-[#008D7F]" />
                  )}
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl h-12">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Display Currency</span>
              <button
                onClick={() => {
                  const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
                  const idx = list.indexOf(currency);
                  setCurrency(list[(idx + 1) % list.length]);
                }}
                className="text-xs font-mono font-black text-[#008D7F] hover:underline px-3 py-1 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-md"
              >
                {currency === 'BDT' ? '৳ BDT' : 
                 currency === 'USD' ? '$ USD' : 
                 currency === 'GBP' ? '£ GBP' : 
                 currency === 'EUR' ? '€ EUR' : 
                 'A$ AUD'}
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl h-12">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Language</span>
              <button
                onClick={() => {
                  const list: ('EN' | 'AR' | 'FR' | 'ES')[] = ['EN', 'AR', 'FR', 'ES'];
                  const idx = list.indexOf(lang);
                  setLang(list[(idx + 1) % list.length]);
                }}
                className="text-xs font-bold text-[#008D7F] flex items-center gap-1.5 hover:underline px-3 py-1 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-md"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {lang === 'EN' ? '🇬🇧 EN' : 
                   lang === 'AR' ? '🇸🇦 AR' : 
                   lang === 'FR' ? '🇫🇷 FR' : 
                   '🇪🇸 ES'}
                </span>
              </button>
            </div>

            {/* Sourcing Links */}
            <div className="flex items-center justify-around py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 border-t border-gray-100 dark:border-zinc-850">
              <span className="hover:underline cursor-pointer py-2 px-3" onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}>About Sourcing</span>
              <span className="hover:underline cursor-pointer py-2 px-3" onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }}>Help Center</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
