import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Tag, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  currencySymbol: string;
  currencyRate: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  appliedPromo: { code: string; discountPercent: number; discountFixed: number } | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cartItems,
  currencySymbol,
  currencyRate,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 49;
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const subtotal = Math.round(rawSubtotal * currencyRate);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountFixed > 0) {
      discountAmount = Math.min(subtotal, Math.round(appliedPromo.discountFixed * currencyRate));
    }
  }

  const shippingCost = rawSubtotal >= FREE_SHIPPING_THRESHOLD || rawSubtotal === 0 ? 0 : Math.round(6 * currencyRate);
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.08);
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const freeShippingProgress = Math.min(100, Math.round((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, Math.round((FREE_SHIPPING_THRESHOLD - rawSubtotal) * currencyRate));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try FRESH20 or NILES10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900">Your Shopping Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#f7f6f2] px-5 py-3 border-b border-neutral-200/80">
            <div className="flex justify-between text-xs font-medium text-neutral-800 mb-1.5">
              <span>
                {rawSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Free Express Shipping Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-neutral-900">{currencySymbol}{remainingForFreeShipping}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="tabular-nums font-semibold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Your shopping bag is empty</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Explore our curated seasonal drops and find your next elevated wardrobe essential.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = Math.round(item.product.price * currencyRate);
                return (
                  <div key={item.id} className="py-4 flex gap-3.5 items-start">
                    <div className="w-20 h-24 bg-neutral-100 rounded-md overflow-hidden shrink-0 border border-neutral-200">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 truncate">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: item.selectedColor.hex }} />
                          <span>{item.selectedColor.name}</span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-200 rounded bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-semibold tabular-nums text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-bold text-neutral-900 tabular-nums">
                          {currencySymbol}{itemPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Module */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-[#fbfaf8] space-y-3">
              {/* Promo Code Form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedPromo.code}' applied</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. FRESH20)"
                      className="flex-1 uppercase px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
                </form>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-neutral-900">{currencySymbol}{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-{currencySymbol}{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums font-medium text-neutral-900">
                    {shippingCost === 0 ? <strong className="text-emerald-700 uppercase text-[10px]">Free</strong> : `${currencySymbol}${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="tabular-nums font-medium text-neutral-900">{currencySymbol}{estimatedTax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-200 pt-2">
                  <span>Total Due</span>
                  <span className="tabular-nums">{currencySymbol}{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3 px-4 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                <span>256-bit Encrypted SSL · 30-Day Money Back Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
