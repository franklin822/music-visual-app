# Music Visualizer App

Ever wanted to play your personal music collection (unreleased tracks, demos, local files, or any other audio file) with a beautiful, customizable interface that Spotify just doesn't offer?
Or wanted to customize every aspect of your playlists, from song titles to the background?

**The Problem:** Spotify's local files feature doesn't handle album covers well, creates a clunky experience, and doesn't give you the aesthetic control you want for your favorite unreleased songs and rare tracks.

**The Solution:** A dedicated music player designed as a stunning idle screen display. Play your carefully curated collection with proper album art, smooth controls, and a visual experience that actually does your music justice.

Perfect for:
- 🎵 Unreleased songs and demos from your favorite artists
- 🎤 Song covers, instrumentals, or remixes not available on Spotify
- 💿 Personal music collections that deserve better than generic local file players
- 🖼️ Custom album artwork that shows exactly what you want
- 🎨 Creating the perfect ambiance while working, studying, or relaxing
- 📺 Secondary monitor displays that look amazing

**Simply add your music files, customize the visuals, and enjoy your collection the way it was meant to be experienced.**

## 🎵 Features

- **Visual Display**: Aesthetic interface with smooth animations and gradients
- **Playback Controls**: Play, pause, skip forward/backward through your playlist
- **Interactive Progress Bar**: Click to jump to any point in the song and view progress
- **Auto-Play**: Automatically play the next song when the current one ends
- **Queue Display**: See your full playlist with album art and song details
- **Customizable**: Customize your playlists by adding songs with your own images and titles 

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
   ```bash
   cd path/to/music-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your music files**
   - If there is no music folder create one in `music-viz-app/public/music`
   - Place your music files in the `public/music/` folder
   - Place album cover images in `public/music/albumcovers/` folder

4. **Update the song list**
   - Open `src/data/mockdata.js`
   - Update the `audioUrl` and `albumArt` variables with your music file paths and information:
   ```javascript
   {
     id: 1,
     title: "Your Song Title",
     artist: "Artist Name",
     album: "Album Name",
     audioUrl: "/music/your-song.mp3",
     albumArt: "/music/albumcovers/your-cover.jpg"
   }
   ```
   - Also update the song title, artist name, and album to your choosing (OPTIONAL)

### Running the App

**To start the development server:**
```bash
npm run dev
```

The app will open at `http://localhost:5173/` (or another port if 5173 is in use)

**To stop the server:**
Press `Ctrl + C` in the terminal

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 📁 Project Structure

```
music-visualizer/
├── public/
│   └── music/
│       ├── albumcovers/     # Album cover images
│       └── *.mp3           # Your music files
├── src/
│   ├── components/
│   │   ├── NowPlaying.jsx  # Main player component
│   │   ├── NowPlaying.css
│   │   ├── SongList.jsx    # Playlist component
│   │   └── SongList.css
│   ├── data/
│   │   └── mockdata.js     # Song data array
│   ├── App.jsx             # Main app component
│   ├── App.css
│   ├── main.jsx            # Entry point
│   └── index.css
├── package.json
└── README.md
```

### Supported Audio/Picture Formats
- MP3 (`.mp3`)
- WAV (`.wav`)
- OGG (`.ogg`)
- M4A (`.m4a`)
- JPG (`.jpg`)
- PNG (`.png`)

## 🎯 Use Cases

- **Workspace Ambiance**: Display on a secondary monitor while working
- **Audio File Compatability**: Works with any audio file, not just music
- **Study Sessions**: Visual accompaniment to your study music
- **Parties**: Show what's playing at your gathering
- **Relaxation**: Create a calming atmosphere with music and visuals

## 🛠️ Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **HTML5 Audio API** - Music playback
- **CSS3** - Styling and animations
- **Node.js** - Runtime environment

## 🐛 Troubleshooting

**Songs won't play:**
- Check that audio file paths in `mockdata.js` match your actual file locations
- Ensure files are in the `public/` folder (not `src/`)
- Verify audio files aren't corrupted

**Album art not showing:**
- Confirm image paths are correct
- Check that images are in a web-compatible format (JPG, PNG)

## 🚧 Possible Future Features

- [ ] AI-powered playlist generation based on mood/vibe
- [ ] Song recommendations similar to currently playing track
- [ ] Volume control
- [ ] Shuffle and repeat modes
- [ ] Visualizer animations that react to audio
- [ ] User-customizable themes
- [ ] Create multiple playlists

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and customize it to your needs!

---
## 🪪 Contact

If you have any comments, suggestions, or are seeking help, reach out at:
fxc0165@gmail.com

**Enjoy your music! 🎧**