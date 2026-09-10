import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Uses Agent-Reach: OpenCLI (reusing desktop chrome session)
export class FacebookConnector extends BaseConnector {
  platform: Platform = 'facebook';

  async isConfigured() { return true; } // Relies on local Chrome session

  async healthCheck() {
    try {
      // Check if opencli is installed
      await execAsync('opencli --version');
      return { status: 'ok' as const };
    } catch (e) {
      return { status: 'error' as const, message: 'opencli not installed. Run agent-reach install' };
    }
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Shell out to `opencli facebook search`
    console.log(`[Facebook] Searching via opencli for ${query.keywords.join(' ')}`);
    return [];
  }
}
