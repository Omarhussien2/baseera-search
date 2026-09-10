import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { getStore } from '@/lib/store';
import { registry } from '@/connectors/registry';
import { SearchQuery, Platform } from '@/types';

// Register all connectors
import { WebConnector } from '@/connectors/web';
import { RssConnector } from '@/connectors/rss';
import { TwitterConnector } from '@/connectors/twitter';
import { YouTubeConnector } from '@/connectors/youtube';
import { FacebookConnector } from '@/connectors/facebook';
import { InstagramConnector } from '@/connectors/instagram';
import { RedditConnector } from '@/connectors/reddit';
import { LinkedInConnector } from '@/connectors/linkedin';

if (registry.getAll().length === 0) {
  registry.register(new WebConnector());
  registry.register(new RssConnector());
  registry.register(new TwitterConnector());
  registry.register(new YouTubeConnector());
  registry.register(new FacebookConnector());
  registry.register(new InstagramConnector());
  registry.register(new RedditConnector());
  registry.register(new LinkedInConnector());
}

export const runtime = 'nodejs';
export const maxDuration = 60;

const app = new Hono().basePath('/api');
const store = getStore();

// 1. Health & Persistence
app.get('/admin/health', (c) => {
  return c.json({
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/admin/persistence', (c) => {
  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return c.json({
    mode: hasSupabase ? 'supabase' : 'in-memory',
    supabase_configured: hasSupabase,
  });
});

// 2. Search Endpoint (Integrates Connectors & Store)
app.post('/search', async (c) => {
  try {
    const query = await c.req.json<SearchQuery>();
    const platforms = query.platforms && query.platforms.length > 0 
      ? query.platforms 
      : ['web'] as Platform[];

    const allItems = [];
    const startTime = Date.now();

    for (const platform of platforms) {
      const connector = registry.get(platform);
      if (connector) {
        const health = await connector.healthCheck();
        if (health.status === 'ok') {
          const items = await connector.search(query);
          for (const item of items) {
            await store.addItem(item);
            allItems.push(item);
          }
        }
      }
    }

    const duration = Date.now() - startTime;
    
    return c.json({
      items: allItems,
      total_count: allItems.length,
      platforms_searched: platforms,
      query_duration_ms: duration,
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// 3. Monitor Feed
app.get('/monitor/feed', async (c) => {
  const result = await store.getItems();
  return c.json(result);
});

// 4. Reports
app.get('/reports', async (c) => {
  const reports = await store.getReports();
  return c.json({ reports });
});

// 5. Alerts
app.get('/alerts', async (c) => {
  const alerts = await store.getAlerts();
  const unread = alerts.filter(a => !a.is_read).length;
  return c.json({ alerts, unread_count: unread });
});

// 6. Connector Status (Live checks)
app.get('/connectors/status', async (c) => {
  const statuses = [];
  for (const connector of registry.getAll()) {
    const health = await connector.healthCheck();
    const isConfigured = await connector.isConfigured();
    statuses.push({
      platform: connector.platform,
      is_available: health.status === 'ok',
      requires_auth: !isConfigured,
      error: health.message,
      last_check: new Date().toISOString()
    });
  }
  return c.json({ connectors: statuses });
});

// 7. Dashboard Stats
app.get('/dashboard/stats', async (c) => {
  const stats = await store.getDashboardStats();
  return c.json(stats);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
