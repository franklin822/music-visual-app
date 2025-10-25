import { useState } from 'react'
import './App.css'
import NowPlaying from './components/NowPlaying'
import SongList from './components/SongList'
import { songs } from './data/mockdata'

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const currentSong = songs[currentSongIndex]

  const handleSongSelect = (song) => {
    const index = songs.findIndex(s => s.id === song.id)
    setCurrentSongIndex(index)
  }

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => {
      if (prevIndex === 0) {
        return songs.length - 1
      }
      return prevIndex - 1
    })
  }

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => {
      if (prevIndex === songs.length - 1) {
        return 0
      }
      return prevIndex + 1
    })
  }

  return (
    <div className="app">
      <div className="container">
        <NowPlaying 
          song={currentSong} 
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentSongIndex > 0}
          hasNext={currentSongIndex < songs.length - 1}
        />
        <SongList 
          songs={songs} 
          currentSong={currentSong} 
          onSongSelect={handleSongSelect} 
        />
      </div>
    </div>
  )
}

export default App