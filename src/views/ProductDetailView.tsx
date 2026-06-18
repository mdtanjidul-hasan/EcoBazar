import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, ArrowLeft, Send } from 'lucide-react';

interface ProductDetailViewProps {
  productId: string;
  navigate: (path: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId, navigate }) => {
  const { products, reviews, addToCart, addToWishlist, wishlist, addReview } = useStore();

  const product = products.find(p => p._id === productId);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-display font-black text-2xl text-red-600">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you are trying to view does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#008D7F] text-white font-bold rounded-xl text-sm"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(product.gallery[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500');
  const [quantity, setQuantity] = useState(1);
  const [revRating, setRevRating] = useState(5);
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revComment, setRevComment] = useState('');
  const [isAddedLocal, setIsAddedLocal] = useState(false);

  // Filter reviews
  const productReviews = reviews.filter(r => r.productId === product._id);
  const hasWish = wishlist.some(item => item._id === product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAddedLocal(true);
    setTimeout(() => setIsAddedLocal(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) {
      alert('Please fill out all fields. Name and Comment are required.');
      return;
    }
    addReview(product._id, revName, revEmail || 'anonymous@gmail.com', revComment, revRating);
    
    // Clear forms
    setRevName('');
    setRevEmail('');
    setRevComment('');
    setRevRating(5);
    alert('Thank you for your valuable review!');
  };

  return (
    <div className="space-y-16 pb-20 text-left">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#008D7F] transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop Products
        </button>
      </div>

      {/* Main product card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left side: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-slate-50 border border-gray-100 rounded-3xl overflow-hidden shadow-sm relative">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            <button
              onClick={() => addToWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg ${
                hasWish ? 'bg-rose-50 text-rose-500' : 'bg-white text-gray-400 hover:text-rose-500'
              }`}
            >
              <Heart className="w-5 h-5" fill={hasWish ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {product.gallery.map((img, idx) => {
              const works = activeImage === img;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-50 transition ${
                    works ? 'border-[#008D7F] shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: Information */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>
            
            {/* Reviews summary */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4.5 h-4.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-gray-800">{product.rating}</span>
              <span className="text-xs text-gray-400 font-bold">
                ({productReviews.length} reviews)
              </span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {product.sell_number || product.sellNumber || 0} Sold
              </span>
            </div>
          </div>

          <div className="p-5 bg-teal-50/50 border border-teal-50 rounded-2xl flex items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-xs text-gray-400 font-bold uppercase">Price</span>
              <p className="font-display font-black text-3xl text-[#008D7F]">
                ৳{product.price.toLocaleString()}
              </p>
            </div>
            
            {product.quantity > 0 ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full select-none ml-auto">
                In Stock ({product.quantity} items left)
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full select-none ml-auto">
                Out of Stock
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Product Features</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              {product.description}
            </p>
          </div>

          {/* Action Row */}
          {product.quantity > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 font-bold uppercase">Quantity:</span>
                <div className="flex items-center border border-gray-200 bg-gray-50 p-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold bg-white text-gray-600 hover:text-[#008D7F] border border-gray-100 rounded-lg active:scale-95 transition"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-black text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold bg-white text-gray-600 hover:text-[#008D7F] border border-gray-100 rounded-lg active:scale-95 transition"
                  >
                    +
                  </button>
                </div>
                
                <span className="text-xs text-gray-400 font-bold ml-2">
                  Total: <span className="text-[#008D7F]">৳{(product.price * quantity).toLocaleString()}</span>
                </span>
              </div>

              {/* Add & Buy */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[150px] py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-colors duration-200 ${
                    isAddedLocal ? 'bg-green-600 shadow-green-700/10' : 'bg-[#008D7F] hover:bg-[#981849] shadow-teal-700/10'
                  }`}
                >
                  🛒 {isAddedLocal ? 'Added Successfully ✓' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="px-8 py-4 bg-gray-900 border-2 border-gray-900 text-white rounded-xl text-sm font-bold transition hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  ⚡ Buy Now
                </button>
              </div>

            </div>
          )}

          {/* Quick value cards */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <span className="text-xl">🚚</span>
              <p className="text-[10px] font-bold text-gray-600 mt-1">Free Delivery</p>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Orders above ৳1000</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <span className="text-xl">✨</span>
              <p className="text-[10px] font-bold text-gray-600 mt-1">Guaranteed Quality</p>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">100% hand crafted</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <span className="text-xl">🔄</span>
              <p className="text-[10px] font-bold text-gray-600 mt-1">Easy Return</p>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">7 days hassle free</p>
            </div>
          </div>

        </div>

      </section>

      {/* Reviews and Ratings details */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-gray-100">
        
        {/* Left side: Write Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-left space-y-1">
            <h2 className="font-display font-black text-xl text-gray-900">Add Customer Review</h2>
            <p className="text-xs text-gray-400 font-semibold">Your feedback motivates local artisans and helpers.</p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Stars selection */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Rating</p>
              <div className="flex items-center gap-1.5 p-3 bg-gray-50 rounded-xl w-fit">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    type="button"
                    key={stars}
                    onClick={() => setRevRating(stars)}
                    className="p-1 rounded text-amber-500 active:scale-95 transition"
                  >
                    <Star className={`w-6 h-6 ${stars <= revRating ? 'fill-current' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  placeholder="e.g. Anika Kabir"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  value={revEmail}
                  onChange={(e) => setRevEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  placeholder="e.g. anika@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Review Comment *</label>
              <textarea
                required
                rows={4}
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                placeholder="What did you love or dislike about this product?"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#008D7F] hover:bg-[#981849] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </form>
        </div>

        {/* Right side: Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-left py-1.5 border-b border-gray-50">
            <h2 className="font-display font-black text-xl text-gray-900">
              Customer Reviews ({productReviews.length})
            </h2>
          </div>

          {productReviews.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-10 text-center text-gray-400 text-sm font-semibold">
              ✨ Be the first to write a review for this product!
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {productReviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-inner text-left space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{rev.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{rev.date}</p>
                    </div>
                    
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

    </div>
  );
};
