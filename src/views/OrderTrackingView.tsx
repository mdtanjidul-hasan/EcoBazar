import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Calendar, 
  User, 
  X, 
  Info, 
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Building,
  Hourglass,
  Clock,
  Sparkles
} from 'lucide-react';

interface OrderTrackingViewProps {
  navigate?: (path: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ navigate }) => {
  const { orders, formatPrice } = useStore();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill query parameters if present or if clicking from and order confirmation page
  useEffect(() => {
    // Check if there is a newly created order or pre-existing orders to pre-select
    if (orders.length > 0) {
      // Don't auto-fill straight away unless requested, but we can set up defaults easily
    }
  }, [orders]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSearched(true);

    if (!orderId.trim() || !email.trim()) {
      setErrorMsg('Please supply both your Order ID and the Email associated with the order.');
      setFoundOrder(null);
      return;
    }

    const trimmedId = orderId.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    // Find the order
    const matched = orders.find(
      (ord) => 
        ord._id.toLowerCase() === trimmedId && 
        ord.email.toLowerCase() === trimmedEmail
    );

    if (matched) {
      setFoundOrder(matched);
    } else {
      setFoundOrder(null);
      setErrorMsg('No order matches the designated specifications. Please check your credentials and make sure the order ID is correct.');
    }
  };

  const handleSelectSample = (sample: Order) => {
    setOrderId(sample._id);
    setEmail(sample.email);
    setFoundOrder(sample);
    setSearched(true);
    setErrorMsg('');
  };

  // Status mapping to logical progress steps
  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 1;
      case 'onTheWay': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const activeStep = foundOrder ? getStatusStep(foundOrder.status) : 1;

  // Render a real-time tracking timeline for the package status
  const steps = [
    { title: 'Order Placed', desc: 'Your payment was cleared and order is logged.', icon: Hourglass, activeColor: 'text-[#008D7F] bg-teal-50 dark:bg-teal-950/40 border-teal-200' },
    { title: 'Processing Order', desc: 'Our team is preparing and packing item(s).', icon: Package, activeColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
    { title: 'On The Way', desc: 'Package passed to courier with active delivery.', icon: Truck, activeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
    { title: 'Delivered', desc: 'Consignment successfully signed and completed.', icon: CheckCircle2, activeColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' }
  ];

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Decorative Jumbotron Header Banner */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] bg-teal-50 dark:bg-teal-950/40 text-[#008D7F] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Logistics Portal
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Real-Time Order Tracking
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed max-w-xl">
              Track the exact dispatch, preparation, and shipping progression of your package directly from our fulfillment warehouse.
            </p>
          </div>
          
          {navigate && (
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-3 border border-gray-200 dark:border-zinc-800 hover:border-[#008D7F] text-gray-600 dark:text-gray-300 dark:hover:text-[#008D7F] text-xs font-bold rounded-xl transition flex-shrink-0"
            >
              Return to Catalog
            </button>
          )}
        </div>
      </section>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Query Form / Sample Selectors */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real Search Form card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-855 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-display font-extrabold text-base text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#008D7F]" />
              Identify Your Consignment
            </h2>
            
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. ord_abc123"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#008D7F] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contact Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#008D7F] transition-all"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] font-bold text-rose-600 bg-rose-50/70 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/40">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#008D7F] hover:bg-[#007065] text-white py-3.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Package Status</span>
              </button>
            </form>
          </div>

          {/* Quick Demo Assist Sandbox Card */}
          {orders.length > 0 && (
            <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-gray-200/60 dark:border-zinc-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#008D7F] animate-ping"></span>
                <h3 className="font-display font-extrabold text-xs text-gray-550 dark:text-gray-400 uppercase tracking-widest">
                  Live Sandbox Demonstrations
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                Don't have your own order reference on hand? Instantly query one of our seeded, mock simulation items below to preview different stages of the logistics progression:
              </p>

              <div className="space-y-2.5">
                {orders.map((ord, idx) => (
                  <button
                    key={ord._id}
                    onClick={() => handleSelectSample(ord)}
                    className="w-full text-left p-3 bg-white dark:bg-zinc-905 border border-gray-150 dark:border-zinc-800/80 hover:border-[#008D7F] hover:text-[#008D7F] rounded-xl flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer"
                  >
                    <div className="space-y-0.5 truncate mr-2">
                      <p className="font-mono text-[10px] text-gray-400">Order ID: {ord._id}</p>
                      <p className="truncate font-semibold text-gray-800 dark:text-gray-200">
                        {ord.name} ({ord.email})
                      </p>
                    </div>
                    
                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase ${
                      ord.status === 'completed' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450' 
                        : ord.status === 'onTheWay'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450'
                          : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450'
                    }`}>
                      {ord.status === 'onTheWay' ? 'on the way' : ord.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Panel: Complete side-by-side Progress detail & address maps */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {searched && foundOrder ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-6"
                key={foundOrder._id}
              >
                
                {/* 1. Status Indicator Card */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-855 rounded-2xl p-6 shadow-sm space-y-6">
                  
                  {/* Status header summary block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-50 dark:border-zinc-800">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded font-bold font-mono uppercase">
                        Active Invoice
                      </span>
                      <h3 className="font-mono text-base font-black text-gray-800 dark:text-gray-100">
                        {foundOrder._id}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-semibold font-sans">
                        Placed on {foundOrder.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        foundOrder.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' 
                          : foundOrder.status === 'onTheWay'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                      }`}>
                        {foundOrder.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : foundOrder.status === 'onTheWay' ? (
                          <Truck className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fulfillment Stage</p>
                        <p className="text-xs font-extrabold capitalize text-gray-800 dark:text-gray-200">
                          {foundOrder.status === 'onTheWay' ? 'On The Way' : foundOrder.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* High visual multi-stage Stepper */}
                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-[15px] before:top-[12px] before:bottom-[12.5rem] before:w-0.5 before:bg-gray-100 dark:before:bg-zinc-800">
                    {steps.map((st, i) => {
                      const stepNum = i + 1;
                      const isDone = activeStep >= stepNum;
                      const isCurrent = activeStep === stepNum || (stepNum === 2 && activeStep === 1); // Group processing with pending or split logic
                      const Icon = st.icon;

                      return (
                        <div key={st.title} className="flex gap-4 items-start relative z-10 select-none">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isDone 
                              ? 'bg-white dark:bg-zinc-900 border-[#008D7F] text-[#008D7F]' 
                              : isCurrent
                                ? 'bg-white dark:bg-zinc-900 border-teal-300 text-[#008D7F] animate-pulse'
                                : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-300'
                          }`}>
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>

                          <div className="space-y-0.5 flex-1">
                            <h4 className={`text-xs font-extrabold transition ${
                              isDone ? 'text-gray-900 dark:text-white' : 'text-gray-450 dark:text-gray-500'
                            }`}>
                              {st.title} 
                              {isCurrent && (
                                <span className="text-[9px] bg-teal-50 dark:bg-teal-950/40 text-[#008D7F] font-bold px-1.5 py-0.5 rounded ml-1.5">
                                  Current Status
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-gray-400 dark:text-gray-505 font-semibold leading-normal">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* 2. Dispatch / Delivery Agent & Estimate Details */}
                {(foundOrder.deliveryMan || foundOrder.deliveryDate) && (
                  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-855 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-display font-extrabold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Assigned Security Dispatch
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {foundOrder.deliveryMan && (
                        <div className="bg-gray-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-150 dark:border-zinc-805 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-150 flex-shrink-0">
                            <img 
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" 
                              alt={foundOrder.deliveryMan} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Courier Personnel</p>
                            <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                              {foundOrder.deliveryMan}
                            </p>
                          </div>
                        </div>
                      )}

                      {foundOrder.deliveryDate && (
                        <div className="bg-gray-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-150 dark:border-zinc-805 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#008D7F]/10 text-[#008D7F] flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Scheduled Delivery</p>
                            <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                              {foundOrder.deliveryDate}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Address Map Indicator */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-855 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-display font-extrabold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    Delivery Destination Location
                  </h3>
                  
                  <div className="p-4 bg-slate-50 dark:bg-zinc-955 border border-gray-150 dark:border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-start gap-2.5">
                      <Building className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-gray-200">Address Destination:</p>
                        <p className="text-gray-500 dark:text-gray-400 font-semibold mt-0.5">{foundOrder.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200/50 dark:border-zinc-800/50">
                      <Phone className="w-3.5 h-3.5 text-gray-450" />
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Recipient Hot-Line Contact: <strong className="font-extrabold text-gray-800 dark:text-zinc-200">{foundOrder.phone}</strong>
                      </p>
                    </div>

                    {foundOrder.notes && (
                      <div className="bg-amber-50/55 dark:bg-amber-950/10 p-2 text-[10px] text-amber-800 dark:text-amber-400 rounded-lg font-bold border border-amber-100 dark:border-amber-900/30">
                        * Note: {foundOrder.notes}
                      </div>
                    )}
                  </div>

                  {/* Visual mockup Map canvas representation representing real package coordinates */}
                  <div className="h-44 w-full bg-slate-100 dark:bg-zinc-954 rounded-xl relative overflow-hidden border border-gray-150 dark:border-zinc-800 select-none">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#008d7f_1.25px,transparent_1.25px)] [background-size:16px_16px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="bg-[#008D7F] text-white p-2.5 rounded-full shadow-lg relative z-10 animate-bounce">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="w-4 h-4 bg-[#008D7F]/30 rounded-full absolute top-[1.3rem] animate-ping"></div>
                      <span className="text-[10px] bg-zinc-900/90 dark:bg-zinc-100 dark:text-zinc-950 text-white font-mono px-2 py-0.5 rounded font-black tracking-widest mt-3 whitespace-nowrap shadow-md">
                        LOC: DHAKA TRANSIT CENTRAL
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-900/90 border border-gray-250 dark:border-zinc-800 px-2.5 py-1 rounded-md shadow-sm">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tracking Status</p>
                      <p className="text-[10px] font-black text-emerald-600">ACTIVE IN TRANSIT (GPS)</p>
                    </div>
                  </div>
                </div>

                {/* 4. Package Contents List */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-855 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-display font-extrabold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-teal-600" />
                    Consignment Manifest Contents
                  </h3>

                  <div className="space-y-3.5 pt-1">
                    {foundOrder.items.map((it, idx) => (
                      <div key={idx} className="flex gap-4 items-center justify-between">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 flex-shrink-0 overflow-hidden">
                            <img 
                              src={it.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100'} 
                              alt={it.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 truncate">
                              {it.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-semibold font-mono">
                              QTY: {it.quantity} × {formatPrice(it.price)}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-xs font-black text-gray-750 dark:text-gray-250 flex-shrink-0">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-3.5 border-t border-gray-50 dark:border-zinc-800/60 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Consignment Total</span>
                      <strong className="font-mono text-base font-black text-[#008D7F]">
                        {formatPrice(foundOrder.total)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 5. Support Line Section */}
                <div className="p-5 bg-teal-50/20 dark:bg-zinc-955 border border-dashed border-[#008D7F]/30 dark:border-zinc-830 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Need shipment modifications or support?</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Our priority hotline is available 24 hours daily to assist your courier needs.</p>
                  </div>
                  <a
                    href="tel:+8801700000000"
                    className="px-4 py-2 bg-[#008D7F] hover:bg-[#007065] text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Contact Logistics support
                  </a>
                </div>

              </motion.div>
            ) : searched ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                tabIndex={0}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 rounded-2xl p-16 text-center text-gray-400 space-y-4"
              >
                <X className="w-12 h-12 text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-full mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-base text-gray-800 dark:text-gray-200">Consignment Not Identified</h3>
                  <p className="text-xs max-w-sm mx-auto font-medium leading-relaxed leading-relaxed">
                    Make sure the order reference format mimics <strong>ord_something</strong> exactly, and verify that the corresponding email is used on checkout.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 rounded-3xl p-16 text-center text-gray-400 space-y-4"
              >
                <Search className="w-12 h-12 text-teal-600 bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded-full mx-auto stroke-[1.5]" />
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-base text-gray-800 dark:text-gray-200">Awaiting your search</h3>
                  <p className="text-xs max-w-sm mx-auto font-medium leading-relaxed">
                    Enter your specific credentials in the search form to pinpoint shipping details, estimated deliveries, and current dispatch locations in real-time.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
