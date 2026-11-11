import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlist: Product[];
  currencySymbol: string;
  currencyRate: number;
  onClose: () => void;
  onRemove: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlist,
  currencySymbol,
  currencyRate,
  onClose,
  onRemove,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base font-bold text-neutral-900">Your Wishlist ({wishlist.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Save pieces you love to build your dream minimalist capsule wardrobe.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Explore New Arrivals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              wishlist.map((item) => {
                const itemPrice = Math.round(item.price * currencyRate);
                return (
                  <div key={item.id} className="py-4 flex gap-3.5 items-start">
                    <div className="w-20 h-24 bg-neutral-100 rounded-md overflow-hidden shrink-0 border border-neutral-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">{item.category}</span>
                        <button
                          onClick={() => onRemove(item)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove from wishlist"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900 truncate mt-0.5">{item.name}</h4>
                      <p className="text-xs font-bold text-neutral-900 tabular-nums mt-1">{currencySymbol}{itemPrice}</p>

                      <button
                        onClick={() => {
                          onMoveToCart(item);
                          onRemove(item);
                        }}
                        className="mt-2.5 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-semibold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-neutral-200 bg-[#fbfaf8]">
              <p className="text-[11px] text-neutral-500 text-center">
                Items in your wishlist are reserved temporarily based on current warehouse stock.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
