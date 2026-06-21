import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowLeft, Send, ShieldCheck, CreditCard, Truck, RefreshCw, Lock } from 'lucide-react';

interface CheckoutViewProps {
  navigate: (path: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ navigate }) => {
  const { user, cart, createOrder, formatPrice, lang } = useStore();

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Free delivery threshold above 2,400 BDT or equivalent
  const shippingThreshold = 2400;
  const isFreeShipping = cartTotal >= shippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 350; // flat 350 BDT fee
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your shopping basket is empty! Please select some items first.');
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
      notes: notes + ` [Payment: ${paymentMethod.toUpperCase()}]`
    });

    localStorage.setItem('eb_last_order_id', order._id);
    navigate('/thank-you');
  };

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-slate-50 text-slate-405 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
          🛒
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-800">Your Basket is Clear</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Please purchase smart widgets or accessories from our premium catalogs to initialize safe checkout.
          </p>
        </div>
        <button 
          onClick={() => navigate('/shop')} 
          className="px-8 py-3.5 bg-[#00B894] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-[#008D7F]"
        >
          Browse Our Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 text-left max-w-7xl mx-auto px-4 sm:px-8">
      
      {/* Back click header */}
      <div>
        <button
          onClick={() => navigate('/shop')}
          className="group inline-flex items-center gap-2 text-xs font-extrabold text-[#1E293B]/60 hover:text-[#00B894] transition uppercase tracking-wider"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Shipping details & secure payment modes */}
        <div className="lg:col-span-7 bg-white border border-slate-150 p-6 md:p-8 rounded-[24px] shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
              <Lock className="w-5.5 h-5.5 text-[#00B894]" /> DELIVERY & SECURE SIGNUP
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              SSL SECURED CONNECTION • DISPATCHED WITHIN 24 HOURS
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input boxes */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Receiver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3.5 bg-slate-50 border border-slate-205 rounded-xl font-semibold outline-none focus:border-[#00B894] focus:bg-white transition"
                    placeholder="e.g. Zarin Tasnim"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3.5 bg-slate-50 border border-slate-205 rounded-xl font-semibold outline-none focus:border-[#00B894] focus:bg-white transition"
                    placeholder="e.g. zarin@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Active Courier Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-205 rounded-xl font-semibold outline-none focus:border-[#00B894] focus:bg-white transition"
                  placeholder="e.g. +880 1712-345678"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Absolute Street Shipping Address *</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-201 rounded-xl font-semibold outline-none focus:border-[#00B894] focus:bg-white transition"
                  placeholder="Street, Area, City, State ZIP Code"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Special Shipping Instructions (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-205 rounded-xl font-semibold outline-none focus:border-[#00B894] focus:bg-white transition"
                  placeholder="e.g. Deliver to receptionist or ring bell only."
                />
              </div>
            </div>

            {/* PAYMENT CHOICE SEGMENT: Luxury selectors */}
            <div className="space-y-3">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest block">Select Premium Payment Method</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Cash on delivery */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between h-24 ${
                    paymentMethod === 'cod' 
                      ? 'border-[#00B894] bg-emerald-50/20 text-[#00B894] font-bold' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <Truck className="w-5 h-5 text-[#00B894]" />
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')} 
                      className="accent-[#00B894]"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-850">Cash On Delivery</p>
                    <p className="text-[9px] text-slate-400">Inspect parcel first, then pay</p>
                  </div>
                </div>

                {/* Credit Card mockup */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between h-24 ${
                    paymentMethod === 'card' 
                      ? 'border-[#00B894] bg-emerald-50/20 text-[#00B894] font-bold' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')} 
                      className="accent-[#000]'}" 
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-850">Visa / Mastercard</p>
                    <p className="text-[9px] text-slate-400">Instantly save extra 2% charges</p>
                  </div>
                </div>

                {/* Mobile wallet */}
                <div 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between h-24 ${
                    paymentMethod === 'wallet' 
                      ? 'border-[#00B894] bg-emerald-50/20 text-[#00B894] font-bold' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <ShieldCheck className="w-5 h-5 text-[#00B894]" />
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'wallet'} 
                      onChange={() => setPaymentMethod('wallet')} 
                      className="accent-[#00B894]" 
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-850">Mobile MFS Wallet</p>
                    <p className="text-[9px] text-slate-400">bKash, Nagad or Rocket pay</p>
                  </div>
                </div>

              </div>

              {/* Secure Credit Card Mock Details if clicked */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fade-in">
                  <div className="grid grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      placeholder="Card Number (16-digit)" 
                      className="col-span-2 text-xs p-3 border border-slate-250 bg-white rounded-lg outline-none focus:border-[#00B894]"
                    />
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="text-xs p-3 border border-slate-250 bg-white rounded-lg outline-none focus:border-[#00B894]"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">Safe Sandbox Mock Mode: Any 16 numbers can pass correctly.</p>
                </div>
              )}
            </div>

            {/* Action button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#00B894] to-[#008D7F] hover:shadow-lg text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 pt-4"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Confirm & Dispatch Premium Order</span>
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: Invoice overview & trust seals */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Invoice card */}
          <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-[24px] shadow-sm space-y-6 text-left">
            <h3 className="font-display font-extrabold text-lg text-slate-850 border-b border-slate-100 pb-3">
              YOUR INVOICE SUMMARY
            </h3>

            {/* List products */}
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product._id} className="flex gap-4 items-center pt-3 first:pt-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    <img src={item.product.gallery[0]} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{item.product.title}</h4>
                    <p className="text-slate-400 font-extrabold">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-black text-xs text-slate-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            {/* Computations */}
            <div className="space-y-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-slate-800 font-extrabold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Logistics Shipping:</span>
                <span className="text-slate-850 font-extrabold">
                  {isFreeShipping ? (
                    <span className="text-[#00B894] font-black">FREE SHIPPING</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <hr className="border-slate-100 my-1" />
              <div className="flex justify-between text-sm pt-1">
                <span className="text-slate-900 font-black">Grand Grand Total:</span>
                <span className="text-[#00B894] font-black tracking-wide font-display text-base">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Secure Trust details cards */}
          <div className="bg-slate-50 border border-slate-150 p-6 rounded-[24px] text-left space-y-4">
            <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-widest">EcoBazar Quality Commitments</h4>
            <div className="space-y-3 text-xs text-slate-500 font-medium">
              <div className="flex gap-2.5 items-start">
                <Lock className="w-4.5 h-4.5 text-[#00B894] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>256-Bit SSL Encrypted Connection:</strong> Your personal identity data is safely guarded and passed over high-security tokens.
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <RefreshCw className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>30-Day Money Back Guarantee:</strong> If the item arrives with damage or defect, expect rapid free replacements without friction.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
