import React from 'react';
import { Sparkles, X } from 'lucide-react';

export default function DevNoticeModal({ isOpen, onClose, featureName = 'Tính năng' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-gradient-to-b from-wood-850 via-wood-900 to-wood-950 border-2 border-gold-600 rounded-2xl text-center shadow-2xl">

        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-gold-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-gold-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-gold-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-gold-400 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-parchment-400 hover:text-gold-300 hover:bg-wood-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-headline text-xl font-bold text-gold-300 mb-2 tracking-wide">
          Thông Báo
        </h3>

        <div className="p-3 mb-5 rounded-lg bg-wood-950/80 border border-gold-600/30">
          <p className="text-sm text-parchment-200 leading-relaxed font-body">
            <span className="font-semibold text-gold-400">[{featureName}]</span> đang được phát triển!
          </p>
          <p className="text-xs text-parchment-400 mt-1">
            Chức năng này sẽ được hoàn thiện và mở cửa ở các giai đoạn tiếp theo theo đúng lộ trình dự án.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-on-gold font-headline font-bold text-sm tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          ĐÃ HIỂU
        </button>
      </div>
    </div>
  );
}
