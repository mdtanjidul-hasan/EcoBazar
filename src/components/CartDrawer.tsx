import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, navigate }) => {
  const { cart, removeFromCart, updateCartQuantity, formatPrice, lang, currency } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0); // percentages
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Register a window-level callback to auto-open drawer on cart additions
  useEffect(() => {
    const handleAddEvent = () => {
      // Trigger opening when item is added
      if (!isOpen) {
        // Trigger opening via callback
        const event = new CustomEvent('set-cart-drawer-state', { detail: true });
        window.dispatchEvent(event);
      }
    };
    window.addEventListener('cart-item-added', handleAddEvent);
    return () => window.removeEventListener('cart-item-added', handleAddEvent);
  }, [isOpen]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Progressive free shipping thresholds (2,400 BDT or equivalent ~$20 USD)
  const shippingThreshold = 2400;
  const isFreeShipping = cartTotal >= shippingThreshold;
  const shippingRemaining = Math.max(0, shippingThreshold - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / shippingThreshold) * 100);

  const discountedTotal = cartTotal * (1 - activeDiscount / 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'ECOEXTRA' || code === 'SAVE10') {
      setActiveDiscount(10);
      setCouponSuccess('10% VIP Discount Applied successfully!');
    } else if (code === 'WELCOME5') {
      setActiveDiscount(5);
      setCouponSuccess('5% Welcome Discount Applied!');
    } else {
      setCouponError('Invalid promo coupon code.');
    }
  };

  const handleCheckoutRedirect = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        
        {/* Glass backdrop filter wrapper */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 select-none">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white border-l border-slate-100 flex flex-col shadow-2xl overflow-hidden h-full text-left"
          >
            {/* Header portion */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00B894]/15 text-[#00B894] rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 uppercase tracking-wide">
                    {lang === 'EN' ? 'Shopping Drawer' : 'শপিং ড্রয়ার'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {cartCount} {lang === 'EN' ? 'Selected luxury items' : 'টি পণ্য সংরক্ষিত'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-slate-150 text-slate-400 hover:text-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PROGRESS BAR: Free Shipping Calculator */}
            {cartCount > 0 && (
              <div className="bg-[#00B894]/5 border-b border-[#00B894]/10 p-5 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  {isFreeShipping ? (
                    <span className="text-[#00B894] flex items-center gap-1">
                      <Sparkles className="w-4 h-4 animate-bounce" /> Congratulations! Free Delivery Unlocked
                    </span>
                  ) : (
                    <span>
                      Spend <span className="text-[#00B894] font-black">{formatPrice(shippingRemaining)}</span> more for free global shipping
                    </span>
                  )}
                  <span>{Math.floor(progressPercent)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#00B894] to-[#008D7F] h-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart content list */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100 space-y-4">
              {cartCount === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 text-slate-350 rounded-full flex items-center justify-center text-2xl mx-auto shadow-inner">
                    🛒
                  </div>
                  <h4 className="font-display font-extrabold text-slate-800 text-sm">Your basket is clear</h4>
                  <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto">
                    Fill this beautiful canvas up with organic fashion accessories and elegant smart widgets.
                  </p>
                  <button 
                    onClick={() => { onClose(); navigate('/shop'); }}
                    className="px-5 py-2.5 bg-[#00B894] text-white font-extrabold rounded-lg text-xs tracking-wider uppercase hover:bg-[#008D7F]"
                  >
                    Go Explore Shop
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product._id} className="pt-4 first:pt-0 flex gap-4 items-center justify-between group">
                    
                    {/* Visual Preview */}
                    <div className="flex gap-4 items-center flex-1">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 relative">
                        <img 
                          src={item.product.gallery[0]} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Meta */}
                      <div className="space-y-1">
                        <h4 
                          onClick={() => { onClose(); navigate(`/product/${item.product._id}`); }}
                          className="text-xs font-bold text-slate-800 hover:text-[#00B894] cursor-pointer line-clamp-1"
                        >
                          {item.product.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase">
                          {item.product.category}
                        </p>
                        <p className="text-xs font-extrabold text-[#00B894]">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Dials & Delete button */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 bg-white p-1 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-black text-slate-500"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-black text-slate-500"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-350 hover:text-red-500 p-1"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Bottom summary and checkouts */}
            {cartCount > 0 && (
              <div className="border-t border-slate-100 p-6 bg-slate-50 space-y-4">
                
                {/* Promo Codes Application Form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter 'ECOEXTRA' coupon"
                      className="w-full pl-8 pr-3 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:border-[#00B894] outline-none font-bold uppercase"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-[#00B894] text-white font-extrabold text-[10px] uppercase rounded-xl tracking-wider transition"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[10px] text-red-600 font-bold">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold">{couponSuccess}</p>}

                {/* Sub-computations */}
                <div className="space-y-2 text-xs text-slate-600 font-bold">
                  <div className="flex justify-between">
                    <span>Subtotal order value:</span>
                    <span className="text-slate-800">{formatPrice(cartTotal)}</span>
                  </div>
                  
                  {activeDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>VIP Promo Discount ({activeDiscount}%):</span>
                      <span>-{formatPrice(cartTotal * activeDiscount / 100)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping & Duties:</span>
                    <span className="text-slate-800">
                      {isFreeShipping ? (
                        <span className="text-emerald-600 uppercase">FREE</span>
                      ) : (
                        formatPrice(350) // Flat 350 BDT
                      )}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-800">
                    <span>Grand Total:</span>
                    <span className="text-[#00B894]">
                      {formatPrice(discountedTotal + (isFreeShipping ? 0 : 350))}
                    </span>
                  </div>
                </div>

                {/* Main triggers */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleCheckoutRedirect}
                    className="w-full py-3.5 bg-gradient-to-r from-[#00B894] to-[#008D7F] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { onClose(); navigate('/cart'); }}
                    className="w-full py-2 bg-transparent text-slate-500 text-[10px] font-extrabold uppercase tracking-widest text-center hover:text-[#00B894] transition"
                  >
                    View Full Shopping Cart Page
                  </button>
                </div>

                <div className="flex justify-center items-center gap-1 text-[10px] font-bold text-slate-400 uppercase pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Insured SSL encrypted connection
                </div>

              </div>
            )}

          </motion.div>
        </div>

      </div>
    </AnimatePresence>
  );
};
