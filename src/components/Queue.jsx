import './Queue.css'

function Queue({ queue, songs, queuePosition, onSongSelect }) {
  const upcomingQueue = queue.slice(queuePosition)

  return (
    <div className="queue">
      <h3>Up Next</h3>
      <div className="queue-items">
        {upcomingQueue.map((songIndex, idx) => {
          const song = songs[songIndex]
          const isCurrentSong = idx === 0

          return (
            <div
              key={`${songIndex}-${idx}`}
              className={`queue-item ${isCurrentSong ? 'current' : ''}`}
              onClick={() => !isCurrentSong && onSongSelect(queuePosition + idx)}
              style={{ cursor: isCurrentSong ? 'default' : 'pointer' }}
            >
              <div className="queue-position">
                {isCurrentSong ? '▶' : idx}
              </div>
              <img src={song.albumArt} alt={song.album} />
              <div className="queue-song-details">
                <p className="queue-song-title">{song.title}</p>
                <p className="queue-song-artist">{song.artist}</p>
              </div>
            </div>
          )
        })}
        {upcomingQueue.length === 0 && (
          <p className="queue-empty">Queue is empty</p>
        )}
      </div>
    </div>
  )
}

export default Queue