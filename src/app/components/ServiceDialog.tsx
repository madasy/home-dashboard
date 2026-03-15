import { useState, useEffect } from 'react';
import { Service, ServiceFormData } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ServiceFormData) => void;
  service?: Service;
}

const ICON_OPTIONS = [
  { value: 'LayoutDashboard', label: 'Dashboard' },
  { value: 'Activity', label: 'Activity/Status' },
  { value: 'Container', label: 'Container' },
  { value: 'Server', label: 'Server' },
  { value: 'Database', label: 'Database' },
  { value: 'Cloud', label: 'Cloud' },
  { value: 'Lock', label: 'Security' },
  { value: 'Wifi', label: 'Network' },
  { value: 'HardDrive', label: 'Storage' },
  { value: 'Globe', label: 'Web' },
];

const CATEGORY_OPTIONS = [
  'Monitoring',
  'Management',
  'Media',
  'Network',
  'Storage',
  'Security',
  'Automation',
  'Other'
];

export function ServiceDialog({ open, onOpenChange, onSave, service }: ServiceDialogProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    url: '',
    description: '',
    icon: 'Globe',
    category: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        url: service.url,
        description: service.description || '',
        icon: service.icon,
        category: service.category || ''
      });
    } else {
      setFormData({
        name: '',
        url: '',
        description: '',
        icon: 'Globe',
        category: ''
      });
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {service ? 'Service bearbeiten' : 'Neuen Service hinzufügen'}
            </DialogTitle>
            <DialogDescription>
              Füge einen neuen Service zu deinem Dashboard hinzu oder bearbeite einen bestehenden.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Portainer"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://service.madassery.me"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kurze Beschreibung des Services"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger id="icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              {service ? 'Speichern' : 'Hinzufügen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
