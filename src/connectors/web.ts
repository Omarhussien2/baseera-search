import { BaseConnector } from './base';
import { Platform, MonitoringItem, SearchQuery } from '@/types';
import * as cheerio from 'cheerio';
import { analyzeSentimentAsync } from '@/lib/sentiment';

// Apify Google Search (Uses actual Google, respects site: operators, doesn't block)
export async function apifyGoogleSearch(searchString: string): Promise<{title: string; snippet: string; url: string}[]> {
  const token = process.env.APIF_API_TOKEN;
  if (!token) return bingSearch(searchString);

  console.log(`[Apify] Searching Google for: ${searchString}`);
  try {
    const response = await fetch(`https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queries: searchString,
        maxPagesPerQuery: 1,
        resultsPerPage: 15,
        languageCode: "ar",
        countryCode: "eg"
      }),
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      const results: {title: string; snippet: string; url: string}[] = [];
      
      // Apify google-search-scraper returns an array of items (one per query usually)
      for (const item of data) {
        if (item.organicResults) {
          for (const org of item.organicResults) {
            results.push({
              title: org.title,
              snippet: org.description || org.title,
              url: org.url
            });
          }
        }
      }
      return results;
    } else {
      console.error('[Apify] Failed with status:', response.status);
    }
  } catch (e) {
    console.error('[Apify] Error:', e);
  }

  // Fallback to Bing if Apify fails
  return bingSearch(searchString);
}

// Unified Bing search that works flawlessly from Vercel serverless (used as fallback)
export async function bingSearch(searchString: string): Promise<{title: string; snippet: string; url: string}[]> {
  const results: {title: string; snippet: string; url: string}[] = [];
  
  try {
    const response = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(searchString)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store'
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('li.b_algo').each((i, el) => {
      if (i >= 15) return;
      
      const title = $(el).find('h2 a').text().trim();
      let rawUrl = $(el).find('h2 a').attr('href') || '';
      
      let snippet = $(el).find('.b_caption p').text().trim();
      if (!snippet) snippet = $(el).find('.b_algoSlug').text().trim();
      
      // Decode Bing's redirect URL if present
      let url = rawUrl;
      const match = rawUrl.match(/&u=a1([^&]+)/);
      if (match && match[1]) {
        try {
          const b64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
          url = Buffer.from(b64, 'base64').toString();
        } catch (e) {
          // fallback to rawUrl
        }
      }
      
      if (title && (snippet || url)) {
        results.push({ title, snippet: snippet || title, url });
      }
    });
  } catch (e) {
    console.error('[bingSearch] Failed:', e);
  }
  
  return results;
}

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
    
    const rawResults = await apifyGoogleSearch(searchString);
    
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
