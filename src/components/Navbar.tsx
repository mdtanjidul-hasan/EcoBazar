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
    { label: 'Track Order', path: '/track-order' },
    { label: 'Blog', path: '/blog' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const [searchType, setSearchType] = useState<'products' | 'suppliers' | 'rfq'>('products');

  return (
    <header 
      className="sticky top-0 z-[1000] border-b border-gray-100 dark:border-zinc-850 bg-white/95 backdrop-blur-[20px] shadow-sm transition-all duration-300 w-full"
      style={{ backgroundColor: theme === 'dark' ? 'rgba(10, 10, 10, 0.95)' : undefined }}
    >
      
      {/* Announcement Bar at the very top */}
      <div className="h-9 w-full bg-[#1ABC9C] text-white flex items-center justify-between text-[12px] font-semibold select-none overflow-hidden shrink-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {/* Mobile View: Marquee (< 768px) */}
        <div className="md:hidden w-full h-full flex items-center overflow-hidden relative">
          <div className="animate-marquee-scroll flex items-center whitespace-nowrap">
            <div className="flex items-center gap-8 px-4 shrink-0">
              <span>Handcrafted in Dhaka</span>
              <span>•</span>
              <span>Pure Gold and Silver Accents</span>
              <span>•</span>
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0">
              <span>Handcrafted in Dhaka</span>
              <span>•</span>
              <span>Pure Gold and Silver Accents</span>
              <span>•</span>
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0">
              <span>Handcrafted in Dhaka</span>
              <span>•</span>
              <span>Pure Gold and Silver Accents</span>
              <span>•</span>
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0">
              <span>Handcrafted in Dhaka</span>
              <span>•</span>
              <span>Pure Gold and Silver Accents</span>
              <span>•</span>
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Desktop View: Centered row with bullets and right actions (>= 768px) */}
        <div className="hidden md:flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Centered static bullets */}
          <div className="flex-1 flex items-center justify-center gap-6 text-center">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" /> Handcrafted in Dhaka
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" /> Pure Gold and Silver Accents
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" /> 100% Secure Checkout
            </span>
          </div>

          {/* Right Sourcing & Help links */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => navigate('/about')} 
              className="hover:underline transition bg-transparent border-0 text-white text-[12px] font-semibold cursor-pointer"
            >
              About Sourcing
            </button>
            <span className="text-white/40">|</span>
            <button 
              onClick={() => navigate('/contact')} 
              className="hover:underline transition bg-transparent border-0 text-white text-[12px] font-semibold cursor-pointer"
            >
              Help Center
            </button>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP MODE: TWO DISTINCT ROWS ================= */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: BRAND LOGO + REAL-TIME SEARCH + PREMIUM ACTIONS */}
        <div className="flex justify-between items-center h-20 gap-4 flex-nowrap">
          
          {/* Logo Brand Container (Never wraps or shrinks) */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer select-none flex-nowrap shrink-0"
            style={{ minWidth: '120px' }}
          >
            {/* EB logo badge (44x44px, border-radius 10px, background #1ABC9C, bold 18px Montserrat 800) */}
            <div 
              className="flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#1ABC9C',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '18px',
                fontWeight: 800
              }}
            >
              EB
            </div>
            {/* Beside it: "EcoBazar" and "B2B AND B2C" stacked vertically with zero gap */}
            <div className="flex flex-col justify-center leading-none" style={{ gap: '0px' }}>
              <span 
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1ABC9C',
                  lineHeight: '1'
                }}
              >
                EcoBazar
              </span>
              <span 
                className="uppercase text-gray-400 dark:text-white/50"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '2px',
                  lineHeight: '1',
                  marginTop: '1px'
                }}
              >
                B2B AND B2C
              </span>
            </div>
          </div>

          {/* Center Search Input (height 44px, border-radius 8px, 1.5px solid #1ABC9C) */}
          <div 
            className="flex items-center relative overflow-hidden bg-white dark:bg-zinc-900"
            style={{
              flex: '1',
              minWidth: '200px',
              maxWidth: '500px',
              height: '44px',
              borderRadius: '8px',
              border: '1.5px solid #1ABC9C'
            }}
          >
            {/* Dropdown Selector (110px wide with 14px Montserrat 500 text) */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 outline-none h-full focus:outline-none cursor-pointer px-2"
              style={{
                width: '110px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                flexShrink: 0,
                borderRight: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="products">Products</option>
              <option value="suppliers">Suppliers</option>
              <option value="rfq">RFQs</option>
            </select>
            
            {/* Input area (15px Montserrat 400, placeholder "Search bulk products by keyword...", left padding 40px) */}
            <div className="flex-1 flex items-center relative h-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search bulk products by keyword..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-full bg-transparent pr-8 focus:outline-none text-gray-800 dark:text-gray-200 border-0 shadow-none outline-none ring-0"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '15px',
                  fontWeight: 400,
                  paddingLeft: '40px'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-655 border-0 bg-transparent cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Button (90px wide, teal bg #1ABC9C, 14px Montserrat 700 white text) */}
            <button
              onClick={() => navigate('/shop')}
              className="h-full text-white flex items-center justify-center transition-colors hover:opacity-90 shrink-0 border-0 cursor-pointer"
              style={{
                width: '90px',
                backgroundColor: '#1ABC9C',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              Search
            </button>
          </div>

          {/* Premium Utility & Navigation Controls (Strict order, 44x44px min touch target, 10px padding) */}
          <div className="flex items-center gap-1 flex-nowrap">
            
            {/* 1. Dark Mode Toggle Switch (52x28px switcher in 44x44px target) */}
            <div 
              className="flex items-center justify-center shrink-0"
              style={{ width: '44px', height: '44px', padding: '10px' }}
            >
              <button
                onClick={toggleTheme}
                className="relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none"
                style={{
                  width: '52px',
                  height: '28px',
                  backgroundColor: theme === 'dark' ? '#1ABC9C' : '#E2E8F0'
                }}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                <span
                  className="pointer-events-none inline-flex transform rounded-full bg-white shadow-md transition duration-300 ease-in-out items-center justify-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0px)'
                  }}
                >
                  {theme === 'light' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-[#1ABC9C]" />
                  )}
                </span>
              </button>
            </div>

            {/* 2. Currency Selector ("৳ BDT" in 13px Montserrat 600, teal #1ABC9C, 60px width, 44x44px target) */}
            <button
              onClick={() => {
                const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
                const idx = list.indexOf(currency);
                setCurrency(list[(idx + 1) % list.length]);
              }}
              className="flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition duration-150 cursor-pointer border-0 bg-transparent text-center select-none"
              style={{
                width: '60px',
                minWidth: '60px',
                height: '44px',
                padding: '10px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                color: '#1ABC9C'
              }}
              title="Change Currency"
            >
              <span className="truncate">
                {currency === 'BDT' ? '৳ BDT' : 
                 currency === 'USD' ? '$ USD' : 
                 currency === 'GBP' ? '£ GBP' : 
                 currency === 'EUR' ? '€ EUR' : 
                 'A$ AUD'}
              </span>
            </button>

            {/* 3. Language Selector (globe icon + "GB EN" in 13px Montserrat 500, 70px width, 44x44px target) */}
            <button
              onClick={() => {
                const list: ('EN' | 'AR' | 'FR' | 'ES')[] = ['EN', 'AR', 'FR', 'ES'];
                const idx = list.indexOf(lang);
                setLang(list[(idx + 1) % list.length]);
              }}
              className="flex items-center justify-center gap-1.5 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition duration-150 cursor-pointer border-0 bg-transparent text-gray-700 dark:text-gray-300 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C]"
              style={{
                width: '70px',
                minWidth: '70px',
                height: '44px',
                padding: '10px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px',
                fontWeight: 500
              }}
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#1ABC9C] shrink-0" />
              <span className="truncate">
                {lang === 'EN' ? 'GB EN' : 
                 lang === 'AR' ? 'SA AR' : 
                 lang === 'FR' ? 'FR FR' : 
                 'ES ES'}
              </span>
            </button>

            {/* 4. Wishlist heart icon in 40x40px transparent circle with 44x44px target */}
            <div 
              className="flex items-center justify-center shrink-0"
              style={{ width: '44px', height: '44px', padding: '10px' }}
            >
              <button
                onClick={() => navigate('/wishlist')}
                className="flex items-center justify-center rounded-full transition duration-150 cursor-pointer bg-transparent border-0 text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C] hover:bg-gray-100 dark:hover:bg-zinc-900"
                style={{
                  width: '40px',
                  height: '40px',
                  padding: '0px'
                }}
                title="Wishlist"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 stroke-[2]" />
                  {wishlist.length > 0 && (
                    <span 
                      className="absolute -top-1.5 -right-1.5 text-white rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: '#1ABC9C',
                        fontSize: '11px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        width: '16px',
                        height: '16px'
                      }}
                    >
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* 5. Cart bag icon in 40x40px transparent circle with a teal badge showing cart count in 11px Montserrat 700 white with 44x44px target */}
            <div 
              className="flex items-center justify-center shrink-0"
              style={{ width: '44px', height: '44px', padding: '10px' }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
                className="flex items-center justify-center rounded-full transition duration-150 cursor-pointer bg-transparent border-0 text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C] hover:bg-gray-100 dark:hover:bg-zinc-900"
                style={{
                  width: '40px',
                  height: '40px',
                  padding: '0px'
                }}
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 stroke-[2]" />
                  {cartCount > 0 && (
                    <span 
                      className="absolute -top-1.5 -right-1.5 text-white rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: '#1ABC9C',
                        fontSize: '11px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        width: '16px',
                        height: '16px'
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* 6. SIGN IN / Profile button (100px wide, 44px tall, teal bg #1ABC9C, 14px Montserrat 700 white text with user icon) */}
            <div className="relative flex items-center justify-center shrink-0" style={{ width: '100px', height: '44px' }}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center justify-center gap-1.5 text-white hover:opacity-90 rounded-lg transition duration-150 cursor-pointer border-0"
                    style={{
                      width: '100px',
                      height: '44px',
                      backgroundColor: '#1ABC9C',
                      borderRadius: '8px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700
                    }}
                  >
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover border border-white shrink-0"
                    />
                    <span className="truncate max-w-[50px] uppercase font-bold text-[10px]">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xl py-3 z-[1050] text-left">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 mb-2">
                        <p className="text-[10px] font-bold text-[#1ABC9C] uppercase tracking-wider">
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
                        className="w-full text-left px-4 py-2 text-sm text-gray-750 dark:text-gray-250 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C] font-semibold flex items-center gap-2 cursor-pointer border-0 bg-transparent"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#1ABC9C]" />
                        Dashboard
                      </button>
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/20 font-semibold flex items-center gap-2 cursor-pointer border-0 bg-transparent"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-1.5 text-white hover:opacity-90 rounded-lg transition duration-150 cursor-pointer border-0"
                  style={{
                    width: '100px',
                    height: '44px',
                    backgroundColor: '#1ABC9C',
                    borderRadius: '8px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '13px',
                    fontWeight: 700
                  }}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="uppercase text-[11px] tracking-tight">Sign In</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* ROW 2: Navigation Links (HOME, SHOP, etc. all in 14px Montserrat 600 uppercase, letter-spacing 0.5px, 16px horizontal padding) */}
        <div className="border-t border-gray-100 dark:border-zinc-800/80 flex justify-center items-center h-12">
          <nav className="flex items-center justify-center" style={{ gap: '0px' }}>
            {navLinks.map((link) => {
              const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="relative uppercase flex items-center h-12 transition-all duration-200 cursor-pointer border-0 bg-transparent select-none shrink-0"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    paddingLeft: '16px',
                    paddingRight: '16px'
                  }}
                >
                  <span className={isActive ? 'text-[#1ABC9C] font-bold' : 'text-gray-700 dark:text-gray-200 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C]'}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeCatalogUnderline"
                      className="absolute bottom-1 left-4 right-4 bg-[#1ABC9C]"
                      style={{
                        height: '3px',
                        borderRadius: '9999px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ================= MOBILE MODE (< 640px) ================= */}
      <div className="block sm:hidden w-full bg-white dark:bg-[#0A0A0A]">
        <div className="flex flex-col relative">
          {/* Row 1 */}
          <div className="flex justify-between items-center px-4 h-[60px] border-b border-gray-100 dark:border-zinc-800">
            {/* Left: EB badge & EcoBazar text */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            >
              <div 
                className="flex items-center justify-center text-white shadow-sm shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#1ABC9C',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '18px',
                  fontWeight: 800
                }}
              >
                EB
              </div>
              <span 
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1ABC9C'
                }}
              >
                EcoBazar
              </span>
            </div>

            {/* Right: Wishlist, Cart, Hamburger Menu */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                className="w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* Cart with Badge */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
                className="relative w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span 
                    className="absolute top-1.5 right-1.5 text-white rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#1ABC9C',
                      fontSize: '10px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      width: '16px',
                      height: '16px'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Menu Icon */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-[44px] h-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer"
                title="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Row 2: Search Bar */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800">
            <div 
              className="flex w-full items-center bg-white dark:bg-zinc-900 overflow-hidden"
              style={{
                height: '48px',
                borderRadius: '8px',
                border: '1.5px solid #1ABC9C'
              }}
            >
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 outline-none h-full focus:outline-none cursor-pointer px-1 text-center shrink-0"
                style={{
                  width: '90px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRight: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <option value="products">Products</option>
                <option value="suppliers">Suppliers</option>
                <option value="rfq">RFQs</option>
              </select>

              <div className="flex-1 flex items-center relative h-full">
                <input
                  type="text"
                  placeholder="Search bulk products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-full bg-transparent pl-3 pr-8 focus:outline-none text-gray-850 dark:text-gray-100 border-0 shadow-none outline-none ring-0"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '15px',
                    fontWeight: 400
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => navigate('/shop')}
                className="h-full text-white flex items-center justify-center transition-colors hover:opacity-90 shrink-0 border-0 cursor-pointer"
                style={{
                  width: '70px',
                  backgroundColor: '#1ABC9C',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLET MODE (640px to 1023px) ================= */}
      <div className="hidden sm:flex lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center h-20 gap-4 flex-nowrap justify-between w-full bg-white dark:bg-[#0A0A0A]">
        {/* Logo Left */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div 
            className="flex items-center justify-center text-white shadow-sm shrink-0"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#1ABC9C',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '16px',
              fontWeight: 800
            }}
          >
            EB
          </div>
          <span 
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#1ABC9C'
            }}
          >
            EcoBazar
          </span>
        </div>

        {/* Search Bar Center (flex: 1) */}
        <div 
          className="flex items-center relative overflow-hidden bg-white dark:bg-zinc-900"
          style={{
            flex: '1',
            maxWidth: '400px',
            height: '44px',
            borderRadius: '8px',
            border: '1.5px solid #1ABC9C'
          }}
        >
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="bg-gray-50 dark:bg-zinc-900 text-gray-750 dark:text-gray-250 outline-none h-full focus:outline-none cursor-pointer px-1"
            style={{
              width: '90px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              borderRight: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <option value="products">Products</option>
            <option value="suppliers">Suppliers</option>
            <option value="rfq">RFQs</option>
          </select>
          
          <div className="flex-1 flex items-center relative h-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-full bg-transparent pr-6 focus:outline-none text-gray-800 dark:text-gray-200 border-0 shadow-none outline-none ring-0 pl-2"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: 400
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-655 border-0 bg-transparent cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="h-full text-white flex items-center justify-center transition-colors hover:opacity-90 shrink-0 border-0 cursor-pointer"
            style={{
              width: '64px',
              backgroundColor: '#1ABC9C',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            Search
          </button>
        </div>

        {/* Utility Icons Right (Reduced Sizes) */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer rounded-full"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-[#1ABC9C]" />
            )}
          </button>

          {/* Currency BDT */}
          <button
            onClick={() => {
              const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
              const idx = list.indexOf(currency);
              setCurrency(list[(idx + 1) % list.length]);
            }}
            className="text-center font-semibold text-[11px] text-[#1ABC9C] w-12 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md"
          >
            {currency}
          </button>

          {/* Language EN */}
          <button
            onClick={() => {
              const list: ('EN' | 'AR' | 'FR' | 'ES')[] = ['EN', 'AR', 'FR', 'ES'];
              const idx = list.indexOf(lang);
              setLang(list[(idx + 1) % list.length]);
            }}
            className="text-center font-semibold text-[11px] text-gray-600 dark:text-gray-300 w-8 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md"
          >
            {lang}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer rounded-full"
            title="Wishlist"
          >
            <Heart className="w-4.5 h-4.5" />
          </button>

          {/* Cart */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
            className="relative w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer rounded-full"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 text-white rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#1ABC9C',
                  fontSize: '9px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  width: '14px',
                  height: '14px'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Sign In / Profile */}
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] bg-transparent border-0 cursor-pointer rounded-full"
            title={user ? 'Dashboard' : 'Sign In'}
          >
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* ================= NAVIGATION TAB BAR (< 1024px) ================= */}
      <div className="lg:hidden w-full overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-[#0A0A0A]" style={{ WebkitOverflowScrolling: 'touch' }}>
        <nav className="flex items-center whitespace-nowrap">
          {navLinks.map((link) => {
            const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  touchAction: 'manipulation',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '12px 16px'
                }}
                className={`inline-block uppercase tracking-wide transition-colors duration-200 shrink-0 border-0 bg-transparent cursor-pointer ${
                  isActive 
                    ? 'text-[#1ABC9C] border-b-2 border-[#1ABC9C]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-[#1ABC9C] border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[1010] bg-black/60"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="fixed top-0 left-0 h-[100vh] w-[280px] bg-white dark:bg-[#0A0A0A] z-[1020] shadow-2xl flex flex-col overflow-y-auto"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-100 dark:border-zinc-800 shrink-0">
                <span 
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1ABC9C'
                  }}
                >
                  EcoBazar
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-[44px] h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-805 dark:hover:text-white rounded-full bg-transparent border-0 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col flex-1 pb-8">
                {/* Main Navigation Links */}
                <div className="flex flex-col">
                  {[
                    { label: 'HOME', path: '/' },
                    { label: 'SHOP', path: '/shop' },
                    { label: 'COMPARE', path: '/compare' },
                    { label: 'WISHLIST', path: '/wishlist' },
                    { label: 'TRACK ORDER', path: '/track-order' },
                    { label: 'BLOG', path: '/blog' },
                    { label: 'ABOUT US', path: '/about' },
                    { label: 'CONTACT US', path: '/contact' }
                  ].map((link) => {
                    const isActive = (link.path === '/' && currentPath === '/') || (link.path !== '/' && currentPath.startsWith(link.path));
                    return (
                      <button
                        key={link.path}
                        onClick={() => {
                          navigate(link.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full h-[52px] px-6 text-[16px] font-semibold text-left select-none transition-all duration-150 border-0 bg-transparent cursor-pointer"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 600,
                          fontSize: '16px',
                          color: isActive ? '#1ABC9C' : undefined,
                          borderLeft: isActive ? '4px solid #1ABC9C' : '4px solid transparent',
                          paddingLeft: isActive ? '20px' : '24px'
                        }}
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800 my-3 mx-6"></div>

                {/* Settings Rows */}
                <div className="flex flex-col px-6">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between h-[48px] text-[16px] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <button
                      onClick={toggleTheme}
                      className="relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none"
                      style={{
                        width: '52px',
                        height: '28px',
                        backgroundColor: theme === 'dark' ? '#1ABC9C' : '#E2E8F0'
                      }}
                    >
                      <span
                        className="pointer-events-none inline-flex transform rounded-full bg-white shadow-md transition duration-300 ease-in-out items-center justify-center"
                        style={{
                          width: '24px',
                          height: '24px',
                          transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0px)'
                        }}
                      >
                        {theme === 'light' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-[#1ABC9C]" />
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Currency Selector */}
                  <button 
                    onClick={() => {
                      const list: ('BDT' | 'USD' | 'GBP' | 'EUR' | 'AUD')[] = ['BDT', 'USD', 'GBP', 'EUR', 'AUD'];
                      const idx = list.indexOf(currency);
                      setCurrency(list[(idx + 1) % list.length]);
                    }}
                    className="flex items-center justify-between h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300 border-0 bg-transparent cursor-pointer text-left w-full"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span>Currency</span>
                    <span className="text-[#1ABC9C] font-bold">
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
                    className="flex items-center justify-between h-[48px] text-[16px] font-semibold text-gray-700 dark:text-gray-300 border-0 bg-transparent cursor-pointer text-left w-full"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span>Language</span>
                    <span className="text-[#1ABC9C] font-bold">
                      {lang === 'EN' ? 'GB EN' : 
                       lang === 'AR' ? 'SA AR' : 
                       lang === 'FR' ? 'FR FR' : 
                       'ES ES'}
                    </span>
                  </button>
                </div>

                {/* Sign In Button at the bottom */}
                <div className="mt-auto px-6 pt-6">
                  {user ? (
                    <button 
                      onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 text-white hover:opacity-90 rounded-lg transition duration-150 cursor-pointer border-0 h-11"
                      style={{
                        backgroundColor: '#1ABC9C',
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700
                      }}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      DASHBOARD
                    </button>
                  ) : (
                    <button 
                      onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 text-white hover:opacity-90 rounded-lg transition duration-150 cursor-pointer border-0 h-11"
                      style={{
                        backgroundColor: '#1ABC9C',
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700
                      }}
                    >
                      <User className="w-4 h-4" />
                      SIGN IN
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
