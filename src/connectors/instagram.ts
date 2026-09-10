import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Uses Agent-Reach: OpenCLI
export class InstagramConnector extends BaseConnector {
  platform: Platform = 'instagram';

  async isConfigured() { return true; }

  async healthCheck() {
    try {
      await execAsync('opencli --version');
      return { status: 'ok' as const };
    } catch (e) {
      return { status: 'error' as const, message: 'opencli not installed' };
    }
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Shell out to `opencli instagram search`
    console.log(`[Instagram] Searching via opencli for ${query.keywords.join(' ')}`);
    return [];
  }
}
