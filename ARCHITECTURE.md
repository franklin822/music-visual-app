# Music Visual App - Architecture Documentation (WIP)

- Provides breakdown of each component of Music Visual App
- Explanation each file, including how its functions and variables work with the app altogether


## App.jsx - Root Component

### Purpose

App.jsx is the main controller that manages all application state and coordinates the three child components (SongList, NowPlaying, Queue). It handles the business logic for playback, navigation, and shuffle functionality.


## State Variables

### `queue` - Array of Song Indices
```javascript
const [queue, setQueue] = useState(songs.map((_, index) => index))
```
Tracks the order songs will play in. Initially `[0, 1, 2, 3, 4...]`. When shuffled, becomes randomized like `[3, 1, 4, 0, 2]`.

### `queuePosition` - Current Position
```javascript
const [queuePosition, setQueuePosition] = useState(0)
```
Your current position in the queue. Starts at 0 and changes accordingly when user clicks next/previous or selects a song.

### `shouldAutoPlay` - Auto-Play Flag
```javascript
const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
```
Signals NowPlaying to start playing automatically. Set to `true` when navigating or selecting songs, reset to `false` after handled.

### `isShuffleOn` - Shuffle Status
```javascript
const [isShuffleOn, setIsShuffleOn] = useState(false)
```
Tracks whether shuffle mode is active. Used for button styling and shuffle logic.


## Derived Values

### `currentSongIndex`
```javascript
const currentSongIndex = queue[queuePosition]
```
Gets the songID at index queuePosition. Example: if `queue = [3, 5, 4]` and `queuePosition = 1`, then `currentSongIndex = 5`. However, in my own mockdata, the index and songID are the same

### `currentSong`
```javascript
const currentSong = songs[currentSongIndex]
```
Gets the entire song object (title, artist, audioUrl, etc.) for the currently playing song.


## Functions

### `shuffleArray(array)`
Randomizes array order using Fisher-Yates algorithm. Returns new shuffled array without modifying original.

### `handleSongSelect(song)`
When user clicks a song from playlist:
1. Finds song's index in songs array
2. Finds where that index appears in current queue
3. Jumps to that position (`setQueuePosition`)
4. Starts playback (`setShouldAutoPlay(true)`)

### `handlePrevious()`
Moves to previous song in queue. Decrements `queuePosition` by 1 if not at beginning.

### `handleNext()`
Moves to next song in queue. Increments `queuePosition` by 1 if not at end.

### `handleSongEnd()`
Called when song finishes playing. Automatically advances to next song if available, otherwise stops playback.

### `toggleShuffle()`
Toggles shuffle mode on/off:
- **Turning ON:** Randomizes queue while keeping current song at same position
- **Turning OFF:** Resets queue to sequential order `[0, 1, 2, 3...]` and adjusts position


## Component Props

### SongList
- `songs`: All available songs
- `currentSong`: Currently playing (for highlighting)
- `onSongSelect`: Callback for song clicks

### NowPlaying
- `song`: Current song object
- `onNext`, `onPrevious`: Navigation callbacks
- `onSongEnd`: Auto-advance callback
- `shouldAutoPlay`: Signal to start playback
- `onAutoPlayHandled`: Reset auto-play flag
- `isShuffleOn`, `onToggleShuffle`: Shuffle state and toggle
- `hasPrevious`, `hasNext`: Enable/disable buttons

### Queue
- `queue`: Song indices in play order
- `songs`: All songs (for looking up details)
- `queuePosition`: Current position (to show upcoming)

---

## Key Concepts

**State Ownership:** App.jsx owns all state. Children receive data as props and communicate back via callbacks.

**Data Flow:** State flows down to children as props. Events flow up via callback functions. App updates state, React re-renders everything.

**Why Two Variables for Position:**
- `queue` = WHAT songs and in WHAT order (the playlist)
- `queuePosition` = WHERE you are in that playlist (the playhead)