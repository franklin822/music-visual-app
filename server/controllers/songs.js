const db = require('../data/database')

// converts snake_case db columns to camelCase for the frontend
const formatSong = (song) => ({
  id: song.id,
  title: song.title,
  artist: song.artist,
  album: song.album,
  audioUrl: song.audio_url,
  albumArt: song.album_art_url,
  playCount: song.play_count,
  isFavorite: song.is_favorite,
  createdAt: song.created_at
})

const getAllSongs = (req, res) => {
  const songs = db.prepare('SELECT * FROM songs ORDER BY created_at DESC').all()
  res.json(songs.map(formatSong))
}

const addSong = (req, res) => {
  const title = req.body.title || 'Unknown Title'
  const artist = req.body.artist || 'Unknown Artist'
  const album = req.body.album || 'Unknown Album'
  const audio_url = req.files?.audio?.[0]?.filename
  const album_art_url = req.files?.albumArt?.[0]?.filename

  if (!audio_url) {
    return res.status(400).json({ error: 'Audio file is required' })
  }

  const result = db.prepare(`
    INSERT INTO songs (title, artist, album, audio_url, album_art_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, artist, album, audio_url, album_art_url || null)

  const newSong = db.prepare('SELECT * FROM songs WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(formatSong(newSong))
}

module.exports = { getAllSongs, addSong }