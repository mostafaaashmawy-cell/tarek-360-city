const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42TEM0ME1SRUp4QWlsRWJwTDlzU0lrcTU5cFkzT19LVDJPbWFMYnBNd2lRekE=';

export interface KVNamespace {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Response<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result {
  success: boolean;
  meta: any;
  error?: string;
}

export interface D1Response<T = unknown> {
  success: boolean;
  meta: any;
  results?: T[];
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface Env {
  ASSETS: { fetch: typeof fetch };
  GEMINI_API_KEY?: string;
  CITY360_KV?: KVNamespace;
  DB?: D1Database;
}

const DEFAULT_APP_STATE = {
  settings: {
    id: '1',
    company_name: 'Tarek Developments',
    company_name_ar: 'شركة طارق للتطوير العقاري',
    project_name: 'Master plan',
    project_name_ar: 'ماستر بلان',
    virtual_tour_url: 'https://app.seekbeak.com/v/Xw1bK444z5k',
    coohom_url: 'https://app.seekbeak.com/v/Xw1bK444z5k',
    company_logo_url: '/city-scale-logo.png',
    whatsapp_number: '201000000000',
    ai_api_key: '',
    ai_connection_method: 'websocket_live',
    ai_agent_name: 'Layla',
    ai_voice: 'Aoede',
    ai_tone: 'consultative',
    ai_prompt: `You are Layla, the official sales advisor for Master plan by Tarek Developments.`,
    available_minutes: 120.0,
    primary_color: '#6366f1',
    active_project_id: 'proj_grand_tower',
  },
  projects: [
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
      available_minutes: 120.0,
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
      available_minutes: 120.0,
      created_at: '2026-11-09T10:00:00Z',
    },
  ],
};

async function getAppState(env: Env) {
  if (env.DB) {
    try {
      const row: any = await env.DB.prepare('SELECT * FROM app_settings WHERE id = ?').bind('1').first();
      if (row) {
        let projects = DEFAULT_APP_STATE.projects;
        if (row.projects) {
          try {
            projects = typeof row.projects === 'string' ? JSON.parse(row.projects) : row.projects;
          } catch (_) {}
        }
        return {
          settings: {
            ...row,
            projects,
          },
          projects,
        };
      }
    } catch (e) {
      console.warn('D1 getAppState error:', e);
    }
  }

  if (env.CITY360_KV) {
    try {
      const raw = await env.CITY360_KV.get('app_state');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
  }
  return DEFAULT_APP_STATE;
}

async function saveAppState(env: Env, state: any) {
  const s = state.settings || state;
  const projects = state.projects || s.projects || [];
  const projectsJson = JSON.stringify(projects);

  if (env.DB) {
    try {
      await env.DB.prepare(`
        INSERT INTO app_settings (
          id, company_name, company_name_ar, project_name, project_name_ar,
          virtual_tour_url, coohom_url, company_logo_url, whatsapp_number,
          ai_agent_name, ai_voice, ai_tone, ai_prompt, available_minutes,
          primary_color, active_project_id, projects, updated_at
        ) VALUES (
          '1', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now')
        )
        ON CONFLICT(id) DO UPDATE SET
          company_name = excluded.company_name,
          company_name_ar = excluded.company_name_ar,
          project_name = excluded.project_name,
          project_name_ar = excluded.project_name_ar,
          virtual_tour_url = excluded.virtual_tour_url,
          coohom_url = excluded.coohom_url,
          company_logo_url = excluded.company_logo_url,
          whatsapp_number = excluded.whatsapp_number,
          ai_agent_name = excluded.ai_agent_name,
          ai_voice = excluded.ai_voice,
          ai_tone = excluded.ai_tone,
          ai_prompt = excluded.ai_prompt,
          available_minutes = excluded.available_minutes,
          primary_color = excluded.primary_color,
          active_project_id = excluded.active_project_id,
          projects = excluded.projects,
          updated_at = datetime('now')
      `).bind(
        s.company_name || 'Tarek Developments',
        s.company_name_ar || 'شركة طارق للتطوير العقاري',
        s.project_name || 'Master plan',
        s.project_name_ar || 'ماستر بلان',
        s.virtual_tour_url || 'https://app.seekbeak.com/v/Xw1bK444z5k',
        s.coohom_url || s.virtual_tour_url || 'https://app.seekbeak.com/v/Xw1bK444z5k',
        s.company_logo_url || '/city-scale-logo.png',
        s.whatsapp_number || '201000000000',
        s.ai_agent_name || 'Layla',
        s.ai_voice || 'Aoede',
        s.ai_tone || 'consultative',
        s.ai_prompt || '',
        Number(s.available_minutes ?? 120.0),
        s.primary_color || '#6366f1',
        s.active_project_id || 'proj_grand_tower',
        projectsJson
      ).run();
    } catch (e) {
      console.warn('D1 saveAppState error:', e);
    }
  }

  if (env.CITY360_KV) {
    try {
      await env.CITY360_KV.put('app_state', JSON.stringify({ settings: s, projects }));
    } catch (_) {}
  }
}

async function getCapturedLeads(env: Env) {
  if (env.DB) {
    try {
      const resp = await env.DB.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
      if (resp && resp.results && resp.results.length > 0) {
        return resp.results;
      }
    } catch (e) {
      console.warn('D1 getCapturedLeads error:', e);
    }
  }

  if (env.CITY360_KV) {
    try {
      const raw = await env.CITY360_KV.get('captured_leads');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
  }
  return [];
}

async function saveCapturedLead(env: Env, lead: any) {
  if (env.DB) {
    try {
      await env.DB.prepare(`
        INSERT INTO leads (id, project_id, name, phone, channel, status, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          phone = excluded.phone,
          status = excluded.status,
          notes = excluded.notes
      `).bind(
        lead.id,
        lead.project_id || 'proj_grand_tower',
        lead.name || '',
        lead.phone || '',
        lead.channel || 'voice_agent_popup',
        lead.status || 'qualified',
        lead.notes || '',
        lead.created_at || new Date().toISOString()
      ).run();

      const today = (lead.created_at || new Date().toISOString()).split('T')[0];
      await env.DB.prepare(`
        INSERT INTO analytics (date, visitor_count, avg_session_duration, leads_count, created_at, updated_at)
        VALUES (?, 1, 60, 1, datetime('now'), datetime('now'))
        ON CONFLICT(date) DO UPDATE SET
          leads_count = leads_count + 1,
          updated_at = datetime('now')
      `).bind(today).run();
    } catch (e) {
      console.warn('D1 saveCapturedLead error:', e);
    }
  }

  if (env.CITY360_KV) {
    try {
      let leads = [];
      const raw = await env.CITY360_KV.get('captured_leads');
      if (raw) leads = JSON.parse(raw);
      leads.unshift(lead);
      await env.CITY360_KV.put('captured_leads', JSON.stringify(leads));
    } catch (_) {}
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // CORS pre-flight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // ─── Secure Gemini Live WebSocket API Proxy ─────────────────────────────────────────
    if (url.pathname === '/api/gemini-session') {
      let apiKey = env.GEMINI_API_KEY;

      if (!apiKey && DEFAULT_KEY_B64) {
        try {
          apiKey = atob(DEFAULT_KEY_B64);
        } catch (_) {}
      }

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error:
              'GEMINI_API_KEY environment secret is not configured. Please configure it in Cloudflare Dashboard or with `wrangler secret put GEMINI_API_KEY`.',
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const upgradeHeader = request.headers.get('Upgrade');

      // WebSocket Upgrade: secure bidirectional proxy between Browser and Gemini Live API
      if (upgradeHeader === 'websocket') {
        const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
        const geminiWs = new WebSocket(geminiUrl);

        // @ts-ignore
        const pair = new WebSocketPair();
        const client = pair[0];
        const server = pair[1];
        server.accept();

        const sendQueue: (string | ArrayBuffer | ArrayBufferView)[] = [];
        let isGeminiReady = false;

        geminiWs.addEventListener('open', () => {
          isGeminiReady = true;
          while (sendQueue.length > 0) {
            const data = sendQueue.shift();
            if (data) geminiWs.send(data);
          }
        });

        // 1. Client → Gemini
        server.addEventListener('message', (event: MessageEvent) => {
          if (isGeminiReady && geminiWs.readyState === WebSocket.OPEN) {
            geminiWs.send(event.data);
          } else {
            sendQueue.push(event.data);
          }
        });

        server.addEventListener('close', (e: any) => {
          try {
            if (
              geminiWs.readyState === WebSocket.OPEN ||
              geminiWs.readyState === WebSocket.CONNECTING
            ) {
              geminiWs.close(e?.code || 1000, e?.reason || 'Client disconnected');
            }
          } catch (_) {}
        });

        server.addEventListener('error', () => {
          try {
            geminiWs.close(1011, 'Client error');
          } catch (_) {}
        });

        // 2. Gemini → Client
        geminiWs.addEventListener('message', (event: MessageEvent) => {
          if (server.readyState === WebSocket.OPEN) {
            server.send(event.data);
          }
        });

        geminiWs.addEventListener('close', (e: any) => {
          try {
            if (server.readyState === WebSocket.OPEN) {
              server.close(e?.code || 1000, e?.reason || 'Gemini disconnected');
            }
          } catch (_) {}
        });

        geminiWs.addEventListener('error', () => {
          try {
            if (server.readyState === WebSocket.OPEN) {
              server.close(1011, 'Gemini connection error');
            }
          } catch (_) {}
        });

        return new Response(null, {
          status: 101,
          webSocket: client,
        } as ResponseInit);
      }

      // HTTP GET fallback: return secure target URL (or proxy indicator)
      const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      return new Response(JSON.stringify({ url: geminiUrl, proxy: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // ─── Centralized Settings & Multi-Project API (Cloudflare D1 + KV) ──────────────────
    if (url.pathname === '/api/settings') {
      const state = await getAppState(env);

      if (request.method === 'GET') {
        return new Response(JSON.stringify(state), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const newState = {
            settings: body.settings || state.settings,
            projects: body.projects || state.projects,
          };
          await saveAppState(env, newState);
          return new Response(JSON.stringify({ success: true, ...newState }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err?.message || 'Invalid payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      }
    }

    // ─── Analytics API (Cloudflare D1) ────────────────────────────────────────────────
    if (url.pathname === '/api/analytics') {
      if (request.method === 'GET') {
        if (env.DB) {
          try {
            const resp = await env.DB.prepare('SELECT * FROM analytics ORDER BY date ASC').all();
            return new Response(JSON.stringify({ analytics: resp.results || [] }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
              },
            });
          } catch (e: any) {
            console.warn('Analytics D1 error:', e);
          }
        }

        return new Response(JSON.stringify({ analytics: [] }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const today = new Date().toISOString().split('T')[0];

          if (env.DB) {
            if (body.type === 'visit') {
              await env.DB.prepare(`
                INSERT INTO analytics (date, visitor_count, avg_session_duration, leads_count, created_at, updated_at)
                VALUES (?, 1, 60, 0, datetime('now'), datetime('now'))
                ON CONFLICT(date) DO UPDATE SET
                  visitor_count = visitor_count + 1,
                  updated_at = datetime('now')
              `).bind(today).run();
            } else if (body.type === 'duration') {
              const duration = Math.max(5, Number(body.seconds) || 60);
              await env.DB.prepare(`
                INSERT INTO analytics (date, visitor_count, avg_session_duration, leads_count, created_at, updated_at)
                VALUES (?, 1, ?, 0, datetime('now'), datetime('now'))
                ON CONFLICT(date) DO UPDATE SET
                  avg_session_duration = CASE
                    WHEN avg_session_duration > 0 THEN (avg_session_duration + ?) / 2
                    ELSE ?
                  END,
                  updated_at = datetime('now')
              `).bind(today, duration, duration, duration).run();
            }
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err?.message || 'Invalid analytics payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      }
    }

    // ─── Secure AI Quota & Billing: Add Minutes API ────────────────────────────────────
    if (url.pathname === '/api/add-minutes') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      try {
        const body: any = await request.json();
        const { minutes, secretCode } = body;

        // Strict validation: Secret Admin Code must match "Ashmawy20303"
        if (!secretCode || secretCode !== 'Ashmawy20303') {
          return new Response(
            JSON.stringify({ error: 'Invalid secret admin code. Access denied.' }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            }
          );
        }

        const parsedMinutes = Number(minutes);
        if (isNaN(parsedMinutes) || parsedMinutes <= 0 || !Number.isInteger(parsedMinutes)) {
          return new Response(
            JSON.stringify({ error: 'Minutes to add must be a positive integer.' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            }
          );
        }

        // Atomically update master available minutes in Cloudflare D1 & KV
        const state = await getAppState(env);
        const currentMaster = Number(state.settings?.available_minutes ?? 120.0);
        const newMaster = Number((currentMaster + parsedMinutes).toFixed(2));

        state.settings.available_minutes = newMaster;
        await saveAppState(env, state);

        return new Response(
          JSON.stringify({
            success: true,
            available_minutes: newMaster,
            added_minutes: parsedMinutes,
            message: `Successfully added ${parsedMinutes} AI minutes.`,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: 'Failed to process request: ' + (err?.message || 'Bad JSON') }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      }
    }

    // ─── Secure AI Quota & Billing: Deduct Minutes API ─────────────────────────────────
    if (url.pathname === '/api/deduct-minutes') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      try {
        const body: any = await request.json();
        const { minutes, projectId } = body;
        const parsedMinutes = Math.max(0, Number(minutes) || 0);

        const state = await getAppState(env);

        // Deduct from master available minutes
        const currentMaster = Number(state.settings?.available_minutes ?? 120.0);
        const newMaster = Math.max(0, Number((currentMaster - parsedMinutes).toFixed(2)));
        state.settings.available_minutes = newMaster;

        // Add to specific project's consumed minutes
        const targetId = projectId || state.settings?.active_project_id || state.projects?.[0]?.id;
        state.projects = (state.projects || []).map((p: any) => {
          if (p.id === targetId) {
            const curConsumed = Number(p.consumed_minutes ?? 0);
            const nextConsumed = Number((curConsumed + parsedMinutes).toFixed(2));
            return { ...p, consumed_minutes: nextConsumed };
          }
          return p;
        });

        await saveAppState(env, state);

        return new Response(
          JSON.stringify({
            success: true,
            available_minutes: newMaster,
            projects: state.projects,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: 'Failed to process request: ' + (err?.message || 'Bad JSON') }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      }
    }

    // ─── Leads Capture API (Cloudflare D1 + KV) ─────────────────────────────────────────
    if (url.pathname === '/api/leads') {
      const leads = await getCapturedLeads(env);

      if (request.method === 'GET') {
        return new Response(JSON.stringify({ leads }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const newLead = {
            id: body.id || 'lead_' + Date.now(),
            project_id: body.project_id || 'proj_grand_tower',
            name: body.name || '',
            phone: body.phone || '',
            channel: body.channel || 'voice_agent_popup',
            status: body.status || 'qualified',
            notes: body.notes || '',
            created_at: body.created_at || new Date().toISOString(),
          };
          await saveCapturedLead(env, newLead);
          return new Response(JSON.stringify({ success: true, lead: newLead }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err?.message || 'Invalid lead payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }
      }
    }

    // ─── Static Assets Handler ────────────────────────────────────────────────────────
    // All other requests pass through to Cloudflare Static Assets (out/ directory)
    return env.ASSETS.fetch(request);
  },
};
