import { useState } from 'react'
import './ImportSong.css'

function ImportSong({ onSongAdded }) {
  // whether the import modal is open
  const [isOpen, setIsOpen] = useState(false)
  // form field state
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  // file state
  const [audioFile, setAudioFile] = useState(null)
  const [albumArtFile, setAlbumArtFile] = useState(null)
  // ui state
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!audioFile) {
      setMessage({ type: 'error', text: 'Audio file is required' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    // build form data to send to backend
    const formData = new FormData()
    formData.append('title', title)
    formData.append('artist', artist)
    formData.append('album', album)
    formData.append('audio', audioFile)
    if (albumArtFile) formData.append('albumArt', albumArtFile)

    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error })
        return
      }

      // clear form on success
      setTitle('')
      setArtist('')
      setAlbum('')
      setAudioFile(null)
      setAlbumArtFile(null)

      // reset file inputs manually since React doesn't control them
      document.getElementById('audio-input').value = ''
      document.getElementById('art-input').value = ''

      setMessage({ type: 'success', text: `"${data.title}" added successfully!` })

      // notify parent so it can refresh the song list
      if (onSongAdded) onSongAdded(data)

    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong, please try again' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* import button fixed in bottom right corner */}
      <button className="import-trigger" onClick={() => setIsOpen(true)}>
        +
      </button>

      {/* modal overlay — only renders when open */}
      {isOpen && (
        <div className="import-overlay" onClick={(e) => {
          // close if user clicks the backdrop, not the modal itself
          if (e.target === e.currentTarget) setIsOpen(false)
        }}>
          <div className="import-modal">
            <div className="import-modal-header">
              <h2>Import Song</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Song title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Artist</label>
                <input
                  type="text"
                  placeholder="Artist name"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Album</label>
                <input
                  type="text"
                  placeholder="Album name"
                  value={album}
                  onChange={e => setAlbum(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Audio File <span className="required">*</span></label>
                <input
                  id="audio-input"
                  type="file"
                  accept=".mp3,.wav,.flac,.m4a"
                  onChange={e => setAudioFile(e.target.files[0])}
                />
              </div>

              <div className="form-group">
                <label>Album Art <span className="optional">(optional)</span></label>
                <input
                  id="art-input"
                  type="file"
                  accept="image/*"
                  onChange={e => setAlbumArtFile(e.target.files[0])}
                />
              </div>

              {message && (
                <p className={`message ${message.type}`}>{message.text}</p>
              )}

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Add Song'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ImportSong