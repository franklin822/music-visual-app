import { useState, useEffect, useRef } from 'react'
import './NowPlaying.css'

function NowPlaying({ song, onPrevious, onNext, onSongEnd, shouldAutoPlay, onAutoPlayHandled, onPause, isShuffleOn, onToggleShuffle, hasPrevious, hasNext }) {
  // whether the song is currently playing
  const [isPlaying, setIsPlaying] = useState(false) 
  // tracks how far in the song we are (0%-100%)
  const [progress, setProgress] = useState(0)
  // sets the time of the song when a user clicks or song changes (in seconds)
  const [currentTime, setCurrentTime] = useState(0)
  // length of the song (in seconds)
  const [duration, setDuration] = useState(0)
  // holds reference to actual audio element in HTML
  const audioRef = useRef(null)

  // when song changes, reset progress and current time
  // loads new audio file
  useEffect(() => {
    setProgress(0)
    setCurrentTime(0)

    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [song])

  // handles intial auto-play when song changes
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

  // sets up listeners for audio element events and updates song info
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // update song progress
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }

    // when metadata is loaded, set duration
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    // logic for when song ends
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

    // track and update song progress 
    audio.addEventListener('timeupdate', updateProgress)
    // song metadata loaded (duration etc)
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

  // handles play/pause button click
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

  // handles interaction with progress bar
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

  // converts time in seconds to M:SS format for display
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
          src={song.albumArt || 'https://dummyimage.com/400x400/1e293b/1e293b'}
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
          disabled={!hasPrevious}
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
          disabled={!hasNext}
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