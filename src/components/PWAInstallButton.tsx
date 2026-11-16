import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed as native standalone app, do not show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs transition-transform active:scale-95"
        title="Install NILESCART on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[11px] font-bold px-3 py-1.5 rounded-full border border-neutral-300 transition-transform active:scale-95"
          title="Install on iPhone / iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-[#d4af37] font-black text-xl shadow-md">
                  N
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Install NILESCART</h3>
                  <p className="text-xs text-neutral-500">Fast native shopping experience</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-blue-600 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span>1. Tap the <strong>Share</strong> button in Safari toolbar.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-neutral-900 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>3. Tap <strong>Add</strong> at top right to complete.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-neutral-900 text-amber-400 text-xs font-bold py-2 px-4 flex items-center justify-center gap-2 shadow-md">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode — Browsing cached catalog</span>
    </div>
  );
};
