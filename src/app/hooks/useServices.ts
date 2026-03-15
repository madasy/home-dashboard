import { useState, useEffect } from 'react';
import { Service, ServiceFormData } from '../types';

const STORAGE_KEY = 'homelab-services';

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

export function useServices() {
  const [services, setServices] = useState<Service[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SERVICES;
      }
    }
    return DEFAULT_SERVICES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const addService = (serviceData: ServiceFormData) => {
    const newService: Service = {
      ...serviceData,
      id: crypto.randomUUID()
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
