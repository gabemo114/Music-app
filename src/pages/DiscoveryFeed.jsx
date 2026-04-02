import { useState, useRef, useEffect, useCallback } from 'react'
import { generateFeed } from '../utils/feedGenerator'
import { usePlexLibrary } from '../hooks/usePlexLibrary'
import AnniversaryCard from '../components/cards/AnniversaryCard'
import TILCard from '../components/cards/TILCard'
import ChartTopperCard from '../components/cards/ChartTopperCard'
import MoodCard from '../components/cards/MoodCard'
import ArtistCard from '../components/cards/ArtistCard'
import AlbumOfTheDayCard from '../components/cards/AlbumOfTheDayCard'
import JournalPromptCard from '../components/cards/JournalPromptCard'
import MoodPlaylist from '../components/MoodPlaylist'

const SNAP_THRESHOLD = 60
const NAV_HEIGHT = 64

function renderCard(card, onSongSelect, onMoodSelect, compact = false) {
  switch (card.type) {
    case 'anniversary':
      return <AnniversaryCard card={card} onSelect={onSongSelect} compact={compact} />
    case 'til':
      return <TILCard card={card} compact={compact} />
    case 'chart_topper':
      return <ChartTopperCard card={card} onSelect={onSongSelect} compact={compact} />
    case 'mood':
      return <MoodCard card={card} onMoodSelect={onMoodSelect} compact={compact} />
    case 'artist':
      return <ArtistCard card={card} onSelect={onSongSelect} compact={compact} />
    case 'album_of_day':
      return <AlbumOfTheDayCard card={card} onSelect={onSongSelect} compact={compact} />
    case 'journal_prompt':
      return <JournalPromptCard card={card} onSelect={onSongSelect} compact={compact} />
    default:
      return null
  }
}

export default function DiscoveryFeed({ onSongSelect }) {
  const { tracks, loading, progress, error, refresh } = usePlexLibrary()
  const [pages, setPages] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const touchStartY = useRef(null)
  const isDragging = useRef(false)
  const containerRef = useRef(null)

  // Generate feed once tracks are loaded
  useEffect(() => {
    if (tracks.length > 0 && pages.length === 0) {
      setPages(generateFeed(tracks))
    }
  }, [tracks, pages.length])

  // Generate more pages when nearing the end
  useEffect(() => {
    if (tracks.length > 0 && pages.length > 0 && pageIndex >= pages.length - 4) {
      setPages(prev => [...prev, ...generateFeed(tracks)])
    }
  }, [pageIndex, pages.length, tracks])

  const goToPage = useCallback((newIndex) => {
    if (newIndex < 0 || isAnimating) return
    setIsAnimating(true)
    setDragOffset(0)
    setPageIndex(newIndex)
    setTimeout(() => setIsAnimating(false), 350)
  }, [isAnimating])

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
    isDragging.current = true
  }

  const handleTouchMove = (e) => {
    if (!isDragging.current || touchStartY.current === null) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (pageIndex === 0 && delta > 0) {
      setDragOffset(delta * 0.15)
    } else {
      setDragOffset(delta)
    }
  }

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.changedTouches[0].clientY - (touchStartY.current ?? 0)
    touchStartY.current = null
    if (delta < -SNAP_THRESHOLD) goToPage(pageIndex + 1)
    else if (delta > SNAP_THRESHOLD && pageIndex > 0) goToPage(pageIndex - 1)
    else setDragOffset(0)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowUp') goToPage(pageIndex + 1)
      if (e.key === 'ArrowDown' && pageIndex > 0) goToPage(pageIndex - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pageIndex, goToPage])

  const contentHeight = `calc(100dvh - ${NAV_HEIGHT}px - env(safe-area-inset-bottom, 0px))`

  // Mood songs come from the live tracks array
  const moodSongs = selectedMood
    ? (selectedMood.songIds || []).map(id => tracks.find(t => t.id === id)).filter(Boolean)
    : []

  // Error state
  if (error) {
    return (
      <div style={{
        height: contentHeight, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px',
      }}>
        <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>
          Could not connect to Plex: {error}
        </p>
        <button onClick={refresh} style={{
          background: '#fafafa', color: '#09090b', border: 'none',
          borderRadius: '8px', padding: '10px 20px', fontSize: '14px',
          fontWeight: 600, cursor: 'pointer',
        }}>
          Retry
        </button>
      </div>
    )
  }

  // Loading state
  if (loading || pages.length === 0) {
    const pct = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0
    return (
      <div style={{
        height: contentHeight, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
      }}>
        <div style={{ fontSize: '32px' }}>🎵</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa', marginBottom: '8px' }}>
            Building your discovery feed...
          </p>
          {progress.total > 0 && (
            <>
              <div style={{
                width: '200px', height: '4px', background: '#27272a',
                borderRadius: '9999px', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: '#a78bfa', borderRadius: '9999px',
                  transition: 'width 0.3s',
                }} />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#52525b' }}>
                {progress.loaded.toLocaleString()} / {progress.total.toLocaleString()} tracks
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  const currentPage = pages[pageIndex]

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: contentHeight, overflow: 'hidden', position: 'relative',
        touchAction: 'none', userSelect: 'none',
      }}
    >
      <div style={{
        height: '100%',
        transform: `translateY(${dragOffset}px)`,
        transition: isDragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        padding: '8px', boxSizing: 'border-box',
      }}>
        {currentPage?.layout === 'single' ? (
          <div style={{ height: '100%' }}>
            {renderCard(currentPage.cards[0], onSongSelect, setSelectedMood)}
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentPage?.cards.map(card => (
              <div key={card.id} style={{ flex: 1 }}>
                {renderCard(card, onSongSelect, setSelectedMood, true)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page dots */}
      <div style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '6px',
        pointerEvents: 'none',
      }}>
        {[-2, -1, 0, 1, 2].map(offset => {
          const idx = pageIndex + offset
          if (idx < 0 || idx >= pages.length) return null
          return (
            <div key={offset} style={{
              width: offset === 0 ? '6px' : '4px',
              height: offset === 0 ? '6px' : '4px',
              borderRadius: '50%',
              background: offset === 0 ? '#fafafa' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.2s',
            }} />
          )
        })}
      </div>

      {pageIndex === 0 && (
        <div style={{
          position: 'absolute', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.3)', fontSize: '12px',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          pointerEvents: 'none', animation: 'fadeInOut 3s ease 1.5s forwards',
          opacity: 0,
        }}>
          <style>{`@keyframes fadeInOut { 0%{opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{opacity:0} }`}</style>
          swipe up to explore
        </div>
      )}

      {selectedMood && (
        <MoodPlaylist
          mood={selectedMood}
          songs={moodSongs}
          onClose={() => setSelectedMood(null)}
          onSongSelect={onSongSelect}
        />
      )}
    </div>
  )
}
