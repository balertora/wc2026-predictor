'use strict';

const express    = require('express');
const http       = require('http');
const { WebSocketServer } = require('ws');
const { DatabaseSync } = require('node:sqlite');
const bcrypt     = require('bcrypt');
const path       = require('path');
const fs         = require('fs');

// ── Config ──────────────────────────────────────────────────────────────────
const PORT       = parseInt(process.env.PORT || '3000', 10);
const DB_PATH    = process.env.DB_PATH || path.join(__dirname, 'wc26.db');
const ADMIN_PIN  = process.env.ADMIN_PIN || 'wc2026';  // override with Railway env var
const SALT_ROUNDS = 10;

// ── Database ────────────────────────────────────────────────────────────────
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    pin_hash   TEXT    NOT NULL,
    avatar     TEXT    NOT NULL DEFAULT '',
    is_admin   INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS group_predictions (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id    INTEGER NOT NULL,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, game_id)
  );
  CREATE TABLE IF NOT EXISTS ko_predictions (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id   TEXT    NOT NULL,
    home       TEXT,
    away       TEXT,
    home_score INTEGER,
    away_score INTEGER,
    pen_winner TEXT,
    updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, match_id)
  );
  CREATE TABLE IF NOT EXISTS group_results (
    game_id    INTEGER PRIMARY KEY,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    source     TEXT    NOT NULL DEFAULT 'manual',
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS ko_results (
    match_id   TEXT    PRIMARY KEY,
    home_score INTEGER,
    away_score INTEGER,
    pen_winner TEXT,
    source     TEXT    NOT NULL DEFAULT 'manual',
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT    PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       TEXT    NOT NULL,
    is_admin   INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT    PRIMARY KEY,
    value      TEXT    NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS re_bracket (
    match_id   TEXT    PRIMARY KEY,
    home       TEXT    NOT NULL DEFAULT '',
    away       TEXT    NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS re_picks (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id   TEXT    NOT NULL,
    winner     TEXT    NOT NULL,
    updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, match_id)
  );
`);

// Prepared statements
const stmts = {
  getUser:        db.prepare(`SELECT * FROM users WHERE name = ? COLLATE NOCASE`),
  createUser:     db.prepare(`INSERT INTO users (name, pin_hash, avatar) VALUES (?, ?, '')`),
  updateAvatar:   db.prepare(`UPDATE users SET avatar = ? WHERE id = ?`),
  upsertGPred:    db.prepare(`INSERT INTO group_predictions (user_id, game_id, home_score, away_score, updated_at)
                              VALUES (?, ?, ?, ?, datetime('now'))
                              ON CONFLICT(user_id, game_id) DO UPDATE SET
                                home_score = excluded.home_score,
                                away_score = excluded.away_score,
                                updated_at = excluded.updated_at`),
  upsertKOPred:   db.prepare(`INSERT INTO ko_predictions (user_id, match_id, home, away, home_score, away_score, pen_winner, updated_at)
                              VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
                              ON CONFLICT(user_id, match_id) DO UPDATE SET
                                home = excluded.home, away = excluded.away,
                                home_score = excluded.home_score, away_score = excluded.away_score,
                                pen_winner = excluded.pen_winner, updated_at = excluded.updated_at`),
  upsertGResult:  db.prepare(`INSERT INTO group_results (game_id, home_score, away_score, source, updated_at)
                              VALUES (?, ?, ?, ?, datetime('now'))
                              ON CONFLICT(game_id) DO UPDATE SET
                                home_score = excluded.home_score,
                                away_score = excluded.away_score,
                                source     = excluded.source,
                                updated_at = excluded.updated_at`),
  upsertKOResult: db.prepare(`INSERT INTO ko_results (match_id, home_score, away_score, pen_winner, source, updated_at)
                              VALUES (?, ?, ?, ?, ?, datetime('now'))
                              ON CONFLICT(match_id) DO UPDATE SET
                                home_score = excluded.home_score,
                                away_score = excluded.away_score,
                                pen_winner = excluded.pen_winner,
                                source     = excluded.source,
                                updated_at = excluded.updated_at`),
  deleteGResult:  db.prepare(`DELETE FROM group_results WHERE game_id = ?`),
  deleteKOResult: db.prepare(`DELETE FROM ko_results WHERE match_id = ?`),
  getAllGPreds:    db.prepare(`SELECT u.name, u.avatar, gp.game_id, gp.home_score, gp.away_score
                              FROM group_predictions gp JOIN users u ON u.id = gp.user_id`),
  getAllKOPreds:   db.prepare(`SELECT u.name, kp.*
                              FROM ko_predictions kp JOIN users u ON u.id = kp.user_id`),
  getAllGResults:  db.prepare(`SELECT * FROM group_results`),
  getAllKOResults: db.prepare(`SELECT * FROM ko_results`),
  // Sessions
  createSession:  db.prepare(`INSERT OR REPLACE INTO sessions (token, user_id, name, is_admin) VALUES (?, ?, ?, ?)`),
  getSession:     db.prepare(`SELECT * FROM sessions WHERE token = ?`),
  deleteSession:  db.prepare(`DELETE FROM sessions WHERE token = ?`),
  deleteUserSessions: db.prepare(`DELETE FROM sessions WHERE user_id = ?`),
  // Settings
  getAllSettings:  db.prepare(`SELECT key, value FROM settings`),
  setSetting:      db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`),
  // Re-bracket (admin sets R32 matchups for Repicker)
  getAllReBracket:  db.prepare(`SELECT * FROM re_bracket`),
  upsertReBracket: db.prepare(`INSERT OR REPLACE INTO re_bracket (match_id, home, away) VALUES (?, ?, ?)`),
  // Re-picks (users' Repicker bracket picks)
  getAllRePicks:    db.prepare(`SELECT u.name, rp.match_id, rp.winner FROM re_picks rp JOIN users u ON u.id = rp.user_id`),
  upsertRePick:    db.prepare(`INSERT OR REPLACE INTO re_picks (user_id, match_id, winner, updated_at) VALUES (?, ?, ?, datetime('now'))`),
  deleteRePick:    db.prepare(`DELETE FROM re_picks WHERE user_id = ? AND match_id = ?`),
};

// ── Auth (DB-backed token store — survives server restarts) ──────────────────
function genToken() {
  const arr = new Uint32Array(4);
  for (let i = 0; i < 4; i++) arr[i] = Math.floor(Math.random() * 0xFFFFFFFF);
  return Array.from(arr).map(n => n.toString(36)).join('');
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
  const session = stmts.getSession.get(auth.slice(7));
  if (!session) return res.status(401).json({ error: 'Session expired — please log in again' });
  req.session = { userId: session.user_id, name: session.name, isAdmin: !!session.is_admin };
  next();
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.session.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    next();
  });
}

// ── ESPN team name → app team name ──────────────────────────────────────────
const ESPN_NAME_MAP = {
  'United States':               'USA',
  'Türkiye':                     'Turkey',
  'Turkey':                      'Turkey',
  'Bosnia-Herzegovina':          'Bosnia and Herz.',
  'Bosnia & Herzegovina':        'Bosnia and Herz.',
  'Bosnia and Herzegovina':      'Bosnia and Herz.',
  "Côte d'Ivoire":               'Ivory Coast',
  "Cote d'Ivoire":               'Ivory Coast',
  "Côte D'Ivoire":               'Ivory Coast',
  'Ivory Coast':                 'Ivory Coast',
  'DR Congo':                    'DR Congo',
  'Congo DR':                    'DR Congo',
  'Democratic Republic of Congo':'DR Congo',
  'Curaçao':                     'Curaçao',
  'Curacao':                     'Curaçao',
  'Korea Republic':              'South Korea',
  'Republic of Korea':           'South Korea',
  'Cabo Verde':                  'Cape Verde',
  'Saudi Arabia':                'Saudi Arabia',
  'New Zealand':                 'New Zealand',
};
function mapTeamName(n) { return ESPN_NAME_MAP[n] || n; }

// ── Fixture list (mirrors client GROUP_GAMES — must stay in sync) ────────────
const GROUP_GAMES = [
  // MD1
  {id:1,  home:'Mexico',           away:'South Africa',   date:'2026-06-11'},
  {id:2,  home:'South Korea',      away:'Czechia',        date:'2026-06-12'},
  {id:3,  home:'Canada',           away:'Bosnia and Herz.',date:'2026-06-12'},
  {id:4,  home:'Qatar',            away:'Switzerland',    date:'2026-06-13'},
  {id:5,  home:'Brazil',           away:'Morocco',        date:'2026-06-13'},
  {id:6,  home:'Haiti',            away:'Scotland',       date:'2026-06-14'},
  {id:7,  home:'USA',              away:'Paraguay',       date:'2026-06-13'},
  {id:8,  home:'Australia',        away:'Turkey',         date:'2026-06-14'},
  {id:9,  home:'Germany',          away:'Curaçao',        date:'2026-06-14'},
  {id:10, home:'Ivory Coast',      away:'Ecuador',        date:'2026-06-15'},
  {id:11, home:'Netherlands',      away:'Japan',          date:'2026-06-14'},
  {id:12, home:'Sweden',           away:'Tunisia',        date:'2026-06-15'},
  {id:13, home:'Belgium',          away:'Egypt',          date:'2026-06-15'},
  {id:14, home:'Iran',             away:'New Zealand',    date:'2026-06-16'},
  {id:15, home:'Spain',            away:'Cape Verde',     date:'2026-06-15'},
  {id:16, home:'Saudi Arabia',     away:'Uruguay',        date:'2026-06-15'},
  {id:17, home:'France',           away:'Senegal',        date:'2026-06-16'},
  {id:18, home:'Iraq',             away:'Norway',         date:'2026-06-16'},
  {id:19, home:'Argentina',        away:'Algeria',        date:'2026-06-17'},
  {id:20, home:'Austria',          away:'Jordan',         date:'2026-06-17'},
  {id:21, home:'Portugal',         away:'DR Congo',       date:'2026-06-17'},
  {id:22, home:'Uzbekistan',       away:'Colombia',       date:'2026-06-18'},
  {id:23, home:'England',          away:'Croatia',        date:'2026-06-17'},
  {id:24, home:'Ghana',            away:'Panama',         date:'2026-06-18'},
  // MD2
  {id:25, home:'Mexico',           away:'South Korea',    date:'2026-06-19'},
  {id:26, home:'Czechia',          away:'South Africa',   date:'2026-06-18'},
  {id:27, home:'Canada',           away:'Qatar',          date:'2026-06-18'},
  {id:28, home:'Switzerland',      away:'Bosnia and Herz.',date:'2026-06-18'},
  {id:29, home:'Scotland',         away:'Morocco',        date:'2026-06-19'},
  {id:30, home:'Brazil',           away:'Haiti',          date:'2026-06-20'},
  {id:31, home:'USA',              away:'Australia',      date:'2026-06-19'},
  {id:32, home:'Turkey',           away:'Paraguay',       date:'2026-06-20'},
  {id:33, home:'Germany',          away:'Ivory Coast',    date:'2026-06-20'},
  {id:34, home:'Ecuador',          away:'Curaçao',        date:'2026-06-21'},
  {id:35, home:'Netherlands',      away:'Sweden',         date:'2026-06-20'},
  {id:36, home:'Tunisia',          away:'Japan',          date:'2026-06-21'},
  {id:37, home:'Belgium',          away:'Iran',           date:'2026-06-21'},
  {id:38, home:'New Zealand',      away:'Egypt',          date:'2026-06-22'},
  {id:39, home:'Spain',            away:'Saudi Arabia',   date:'2026-06-21'},
  {id:40, home:'Uruguay',          away:'Cape Verde',     date:'2026-06-21'},
  {id:41, home:'France',           away:'Iraq',           date:'2026-06-22'},
  {id:42, home:'Norway',           away:'Senegal',        date:'2026-06-23'},
  {id:43, home:'Argentina',        away:'Austria',        date:'2026-06-22'},
  {id:44, home:'Jordan',           away:'Algeria',        date:'2026-06-23'},
  {id:45, home:'Portugal',         away:'Uzbekistan',     date:'2026-06-23'},
  {id:46, home:'Colombia',         away:'DR Congo',       date:'2026-06-24'},
  {id:47, home:'England',          away:'Ghana',          date:'2026-06-23'},
  {id:48, home:'Panama',           away:'Croatia',        date:'2026-06-24'},
  // MD3
  {id:49, home:'South Africa',     away:'South Korea',    date:'2026-06-25'},
  {id:50, home:'Czechia',          away:'Mexico',         date:'2026-06-25'},
  {id:51, home:'Switzerland',      away:'Canada',         date:'2026-06-24'},
  {id:52, home:'Bosnia and Herz.', away:'Qatar',          date:'2026-06-24'},
  {id:53, home:'Morocco',          away:'Haiti',          date:'2026-06-24'},
  {id:54, home:'Scotland',         away:'Brazil',         date:'2026-06-24'},
  {id:55, home:'Turkey',           away:'USA',            date:'2026-06-26'},
  {id:56, home:'Paraguay',         away:'Australia',      date:'2026-06-26'},
  {id:57, home:'Curaçao',          away:'Ivory Coast',    date:'2026-06-25'},
  {id:58, home:'Ecuador',          away:'Germany',        date:'2026-06-25'},
  {id:59, home:'Tunisia',          away:'Netherlands',    date:'2026-06-26'},
  {id:60, home:'Japan',            away:'Sweden',         date:'2026-06-26'},
  {id:61, home:'New Zealand',      away:'Belgium',        date:'2026-06-27'},
  {id:62, home:'Egypt',            away:'Iran',           date:'2026-06-27'},
  {id:63, home:'Cape Verde',       away:'Saudi Arabia',   date:'2026-06-27'},
  {id:64, home:'Uruguay',          away:'Spain',          date:'2026-06-27'},
  {id:65, home:'Norway',           away:'France',         date:'2026-06-26'},
  {id:66, home:'Senegal',          away:'Iraq',           date:'2026-06-26'},
  {id:67, home:'Algeria',          away:'Austria',        date:'2026-06-28'},
  {id:68, home:'Jordan',           away:'Argentina',      date:'2026-06-28'},
  {id:69, home:'Colombia',         away:'Portugal',       date:'2026-06-28'},
  {id:70, home:'DR Congo',         away:'Uzbekistan',     date:'2026-06-28'},
  {id:71, home:'Panama',           away:'England',        date:'2026-06-27'},
  {id:72, home:'Croatia',          away:'Ghana',          date:'2026-06-27'},
];

// Build lookup: "HomeTeam|AwayTeam" → fixture id (for matching ESPN data)
const FIXTURE_LOOKUP = {};
for (const g of GROUP_GAMES) {
  FIXTURE_LOOKUP[`${g.home}|${g.away}`] = g.id;
}

// ── Shared state builder ─────────────────────────────────────────────────────
function buildStatePayload() {
  // Aggregate predictions by user name
  const gPredRows  = stmts.getAllGPreds.all();
  const koPredRows = stmts.getAllKOPreds.all();
  const gResRows   = stmts.getAllGResults.all();
  const koResRows  = stmts.getAllKOResults.all();

  // predictions: { name: { avatar, gPreds: {gameId:[h,a]}, kPreds: {matchId:{...}} } }
  const predictions = {};
  for (const row of gPredRows) {
    if (!predictions[row.name]) predictions[row.name] = { avatar: row.avatar, gPreds: {}, kPreds: {} };
    predictions[row.name].gPreds[row.game_id] = [row.home_score, row.away_score];
  }
  for (const row of koPredRows) {
    if (!predictions[row.name]) predictions[row.name] = { avatar: '', gPreds: {}, kPreds: {} };
    predictions[row.name].kPreds[row.match_id] = {
      home: row.home, away: row.away,
      homeScore: row.home_score, awayScore: row.away_score,
      penWinner: row.pen_winner || '',
    };
  }

  // results: { gResults: {gameId:[h,a]}, kResults: {matchId:{...}} }
  const gResults = {};
  for (const row of gResRows) gResults[row.game_id] = [row.home_score, row.away_score];

  const kResults = {};
  for (const row of koResRows) {
    kResults[row.match_id] = {
      homeScore: row.home_score, awayScore: row.away_score, penWinner: row.pen_winner || '',
    };
  }

  // Settings
  const settingRows = stmts.getAllSettings.all();
  const settings = {};
  for (const r of settingRows) settings[r.key] = r.value;

  // Re-bracket (admin-set R32 matchups)
  const reBracketRows = stmts.getAllReBracket.all();
  const reBracket = {};
  for (const r of reBracketRows) reBracket[r.match_id] = { home: r.home, away: r.away };

  // Re-picks (all users)
  const rePickRows = stmts.getAllRePicks.all();
  const rePicks = {};
  for (const r of rePickRows) {
    if (!rePicks[r.name]) rePicks[r.name] = {};
    rePicks[r.name][r.match_id] = r.winner;
  }

  return { predictions, results: { gResults, kResults }, settings, reBracket, rePicks };
}

// ── WebSocket broadcast ──────────────────────────────────────────────────────
const wss = new WebSocketServer({ noServer: true });
const wsClients = new Set();

wss.on('connection', (ws) => {
  wsClients.add(ws);
  // Send current state immediately on connect
  ws.send(JSON.stringify({ type: 'state', data: buildStatePayload() }));
  ws.on('close', () => wsClients.delete(ws));
  ws.on('error', () => wsClients.delete(ws));
});

function broadcast(msg) {
  const payload = JSON.stringify(msg);
  for (const ws of wsClients) {
    if (ws.readyState === 1 /* OPEN */) ws.send(payload);
  }
}

function broadcastState() {
  broadcast({ type: 'state', data: buildStatePayload() });
}

// Debounce broadcasts — accumulate rapid changes and send one update
let _broadcastTimer = null;
function scheduleBroadcast() {
  clearTimeout(_broadcastTimer);
  _broadcastTimer = setTimeout(broadcastState, 200);
}

// ── ESPN polling ─────────────────────────────────────────────────────────────
// Strategy: poll once per minute as a baseline; switch to 30s when live games
// are detected; skip entirely if the current date is outside the group stage.

const TOURNAMENT_START = new Date('2026-06-11T00:00:00Z');
const TOURNAMENT_END   = new Date('2026-07-20T00:00:00Z');

let _espnLiveGamesDetected = false;
let _espnPollTimer = null;

async function pollESPN() {
  const now = new Date();
  if (now < TOURNAMENT_START || now > TOURNAMENT_END) {
    // Outside tournament window — poll once per day just to stay ready
    _espnPollTimer = setTimeout(pollESPN, 24 * 60 * 60 * 1000);
    return;
  }

  // Query today ± 1 day to catch late-night / timezone-edge games
  const dates = [-1, 0, 1].map(delta => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10).replace(/-/g, '');
  });
  const dateRange = `${dates[0]}-${dates[2]}`;
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${dateRange}&limit=100`;

  let hasLive = false;
  let changed  = false;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!resp.ok) throw new Error(`ESPN HTTP ${resp.status}`);
    const data = await resp.json();

    for (const event of (data.events || [])) {
      const status = event.status?.type?.state;
      const comps  = event.competitions?.[0];
      if (!comps) continue;

      if (status === 'in') hasLive = true;
      if (status !== 'post') continue; // only write finished games

      const competitors = comps.competitors || [];
      let homeComp = competitors.find(c => c.homeAway === 'home');
      let awayComp = competitors.find(c => c.homeAway === 'away');
      if (!homeComp || !awayComp) continue;

      const homeName = mapTeamName(homeComp.team?.displayName || '');
      const awayName = mapTeamName(awayComp.team?.displayName || '');
      const homeScore = parseInt(homeComp.score ?? '-1', 10);
      const awayScore = parseInt(awayComp.score ?? '-1', 10);
      if (homeScore < 0 || awayScore < 0 || !homeName || !awayName) continue;

      // Match to our fixture list
      const fixtureId = FIXTURE_LOOKUP[`${homeName}|${awayName}`]
                     || FIXTURE_LOOKUP[`${awayName}|${homeName}`];
      if (!fixtureId) continue; // KO games not handled automatically (complex bracket)

      const existing = db.prepare('SELECT home_score, away_score FROM group_results WHERE game_id = ?').get(fixtureId);
      const isFlipped = !FIXTURE_LOOKUP[`${homeName}|${awayName}`]; // away team listed as home in our data

      const dbHome = isFlipped ? awayScore : homeScore;
      const dbAway = isFlipped ? homeScore : awayScore;

      if (!existing || existing.home_score !== dbHome || existing.away_score !== dbAway) {
        stmts.upsertGResult.run(fixtureId, dbHome, dbAway, 'espn');
        console.log(`ESPN: Game ${fixtureId} (${homeName} v ${awayName}) → ${dbHome}–${dbAway}`);
        changed = true;
      }
    }
  } catch (err) {
    console.warn('ESPN poll error:', err.message);
  }

  if (changed) scheduleBroadcast();

  // Reschedule: 30s during live window, 60s otherwise
  _espnLiveGamesDetected = hasLive;
  const interval = hasLive ? 30_000 : 60_000;
  _espnPollTimer = setTimeout(pollESPN, interval);
}

// ── Express app ──────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '1mb' }));

// Serve client.html at root
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'client.html');
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send('client.html not found — run the build script first.');
  }
  res.sendFile(htmlPath);
});

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, clients: wsClients.size }));

// ── Auth endpoints ───────────────────────────────────────────────────────────

// POST /api/auth — login or register
// Body: { name, pin }  → { token, name, avatar, isAdmin, isNew }
app.post('/api/auth', async (req, res) => {
  const { name, pin } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!pin || typeof pin !== 'string' || !/^\d{4,8}$/.test(pin)) {
    return res.status(400).json({ error: 'PIN must be 4–8 digits' });
  }
  const trimmedName = name.trim().slice(0, 40);

  const existing = stmts.getUser.get(trimmedName);
  if (existing) {
    // Login — verify PIN
    const ok = await bcrypt.compare(pin, existing.pin_hash);
    if (!ok) return res.status(401).json({ error: 'Wrong PIN' });
    const token = genToken();
    stmts.createSession.run(token, existing.id, existing.name, existing.is_admin);
    return res.json({ token, name: existing.name, avatar: existing.avatar, isAdmin: !!existing.is_admin, isNew: false });
  } else {
    // Register
    const hash = await bcrypt.hash(pin, SALT_ROUNDS);
    let userId;
    try {
      const result = stmts.createUser.run(trimmedName, hash);
      userId = result.lastInsertRowid;
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Name already taken — choose another or check your PIN' });
      }
      throw err;
    }
    // First ever user auto-gets admin (or if ADMIN_PIN matches)
    const isAdmin = (db.prepare('SELECT COUNT(*) as n FROM users').get().n === 1) || (pin === ADMIN_PIN);
    if (isAdmin) db.prepare('UPDATE users SET is_admin = 1 WHERE id = ?').run(userId);

    const token = genToken();
    stmts.createSession.run(token, userId, trimmedName, isAdmin ? 1 : 0);
    return res.status(201).json({ token, name: trimmedName, avatar: '', isAdmin, isNew: true });
  }
});

// POST /api/auth/logout — invalidate token
app.post('/api/auth/logout', requireAuth, (req, res) => {
  const auth = req.headers.authorization;
  stmts.deleteSession.run(auth.slice(7));
  res.json({ ok: true });
});

// ── State endpoint ───────────────────────────────────────────────────────────

// GET /api/state — return full shared state (no auth needed — read-only)
app.get('/api/state', (req, res) => {
  res.json(buildStatePayload());
});

// ── Prediction endpoints ─────────────────────────────────────────────────────

// PUT /api/predictions — save my group + KO predictions
// Body: { gPreds: {gameId:[h,a]}, kPreds: {matchId:{...}}, avatar? }
app.put('/api/predictions', requireAuth, (req, res) => {
  const { userId } = req.session;
  const { gPreds = {}, kPreds = {}, avatar } = req.body;

  db.exec('BEGIN');
  try {
    // Group predictions
    for (const [gameIdStr, scores] of Object.entries(gPreds)) {
      const gameId = parseInt(gameIdStr, 10);
      if (!Number.isInteger(gameId) || gameId < 1 || gameId > 72) continue;
      if (!Array.isArray(scores) || scores.length < 2) continue;
      const h = parseInt(scores[0], 10), a = parseInt(scores[1], 10);
      if (!Number.isFinite(h) || !Number.isFinite(a) || h < 0 || a < 0 || h > 30 || a > 30) continue;
      stmts.upsertGPred.run(userId, gameId, h, a);
    }
    // KO predictions
    for (const [matchId, pred] of Object.entries(kPreds)) {
      if (typeof matchId !== 'string' || !pred || typeof pred !== 'object') continue;
      const hs = pred.homeScore != null ? parseInt(pred.homeScore, 10) : null;
      const as = pred.awayScore != null ? parseInt(pred.awayScore, 10) : null;
      stmts.upsertKOPred.run(
        userId, matchId,
        pred.home || null, pred.away || null,
        hs, as, pred.penWinner || null
      );
    }
    // Update avatar if provided
    if (typeof avatar === 'string') {
      const safeAvatar = avatar.startsWith('data:image/') ? avatar : '';
      stmts.updateAvatar.run(safeAvatar, userId);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  scheduleBroadcast();
  res.json({ ok: true });
});

// ── Admin / results endpoints ────────────────────────────────────────────────

// PUT /api/results/group/:gameId — manually set a group result (admin)
app.put('/api/results/group/:gameId', requireAdmin, (req, res) => {
  const gameId = parseInt(req.params.gameId, 10);
  if (gameId < 1 || gameId > 72) return res.status(400).json({ error: 'Invalid game ID' });
  const { homeScore, awayScore } = req.body;
  const h = parseInt(homeScore, 10), a = parseInt(awayScore, 10);
  if (!Number.isFinite(h) || !Number.isFinite(a)) return res.status(400).json({ error: 'Invalid scores' });
  stmts.upsertGResult.run(gameId, h, a, 'manual');
  scheduleBroadcast();
  res.json({ ok: true });
});

// DELETE /api/results/group/:gameId — remove a group result (admin)
app.delete('/api/results/group/:gameId', requireAdmin, (req, res) => {
  const gameId = parseInt(req.params.gameId, 10);
  stmts.deleteGResult.run(gameId);
  scheduleBroadcast();
  res.json({ ok: true });
});

// PUT /api/results/ko/:matchId — manually set a KO result (admin)
app.put('/api/results/ko/:matchId', requireAdmin, (req, res) => {
  const { matchId } = req.params;
  const { homeScore, awayScore, penWinner } = req.body;
  const h = homeScore != null ? parseInt(homeScore, 10) : null;
  const a = awayScore != null ? parseInt(awayScore, 10) : null;
  stmts.upsertKOResult.run(matchId, h, a, penWinner || null, 'manual');
  scheduleBroadcast();
  res.json({ ok: true });
});

// DELETE /api/results/ko/:matchId — remove a KO result (admin)
app.delete('/api/results/ko/:matchId', requireAdmin, (req, res) => {
  const { matchId } = req.params;
  stmts.deleteKOResult.run(matchId);
  scheduleBroadcast();
  res.json({ ok: true });
});

// GET /api/admin/espn-status — admin only: check ESPN poller status
app.get('/api/admin/espn-status', requireAdmin, (req, res) => {
  const gResults = stmts.getAllGResults.all();
  res.json({
    liveGamesDetected: _espnLiveGamesDetected,
    resultCount: gResults.length,
    results: gResults,
  });
});

// ── Settings endpoints ───────────────────────────────────────────────────────

// PUT /api/settings/:key — admin only (e.g. repicker_open)
app.put('/api/settings/:key', requireAdmin, (req, res) => {
  const { key } = req.params;
  if (!/^[a-z_]+$/.test(key)) return res.status(400).json({ error: 'Invalid key' });
  const { value } = req.body;
  stmts.setSetting.run(key, String(value ?? ''));
  scheduleBroadcast();
  res.json({ ok: true });
});

// ── Repicker endpoints ───────────────────────────────────────────────────────

// PUT /api/re-bracket — admin only, set a R32 matchup (home/away teams)
app.put('/api/re-bracket', requireAdmin, (req, res) => {
  const { matchId, home, away } = req.body;
  if (typeof matchId !== 'string' || !matchId) return res.status(400).json({ error: 'matchId required' });
  stmts.upsertReBracket.run(matchId, String(home || ''), String(away || ''));
  scheduleBroadcast();
  res.json({ ok: true });
});

// PUT /api/re-picks — save authenticated user's Repicker picks
// Body: { picks: { matchId: winner } }  (winner='' to delete)
app.put('/api/re-picks', requireAuth, (req, res) => {
  const { userId } = req.session;
  const { picks } = req.body;
  if (!picks || typeof picks !== 'object') return res.status(400).json({ error: 'picks required' });
  for (const [matchId, winner] of Object.entries(picks)) {
    if (typeof matchId !== 'string' || !matchId) continue;
    if (!winner) {
      stmts.deleteRePick.run(userId, matchId);
    } else {
      stmts.upsertRePick.run(userId, matchId, String(winner));
    }
  }
  scheduleBroadcast();
  res.json({ ok: true });
});

// ── HTTP server + WebSocket upgrade ─────────────────────────────────────────
const server = http.createServer(app);

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

server.listen(PORT, () => {
  console.log(`WC2026 Predictor server running on port ${PORT}`);
  console.log(`DB: ${DB_PATH}`);
  // Start ESPN polling
  pollESPN();
});

process.on('SIGTERM', () => {
  clearTimeout(_espnPollTimer);
  clearTimeout(_broadcastTimer);
  db.close();
  server.close();
});
