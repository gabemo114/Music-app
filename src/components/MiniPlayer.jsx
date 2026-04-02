import { albumArtUrl } from '../lib/plex'

export default function MiniPlayer({ song, isPlaying, onPlayPause, onOpen }) {
  if (!song) return null

  const artSrc = song.thumb ? albumArtUrl(song.thumb, 100) : null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: `calc(64px + env(safe-area-inset-bottom, 0px))`,
        left: '8px', right: '8px',
        background: 'rgba(24,24,27,0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '8px 12px 8px 8px',
        zIndex: 25,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Album art — tapping opens the song sheet */}
      <div onClick={onOpen} style={{ cursor: 'pointer', flexShrink: 0 }}>
        {artSrc ? (
          <img
            src={artSrc}
            alt={song.title}
            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '44px', height: '44px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #27272a, #18181b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: '#3f3f46',
          }}>♫</div>
        )}
      </div>

      {/* Title + artist — tapping opens the song sheet */}
      <div onClick={onOpen} style={{ flex: 1, overflow: 'hidden', cursor: 'pointer' }}>
        <p style={{
          margin: 0, fontSize: '14px', fontWeight: 700, color: '#fafafa',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {song.title}
        </p>
        <p style={{
          margin: '2px 0 0', fontSize: '12px', color: '#71717a',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {song.artist || 'Unknown Artist'}
        </p>
      </div>

      {/* Play/pause */}
      <button
        onClick={onPlayPause}
        style={{
          background: '#fafafa', border: 'none', borderRadius: '9999px',
          width: '36px', height: '36px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', flexShrink: 0, color: '#09090b',
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
    </div>
  )
}
