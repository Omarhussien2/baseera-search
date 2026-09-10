import {
  MonitoringItem,
  MonitoringProfile,
  Report,
  Alert,
  Client,
  ShareLink,
  DashboardStats,
  SearchQuery,
  SearchResult,
  ConnectorStatus,
  Platform,
} from '@/types';

// Store interface — swap InMemoryStore for SupabaseStore later
export interface IStore {
  // Items
  getItems(query?: Partial<SearchQuery>): Promise<SearchResult>;
  getItemById(id: string): Promise<MonitoringItem | null>;
  addItem(item: MonitoringItem): Promise<MonitoringItem>;
  updateItem(id: string, updates: Partial<MonitoringItem>): Promise<MonitoringItem | null>;
  deleteItem(id: string): Promise<boolean>;

  // Profiles
  getProfiles(): Promise<MonitoringProfile[]>;
  getProfileById(id: string): Promise<MonitoringProfile | null>;
  addProfile(profile: MonitoringProfile): Promise<MonitoringProfile>;
  updateProfile(id: string, updates: Partial<MonitoringProfile>): Promise<MonitoringProfile | null>;

  // Reports
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  addReport(report: Report): Promise<Report>;
  updateReport(id: string, updates: Partial<Report>): Promise<Report | null>;
  addItemToReport(reportId: string, itemId: string): Promise<boolean>;

  // Alerts
  getAlerts(unreadOnly?: boolean): Promise<Alert[]>;
  addAlert(alert: Alert): Promise<Alert>;
  markAlertRead(id: string): Promise<boolean>;

  // Clients
  getClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  addClient(client: Client): Promise<Client>;

  // Share Links
  createShareLink(link: ShareLink): Promise<ShareLink>;
  getShareLinkByToken(token: string): Promise<ShareLink | null>;
  revokeShareLink(token: string): Promise<boolean>;
  incrementShareLinkViews(token: string): Promise<boolean>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
}

class InMemoryStore implements IStore {
  private items: Map<string, MonitoringItem> = new Map();
  private profiles: Map<string, MonitoringProfile> = new Map();
  private reports: Map<string, Report> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private clients: Map<string, Client> = new Map();
  private shareLinks: Map<string, ShareLink> = new Map();

  // ---------- Items ----------
  async getItems(query?: Partial<SearchQuery>): Promise<SearchResult> {
    const startTime = Date.now();
    let results = Array.from(this.items.values());

    if (query) {
      if (query.keywords && query.keywords.length > 0) {
        const kw = query.keywords.map((k) => k.toLowerCase());
        results = results.filter((item) =>
          kw.some(
            (k) =>
              item.content.toLowerCase().includes(k) ||
              (item.title && item.title.toLowerCase().includes(k)),
          ),
        );
      }
      if (query.platforms && query.platforms.length > 0) {
        results = results.filter((item) => query.platforms!.includes(item.platform));
      }
      if (query.sentiment_filter && query.sentiment_filter.length > 0) {
        results = results.filter((item) => query.sentiment_filter!.includes(item.sentiment));
      }
      if (query.content_classification && query.content_classification.length > 0) {
        results = results.filter((item) =>
          query.content_classification!.includes(item.content_classification),
        );
      }
      if (query.date_range) {
        const from = new Date(query.date_range.from).getTime();
        const to = new Date(query.date_range.to).getTime();
        results = results.filter((item) => {
          const pub = new Date(item.published_at).getTime();
          return pub >= from && pub <= to;
        });
      }
    }

    // Sort by discovered_at descending
    results.sort((a, b) => new Date(b.discovered_at).getTime() - new Date(a.discovered_at).getTime());

    const total = results.length;
    const offset = query?.offset ?? 0;
    const limit = query?.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return {
      items: results,
      total_count: total,
      platforms_searched: query?.platforms ?? [],
      query_duration_ms: Date.now() - startTime,
    };
  }

  async getItemById(id: string): Promise<MonitoringItem | null> {
    return this.items.get(id) ?? null;
  }

  async addItem(item: MonitoringItem): Promise<MonitoringItem> {
    this.items.set(item.id, item);
    return item;
  }

  async updateItem(id: string, updates: Partial<MonitoringItem>): Promise<MonitoringItem | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, id };
    this.items.set(id, updated);
    return updated;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  // ---------- Profiles ----------
  async getProfiles(): Promise<MonitoringProfile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfileById(id: string): Promise<MonitoringProfile | null> {
    return this.profiles.get(id) ?? null;
  }

  async addProfile(profile: MonitoringProfile): Promise<MonitoringProfile> {
    this.profiles.set(profile.id, profile);
    return profile;
  }

  async updateProfile(
    id: string,
    updates: Partial<MonitoringProfile>,
  ): Promise<MonitoringProfile | null> {
    const existing = this.profiles.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, id };
    this.profiles.set(id, updated);
    return updated;
  }

  // ---------- Reports ----------
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReportById(id: string): Promise<Report | null> {
    return this.reports.get(id) ?? null;
  }

  async addReport(report: Report): Promise<Report> {
    this.reports.set(report.id, report);
    return report;
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report | null> {
    const existing = this.reports.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, id };
    this.reports.set(id, updated);
    return updated;
  }

  async addItemToReport(reportId: string, itemId: string): Promise<boolean> {
    const report = this.reports.get(reportId);
    if (!report) return false;
    if (!report.items.includes(itemId)) {
      report.items.push(itemId);
    }
    // Also tag the item
    const item = this.items.get(itemId);
    if (item && !item.report_ids.includes(reportId)) {
      item.report_ids.push(reportId);
    }
    return true;
  }

  // ---------- Alerts ----------
  async getAlerts(unreadOnly?: boolean): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values());
    if (unreadOnly) {
      alerts = alerts.filter((a) => !a.is_read);
    }
    return alerts.sort(
      (a, b) => new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime(),
    );
  }

  async addAlert(alert: Alert): Promise<Alert> {
    this.alerts.set(alert.id, alert);
    return alert;
  }

  async markAlertRead(id: string): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    alert.is_read = true;
    return true;
  }

  // ---------- Clients ----------
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClientById(id: string): Promise<Client | null> {
    return this.clients.get(id) ?? null;
  }

  async addClient(client: Client): Promise<Client> {
    this.clients.set(client.id, client);
    return client;
  }

  // ---------- Share Links ----------
  async createShareLink(link: ShareLink): Promise<ShareLink> {
    this.shareLinks.set(link.token, link);
    return link;
  }

  async getShareLinkByToken(token: string): Promise<ShareLink | null> {
    return this.shareLinks.get(token) ?? null;
  }

  async revokeShareLink(token: string): Promise<boolean> {
    const link = this.shareLinks.get(token);
    if (!link) return false;
    link.is_revoked = true;
    return true;
  }

  async incrementShareLinkViews(token: string): Promise<boolean> {
    const link = this.shareLinks.get(token);
    if (!link) return false;
    link.view_count += 1;
    return true;
  }

  // ---------- Dashboard ----------
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const allItems = Array.from(this.items.values());
    const todayItems = allItems.filter((i) => i.discovered_at >= todayStart);
    const weekItems = allItems.filter((i) => i.discovered_at >= weekAgo);

    const sentimentTrend = { positive: 0, neutral: 0, negative: 0 };
    const platformActivity: Partial<Record<Platform, number>> = {};

    for (const item of weekItems) {
      sentimentTrend[item.sentiment]++;
      platformActivity[item.platform] = (platformActivity[item.platform] ?? 0) + 1;
    }

    const activeProfiles = Array.from(this.profiles.values()).filter((p) => p.is_active).length;
    const unreadAlerts = Array.from(this.alerts.values()).filter((a) => !a.is_read).length;

    const connectorStatuses: ConnectorStatus[] = (
      ['twitter', 'facebook', 'instagram', 'youtube', 'linkedin', 'reddit', 'web', 'rss'] as Platform[]
    ).map((platform) => ({
      platform,
      is_available: platform === 'web' || platform === 'rss',
      last_check: now.toISOString(),
      requires_auth: ['twitter', 'facebook', 'instagram', 'reddit'].includes(platform),
      auth_configured: false,
    }));

    return {
      total_items_today: todayItems.length,
      total_items_week: weekItems.length,
      active_profiles: activeProfiles,
      unread_alerts: unreadAlerts,
      sentiment_trend: sentimentTrend,
      platform_activity: platformActivity,
      connector_statuses: connectorStatuses,
    };
  }
}

// Singleton
let storeInstance: IStore | null = null;

export function getStore(): IStore {
  if (!storeInstance) {
    storeInstance = new InMemoryStore();
  }
  return storeInstance;
}

export { InMemoryStore };
