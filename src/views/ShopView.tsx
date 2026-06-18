import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Star, Heart, ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';

interface ShopViewProps {
  navigate: (path: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ navigate }) => {
  const { products, addToCart, addToWishlist, wishlist } = useStore();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('eb_selected_category') || 'All';
  });
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-asc', 'price-desc'

  const categories = ['All', 'Earrings', 'Jewelry Set', 'Kids Jewelry Sets', 'Mini Fan'];

  // Clear selected category on mount if loaded from localStorage to keep it transient, but read it
  useEffect(() => {
    localStorage.removeItem('eb_selected_category');
  }, []);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  return (
    <div className="space-y-10 pb-20">
      
      {/* Title & Banner */}
      <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 text-left relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <h1 className="font-display text-3xl md:text-4xl font-black text-gray-900">
            Premium Treasures Catalog
          </h1>
          <p className="text-sm text-gray-500 font-semibold leading-relaxed">
            Discover exquisite jhumkas, gorgeous matching neck-drop sets, and ergonomic, silent mini hand fans curated for your refined taste.
          </p>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full lg:w-96">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] focus:ring-1 focus:ring-[#008D7F] font-semibold text-gray-800 placeholder-gray-400 transition"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-start lg:justify-end">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort By</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:outline-none focus:border-[#008D7F] transition cursor-pointer"
            >
              <option value="popular">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50 mt-6 justify-start">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
                  isSel 
                    ? 'bg-[#008D7F] text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </section>

      {/* Products Grid */}
      <section className="space-y-6">
        {sortedProducts.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto">
            <div className="text-4xl">🔍</div>
            <h3 className="font-display font-bold text-lg text-gray-900">No Products Found</h3>
            <p className="text-sm text-gray-400 font-medium">We couldn't find matches for "{search}" under your selected filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 bg-[#008D7F] hover:bg-[#981849] text-white font-bold rounded-xl text-xs transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="text-left mb-6">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Showing {sortedProducts.length} premium products
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((p) => {
                const hasWish = wishlist.some(item => item._id === p._id);
                return (
                  <div
                    key={p._id}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(p);
                      }}
                      className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md z-10 transition duration-200 ${
                        hasWish ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-gray-400 hover:text-rose-500 backdrop-blur-sm'
                      }`}
                    >
                      <Heart className="w-4.5 h-4.5" fill={hasWish ? 'currentColor' : 'none'} />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-gray-800">{p.rating}</span>
                    </div>

                    {/* Product Image Clickable */}
                    <div 
                      onClick={() => navigate(`/product/${p._id}`)} 
                      className="h-56 overflow-hidden bg-gray-50 cursor-pointer relative"
                    >
                      <img
                        src={p.gallery[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                      />
                    </div>

                    {/* Body details */}
                    <div className="p-5 flex-1 flex flex-col text-left space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                        <h3 
                          onClick={() => navigate(`/product/${p._id}`)}
                          className="font-display font-bold text-sm text-gray-800 line-clamp-2 mt-2 hover:text-[#008D7F] cursor-pointer"
                        >
                          {p.title}
                        </h3>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 line-clamp-2 min-h-8 font-medium">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold uppercase">Price</p>
                          <span className="font-display font-black text-lg text-[#008D7F]">
                            ৳{p.price.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(p, 1)}
                          className="p-3 bg-teal-50 hover:bg-[#008D7F] text-[#008D7F] hover:text-white rounded-xl transition duration-300 relative group/btn"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

    </div>
  );
};
