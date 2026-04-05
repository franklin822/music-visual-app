import './SongList.css'

function SongList({ songs, currentSong, onSongSelect }) {
  return (
    <div className="song-list">
      <h3>Playlist</h3>
      <div className="songs">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
            onClick={() => onSongSelect(song)}
          >
            <img src={song.albumArt ? `/uploads/art/${song.albumArt}` : 'https://dummyimage.com/400x400/1e293b/1e293b'} alt={song.album} />
            <div className="song-details">
              <p className="song-title">{song.title}</p>
              <p className="song-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SongList