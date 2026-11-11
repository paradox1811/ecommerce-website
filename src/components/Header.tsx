import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Camera, ChevronRight, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'tops', label: 'TOPS' },
    { id: 'dresses', label: 'DRESSES' },
    { id: 'bottoms', label: 'BOTTOMS' },
    { id: 'co-ords', label: 'CO-ORDS & JUMPSUITS' },
    { id: 'denim', label: 'DENIM' },
    { id: 'autumn-winter', label: 'AUTUMN/WINTER 2026' },
    { id: 'lingerie', label: 'LINGERIE & LOUNGEWEAR' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'jewellery', label: 'JEWELLERY' },
    { id: 'beauty', label: 'BEAUTY & FRAGRANCES' },
    { id: 'bags', label: 'BAGS' },
    { id: 'activewear', label: 'ACTIVEWEAR' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* 1. Top Black Ticker with Yellow Text (Exact Savana UI) */}
      <div className="bg-black text-[#fdd835] h-7 flex items-center justify-center px-4 text-[11px] font-extrabold uppercase tracking-wider">
        EASY RETURNS / FREE PICK UP
      </div>

      {/* 2. Main Header (Logo, Search, Action Icons) */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 -ml-1 text-black"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo "nilescart" in bold lowercase Savana typography */}
          <div className="flex items-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-3xl md:text-4xl font-black lowercase tracking-[-0.04em] text-black select-none font-sans"
            >
              nilescart
            </a>
          </div>

          {/* Search Bar (Rounded pill with camera and black search button) */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-6 items-center justify-end">
            <div
              onClick={onOpenSearch}
              className="relative flex items-center w-full max-w-md border border-neutral-300 rounded-full bg-white hover:border-neutral-400 cursor-pointer shadow-xs transition-colors py-1.5 pl-4 pr-1.5"
            >
              <span className="text-sm text-neutral-600 flex-1 flex items-center gap-1 font-normal">
                Tops <span className="text-base leading-none">🔥</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSearch();
                  }}
                  className="p-1 text-neutral-600 hover:text-black transition-colors"
                  title="Search by image"
                  aria-label="Search by image"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Icons (User, Heart, Shopping Bag) */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Mobile Search Icon */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-1 text-black"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <button
              onClick={onOpenAccount}
              className="p-1 text-black hover:opacity-70 transition-opacity"
              aria-label="User account"
            >
              <User className="w-6 h-6 stroke-[1.6]" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-1 text-black hover:opacity-70 transition-opacity"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6 stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="relative p-1 text-black hover:opacity-70 transition-opacity"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Sub-Header (Exact Savana UI) */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-3">
            <nav className="flex items-center gap-6 md:gap-8 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`text-[12px] md:text-[13px] font-bold tracking-tight uppercase whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'text-black underline underline-offset-8 decoration-2'
                      : 'text-neutral-900 hover:text-black'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
            <button
              onClick={() => {
                const el = document.getElementById('categories-strip');
                el?.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="hidden lg:flex items-center text-neutral-800 hover:text-black shrink-0 pl-2"
              aria-label="Scroll more categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Categories</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2 rounded transition-colors ${
                  activeCategory === cat.id ? 'bg-black text-white' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
