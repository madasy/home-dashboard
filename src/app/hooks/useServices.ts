import { useState, useEffect } from 'react';
import { Service, ServiceFormData } from '../types';

const STORAGE_KEY = 'homelab-services';
const STORAGE_BACKUP_KEY = 'homelab-services-backup';

function createServiceId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return `service-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Dashboard',
    url: 'https://dash.madassery.me',
    description: 'Hauptdashboard',
    icon: 'LayoutDashboard',
    category: 'Monitoring'
  },
  {
    id: '2',
    name: 'Status',
    url: 'https://status.madassery.me',
    description: 'Statusüberwachung',
    icon: 'Activity',
    category: 'Monitoring'
  },
  {
    id: '3',
    name: 'Portainer',
    url: 'https://portainer.madassery.me',
    description: 'Container Management',
    icon: 'Container',
    category: 'Management'
  }
];

function isService(value: unknown): value is Service {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const service = value as Record<string, unknown>;

  return (
    typeof service.id === 'string' &&
    typeof service.name === 'string' &&
    typeof service.url === 'string' &&
    typeof service.icon === 'string' &&
    (service.description === undefined || typeof service.description === 'string') &&
    (service.category === undefined || typeof service.category === 'string')
  );
}

function parseStoredServices(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const services = parsed.filter(isService);
    return services.length === parsed.length ? services : null;
  } catch {
    return null;
  }
}

function loadServices() {
  try {
    const primary = parseStoredServices(localStorage.getItem(STORAGE_KEY));
    if (primary) {
      return primary;
    }

    const backup = parseStoredServices(localStorage.getItem(STORAGE_BACKUP_KEY));
    if (backup) {
      return backup;
    }
  } catch {
    return DEFAULT_SERVICES;
  }

  return DEFAULT_SERVICES;
}

function saveServices(services: Service[]) {
  const serialized = JSON.stringify(services);

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_BACKUP_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

export function useServices() {
  const [services, setServices] = useState<Service[]>(loadServices);

  useEffect(() => {
    saveServices(services);
  }, [services]);

  const addService = (serviceData: ServiceFormData) => {
    const newService: Service = {
      ...serviceData,
      id: createServiceId()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, serviceData: ServiceFormData) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...serviceData, id } : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return {
    services,
    addService,
    updateService,
    deleteService
  };
}
