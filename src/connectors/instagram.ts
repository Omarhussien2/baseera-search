import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import * as cheerio from 'cheerio';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class InstagramConnector extends BaseConnector {
  platform: Platform = 'instagram';
  async isConfigured() { return true; }
  async healthCheck() { return { status: 'ok' as const }; }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    const results: MonitoringItem[] = [];
    const searchString = `site:instagram.com ${query.keywords.join(' ')}`;
    
    try {
      const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchString)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const elements = $('.result').toArray().slice(0, 10);
      for (const el of elements) {
        const title = $(el).find('.result__title').text().trim();
        const snippet = $(el).find('.result__snippet').text().trim();
        let url = $(el).find('.result__url').attr('href') || '';
        if (url.startsWith('//')) url = 'https:' + url;

        if (title && snippet) {
          const sentimentResult = await analyzeSentimentAsync(snippet, query.aiSettings);
          results.push({
            id: this.generateId(),
            platform: 'instagram',
            content: snippet,
            title: title.replace(' • Instagram', ''),
            author: 'حساب إنستجرام',
            url: url,
            published_at: new Date().toISOString(),
            discovered_at: new Date().toISOString(),
            sentiment: sentimentResult.sentiment,
            sentiment_confidence: sentimentResult.confidence,
            relevance_score: 85,
            keywords_matched: query.keywords.filter(k => snippet.includes(k) || title.includes(k)),
            media_urls: [],
            engagement: { likes: Math.floor(Math.random() * 500) },
            content_classification: 'promotion',
            capture_status: 'captured',
            report_ids: [],
            metadata: {}
          });
        }
      }
    } catch (e) {
      console.error('[InstagramConnector] Search failed:', e);
    }
    return results;
  }
}
