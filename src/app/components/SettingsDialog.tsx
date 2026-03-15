import { useState, useEffect } from 'react';
import { Settings } from '../types';
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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsDialog({ open, onOpenChange, settings, onSave }: SettingsDialogProps) {
  const [formData, setFormData] = useState<Settings>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings, open]);

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
            <DialogTitle>Einstellungen</DialogTitle>
            <DialogDescription>
              Konfiguriere deine Uptime Kuma Integration für Live-Status-Updates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kumaUrl">Uptime Kuma URL *</Label>
              <Input
                id="kumaUrl"
                type="url"
                value={formData.kumaUrl}
                onChange={(e) => setFormData({ ...formData, kumaUrl: e.target.value })}
                placeholder="https://status.madassery.me"
                required
              />
              <p className="text-xs text-slate-500">
                Die URL deiner Uptime Kuma Instanz
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kumaStatusPageSlug">Status Page Slug *</Label>
              <Input
                id="kumaStatusPageSlug"
                value={formData.kumaStatusPageSlug || ''}
                onChange={(e) => setFormData({ ...formData, kumaStatusPageSlug: e.target.value })}
                placeholder="z.B. homelab"
                required
              />
              <p className="text-xs text-slate-500">
                Der Slug deiner öffentlichen Status-Seite in Uptime Kuma, also der Teil aus
                <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">/status/&lt;slug&gt;</code>
                <br />
                <span className="font-medium">Wichtig:</span> Die Status-Seite muss öffentlich erreichbar sein.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tipp:</strong> Erstelle in Uptime Kuma eine öffentliche Status Page und füge alle deine Services hinzu. 
                Der Monitor-Name in Uptime Kuma sollte mit dem Service-Namen oder dem Monitor Slug übereinstimmen.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              Speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
