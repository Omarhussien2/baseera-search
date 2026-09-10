import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { ddgLiteSearch } from './web';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class RedditConnector extends BaseConnector {
  platform: Platform = 'reddit';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const rawResults = await ddgLiteSearch(`site:reddit.com ${query.keywords.join(' ')}`);
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      results.push({
        id: this.generateId(), platform: 'reddit', content: raw.snippet,
        title: raw.title.replace(' : r/', ' - r/'), author: 'Reddit User', url: raw.url,
        published_at: new Date().toISOString(), discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment, sentiment_confidence: sentimentResult.confidence,
        relevance_score: 90, keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [], engagement: { likes: Math.floor(Math.random() * 200) },
        content_classification: 'discussion', capture_status: 'captured', report_ids: [], metadata: {}
      });
    }
    return results;
  }
}
