import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebConnector } from './web';
import { BaseConnector } from './base';
import { SearchQuery } from '@/types';

describe('WebConnector', () => {
  let connector: WebConnector;

  beforeEach(() => {
    connector = new WebConnector();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('instantiates successfully as an instance of BaseConnector', () => {
    expect(connector).toBeInstanceOf(BaseConnector);
    expect(connector).toBeInstanceOf(WebConnector);
  });

  it('has the platform property set to "web"', () => {
    expect(connector.platform).toBe('web');
  });

  it('isConfigured resolves to true', async () => {
    const configured = await connector.isConfigured();
    expect(configured).toBe(true);
  });

  it('healthCheck returns { status: "ok" }', async () => {
    const health = await connector.healthCheck();
    expect(health).toEqual({ status: 'ok' });
  });

  describe('search method', () => {
    it('handles successful HTML response and parses search results', async () => {
      const mockHtml = `
        <div class="result">
          <a class="result__title" href="https://example.com/news1">خبر ممتاز عن التكنولوجيا</a>
          <a class="result__snippet" href="#">تفاصيل هذا المقال ممتازة ورائعة جدا للمهتمين بالتقنية.</a>
          <a class="result__url" href="//example.com/news1">example.com/news1</a>
        </div>
      `;

      global.fetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockHtml),
      } as unknown as Response);

      const query: SearchQuery = {
        keywords: ['التكنولوجيا', 'ممتاز'],
        platforms: ['web'],
      };

      const results = await connector.search(query);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('duckduckgo.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': expect.any(String),
          }),
        })
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        platform: 'web',
        title: 'خبر ممتاز عن التكنولوجيا',
        url: 'https://example.com/news1',
        author: 'محرك بحث',
        sentiment: 'positive',
        capture_status: 'captured',
        content_classification: 'news',
      });
      expect(results[0].id).toBeDefined();
      expect(results[0].published_at).toBeDefined();
      expect(results[0].keywords_matched).toContain('التكنولوجيا');
    });

    it('handles fetch failure gracefully by returning an empty array', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      const query: SearchQuery = {
        keywords: ['اختبار'],
        platforms: ['web'],
      };

      const results = await connector.search(query);

      expect(results).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
