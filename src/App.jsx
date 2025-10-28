import { useState } from 'react'
import './App.css'
import NowPlaying from './components/NowPlaying'
import SongList from './components/SongList'
import Queue from './components/Queue'
import { songs } from './data/mockdata'

function App() {
  const [queue, setQueue] = useState(songs.map((_, index) => index))
  const [queuePosition, setQueuePosition] = useState(0)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
  const [isShuffleOn, setIsShuffleOn] = useState(false)

  const currentSongIndex = queue[queuePosition]
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

  const handleSongEnd = () => {
    if (queuePosition < queue.length - 1) {
      setQueuePosition(queuePosition + 1)
      setShouldAutoPlay(true)
    } else {
      setShouldAutoPlay(false)
    }
  }

  // toggles shuffle mode
  const toggleShuffle = () => {
    const currentSongIdx = queue[queuePosition]

    if (!isShuffleOn) {
      const otherSongs = songs
        .map((_, index) => index)
        .filter(index => index !== currentSongIdx)
      const shuffledOthers = shuffleArray(otherSongs)

      const newQueue = [
        ...shuffledOthers.slice(0, queuePosition),
        currentSongIdx,
        ...shuffledOthers.slice(queuePosition)
      ]
      setQueue(newQueue)
    } else {
      const originalQueue = songs.map((_, index) => index)
      setQueue(originalQueue)
      setQueuePosition(currentSongIdx)
    }

    setIsShuffleOn(!isShuffleOn)
  }

  return (
    <div className="app">
      <div className="container">
        <SongList
          songs={songs}
          currentSong={currentSong}
          onSongSelect={handleSongSelect}
        />
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
        <Queue
          queue={queue}
          songs={songs}
          queuePosition={queuePosition}
        />
      </div>
    </div>
  )
}

export default App