import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

// Health check
app.get('/admin/health', (c) => {
  return c.json({
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Persistence mode
app.get('/admin/persistence', (c) => {
  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return c.json({
    mode: hasSupabase ? 'supabase' : 'in-memory',
    supabase_configured: hasSupabase,
  });
});

// Search placeholder
app.post('/search', async (c) => {
  const body = await c.req.json();
  return c.json({
    message: 'Search API ready',
    query: body,
    items: [],
    total_count: 0,
  });
});

// Monitor feed placeholder
app.get('/monitor/feed', (c) => {
  return c.json({
    message: 'Feed API ready',
    items: [],
    total_count: 0,
  });
});

// Reports placeholder
app.get('/reports', (c) => {
  return c.json({
    message: 'Reports API ready',
    reports: [],
  });
});

// Alerts placeholder
app.get('/alerts', (c) => {
  return c.json({
    message: 'Alerts API ready',
    alerts: [],
    unread_count: 0,
  });
});

// Connector status
app.get('/connectors/status', (c) => {
  const connectors = [
    { platform: 'web', is_available: true, requires_auth: false },
    { platform: 'rss', is_available: true, requires_auth: false },
    { platform: 'twitter', is_available: false, requires_auth: true },
    { platform: 'youtube', is_available: false, requires_auth: false },
    { platform: 'facebook', is_available: false, requires_auth: true },
    { platform: 'instagram', is_available: false, requires_auth: true },
    { platform: 'reddit', is_available: false, requires_auth: true },
    { platform: 'linkedin', is_available: false, requires_auth: false },
  ];
  return c.json({ connectors });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
