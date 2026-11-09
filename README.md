# Tarek 360 City — Virtual Tour & AI Sales Agent Platform

Interactive 360° virtual property tour platform with real-time AI sales agent assistance, dynamic unit smart cards, analytics dashboard, multi-project lead management, and 100% native Cloudflare D1 database architecture.

---

## 🌐 Live Deployments

- **Online 360 Tour**: [https://tarek-360-city.mostafa-a-ashmawy.workers.dev](https://tarek-360-city.mostafa-a-ashmawy.workers.dev)
- **Admin Dashboard**: [https://tarek-360-city.mostafa-a-ashmawy.workers.dev/admin](https://tarek-360-city.mostafa-a-ashmawy.workers.dev/admin)

> **Admin Dashboard Passcode**: `Tarek360city`

---

## 🚀 Key Features

- **Panoramic 360° Walkthrough**: Full virtual walkthrough integration (SeekBeak / Coohom / AI Walking).
- **Interactive Master Plan Experience**: Interactive multi-block SVG map with direct modal previews and unit navigation at `/experience`.
- **AI Sales Voice Agent**: Layla — bilingual (Arabic / Egyptian dialect & English) consultative sales agent with real-time audio interaction via secure WebSocket proxy.
- **Dynamic Smart Cards**: Automated visual price, area, installment, and delivery cards popped on screen during customer conversations.
- **Cloudflare D1 Database**: Completely replaces Supabase with high-performance, serverless edge SQLite storage (`tarek-360-city-db`).
- **Cloudflare KV Namespace**: Edge-caching and state mirror for ultra-low-latency response times (`tarek_360_city_storage`).
- **Admin Dashboard**:
  - `/admin/analytics`: Real-time traffic, average session duration, conversion rates, and project performance charts powered by D1.
  - `/admin/leads`: Full lead capture CRM tracking customer inquiries, WhatsApp clicks, and consultation statuses powered by D1.
  - `/admin/settings`: Manage projects, company names, tour URLs, logos, AI agent voice/tone/prompts, and quota minutes with instant D1 persistence.
- **Protected Security Gate**: Hardened admin access guarded by passcode `Tarek360city`.

---

## 🗄️ Database Architecture (Cloudflare D1)

- **Database Name**: `tarek-360-city-db`
- **Database UUID**: `45fff787-8d2a-4a5f-8830-2618022d7530`
- **Tables**:
  - `app_settings`: Company profile, branding, project configurations, AI parameters, and minutes quota.
  - `leads`: Customer contact details, consultation channel, qualification status, and notes.
  - `sessions`: Real-time visitor conversations, language, duration, and summaries.
  - `analytics`: Daily visitor counts, average session durations, and total leads captured.

---

## 💻 Local Development & Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build and export:
   ```bash
   npm run build
   ```

3. Deploy to Cloudflare Workers:
   ```bash
   npx wrangler deploy
   ```
