import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Camera, ChevronRight, Menu, X } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  mobileMenuOpen?: boolean;
  onSetMobileMenuOpen?: (open: boolean) => void;
  tickerBg?: string;
  tickerText?: string;
  accentColor?: string;
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
  mobileMenuOpen: externalMobileMenuOpen,
  onSetMobileMenuOpen,
  tickerBg = '#11100f',
  tickerText = '#e6c891',
  accentColor = '#181614',
}) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = onSetMobileMenuOpen || setInternalMobileMenuOpen;

  const categories = [
    { id: 'tops', label: 'TOPS' },
    { id: 'dresses', label: 'DRESSES' },
    { id: 'bottoms', label: 'BOTTOMS' },
    { id: 'co-ords', label: 'CO-ORDS & JUMPSUITS' },
    { id: 'denim', label: 'DENIM' },
    { id: 'outerwear', label: 'OUTERWEAR' },
    { id: 'footwear', label: 'FOOTWEAR' },
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
      {/* 1. Top Ticker */}
      <div
        className="h-7 flex items-center justify-center px-4 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-200"
        style={{ backgroundColor: tickerBg, color: tickerText }}
      >
        EASY RETURNS / FREE PICK UP
      </div>

      {/* 2. Main Header (Full-Screen Width) */}
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="h-14 md:h-16 flex items-center justify-between gap-4">
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

          {/* Brand Logo "nilescart" in bold lowercase editorial typography */}
          <div className="flex items-center shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl md:text-[32px] font-black lowercase tracking-[-0.04em] text-black select-none font-sans"
            >
              nilescart
            </a>
          </div>

          {/* Right-aligned Search Bar + Action Icons matching PDF Page 1 */}
          <div className="hidden sm:flex flex-1 items-center justify-end mr-2">
            <div
              onClick={onOpenSearch}
              className="relative flex items-center w-full max-w-[380px] border border-neutral-300 rounded-full bg-white hover:border-neutral-400 cursor-pointer transition-colors py-1 pl-4 pr-1"
            >
              <span className="text-xs sm:text-[13px] text-neutral-500 flex-1 flex items-center gap-1 font-normal">
                Tops <span className="text-sm leading-none">🔥</span>
              </span>
              <div className="flex items-center gap-1.5">
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
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-all"
                  style={{ backgroundColor: accentColor }}
                  aria-label="Submit search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Icons (Install App, User, Heart, Shopping Bag) */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-1.5 text-black"
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
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: accentColor }}
                >
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
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: accentColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Sub-Header (Full-Screen Width) */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div 
            id="categories-strip" 
            className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-2 scroll-smooth touch-pan-x"
          >
            <nav className="flex items-center gap-5 md:gap-6 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`text-[11px] font-bold tracking-tight uppercase whitespace-nowrap transition-colors py-0.5 ${
                    activeCategory === cat.id
                      ? 'text-black underline underline-offset-4 decoration-2'
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
                el?.scrollBy({ left: 240, behavior: 'smooth' });
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
        <div className="lg:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Browse Collections</span>
            <PWAInstallButton />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2.5 rounded transition-colors active:scale-98 ${
                  activeCategory === cat.id ? 'bg-black text-white' : 'text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
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
