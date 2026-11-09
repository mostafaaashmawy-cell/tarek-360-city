'use client';

import React, { useState } from 'react';
import SaudiOrbitView from '@/components/experience/SaudiOrbitView';
import RiyadhAerialView from '@/components/experience/RiyadhAerialView';
import MasterPlanView from '@/components/experience/MasterPlanView';
import { soundManager } from '@/components/experience/SoundManager';

type Stage = 'orbit' | 'zooming_to_riyadh' | 'riyadh' | 'zooming_to_masterplan' | 'masterplan';

export default function ExperiencePage() {
  const [stage, setStage] = useState<Stage>('orbit');

  // Trigger Flight to Riyadh with Movie-style Zoom
  const handleFlyToRiyadh = () => {
    soundManager.playFlySound();
    setStage('zooming_to_riyadh');

    // Smooth Google Earth transition duration
    setTimeout(() => {
      setStage('riyadh');
    }, 1750);
  };

  // Trigger Enter Master Plan from Location Pin
  const handleEnterMasterPlan = () => {
    soundManager.playFlySound();
    setStage('zooming_to_masterplan');

    // Dive-in duration
    setTimeout(() => {
      setStage('masterplan');
    }, 1300);
  };

  const handleBackToRiyadh = () => {
    setStage('riyadh');
  };

  const handleBackToOrbit = () => {
    setStage('orbit');
  };

  return (
    <main className="relative w-screen h-screen bg-[#0b0f19] text-white overflow-hidden">
      {/* ── STAGE 1: Real Google Maps View of Saudi Arabia ─────────────────── */}
      {stage === 'orbit' && <SaudiOrbitView onFlyToRiyadh={handleFlyToRiyadh} />}

      {/* ── CINEMATIC TRANSITION 1: Google Maps Zoom into Riyadh ─────────────── */}
      {stage === 'zooming_to_riyadh' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#e5e3df]">
          {/* Zooming Saudi Google Maps Texture towards Riyadh point */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center animate-google-earth-zoom pointer-events-none"
            style={{
              backgroundImage: 'url(/google-maps-saudi-fullscreen.jpg)',
              transformOrigin: '50.5% 47.0%',
            }}
          />

          {/* High velocity motion speed lines & atmospheric haze */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-50 speed-lines" />
          <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-t from-rose-500/20 via-slate-900/40 to-transparent" />

          {/* HUD Target Lock Overlay */}
          <div className="relative z-40 text-center space-y-3 bg-black/80 px-8 py-5 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="w-12 h-12 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl shadow-rose-500/50" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-mono">
              APPROACHING RIYADH METROPOLITAN
            </h2>
            <p className="text-xs font-mono text-rose-300">
              GOOGLE MAPS NAVIGATION · TARGET ACQUIRED
            </p>
          </div>
        </div>
      )}

      {/* ── STAGE 2: Riyadh Google Maps View with Location Pin ──────────────── */}
      {stage === 'riyadh' && (
        <RiyadhAerialView
          onEnterMasterPlan={handleEnterMasterPlan}
          onBackToOrbit={handleBackToOrbit}
        />
      )}

      {/* ── CINEMATIC TRANSITION 2: Diving into Master Plan ──────────────────── */}
      {stage === 'zooming_to_masterplan' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#e5e3df]">
          {/* Zooming Riyadh Google Maps texture into project point */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center animate-google-earth-zoom pointer-events-none"
            style={{
              backgroundImage: 'url(/google-maps-riyadh-fullscreen.jpg)',
              transformOrigin: '50.0% 49.0%',
            }}
          />
          <div className="absolute inset-0 z-20 pointer-events-none opacity-50 speed-lines" />
          <div className="relative z-40 text-center space-y-2 bg-black/80 px-8 py-5 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto shadow-rose-500/50" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wider">
              جاري فتح المخطط العام ثلاثي الأبعاد…
            </h2>
            <p className="text-xs text-rose-300 font-mono">ENTERING SATK 360 RESIDENTIAL MASTER PLAN</p>
          </div>
        </div>
      )}

      {/* ── STAGE 3: New Photorealistic 3D Master Plan with Interactive Blocks ── */}
      {stage === 'masterplan' && (
        <MasterPlanView
          onBackToRiyadh={handleBackToRiyadh}
          onBackToOrbit={handleBackToOrbit}
        />
      )}
    </main>
  );
}
