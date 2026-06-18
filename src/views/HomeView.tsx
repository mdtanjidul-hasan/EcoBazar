import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Blog } from '../types';
import { ArrowRight, Star, Leaf, Award, ShieldCheck, Heart, ShoppingCart } from 'lucide-react';

interface HomeViewProps {
  navigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { products, blogs, addToCart, addToWishlist, wishlist } = useStore();

  // Selected products for hero/spotlight
  const featuredProducts = products.slice(0, 4);
  const latestBlogs = blogs.slice(0, 3);

  const categories = [
    { title: 'Earrings', count: products.filter(p => p.category === 'Earrings').length, desc: 'Elegance for every occasion', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop' },
    { title: 'Jewelry Set', count: products.filter(p => p.category === 'Jewelry Set').length, desc: 'Perfect matching sets', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop' },
    { title: 'Kids Jewelry Sets', count: products.filter(p => p.category === 'Kids Jewelry Sets').length, desc: 'Sparkly safety-certified toys', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=300&h=300&fit=crop' },
    { title: 'Mini Fan', count: products.filter(p => p.category === 'Mini Fan').length, desc: 'Stay cool and breezy', image: 'https://images.unsplash.com/photo-1618944847828-82e943c3dba7?w=300&h=300&fit=crop' },
  ];

  const valueProps = [
    { icon: <Leaf className="w-8 h-8 text-[#008D7F]" />, title: 'Eco-conscious Quality', desc: 'Sourced responsibly and crafted with skin-safe, hypoallergenic premium silver and components.' },
    { icon: <Award className="w-8 h-8 text-[#008D7F]" />, title: 'Handcrafted Perfection', desc: 'Each crystal and jhumka is meticulously hand-beaded in local designer studios for high durability.' },
    { icon: <ShieldCheck className="w-8 h-8 text-[#008D7F]" />, title: 'Guaranteed Authenticity', desc: 'Enjoy full peace of mind with our 100% genuine quality guarantee and no-questions-asked returns.' },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-[#ebf3f2] rounded-3xl overflow-hidden mt-6 shadow-sm">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#008d7f_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#008d7f1e] text-[#008D7F] rounded-full text-xs font-bold tracking-wide uppercase">
              <Star className="w-3.5 h-3.5 fill-[#008D7F]" /> Special Summer Collection
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              Adorn Yourself in <br />
              <span className="text-[#008D7F]">Handcrafted Elegance</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Explore our boutique range of hand-beaded silver earrings, jewelry matching combos, and ultra-high-performance rechargeable mini fans.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-8 py-4 bg-[#008D7F] hover:bg-[#981849] text-white font-bold rounded-2xl shadow-lg shadow-teal-700/10 transition-all duration-300 flex items-center gap-2 group transform hover:-translate-y-0.5"
              >
                Explore Catalog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Our Story
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"
                alt="Jewelry Showcase"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-50 -rotate-3 hidden sm:flex">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-rose-500 font-bold text-xl">
                💝
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Flash Sale</p>
                <p className="text-sm font-black text-gray-800">40% Off Jewelry Sets</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Value Propositions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm text-left hover:shadow-md transition duration-300 space-y-4">
              <div className="p-3 bg-teal-50 w-fit rounded-2xl">
                {prop.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900">{prop.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-semibold">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl text-gray-900">Shop by Categories</h2>
          <p className="text-gray-500 text-sm font-semibold">Exquisite jewelry and lifestyle cooling solutions tailored to your premium taste.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                localStorage.setItem('eb_selected_category', cat.title);
                navigate('/shop');
              }}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 cursor-pointer group text-left"
            >
              <div className="h-52 overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-5 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-[#008D7F] transition">{cat.title}</h3>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                    {cat.count} items
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-semibold">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Flash Sale Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-100 pb-5">
          <div className="text-left space-y-1">
            <h2 className="font-display font-black text-3xl text-gray-900">Trending Masterpieces</h2>
            <p className="text-gray-500 text-sm font-semibold">Our current top-selling and highly-rated pieces this week.</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-[#008D7F] hover:text-[#981849] transition flex items-center gap-1 shrink-0"
          >
            Sights All Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
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
      </section>

      {/* Aesthetic Banner Space (High level industry look) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#122b29] rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-left relative shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="max-w-xl relative z-10 space-y-5">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest pl-3 border-l-2 border-teal-400">
              The Artisan philosophy
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-black leading-tight">
              Finest Materials, Handwoven Splendor
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We source only natural enamels, traditional oxidised alloys, and certified rechargeable motors. Our goal is to build long-term, durable accessories which maintain luxury feel while protecting our planet.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition shadow-lg"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories & Blogs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex justify-between items-end border-b border-gray-100 pb-5">
          <div className="text-left space-y-1">
            <h2 className="font-display font-black text-3xl text-gray-900">Latest Editorial Stories</h2>
            <p className="text-gray-500 text-sm font-semibold">Read fashion edits and tech guide logs created by our internal curators.</p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="text-sm font-bold text-[#008D7F] hover:text-[#981849] transition flex items-center gap-1 shrink-0"
          >
            Go to Blog
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col text-left group cursor-pointer"
              onClick={() => navigate(`/single-blog/${b._id}`)}
            >
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#008D7F] bg-teal-50 px-2.5 py-1 rounded-full">
                    {b.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-gray-900 mt-3 group-hover:text-[#008D7F] transition line-clamp-2">
                    {b.title}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-400 font-medium line-clamp-3">
                  {b.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-50 pt-4 mt-auto">
                  <span>By {b.authorname || b.author}</span>
                  <span>{b.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
