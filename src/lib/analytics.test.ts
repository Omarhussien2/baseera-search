import { describe, it, expect } from 'vitest';
import { calculateTrend, aggregatePlatforms, generateReportSummary } from './analytics';
import { MonitoringItem } from '@/types';

function createMockItem(overrides: Partial<MonitoringItem> = {}): MonitoringItem {
  return {
    id: 'item-1',
    platform: 'twitter',
    content: 'محتوى تجريبي عن الذكاء الاصطناعي',
    title: 'عنوان تجريبي',
    author: 'أحمد',
    url: 'https://twitter.com/example/1',
    published_at: '2026-09-10T12:00:00.000Z',
    discovered_at: '2026-09-10T12:05:00.000Z',
    sentiment: 'positive',
    sentiment_confidence: 0.9,
    relevance_score: 0.85,
    keywords_matched: ['ذكاء'],
    media_urls: [],
    engagement: { likes: 10, shares: 2 },
    content_classification: 'news',
    capture_status: 'captured',
    report_ids: [],
    metadata: {},
    ...overrides,
  };
}

describe('Analytics Utility Functions', () => {
  describe('calculateTrend', () => {
    it('returns zeroes for empty items list', () => {
      const result = calculateTrend([]);
      expect(result).toEqual({ positive: 0, neutral: 0, negative: 0 });
    });

    it('calculates sentiment breakdown correctly for mixed items', () => {
      const items: MonitoringItem[] = [
        createMockItem({ id: '1', sentiment: 'positive' }),
        createMockItem({ id: '2', sentiment: 'positive' }),
        createMockItem({ id: '3', sentiment: 'negative' }),
        createMockItem({ id: '4', sentiment: 'neutral' }),
        createMockItem({ id: '5', sentiment: 'neutral' }),
        createMockItem({ id: '6', sentiment: 'neutral' }),
      ];

      const trend = calculateTrend(items);
      expect(trend).toEqual({
        positive: 2,
        neutral: 3,
        negative: 1,
      });
    });

    it('handles items with only negative sentiment', () => {
      const items: MonitoringItem[] = [
        createMockItem({ id: '1', sentiment: 'negative' }),
        createMockItem({ id: '2', sentiment: 'negative' }),
      ];

      const trend = calculateTrend(items);
      expect(trend).toEqual({
        positive: 0,
        neutral: 0,
        negative: 2,
      });
    });
  });

  describe('aggregatePlatforms', () => {
    it('returns empty object for empty items list', () => {
      const result = aggregatePlatforms([]);
      expect(result).toEqual({});
    });

    it('aggregates platform counts accurately across multiple platforms', () => {
      const items: MonitoringItem[] = [
        createMockItem({ id: '1', platform: 'twitter' }),
        createMockItem({ id: '2', platform: 'twitter' }),
        createMockItem({ id: '3', platform: 'facebook' }),
        createMockItem({ id: '4', platform: 'web' }),
        createMockItem({ id: '5', platform: 'web' }),
        createMockItem({ id: '6', platform: 'web' }),
        createMockItem({ id: '7', platform: 'youtube' }),
      ];

      const breakdown = aggregatePlatforms(items);
      expect(breakdown).toEqual({
        twitter: 2,
        facebook: 1,
        web: 3,
        youtube: 1,
      });
    });
  });

  describe('generateReportSummary', () => {
    it('generates full report summary with sentiment, platforms, keywords, and dates', () => {
      const items: MonitoringItem[] = [
        createMockItem({
          id: '1',
          platform: 'web',
          sentiment: 'positive',
          keywords_matched: ['تقنية', 'ابتكار'],
          published_at: '2026-09-08T10:00:00.000Z',
        }),
        createMockItem({
          id: '2',
          platform: 'twitter',
          sentiment: 'negative',
          keywords_matched: ['تقنية'],
          published_at: '2026-09-09T11:00:00.000Z',
        }),
      ];

      const summary = generateReportSummary(items);

      expect(summary.total_items).toBe(2);
      expect(summary.sentiment_breakdown).toEqual({
        positive: 1,
        neutral: 0,
        negative: 1,
      });
      expect(summary.platform_breakdown).toEqual({
        web: 1,
        twitter: 1,
      });
      expect(summary.top_keywords).toEqual([
        { keyword: 'تقنية', count: 2 },
        { keyword: 'ابتكار', count: 1 },
      ]);
      expect(summary.date_distribution).toEqual([
        { date: '2026-09-08', count: 1 },
        { date: '2026-09-09', count: 1 },
      ]);
    });
  });
});
