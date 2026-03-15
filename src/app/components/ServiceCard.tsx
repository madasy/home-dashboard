import { Service } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  ExternalLink, 
  Pencil, 
  Trash2,
  LayoutDashboard,
  Activity,
  Container,
  Server,
  Database,
  Cloud,
  Lock,
  Wifi,
  HardDrive,
  Globe
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Activity,
  Container,
  Server,
  Database,
  Cloud,
  Lock,
  Wifi,
  HardDrive,
  Globe
};

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Globe;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-blue-500/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <IconComponent className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              {service.description && (
                <CardDescription className="mt-1">{service.description}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onEdit(service)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-red-500 hover:text-red-600"
              onClick={() => onDelete(service.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group/link"
        >
          <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
            {service.url}
          </span>
          <ExternalLink className="size-4 text-slate-400 group-hover/link:text-blue-500 transition-colors flex-shrink-0 ml-2" />
        </a>
      </CardContent>
    </Card>
  );
}
