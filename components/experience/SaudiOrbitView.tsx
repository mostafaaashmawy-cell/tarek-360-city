'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  MapPin,
  Layers,
  Search,
  Plus,
  Minus,
} from 'lucide-react';
import { soundManager } from './SoundManager';

interface SaudiOrbitViewProps {
  onFlyToRiyadh: () => void;
}

export default function SaudiOrbitView({ onFlyToRiyadh }: SaudiOrbitViewProps) {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isHoveringRiyadh, setIsHoveringRiyadh] = useState(false);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleTriggerFlight = () => {
    soundManager.playFlySound();
    onFlyToRiyadh();
  };

  return (
    <div
      onClick={handleTriggerFlight}
      className="relative w-full h-full overflow-hidden select-none bg-[#e5e3df] cursor-pointer"
      title="انقر على الخريطة للبدء في الهبوط والزووم نحو الرياض"
    >
      {/* ── 1. Full Screen Google Maps Screenshot (Zero Black Background) ────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/google-maps-saudi-fullscreen.jpg"
        alt="Google Maps Saudi Arabia Fullscreen"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* ── 2. Top Google Maps Search Box & Controls (Floating) ─────────────── */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        {/* Left: Google Maps Style Search Card */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80">
          <Search className="w-4 h-4 text-rose-500" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              المملكة العربية السعودية · Saudi Arabia
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Google Maps · خريطة تفاعلية
            </span>
          </div>
          <span className="mr-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            الحدود الرسمية
          </span>
        </div>

        {/* Right: Audio Toggle & Status */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all border border-slate-200/80 shadow-lg cursor-pointer"
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">الصوت مكتوم</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span className="hidden sm:inline">مؤثرات سينمائية</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── 3. Google Maps Floating Controls (Bottom) ────────────────────────── */}
      {/* Layers box (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 text-slate-800 text-xs font-bold">
        <Layers className="w-4 h-4 text-blue-600" />
        <span>طبقات الخريطة</span>
      </div>

      {/* Zoom widget (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden sm:flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden text-slate-700">
        <div className="p-2.5 border-b border-slate-100 hover:bg-slate-50">
          <Plus className="w-4 h-4" />
        </div>
        <div className="p-2.5 hover:bg-slate-50">
          <Minus className="w-4 h-4" />
        </div>
      </div>

      {/* ── 4. CENTERPIECE: RIYADH PIN & ONLY "العاصمة الرياض" ───────────────── */}
      {/* Exact coordinate in 1920x1080 full screen: left: 50.5%, top: 47.0% */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ left: '50.5%', top: '47.0%' }}
        onMouseEnter={() => setIsHoveringRiyadh(true)}
        onMouseLeave={() => setIsHoveringRiyadh(false)}
      >
        {/* Radar Waves */}
        <span className="absolute -inset-10 rounded-full border-2 border-red-500/70 animate-ping duration-1000 pointer-events-none" />
        <span className="absolute -inset-16 rounded-full border border-rose-400/50 animate-pulse duration-700 pointer-events-none" />
        <span className="absolute -inset-4 rounded-full bg-red-500/30 blur-sm animate-pulse pointer-events-none" />

        {/* Pin Ground Shadow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-4 rounded-full bg-black/40 blur-[2px] pointer-events-none translate-y-4" />

        {/* Google Maps Red Pin */}
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-115 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #ea4335, #c5221f)',
            boxShadow:
              '0 8px 25px rgba(234, 67, 53, 0.7), 0 0 15px rgba(255, 255, 255, 0.6)',
          }}
        >
          <MapPin className="w-7 h-7 text-white fill-white drop-shadow-md animate-bounce" />
        </div>

        {/* ── TEXT DIRECTLY ABOVE PIN: ONLY "العاصمة الرياض" ───────────────── */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl px-4 py-1.5 text-center shadow-xl backdrop-blur-xl border border-rose-500/50 transition-all duration-300"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(234, 67, 53, 0.35)',
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-white tracking-wide">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>العاصمة الرياض</span>
          </div>
        </div>
      </div>
    </div>
  );
}
