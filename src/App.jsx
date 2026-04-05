import { useState, useEffect } from 'react'
import './App.css'
import NowPlaying from './components/NowPlaying'
import SongList from './components/SongList'
import Queue from './components/Queue'
import ImportSong from './components/ImportSong'

function App() {
  // fetch songs from the backend API
  const [songs, setSongs] = useState([])
  // whether the songs are still loading
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => {
        setSongs(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setIsLoading(false)
      })
  }, [])

  // array that holds the order of song indices to be played
  const [queue, setQueue] = useState([])
  // current position in the queue
  const [queuePosition, setQueuePosition] = useState(0)
  // whether the current song should auto-play
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
  // whether shuffle mode is on
  const [isShuffleOn, setIsShuffleOn] = useState(false)

  // update queue when songs load from API
  useEffect(() => {
    if (songs.length > 0) {
      setQueue(songs.map((_, index) => index))
    }
  }, [songs])

  // current song based on queue position
  const currentSongIndex = queue[queuePosition]
  // information of the current song
  const currentSong = songs[currentSongIndex]

  // shuffle array for randomized queue
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // handles when a song is selected from playlist
  const handleSongSelect = (song) => {
    const index = songs.findIndex(s => s.id === song.id)
    const positionInQueue = queue.findIndex(queueIndex => queueIndex === index)
    setQueuePosition(positionInQueue)
    setShouldAutoPlay(true)
  }

  // handles logic for previous
  const handlePrevious = () => {
    if (queuePosition > 0) {
      setQueuePosition(queuePosition - 1)
      setShouldAutoPlay(true)
    }
  }

  // handles logic for next song
  const handleNext = () => {
    if (queuePosition < queue.length - 1) {
      setQueuePosition(queuePosition + 1)
      setShouldAutoPlay(true)
    }
  }

  // handles when a song ends, advances queue
  const handleSongEnd = () => {
    if (queuePosition < queue.length - 1) {
      setQueuePosition(queuePosition + 1)
      setShouldAutoPlay(true)
    } else {
      setShouldAutoPlay(false)
    }
  }

  // shuffles the array using Fisher-Yates algorithm
  const toggleShuffle = () => {
    const currentSongIdx = queue[queuePosition]

    // turning shuffle on
    if (!isShuffleOn) {
      // put current song first, then shuffle all other songs
      const otherSongs = songs
        .map((_, index) => index)
        .filter(index => index !== currentSongIdx)
      const shuffledOthers = shuffleArray(otherSongs)

      const newQueue = [currentSongIdx, ...shuffledOthers]
      setQueue(newQueue)
      setQueuePosition(0)  // reset
    // turning shuffle off
    } else {
      // display queue starting from current song
      const originalQueue = songs.map((_, index) => index)
      setQueue(originalQueue)
      setQueuePosition(currentSongIdx)
    }

    setIsShuffleOn(!isShuffleOn)
  }

  // handles when a song is selected from the queue
  const handleQueueSelect = (newPosition) => {
    setQueuePosition(newPosition)
    setShouldAutoPlay(true)
  }

  // handles when a new song is added, appends to songs without refetching
  const handleSongAdded = (newSong) => {
    setSongs(prev => {
      const updated = [newSong, ...prev]
      setQueue(updated.map((_, index) => index))
      return updated
    })
  }

  // show loading state while fetching
  if (isLoading) return (
    <div className="app">
      <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    </div>
  )

  // show import form if no songs in DB yet
  if (songs.length === 0) return (
    <div className="app">
      <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
        <h2>No songs yet</h2>
        <p>Use the import panel to add your first song</p>
        <ImportSong onSongAdded={handleSongAdded} />
      </div>
    </div>
  )

  return (
    <div className="app">
      <div className="container">
        <SongList
          songs={songs}
          currentSong={currentSong}
          onSongSelect={handleSongSelect}
        />
        {currentSong && (
          <NowPlaying
            song={currentSong}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSongEnd={handleSongEnd}
            shouldAutoPlay={shouldAutoPlay}
            onAutoPlayHandled={() => setShouldAutoPlay(false)}
            onPause={() => setShouldAutoPlay(false)}
            isShuffleOn={isShuffleOn}
            onToggleShuffle={toggleShuffle}
            hasPrevious={queuePosition > 0}
            hasNext={queuePosition < queue.length - 1}
          />
        )}
        <Queue
          queue={queue}
          songs={songs}
          queuePosition={queuePosition}
          onSongSelect={handleQueueSelect}
        />
        <ImportSong onSongAdded={handleSongAdded} />
      </div>
    </div>
  )
}

export default App