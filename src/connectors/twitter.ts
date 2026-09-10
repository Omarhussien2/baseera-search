import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Uses Agent-Reach: twitter-cli
export class TwitterConnector extends BaseConnector {
  platform: Platform = 'twitter';

  async isConfigured() {
    return !!process.env.TWITTER_COOKIE;
  }

  async healthCheck() {
    if (!(await this.isConfigured())) return { status: 'error' as const, message: 'Missing TWITTER_COOKIE' };
    try {
      // Check if twitter-cli is installed in system
      await execAsync('twitter-cli --version');
      return { status: 'ok' as const };
    } catch (e) {
      return { status: 'error' as const, message: 'twitter-cli not installed. Run agent-reach install' };
    }
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Shell out to `twitter-cli search "keywords"`
    console.log(`[Twitter] Searching via twitter-cli for ${query.keywords.join(' ')}`);
    return [];
  }
}
