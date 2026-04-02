import { useState, useMemo } from 'react'
import { usePlexLibrary } from '../hooks/usePlexLibrary'
import { albumArtUrl } from '../lib/plex'

const NAV_HEIGHT = 64

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function AlbumArtImage({ thumb, title, size, fetchSize, borderRadius = '10px' }) {
  const [errored, setErrored] = useState(false)
  const src = thumb && !errored ? albumArtUrl(thumb, fetchSize || (typeof size === 'number' ? size : 300)) : null
  if (!src) {
    return (
      <div style={{
        width: size, height: size, borderRadius, flexShrink: 0,
        background: 'linear-gradient(135deg, #27272a, #18181b)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: typeof size === 'number' ? size * 0.35 : '28px', color: '#3f3f46',
      }}>
        ♫
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={title}
      onError={() => setErrored(true)}
      style={{ width: size, height: size, borderRadius, objectFit: 'cover', flexShrink: 0, display: 'block' }}
    />
  )
}

function buildAlbums(tracks) {
  const map = {}
  for (const track of tracks) {
    const key = track.plexKey ? `${track.grandparentKey}-${track.album}` : track.album
    if (!map[key]) {
      map[key] = {
        key,
        title: track.album || 'Unknown Album',
        artist: track.artist || 'Unknown Artist',
        year: track.year,
        thumb: track.thumb,
        blurColors: track.blurColors,
        genre: track.genre,
        decade: track.decade,
        tracks: [],
      }
    }
    map[key].tracks.push(track)
  }
  // Sort tracks within each album by track number
  for (const album of Object.values(map)) {
    album.tracks.sort((a, b) => (a.track || 0) - (b.track || 0))
  }
  return Object.values(map).sort((a, b) => {
    const aArtist = a.artist.toLowerCase().replace(/^the /, '')
    const bArtist = b.artist.toLowerCase().replace(/^the /, '')
    if (aArtist !== bArtist) return aArtist.localeCompare(bArtist)
    return (a.year || 0) - (b.year || 0)
  })
}

function AlbumView({ album, onTrackSelect, onClose }) {
  const blurGradient = album.blurColors
    ? `linear-gradient(160deg, ${album.blurColors.topLeft} 0%, ${album.blurColors.topRight} 50%, ${album.blurColors.bottomRight} 100%)`
    : 'linear-gradient(160deg, #27272a, #18181b)'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20,
      background: '#09090b',
      display: 'flex', flexDirection: 'column',
      paddingBottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
    }}>
      {/* Hero */}
      <div style={{
        position: 'relative', background: blurGradient,
        padding: '16px 20px 24px', flexShrink: 0,
      }}>
        {album.thumb && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${albumArtUrl(album.thumb, 400)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.15, filter: 'blur(4px)', transform: 'scale(1.05)',
          }} />
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, #09090b, transparent)' }} />

        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.4)',
            border: 'none', color: '#fff', borderRadius: '9999px',
            padding: '6px 14px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          ← Library
        </button>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <AlbumArtImage thumb={album.thumb} title={album.title} size={88} borderRadius="10px" />
          <div style={{ overflow: 'hidden', paddingBottom: '2px' }}>
            <p style={{ margin: '0 0 3px', fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {album.genre}{album.year ? ` · ${album.year}` : ''}
            </p>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900, lineHeight: 1.15, color: '#fff' }}>
              {album.title}
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>{album.artist}</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              {album.tracks.length} track{album.tracks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {album.tracks.map((track, i) => (
          <div
            key={track.id}
            onClick={() => onTrackSelect(track)}
            style={{
              display: 'grid', gridTemplateColumns: '28px 1fr auto',
              alignItems: 'center', gap: '12px',
              padding: '12px 20px', cursor: 'pointer',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
            onTouchStart={e => e.currentTarget.style.background = '#18181b'}
            onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '13px', color: '#3f3f46', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {track.track || i + 1}
            </span>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 400, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {track.title}
              </p>
              {track.artist !== album.artist && (
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {track.artist}
                </p>
              )}
            </div>
            <span style={{ fontSize: '13px', color: '#3f3f46', fontVariantNumeric: 'tabular-nums' }}>
              {formatDuration(track.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LibraryPage({ onSongSelect }) {
  const { tracks, loading, progress, error, refresh } = usePlexLibrary()
  const [search, setSearch] = useState('')
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [selectedAlbum, setSelectedAlbum] = useState(null)

  const albums = useMemo(() => buildAlbums(tracks), [tracks])

  const decades = useMemo(() => {
    const set = new Set(albums.map(a => a.decade).filter(Boolean))
    return ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'].filter(d => set.has(d))
  }, [albums])

  const filtered = useMemo(() => albums.filter(album => {
    const matchDecade = !selectedDecade || album.decade === selectedDecade
    const q = search.toLowerCase()
    const matchSearch = q === '' ||
      album.title.toLowerCase().includes(q) ||
      album.artist.toLowerCase().includes(q)
    return matchDecade && matchSearch
  }), [albums, selectedDecade, search])

  const contentHeight = `calc(100dvh - ${NAV_HEIGHT}px - env(safe-area-inset-bottom, 0px))`

  if (loading) {
    const pct = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0
    return (
      <div style={{ height: contentHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ fontSize: '32px' }}>♫</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa', marginBottom: '8px' }}>Loading your library...</p>
          {progress.total > 0 && (
            <>
              <div style={{ width: '200px', height: '4px', background: '#27272a', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#a78bfa', borderRadius: '9999px', transition: 'width 0.3s' }} />
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
      <div style={{ height: contentHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px' }}>
        <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>Could not connect to Plex: {error}</p>
        <button onClick={refresh} style={{ background: '#fafafa', color: '#09090b', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    )
  }

  if (selectedAlbum) {
    return (
      <AlbumView
        album={selectedAlbum}
        onTrackSelect={(track) => { onSongSelect(track) }}
        onClose={() => setSelectedAlbum(null)}
      />
    )
  }

  return (
    <div style={{ height: contentHeight, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
        <h1 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.3px' }}>Library</h1>
        <input
          type="text"
          placeholder="Search albums or artists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: '#18181b', border: '1px solid #27272a',
            borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
            color: '#fafafa', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Decade filter */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
        {[{ id: null, label: 'All' }, ...decades.map(d => ({ id: d, label: d }))].map(({ id, label }) => (
          <button
            key={label}
            onClick={() => setSelectedDecade(id)}
            style={{
              padding: '5px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700,
              border: '1px solid', cursor: 'pointer', flexShrink: 0, letterSpacing: '0.03em',
              background: selectedDecade === id ? '#fafafa' : 'transparent',
              color: selectedDecade === id ? '#09090b' : '#71717a',
              borderColor: selectedDecade === id ? '#fafafa' : '#27272a',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ margin: '0 16px 8px', fontSize: '12px', color: '#3f3f46', flexShrink: 0 }}>
        {filtered.length.toLocaleString()} albums
      </p>

      {/* Album grid */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '0 16px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}>
          {filtered.map(album => (
            <div
              key={album.key}
              onClick={() => setSelectedAlbum(album)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', aspectRatio: '1', marginBottom: '8px' }}>
                <AlbumArtImage
                  thumb={album.thumb}
                  title={album.title}
                  size="100%"
                  fetchSize={300}
                  borderRadius="10px"
                />
              </div>
              <p style={{
                margin: 0, fontSize: '13px', fontWeight: 700, color: '#fafafa',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {album.title}
              </p>
              <p style={{
                margin: '2px 0 0', fontSize: '12px', color: '#71717a',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {album.artist}
              </p>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ color: '#52525b', textAlign: 'center', paddingTop: '60px' }}>No albums found.</p>
        )}
      </div>
    </div>
  )
}
