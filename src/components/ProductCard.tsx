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
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = Math.round(product.price * currencyRate);
  const displayOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * currencyRate) : null;

  return (
    <div
      className="group flex flex-col relative bg-white transition-all cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
    >
      {/* Image Container (Exact Savana 3:4 ratio) */}
      <div className="relative aspect-[3/4] w-full bg-[#f4f2ee] overflow-hidden">
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />

        {/* Gender Badge (Unisex / Men / Women) */}
        {product.gender && (
          <div className="absolute top-2.5 left-2.5 bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
            {product.gender}
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
              : 'bg-white/85 text-black hover:bg-white shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 stroke-[1.8] ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Fast Delivery Badge Bottom Left (Exact Savana UI) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-xs text-neutral-900 border border-neutral-200/80 px-2 py-0.5 rounded-xs text-[11px] font-semibold tracking-tight shadow-xs">
          <Zap className="w-3 h-3 text-neutral-900 fill-neutral-900" />
          <span>Fast delivery</span>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-black text-white text-xs font-bold py-2 px-3 rounded-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product, product.colors[0], product.sizes[0]);
            }}
            className="bg-white text-black hover:bg-neutral-100 p-2 rounded-xs shadow-md transition-colors flex items-center justify-center border border-neutral-200"
            title="Quick Add"
            aria-label="Quick Add"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Details (Exact Savana Spacing) */}
      <div className="pt-2.5 pb-1 flex flex-col">
        <h3 className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-1 leading-snug">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm sm:text-base font-extrabold text-black tabular-nums">
            {currencySymbol} {displayPrice.toLocaleString()}
          </span>
          {displayOriginalPrice && (
            <span className="text-xs text-neutral-400 line-through tabular-nums">
              {currencySymbol} {displayOriginalPrice.toLocaleString()}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[11px] font-bold text-rose-600">
              -{product.discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
