import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const measurements = unit === 'in' ? [
    { size: 'XS', bust: '31 - 32.5', waist: '24 - 25.5', hips: '34 - 35.5' },
    { size: 'S', bust: '33 - 34.5', waist: '26 - 27.5', hips: '36 - 37.5' },
    { size: 'M', bust: '35 - 36.5', waist: '28 - 29.5', hips: '38 - 39.5' },
    { size: 'L', bust: '37 - 39.0', waist: '30 - 32.0', hips: '40 - 42.0' },
    { size: 'XL', bust: '40 - 42.5', waist: '33 - 35.5', hips: '43 - 45.5' },
  ] : [
    { size: 'XS', bust: '79 - 83', waist: '61 - 65', hips: '86 - 90' },
    { size: 'S', bust: '84 - 88', waist: '66 - 70', hips: '91 - 95' },
    { size: 'M', bust: '89 - 93', waist: '71 - 75', hips: '96 - 100' },
    { size: 'L', bust: '94 - 99', waist: '76 - 81', hips: '101 - 107' },
    { size: 'XL', bust: '100 - 108', waist: '82 - 90', hips: '108 - 116' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 overflow-hidden border border-neutral-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-neutral-800" />
            <h3 id="size-guide-title" className="text-lg font-semibold text-neutral-900">NILESCART Size & Fit Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between my-4">
          <p className="text-xs text-neutral-500">Standard body measurements in {unit === 'in' ? 'inches' : 'centimeters'}</p>
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-md transition-colors ${unit === 'in' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'}`}
            >
              IN
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-colors ${unit === 'cm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-y border-neutral-200 text-neutral-600 uppercase tracking-wider font-medium">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Bust</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {measurements.map((row) => (
                <tr key={row.size} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">{row.size}</td>
                  <td className="py-2.5 px-3 tabular-nums text-neutral-700">{row.bust}</td>
                  <td className="py-2.5 px-3 tabular-nums text-neutral-700">{row.waist}</td>
                  <td className="py-2.5 px-3 tabular-nums text-neutral-700">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-5 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
          <span className="font-semibold text-neutral-900">How to measure: </span>
          Keep the tape level and snug, but not tight. If your measurements fall between two sizes, we recommend sizing down for a tailored silhouette or sizing up for an oversized runway drape.
        </div>
      </div>
    </div>
  );
};
