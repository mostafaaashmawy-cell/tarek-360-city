'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const ADMIN_AUTH_KEY = 'tarek360_admin_session_auth';
// Admin passcodes for Tarek 360 City
const VALID_PASSCODES = ['Tarek360city', 'tarek360city', 'cityscale2026', 'admin123', 'tarek360'];

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.dispatchEvent(new Event('tarek360_admin_logout'));
  }
}

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { activeProject, language } = useSettings();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check session on mount
    const authStatus = sessionStorage.getItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(authStatus === 'true');

    // Listen for logout events from sidebar
    const handleLogout = () => setIsAuthenticated(false);
    window.addEventListener('tarek360_admin_logout', handleLogout);
    return () => window.removeEventListener('tarek360_admin_logout', handleLogout);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const trimmed = passcode.trim();
      if (VALID_PASSCODES.includes(trimmed)) {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        setIsAuthenticated(true);
      } else {
        setError(language === 'ar' ? 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' : 'Invalid passcode. Please try again.');
      }
      setIsSubmitting(false);
    }, 250);
  };

  // Loading state while checking sessionStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-white/40 text-sm">
        Verifying Security Credentials…
      </div>
    );
  }

  // If not authenticated, render secure login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a14] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div
          className="max-w-md w-full rounded-3xl p-8 space-y-6 relative z-10 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* Logo / Lock icon */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center text-indigo-400 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-wide">
              {language === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Security Gate'}
            </h1>
            <p className="text-xs text-white/50">
              {language === 'ar'
                ? 'يرجى إدخال كلمة مرور المشرف للوصول إلى الإعدادات والإحصائيات'
                : 'Enter your admin passcode to access project settings and lead management'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-start">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل كلمة المرور...' : 'Enter Admin Passcode...'}
                autoFocus
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-center tracking-widest font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
              style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
            >
              <span>{isSubmitting ? (language === 'ar' ? 'جاري التحقق...' : 'Authenticating…') : (language === 'ar' ? 'دخول لوحة التحكم' : 'Unlock Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-white/30">
            {language === 'ar' ? 'جلسة مشفرة ومحمية من سيتي سكيل' : 'Protected Session · City Scale Platform'}
          </p>
        </div>
      </div>
    );
  }

  // Render protected admin application
  return <>{children}</>;
}
