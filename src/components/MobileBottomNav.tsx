import React from 'react';
import { Home, Search, Layers, Heart, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onGoHome: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  onOpenSearch,
  onOpenCategories,
  onOpenWishlist,
  onOpenCart,
  onGoHome,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg pb-safe">
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center gap-0.5 text-neutral-800 active:text-black py-1"
          aria-label="Home"
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* 2. Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center gap-0.5 text-neutral-600 active:text-black py-1"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold tracking-tight">Search</span>
        </button>

        {/* 3. Categories */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center gap-0.5 text-neutral-600 active:text-black py-1"
          aria-label="Categories"
        >
          <Layers className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold tracking-tight">Categories</span>
        </button>

        {/* 4. Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center gap-0.5 text-neutral-600 active:text-black py-1"
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Wishlist</span>
        </button>

        {/* 5. Bag */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center gap-0.5 text-neutral-600 active:text-black py-1"
          aria-label="Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Bag</span>
        </button>
      </div>
    </div>
  );
};
