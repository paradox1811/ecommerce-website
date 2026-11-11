import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  currencySymbol: string;
  currencyRate: number;
  appliedPromo: { code: string; discountPercent: number; discountFixed: number } | null;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  currencySymbol,
  currencyRate,
  appliedPromo,
  onClose,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: 'Alexandra Miller',
    email: 'alexandra.miller@example.com',
    phone: '+1 (555) 234-5678',
    address: '450 West 33rd Street, Apt 14B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    paymentMethod: 'card' as 'card' | 'cod' | 'applepay',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isOpen) return null;

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

  const shippingCost = rawSubtotal >= 49 || rawSubtotal === 0 ? 0 : Math.round(6 * currencyRate);
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.08);
  const total = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `NC-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(generatedId);
      setIsSubmitting(false);
      setOrderConfirmed(true);
      onOrderSuccess(generatedId);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 overflow-hidden border border-neutral-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {orderConfirmed ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Order Confirmed!</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Thank you for shopping with NILESCART. We have dispatched a confirmation receipt to <strong className="text-neutral-900">{formData.email}</strong>.
            </p>
            <div className="p-4 bg-neutral-50 rounded-lg max-w-sm mx-auto border border-neutral-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order Number</span>
                <span className="font-mono font-bold text-neutral-900">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Delivery</span>
                <span className="font-semibold text-neutral-900">Within 3–4 Business Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid</span>
                <span className="font-bold text-neutral-900 tabular-nums">{currencySymbol}{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Mode</span>
                <span className="capitalize text-neutral-900">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-200">
              <ShieldCheck className="w-5 h-5 text-neutral-800" />
              <h2 id="checkout-modal-title" className="text-lg font-bold text-neutral-900">Secure Express Checkout</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Customer Contact */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">1. Customer Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">2. Delivery Address</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">State / Province</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">3. Payment Option</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'applepay' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'applepay'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <span>Apple / Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          value={formData.cardExp}
                          onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-1">CVC</label>
                        <input
                          type="text"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
                    <span>Pay with cash upon package receipt. Exact change is appreciated.</span>
                  </div>
                )}
              </div>

              {/* Order Final Summary */}
              <div className="p-4 bg-[#fbfaf8] rounded-lg border border-neutral-200 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Total ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="tabular-nums font-medium text-neutral-900">{currencySymbol}{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Code Applied</span>
                    <span className="tabular-nums">-{currencySymbol}{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-700">{shippingCost === 0 ? 'FREE' : `${currencySymbol}${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax</span>
                  <span className="tabular-nums font-medium text-neutral-900">{currencySymbol}{estimatedTax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-200 pt-2">
                  <span>Total Due Today</span>
                  <span className="tabular-nums">{currencySymbol}{total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold py-3 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Place Order · {currencySymbol}{total}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
