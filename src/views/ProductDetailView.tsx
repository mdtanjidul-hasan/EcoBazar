import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Review } from '../types';
import { 
  Star, Heart, ShoppingBag, ArrowLeft, Send, Share2, 
  Sparkles, ShieldCheck, Zap, Globe, RefreshCcw, Truck, 
  Layers, ChevronLeft, ChevronRight, Play, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailViewProps {
  productId: string;
  navigate: (path: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId, navigate }) => {
  const { 
    products, reviews, addToCart, addToWishlist, removeFromWishlist, 
    wishlist, addReview, currency, lang, formatPrice 
  } = useStore();

  const product = products.find(p => p._id === productId);

  // Record to recently viewed logs
  useEffect(() => {
    if (productId) {
      try {
        const saved = JSON.parse(localStorage.getItem('eb_recently_viewed') || '[]') as string[];
        const next = [productId, ...saved.filter(id => id !== productId)].slice(0, 10);
        localStorage.setItem('eb_recently_viewed', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-rose-600">Premium Item Not Found</h2>
        <p className="text-sm text-slate-500">The product you correspond to has been moved or is currently out of stock.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#00B894] text-white font-extrabold rounded-xl text-sm"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Large gallery zoom states
  const [activeImage, setActiveImage] = useState(product.gallery[0] || '');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'video'>('photo');
  const [quantity, setQuantity] = useState(1);
  const [activeDetailTab, setActiveDetailTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping' | 'assistant'>('desc');

  // Review states
  const [revRating, setRevRating] = useState(5);
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revComment, setRevComment] = useState('');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // AI Shopping Assistant chat states
  const [assistantMessages, setAssistantMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { 
      role: 'assistant', 
      content: lang === 'EN' 
        ? `Hello! I am your AI Shopping Assistant representing the beautiful "${product.title}". Feel free to ask me anything about its design, technical specs, pricing, shipping timeline, or availability!` 
        : `হ্যালো! আমি আপনার এই পণ্যের ("${product.title}") কৃত্রিম বুদ্ধিমত্তা শপিং সহকারী। এই কারুশিল্প বা গ্যাজেটটির ডিজাইন, স্পেসিফিকেশন, দাম, শিপিং বা স্টক নিয়ে যেকোন প্রশ্ন আমাকে করতে পারেন!` 
    }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const assistantScrollRef = useRef<HTMLDivElement>(null);

  // Update scroll on message update
  useEffect(() => {
    if (assistantScrollRef.current) {
      assistantScrollRef.current.scrollTop = assistantScrollRef.current.scrollHeight;
    }
  }, [assistantMessages]);

  const handleSendAssistantMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!assistantInput.trim() || isAssistantTyping) return;

    const userText = assistantInput.trim();
    setAssistantInput('');
    
    // Append user message
    const updatedMessages = [...assistantMessages, { role: 'user' as const, content: userText }];
    setAssistantMessages(updatedMessages);
    setIsAssistantTyping(true);

    try {
      const response = await fetch('/api/shopping-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          messages: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error('Upstream assistant error');
      }

      const data = await response.json();
      setAssistantMessages(prev => [...prev, { role: 'assistant' as const, content: data.reply }]);
    } catch (err) {
      console.error(err);
      setAssistantMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: lang === 'EN' 
          ? "I am currently experiencing connection difficulties. Please check your network or try again." 
          : "আমি এই মুহূর্তে সংযোগ সমস্যায় ভুগছি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" 
      }]);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  // Multi-tier AI Recommendations arrays
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [customersAlsoBought, setCustomersAlsoBought] = useState<Product[]>([]);
  const [youMayLike, setYouMayLike] = useState<Product[]>([]);
  
  // Custom manual carousel slider scroll refs
  const sliderRef1 = useRef<HTMLDivElement>(null);
  const sliderRef2 = useRef<HTMLDivElement>(null);
  const sliderRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.gallery[0] || '');
    }
  }, [product]);

  // Seed standard triple recommendation slices
  useEffect(() => {
    if (products.length > 0 && product) {
      // Frequently Bought Together: Different category items for complementary bundle
      const freq = products.filter(p => p._id !== product._id && p.category !== product.category).slice(0, 6);
      
      // Customers Also Bought: Same category popular items
      const also = products.filter(p => p._id !== product._id && p.category === product.category).slice(0, 6);
      
      // You May Like: High-quality trending selection
      const like = products.filter(p => p._id !== product._id && p.rating >= 4.6).slice(0, 6);

      setFrequentlyBought(freq);
      setCustomersAlsoBought(also);
      setYouMayLike(like);
    }
  }, [products, product]);

  const convertPrice = (bdtPrice: number) => {
    return formatPrice(bdtPrice);
  };

  const getOriginalPrice = (bdtPrice: number) => {
    return formatPrice(bdtPrice * 1.45);
  };

  const productReviews = reviews.filter(r => r.productId === product._id);
  const hasWish = wishlist.some(item => item._id === product._id);

  // Interactive Hover zoom calculation
  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeaveZoom = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) {
      alert('Please provide your name and experience feedback text.');
      return;
    }
    addReview(product._id, revName, revEmail || 'verified_buyer@gmail.com', revComment, revRating);
    setRevName('');
    setRevEmail('');
    setRevComment('');
    setRevRating(5);
    alert('Thank you! Your premium review has been submitted successfully.');
  };

  // Slider controls helper
  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-16 pb-20 text-left px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Back to shop navigation header */}
      <div className="pt-4">
        <button
          onClick={() => navigate('/shop')}
          className="group inline-flex items-center gap-2 text-xs font-extrabold text-[#1E293B]/60 hover:text-[#00B894] transition uppercase tracking-wider"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to EcoBazar Catalog
        </button>
      </div>

      {/* Main Product Presentation Structure */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
        
        {/* LEFT COLUMN: Gallery with Zoom & Video Previews */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-50 border border-slate-150 rounded-[24px] overflow-hidden relative shadow-sm">
            
            {activeMediaTab === 'photo' ? (
              // Enhanced Zoom-on-Hover Image Canvas
              <div 
                className="aspect-square relative overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMoveZoom}
                onMouseLeave={handleMouseLeaveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-200"
                />
                
                {/* Magnified zoom overlay */}
                <div
                  className="absolute inset-0 pointer-events-none border border-slate-200"
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '200%'
                  }}
                />
              </div>
            ) : (
              // Immersive video preview tab
              <div className="aspect-square bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="w-20 h-20 rounded-full bg-[#00B894]/25 text-[#00B894] flex items-center justify-center text-2xl animate-ping absolute"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00B894] to-[#008D7F] text-white flex items-center justify-center text-2xl relative shadow-lg">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                
                <div className="space-y-2 mt-6 relative z-10 max-w-xs">
                  <h4 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-widest">ECOBAZAR STUDIOS</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Watch cinematic interactive 4K video recording, showcasing organic material details & smart dynamic testing.
                  </p>
                </div>
              </div>
            )}

            {/* Float Saved Heart */}
            <button
              onClick={() => addToWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition active:scale-95 duration-200 z-10 ${
                hasWish ? 'bg-rose-500 text-white' : 'bg-white/95 text-slate-400 hover:text-rose-500 backdrop-blur-md'
              }`}
            >
              <Heart className="w-5 h-5" fill={hasWish ? 'currentColor' : 'none'} />
            </button>

            {/* Photo / Video Switcher pills */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-10 select-none">
              <button
                onClick={() => setActiveMediaTab('photo')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition ${
                  activeMediaTab === 'photo' ? 'bg-[#1E293B] text-white' : 'bg-white/90 text-slate-700 backdrop-blur-md'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition flex items-center gap-1 ${
                  activeMediaTab === 'video' ? 'bg-[#00B894] text-white' : 'bg-white/90 text-slate-705 backdrop-blur-md'
                }`}
              >
                Video Preview
              </button>
            </div>
          </div>

          {/* Multiple Thumbnails List Grid */}
          <div className="flex gap-3 overflow-x-auto pb-2 select-none">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  setActiveMediaTab('photo');
                }}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-50 transition p-0.5 ${
                  activeImage === img && activeMediaTab === 'photo' 
                    ? 'border-[#00B894] shadow-sm scale-95' 
                    : 'border-slate-100 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Spec Thumbnail" className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Specific Attributes & Shopping Cart Drivers */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header metadata */}
          <div className="space-y-3">
            <span className="inline-block text-[10px] font-extrabold text-[#00B894] uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full">
              {product.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Star average counts */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-[#D4AF37]' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-800">
                {product.rating} Rating Stars
              </span>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs text-[#00B894] font-extrabold tracking-wide">
                {productReviews.length} Verified Buyer Reviews
              </span>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-extrabold tracking-wider uppercase">
                {product.sell_number || product.sellNumber || 105} Global Shipments Sync
              </span>
            </div>
          </div>

          {/* Pricing with markdown gold discount badges */}
          <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider leading-none">MSRP Standard retail price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-slate-400 line-through text-sm font-semibold">
                  {getOriginalPrice(product.price)}
                </span>
                <span className="font-display font-black text-3xl text-[#00B894]">
                  {convertPrice(product.price)}
                </span>
                <span className="ml-2 text-[10px] font-black uppercase text-[#D4AF37] bg-white border border-[#D4AF37]/20 px-2 py-0.5 rounded-md">
                  Save 45%
                </span>
              </div>
            </div>

            {/* Live custom Stock Indicator */}
            {product.quantity > 0 ? (
              <div className="text-right space-y-1">
                <span className="inline-flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-black text-red-650 uppercase block">
                  Limited stock (Only {product.quantity} units left)
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-400 uppercase bg-slate-200 px-3 py-1 rounded-full">
                Temporarily Sold Out
              </span>
            )}
          </div>

          {/* Sourced summary */}
          <p className="text-slate-500 text-sm leading-relaxed font-semibold">
            {product.description}
          </p>

          {/* Core conversion indicators */}
          <div className="grid grid-cols-3 gap-3 border-y border-slate-150 py-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#00B894]" /> Worldwide Shipping
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCcw className="w-4 h-4 text-[#D4AF37]" /> 30-Day Money Back
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00B894]" /> Premium Guarantee
            </div>
          </div>

          {/* Selector dials with "Add" and "Buy" triggers */}
          {product.quantity > 0 && (
            <div className="space-y-4 pt-2">
              
              {/* Quantity Dials */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-extrabold text-[#1E293B]/60 uppercase tracking-widest">Select Quantity:</span>
                <div className="flex items-center border border-slate-200 bg-white p-1 rounded-xl shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-sm font-black bg-slate-100/50 text-[#1E293B] rounded-lg active:scale-90 transition-transform select-none"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs font-extrabold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="w-8 h-8 flex items-center justify-center text-sm font-black bg-slate-100/50 text-[#1E293B] rounded-lg active:scale-90 transition-transform select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
                    isAddedFeedback 
                      ? 'bg-emerald-600 shadow-emerald-700/10' 
                      : 'bg-gradient-to-r from-[#00B894] to-[#008D7F] hover:from-[#008D7F] hover:to-[#00B894]'
                  }`}
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  {isAddedFeedback ? 'Added to drawer! ✓' : 'Add to Shopping Basket'}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4.5 h-4.5 fill-current text-[#D4AF37]" />
                  Direct Express Checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Tabs navigation list: Details / Specs / Reviews */}
      <section className="space-y-6 pt-10 border-t border-slate-150">
        <div className="flex border-b border-slate-150 overflow-x-auto pb-1 gap-6 text-xs uppercase font-extrabold select-none">
          <button
            onClick={() => setActiveDetailTab('desc')}
            className={`pb-3 border-b-2 transition shrink-0 tracking-wider ${
              activeDetailTab === 'desc' ? 'border-[#00B894] text-[#00B894]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveDetailTab('specs')}
            className={`pb-3 border-b-2 transition shrink-0 tracking-wider ${
              activeDetailTab === 'specs' ? 'border-[#00B894] text-[#00B894]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Technical Specs
          </button>
          <button
            onClick={() => setActiveDetailTab('shipping')}
            className={`pb-3 border-b-2 transition shrink-0 tracking-wider ${
              activeDetailTab === 'shipping' ? 'border-[#00B894] text-[#00B894]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Worldwide Shipping Details
          </button>
          <button
            onClick={() => setActiveDetailTab('reviews')}
            className={`pb-3 border-b-2 transition shrink-0 tracking-wider flex items-center gap-1.5 ${
              activeDetailTab === 'reviews' ? 'border-[#00B894] text-[#00B894]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Reviews ({productReviews.length})
          </button>
          <button
            onClick={() => setActiveDetailTab('assistant')}
            className={`pb-3 border-b-2 transition shrink-0 tracking-wider flex items-center gap-1.5 ${
              activeDetailTab === 'assistant' ? 'border-[#00B894] text-[#00B894]' : 'border-transparent text-slate-450 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-100" /> AI Q&A Assistant
          </button>
        </div>

        {/* Tab contents panel rendering */}
        <div className="bg-slate-50 border border-slate-150 p-6 sm:p-8 rounded-[24px]">
          {activeDetailTab === 'desc' && (
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-lg text-[#1E293B]">Design Inspiration & Philosophy</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Adhering strictly to standard EcoBazar design blueprints, this product combines natural, high-strength sustainably harvested woods, hypoallergenic alloy metals, and responsive microchip components. Highly versatile, it is curated to enrich your premium lifestyle without adding synthetic chemical emissions to the environment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]"></span> Hypoallergenic skin-safe materials
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]"></span> Sustainably harvested wood panel components
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]"></span> Low electrical discharge efficiency rating
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B894]"></span> Included luxury velvet jewelry travel pouch
                </div>
              </div>
            </div>
          )}

          {activeDetailTab === 'specs' && (
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-lg text-[#1E293B]">Specifications Sheet</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-slate-100 p-3 font-extrabold text-slate-700">
                  <span>Parameter</span>
                  <span className="col-span-2">Technical Value</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-200 font-medium text-slate-550">
                  <span>Material Sourcing</span>
                  <span className="col-span-2">Organic sustainably harvested fibers, hypoallergenic surgical-grade alloy</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-200 font-medium text-slate-550">
                  <span>Chemical Rating</span>
                  <span className="col-span-2">100% Free from Lead, Cadmium, BPA, or heavy-metal polymers</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-200 font-medium text-slate-550">
                  <span>Weight index</span>
                  <span className="col-span-2">Extremely lightweight, balanced density optimized for ergonomic travel</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-medium text-slate-550">
                  <span>Supplier Origin</span>
                  <span className="col-span-2">EcoBazar Certified Fair-Trade Green Manufacturing Hubs</span>
                </div>
              </div>
            </div>
          )}

          {activeDetailTab === 'shipping' && (
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-lg text-[#1E293B] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#00B894]" /> Verified Worldwide Tracked Shipping
              </h4>
              <p className="text-xs text-slate-505 font-medium leading-relaxed">
                Enjoy hassle-free insured global delivery. All orders are packed inside bespoke biodegradable hard cardboard cases to prevent transit breakage, and synchronized automatically with private shipping labels.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-600 mt-4">
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-center space-y-1">
                  <p className="text-[#00B894]">STANDARD COURIER</p>
                  <p className="font-black text-slate-700">Free global transit</p>
                  <p className="text-[10px] text-slate-400 font-normal">7-12 business days delivery</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-center space-y-1">
                  <p className="text-[#D4AF37]">PRIORITY EXPRESS</p>
                  <p className="font-black text-slate-700">Add ৳450 BDT</p>
                  <p className="text-[10px] text-slate-400 font-normal">3-5 business days tracked</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100 text-center space-y-1">
                  <p className="text-[#00B894]">FULLY INSURED</p>
                  <p className="font-black text-slate-700">Zero Charge Damage Liability</p>
                  <p className="text-[10px] text-slate-400 font-normal">Instant replacements if broken</p>
                </div>
              </div>
            </div>
          )}

          {activeDetailTab === 'reviews' && (
            <div className="space-y-8 text-left">
              <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-1.5">
                  <h4 className="font-display font-extrabold text-lg text-[#1E293B]">Client Testimonials</h4>
                  <p className="text-xs text-slate-450 font-medium">True reviews from shoppers who purchased this model directly.</p>
                </div>
                
                {/* Score summary */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black font-display text-[#00B894]">{product.rating}</span>
                  <div>
                    <div className="flex text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mt-1">Based on {productReviews.length} listings</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold italic py-4">Be the first to provide feedback on this luxury masterpiece!</p>
                ) : (
                  productReviews.map((r, i) => (
                    <div key={r._id || i} className="border-b border-slate-150 pb-6 last:border-0 last:pb-0 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-[#00B894]/10 text-[#00B894] font-black text-xs flex items-center justify-center">
                            {r.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <h5 className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                              {r.name} 
                              <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Verified Purchase</span>
                            </h5>
                            <span className="text-[10px] text-slate-400">{r.date || 'Just now'}</span>
                          </div>
                        </div>

                        {/* Single Star */}
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star key={starIdx} className={`w-3.5 h-3.5 ${starIdx < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed pl-10">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-slate-200 space-y-4">
                <h5 className="font-display font-extrabold text-sm text-[#1E293B] uppercase tracking-wider">Submit Your Verified Rating</h5>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">Select Stars:</span>
                  <div className="flex text-amber-400 gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRevRating(s)}
                        className="text-amber-400 hover:scale-110 active:scale-95 transition"
                      >
                        <Star className={`w-5 h-5 ${s <= revRating ? 'fill-current' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Charlotte Rose"
                      className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:border-[#00B894] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Your Email (Optional)</label>
                    <input
                      type="email"
                      value={revEmail}
                      onChange={(e) => setRevEmail(e.target.value)}
                      placeholder="e.g. charlotte@example.com"
                      className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:border-[#00B894] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Your Experience Feedback *</label>
                  <textarea
                    required
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Write detailed review details on silver ornaments or smart cooling motors..."
                    className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:border-[#00B894] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1E293B] hover:bg-[#00B894] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition duration-350"
                >
                  Post Review
                </button>
              </form>
            </div>
          )}

          {activeDetailTab === 'assistant' && (
            <div className="space-y-6">
              {/* Header section with assistant icon, name, and subtitle */}
              <div id="ai-assistant-header" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-150 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00B894] to-emerald-600 flex items-center justify-center text-white shadow relative">
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      EcoBazar AI Expert Companion
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Powered by Gemini 3.5 Flash • Active Q&A
                    </span>
                  </div>
                </div>
                {/* Suggestions chip row */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  <span className="text-slate-400 self-center">Instant Questions:</span>
                  {[
                    lang === 'EN' ? "Specs?" : "স্পেসিফিকেশন কি?",
                    lang === 'EN' ? "Price details?" : "দাম কত?",
                    lang === 'EN' ? "Is it in stock?" : "স্টকে আছে?",
                    lang === 'EN' ? "Shipping terms?" : "শিপিং কি ফ্রি?"
                  ].map((suggest, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      id={`suggest-btn-${sIdx}`}
                      onClick={() => {
                        setAssistantInput(suggest);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-[#00B894]/10 hover:text-[#00B894] text-slate-600 rounded-lg border border-slate-200 uppercase transition"
                    >
                      {suggest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat dialogue display box */}
              <div 
                ref={assistantScrollRef}
                id="ai-assistant-chatbox"
                className="h-[320px] overflow-y-auto border border-slate-200 bg-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner"
              >
                {assistantMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    id={`msg-bubble-${idx}`}
                    className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {/* Icon / Avatar */}
                    {msg.role === 'assistant' ? (
                      <div className="w-7 h-7 rounded-lg bg-[#00B894]/10 text-[#00B894] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 fill-current" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black uppercase">Me</span>
                      </div>
                    )}

                    {/* Speech Bubble body */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isAssistantTyping && (
                  <div id="ai-assistant-typing" className="flex gap-3 max-w-[80%] animate-pulse">
                    <div className="w-7 h-7 rounded-lg bg-[#00B894]/10 text-[#00B894] flex items-center justify-center select-none shrink-0">
                      <Sparkles className="w-4 h-4 fill-current" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Typing Form */}
              <form onSubmit={handleSendAssistantMessage} id="ai-assistant-form" className="flex gap-2">
                <input
                  type="text"
                  id="ai-assistant-input"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder={lang === 'EN' ? "Type a question about this product..." : "এই পণ্যটি সম্পর্কে কিছু লিখুন..."}
                  className="flex-1 text-xs p-3.5 border border-slate-200 bg-white rounded-xl focus:border-[#00B894] outline-none font-semibold shadow-sm"
                  disabled={isAssistantTyping}
                />
                <button
                  type="submit"
                  id="ai-assistant-send-btn"
                  disabled={isAssistantTyping || !assistantInput.trim()}
                  className="px-5 bg-[#00B894] hover:bg-[#008D7F] disabled:bg-slate-200 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow hover:shadow-md flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'EN' ? "Send" : "পাঠান"}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* THREE-TIER AI PRODUCT RECOMMENDATIONS */}
      {/* 1. FREQUENTLY BOUGHT TOGETHER */}
      <section className="space-y-6 pt-16 border-t border-slate-200">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <h3 className="font-display font-extrabold text-xl text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" /> Frequently Bought Together
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Customers often bundle these compatible beauty, sport and smart elements together.</p>
          </div>
          <div className="flex gap-2 select-none">
            <button
              onClick={() => scrollSlider(sliderRef1, 'left')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 active:scale-95 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider(sliderRef1, 'right')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 active:scale-95 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div 
          ref={sliderRef1}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {frequentlyBought.map((p) => (
            <div
              key={p._id + '_freq'}
              onClick={() => {
                navigate(`/product/${p._id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-64 shrink-0 snap-start bg-white border border-slate-150 rounded-[24px] p-4 space-y-3 cursor-pointer hover:shadow-lg transition duration-300 relative group"
            >
              <div className="h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                <img src={p.gallery[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-103 transition" />
                <span className="absolute top-2 left-2 text-[8px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                  {p.category}
                </span>
              </div>
              <div className="text-left space-y-1">
                <h4 className="font-display font-bold text-xs text-[#1E293B] line-clamp-1 group-hover:text-[#00B894] transition">{p.title}</h4>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-display text-xs text-[#00B894] font-extrabold">{convertPrice(p.price)}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1);
                      alert('Item added to shopping drawer successfully!');
                    }}
                    className="p-2 bg-slate-100 hover:bg-[#00B894] text-slate-600 hover:text-white rounded-lg transition"
                    title="Add bundle item"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CUSTOMERS ALSO BOUGHT */}
      <section className="space-y-6 pt-10 border-t border-slate-150">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <h3 className="font-display font-extrabold text-xl text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00B894]" /> Customers Also Bought
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Popular signature models within our luxury {product.category} boutique range.</p>
          </div>
          <div className="flex gap-2 select-none">
            <button
              onClick={() => scrollSlider(sliderRef2, 'left')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 active:scale-95 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider(sliderRef2, 'right')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 active:scale-95 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div 
          ref={sliderRef2}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {customersAlsoBought.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold italic py-4">Checking alternative category products...</p>
          ) : (
            customersAlsoBought.map((p) => (
              <div
                key={p._id + '_also'}
                onClick={() => {
                  navigate(`/product/${p._id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-64 shrink-0 snap-start bg-white border border-slate-150 rounded-[24px] p-4 space-y-3 cursor-pointer hover:shadow-lg transition duration-300 relative group"
              >
                <div className="h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                  <img src={p.gallery[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-103 transition" />
                  <span className="absolute top-2 left-2 text-[8px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                    {p.category}
                  </span>
                </div>
                <div className="text-left space-y-1">
                  <h4 className="font-display font-bold text-xs text-[#1E293B] line-clamp-1 group-hover:text-[#00B894] transition">{p.title}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <p className="font-display text-xs text-[#00B894] font-extrabold">{convertPrice(p.price)}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p, 1);
                        alert('Item added to shopping drawer successfully!');
                      }}
                      className="p-2 bg-slate-100 hover:bg-[#00B894] text-slate-600 hover:text-white rounded-lg transition"
                      title="Add to Basket"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. YOU MAY LIKE */}
      <section className="space-y-6 pt-10 border-t border-slate-150">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <h3 className="font-display font-extrabold text-xl text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" /> You May Like
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Globally trending flagship items hand-selected by the design team.</p>
          </div>
          <div className="flex gap-2 select-none">
            <button
              onClick={() => scrollSlider(sliderRef3, 'left')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 active:scale-95 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider(sliderRef3, 'right')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 active:scale-95 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div 
          ref={sliderRef3}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {youMayLike.map((p) => (
            <div
              key={p._id + '_like'}
              onClick={() => {
                navigate(`/product/${p._id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-64 shrink-0 snap-start bg-white border border-slate-150 rounded-[24px] p-4 space-y-3 cursor-pointer hover:shadow-lg transition duration-300 relative group"
            >
              <div className="h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                <img src={p.gallery[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-103 transition" />
                <span className="absolute top-2 left-2 text-[8px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                  {p.category}
                </span>
              </div>
              <div className="text-left space-y-1">
                <h4 className="font-display font-bold text-xs text-[#1E293B] line-clamp-1 group-hover:text-[#00B894] transition">{p.title}</h4>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-display text-xs text-[#00B894] font-extrabold">{convertPrice(p.price)}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p, 1);
                      alert('Item added to shopping drawer successfully!');
                    }}
                    className="p-2 bg-slate-100 hover:bg-[#00B894] text-slate-600 hover:text-white rounded-lg transition"
                    title="Add to Basket"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
