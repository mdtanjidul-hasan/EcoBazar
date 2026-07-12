import React from 'react';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  maxPossiblePrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  maxPossiblePrice,
  setMinPrice,
  setMaxPrice,
}) => {
  const percentMin = maxPossiblePrice > 0 ? (minPrice / maxPossiblePrice) * 100 : 0;
  const percentMax = maxPossiblePrice > 0 ? (maxPrice / maxPossiblePrice) * 100 : 100;

  return (
    <div className="relative w-full h-6 flex items-center">
      {/* Base track */}
      <div className="absolute left-0 right-0 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full"></div>
      
      {/* Selected range highlight */}
      <div
        className="absolute h-1.5 bg-[#008D7F] rounded-full"
        style={{
          left: `${percentMin}%`,
          right: `${100 - percentMax}%`,
        }}
      ></div>

      {/* Minimum Price Slider */}
      <input
        type="range"
        min="0"
        max={maxPossiblePrice}
        step="10"
        value={minPrice}
        onChange={(e) => {
          const val = Math.min(Number(e.target.value), maxPrice - 10);
          setMinPrice(val);
        }}
        className="absolute left-0 w-full h-1 pointer-events-none appearance-none bg-transparent outline-none z-20
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#008D7F] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#008D7F] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:scale-125"
      />

      {/* Maximum Price Slider */}
      <input
        type="range"
        min="0"
        max={maxPossiblePrice}
        step="10"
        value={maxPrice}
        onChange={(e) => {
          const val = Math.max(Number(e.target.value), minPrice + 10);
          setMaxPrice(val);
        }}
        className="absolute left-0 w-full h-1 pointer-events-none appearance-none bg-transparent outline-none z-20
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#008D7F] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#008D7F] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:scale-125"
      />
    </div>
  );
};
