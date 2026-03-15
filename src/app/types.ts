export interface Service {
  id: string;
  name: string;
  url: string;
  description?: string;
  icon: string;
  category?: string;
}

export type ServiceFormData = Omit<Service, 'id'>;
