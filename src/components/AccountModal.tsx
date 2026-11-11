import React, { useState } from 'react';
import { X, Package, ShieldCheck, Mail, MapPin, User, Search } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Array<{ id: string; date: string; status: string; total: number }>;
  currencySymbol: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
  currencySymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'track'>('orders');
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    if (trackQuery.toUpperCase().startsWith('NC-')) {
      setTrackResult(`Order ${trackQuery.toUpperCase()} is currently In Transit via DHL Express. Estimated delivery in 2 days.`);
    } else {
      setTrackResult(`Order ${trackQuery} located: Processing at Central Logistics Facility. Dispatched shortly.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 overflow-hidden border border-neutral-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          aria-label="Close account modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
          <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg">
            AM
          </div>
          <div>
            <h2 id="account-modal-title" className="text-base font-bold text-neutral-900">Alexandra Miller</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>Noir Member</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Tier 1 Benefits</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'track' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Track Parcel
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Saved Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-4 max-h-[50vh] overflow-y-auto">
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  <Package className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                  <p>You have no recent orders placed in this session.</p>
                </div>
              ) : (
                recentOrders.map((ord) => (
                  <div key={ord.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between font-semibold text-neutral-900">
                      <span className="font-mono">{ord.id}</span>
                      <span className="tabular-nums">{currencySymbol}{ord.total}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-500 text-[11px] mt-1">
                      <span>Date: {ord.date}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">{ord.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-700">Enter Order Reference (e.g. NC-739210)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="NC-XXXXXX"
                    className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded font-mono uppercase focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track</span>
                  </button>
                </div>
              </form>

              {trackResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <Package className="w-4 h-4 text-emerald-700" />
                    <span>Shipment Status Update</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-[11px] text-emerald-800">{trackResult}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs text-neutral-700">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <MapPin className="w-4 h-4 text-neutral-600" />
                  <span>Default Shipping Address</span>
                </div>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Alexandra Miller<br />
                  450 West 33rd Street, Apt 14B<br />
                  New York, NY 10001, United States
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-neutral-600" />
                  <span>Security & Authentication</span>
                </div>
                <p className="text-neutral-500 text-[11px]">Two-Factor Authentication is active for this session.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
