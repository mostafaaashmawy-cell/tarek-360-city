'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Maximize2, Minimize2, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface TourEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: {
    id: string;
    nameAr: string;
    nameEn: string;
    unitType: string;
    area: string;
    specs: string;
    tourUrl: string;
    color: string;
  } | null;
}

export default function TourEmbedModal({ isOpen, onClose, block }: TourEmbedModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  if (!isOpen || !block) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 animate-fade-in bg-black/85 backdrop-blur-xl">
      {/* Modal Container */}
      <div
        className={`relative w-full transition-all duration-300 flex flex-col rounded-3xl overflow-hidden border border-white/15 shadow-2xl text-white ${
          isFullscreen ? 'h-full max-w-full' : 'max-w-5xl h-[88vh]'
        }`}
        style={{
          background: 'rgba(11, 14, 25, 0.96)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.2)',
        }}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
            >
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">{block.nameAr}</h3>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {block.unitType}
                </span>
              </div>
              <p className="text-white/40 text-xs sm:text-sm">
                {block.nameEn} · {block.area}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            {/* Open Direct Tab */}
            <a
              href={block.tourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
              title="فتح في تبويب كامل | Open in full tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Toggle Fullscreen inside modal */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 transition-colors border border-rose-500/30"
              title="إغلاق | Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Specs Pill Strip */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs text-white/60 overflow-x-auto">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-white/40">المميزات:</span>
            <span className="text-white/80 font-medium">{block.specs}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>جولة افتراضية تفاعلية مباشرة 360°</span>
          </div>
        </div>

        {/* Iframe Tour Area */}
        <div className="relative flex-1 w-full h-full bg-[#0a0a14] overflow-hidden">
          {isLoadingIframe && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a14] text-white">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-white/90">جاري تحميل الجولة الافتراضية 360°…</p>
              <p className="text-xs text-white/40 mt-1">SATK 360 Virtual Reality Experience</p>
            </div>
          )}

          <iframe
            src={block.tourUrl}
            title={block.nameAr}
            onLoad={() => setIsLoadingIframe(false)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; camera; gyroscope; vr; xr-spatial-tracking; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
