'use client';

import React, { useState } from 'react';
import { User, Phone, Sparkles, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useAgent } from '@/context/AgentContext';
import { useSettings } from '@/context/SettingsContext';
import { trackLead } from '@/lib/analytics';

export default function LeadCaptureModal() {
  const { isLeadModalOpen, setIsLeadModalOpen, setLeadCaptured } = useAgent();
  const { activeProject, language } = useSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLeadModalOpen) return null;

  const isAr = language === 'ar';

  const validatePhone = (input: string) => {
    // Strips out spaces, dashes, parentheses
    const cleaned = input.replace(/[\s\-\(\)]/g, '');
    // Must be digits (optionally starting with +) and between 8 and 15 digits
    return /^\+?[0-9]{8,15}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError(
        isAr
          ? 'يرجى إدخال الاسم بالكامل (حرفين على الأقل).'
          : 'Please enter your full name (at least 2 characters).'
      );
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      setError(
        isAr
          ? 'يرجى إدخال رقم هاتف محمول صحيح (مثال: 01001234567 أو +201001234567).'
          : 'Please enter a valid mobile number (e.g., +20 100 123 4567).'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Cloudflare D1 & update real analytics
      await trackLead({
        project_id: activeProject?.id || 'proj_grand_tower',
        name: trimmedName,
        phone: trimmedPhone,
        channel: 'voice_agent_popup',
        status: 'qualified',
        notes: 'Submitted via interactive AI voice consultation popup',
      });

      // 2. Backup to localStorage leads
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('city360_captured_leads');
          const existing = stored ? JSON.parse(stored) : [];
          existing.push({
            id: 'lead_' + Date.now(),
            project_id: activeProject?.id || 'proj_grand_tower',
            name: trimmedName,
            phone: trimmedPhone,
            channel: 'voice_agent_popup',
            status: 'qualified',
            created_at: new Date().toISOString(),
          });
          localStorage.setItem('city360_captured_leads', JSON.stringify(existing));
          localStorage.setItem('city360_lead_captured_session', 'true');
        } catch (_) {}
      }

      // 3. Mark captured and close modal
      setLeadCaptured(true);
      setIsLeadModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to submit details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none touch-auto animate-fade-in"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 text-white z-10 animate-slide-up shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 38, 0.96), rgba(10, 10, 22, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.8), 0 0 45px rgba(99, 102, 241, 0.25)',
        }}
      >
        {/* Glow ambient background element */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-40"
          style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
        />

        {/* Header Badge & Title */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'استشارة عقارية ذكية' : 'Personalized AI Consultation'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isAr ? 'لمتابعة استشارتك وجولتك الذكية' : 'Continue Your AI Tour Consultation'}
          </h2>

          <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
            {isAr
              ? `يرجى مشاركة اسمك ورقم هاتفك لنتمكن من تزويدك بأدق التفاصيل والأسعار المناسبة لك في ${activeProject?.project_name || 'المشروع'}.`
              : `Please provide your name and phone number to unlock complete interactive AI guidance and personalized pricing for ${activeProject?.project_name || 'this project'}.`}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block">
              {isAr ? 'الاسم بالكامل:' : 'Full Name:'}
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 ${
                  isAr ? 'right-0 pr-3.5' : 'left-0 pl-3.5'
                } flex items-center pointer-events-none text-white/40`}
              >
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'مثال: محمد أحمد' : 'e.g. Mostafa Ashmawy'}
                required
                autoFocus
                className={`w-full bg-white/5 border border-white/12 rounded-2xl ${
                  isAr ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                } py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium`}
              />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block">
              {isAr ? 'رقم الهاتف المحمول (واتساب):' : 'Mobile / WhatsApp Number:'}
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 ${
                  isAr ? 'right-0 pr-3.5' : 'left-0 pl-3.5'
                } flex items-center pointer-events-none text-white/40`}
              >
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isAr ? '0100 123 4567' : '+20 100 123 4567'}
                required
                className={`w-full bg-white/5 border border-white/12 rounded-2xl ${
                  isAr ? 'pr-10 pl-4 text-right font-mono' : 'pl-10 pr-4 text-left font-mono'
                } py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium`}
              />
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/45 pt-1">
            <Lock className="w-3 h-3 text-indigo-400" />
            <span>
              {isAr
                ? 'بياناتك في أمان تام وتستخدم فقط لمساعدتك عقارياً'
                : 'Your data is strictly confidential and used only for your consultation.'}
            </span>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !phone.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/30 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
          >
            {isSubmitting ? (
              <span className="animate-pulse">
                {isAr ? 'جاري التأكيد والمتابعة...' : 'Securing your spot…'}
              </span>
            ) : (
              <>
                <span>{isAr ? 'متابعة الاستشارة الصوتية' : 'Continue Voice Consultation'}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
