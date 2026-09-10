import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Uses Agent-Reach: OpenCLI or rdt-cli
export class RedditConnector extends BaseConnector {
  platform: Platform = 'reddit';

  async isConfigured() { return true; }

  async healthCheck() {
    try {
      await execAsync('opencli --version');
      return { status: 'ok' as const };
    } catch (e) {
      return { status: 'error' as const, message: 'opencli/rdt-cli not installed' };
    }
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Shell out to `opencli reddit search`
    console.log(`[Reddit] Searching via opencli for ${query.keywords.join(' ')}`);
    return [];
  }
}
