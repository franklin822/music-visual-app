const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'music.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Unknown Title',
    artist TEXT DEFAULT 'Unknown Artist',
    album TEXT DEFAULT 'Unknown Album',
    audio_url TEXT NOT NULL,
    album_art_url TEXT,
    play_count INTEGER DEFAULT 0,
    is_favorite INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`)

module.exports = db