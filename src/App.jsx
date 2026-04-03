import { useState, useRef, useEffect } from 'react'
import IntroAnimation from './components/IntroAnimation'
import BottomNav from './components/BottomNav'
import DiscoveryFeed from './pages/DiscoveryFeed'
import LibraryPage from './pages/LibraryPage'
import MemoirPage from './pages/MemoirPage'
import MixTapePage from './pages/MixTapePage'
import SongSheet from './components/SongSheet'
import MiniPlayer from './components/MiniPlayer'
import { streamUrl } from './lib/plex'

const TAB_ORDER = ['discover', 'library', 'memoir', 'mixtape']

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
    const idx = TAB_ORDER.indexOf(activeTab)
    if (delta < 0 && idx < TAB_ORDER.length - 1) setActiveTab(TAB_ORDER[idx + 1])
    if (delta > 0 && idx > 0) setActiveTab(TAB_ORDER[idx - 1])
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
      style={{ backgroundColor: '#09090b', color: '#fafafa', fontFamily: "'DM Sans', system-ui, sans-serif", height: '100dvh', overflow: 'hidden' }}
      onTouchStart={selectedSong ? undefined : handleTabSwipeStart}
      onTouchEnd={selectedSong ? undefined : handleTabSwipeEnd}
    >
      {/* Single audio element at root — never unmounted */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {activeTab === 'discover' && <DiscoveryFeed onSongSelect={handleSongSelect} />}
      {activeTab === 'library' && <LibraryPage onSongSelect={handleSongSelect} />}
      {activeTab === 'memoir' && <MemoirPage />}
      {activeTab === 'mixtape' && <MixTapePage />}

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
