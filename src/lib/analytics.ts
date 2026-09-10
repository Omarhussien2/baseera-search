import { MonitoringItem, ReportSummary, Sentiment, Platform } from '@/types';

/**
 * Calculates sentiment trend/breakdown from monitoring items.
 */
export function calculateTrend(items: MonitoringItem[]): Record<Sentiment, number> {
  const sentiment_breakdown: Record<Sentiment, number> = { positive: 0, neutral: 0, negative: 0 };
  for (const item of items) {
    if (item.sentiment && sentiment_breakdown[item.sentiment] !== undefined) {
      sentiment_breakdown[item.sentiment]++;
    }
  }
  return sentiment_breakdown;
}

/**
 * Aggregates monitoring items count across platforms.
 */
export function aggregatePlatforms(items: MonitoringItem[]): Partial<Record<Platform, number>> {
  const platform_breakdown: Partial<Record<Platform, number>> = {};
  for (const item of items) {
    platform_breakdown[item.platform] = (platform_breakdown[item.platform] || 0) + 1;
  }
  return platform_breakdown;
}

/**
 * Aggregates a list of monitoring items into a comprehensive report summary.
 */
export function generateReportSummary(items: MonitoringItem[]): ReportSummary {
  const sentiment_breakdown = calculateTrend(items);
  const platform_breakdown = aggregatePlatforms(items);
  const keyword_map: Record<string, number> = {};
  const date_map: Record<string, number> = {};

  for (const item of items) {
    for (const kw of item.keywords_matched || []) {
      keyword_map[kw] = (keyword_map[kw] || 0) + 1;
    }

    // 4. Date Distribution (Group by YYYY-MM-DD)
    try {
      const dateStr = new Date(item.published_at).toISOString().split('T')[0];
      date_map[dateStr] = (date_map[dateStr] || 0) + 1;
    } catch {
      // Ignore invalid dates
    }
  }

  // Sort and limit keywords to top 10
  const top_keywords = Object.entries(keyword_map)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Sort dates chronologically
  const date_distribution = Object.entries(date_map)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total_items: items.length,
    sentiment_breakdown,
    platform_breakdown,
    top_keywords,
    date_distribution,
  };
}
