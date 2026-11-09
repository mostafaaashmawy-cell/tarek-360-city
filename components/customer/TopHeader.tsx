'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function TopHeader() {
  const { activeProject, language } = useSettings();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(Boolean(fsEl));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const container = document.getElementById('tour-viewport') || document.documentElement;
    const fsEl = document.fullscreenElement || (document as any).webkitFullscreenElement;

    if (!fsEl) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  const companyName =
    language === 'ar' ? activeProject.company_name_ar : activeProject.company_name;
  const projectName =
    language === 'ar' ? activeProject.project_name_ar : activeProject.project_name;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 select-none"
      style={{
        background:
          'linear-gradient(180deg, rgba(10,10,20,0.88) 0%, rgba(10,10,20,0.4) 100%)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Left: Logo + Names */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="relative flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/20 bg-white/[0.08] flex items-center justify-center p-0.5">
          {activeProject.company_logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeProject.company_logo_url}
              alt={companyName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-white font-bold text-sm select-none">
              {companyName.charAt(0)}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col leading-tight">
          <span className="text-white font-semibold text-sm tracking-wide">
            {companyName}
          </span>
          <span className="text-white/60 text-xs font-medium">{projectName}</span>
        </div>
      </div>

      {/* Right: Fullscreen, Language Toggle & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-white/80 hover:text-white transition-all border border-white/10 active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* 360 Live badge */}
        <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          360° Virtual Tour
        </span>
        <LanguageToggle />
      </div>
    </header>
  );
}
