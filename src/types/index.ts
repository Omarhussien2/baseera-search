// ============================================================
// Baseera — Core Type Definitions
// Arabic Internet Search & Media Monitoring Platform
// ============================================================

// Platform identifiers for supported data sources
export type Platform =
  | 'twitter'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'reddit'
  | 'web'
  | 'rss';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type CaptureStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'captured';

export type ContentClassification =
  | 'news'
  | 'opinion'
  | 'promotion'
  | 'discussion'
  | 'review'
  | 'announcement'
  | 'other';

export type ReportStatus = 'draft' | 'published' | 'archived';

// A single piece of content found on the internet
export interface MonitoringItem {
  id: string;
  platform: Platform;
  content: string;
  title?: string;
  author: string;
  author_avatar_url?: string;
  url: string;
  published_at: string;
  discovered_at: string;
  sentiment: Sentiment;
  sentiment_confidence: number;
  relevance_score: number;
  keywords_matched: string[];
  media_urls: string[];
  engagement: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
  };
  content_classification: ContentClassification;
  capture_status: CaptureStatus;
  evidence_image_path?: string;
  report_ids: string[];
  metadata: Record<string, unknown>;
}

// Defines what to monitor
export interface MonitoringProfile {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  excluded_keywords: string[];
  platforms: Platform[];
  language_filter?: string[];
  schedule_cron?: string;
  alerts_enabled: boolean;
  client_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface SearchQuery {
  keywords: string[];
  platforms: Platform[];
  date_range?: { from: string; to: string };
  sentiment_filter?: Sentiment[];
  content_classification?: ContentClassification[];
  language?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  items: MonitoringItem[];
  total_count: number;
  platforms_searched: Platform[];
  query_duration_ms: number;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  client_id: string;
  profile_id?: string;
  items: string[];
  date_range: { from: string; to: string };
  created_at: string;
  updated_at: string;
  status: ReportStatus;
  share_links: ShareLink[];
  summary?: ReportSummary;
}

export interface ReportSummary {
  total_items: number;
  sentiment_breakdown: Record<Sentiment, number>;
  platform_breakdown: Partial<Record<Platform, number>>;
  top_keywords: { keyword: string; count: number }[];
  date_distribution: { date: string; count: number }[];
}

export interface ShareLink {
  id: string;
  token: string;
  report_id: string;
  created_at: string;
  expires_at?: string;
  view_count: number;
  is_revoked: boolean;
}

export interface Alert {
  id: string;
  profile_id: string;
  keyword: string;
  platform: Platform;
  item_id: string;
  triggered_at: string;
  is_read: boolean;
}

export interface Client {
  id: string;
  name: string;
  logo_url?: string;
  contact_email?: string;
  created_at: string;
  is_active: boolean;
}

export interface ConnectorStatus {
  platform: Platform;
  is_available: boolean;
  last_check: string;
  error?: string;
  requires_auth: boolean;
  auth_configured: boolean;
}

export interface DashboardStats {
  total_items_today: number;
  total_items_week: number;
  active_profiles: number;
  unread_alerts: number;
  sentiment_trend: Record<Sentiment, number>;
  platform_activity: Partial<Record<Platform, number>>;
  connector_statuses: ConnectorStatus[];
}
