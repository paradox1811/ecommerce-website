import React, { useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products: Product[];
  currencySymbol: string;
  currencyRate: number;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectTag: (tag: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  searchQuery,
  onSearchChange,
  products,
  currencySymbol,
  currencyRate,
  onClose,
  onSelectProduct,
  onSelectTag,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularSearches = [
    'Linen Blazer',
    'Silk Dress',
    'Pleated Trousers',
    'Crochet Top',
    'Raw Denim',
    'Trench Coat',
    'Co-Ords',
  ];

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200 z-10"
        role="dialog"
        aria-modal="true"
        aria-label="Search NILESCART catalog"
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product, style, category, or fabric (e.g. Linen Blazer)..."
            className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-neutral-400 hover:text-neutral-700 p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-2 py-1 bg-neutral-100 rounded"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* If No Query: Show Trending Searches */}
          {!searchQuery.trim() ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                <TrendingUp className="w-4 h-4 text-neutral-600" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      onSearchChange(term);
                      onSelectTag(term);
                    }}
                    className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Search Results */
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                <span>Matching Items ({filteredProducts.length})</span>
                {filteredProducts.length > 0 && <span>Click to inspect</span>}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-semibold text-neutral-800">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-neutral-500 mt-1">Try checking for typos or searching for broader terms like "dress" or "trousers".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => {
                    const price = Math.round(p.price * currencyRate);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50/80 cursor-pointer transition-all"
                      >
                        <div className="w-14 h-18 bg-neutral-100 rounded overflow-hidden shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">{p.category}</span>
                          <h4 className="text-xs font-semibold text-neutral-900 truncate mt-0.5">{p.name}</h4>
                          <span className="text-xs font-bold text-neutral-900 tabular-nums mt-1 block">
                            {currencySymbol}{price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
