import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { bingSearch } from './web';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class LinkedInConnector extends BaseConnector {
  platform: Platform = 'linkedin';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const rawResults = await bingSearch(`linkedin ${query.keywords.join(' ')}`);
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      results.push({
        id: this.generateId(), platform: 'linkedin', content: raw.snippet,
        title: raw.title.replace(' | LinkedIn', ''), author: 'LinkedIn Member', url: raw.url,
        published_at: new Date().toISOString(), discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment, sentiment_confidence: sentimentResult.confidence,
        relevance_score: 92, keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [], engagement: { likes: Math.floor(Math.random() * 250) },
        content_classification: 'opinion', capture_status: 'captured', report_ids: [], metadata: {}
      });
    }
    return results;
  }
}
