import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { motion } from 'motion/react';
import { 
  ArrowLeftRight, 
  ShoppingCart, 
  Trash2, 
  Star, 
  TrendingUp, 
  Package, 
  Palette, 
  Info, 
  Check, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  DollarSign,
  Heart
} from 'lucide-react';

interface CompareViewProps {
  navigate: (path: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ navigate }) => {
  const { 
    products, 
    cart, 
    addToCart, 
    addToWishlist, 
    wishlist, 
    removeFromWishlist,
    compareList, 
    removeFromCompare,
    formatPrice,
    theme 
  } = useStore();

  const [product1, setProduct1] = useState<Product | null>(null);
  const [product2, setProduct2] = useState<Product | null>(null);

  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  const [isOpenDropdown1, setIsOpenDropdown1] = useState(false);
  const [isOpenDropdown2, setIsOpenDropdown2] = useState(false);

  const [highlightCheaper, setHighlightCheaper] = useState(true);
  const [highlightBetterRated, setHighlightBetterRated] = useState(false);

  // Initialize from compareList if available
  useEffect(() => {
    if (compareList.length > 0) {
      setProduct1(compareList[0]);
    } else if (products.length > 0) {
      setProduct1(products[0]);
    }

    if (compareList.length > 1) {
      setProduct2(compareList[1]);
    } else if (products.length > 1) {
      // Find a product from a different category or just the second product
      const p1Category = compareList[0]?.category || products[0]?.category;
      const filtered = products.filter(p => p._id !== (compareList[0]?._id || products[0]?._id));
      const differentCat = filtered.find(p => p.category !== p1Category);
      setProduct2(differentCat || filtered[0] || null);
    }
  }, [compareList, products]);

  // Clean dropdown closures on outside clicks
  useEffect(() => {
    const closeDropdowns = () => {
      setIsOpenDropdown1(false);
      setIsOpenDropdown2(false);
    };
    window.addEventListener('click', closeDropdowns);
    return () => window.removeEventListener('click', closeDropdowns);
  }, []);

  const handleSwap = () => {
    const temp = product1;
    setProduct1(product2);
    setProduct2(temp);
  };

  const getFilteredProducts = (query: string, excludeId?: string) => {
    return products.filter(p => {
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) || 
                         p.category.toLowerCase().includes(query.toLowerCase());
      const notExcluded = excludeId ? p._id !== excludeId : true;
      return matchQuery && notExcluded;
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleToggleWishlist = (product: Product) => {
    const inWishlist = wishlist.some(p => p._id === product._id);
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // Difference calculator utilities
  const isCheaper = (p: Product | null, other: Product | null) => {
    if (!p || !other) return false;
    return p.price < other.price;
  };

  const hasHigherRating = (p: Product | null, other: Product | null) => {
    if (!p || !other) return false;
    return p.rating > other.rating;
  };

  const p1FilteredList = getFilteredProducts(searchQuery1, product2?._id);
  const p2FilteredList = getFilteredProducts(searchQuery2, product1?._id);

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Dynamic Header Frame */}
      <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] bg-teal-50 dark:bg-teal-950/40 text-[#008D7F] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Smart Shopping
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Product Comparison Tool
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed max-w-xl">
              Select any two products from our high-class collection to analyze specifications, popularity stats, colors, and direct pricing side-by-side.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-3 border border-gray-200 dark:border-zinc-800 hover:border-[#008D7F] text-gray-600 dark:text-gray-300 dark:hover:text-[#008D7F] text-xs font-bold rounded-xl transition"
            >
              Back to Catalog
            </button>
            <button
              onClick={handleSwap}
              disabled={!product1 || !product2}
              className="px-5 py-3 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-2 transition border border-gray-200 dark:border-zinc-700"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap Positions
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Selection Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Product Selection 1 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-805 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product One (Left Column)</span>
              {product1 && (
                <button 
                  onClick={() => setProduct1(null)} 
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear selection
                </button>
              )}
            </div>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsOpenDropdown1(!isOpenDropdown1)}
                className="w-full flex items-center justify-between bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#008D7F] text-left transition"
              >
                <span className="truncate">
                  {product1 ? product1.title : 'Choose a product to compare...'}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
              </button>

              {isOpenDropdown1 && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30 py-1.5 scrollbar-thin">
                  <div className="px-3 pb-2 pt-1 border-b border-gray-50 dark:border-zinc-800 mb-1">
                    <input
                      type="text"
                      placeholder="Type name or category..."
                      value={searchQuery1}
                      onChange={(e) => setSearchQuery1(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#008D7F]"
                    />
                  </div>
                  {p1FilteredList.length === 0 ? (
                    <div className="px-4 py-3 text-xs font-semibold text-gray-400 text-center">
                      No matching products
                    </div>
                  ) : (
                    p1FilteredList.map((prod) => (
                      <button
                        key={prod._id}
                        onClick={() => {
                          setProduct1(prod);
                          setIsOpenDropdown1(false);
                          setSearchQuery1('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#008D7F]/5 hover:text-[#008D7F] text-xs font-semibold text-gray-750 dark:text-gray-250 flex items-center justify-between border-b border-gray-50/20 last:border-0"
                      >
                        <span className="truncate mr-2">{prod.title}</span>
                        <span className="font-mono text-[10px] text-gray-400 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/60 px-1.5 py-0.5 rounded flex-shrink-0">
                          {formatPrice(prod.price)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {product1 ? (
            <div className="pt-2 flex items-center gap-4 border-t border-gray-50 dark:border-zinc-800/60 mt-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-950 flex-shrink-0 border border-gray-100 dark:border-zinc-800">
                <img 
                  src={product1.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200'} 
                  alt={product1.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-bold px-2 py-0.5 rounded-md">
                  {product1.category}
                </span>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate mt-1">
                  {product1.title}
                </h4>
                <p className="text-xs font-bold text-[#008D7F] font-mono mt-0.5">
                  {formatPrice(product1.price)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-zinc-950/20 rounded-xl border border-dashed border-gray-250 dark:border-zinc-800/80 text-center text-gray-400 mt-4 min-h-[5rem]">
              <HelpCircle className="w-6 h-6 mb-1 text-gray-300" />
              <p className="text-[11px] font-semibold">Blank selection slot</p>
            </div>
          )}
        </div>

        {/* Product Selection 2 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-855 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Two (Right Column)</span>
              {product2 && (
                <button 
                  onClick={() => setProduct2(null)} 
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear selection
                </button>
              )}
            </div>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsOpenDropdown2(!isOpenDropdown2)}
                className="w-full flex items-center justify-between bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#008D7F] text-left transition"
              >
                <span className="truncate">
                  {product2 ? product2.title : 'Choose a product to compare...'}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" />
              </button>

              {isOpenDropdown2 && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30 py-1.5 scrollbar-thin">
                  <div className="px-3 pb-2 pt-1 border-b border-gray-50 dark:border-zinc-800 mb-1">
                    <input
                      type="text"
                      placeholder="Type name or category..."
                      value={searchQuery2}
                      onChange={(e) => setSearchQuery2(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#008D7F]"
                    />
                  </div>
                  {p2FilteredList.length === 0 ? (
                    <div className="px-4 py-3 text-xs font-semibold text-gray-400 text-center">
                      No matching products
                    </div>
                  ) : (
                    p2FilteredList.map((prod) => (
                      <button
                        key={prod._id}
                        onClick={() => {
                          setProduct2(prod);
                          setIsOpenDropdown2(false);
                          setSearchQuery2('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#008D7F]/5 hover:text-[#008D7F] text-xs font-semibold text-gray-750 dark:text-gray-250 flex items-center justify-between border-b border-gray-50/20 last:border-0"
                      >
                        <span className="truncate mr-2">{prod.title}</span>
                        <span className="font-mono text-[10px] text-gray-400 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/60 px-1.5 py-0.5 rounded flex-shrink-0">
                          {formatPrice(prod.price)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {product2 ? (
            <div className="pt-2 flex items-center gap-4 border-t border-gray-50 dark:border-zinc-800/60 mt-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-950 flex-shrink-0 border border-gray-100 dark:border-zinc-800">
                <img 
                  src={product2.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200'} 
                  alt={product2.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-bold px-2 py-0.5 rounded-md">
                  {product2.category}
                </span>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate mt-1">
                  {product2.title}
                </h4>
                <p className="text-xs font-bold text-[#008D7F] font-mono mt-0.5">
                  {formatPrice(product2.price)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-zinc-950/20 rounded-xl border border-dashed border-gray-250 dark:border-zinc-800/80 text-center text-gray-400 mt-4 min-h-[5rem]">
              <HelpCircle className="w-6 h-6 mb-1 text-gray-300" />
              <p className="text-[11px] font-semibold">Blank selection slot</p>
            </div>
          )}
        </div>

      </div>

      {/* Highlights & Settings Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-6 bg-gray-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-gray-450 uppercase tracking-widest">Filters:</span>
          
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={highlightCheaper}
              onChange={(e) => setHighlightCheaper(e.target.checked)}
              className="accent-[#008D7F] rounded w-3.5 h-3.5"
            />
            <span className="text-xs font-semibold text-gray-650 dark:text-gray-300">Highlight Cheaper Price</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={highlightBetterRated}
              onChange={(e) => setHighlightBetterRated(e.target.checked)}
              className="accent-[#008D7F] rounded w-3.5 h-3.5"
            />
            <span className="text-xs font-semibold text-gray-650 dark:text-gray-300">Highlight Best Rated</span>
          </label>
        </div>

        {product1 && product2 && product1.category !== product2.category && (
          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Comparing products in different categories
          </div>
        )}
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 rounded-3xl overflow-hidden shadow-sm">
        
        {(!product1 && !product2) ? (
          <div className="py-24 text-center text-gray-400 space-y-3">
            <ArrowLeftRight className="w-12 h-12 mx-auto text-gray-300 stroke-[1.25]" />
            <h3 className="font-display font-bold text-lg text-gray-750 dark:text-gray-250">No products selected</h3>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              Use the selectors above to assign premium products into both comparison slots to analyze their features side-by-side.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-950/30 border-b border-gray-100 dark:border-zinc-800">
                  <th className="p-6 font-display font-bold text-xs text-gray-400 uppercase tracking-widest w-1/4">Specification</th>
                  <th className="p-6 font-display font-bold text-sm text-gray-800 dark:text-gray-200 w-3/8 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? 'Product 1 Details' : '(Slot empty)'}
                  </th>
                  <th className="p-6 font-display font-bold text-sm text-gray-800 dark:text-gray-200 w-3/8 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? 'Product 2 Details' : '(Slot empty)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                
                {/* 1. Header Card Row */}
                <tr className="align-top">
                  <td className="p-6 bg-slate-50/10 dark:bg-zinc-955/2 flex flex-col justify-start gap-1">
                    <span className="font-bold text-gray-800 dark:text-gray-250">Overview</span>
                    <span className="text-[10px] text-gray-400">Photo & Primary Title</span>
                  </td>
                  
                  {/* Column 1 */}
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <div className="space-y-4">
                        <div className="aspect-square w-36 h-36 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 select-none">
                          <img 
                            src={product1.gallery[0]} 
                            alt={product1.title} 
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-gray-100 leading-snug">
                          {product1.title}
                        </h3>
                        <p className="text-xs text-gray-450 font-semibold line-clamp-2 leading-relaxed">
                          {product1.description}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic font-medium">Please select a product</span>
                    )}
                  </td>

                  {/* Column 2 */}
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <div className="space-y-4">
                        <div className="aspect-square w-36 h-36 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 select-none">
                          <img 
                            src={product2.gallery[0]} 
                            alt={product2.title} 
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-gray-100 leading-snug">
                          {product2.title}
                        </h3>
                        <p className="text-xs text-gray-450 font-semibold line-clamp-2 leading-relaxed">
                          {product2.description}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic font-medium">Please select a product</span>
                    )}
                  </td>
                </tr>

                {/* 2. Price Row */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Retail Price</td>
                  
                  {/* Column 1 */}
                  <td className={`p-6 border-l border-gray-100 dark:border-zinc-800 transition font-mono ${
                    product1 && product2 && highlightCheaper && isCheaper(product1, product2)
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {product1 ? (
                      <div className="flex items-center gap-1.5 text-lg font-bold">
                        <span>{formatPrice(product1.price)}</span>
                        {product1 && product2 && highlightCheaper && isCheaper(product1, product2) && (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded font-sans uppercase font-extrabold tracking-wider">
                            Best Value
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Column 2 */}
                  <td className={`p-6 border-l border-gray-100 dark:border-zinc-800 transition font-mono ${
                    product1 && product2 && highlightCheaper && isCheaper(product2, product1)
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {product2 ? (
                      <div className="flex items-center gap-1.5 text-lg font-bold">
                        <span>{formatPrice(product2.price)}</span>
                        {product1 && product2 && highlightCheaper && isCheaper(product2, product1) && (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded font-sans uppercase font-extrabold tracking-wider">
                            Best Value
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 3. Category & Taxonomy */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Category</td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <div className="space-y-1">
                        <span className="text-xs bg-slate-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md font-bold">
                          {product1.category}
                        </span>
                        {product1.sub_category && (
                          <p className="text-[11px] text-gray-400 mt-1 font-semibold">Sub-category: {product1.sub_category}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <div className="space-y-1">
                        <span className="text-xs bg-slate-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md font-bold">
                          {product2.category}
                        </span>
                        {product2.sub_category && (
                          <p className="text-[11px] text-gray-400 mt-1 font-semibold">Sub-category: {product2.sub_category}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 4. Rating Comparison */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Rating Overview</td>
                  
                  {/* Column 1 */}
                  <td className={`p-6 border-l border-gray-100 dark:border-zinc-800 transition ${
                    product1 && product2 && highlightBetterRated && hasHigherRating(product1, product2)
                      ? 'bg-amber-50/20 dark:bg-amber-950/5' 
                      : ''
                  }`}>
                    {product1 ? (
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < Math.floor(product1.rating) ? 'fill-current' : 'text-gray-200 dark:text-zinc-800'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 ml-1">
                          {product1.rating} / 5.0
                        </span>
                        {product1 && product2 && highlightBetterRated && hasHigherRating(product1, product2) && (
                          <span className="ml-2 text-[9px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">
                            Top Rated
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Column 2 */}
                  <td className={`p-6 border-l border-gray-100 dark:border-zinc-800 transition ${
                    product1 && product2 && highlightBetterRated && hasHigherRating(product2, product1)
                      ? 'bg-amber-50/20 dark:bg-amber-950/5' 
                      : ''
                  }`}>
                    {product2 ? (
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < Math.floor(product2.rating) ? 'fill-current' : 'text-gray-200 dark:text-zinc-800'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 ml-1">
                          {product2.rating} / 5.0
                        </span>
                        {product1 && product2 && highlightBetterRated && hasHigherRating(product2, product1) && (
                          <span className="ml-2 text-[9px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">
                            Top Rated
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 5. Inventory & Stock Levels */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Stock Status</td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <div className="flex items-center gap-2">
                        {product1.quantity > 10 ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">
                              In Stock ({product1.quantity} units left)
                            </span>
                          </>
                        ) : product1.quantity > 0 ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                              Low Stock ({product1.quantity} units left!)
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="text-xs text-red-600 font-bold">Sold Out</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <div className="flex items-center gap-2">
                        {product2.quantity > 10 ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">
                              In Stock ({product2.quantity} units left)
                            </span>
                          </>
                        ) : product2.quantity > 0 ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                              Low Stock ({product2.quantity} units left!)
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="text-xs text-red-600 font-bold">Sold Out</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 6. Colors / Variations */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Available Options</td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product1.colors && product1.colors.length > 0 ? (
                          product1.colors.map((c, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-650 dark:text-gray-300 rounded border border-gray-200 dark:border-zinc-700"
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic font-semibold">Standard Edition</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product2.colors && product2.colors.length > 0 ? (
                          product2.colors.map((c, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-650 dark:text-gray-300 rounded border border-gray-200 dark:border-zinc-700"
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic font-semibold">Standard Edition</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 7. Popularity Gauge / Sales */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Sales Count</td>
                  
                  {/* Column 1 */}
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        <span>{(product1.sell_number || product1.sellNumber || 0).toLocaleString()} times ordered</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Column 2 */}
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-bold">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        <span>{(product2.sell_number || product2.sellNumber || 0).toLocaleString()} times ordered</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 8. Full Description Text */}
                <tr>
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450 bg-slate-50/10 dark:bg-zinc-955/2">Specifications & Details</td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                        {product1.description}
                      </p>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                        {product2.description}
                      </p>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

                {/* 9. Direct Cart Actions */}
                <tr className="bg-slate-50/10 dark:bg-zinc-955/2">
                  <td className="p-6 font-semibold text-gray-600 dark:text-gray-450">Actions</td>
                  
                  {/* Column 1 */}
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product1 ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product1)}
                          disabled={product1.quantity <= 0}
                          className="px-4 py-2.5 bg-[#008D7F] hover:bg-[#007065] text-white disabled:opacity-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Toggle Cart
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(product1)}
                          className="px-4 py-2.5 border border-gray-200 dark:border-zinc-800 hover:text-rose-600 hover:border-rose-100 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.some(p => p._id === product1._id) ? 'fill-rose-650 text-rose-650' : ''}`} />
                          <span>Wishlist</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Column 2 */}
                  <td className="p-6 border-l border-gray-100 dark:border-zinc-800">
                    {product2 ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product2)}
                          disabled={product2.quantity <= 0}
                          className="px-4 py-2.5 bg-[#008D7F] hover:bg-[#007065] text-white disabled:opacity-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Toggle Cart
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(product2)}
                          className="px-4 py-2.5 border border-gray-200 dark:border-zinc-800 hover:text-rose-600 hover:border-rose-100 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.some(p => p._id === product2._id) ? 'fill-rose-650 text-rose-650' : ''}`} />
                          <span>Wishlist</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
