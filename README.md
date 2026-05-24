# WC 2026 Predictor — Railway Edition

A shared multiplayer version of the WC 2026 Predictor. Everyone uses the same server — picks save instantly, results appear automatically via ESPN, and all clients stay in sync via WebSocket.

## What's different from the standalone version

| Feature | Standalone (`index.html`) | Railway |
|---|---|---|
| Storage | Browser localStorage + Pantry Cloud | SQLite on Railway |
| Auth | Any name, no password | Name + 4-digit PIN |
| Sync | Manual "Sync from hub" button | Instant WebSocket push |
| Results | Admin enters manually + ESPN fetch button | ESPN polls automatically (60s/30s live) |
| Hosting | Open `index.html` in a browser | Deploy to Railway |

## Local development

```bash
npm install
node server.js
# Open http://localhost:3000
```

## Deploy to Railway

1. Push this directory to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo — Railway auto-detects Node.js
4. Add environment variables (optional):
   - `ADMIN_PIN` — PIN that grants admin privileges (default: `wc2026`)
   - `DB_PATH` — SQLite file path (default: `./wc26.db` — **add a Railway Volume** so it persists across deploys)
5. Railway gives you a `.railway.app` URL — share it with your group

### Persistent database (important!)

By default SQLite writes to the container filesystem, which is wiped on redeploy.

**Fix:** Add a Railway Volume mounted at `/data`, then set `DB_PATH=/data/wc26.db`.

In Railway dashboard: your service → Storage → Add Volume → Mount path `/data`.

## Admin access

The **first user** to register automatically gets admin. Any user whose PIN matches `ADMIN_PIN` (env var) also gets admin.

Admin users can:
- Enter/edit/delete results manually in the Admin panel
- Override ESPN-fetched scores if needed

ESPN results update automatically — admins only need to intervene for KO round results (which ESPN covers but the bracket matching is more complex).

## Architecture

```
client.html  ←── served by Express
     │
     ├── POST /api/auth          login / register
     ├── GET  /api/state         full state snapshot (REST fallback)
     ├── PUT  /api/predictions   save my picks (debounced 600ms)
     │
     └── WebSocket ws://...      real-time push on any state change

server.js
     ├── Express routes
     ├── WebSocket server (ws)
     ├── SQLite (better-sqlite3)  — users, predictions, results
     └── ESPN poller              — polls every 60s, 30s when live
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DB_PATH` | `./wc26.db` | SQLite database path |
| `ADMIN_PIN` | `wc2026` | PIN that grants admin on registration |
