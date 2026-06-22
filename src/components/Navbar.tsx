import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Sparkles, RefreshCw, Search, Sun, Moon, Globe } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, cart, wishlist, logout, signIn, searchQuery, setSearchQuery, theme, toggleTheme, lang, setLang, currency, setCurrency } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);

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

  const handleDemoLogin = async (email: string) => {
    await signIn(email, 'password123');
    setIsDemoSwitcherOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 border-b border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`font-semibold text-sm transition duration-200 relative py-1 hover:text-[#008D7F] ${
                    isActive ? 'text-[#008D7F]' : 'text-gray-650 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#008D7F] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Real-time Search Input */}
          <div className="hidden md:flex items-center relative w-48 lg:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-450 dark:text-gray-400">
              <Search className="w-4 h-4 text-gray-450 dark:text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100/40 dark:hover:bg-zinc-800/80 border border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-405 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Widgets & Utilities */}
          <div className="flex items-center gap-4">
            
            {/* Quick Demo Account Selector (High usability tool, extremely helpful) */}
            <div className="relative">
              <button
                onClick={() => setIsDemoSwitcherOpen(!isDemoSwitcherOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xs font-semibold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150"
                title="Quickly switch accounts for testing dashboards"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                Demo Roles
              </button>
              
              {isDemoSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 text-left">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-50 dark:border-zinc-800/50 mb-1">
                    Select Test Role
                  </div>
                  <button
                    onClick={() => handleDemoLogin('admin@ecobazar.com')}
                    className="w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-teal-950/35 text-slate-700 dark:text-gray-250 text-xs font-semibold flex items-center justify-between"
                  >
                    <span>Admin</span>
                    <span className="bg-teal-100 dark:bg-teal-950/50 text-[#008D7F] text-[9px] px-1.5 py-0.5 rounded">Owner</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('delivery@ecobazar.com')}
                    className="w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-teal-950/35 text-slate-700 dark:text-gray-250 text-xs font-semibold flex items-center justify-between"
                  >
                    <span>Delivery man</span>
                    <span className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[9px] px-1.5 py-0.5 rounded">Logistics</span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('user@ecobazar.com')}
                    className="w-full text-left px-4 py-2 hover:bg-teal-50 dark:hover:bg-teal-950/35 text-slate-700 dark:text-gray-250 text-xs font-semibold flex items-center justify-between"
                  >
                    <span>Customer</span>
                    <span className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-[9px] px-1.5 py-0.5 rounded">Shopper</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-550 dark:text-gray-300 hover:text-[#008D7F] hover:bg-teal-50/50 dark:hover:bg-teal-950/30 rounded-full transition duration-150"
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
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F] text-xs font-bold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150"
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
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-650 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-[#008D7F] text-xs font-bold rounded-lg border border-gray-100 dark:border-zinc-800 transition duration-150"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 animate-spin-slow" />
              <span>
                {lang === 'EN' ? '🇬🇧 EN' : 
                 lang === 'AR' ? '🇸🇦 AR' : 
                 lang === 'FR' ? '🇫🇷 FR' : 
                 '🇪🇸 ES'}
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#981849] dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition duration-200"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#981849] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }))}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#008D7F] dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 rounded-full transition duration-200 flex items-center gap-1"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 sm:right-auto sm:top-1 bg-[#008D7F] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="hidden sm:inline text-xs font-bold text-[#008D7F] dark:text-teal-400 ml-1">
                    ৳{cartTotal.toLocaleString()}
                  </span>
                </>
              )}
            </button>

            {/* Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800 p-1.5 rounded-full sm:rounded-xl transition duration-150"
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
                </button>

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
                      className="w-full text-left px-4 py-2 text-sm text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/25 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#008D7F] to-[#01776c] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition shadow-md shadow-[#008D7F]/10"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-650 dark:text-gray-305 hover:text-[#008D7F] dark:hover:text-[#008D7F]"
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
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-855 rounded-xl pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition"
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
                    isActive ? 'text-[#008D7F]' : 'text-gray-600 dark:text-gray-300'
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
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
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

            <button
              onClick={() => {
                setIsDemoSwitcherOpen(!isDemoSwitcherOpen);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 font-semibold text-xs text-gray-600 dark:text-gray-300 rounded-xl cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Demo Roles Mode
            </button>
            
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
