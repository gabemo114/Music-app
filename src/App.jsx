import { useState, useRef } from 'react'
import IntroAnimation from './components/IntroAnimation'
import BottomNav from './components/BottomNav'
import DiscoveryFeed from './pages/DiscoveryFeed'
import LibraryPage from './pages/LibraryPage'
import SongSheet from './components/SongSheet'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [activeTab, setActiveTab] = useState('discover')
  const [selectedSong, setSelectedSong] = useState(null)

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

  if (showIntro) return <IntroAnimation onDone={() => setShowIntro(false)} />

  return (
    <div
      style={{ backgroundColor: '#09090b', color: '#fafafa', fontFamily: 'system-ui, sans-serif', height: '100vh', overflow: 'hidden' }}
      onTouchStart={selectedSong ? undefined : handleTabSwipeStart}
      onTouchEnd={selectedSong ? undefined : handleTabSwipeEnd}
    >
      {activeTab === 'discover' ? (
        <DiscoveryFeed onSongSelect={setSelectedSong} />
      ) : (
        <LibraryPage onSongSelect={setSelectedSong} />
      )}

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      <SongSheet
        song={selectedSong}
        onClose={() => setSelectedSong(null)}
      />
    </div>
  )
}
