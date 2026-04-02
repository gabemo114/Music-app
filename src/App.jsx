import { useState, useRef, useEffect } from 'react'
import IntroAnimation from './components/IntroAnimation'
import BottomNav from './components/BottomNav'
import DiscoveryFeed from './pages/DiscoveryFeed'
import LibraryPage from './pages/LibraryPage'
import SongSheet from './components/SongSheet'
import MiniPlayer from './components/MiniPlayer'
import { streamUrl } from './lib/plex'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [activeTab, setActiveTab] = useState('discover')
  const [selectedSong, setSelectedSong] = useState(null)

  // Player state — lifted here so audio survives sheet open/close
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  // Horizontal swipe between tabs
  const touchStartX = useRef(null)
  const SWIPE_H_THRESHOLD = 80

  const handleTabSwipeStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTabSwipeEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_H_THRESHOLD) return
    if (delta < 0 && activeTab === 'discover') setActiveTab('library')
    if (delta > 0 && activeTab === 'library') setActiveTab('discover')
  }

  // When a song is selected (from feed, library, or sheet), start playing it
  function handleSongSelect(song) {
    setSelectedSong(song)
    if (song && song.streamKey) {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  // Load + play new track when currentSong changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong?.streamKey) return
    audio.src = streamUrl(currentSong.streamKey)
    audio.load()
    audio.play().catch(() => setIsPlaying(false))
  }, [currentSong?.id])

  // Sync play/pause state changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  function handlePlayPause() {
    if (!currentSong) return
    setIsPlaying(p => !p)
  }

  if (showIntro) return <IntroAnimation onDone={() => setShowIntro(false)} />

  const showMiniPlayer = currentSong && !selectedSong

  return (
    <div
      style={{ backgroundColor: '#09090b', color: '#fafafa', fontFamily: "'Lato', system-ui, sans-serif", height: '100dvh', overflow: 'hidden' }}
      onTouchStart={selectedSong ? undefined : handleTabSwipeStart}
      onTouchEnd={selectedSong ? undefined : handleTabSwipeEnd}
    >
      {/* Single audio element at root — never unmounted */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {activeTab === 'discover' ? (
        <DiscoveryFeed onSongSelect={handleSongSelect} />
      ) : (
        <LibraryPage onSongSelect={handleSongSelect} />
      )}

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      {showMiniPlayer && (
        <MiniPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onOpen={() => setSelectedSong(currentSong)}
        />
      )}

      <SongSheet
        song={selectedSong}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onSongSelect={handleSongSelect}
        onClose={() => setSelectedSong(null)}
      />
    </div>
  )
}
