import { useState } from 'react'
import { usePlexLibrary } from '../hooks/usePlexLibrary'
import { albumArtUrl } from '../lib/plex'

const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function AlbumArt({ thumb, title, size = 40 }) {
  const [errored, setErrored] = useState(false)
  const src = thumb ? albumArtUrl(thumb) : null
  if (!src || errored) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '6px', flexShrink: 0,
        background: 'linear-gradient(135deg, #27272a, #18181b)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.4, color: '#52525b',
      }}>
        🎵
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={title}
      onError={() => setErrored(true)}
      style={{ width: size, height: size, borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

export default function LibraryPage({ onSongSelect }) {
  const { tracks, loading, progress, error, refresh } = usePlexLibrary()
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [search, setSearch] = useState('')

  const genres = [...new Set(tracks.map(s => s.genre).filter(Boolean))].sort()
  const availableDecades = DECADES.filter(d => tracks.some(s => s.decade === d))

  const filtered = tracks.filter(s => {
    const matchDecade = !selectedDecade || s.decade === selectedDecade
    const matchGenre = !selectedGenre || s.genre === selectedGenre
    const matchSearch =
      search === '' ||
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.artist?.toLowerCase().includes(search.toLowerCase()) ||
      s.album?.toLowerCase().includes(search.toLowerCase())
    return matchDecade && matchGenre && matchSearch
  })

  if (loading) {
    const pct = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0
    return (
      <div style={{
        height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
      }}>
        <div style={{ fontSize: '32px' }}>🎵</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa', marginBottom: '8px' }}>
            Loading your Plex library...
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

  if (error) {
    return (
      <div style={{
        height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column',
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

  return (
    <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid #27272a', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, background: '#18181b', border: '1px solid #3f3f46',
            borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
            color: '#fafafa', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <button
          onClick={refresh}
          title="Refresh library"
          style={{
            background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px',
            color: '#71717a', cursor: 'pointer', padding: '0 12px', fontSize: '16px',
          }}
        >
          ↻
        </button>
      </div>

      {/* Genre tabs */}
      <div style={{ borderBottom: '1px solid #27272a', display: 'flex', overflowX: 'auto' }}>
        {[{ id: null, label: 'All' }, ...genres.map(g => ({ id: g, label: g }))].map(({ id, label }) => (
          <button
            key={label}
            onClick={() => setSelectedGenre(id)}
            style={{
              padding: '12px 18px', fontSize: '13px', fontWeight: 500, flexShrink: 0,
              background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: selectedGenre === id ? '#fafafa' : '#71717a',
              borderBottom: selectedGenre === id ? '2px solid #fafafa' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Decade filter */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #27272a' }}>
        {[{ id: null, label: 'All' }, ...availableDecades.map(d => ({ id: d, label: d }))].map(({ id, label }) => (
          <button
            key={label}
            onClick={() => setSelectedDecade(id)}
            style={{
              padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
              border: '1px solid', cursor: 'pointer', flexShrink: 0,
              background: selectedDecade === id ? '#fafafa' : '#18181b',
              color: selectedDecade === id ? '#09090b' : '#71717a',
              borderColor: selectedDecade === id ? '#fafafa' : '#3f3f46',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Song list */}
      <div style={{ padding: '16px' }}>
        <p style={{ color: '#52525b', fontSize: '13px', marginBottom: '12px' }}>
          {filtered.length.toLocaleString()} tracks
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map(song => (
            <div
              key={song.id}
              onClick={() => onSongSelect(song)}
              style={{
                display: 'grid', gridTemplateColumns: '40px 1fr auto',
                alignItems: 'center', gap: '12px',
                padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#18181b'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <AlbumArt thumb={song.thumb} title={song.title} size={40} />
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  margin: 0, fontSize: '14px', fontWeight: 500, color: '#fafafa',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {song.title}
                </p>
                <p style={{
                  margin: '2px 0 0', fontSize: '12px', color: '#71717a',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {song.artist || 'Unknown Artist'} · {song.album}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                {song.year && <span style={{ fontSize: '12px', color: '#52525b' }}>{song.year}</span>}
                <span style={{ fontSize: '12px', color: '#52525b' }}>{formatDuration(song.duration)}</span>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ color: '#52525b', textAlign: 'center', paddingTop: '40px' }}>No tracks match your search.</p>
        )}
      </div>
    </div>
  )
}
