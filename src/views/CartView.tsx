import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartViewProps {
  navigate: (path: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ navigate }) => {
  const { cart, removeFromCart, updateCartQuantity, currency, getWholesalePrice } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate cart total based on dynamic tiered wholesale pricing
  const cartTotal = cart.reduce((sum, item) => {
    const unitPrice = getWholesalePrice ? getWholesalePrice(item.product, item.quantity) : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const convertPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return '$' + (bdtPrice / 120).toFixed(2);
    }
    return '৳' + bdtPrice.toLocaleString();
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
          🛒
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-black text-2xl text-gray-900">Your wholesale cart is empty</h2>
          <p className="text-sm text-gray-400 font-semibold">It looks like you haven't added any products to your B2B sourcing list yet.</p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#008D7F] hover:bg-[#00B894] text-white font-bold rounded-2xl text-xs shadow-md transition cursor-pointer"
        >
          Start Sourcing Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 text-left">
      <div>
        <h1 className="font-display text-3xl font-black text-gray-900 dark:text-gray-100">Wholesale Sourcing Cart ({totalItems} items)</h1>
        <p className="text-xs text-gray-400 font-semibold mt-1">Review your wholesale selections before launching trade orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-zinc-900">
            {cart.map((item) => {
              const unitPrice = getWholesalePrice ? getWholesalePrice(item.product, item.quantity) : item.product.price;
              return (
                <div
                  key={item.product._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between"
                >
                  {/* Thumb + Title details */}
                  <div className="flex gap-4 items-center flex-1">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 shrink-0">
                      <img
                        src={item.product.gallery[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100'}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#008D7F] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.product.category}
                      </span>
                      <h3
                        onClick={() => navigate(`/product/${item.product._id}`)}
                        className="font-display font-bold text-sm text-gray-800 dark:text-gray-200 hover:text-[#008D7F] cursor-pointer line-clamp-2"
                      >
                        {item.product.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="text-[#008D7F]">{convertPrice(unitPrice)} / piece</span>
                        <span className="text-gray-300">|</span>
                        <span>Min. Order: {item.product.moq || 1} pcs</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side controls */}
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity manager */}
                    <div className="flex items-center border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-1 rounded-xl">
                      <button
                        onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                        className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-gray-500 hover:text-[#008D7F] cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-black text-gray-800 dark:text-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                        className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-gray-500 hover:text-[#008D7F] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right sm:min-w-[80px]">
                      <p className="font-display font-black text-sm text-gray-800 dark:text-gray-100">
                        {convertPrice(unitPrice * item.quantity)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-5.5 h-5.5 sm:w-5 sm:h-5" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 p-6 rounded-2xl shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-gray-100 border-b border-gray-50 dark:border-zinc-900 pb-3">
            Trade Sourcing Invoice
          </h2>

          <div className="space-y-3 font-semibold text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Sourced items</span>
              <span className="text-gray-800 dark:text-gray-200 font-bold">{totalItems} units</span>
            </div>
            
            <div className="flex justify-between">
              <span>Wholesale Subtotal</span>
              <span className="text-gray-800 dark:text-gray-200 font-bold">{convertPrice(cartTotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Cargo Shipping Fee</span>
              {cartTotal >= 1000 ? (
                <span className="text-emerald-600 font-black">FREE</span>
              ) : (
                <span className="text-gray-800 dark:text-gray-200 font-bold">{convertPrice(120)}</span>
              )}
            </div>
            
            <hr className="border-gray-50 dark:border-zinc-900 my-2" />

            <div className="flex justify-between text-sm">
              <span className="text-gray-800 dark:text-gray-200 font-black">Total Invoiced</span>
              <span className="text-[#008D7F] font-black font-display text-base">
                {convertPrice(cartTotal + (cartTotal >= 1000 ? 0 : 120))}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#008D7F] hover:bg-[#00B894] text-white font-extrabold text-sm rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Proceed to Trade Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="w-full py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100/80 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Continue Sourcing Products
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
