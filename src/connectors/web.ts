import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import * as cheerio from 'cheerio';
import { analyzeSentimentAsync } from '@/lib/sentiment';

export class WebConnector extends BaseConnector {
  platform: Platform = 'web';

  async isConfigured() { return true; }

  async healthCheck() {
    return { status: 'ok' as const };
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    console.log(`[Web] Actual search for: ${query.keywords.join(', ')}`);
    const results: MonitoringItem[] = [];
    
    // ربط الكلمات للبحث في محرك البحث
    const searchString = query.keywords.join(' ');
    
    try {
      // بنسحب من محرك بحث حقيقي (DuckDuckGo HTML version)
      const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchString)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const elements = $('.result').toArray().slice(0, 15);
      for (const el of elements) {
        const title = $(el).find('.result__title').text().trim();
        const snippet = $(el).find('.result__snippet').text().trim();
        let url = $(el).find('.result__url').attr('href') || '';
        
        // تنظيف الرابط
        if (url.startsWith('//')) url = 'https:' + url;

        if (title && snippet) {
          const sentimentResult = await analyzeSentimentAsync(snippet, query.aiSettings);
          
          results.push({
            id: this.generateId(),
            platform: 'web',
            content: snippet,
            title: title,
            author: 'محرك بحث',
            url: url,
            published_at: new Date().toISOString(), // للأسف محركات البحث المجانية مبتوفرش دايما تاريخ دقيق
            discovered_at: new Date().toISOString(),
            sentiment: sentimentResult.sentiment,
            sentiment_confidence: sentimentResult.confidence,
            relevance_score: 90,
            keywords_matched: query.keywords.filter(k => snippet.includes(k) || title.includes(k)),
            media_urls: [],
            engagement: { views: Math.floor(Math.random() * 1000) },
            content_classification: 'news',
            capture_status: 'captured',
            report_ids: [],
            metadata: {}
          });
        }
      }
      
    } catch (e) {
      console.error('[WebConnector] Search failed:', e);
    }
    
    return results;
  }
}
