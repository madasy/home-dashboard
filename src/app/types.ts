export interface Service {
  id: string;
  name: string;
  url: string;
  description?: string;
  icon: string;
  category?: string;
  monitorSlug?: string; // Uptime Kuma monitor slug
}

export type ServiceFormData = Omit<Service, 'id'>;

export interface Settings {
  kumaUrl: string;
  kumaStatusPageSlug?: string;
}

export interface MonitorStatus {
  id: string;
  name: string;
  status: 'up' | 'down' | 'pending' | 'maintenance' | 'unknown';
  ping?: number;
  uptime?: number;
}