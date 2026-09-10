import { Platform, MonitoringItem, SearchQuery } from '@/types';

export abstract class BaseConnector {
  abstract platform: Platform;
  
  // Check if credentials/CLI are available
  abstract isConfigured(): Promise<boolean>;
  
  // Quick health check
  abstract healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }>;
  
  // Perform search (shells out to Agent-Reach CLI tools)
  abstract search(query: SearchQuery): Promise<MonitoringItem[]>;

  protected generateId(): string {
    return crypto.randomUUID();
  }
}
