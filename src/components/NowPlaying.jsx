import { useState, useEffect, useRef } from 'react'
import './NowPlaying.css'

function NowPlaying({ song, onPrevious, onNext, onSongEnd, shouldAutoPlay, onAutoPlayHandled, onPause, isShuffleOn, onToggleShuffle, hasPrevious, hasNext }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  // handle song changes
  useEffect(() => {
    setProgress(0)
    setCurrentTime(0)

    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [song])

  // handle auto-play
  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        onAutoPlayHandled()
      }).catch(error => {
        console.error("Auto-play failed:", error)
        onAutoPlayHandled()
      })
    }
  }, [shouldAutoPlay, song, onAutoPlayHandled])

  // audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
      if (onSongEnd) {
        onSongEnd()
      }
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
    }
  }, [onSongEnd])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      onPause()
    } else {
      audio.play().catch(error => {
        console.error("Playback failed:", error)
      })
    }
  }

  const handleProgressClick = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(x / rect.width, 1))
    const newTime = percentage * audio.duration

    audio.currentTime = newTime
    setProgress(percentage * 100)
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="now-playing">
      <div className="album-art">
        <img
          src={song.albumArt || 'https://via.placeholder.com/400x400/4a5568/ffffff?text=No+Cover'}
          alt={`${song.album} cover`}
        />
      </div>
      <div className="song-info">
        <h2>{song.title}</h2>
        <p>{song.artist}</p>
        <p className="album-name">{song.album}</p>
      </div>

      <audio ref={audioRef} src={song.audioUrl} />

      <div className="player-controls">
        <button
          onClick={onToggleShuffle}
          className={`control-button shuffle-button ${isShuffleOn ? 'active' : ''}`}
          title={isShuffleOn ? "Shuffle On" : "Shuffle Off"}
        >
          🔀
        </button>
        <button
          onClick={onPrevious}
          className="control-button"
          title="Previous"
        >
          ⏮
        </button>
        <button onClick={togglePlayPause} className="play-button">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={onNext}
          className="control-button"
          title="Next"
        >
          ⏭
        </button>
        <button
          className="control-button placeholder-button"
          title="Coming soon"
          disabled
        >
          ⋯
        </button>
      </div>

      <div className="enhanced-progress">
        <div className="time-display">
          <span className="time-current">{formatTime(currentTime)}</span>
          <span className="time-duration">{formatTime(duration)}</span>
        </div>

        <div className="progress-container">
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <div className="progress-glow"></div>
            </div>
            <div className="progress-handle" style={{ left: `${progress}%` }}></div>
          </div>
          <div className="progress-ticks">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="tick" style={{ left: `${i * 10}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NowPlaying