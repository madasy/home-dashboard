import { useState, useMemo } from 'react';
import { useServices } from './hooks/useServices';
import { Service } from './types';
import { ServiceCard } from './components/ServiceCard';
import { ServiceDialog } from './components/ServiceDialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Plus, Search, Server } from 'lucide-react';

export default function App() {
  const { services, addService, updateService, deleteService } = useServices();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingService(undefined);
    setDialogOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingService) {
      updateService(editingService.id, data);
    } else {
      addService(data);
    }
    setEditingService(undefined);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingService(undefined);
    }
  };

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    
    const query = searchQuery.toLowerCase();
    return services.filter(
      service =>
        service.name.toLowerCase().includes(query) ||
        service.url.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category?.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    
    filteredServices.forEach(service => {
      const category = service.category || 'Andere';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(service);
    });
    
    return groups;
  }, [filteredServices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg">
              <Server className="size-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Homelab Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Alle deine Services an einem Ort
              </p>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Services durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="size-4" />
                Service hinzufügen
              </Button>
            </div>
          </div>
        </div>

        {/* Services */}
        {Object.keys(groupedServices).length === 0 ? (
          <div className="text-center py-12">
            <Server className="size-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Keine Services gefunden
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              {searchQuery ? 'Versuche eine andere Suche' : 'Füge deinen ersten Service hinzu'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="size-4" />
                Service hinzufügen
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onEdit={handleEdit}
                      onDelete={deleteService}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog */}
        <ServiceDialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          onSave={handleSave}
          service={editingService}
        />
      </div>
    </div>
  );
}
