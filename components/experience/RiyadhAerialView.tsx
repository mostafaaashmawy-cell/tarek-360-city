'use client';

import React, { useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  Compass,
  Building2,
  ChevronRight,
  Search,
  Plus,
  Minus,
  Layers,
} from 'lucide-react';
import { soundManager } from './SoundManager';

interface RiyadhAerialViewProps {
  onEnterMasterPlan: () => void;
  onBackToOrbit: () => void;
}

export default function RiyadhAerialView({
  onEnterMasterPlan,
  onBackToOrbit,
}: RiyadhAerialViewProps) {
  useEffect(() => {
    soundManager.playTargetLock();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#e5e3df]">
      {/* ── 1. Full Screen Google Maps Riyadh Image (Zero Black Background) ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/google-maps-riyadh-fullscreen.jpg"
        alt="Google Maps Riyadh Fullscreen"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* ── 2. Top Bar with Search & Back to Saudi Map ───────────────────────── */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        {/* Left: Back Button & Search Box */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playFlySound();
              onBackToOrbit();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all border border-slate-200/80 shadow-xl cursor-pointer"
          >
            <Compass className="w-4 h-4 text-rose-500" />
            <span>خريطة المملكة</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80">
            <Search className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-slate-900">
              الرياض، المملكة العربية السعودية · Riyadh
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              Google Maps
            </span>
          </div>
        </div>
      </header>

      {/* ── 3. Google Maps Floating Controls ─────────────────────────────────── */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 text-slate-800 text-xs font-bold">
        <Layers className="w-4 h-4 text-blue-600" />
        <span>خريطة الرياض</span>
      </div>

      <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden sm:flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden text-slate-700">
        <div className="p-2.5 border-b border-slate-100 hover:bg-slate-50">
          <Plus className="w-4 h-4" />
        </div>
        <div className="p-2.5 hover:bg-slate-50">
          <Minus className="w-4 h-4" />
        </div>
      </div>

      {/* ── 4. CENTER LOCATION PIN & PROJECT CARD IN HEART OF RIYADH ─────────── */}
      {/* Exact coordinate in 1920x1080 full screen: left: 50.0%, top: 49.0% */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
        style={{ left: '50.0%', top: '49.0%' }}
      >
        {/* Pulsating animated radar circles */}
        <span className="absolute w-48 h-48 rounded-full border-2 border-red-500/70 animate-ping duration-1000 pointer-events-none" />
        <span className="absolute w-32 h-32 rounded-full border border-rose-400/50 animate-pulse duration-700 pointer-events-none" />
        <span className="absolute w-14 h-14 rounded-full bg-red-500/30 blur-sm pointer-events-none" />

        {/* Pin Ground Shadow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-5 rounded-full bg-black/40 blur-[2px] pointer-events-none translate-y-5" />

        {/* Google Maps Location Pin Button */}
        <button
          onClick={() => {
            soundManager.playBlockClick();
            onEnterMasterPlan();
          }}
          className="group relative w-15 h-15 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer z-20"
          style={{
            background: 'linear-gradient(135deg, #ea4335, #c5221f)',
            boxShadow:
              '0 10px 30px rgba(234, 67, 53, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)',
          }}
          title="انقر للدخول إلى المخطط العام للمشروع"
        >
          <MapPin className="w-8 h-8 text-white fill-white group-hover:animate-bounce drop-shadow-md" />
        </button>

        {/* Floating Project Card directly above Pin */}
        <div
          className="absolute -top-36 left-1/2 -translate-x-1/2 w-76 sm:w-80 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-2xl border border-rose-500/50 transition-all duration-300 z-30"
          style={{
            background: 'rgba(15, 23, 42, 0.96)',
            boxShadow:
              '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(234, 67, 53, 0.35)',
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-1">
            <Sparkles className="w-3 h-3 text-rose-300 animate-pulse" />
            <span>موقع المشروع في قلب الرياض</span>
          </div>

          <h3 className="text-base font-black text-white">مشروع ساتك 360 سيتي</h3>
          <p className="text-[11px] text-white/70 mt-0.5 mb-2.5 leading-relaxed">
            مخطط عمراني متكامل يضم فلل ملكية وتاون هاوس محاطة بالحدائق
          </p>

          {/* Primary Call to Action Button */}
          <button
            onClick={() => {
              soundManager.playBlockClick();
              onEnterMasterPlan();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #ea4335, #ef4444)',
              boxShadow: '0 8px 25px rgba(234, 67, 53, 0.5)',
            }}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>دخول المخطط العام ثلاثي الأبعاد 3D</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
