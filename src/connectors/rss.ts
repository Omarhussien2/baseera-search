import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';

// Native Node.js RSS fetching
export class RssConnector extends BaseConnector {
  platform: Platform = 'rss';

  async isConfigured() { return true; }

  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Implement RSS feed parsing logic here
    console.log(`[RSS] Parsing feeds for ${query.keywords.join(', ')}`);
    return [];
  }
}
