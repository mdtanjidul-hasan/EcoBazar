import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowLeft, Send } from 'lucide-react';

interface CheckoutViewProps {
  navigate: (path: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ navigate }) => {
  const { user, cart, createOrder } = useStore();

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = cartTotal >= 1000 ? 0 : 120;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty! Please add products before checking out.');
      return;
    }
    if (!name || !email || !phone || !address) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const order = createOrder({
      name,
      email,
      phone,
      address,
      notes
    });

    localStorage.setItem('eb_last_order_id', order._id);
    navigate('/thank-you');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6">
        <h2 className="title text-2xl font-black text-gray-800">No Items to Checkout</h2>
        <p className="text-sm text-gray-500 font-semibold">Your shopping cart is currently empty. Head to our catalog page to pick premium accessories.</p>
        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-[#008D7F] text-white font-bold rounded-xl text-xs">
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Hand back button */}
      <div>
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#008D7F] transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shopping Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Billing Address Sheets Inputs */}
        <div className="lg:col-span-7 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-gray-50 pb-4">
            <h2 className="font-display font-black text-xl text-gray-900">Delivery Information</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Please provide an active phone number and absolute street details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Receiver Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  placeholder="e.g. Zarin Tasnim"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Receiver Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  placeholder="e.g. zarin@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Phone Number (BDT Local preferred) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                placeholder="e.g. +880 1712-345678"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Absolute Street Address *</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                placeholder="House, Road, Area, City, District"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Note to Delivery Personnel (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                placeholder="e.g., Please knock or ring the bell only."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-sm rounded-xl transition shadow flex items-center justify-center gap-2 pt-4"
            >
              <Send className="w-4 h-4" />
              Place Order Cash on Delivery
            </button>
          </form>

        </div>

        {/* Right side: Items checklist */}
        <div className="lg:col-span-5 bg-white border border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-gray-900 border-b border-gray-50 pb-3">
            Review Invoice Details
          </h2>

          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 divide-y divide-gray-50">
            {cart.map((item) => (
              <div key={item.product._id} className="flex gap-4 items-center pt-3 first:pt-0">
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-gray-50 overflow-hidden shrink-0">
                  <img src={item.product.gallery[0]} alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-gray-700 line-clamp-1">{item.product.title}</p>
                  <p className="text-gray-400 font-semibold">{item.quantity} x ৳{item.product.price}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-black text-xs text-gray-800">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-gray-50" />

          <div className="space-y-2.5 text-xs text-gray-500 font-semibold">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="text-gray-800 font-bold">৳{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{shippingFee === 0 ? 'FREE' : `৳${shippingFee}`}</span>
            </div>
            <hr className="border-gray-50 my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-850 font-black">Total BDT Invoice</span>
              <span className="text-[#008D7F] font-black tracking-wide font-display text-base">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-gray-200">
            <div className="flex gap-3">
              <div className="text-sm">🛡️</div>
              <p className="text-[10px] text-gray-400 select-none text-left font-semibold leading-relaxed">
                We support safe Cash on Delivery. Rest assured, you can inspect the quality of the jewelry combo drops before paying the delivery agent.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
