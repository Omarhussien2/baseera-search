import { describe, it, expect } from 'vitest';
import { analyzeSentiment, analyzeSentimentAsync } from './sentiment';

describe('Arabic Sentiment Analyzer (analyzeSentiment)', () => {
  describe('Positive Sentiment Detection', () => {
    it('detects positive sentiment for "ممتاز"', () => {
      const result = analyzeSentiment('هذا التطبيق ممتاز');
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('detects positive sentiment for "رائع"', () => {
      const result = analyzeSentiment('أداء رائع جدا');
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('detects combined positive words "ممتاز" and "رائع"', () => {
      const result = analyzeSentiment('هذا عمل ممتاز ورائع');
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('Negative Sentiment Detection', () => {
    it('detects negative sentiment for "سيء"', () => {
      const result = analyzeSentiment('هذا التعامل سيء جدا');
      expect(result.sentiment).toBe('negative');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('detects negative sentiment for "كارثة"', () => {
      const result = analyzeSentiment('الوضع أصبح كارثة غير متوقعة');
      expect(result.sentiment).toBe('negative');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('detects combined negative words "سيء" and "كارثة"', () => {
      const result = analyzeSentiment('تقرير سيء وموقف كارثة');
      expect(result.sentiment).toBe('negative');
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('Neutral Sentiment Detection', () => {
    it('detects neutral sentiment for factual statements without polarized keywords', () => {
      const result = analyzeSentiment('تم نشر التقرير الأسبوعي اليوم');
      expect(result.sentiment).toBe('neutral');
      expect(result.confidence).toBe(0.8);
    });

    it('returns neutral sentiment with full confidence for empty text', () => {
      const result = analyzeSentiment('');
      expect(result.sentiment).toBe('neutral');
      expect(result.confidence).toBe(1.0);
    });

    it('returns neutral sentiment with full confidence for whitespace only', () => {
      const result = analyzeSentiment('   ');
      expect(result.sentiment).toBe('neutral');
      expect(result.confidence).toBe(1.0);
    });
  });
});

describe('Async Sentiment Analyzer (analyzeSentimentAsync)', () => {
  it('falls back to heuristic when no aiSettings provided', async () => {
    const result = await analyzeSentimentAsync('هذا التطبيق ممتاز');
    expect(result.sentiment).toBe('positive');
  });

  it('falls back to heuristic when provider is not gemini', async () => {
    const result = await analyzeSentimentAsync('هذا التعامل سيء جدا', { provider: 'heuristic' });
    expect(result.sentiment).toBe('negative');
  });

  it('falls back to heuristic when apiKey is missing', async () => {
    const result = await analyzeSentimentAsync('هذا التطبيق ممتاز', { provider: 'gemini', apiKey: '' });
    expect(result.sentiment).toBe('positive');
  });

  it('calls Gemini API and parses positive sentiment', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'positive' }]
          }
        }
      ]
    };
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse
    } as unknown as Response);

    try {
      const result = await analyzeSentimentAsync('نص تجريبي إيجابي', { provider: 'gemini', apiKey: 'fake-key' });
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBe(0.95);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('falls back to heuristic when Gemini API fails', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => {
      throw new Error('API down');
    };

    try {
      const result = await analyzeSentimentAsync('هذا التطبيق ممتاز', { provider: 'gemini', apiKey: 'fake-key' });
      expect(result.sentiment).toBe('positive');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('falls back to heuristic when TokenRouter apiKey is missing', async () => {
    const result = await analyzeSentimentAsync('هذا التطبيق ممتاز', { provider: 'tokenrouter', apiKey: '' });
    expect(result.sentiment).toBe('positive');
  });

  it('calls TokenRouter API and parses positive sentiment', async () => {
    let capturedUrl = '';
    let capturedOptions: RequestInit | undefined;
    const originalFetch = global.fetch;

    global.fetch = (async (url: string, options?: RequestInit) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: 'positive'
              }
            }
          ]
        })
      } as unknown as Response;
    }) as typeof fetch;

    try {
      const result = await analyzeSentimentAsync('تجربة رائعة ومفيدة', { provider: 'tokenrouter', apiKey: 'test-tr-key' });
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBe(0.95);
      expect(capturedUrl).toBe('https://api.tokenrouter.com/v1/chat/completions');
      expect(capturedOptions?.method).toBe('POST');
      expect((capturedOptions?.headers as Record<string, string>)?.['Authorization']).toBe('Bearer test-tr-key');
      
      const body = JSON.parse(capturedOptions?.body as string);
      expect(body.model).toBe('z-ai/glm-5.3-free');
      expect(body.temperature).toBe(0);
      expect(body.messages[0].role).toBe('user');
      expect(body.messages[0].content).toContain('تجربة رائعة ومفيدة');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('calls TokenRouter API and parses negative sentiment', async () => {
    const originalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'negative'
            }
          }
        ]
      })
    } as unknown as Response)) as typeof fetch;

    try {
      const result = await analyzeSentimentAsync('خدمة سيئة جدا', { provider: 'tokenrouter', apiKey: 'test-tr-key' });
      expect(result.sentiment).toBe('negative');
      expect(result.confidence).toBe(0.95);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('calls TokenRouter API and parses neutral sentiment', async () => {
    const originalFetch = global.fetch;
    global.fetch = (async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'neutral'
            }
          }
        ]
      })
    } as unknown as Response)) as typeof fetch;

    try {
      const result = await analyzeSentimentAsync('الموضوع قيد المراجعة', { provider: 'tokenrouter', apiKey: 'test-tr-key' });
      expect(result.sentiment).toBe('neutral');
      expect(result.confidence).toBe(0.95);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('falls back to heuristic when TokenRouter API fails', async () => {
    const originalFetch = global.fetch;
    global.fetch = (async () => {
      throw new Error('Network error');
    }) as typeof fetch;

    try {
      const result = await analyzeSentimentAsync('هذا التطبيق ممتاز', { provider: 'tokenrouter', apiKey: 'test-tr-key' });
      expect(result.sentiment).toBe('positive');
    } finally {
      global.fetch = originalFetch;
    }
  });
});

