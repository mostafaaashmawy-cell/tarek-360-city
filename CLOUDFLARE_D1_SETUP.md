# Cloudflare D1 Database Setup — Tarek 360 City

This project runs 100% natively on **Cloudflare D1** (`tarek-360-city-db`), eliminating the need for any external Supabase instance.

---

## Database Details

- **Database Name**: `tarek-360-city-db`
- **Database UUID**: `45fff787-8d2a-4a5f-8830-2618022d7530`
- **KV Storage**: `tarek_360_city_storage` (`49b57c8dd1b1455f92c8eb6f727d3ea2`)

---

## SQL Schema

```sql
-- 1. App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  company_name TEXT NOT NULL DEFAULT 'Tarek Developments',
  company_name_ar TEXT NOT NULL DEFAULT 'شركة طارق للتطوير العقاري',
  project_name TEXT NOT NULL DEFAULT 'Tarek 360 City',
  project_name_ar TEXT NOT NULL DEFAULT 'طارق 360 سيتي',
  company_logo_url TEXT NOT NULL DEFAULT '/city-scale-logo.png',
  virtual_tour_url TEXT NOT NULL DEFAULT 'https://app.seekbeak.com/v/Xw1bK444z5k',
  coohom_url TEXT NOT NULL DEFAULT 'https://app.seekbeak.com/v/Xw1bK444z5k',
  whatsapp_number TEXT NOT NULL DEFAULT '201000000000',
  ai_api_key TEXT NOT NULL DEFAULT '',
  ai_connection_method TEXT NOT NULL DEFAULT 'websocket_live',
  ai_agent_name TEXT NOT NULL DEFAULT 'Layla',
  ai_voice TEXT NOT NULL DEFAULT 'Aoede',
  ai_tone TEXT NOT NULL DEFAULT 'consultative',
  ai_prompt TEXT NOT NULL DEFAULT 'You are Layla, the official sales advisor for Tarek Developments.',
  available_minutes REAL NOT NULL DEFAULT 120.0,
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  active_project_id TEXT NOT NULL DEFAULT 'proj_grand_tower',
  projects TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'proj_grand_tower',
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'voice_agent_popup',
  status TEXT NOT NULL DEFAULT 'qualified',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL DEFAULT 'proj_grand_tower',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  visitor_name TEXT,
  visitor_phone TEXT,
  conversation_summary TEXT NOT NULL DEFAULT '',
  requested_details TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new',
  language TEXT NOT NULL DEFAULT 'ar'
);

-- 4. Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  visitor_count INTEGER NOT NULL DEFAULT 0,
  avg_session_duration INTEGER NOT NULL DEFAULT 0,
  leads_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```
