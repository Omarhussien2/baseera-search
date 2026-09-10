import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';

// Uses Agent-Reach: Exa Search (mcporter) + Jina Reader
export class WebConnector extends BaseConnector {
  platform: Platform = 'web';

  async isConfigured() { return true; } // Zero config required for Web

  async healthCheck() {
    try {
      const res = await fetch('https://r.jina.ai/https://example.com', { method: 'HEAD' });
      return res.ok ? { status: 'ok' as const } : { status: 'error' as const, message: 'Jina Reader API down' };
    } catch (e) {
      return { status: 'error' as const, message: String(e) };
    }
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Implement mcporter / Exa search logic here
    console.log(`[Web] Searching for ${query.keywords.join(', ')}`);
    return [];
  }
}
