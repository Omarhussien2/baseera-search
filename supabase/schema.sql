-- ============================================================
-- Baseera (بصيرة) — Supabase Schema
-- Arabic Internet Search & Media Monitoring Platform
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Clients
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on clients"
  ON clients FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Monitoring Profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS monitoring_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  keywords JSONB NOT NULL DEFAULT '[]',
  excluded_keywords JSONB NOT NULL DEFAULT '[]',
  platforms JSONB NOT NULL DEFAULT '[]',
  language_filter JSONB DEFAULT '[]',
  schedule_cron TEXT,
  alerts_enabled BOOLEAN NOT NULL DEFAULT false,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE monitoring_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on monitoring_profiles"
  ON monitoring_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Monitoring Items
-- ============================================================
CREATE TABLE IF NOT EXISTS monitoring_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL CHECK (platform IN ('twitter','facebook','instagram','youtube','linkedin','reddit','web','rss')),
  content TEXT NOT NULL,
  title TEXT,
  author TEXT NOT NULL,
  author_avatar_url TEXT,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive','neutral','negative')),
  sentiment_confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  relevance_score INTEGER NOT NULL DEFAULT 50 CHECK (relevance_score BETWEEN 0 AND 100),
  keywords_matched JSONB NOT NULL DEFAULT '[]',
  media_urls JSONB NOT NULL DEFAULT '[]',
  engagement JSONB NOT NULL DEFAULT '{"likes":0,"shares":0,"comments":0,"views":0}',
  content_classification TEXT NOT NULL DEFAULT 'other' CHECK (content_classification IN ('news','opinion','promotion','discussion','review','announcement','other')),
  capture_status TEXT NOT NULL DEFAULT 'pending' CHECK (capture_status IN ('pending','reviewing','approved','rejected','captured')),
  evidence_image_path TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE monitoring_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on monitoring_items"
  ON monitoring_items FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX idx_items_platform ON monitoring_items(platform);
CREATE INDEX idx_items_sentiment ON monitoring_items(sentiment);
CREATE INDEX idx_items_discovered ON monitoring_items(discovered_at DESC);
CREATE INDEX idx_items_published ON monitoring_items(published_at DESC);
CREATE INDEX idx_items_capture_status ON monitoring_items(capture_status);

-- ============================================================
-- Reports
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES monitoring_profiles(id) ON DELETE SET NULL,
  date_range JSONB NOT NULL DEFAULT '{"from":"","to":""}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived'))
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on reports"
  ON reports FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Report Items (junction table)
-- ============================================================
CREATE TABLE IF NOT EXISTS report_items (
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES monitoring_items(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (report_id, item_id)
);

ALTER TABLE report_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on report_items"
  ON report_items FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Share Links
-- ============================================================
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_revoked BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on share_links"
  ON share_links FOR ALL
  USING (auth.role() = 'service_role');

-- Public read for valid, non-revoked links
CREATE POLICY "Public can read active share links"
  ON share_links FOR SELECT
  USING (
    NOT is_revoked
    AND (expires_at IS NULL OR expires_at > now())
  );

-- ============================================================
-- Alerts
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES monitoring_profiles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  platform TEXT NOT NULL,
  item_id UUID NOT NULL REFERENCES monitoring_items(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on alerts"
  ON alerts FOR ALL
  USING (auth.role() = 'service_role');

CREATE INDEX idx_alerts_unread ON alerts(is_read) WHERE NOT is_read;
CREATE INDEX idx_alerts_triggered ON alerts(triggered_at DESC);
