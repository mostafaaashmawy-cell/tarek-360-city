import type { AppSettings, LeadSession, AnalyticsSummary, SmartCardData, Project } from '@/types';

// ─── Default System Prompt Template for Projects ─────────────────────────────
export const DEFAULT_AI_PROMPT = `You are Layla, an expert real estate sales agent representing City Scale Physical & Visual Modeling Co.
Speak in a warm, professional, and consultative manner. You seamlessly speak Arabic (Egyptian dialect) and English.
Calculate and present financial installments based on a 7-year installment plan with a 10% downpayment.
When discussing prices, unit areas, or payment schedules, you MUST trigger the 'show_dynamic_smart_cards' tool to show the cards visually on screen.`;

// ─── Initial Projects ────────────────────────────────────────────────────────
export const mockProjects: Project[] = [
  {
    id: 'proj_grand_tower',
    slug: 'tarek-masterplan',
    is_active: true,
    company_name: 'Tarek Developments',
    company_name_ar: 'شركة طارق للتطوير العقاري',
    project_name: 'Master plan',
    project_name_ar: 'ماستر بلان',
    virtual_tour_url: 'https://app.seekbeak.com/v/Xw1bK444z5k',
    company_logo_url: '/city-scale-logo.png',
    whatsapp_number: '201000000000',
    primary_color: '#6366f1',
    ai_voice: 'Aoede',
    ai_tone: 'consultative',
    ai_agent_name: 'Layla',
    ai_prompt: `You are Layla, the official sales advisor for Master plan by Tarek Developments.`,
    consumed_minutes: 0.0,
    available_minutes: 120,
    created_at: '2026-11-09T10:00:00Z',
  },
  {
    id: 'proj_marina_bay',
    slug: 'Villa-a1',
    is_active: true,
    company_name: 'Tarek Developments',
    company_name_ar: 'شركة طارق للتطوير العقاري',
    project_name: 'Villa A1',
    project_name_ar: 'فيلا A1',
    virtual_tour_url: 'https://app.seekbeak.com/v/EB15JonWzgV',
    company_logo_url: '/city-scale-logo.png',
    whatsapp_number: '201000000000',
    primary_color: '#06b6d4',
    ai_voice: 'Aoede',
    ai_tone: 'friendly',
    ai_agent_name: 'Sarah',
    ai_prompt: `You are Sarah, sales consultant for Villa A1 by Tarek Developments.`,
    consumed_minutes: 0.0,
    available_minutes: 120,
    created_at: '2026-11-09T10:00:00Z',
  },
];

// ─── Demo Smart Cards ─────────────────────────────────────────────────────────
export const DEMO_SMART_CARDS: SmartCardData[] = [
  {
    id: 'dp',
    label: 'Downpayment',
    labelAr: 'مقدم الحجز',
    value: 'EGP 350,000 (10%)',
    icon: '💰',
    color: 'green',
  },
  {
    id: 'inst',
    label: 'Installments',
    labelAr: 'الأقساط الشهرية',
    value: 'EGP 12,500 / month over 7 years',
    icon: '📅',
    color: 'blue',
  },
  {
    id: 'area',
    label: 'Unit Area',
    labelAr: 'مساحة الوحدة',
    value: '142 m² — 2 Bed, 2 Bath',
    icon: '📐',
    color: 'purple',
  },
  {
    id: 'del',
    label: 'Delivery',
    labelAr: 'موعد التسليم',
    value: 'Q4 2027 — Fully Finished',
    icon: '🏗️',
    color: 'orange',
  },
  {
    id: 'kw',
    label: 'Highlights',
    labelAr: 'المميزات',
    value: 'Pool View · Smart Home · 2 Parking',
    icon: '✨',
    color: 'rose',
  },
];

// ─── Default App Settings ─────────────────────────────────────────────────────
export const mockSettings: AppSettings = {
  id: '1',
  company_logo_url: '/city-scale-logo.png',
  company_name: 'Tarek Developments',
  company_name_ar: 'شركة طارق للتطوير العقاري',
  project_name: 'Master plan',
  project_name_ar: 'ماستر بلان',
  coohom_url: 'https://app.seekbeak.com/v/Xw1bK444z5k',
  virtual_tour_url: 'https://app.seekbeak.com/v/Xw1bK444z5k',
  whatsapp_number: '201000000000',
  ai_api_key: '',
  ai_connection_method: 'gemini',
  ai_agent_name: 'Layla',
  ai_voice: 'Aoede',
  ai_tone: 'consultative',
  ai_prompt: DEFAULT_AI_PROMPT,
  available_minutes: 120,
  primary_color: '#6366f1',
  projects: mockProjects,
  active_project_id: 'proj_grand_tower',
};

// ─── Real Lead Sessions (Populated from live visitors) ─────────────────────────
export const mockSessions: LeadSession[] = [];

// ─── Analytics Seed Data (Real visitor and lead counters) ─────────────────────
export const mockAnalytics: AnalyticsSummary = {
  total_visitors: 0,
  avg_session_duration: 0,
  total_leads: 0,
  conversion_rate: 0,
  daily: [],
};
