import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Truck, RotateCcw, Ruler, ChevronDown } from 'lucide-react';
import { Product, ProductColor, Review } from '../types';
import { REVIEWS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  currencySymbol: string;
  currencyRate: number;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currencySymbol,
  currencyRate,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<'material' | 'fit' | 'shipping' | null>('material');
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const displayPrice = Math.round(product.price * currencyRate);
  const displayOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * currencyRate) : null;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment,
      verifiedBuyer: true,
      sizePurchased: selectedSize,
      fitFeedback: 'True to size',
    };

    setReviews([newReview, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl my-auto overflow-hidden border border-neutral-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors shadow-xs"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Gallery Column */}
          <div className="p-6 bg-[#fbfaf8] flex flex-col gap-4 border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="relative aspect-[3/4] w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200/80">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs tracking-wider">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-neutral-900 scale-102' : 'border-neutral-200 hover:border-neutral-400 opacity-70'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-600 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-neutral-800" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-neutral-800" />
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-neutral-800" />
                <span>Carbon Neutral</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Purchase Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-widest font-bold text-neutral-700">{product.category}</span>
                  {product.gender && (
                    <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                      {product.gender}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-neutral-900">{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 id="product-modal-title" className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                  {currencySymbol} {displayPrice.toLocaleString()}
                </span>
                {displayOriginalPrice && (
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    {currencySymbol} {displayOriginalPrice.toLocaleString()}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-semibold text-[#8e7b57] bg-[#f5f2eb] px-2 py-0.5 rounded">
                    Save {currencySymbol} {(displayOriginalPrice ? displayOriginalPrice - displayPrice : 0).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-900 mb-2">
                  <span>Color: <strong className="text-neutral-700 font-semibold">{selectedColor.name}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-2 transition-all ${
                        selectedColor.name === c.name
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-900 mb-2">
                  <span>Select Size</span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 underline text-xs transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-semibold rounded-md border transition-all ${
                        selectedSize === s
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Stock */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-700">Quantity</span>
                  <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors font-bold text-sm"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold tabular-nums text-neutral-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors font-bold text-sm"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-xs">
                  {product.stockCount && product.stockCount <= 5 ? (
                    <span className="text-amber-700 font-semibold">Only {product.stockCount} items left in stock</span>
                  ) : (
                    <span className="text-emerald-700 font-medium">Ready to ship</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedColor, selectedSize, quantity);
                    onClose();
                  }}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag · {currencySymbol} {(displayPrice * quantity).toLocaleString()}
                </button>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-neutral-300 hover:border-neutral-900 text-neutral-700'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Accordion Details */}
              <div className="mt-8 border-t border-neutral-200 divide-y divide-neutral-100 text-xs">
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'material' ? null : 'material')}
                    className="w-full py-3 flex items-center justify-between text-left font-semibold text-neutral-900"
                  >
                    <span>Fabric & Composition</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'material' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'material' && (
                    <div className="pb-3 text-neutral-600 leading-relaxed">
                      <p>• {product.details.material}</p>
                      <p className="mt-1">• Care: {product.details.care}</p>
                      <p className="mt-1">• {product.details.origin}</p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'fit' ? null : 'fit')}
                    className="w-full py-3 flex items-center justify-between text-left font-semibold text-neutral-900"
                  >
                    <span>Sizing & Fit Advice</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'fit' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'fit' && (
                    <div className="pb-3 text-neutral-600 leading-relaxed">
                      <p>{product.details.fit}</p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full py-3 flex items-center justify-between text-left font-semibold text-neutral-900"
                  >
                    <span>Complimentary Shipping & Returns</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-3 text-neutral-600 leading-relaxed">
                      <p>Orders are dispatched within 24 hours. Free express worldwide delivery on orders over $49. 30-day effortless returns with prepaid courier pickup.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Verified Client Reviews</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Overall rating {product.rating} / 5.0</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-semibold text-neutral-900 underline hover:text-neutral-600"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleAddReview} className="mb-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Jordan K."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1"
                          >
                            <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Your Review</label>
                      <textarea
                        required
                        rows={2}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Share details about the fit, fabric quality, and comfort..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-neutral-50/70 rounded-md border border-neutral-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-neutral-900">{rev.author}</span>
                        <span className="text-[10px] text-neutral-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-700 font-medium ml-1">Verified Buyer</span>
                        )}
                      </div>
                      <p className="text-neutral-600 leading-normal">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
