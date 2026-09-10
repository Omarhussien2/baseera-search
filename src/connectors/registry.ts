import { BaseConnector } from './base';
import { Platform } from '@/types';

class ConnectorRegistry {
  private connectors: Map<Platform, BaseConnector> = new Map();

  register(connector: BaseConnector) {
    this.connectors.set(connector.platform, connector);
  }

  get(platform: Platform): BaseConnector | undefined {
    return this.connectors.get(platform);
  }

  getAll(): BaseConnector[] {
    return Array.from(this.connectors.values());
  }
}

export const registry = new ConnectorRegistry();
