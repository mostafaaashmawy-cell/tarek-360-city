# Supabase Setup — SATK 360 City

Complete guide to set up the Supabase database for SATK 360 City.

---

## Step 1 — Run the SQL Schema

Go to your Supabase project dashboard → **SQL Editor** → **New query** → paste and run the following SQL:

```sql
-- ============================================================
-- SATK 360 CITY — Complete Database Schema for Supabase
-- ============================================================

-- 1. App Settings Table (Single-row master configuration & projects)
create table if not exists public.app_settings (
  id                   text primary key default '1',
  company_name         text not null default 'SATK 360 City',
  company_name_ar      text not null default 'ساتك 360 سيتي',
  project_name         text not null default 'The Grand Tower',
  project_name_ar      text not null default 'البرج الكبير',
  company_logo_url     text not null default '/city-scale-logo.png',
  virtual_tour_url     text not null default 'https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO48TC8B9C8&locale=en_US',
  coohom_url           text not null default 'https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO48TC8B9C8&locale=en_US',
  whatsapp_number      text not null default '201000000000',
  ai_api_key           text not null default '',
  ai_connection_method text not null default 'websocket_live',
  ai_agent_name        text not null default 'Layla',
  ai_voice             text not null default 'Aoede',
  ai_tone              text not null default 'consultative',
  ai_prompt            text not null default '',
  available_minutes    numeric not null default 120.0,
  primary_color        text not null default '#6366f1',
  active_project_id    text not null default 'proj_grand_tower',
  projects             jsonb not null default '[]'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Trigger for updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_settings_updated_at on public.app_settings;
create trigger app_settings_updated_at
  before update on public.app_settings
  for each row execute function public.update_updated_at();

-- Seed default settings row if empty
insert into public.app_settings (
  id, company_name, company_name_ar, project_name, project_name_ar, available_minutes, active_project_id
) values (
  '1', 'SATK 360 City', 'ساتك 360 سيتي', 'The Grand Tower', 'البرج الكبير', 120.0, 'proj_grand_tower'
) on conflict (id) do nothing;

-- 2. Leads Table (Direct lead capture via AI Voice Consultation & WhatsApp)
create table if not exists public.leads (
  id          text primary key default gen_random_uuid()::text,
  project_id  text not null default 'proj_grand_tower',
  name        text not null default '',
  phone       text not null default '',
  channel     text not null default 'voice_agent_popup',
  status      text not null default 'qualified',
  notes       text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_project_idx on public.leads (project_id);

-- 3. Sessions Table (Visitor AI Conversation History & Details)
create table if not exists public.sessions (
  id                    text primary key default gen_random_uuid()::text,
  project_id            text not null default 'proj_grand_tower',
  created_at            timestamptz not null default now(),
  duration_seconds      int not null default 0,
  visitor_name          text,
  visitor_phone         text,
  conversation_summary  text not null default '',
  requested_details     jsonb not null default '[]'::jsonb,
  status                text not null default 'new'
                          check (status in ('new','qualified','need_assistance','contacted','closed')),
  language              text not null default 'ar'
                          check (language in ('en', 'ar'))
);

create index if not exists sessions_created_at_idx on public.sessions (created_at desc);

-- 4. Analytics Table (Daily stats)
create table if not exists public.analytics (
  id                    bigint primary key generated always as identity,
  date                  date not null unique,
  visitor_count         int not null default 0,
  avg_session_duration  int not null default 0,
  leads_count           int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

drop trigger if exists analytics_updated_at on public.analytics;
create trigger analytics_updated_at
  before update on public.analytics
  for each row execute function public.update_updated_at();

-- 5. Row Level Security Policies
alter table public.app_settings enable row level security;
alter table public.leads        enable row level security;
alter table public.sessions     enable row level security;
alter table public.analytics    enable row level security;

-- Policies for public and admin access
drop policy if exists "Public can read settings" on public.app_settings;
create policy "Public can read settings" on public.app_settings for select using (true);

drop policy if exists "Public can update settings" on public.app_settings;
create policy "Public can update settings" on public.app_settings for all using (true);

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads" on public.leads for insert with check (true);

drop policy if exists "Public can read leads" on public.leads;
create policy "Public can read leads" on public.leads for select using (true);

drop policy if exists "Public can manage leads" on public.leads;
create policy "Public can manage leads" on public.leads for all using (true);

drop policy if exists "Public can read sessions" on public.sessions;
create policy "Public can read sessions" on public.sessions for select using (true);

drop policy if exists "Public can insert sessions" on public.sessions;
create policy "Public can insert sessions" on public.sessions for insert with check (true);

drop policy if exists "Public can read analytics" on public.analytics;
create policy "Public can read analytics" on public.analytics for select using (true);

drop policy if exists "Public can update analytics" on public.analytics;
create policy "Public can update analytics" on public.analytics for all using (true);
```

---

## Step 2 — Sample Data (Optional)

```sql
insert into public.leads (name, phone, channel, status)
values
  ('Ahmed Hassan', '+20 100 123 4567', 'voice_agent_popup', 'qualified'),
  ('Sara Khalil', '+20 111 987 6543', 'voice_agent_popup', 'contacted');

insert into public.analytics (date, visitor_count, avg_session_duration, leads_count)
values
  (current_date - 6, 152, 280, 9),
  (current_date - 5, 178, 310, 12),
  (current_date - 4, 134, 295, 8),
  (current_date - 3, 201, 340, 15),
  (current_date - 2, 167, 318, 11),
  (current_date - 1, 145, 302, 10),
  (current_date,     307, 412, 22)
on conflict (date) do nothing;
```

---

## Step 3 — Connect the App

1. Go to your Supabase Project → **Project Settings → API**
2. Copy:
   - **Project URL**
   - **anon / public key**
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
   ```
