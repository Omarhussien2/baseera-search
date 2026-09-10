import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Uses Agent-Reach: yt-dlp
export class YouTubeConnector extends BaseConnector {
  platform: Platform = 'youtube';

  async isConfigured() { return true; }

  async healthCheck() {
    try {
      await execAsync('yt-dlp --version');
      return { status: 'ok' as const };
    } catch (e) {
      return { status: 'error' as const, message: 'yt-dlp not found. Run agent-reach install' };
    }
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    // TODO: Shell out to yt-dlp to extract video metadata
    console.log(`[YouTube] Searching via yt-dlp for ${query.keywords.join(' ')}`);
    return [];
  }
}
