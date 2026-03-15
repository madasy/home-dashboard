import { Service, MonitorStatus } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  monitorStatus?: MonitorStatus | null;
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

export function ServiceCard({ service, onEdit, onDelete, monitorStatus }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Globe;

  const getStatusColor = (status?: MonitorStatus['status']) => {
    switch (status) {
      case 'up':
        return 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20';
      case 'down':
        return 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20';
      case 'maintenance':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-500 border-slate-500/20';
    }
  };

  const getStatusIcon = (status?: MonitorStatus['status']) => {
    switch (status) {
      case 'up':
        return <CheckCircle2 className="size-3" />;
      case 'down':
        return <XCircle className="size-3" />;
      case 'pending':
        return <Clock className="size-3" />;
      case 'maintenance':
        return <AlertCircle className="size-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status?: MonitorStatus['status']) => {
    switch (status) {
      case 'up':
        return 'Online';
      case 'down':
        return 'Offline';
      case 'pending':
        return 'Prüfung...';
      case 'maintenance':
        return 'Wartung';
      default:
        return 'Unbekannt';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-blue-500/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <IconComponent className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                {monitorStatus && (
                  <Badge 
                    variant="outline" 
                    className={`gap-1 ${getStatusColor(monitorStatus.status)}`}
                  >
                    {getStatusIcon(monitorStatus.status)}
                    {getStatusText(monitorStatus.status)}
                  </Badge>
                )}
              </div>
              {service.description && (
                <CardDescription className="mt-1">{service.description}</CardDescription>
              )}
              {monitorStatus && monitorStatus.ping && (
                <CardDescription className="mt-1">
                  Ping: {monitorStatus.ping}ms
                  {monitorStatus.uptime && ` • Uptime: ${(monitorStatus.uptime * 100).toFixed(1)}%`}
                </CardDescription>
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