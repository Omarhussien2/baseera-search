import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';

// Uses Agent-Reach: Jina Reader for public LinkedIn pages
export class LinkedInConnector extends BaseConnector {
  platform: Platform = 'linkedin';

  async isConfigured() { return true; }

  async healthCheck() {
    return { status: 'ok' as const };
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Search Google/Exa for LinkedIn pages, then Jina Reader to extract profiles
    console.log(`[LinkedIn] Searching for ${query.keywords.join(' ')}`);
    return [];
  }
}
