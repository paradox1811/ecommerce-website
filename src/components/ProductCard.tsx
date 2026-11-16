import React, { useState } from 'react';
import { Heart, Zap, Eye, ShoppingBag } from 'lucide-react';
import { Product, ProductColor } from '../types';

interface ProductCardProps {
  product: Product;
  currencySymbol: string;
  currencyRate: number;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, color: ProductColor, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol,
  currencyRate,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const displayPrice = Math.round(product.price * currencyRate);
  const displayOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * currencyRate) : null;
  const displayOfferPrice = product.offerPrice ? Math.round(product.offerPrice * currencyRate) : null;

  return (
    <div
      className="group flex flex-col relative bg-white transition-all cursor-pointer select-none"
      onClick={() => onQuickView(product)}
    >
      {/* Exact 896x1200 Natural Ratio Image Container */}
      <div className="relative aspect-[896/1200] w-full bg-[#efebe4] overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#eae5dc] to-[#dcd5c7] flex flex-col items-center justify-center p-4 text-center">
            <ShoppingBag className="w-7 h-7 text-neutral-500 mb-2" />
            <span className="text-xs font-semibold text-neutral-700 line-clamp-2">{product.name}</span>
          </div>
        )}

        {/* Wishlist Heart Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-white text-rose-600 shadow-sm'
              : 'bg-white/95 text-black hover:bg-white shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 stroke-[1.7] ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Fast Delivery Badge Bottom Left */}
        {!product.hasBakedOverlay && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs text-neutral-900 px-2 py-0.5 rounded-xs text-[11px] font-semibold tracking-tight shadow-xs">
            <Zap className="w-3 h-3 text-neutral-900 fill-neutral-900" />
            <span>Fast delivery</span>
          </div>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex gap-1.5 pt-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-black text-white text-xs font-bold py-2 px-3 rounded-xs shadow-md transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product, product.colors[selectedColorIndex] || product.colors[0], product.sizes[0]);
            }}
            className="bg-white text-black hover:bg-neutral-100 p-2 rounded-xs shadow-md transition-colors flex items-center justify-center border border-neutral-200 active:scale-95"
            title="Quick Add"
            aria-label="Quick Add"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Metadata Matching Exact PDF Layout */}
      <div className="pt-2 pb-1 flex flex-col space-y-0.5">
        {/* 1. Title */}
        <h3 className="text-[12px] sm:text-[13px] font-normal text-neutral-900 truncate leading-snug">
          {product.name}
        </h3>

        {/* 2. Price, Strikethrough & %OFF */}
        <div className="flex flex-wrap items-baseline gap-1.5 tabular-nums pt-0.5">
          <span className="text-[14px] sm:text-[15px] font-extrabold text-black">
            {currencySymbol}{displayPrice.toLocaleString()}
          </span>
          {displayOriginalPrice && (
            <span className="text-[11px] sm:text-[12px] text-neutral-400 line-through">
              {currencySymbol}{displayOriginalPrice.toLocaleString()}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[11px] sm:text-[12px] font-semibold text-rose-500">
              {product.discountPercent}%OFF
            </span>
          )}
        </div>

        {/* 3. Get it for ₹... */}
        {displayOfferPrice && (
          <div className="text-[11px] font-semibold text-teal-600 tabular-nums">
            Get it for {currencySymbol}{displayOfferPrice.toLocaleString()}
          </div>
        )}

        {/* 4. Circular Color Swatches */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                  selectedColorIndex === idx ? 'ring-1 ring-neutral-900 ring-offset-1' : 'border border-neutral-300'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}

        {/* 5. Best selling / New-in Tag Badges */}
        {(product.isBestSeller || product.isNew) && (
          <div className="flex items-center gap-1 pt-1">
            {product.isBestSeller && (
              <span className="inline-block bg-[#f6e8e3] text-[#7e4134] text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                Best selling
              </span>
            )}
            {product.isNew && (
              <span className="inline-block bg-[#e4eff9] text-[#284d78] text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                New-in
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
