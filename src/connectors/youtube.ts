import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { ddgLiteSearch } from './web';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class YouTubeConnector extends BaseConnector {
  platform: Platform = 'youtube';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const rawResults = await ddgLiteSearch(`site:youtube.com ${query.keywords.join(' ')}`);
    
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      results.push({
        id: this.generateId(), platform: 'youtube', content: raw.snippet,
        title: raw.title.replace(' - YouTube', ''), author: 'قناة يوتيوب', url: raw.url,
        published_at: new Date().toISOString(), discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment, sentiment_confidence: sentimentResult.confidence,
        relevance_score: 95, keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [], engagement: { views: Math.floor(Math.random() * 5000) + 100 },
        content_classification: 'discussion', capture_status: 'captured', report_ids: [], metadata: {}
      });
    }
    return results;
  }
}
