'use client';

import React, { useState } from 'react';
import { Clock, KeyRound, ShieldAlert, CheckCircle2, X, Plus } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface AddMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProjectId?: string;
}

const PRESET_AMOUNTS = [30, 60, 120, 300];

export default function AddMinutesModal({
  isOpen,
  onClose,
}: AddMinutesModalProps) {
  const { settings, language, addMinutes } = useSettings();

  const [minutes, setMinutes] = useState<number>(60);
  const [secretCode, setSecretCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (minutes <= 0 || !Number.isInteger(minutes)) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال عدد صحيح موجب من الدقائق.'
          : 'Please enter a valid positive integer for minutes.'
      );
      return;
    }

    if (!secretCode) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال الرمز السري للمشرف.'
          : 'Please enter the Secret Admin Code.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addMinutes(minutes, secretCode.trim());
      if (res.success) {
        setSuccessMsg(
          language === 'ar'
            ? `تمت إضافة ${minutes} دقيقة بنجاح! الرصيد الإجمالي: ${res.available_minutes} دقيقة`
            : `Successfully added ${minutes} AI minutes! Master balance: ${res.available_minutes} mins`
        );
        setSecretCode('');
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1500);
      } else {
        setError(res.error || (language === 'ar' ? 'رمز المشرف السري غير صالح.' : 'Invalid Secret Admin Code.'));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add minutes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-3xl p-6 md:p-8 space-y-6 text-white z-10 animate-slide-up shadow-2xl"
        style={{
          background: 'rgba(15, 15, 28, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'ar' ? 'شحن رصيد دقائق الذكاء الاصطناعي' : 'Add AI Voice Minutes'}
              </h2>
              <p className="text-xs text-white/50">
                {language === 'ar' ? 'الرصيد الإجمالي للحساب' : 'Master Account Quota'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <span className="text-white/60">
            {language === 'ar' ? 'الرصيد الإجمالي المتاح:' : 'Current Master Balance:'}
          </span>
          <span className="font-bold text-indigo-300 text-sm">
            {settings.available_minutes ?? 100} {language === 'ar' ? 'دقيقة' : 'Minutes'}
          </span>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quick Select Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/70 block">
              {language === 'ar' ? 'اختر باقة الدقائق:' : 'Select Minute Package:'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMinutes(amt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    minutes === amt
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  +{amt}m
                </button>
              ))}
            </div>
          </div>

          {/* Custom Minutes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 block">
              {language === 'ar' ? 'أو أدخل عدد الدقائق يدوياً:' : 'Or Enter Custom Minutes:'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 font-medium pointer-events-none">
                {language === 'ar' ? 'دقيقة' : 'Minutes'}
              </span>
            </div>
          </div>

          {/* Secret Code Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 block flex items-center justify-between">
              <span>{language === 'ar' ? 'رمز المشرف السري:' : 'Secret Admin Code:'}</span>
              <span className="text-[10px] text-white/40 font-normal">
                {language === 'ar' ? 'مطلوب للتأكيد' : 'Required to Authorize'}
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder-white/30 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || !secretCode}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/25"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
          >
            <Plus className="w-4 h-4" />
            <span>
              {isSubmitting
                ? language === 'ar'
                  ? 'جاري الشحن والتحقق...'
                  : 'Authorizing & Adding…'
                : language === 'ar'
                ? `إضافة ${minutes} دقيقة إلى الرصيد`
                : `Confirm & Add ${minutes} Minutes`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
