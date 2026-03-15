# Homelab Dashboard - Deployment Anleitung

## 🚀 Schnellstart mit Docker

### Option 1: Docker Compose (Empfohlen)

```bash
# Dashboard builden und starten
docker-compose up -d

# Logs anschauen
docker-compose logs -f

# Stoppen
docker-compose down
```

### Option 2: Docker direkt

```bash
# Image builden
docker build -t homelab-dashboard .

# Container starten
docker run -d \
  --name homelab-dashboard \
  --restart unless-stopped \
  -p 3000:80 \
  homelab-dashboard

# Logs anschauen
docker logs -f homelab-dashboard

# Stoppen
docker stop homelab-dashboard
docker rm homelab-dashboard
```

## 🔧 Integration mit Nginx Proxy Manager

1. Im NPM eine neue Proxy Host erstellen:
   - Domain: `dash.madassery.me` (oder deine gewünschte Domain)
   - Scheme: `http`
   - Forward Hostname/IP: `homelab-dashboard` (Container-Name) oder Server-IP
   - Forward Port: `80`
   - SSL: Let's Encrypt Zertifikat aktivieren

2. Das Dashboard ist dann unter deiner Domain erreichbar!

## 📝 Netzwerk-Konfiguration

Falls du das `proxy` Netzwerk noch nicht erstellt hast:

```bash
docker network create proxy
```

Dann in der `docker-compose.yml` das Netzwerk anpassen oder den Container manuell mit dem Netzwerk verbinden:

```bash
docker network connect proxy homelab-dashboard
```

## 💾 Daten-Persistenz

Die Services werden im LocalStorage des Browsers gespeichert. 
Das bedeutet:
- ✅ Keine Datenbank nötig
- ✅ Schnell und einfach
- ⚠️ Daten sind browser-spezifisch (jeder Browser hat eigene Daten)
- ⚠️ Bei Browser-Cache-Löschung gehen Daten verloren

### Daten exportieren/importieren (manuell)

Du kannst die Daten aus dem LocalStorage exportieren:

1. Browser-DevTools öffnen (F12)
2. Console öffnen
3. Export: `console.log(localStorage.getItem('homelab-services'))`
4. Import: `localStorage.setItem('homelab-services', '...')`

## 🔄 Updates

```bash
# Neue Version builden
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Troubleshooting

**`502 Bad Gateway` in OpenResty / Nginx Proxy Manager?**
```bash
# 1. Prüfen ob der Container wirklich läuft
docker ps

# 2. Build- oder Startfehler ansehen
docker compose logs --tail=200 homelab-dashboard

# 3. Sicherstellen, dass beide Container im selben Docker-Netzwerk sind
docker network inspect proxy
```

Wenn der Proxy `homelab-dashboard:80` weiterleitet, muss der Container laufen und im `proxy` Netzwerk sein.

**Port schon belegt?**
```bash
# In docker-compose.yml den Port ändern, z.B.:
ports:
  - "3001:80"  # Statt 3000
```

**Container startet nicht?**
```bash
docker logs homelab-dashboard
```

**Netzwerk-Probleme?**
```bash
# Prüfen ob das proxy Netzwerk existiert
docker network ls

# Falls nicht, erstellen:
docker network create proxy
```
