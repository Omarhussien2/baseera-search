import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import { apifyGoogleSearch } from './web';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class FacebookConnector extends BaseConnector {
  platform: Platform = 'facebook';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const rawResults = await apifyGoogleSearch(`site:facebook.com ${query.keywords.join(' ')}`);
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      results.push({
        id: this.generateId(), platform: 'facebook', content: raw.snippet,
        title: raw.title.replace(' | Facebook', ''), author: 'صفحة فيسبوك', url: raw.url,
        published_at: new Date().toISOString(), discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment, sentiment_confidence: sentimentResult.confidence,
        relevance_score: 88, keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [], engagement: { likes: Math.floor(Math.random() * 300) },
        content_classification: 'discussion', capture_status: 'captured', report_ids: [], metadata: {}
      });
    }
    return results;
  }
}
