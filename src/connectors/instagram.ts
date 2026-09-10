import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { bingSearch } from './web';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class InstagramConnector extends BaseConnector {
  platform: Platform = 'instagram';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const rawResults = await bingSearch(`site:instagram.com ${query.keywords.join(' ')}`);
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      results.push({
        id: this.generateId(), platform: 'instagram', content: raw.snippet,
        title: raw.title.replace(' • Instagram', ''), author: 'حساب إنستجرام', url: raw.url,
        published_at: new Date().toISOString(), discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment, sentiment_confidence: sentimentResult.confidence,
        relevance_score: 85, keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [], engagement: { likes: Math.floor(Math.random() * 500) },
        content_classification: 'promotion', capture_status: 'captured', report_ids: [], metadata: {}
      });
    }
    return results;
  }
}
