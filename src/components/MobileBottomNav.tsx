import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onScrollToCatalog: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onScrollToCatalog,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 h-14 px-2 flex items-center justify-around shadow-lg"
    >
      <button
        onClick={() => {
          onSelectCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium transition-colors ${
          activeCategory === 'all' ? 'text-neutral-950 font-bold' : 'text-neutral-500'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={onScrollToCatalog}
        className="flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
      >
        <Compass className="w-4 h-4 mb-0.5" />
        <span>Catalog</span>
      </button>

      <button
        onClick={onOpenWishlist}
        className="relative flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
      >
        <Heart className="w-4 h-4 mb-0.5" />
        <span>Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute top-1.5 right-3 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
      >
        <ShoppingBag className="w-4 h-4 mb-0.5" />
        <span>Bag</span>
        {cartCount > 0 && (
          <span className="absolute top-1.5 right-3 w-3.5 h-3.5 bg-neutral-950 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenAccount}
        className="flex flex-col items-center justify-center w-14 h-full text-[10px] font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
      >
        <User className="w-4 h-4 mb-0.5" />
        <span>Account</span>
      </button>
    </nav>
  );
};
