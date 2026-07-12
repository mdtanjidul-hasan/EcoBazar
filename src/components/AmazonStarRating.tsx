import React, { useState } from 'react';
import { Star, ChevronDown, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AmazonStarRatingProps {
  productId: string;
  rating: number;
  price: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const AmazonStarRating: React.FC<AmazonStarRatingProps> = ({
  productId,
  rating,
  price,
  size = 'md',
  showCount = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate a stable review count based on the product ID and price
  const getStableReviewCount = (id: string, basePrice: number) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs((hash % 420) + 24) + Math.round(basePrice % 35);
  };

  const reviewCount = getStableReviewCount(productId, price);

  // Dynamic distribution based on the product's actual rating
  const getRatingDistribution = (r: number) => {
    if (r >= 4.8) {
      return { 5: 86, 4: 10, 3: 2, 2: 1, 1: 1 };
    } else if (r >= 4.6) {
      return { 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 };
    } else if (r >= 4.4) {
      return { 5: 68, 4: 20, 3: 7, 2: 3, 1: 2 };
    } else if (r >= 4.2) {
      return { 5: 58, 4: 26, 3: 10, 2: 4, 1: 2 };
    } else if (r >= 4.0) {
      return { 5: 50, 4: 31, 3: 12, 2: 5, 1: 2 };
    } else {
      return { 5: 42, 4: 28, 3: 18, 2: 8, 1: 4 };
    }
  };

  const distribution = getRatingDistribution(rating);

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    lg: 'w-4 h-4 sm:w-5 sm:h-5',
  };

  const textClasses = {
    sm: 'text-[9.5px]',
    md: 'text-[11px]',
    lg: 'text-xs sm:text-sm',
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => {
          const fillPercent = Math.max(0, Math.min(100, (rating - index) * 100));
          return (
            <div key={index} className={`relative ${sizeClasses[size]} text-gray-200 dark:text-zinc-750 select-none`}>
              {/* Background empty star */}
              <Star className={`absolute inset-0 w-full h-full text-gray-200 dark:text-zinc-700 stroke-gray-300 dark:stroke-zinc-650`} />
              
              {/* Foreground filled star (with overflow clipping) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className="w-full h-full fill-[#FFA41C] text-[#FFA41C] stroke-[#FFA41C]" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="relative inline-flex items-center gap-1.5 cursor-pointer select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderStars()}
      
      {showCount && (
        <div className={`flex items-center gap-0.5 text-slate-500 dark:text-slate-400 font-medium ${textClasses[size]} hover:text-[#008D7F] dark:hover:text-[#00B894] transition`}>
          <span className="font-bold">{rating.toFixed(1)}</span>
          <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition" />
          <span className="text-[#007185] dark:text-[#00a8c4] hover:underline hover:text-[#c45500] dark:hover:text-[#e47911] font-bold ml-1">
            {reviewCount.toLocaleString()} ratings
          </span>
        </div>
      )}

      {/* Popover Breakdown Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 z-50 p-4 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-xl w-64 text-left pointer-events-auto"
          >
            {/* Popover tail */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 rotate-45 bg-white dark:bg-zinc-900 border-t border-l border-gray-150 dark:border-zinc-800 z-[-1]" />

            <div className="space-y-3">
              {/* Header */}
              <div className="space-y-0.5 border-b border-gray-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const fillPercent = Math.max(0, Math.min(100, (rating - index) * 100));
                      return (
                        <div key={index} className="relative w-3.5 h-3.5 text-gray-200 dark:text-zinc-700 select-none">
                          <Star className="absolute inset-0 w-full h-full text-gray-200 dark:text-zinc-700 stroke-gray-300 dark:stroke-zinc-650" />
                          <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                            <Star className="w-full h-full fill-[#FFA41C] text-[#FFA41C] stroke-[#FFA41C]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="font-display font-black text-xs text-gray-900 dark:text-white">
                    {rating.toFixed(1)} out of 5
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold flex items-center gap-1 mt-1">
                  <Award className="w-3 h-3 text-[#008D7F] shrink-0" />
                  Based on global shopper metrics
                </p>
              </div>

              {/* Rows */}
              <div className="space-y-1.5">
                {([5, 4, 3, 2, 1] as const).map((starVal) => {
                  const pct = distribution[starVal];
                  return (
                    <div key={starVal} className="flex items-center gap-2 text-xs">
                      {/* Left Label */}
                      <span className="w-8 text-[#007185] dark:text-[#00a8c4] hover:underline hover:text-[#c45500] dark:hover:text-[#e47911] font-bold text-[10.5px] shrink-0">
                        {starVal} star
                      </span>
                      
                      {/* Bar Container */}
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-zinc-800 border border-gray-150 dark:border-zinc-700 rounded shadow-inner overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF9900] to-[#FFA41C] rounded-sm transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      
                      {/* Right Percentage */}
                      <span className="w-7 text-right text-gray-500 dark:text-gray-400 text-[10.5px] font-bold shrink-0">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-2.5 text-center">
                <span className="text-[10.5px] font-extrabold text-[#007185] dark:text-[#00a8c4] hover:underline hover:text-[#c45500] dark:hover:text-[#e47911]">
                  See all verified purchase reviews
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
