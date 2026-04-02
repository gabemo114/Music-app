import { albumArtUrl } from '../../lib/plex'

function blurToGradient(blurColors, fallback) {
  if (!blurColors) return fallback
  return `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
}

const DECADE_GRADIENTS = {
  '1960s': 'linear-gradient(160deg, #92400e 0%, #b45309 50%, #78350f 100%)',
  '1970s': 'linear-gradient(160deg, #713f12 0%, #a16207 50%, #854d0e 100%)',
  '1980s': 'linear-gradient(160deg, #4c1d95 0%, #7c3aed 50%, #be185d 100%)',
  '1990s': 'linear-gradient(160deg, #1e3a5f 0%, #065f46 50%, #1e1b4b 100%)',
  '2000s': 'linear-gradient(160deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%)',
  '2010s': 'linear-gradient(160deg, #0369a1 0%, #0f766e 50%, #1e40af 100%)',
  '2020s': 'linear-gradient(160deg, #4f46e5 0%, #6d28d9 50%, #1d4ed8 100%)',
}

export default function AlbumOfTheDayCard({ card, onSelect, compact }) {
  const { album } = card
  const artSrc = album.thumb ? albumArtUrl(album.thumb, compact ? 200 : 400) : null
  const gradient = blurToGradient(album.blurColors, DECADE_GRADIENTS[album.decade] || DECADE_GRADIENTS['1990s'])

  const representativeTrack = album.tracks[0]

  return (
    <div
      onClick={() => onSelect(representativeTrack)}
      style={{
        width: '100%', height: '100%',
        background: gradient,
        borderRadius: compact ? '14px' : '20px',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Art as blurred bg */}
      {artSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${artSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.25, filter: 'blur(4px)', transform: 'scale(1.1)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', height: '100%', boxSizing: 'border-box',
        padding: compact ? '16px' : '28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.15)', borderRadius: '9999px',
          padding: '4px 12px', alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            💿 Album of the Day
          </span>
        </div>

        {/* Bottom section */}
        <div style={{ display: 'flex', gap: compact ? '12px' : '18px', alignItems: 'flex-end' }}>
          {/* Cover art */}
          {artSrc && (
            <img
              src={artSrc}
              alt={album.title}
              style={{
                width: compact ? '64px' : '100px',
                height: compact ? '64px' : '100px',
                borderRadius: '10px', objectFit: 'cover', flexShrink: 0,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}
            />
          )}
          <div style={{ overflow: 'hidden', paddingBottom: '2px' }}>
            <p style={{ margin: '0 0 4px', fontSize: compact ? '11px' : '12px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {album.genre}{album.year ? ` · ${album.year}` : ''}
            </p>
            <h2 style={{
              margin: '0 0 4px', color: '#fff',
              fontSize: compact ? '16px' : '24px',
              fontWeight: 900, letterSpacing: '-0.3px', lineHeight: 1.1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {album.title}
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: compact ? '12px' : '15px' }}>
              {album.artist}
            </p>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
              {album.tracks.length} tracks
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
