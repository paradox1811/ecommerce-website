import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info';
  title: string;
  subtitle?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 bg-neutral-900 text-white px-4 py-3 rounded-lg shadow-xl border border-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'cart' && <ShoppingBag className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'wishlist' && <Heart className="w-5 h-5 text-rose-400 shrink-0 fill-rose-400" />}
            {toast.type === 'info' && <CheckCircle2 className="w-5 h-5 text-neutral-300 shrink-0" />}
            <div>
              <p className="text-xs font-semibold leading-tight">{toast.title}</p>
              {toast.subtitle && <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">{toast.subtitle}</p>}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white p-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
