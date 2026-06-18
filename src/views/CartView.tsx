import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartViewProps {
  navigate: (path: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ navigate }) => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
          🛒
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-black text-2xl text-gray-900">Your Cart is Empty</h2>
          <p className="text-sm text-gray-400 font-semibold">It looks like you haven't added any products to your cart yet.</p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#008D7F] hover:bg-[#981849] text-white font-bold rounded-2xl text-xs shadow-md transition"
        >
          Start Shopping Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 text-left">
      <div>
        <h1 className="font-display text-3xl font-black text-gray-900">Shopping Cart ({totalItems} items)</h1>
        <p className="text-xs text-gray-400 font-semibold mt-1">Review your selections before completing checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between"
              >
                {/* Thumb + Title details */}
                <div className="flex gap-4 items-center flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-gray-50 shrink-0">
                    <img
                      src={item.product.gallery[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100'}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#008D7F] bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${item.product._id}`)}
                      className="font-display font-bold text-sm text-gray-800 hover:text-[#008D7F] cursor-pointer line-clamp-2"
                    >
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-[#008D7F] font-bold">
                      ৳{item.product.price.toLocaleString()} / item
                    </p>
                  </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity manager */}
                  <div className="flex items-center border border-gray-200 bg-gray-50 p-1 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-[#008D7F]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-black text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-[#008D7F]"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right sm:min-w-[80px]">
                    <p className="font-display font-black text-sm text-gray-800">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove from Cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-gray-900 border-b border-gray-50 pb-3">
            Cart Summary Invoice
          </h2>

          <div className="space-y-3 font-semibold text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Selected items</span>
              <span className="text-gray-800 font-bold">{totalItems} units</span>
            </div>
            
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="text-gray-800 font-bold">৳{cartTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              {cartTotal >= 1000 ? (
                <span className="text-emerald-600 font-black">FREE</span>
              ) : (
                <span className="text-gray-800 font-bold">৳120</span>
              )}
            </div>
            
            <hr className="border-gray-50 my-2" />

            <div className="flex justify-between text-sm">
              <span className="text-gray-800 font-black">Total Invoiced</span>
              <span className="text-[#008D7F] font-black font-display text-base">
                ৳{(cartTotal + (cartTotal >= 1000 ? 0 : 120)).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-sm rounded-xl transition shadow flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="w-full py-3 bg-gray-50 border border-gray-100/80 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-100 transition"
            >
              Continue Browsing Products
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
