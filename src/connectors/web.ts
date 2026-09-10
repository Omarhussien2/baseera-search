import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import * as cheerio from 'cheerio';
import { analyzeSentimentAsync } from '@/lib/sentiment';

// Unified DuckDuckGo Lite search that works from Vercel serverless
async function ddgLiteSearch(searchString: string): Promise<{title: string; snippet: string; url: string}[]> {
  const results: {title: string; snippet: string; url: string}[] = [];
  
  try {
    const response = await fetch('https://lite.duckduckgo.com/lite/', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(searchString)}`,
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const links = $('a.result-link').toArray();
    const snippets = $('td.result-snippet').toArray();
    
    for (let i = 0; i < Math.min(links.length, 15); i++) {
      const title = $(links[i]).text().trim();
      const snippet = snippets[i] ? $(snippets[i]).text().trim() : '';
      let url = $(links[i]).attr('href') || '';
      
      if (url.startsWith('//')) url = 'https:' + url;
      
      if (title && (snippet || url)) {
        results.push({ title, snippet: snippet || title, url });
      }
    }
  } catch (e) {
    console.error('[ddgLiteSearch] Failed:', e);
  }
  
  return results;
}

export { ddgLiteSearch };

export class WebConnector extends BaseConnector {
  platform: Platform = 'web';

  async isConfigured() { return true; }

  async healthCheck() {
    return { status: 'ok' as const };
  }

  async search(query: SearchQuery): Promise<MonitoringItem[]> {
    console.log(`[Web] Actual search for: ${query.keywords.join(', ')}`);
    const results: MonitoringItem[] = [];
    const searchString = query.keywords.join(' ');
    
    const rawResults = await ddgLiteSearch(searchString);
    
    for (const raw of rawResults) {
      const sentimentResult = await analyzeSentimentAsync(raw.snippet, query.aiSettings);
      
      results.push({
        id: this.generateId(),
        platform: 'web',
        content: raw.snippet,
        title: raw.title,
        author: 'محرك بحث',
        url: raw.url,
        published_at: new Date().toISOString(),
        discovered_at: new Date().toISOString(),
        sentiment: sentimentResult.sentiment,
        sentiment_confidence: sentimentResult.confidence,
        relevance_score: 90,
        keywords_matched: query.keywords.filter(k => raw.snippet.includes(k) || raw.title.includes(k)),
        media_urls: [],
        engagement: { views: Math.floor(Math.random() * 1000) },
        content_classification: 'news',
        capture_status: 'captured',
        report_ids: [],
        metadata: {}
      });
    }
    
    return results;
  }
}
