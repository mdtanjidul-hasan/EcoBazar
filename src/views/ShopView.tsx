import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Star, Heart, ShoppingCart, Search, SlidersHorizontal, GitCompare, X } from 'lucide-react';

interface ShopViewProps {
  navigate: (path: string) => void;
}

// Helpers for dynamic brand and group categorization of products
export const getProductBrand = (p: Product): string => {
  const title = p.title.toLowerCase();
  
  if (title.includes("moulvi")) return "Moulvi Signature";
  if (title.includes("earring's point")) return "Earring's Point";
  if (title.includes("kuromi")) return "CuteTech (Sanrio)";
  if (title.includes("disney") || title.includes("lotso") || title.includes("mouse")) return "Disney Craft";
  if (title.includes("panda") || title.includes("bunny") || title.includes("capybara") || title.includes("pet")) return "Animacool";
  if (title.includes("oxidised") || title.includes("jhumka") || title.includes("traditional")) return "Aparupa Artisans";
  if (title.includes("luxury") || title.includes("sapphire") || title.includes("emerald") || title.includes("gold-tone")) return "Luxor Boutique";
  if (p.category === "Smart Gadgets" || p.category === "Mini Fan") return "EcoBreeze";
  return "EcoBazar Handcrafted";
};

export const getProductGroup = (p: Product): 'jewelry' | 'gadgets' => {
  const cat = p.category.toLowerCase();
  if (cat.includes('fan') || cat.includes('gadget') || p.title.toLowerCase().includes('tws') || p.title.toLowerCase().includes('earbuds')) {
    return 'gadgets';
  }
  return 'jewelry';
};

export const ShopView: React.FC<ShopViewProps> = ({ navigate }) => {
  const { products, addToCart, addToWishlist, removeFromWishlist, wishlist, searchQuery, setSearchQuery, theme, lang, currency, compareList, addToCompare, removeFromCompare } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('eb_selected_category') || 'All';
  });
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'jewelry' | 'gadgets'>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-asc', 'price-desc'
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = [
    'All',
    'Fashion Accessories',
    'Smart Gadgets',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Pet Products',
    'Fitness Products'
  ];

  const maxPossiblePrice = products.length > 0
    ? Math.max(...products.map(p => p.price), 5000)
    : 5000;

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(maxPossiblePrice);

  // Keep maxPrice synced with maxPossiblePrice when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map(p => p.price), 5000);
      setMaxPrice(max);
    }
  }, [products]);

  // Clear selected category on mount if loaded from localStorage to keep it transient, but read it
  useEffect(() => {
    localStorage.removeItem('eb_selected_category');
  }, []);

  const convertPrice = (bdtPrice: number) => {
    if (currency === 'USD') {
      return '$' + (bdtPrice / 120).toFixed(2);
    }
    return '৳' + bdtPrice.toLocaleString();
  };

  // Get list of unique brands across the listed products
  const allBrands = Array.from(new Set(products.map(p => getProductBrand(p)))).sort();

  // Filter products
  const filteredProducts = products.filter(p => {
    // Search filter
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Group filter (Jewelry or Gadgets)
    const group = getProductGroup(p);
    const matchesGroup = selectedGroup === 'all' || group === selectedGroup;

    // Category filter
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    // Price filter
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

    // Brand filter
    const pBrand = getProductBrand(p);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(pBrand);

    return matchesSearch && matchesGroup && matchesCategory && matchesPrice && matchesBrand;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    // Default or popular: descending by sell_number or custom rating
    const aSells = a.sell_number || a.sellNumber || 0;
    const bSells = b.sell_number || b.sellNumber || 0;
    return bSells - aSells;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGroup('all');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(maxPossiblePrice);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Main Shop View grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* Sidebar Space */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6 text-left">
            
            {/* Search Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {lang === 'EN' ? 'Search Products' : 'পণ্য খুঁজুন'}
              </h3>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder={lang === 'EN' ? 'Type to search...' : 'খুঁজতে এখানে লিখুন...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-55 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550 focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] transition shadow-inner"
                />
              </div>
            </div>

            {/* Super Category / Product Type Option */}
            <div className="border-t border-gray-150/40 pt-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {lang === 'EN' ? 'Jewelry & Gadgets' : 'অলঙ্কার নাকি গ্যাজেট'}
              </h3>
              <div className="grid grid-cols-1 gap-1.5 md:grid-cols-3 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroup('all');
                    setSelectedCategory('All');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                    selectedGroup === 'all'
                      ? 'bg-emerald-50 border-emerald-100 text-[#008D7F]'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-55 hover:text-gray-700'
                  }`}
                >
                  <span>{lang === 'EN' ? '✨ All Collections' : '✨ সব কালেকশন'}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">
                    {products.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroup('jewelry');
                    setSelectedCategory('All');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                    selectedGroup === 'jewelry'
                      ? 'bg-emerald-50 border-emerald-100 text-[#008D7F]'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-55 hover:text-gray-700'
                  }`}
                >
                  <span>{lang === 'EN' ? '🌸 Fine Jewelry' : '🌸 প্রিমিয়াম অলঙ্কার'}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">
                    {products.filter(p => getProductGroup(p) === 'jewelry').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedGroup('gadgets');
                    setSelectedCategory('All');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                    selectedGroup === 'gadgets'
                      ? 'bg-emerald-50 border-emerald-100 text-[#008D7F]'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-55 hover:text-gray-700'
                  }`}
                >
                  <span>{lang === 'EN' ? '⚡ Handy Gadgets' : '⚡ স্মার্ট গ্যাজেটস'}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">
                    {products.filter(p => getProductGroup(p) === 'gadgets').length}
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-Categories List Section */}
            <div className="border-t border-gray-150/40 pt-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {lang === 'EN' ? 'Sub Categories' : 'ক্যাটাগরি'}
              </h3>
              <p className="text-[11px] text-gray-400 mb-3 leading-tight">
                {lang === 'EN' ? 'Refine by sub-classification:' : 'নির্দিষ্ট একটি বিভাগ বেছে নিন:'}
              </p>
              <div className="flex flex-col gap-1.5">
                {categories
                  .filter(cat => {
                    if (cat === 'All') return true;
                    if (selectedGroup === 'jewelry') {
                      return cat !== 'Smart Gadgets';
                    }
                    if (selectedGroup === 'gadgets') {
                      return cat === 'Smart Gadgets';
                    }
                    return true;
                  })
                  .map((cat) => {
                    const isSel = selectedCategory === cat;
                    // Compute product count
                    const catCount = products.filter(p => {
                      const matchesGroup = selectedGroup === 'all' || getProductGroup(p) === selectedGroup;
                      const matchesCat = cat === 'All' || p.category === cat;
                      return matchesGroup && matchesCat;
                    }).length;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition duration-150 flex items-center justify-between ${
                          isSel 
                            ? 'bg-emerald-950/5 text-[#008D7F] border border-emerald-100/60 font-black' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-transparent'
                        }`}
                      >
                        <span>{cat === 'All' ? (lang === 'EN' ? 'All Classes' : 'সব বিভাগ') : cat}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{catCount}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Brand Filter Checklist */}
            <div className="border-t border-gray-150/40 pt-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {lang === 'EN' ? 'Filter by Brand' : 'ব্র্যান্ড দিয়ে খুঁজুন'}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {allBrands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  // Compute products under this brand
                  const brandCount = products.filter(p => {
                    const matchesGroup = selectedGroup === 'all' || getProductGroup(p) === selectedGroup;
                    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
                    return matchesGroup && matchesCat && getProductBrand(p) === brand;
                  }).length;

                  return (
                    <label
                      key={brand}
                      className="flex items-center justify-between cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedBrands(prev => 
                              prev.includes(brand) 
                                ? prev.filter(b => b !== brand) 
                                : [...prev, brand]
                            );
                          }}
                          className="w-4 h-4 rounded text-[#008D7F] focus:ring-[#008D7F] border-gray-300 transition cursor-pointer accent-[#008D7F]"
                        />
                        <span className={`text-xs transition ${
                          isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                          {brand}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ({brandCount})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Section */}
            <div className="border-t border-gray-150/40 pt-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {lang === 'EN' ? 'Filter by Price' : 'মূল্য দিয়ে খুঁজুন'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                  <span>Min: {convertPrice(minPrice)}</span>
                  <span>Max: {convertPrice(maxPrice)}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={maxPossiblePrice}
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#008D7F]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      {lang === 'EN' ? 'Min Price' : 'সর্বনিম্ন'}
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-2.5 top-2.5 text-xs font-bold text-gray-400">
                        {currency === 'USD' ? '$' : '৳'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={maxPossiblePrice}
                        value={minPrice}
                        onChange={(e) => setMinPrice(Math.max(0, Math.min(maxPossiblePrice, Number(e.target.value))))}
                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg pl-5 pr-1.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#008D7F]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      {lang === 'EN' ? 'Max Price' : 'সর্বোচ্চ'}
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-2.5 top-2.5 text-xs font-bold text-gray-400">
                        {currency === 'USD' ? '$' : '৳'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={maxPossiblePrice}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Math.max(0, Math.min(maxPossiblePrice, Number(e.target.value))))}
                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg pl-5 pr-1.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#008D7F]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl text-xs font-extrabold transition mt-2 cursor-pointer uppercase tracking-wider"
                >
                  {lang === 'EN' ? 'Clear All Filters' : 'সব ফিল্টার মুছুন'}
                </button>
              </div>
            </div>

          </div>
        </aside>

        {/* Product Listing Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting / Meta Header */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl px-3 py-3 sm:px-5 sm:py-3 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-455 font-extrabold uppercase tracking-wider truncate text-center sm:text-left">
              Showing {sortedProducts.length} Products
            </p>
            
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-[#008D7F] hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-100/45 h-[38px] flex-1 sm:flex-initial"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#008D7F]" />
                <span>Filters</span>
              </button>

              <div className="flex items-center justify-end gap-2 flex-1 sm:flex-initial">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden lg:inline" />
                <span className="text-[10px] sm:text-xs font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-gray-655 dark:text-gray-300 focus:outline-none focus:border-[#008D7F] transition cursor-pointer h-[38px] flex-1 sm:flex-initial max-w-[150px]"
                >
                  <option value="popular">Best Sellers</option>
                  <option value="price-asc">Price: L to H</option>
                  <option value="price-desc">Price: H to L</option>
                </select>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto">
                <div className="text-4xl">🔍</div>
                <h3 className="font-display font-bold text-lg text-gray-900">No Products Found</h3>
                <p className="text-sm text-gray-400 font-medium">We couldn't find matches under your selected filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#008D7F] hover:bg-[#981849] text-white font-bold rounded-xl text-xs transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 font-semibold">
                {sortedProducts.map((p) => {
                  const hasWish = wishlist.some(item => item._id === p._id);
                  const isCompared = compareList.some(item => item._id === p._id);
                  return (
                    <div
                      key={p._id}
                      className="product-card-container bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative"
                    >
                      {/* Floating Heart (Wishlist) Button stacked vertically (Fix 2: min 44x44px button) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasWish) {
                            removeFromWishlist(p._id);
                          } else {
                            addToWishlist(p);
                          }
                        }}
                        className={`absolute top-1.5 right-1.5 w-11 h-11 flex items-center justify-center rounded-full shadow z-10 transition duration-200 tap-target-44 ${
                          hasWish ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-white/95 dark:bg-zinc-900/95 text-gray-650 dark:text-gray-300 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-sm border border-gray-100/50 dark:border-zinc-800/50'
                        }`}
                        title={hasWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className="w-5.5 h-5.5" fill={hasWish ? 'currentColor' : 'none'} />
                      </button>

                      {/* Compare Button stacked vertically below Wishlist (Fix 2: min 44x44px button) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCompared) {
                            removeFromCompare(p._id);
                          } else {
                            if (compareList.length >= 3) {
                              alert(lang === 'EN' ? 'You can compare up to 3 products at a time.' : 'আপনি একবারে সর্বোচ্চ ৩ টি পণ্য তুলনা করতে পারবেন।');
                            } else {
                              addToCompare(p);
                            }
                          }
                        }}
                        className={`absolute top-[52px] right-1.5 w-11 h-11 flex items-center justify-center rounded-full shadow z-10 transition duration-200 tap-target-44 ${
                          isCompared ? 'bg-teal-500 text-white shadow-teal-500/20' : 'bg-white/95 dark:bg-zinc-900/95 text-gray-650 dark:text-gray-300 hover:text-teal-500 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-sm border border-gray-100/50 dark:border-zinc-800/50'
                        }`}
                        title={isCompared ? 'Added to Comparison' : 'Compare Product'}
                      >
                        <GitCompare className="w-5.5 h-5.5" />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-0.5 border border-gray-100/50 dark:border-zinc-800/50">
                        <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                        <span className="text-[11px] sm:text-xs font-black text-gray-800 dark:text-gray-200">{p.rating}</span>
                      </div>

                      {/* Product Image Clickable (Fix 6: height: 120px on mobile, aspect-square) */}
                      <div 
                        onClick={() => navigate(`/product/${p._id}`)} 
                        className="h-[120px] md:h-40 lg:h-44 overflow-hidden bg-gray-50 dark:bg-zinc-950 cursor-pointer relative"
                      >
                        <img
                          src={p.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300'}
                          alt={p.title}
                          loading="lazy"
                          width="300"
                          height="180"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        />
                      </div>

                      {/* Body details (Fix 6: padding 8px to 12px) */}
                      <div className="p-2 sm:p-3 flex-1 flex flex-col text-left space-y-1.5 sm:space-y-2">
                        <div>
                          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">
                            {p.category}
                          </span>
                          <h3 
                            onClick={() => navigate(`/product/${p._id}`)}
                            className="font-display font-semibold text-[14px] sm:text-[16px] text-gray-800 dark:text-gray-100 line-clamp-2 mt-1.5 hover:text-[#008D7F] cursor-pointer min-h-[36px] sm:min-h-[40px] leading-snug"
                          >
                            {p.title}
                          </h3>
                        </div>
                        
                        <div className="flex-1 hidden md:block">
                          <p className="text-[13px] text-gray-400 dark:text-gray-455 line-clamp-2 min-h-6 font-medium leading-relaxed">
                            {p.description}
                          </p>
                        </div>

                        {/* Supplier Info */}
                        <div className="pt-1.5 border-t border-gray-100 dark:border-zinc-855 flex flex-col gap-0.5 text-[9.5px] sm:text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1 font-bold">
                            {p.isVerifiedSupplier && (
                              <span className="bg-[#008D7F] text-white text-[8px] font-black px-1 py-0.2 rounded uppercase tracking-wider">Verified</span>
                            )}
                            <span className="truncate hover:underline cursor-pointer text-gray-750 dark:text-gray-300">{p.supplierName}</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-450 dark:text-gray-500 font-semibold text-[9px] sm:text-[10px]">
                            <span>★ {p.supplierRating} <span className="hidden sm:inline">• Resp: {p.supplierResponseRate || "95%"}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 dark:border-zinc-855">
                          {(() => {
                            const lowestPrice = p.priceTiers ? Math.min(...p.priceTiers.map((t: any) => t.price)) : p.price;
                            const highestPrice = p.priceTiers ? Math.max(...p.priceTiers.map((t: any) => t.price)) : p.price;
                            return (
                              <div className="min-w-0 flex-1 pr-1">
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase truncate">FOB Price</p>
                                <span className="font-display font-bold text-[14px] sm:text-[16px] text-[#008D7F] block truncate">
                                  {lowestPrice === highestPrice ? convertPrice(p.price) : `${convertPrice(lowestPrice)}`}
                                </span>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold -mt-0.5 truncate">MOQ: {p.moq} pcs</p>
                              </div>
                            );
                          })()}

                          <button
                            onClick={() => addToCart(p, p.moq || 1)}
                            className="w-11 h-11 shrink-0 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 hover:bg-[#008D7F] dark:hover:bg-[#008D7F] text-[#008D7F] dark:text-emerald-400 hover:text-white dark:hover:text-white rounded-lg transition duration-300 relative group/btn cursor-pointer border border-emerald-100/30 dark:border-emerald-950/30 tap-target-44"
                            title={`Add MOQ (${p.moq || 1} pcs) to Cart`}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

      </div> {/* closes lg:col-span-3 product listing area */}
    </div> {/* closes grid grid-cols-4 main sidebar layout */}

    {/* Floating Comparison Tray */}
    {compareList.length > 0 && (
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-2xl z-50 py-5 px-6 animate-slide-up">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div>
              <h3 className="font-display font-black text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#008D7F]" />
                {lang === 'EN' ? 'Compare Products' : 'পণ্য তুলনা করুন'} ({compareList.length}/3)
              </h3>
              <p className="text-[10px] text-gray-400 font-bold text-left">
                {lang === 'EN' ? 'Compare specifications, pricing, and ratings side-by-side.' : 'পাশাপাশি পণ্যের মূল্য, রেটিং এবং স্পেসিফিকেশন তুলনা করুন।'}
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 bg-[#008D7F] hover:bg-[#981849] text-white font-extrabold text-xs rounded-xl transition shadow active:scale-95 flex items-center gap-1.5"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>{lang === 'EN' ? 'Compare Now' : 'তুলনা করুন'}</span>
              </button>
              
              <button
                onClick={() => compareList.forEach(p => removeFromCompare(p._id))}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition"
              >
                {lang === 'EN' ? 'Clear All' : 'সব মুছুন'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compareList.map((cp) => (
              <div
                key={cp._id + '_compare'}
                className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4 flex gap-4 relative text-left"
              >
                <button
                  onClick={() => removeFromCompare(cp._id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full cursor-pointer z-10"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-150 shrink-0">
                  <img src={cp.gallery[0]} alt={cp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded tracking-wider uppercase">
                    {cp.category}
                  </span>
                  <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1 mt-1">{cp.title}</h4>
                  
                  {/* Compact stats specs */}
                  <div className="grid grid-cols-2 gap-1.5 text-[9px] font-black text-gray-400 pt-1">
                    <div>
                      <span>Price:</span>
                      <span className="text-gray-700 block text-[10px]">{convertPrice(cp.price)}</span>
                    </div>
                    <div>
                      <span>Rating:</span>
                      <span className="text-amber-500 block text-[10px]">★ {cp.rating}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(cp, 1)}
                    className="w-full mt-2 py-1 bg-[#008D7F] hover:bg-[#981849] text-white font-bold text-[10px] rounded-lg transition-all"
                  >
                    {lang === 'EN' ? '+ Add to Cart' : '+ কার্টে যোগ করুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Side-by-Side Products Comparison Modal */}
    {isCompareModalOpen && (
      <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in select-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto relative text-left border border-gray-100 flex flex-col p-6 md:p-8 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-650 hover:bg-gray-100 transition active:scale-95 cursor-pointer z-10"
            title="Close Comparison Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal head */}
          <div className="border-b border-gray-100 pb-4 pr-10">
            <h3 className="font-display font-black text-xl text-gray-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-[#008D7F]" />
              {lang === 'EN' ? 'Product Comparison Matrix' : 'পণ্য তুলনামূলক ছক'}
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1">
              {lang === 'EN' 
                ? 'Review key specifications, features, in-stock status, and ratings side-by-side to assist your purchase.' 
                : 'আপনার ক্রয়ে সহায়তার জন্য পণ্যগুলোর মূল্য, রেটিং, স্টক স্থিতি এবং স্পেসিফিকেশন পাশাপাশি তুলনা করুন।'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider w-[22%]">Features</th>
                  {compareList.map((cp) => (
                    <th key={cp._id} className="py-4 px-4 w-[26%] relative group">
                      <div className="space-y-3">
                        {/* Remove item button */}
                        <button
                          onClick={() => {
                            removeFromCompare(cp._id);
                            if (compareList.length <= 1) {
                              setIsCompareModalOpen(false);
                            }
                          }}
                          className="absolute -top-1 right-2 px-2 py-1 text-[10px] font-bold text-rose-500 hover:text-rose-750 hover:bg-rose-50 rounded bg-rose-50/55 transition cursor-pointer"
                        >
                          {lang === 'EN' ? 'Remove' : 'বাদ দিন'}
                        </button>

                        <div className="h-28 rounded-2xl overflow-hidden bg-slate-50 border border-gray-100/80">
                          <img src={cp.gallery[0]} alt={cp.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>

                        <h4 className="font-display font-extrabold text-[#008D7F] text-[13px] line-clamp-2 leading-snug">
                          {cp.title}
                        </h4>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty cells up to 3 */}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <th key={'empty-head-' + i} className="py-4 px-4 w-[26%] text-center text-gray-300 font-semibold border-l border-dashed border-gray-100">
                      <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[11px]">
                        <span className="text-2xl">➕</span>
                        <p>{lang === 'EN' ? 'Add Product' : 'পণ্য যোগ করুন'}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {/* Price Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Price</td>
                  {compareList.map((cp) => (
                    <td key={'price-' + cp._id} className="py-4 px-4 text-sm font-black text-gray-900 font-sans">
                      {convertPrice(cp.price)}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-price-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Category</td>
                  {compareList.map((cp) => (
                    <td key={'cat-' + cp._id} className="py-4 px-4">
                      <span className="text-[10px] font-black text-[#008D7F] bg-teal-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        {cp.category}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-cat-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Rating</td>
                  {compareList.map((cp) => (
                    <td key={'rate-' + cp._id} className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-800 font-black">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{cp.rating} / 5</span>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-rate-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Stock Status Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Stock Status</td>
                  {compareList.map((cp) => {
                    const inStock = cp.quantity > 0;
                    return (
                      <td key={'stock-' + cp._id} className="py-4 px-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {inStock ? (lang === 'EN' ? `In Stock (${cp.quantity})` : `স্টকে আছে (${cp.quantity})`) : (lang === 'EN' ? 'Out Of Stock' : 'স্টক নেই')}
                        </span>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-stock-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Sell count Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Popularity</td>
                  {compareList.map((cp) => {
                    const totalSells = cp.sell_number || cp.sellNumber || 0;
                    return (
                      <td key={'sell-' + cp._id} className="py-4 px-4">
                        <span className="text-gray-600 font-bold">
                          {lang === 'EN' ? `${totalSells}+ units sold` : `${totalSells}+ টি বিক্রয় হয়েছে`}
                        </span>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-sell-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Colors Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Available Colors</td>
                  {compareList.map((cp) => (
                    <td key={'colors-' + cp._id} className="py-4 px-4 text-gray-500 font-bold">
                      {cp.colors && cp.colors.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cp.colors.map(col => (
                            <span key={col} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-gray-200 uppercase font-black">
                              {col}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-450 italic text-[11px] font-medium">{lang === 'EN' ? 'Standard' : 'স্বাভাবিক'}</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-colors-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Description Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Description</td>
                  {compareList.map((cp) => (
                    <td key={'desc-' + cp._id} className="py-4 px-4 text-gray-500 text-[11px] font-medium leading-relaxed align-top">
                      <div className="line-clamp-4 hover:line-clamp-none transition-all duration-300 max-w-[240px]">
                        {cp.description}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-desc-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="py-4 px-3 text-gray-400 font-extrabold uppercase tracking-wider">Quick buy</td>
                  {compareList.map((cp) => {
                    const noStock = cp.quantity <= 0;
                    return (
                      <td key={'action-' + cp._id} className="py-4 px-4">
                        <button
                          onClick={() => {
                            addToCart(cp, 1);
                            alert(lang === 'EN' ? `"${cp.title}" successfully added to cart!` : `"${cp.title}" কার্টে সফলভাবে যোগ করা হয়েছে!`);
                          }}
                          disabled={noStock}
                          className={`w-full py-2.5 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition duration-150 active:scale-95 text-white ${
                            noStock 
                              ? 'bg-gray-300 cursor-not-allowed text-gray-400 shadow-none hover:bg-gray-300' 
                              : 'bg-[#008D7F] hover:bg-[#981849] hover:shadow'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{lang === 'EN' ? 'Add To Cart' : 'কার্টে যোগ করুন'}</span>
                        </button>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <td key={'empty-action-' + i} className="py-4 px-4 text-gray-300">-</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400 font-bold">
            <span className="text-left font-serif italic text-gray-500 tracking-wide">💡 EcoBazar Handcrafted Jewelry & Hardware</span>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-xs font-black tracking-wide active:scale-95 transition cursor-pointer"
            >
              {lang === 'EN' ? 'Close Matrix' : 'বন্ধ করুন'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Mobile Filters Drawer Overlay */}
    {isMobileFiltersOpen && (
      <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
        
        {/* Drawer Body */}
        <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between animate-slide-in-right z-50">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#008D7F]" />
                <h2 className="font-display font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                  Filter & Refine
                </h2>
              </div>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-850 rounded-full transition text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Filters copied here */}
            <div className="space-y-6 text-left">
              {/* Search Filter */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {lang === 'EN' ? 'Search Products' : 'পণ্য খুঁজুন'}
                </h3>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder={lang === 'EN' ? 'Type to search...' : 'খুঁজতে এখানে লিখুন...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-55 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-550 focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] transition shadow-inner"
                  />
                </div>
              </div>

              {/* Super Category / Product Type Option */}
              <div className="border-t border-gray-150/40 pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {lang === 'EN' ? 'Jewelry & Gadgets' : 'অলঙ্কার নাকি গ্যাজেট'}
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGroup('all');
                      setSelectedCategory('All');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                      selectedGroup === 'all'
                        ? 'bg-emerald-50 border-emerald-100 text-[#008D7F]'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-55 hover:text-gray-700'
                    }`}
                  >
                    <span>{lang === 'EN' ? '✨ All Collections' : '✨ সব কালেকশন'}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">
                      {products.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGroup('jewelry');
                      setSelectedCategory('All');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                      selectedGroup === 'jewelry'
                        ? 'bg-emerald-50 border-emerald-100 text-[#008D7F]'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-55 hover:text-gray-700'
                    }`}
                  >
                    <span>{lang === 'EN' ? '🌸 Fine Jewelry' : '🌸 প্রিমিয়াম অলঙ্কার'}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">
                      {products.filter(p => getProductGroup(p) === 'jewelry').length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGroup('gadgets');
                      setSelectedCategory('All');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                      selectedGroup === 'gadgets'
                        ? 'bg-emerald-50 border-emerald-100 text-[#008D7F]'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-55 hover:text-gray-700'
                    }`}
                  >
                    <span>{lang === 'EN' ? '⚡ Handy Gadgets' : '⚡ স্মার্ট গ্যাজেটস'}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">
                      {products.filter(p => getProductGroup(p) === 'gadgets').length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sub-Categories List Section */}
              <div className="border-t border-gray-150/40 pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {lang === 'EN' ? 'Sub Categories' : 'ক্যাটাগরি'}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories
                    .filter(cat => {
                      if (cat === 'All') return true;
                      if (selectedGroup === 'jewelry') return cat !== 'Smart Gadgets';
                      if (selectedGroup === 'gadgets') return cat === 'Smart Gadgets';
                      return true;
                    })
                    .map((cat) => {
                      const isSel = selectedCategory === cat;
                      const catCount = products.filter(p => {
                        const matchesGroup = selectedGroup === 'all' || getProductGroup(p) === selectedGroup;
                        const matchesCat = cat === 'All' || p.category === cat;
                        return matchesGroup && matchesCat;
                      }).length;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition duration-150 flex items-center justify-between ${
                            isSel 
                              ? 'bg-emerald-950/5 text-[#008D7F] border border-emerald-100/60 font-black' 
                              : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-transparent'
                          }`}
                        >
                          <span>{cat === 'All' ? (lang === 'EN' ? 'All Classes' : 'সব বিভাগ') : cat}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{catCount}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Brand Filter Checklist */}
              <div className="border-t border-gray-150/40 pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {lang === 'EN' ? 'Filter by Brand' : 'ব্র্যান্ড দিয়ে খুঁজুন'}
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {allBrands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    const brandCount = products.filter(p => {
                      const matchesGroup = selectedGroup === 'all' || getProductGroup(p) === selectedGroup;
                      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
                      return matchesGroup && matchesCat && getProductBrand(p) === brand;
                    }).length;

                    return (
                      <label
                        key={brand}
                        className="flex items-center justify-between cursor-pointer group py-0.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedBrands(prev => 
                                prev.includes(brand) 
                                  ? prev.filter(b => b !== brand) 
                                  : [...prev, brand]
                              );
                            }}
                            className="w-4 h-4 rounded text-[#008D7F] focus:ring-[#008D7F] border-gray-300 transition cursor-pointer accent-[#008D7F]"
                          />
                          <span className={`text-xs transition ${
                            isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                          }`}>
                            {brand}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ({brandCount})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter Section */}
              <div className="border-t border-gray-150/40 pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {lang === 'EN' ? 'Filter by Price' : 'মূল্য দিয়ে খুঁজুন'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span>Min: {convertPrice(minPrice)}</span>
                    <span>Max: {convertPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPossiblePrice}
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#008D7F]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 mt-6">
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3.5 bg-[#008D7F] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#00B894] cursor-pointer"
            >
              Apply ({sortedProducts.length} Products)
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};
