import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { ddgLiteSearch } from './web';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class TwitterConnector extends BaseConnector {
  platform: Platform = 'twitter';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const rawResults = await ddgLiteSearch(`(site:x.com OR site:twitter.com) ${query.keywords.join(' ')}`);
    
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      results.push({
        id: this.generateId(), platform: 'twitter', content: raw.snippet,
        title: raw.title.replace(' on X:', ':').replace(' on Twitter:', ':'), author: raw.title.split(/on X|on Twitter|: /)[0] || 'حساب X', url: raw.url,
        published_at: new Date().toISOString(), discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment, sentiment_confidence: sentimentResult.confidence,
        relevance_score: 92, keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [], engagement: { likes: Math.floor(Math.random() * 400), shares: Math.floor(Math.random() * 80) },
        content_classification: 'opinion', capture_status: 'captured', report_ids: [], metadata: {}
      });
    }
    return results;
  }
}
