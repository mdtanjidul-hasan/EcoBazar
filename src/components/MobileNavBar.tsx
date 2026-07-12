import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, ShoppingBag, Heart, ShoppingCart, Menu } from 'lucide-react';

interface MobileNavBarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ currentPath, navigate }) => {
  const { user, cart, wishlist, lang } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isHomeActive = currentPath === '/' || currentPath === '/home';
  const isShopActive = currentPath === '/shop';
  const isWishlistActive = currentPath === '/wishlist';
  const isProfileActive = currentPath === '/dashboard' || currentPath === '/login';

  const handleCartOpen = () => {
    window.dispatchEvent(new CustomEvent('set-cart-drawer-state', { detail: true }));
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[999] lg:hidden bg-white/95 dark:bg-[#0A0A0A]/95 border-t border-gray-150 dark:border-zinc-850 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md h-[56px]"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="h-full w-full flex items-center justify-between px-0">
        {/* Home Action */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-1/5 h-full transition duration-150 cursor-pointer border-0 bg-transparent ${
            isHomeActive 
              ? 'text-[#1ABC9C] font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1ABC9C]'
          }`}
          style={{ touchAction: 'manipulation' }}
          title="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {lang === 'EN' ? 'Home' : 'হোম'}
          </span>
        </button>

        {/* Shop Action */}
        <button
          onClick={() => navigate('/shop')}
          className={`flex flex-col items-center justify-center w-1/5 h-full transition duration-150 cursor-pointer border-0 bg-transparent ${
            isShopActive 
              ? 'text-[#1ABC9C] font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1ABC9C]'
          }`}
          style={{ touchAction: 'manipulation' }}
          title="Shop"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {lang === 'EN' ? 'Shop' : 'শপ'}
          </span>
        </button>

        {/* Wishlist Action */}
        <button
          onClick={() => navigate('/wishlist')}
          className={`flex flex-col items-center justify-center w-1/5 h-full transition duration-150 cursor-pointer border-0 bg-transparent relative ${
            isWishlistActive 
              ? 'text-[#1ABC9C] font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1ABC9C]'
          }`}
          style={{ touchAction: 'manipulation' }}
          title="Wishlist"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1ABC9C] text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {lang === 'EN' ? 'Wishlist' : 'পছন্দ'}
          </span>
        </button>

        {/* Cart Action */}
        <button
          onClick={handleCartOpen}
          className="flex flex-col items-center justify-center w-1/5 h-full transition duration-150 cursor-pointer border-0 bg-transparent text-gray-500 dark:text-gray-400 hover:text-[#1ABC9C] relative"
          style={{ touchAction: 'manipulation' }}
          title="Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1ABC9C] text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {lang === 'EN' ? 'Cart' : 'কার্ট'}
          </span>
        </button>

        {/* Menu Action */}
        <button
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className={`flex flex-col items-center justify-center w-1/5 h-full transition duration-150 cursor-pointer border-0 bg-transparent ${
            isProfileActive 
              ? 'text-[#1ABC9C] font-bold' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1ABC9C]'
          }`}
          style={{ touchAction: 'manipulation' }}
          title="Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {lang === 'EN' ? 'Menu' : 'মেনু'}
          </span>
        </button>
      </div>
    </div>
  );
};
