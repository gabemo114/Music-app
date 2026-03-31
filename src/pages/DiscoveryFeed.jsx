import { useState, useRef, useEffect, useCallback } from 'react'
import { generateFeed } from '../utils/feedGenerator'
import AnniversaryCard from '../components/cards/AnniversaryCard'
import TILCard from '../components/cards/TILCard'
import ChartTopperCard from '../components/cards/ChartTopperCard'
import MoodCard from '../components/cards/MoodCard'
import MoodPlaylist from '../components/MoodPlaylist'
import songs from '../data/songs.json'

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
    default:
      return null
  }
}

export default function DiscoveryFeed({ onSongSelect }) {
  const [pages, setPages] = useState(() => generateFeed())
  const [pageIndex, setPageIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const touchStartY = useRef(null)
  const isDragging = useRef(false)
  const containerRef = useRef(null)

  // Generate more pages when nearing the end
  useEffect(() => {
    if (pageIndex >= pages.length - 4) {
      setPages(prev => [...prev, ...generateFeed()])
    }
  }, [pageIndex, pages.length])

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
    // Resist pulling back past the first card
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

    if (delta < -SNAP_THRESHOLD) {
      goToPage(pageIndex + 1)
    } else if (delta > SNAP_THRESHOLD && pageIndex > 0) {
      goToPage(pageIndex - 1)
    } else {
      // Snap back
      setDragOffset(0)
    }
  }

  // Keyboard support for desktop testing
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowUp') goToPage(pageIndex + 1)
      if (e.key === 'ArrowDown' && pageIndex > 0) goToPage(pageIndex - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pageIndex, goToPage])

  const contentHeight = `calc(100vh - ${NAV_HEIGHT}px)`
  const currentPage = pages[pageIndex]
  const moodSongs = selectedMood
    ? selectedMood.songIds.map(id => songs.find(s => s.id === id)).filter(Boolean)
    : []

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: contentHeight,
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Cards container — follows drag offset */}
      <div style={{
        height: '100%',
        transform: `translateY(${dragOffset}px)`,
        transition: isDragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        padding: '12px 16px',
        boxSizing: 'border-box',
      }}>
        {currentPage?.layout === 'single' ? (
          // Single card — full width, full height
          <div style={{ height: '100%' }}>
            {renderCard(currentPage.cards[0], onSongSelect, setSelectedMood)}
          </div>
        ) : (
          // Double card — two cards side by side
          <div style={{ height: '100%', display: 'flex', gap: '10px' }}>
            {currentPage?.cards.map(card => (
              <div key={card.id} style={{ flex: 1, height: '100%' }}>
                {renderCard(card, onSongSelect, setSelectedMood, true)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page indicator dots */}
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

      {/* Swipe hint on first visit */}
      {pageIndex === 0 && (
        <div style={{
          position: 'absolute', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.3)', fontSize: '12px',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          pointerEvents: 'none', animation: 'fadeInOut 3s ease 1.5s forwards',
          opacity: 0,
        }}>
          <style>{`
            @keyframes fadeInOut {
              0% { opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
          swipe up to explore
        </div>
      )}

      {/* Mood playlist overlay */}
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
