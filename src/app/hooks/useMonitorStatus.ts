import { useState, useEffect, useCallback } from 'react';
import { MonitorStatus } from '../types';

interface UptimeKumaHeartbeat {
  status: number; // 0 = down, 1 = up, 2 = pending
  msg?: string;
  ping?: number;
}

interface UptimeKumaMonitor {
  id: number | string;
  name: string;
  type?: string;
}

interface UptimeKumaStatusPage {
  publicGroupList: Array<{
    name: string;
    monitorList: Array<{
      id: number | string;
      name: string;
      slug?: string;
      sendUrl?: number;
    }>;
  }>;
  heartbeatList?: Record<string, UptimeKumaHeartbeat[]>;
  uptimeList?: Record<string, { uptime: number }>;
}

interface UptimeKumaHeartbeatResponse {
  heartbeatList?: Record<string, UptimeKumaHeartbeat[]>;
  uptimeList?: Record<string, { uptime: number }>;
}

function normalizeMonitorKey(value: string) {
  return value.trim().toLowerCase();
}

function buildLookupKeys(...values: Array<string | number | undefined>) {
  const keys = new Set<string>();

  values.forEach((value) => {
    if (value === undefined || value === null) {
      return;
    }

    const raw = String(value).trim();
    if (!raw) {
      return;
    }

    const normalized = normalizeMonitorKey(raw);
    const slugLike = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const compact = normalized.replace(/[^a-z0-9]+/g, '');

    keys.add(normalized);
    if (slugLike) {
      keys.add(slugLike);
    }
    if (compact) {
      keys.add(compact);
    }
  });

  return Array.from(keys);
}

export function useMonitorStatus(kumaUrl: string, statusPageSlug?: string) {
  const [monitorStatuses, setMonitorStatuses] = useState<Record<string, MonitorStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!kumaUrl || !statusPageSlug) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = kumaUrl.replace(/\/$/, '');
      const [statusPageResponse, heartbeatResponse] = await Promise.all([
        fetch(`${baseUrl}/api/status-page/${statusPageSlug}`),
        fetch(`${baseUrl}/api/status-page/heartbeat/${statusPageSlug}`),
      ]);

      if (!statusPageResponse.ok) {
        throw new Error(`Status page request failed with ${statusPageResponse.status}`);
      }

      if (!heartbeatResponse.ok) {
        throw new Error(`Heartbeat request failed with ${heartbeatResponse.status}`);
      }

      const [statusPageData, heartbeatData] = await Promise.all([
        statusPageResponse.json() as Promise<UptimeKumaStatusPage>,
        heartbeatResponse.json() as Promise<UptimeKumaHeartbeatResponse>,
      ]);

      const statuses: Record<string, MonitorStatus> = {};
      const heartbeatList = heartbeatData.heartbeatList ?? statusPageData.heartbeatList ?? {};
      const uptimeList = heartbeatData.uptimeList ?? statusPageData.uptimeList ?? {};

      statusPageData.publicGroupList?.forEach(group => {
        group.monitorList?.forEach(monitor => {
          const monitorId = String(monitor.id);
          const heartbeats = heartbeatList[monitorId];
          const latestHeartbeat = heartbeats?.[0];
          const uptimeData = uptimeList[monitorId];

          let status: MonitorStatus['status'] = 'unknown';
          if (latestHeartbeat) {
            switch (latestHeartbeat.status) {
              case 1:
                status = 'up';
                break;
              case 0:
                status = 'down';
                break;
              case 2:
                status = 'pending';
                break;
              case 3:
                status = 'maintenance';
                break;
              default:
                status = 'unknown';
            }
          }

          const monitorStatus: MonitorStatus = {
            id: monitorId,
            name: monitor.name,
            status,
            ping: latestHeartbeat?.ping,
            uptime: uptimeData?.uptime
          };

          buildLookupKeys(monitor.id, monitor.name, monitor.slug).forEach((key) => {
            statuses[key] = monitorStatus;
          });
        });
      });

      setMonitorStatuses(statuses);
    } catch (err) {
      console.error('Failed to fetch Uptime Kuma status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  }, [kumaUrl, statusPageSlug]);

  useEffect(() => {
    fetchStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const getStatusForService = (serviceName: string, monitorSlug?: string): MonitorStatus | null => {
    for (const key of buildLookupKeys(monitorSlug, serviceName)) {
      const match = monitorStatuses[key];
      if (match) {
        return match;
      }
    }

    return null;
  };

  return {
    monitorStatuses,
    loading,
    error,
    getStatusForService,
    refresh: fetchStatus
  };
}
