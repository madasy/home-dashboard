# Uptime Kuma Integration Setup

## 🎯 So richtest du die Integration ein

### 1. Uptime Kuma Status Page erstellen

1. Öffne deine Uptime Kuma Instanz (`https://status.madassery.me`)
2. Gehe zu **Status Pages** im Menü
3. Klicke auf **Add New Status Page**
4. Konfiguriere die Status Page:
   - **Title**: z.B. "Homelab Services"
   - **Slug**: z.B. "homelab" (merke dir diesen!)
   - **Theme**: Nach deinem Geschmack
   - **Public**: ✅ **WICHTIG: Muss aktiviert sein!**

### 2. Monitore zur Status Page hinzufügen

1. Füge alle deine Services als Monitore hinzu:
   - Dashboard
   - Portainer
   - Andere Services
   
2. Wichtig: **Monitor-Name** notieren (z.B. "Dashboard", "Portainer")

3. Füge die Monitore zu deiner Status Page hinzu:
   - In der Status Page → **Edit** → **Public Group List**
   - Ziehe die Monitore in die Gruppen

### 3. Dashboard konfigurieren

1. Öffne dein Homelab Dashboard
2. Klicke auf **Einstellungen**
3. Trage ein:
   - **Uptime Kuma URL**: `https://status.madassery.me`
   - **Status Page Slug**: `homelab` (oder dein gewählter Slug)
4. Klicke auf **Speichern**

### 4. Services mit Monitoren verbinden

Für jeden Service:

1. Klicke auf das **Bearbeiten**-Icon (Stift)
2. Trage im Feld **"Uptime Kuma Monitor Name"** den exakten Namen ein
   - Z.B. für Dashboard: `Dashboard`
   - Z.B. für Portainer: `Portainer`
   - **WICHTIG**: Name muss EXAKT übereinstimmen (Groß-/Kleinschreibung!)
3. Speichern

Alternativ: Wenn du das Feld leer lässt, versucht das Dashboard automatisch 
den Monitor anhand des Service-Namens zu finden.

## 📊 Was du jetzt sehen solltest

Nach der Konfiguration siehst du bei jedem Service:

- ✅ **Status-Badge**: 
  - 🟢 **Online** - Service läuft
  - 🔴 **Offline** - Service ist down
  - 🟡 **Prüfung...** - Wird gerade geprüft
  - 🔵 **Wartung** - Im Wartungsmodus

- 📈 **Ping & Uptime**:
  - Antwortzeit in ms
  - Uptime in Prozent

- 🔄 **Auto-Refresh**: Aktualisiert sich automatisch alle 30 Sekunden

## 🔧 Troubleshooting

### Status wird nicht angezeigt

1. **Status Page ist nicht Public**
   - Lösung: In Uptime Kuma → Status Page → Edit → "Public" aktivieren

2. **Falscher Slug**
   - Lösung: Prüfe in Uptime Kuma den Slug deiner Status Page
   - URL sollte sein: `https://status.madassery.me/status/DEIN-SLUG`

3. **Monitor-Name stimmt nicht überein**
   - Lösung: Vergleiche den Namen in Uptime Kuma mit dem im Dashboard
   - Oder: Lass das Feld leer für automatisches Matching

4. **CORS-Fehler**
   - Wenn du in der Browser-Console CORS-Fehler siehst:
   - Das Dashboard und Uptime Kuma sollten auf derselben Domain laufen
   - Oder: Konfiguriere CORS in Uptime Kuma

### API-Endpunkt testen

Teste manuell, ob die API erreichbar ist:

```bash
curl https://status.madassery.me/api/status-page/homelab
```

Du solltest JSON mit deinen Monitoren sehen.

## 🎨 Beispiel-Konfiguration

```
Dashboard Settings:
├── Uptime Kuma URL: https://status.madassery.me
└── Status Page Slug: homelab

Service: Dashboard
├── Name: Dashboard
├── URL: https://dash.madassery.me
└── Monitor Name: Dashboard  ← muss in Uptime Kuma existieren

Service: Portainer
├── Name: Portainer
├── URL: https://portainer.madassery.me
└── Monitor Name: Portainer  ← muss in Uptime Kuma existieren
```

## 💡 Best Practices

1. **Konsistente Benennung**: Verwende denselben Namen in Uptime Kuma und im Dashboard
2. **Gruppen nutzen**: Organisiere Monitore in Uptime Kuma nach Kategorien
3. **Öffentliche Status Page**: Muss aktiviert sein, sonst funktioniert die API nicht
4. **Refresh-Button**: Nutze den Refresh-Button, wenn Status nicht aktuell ist
