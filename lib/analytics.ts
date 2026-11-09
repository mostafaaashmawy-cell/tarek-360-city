/**
 * Analytics and lead tracking powered by Cloudflare D1
 */

/**
 * Record a visitor arrival for today in the Cloudflare D1 analytics table
 */
export async function trackVisitor(projectId?: string) {
  if (typeof window === 'undefined') return;

  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `tarek_v_${today}_${projectId || 'proj'}`;

  // Session guard to count unique browser visits per day
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, '1');

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'visit', projectId }),
    });
  } catch (err) {
    console.warn('[Analytics] Visitor tracking notice:', err);
  }
}

/**
 * Track session duration in seconds
 */
export async function trackSessionDuration(durationSeconds: number) {
  if (durationSeconds < 5) return;

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'duration', seconds: durationSeconds }),
    });
  } catch (_) {}
}

/**
 * Record a lead and increment daily leads_count in Cloudflare D1
 */
export async function trackLead(lead: {
  name: string;
  phone: string;
  project_id?: string;
  channel?: string;
  status?: string;
  notes?: string;
}) {
  const newLead = {
    id: 'lead_' + Date.now(),
    project_id: lead.project_id || 'proj_grand_tower',
    name: lead.name,
    phone: lead.phone,
    channel: lead.channel || 'whatsapp_click',
    status: lead.status || 'qualified',
    notes: lead.notes || '',
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('tarek360_captured_leads');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newLead);
      localStorage.setItem('tarek360_captured_leads', JSON.stringify(list));
    } catch (_) {}
  }

  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    });
  } catch (err) {
    console.warn('[Analytics] Lead tracking notice:', err);
  }
}
