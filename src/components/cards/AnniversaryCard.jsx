import { albumArtUrl } from '../../lib/plex'

const DECADE_GRADIENTS = {
  '1960s': 'linear-gradient(160deg, #92400e 0%, #b45309 40%, #78350f 100%)',
  '1970s': 'linear-gradient(160deg, #713f12 0%, #a16207 40%, #854d0e 100%)',
  '1980s': 'linear-gradient(160deg, #4c1d95 0%, #7c3aed 40%, #be185d 100%)',
  '1990s': 'linear-gradient(160deg, #1e3a5f 0%, #065f46 40%, #1e1b4b 100%)',
  '2000s': 'linear-gradient(160deg, #1e3a8a 0%, #1e40af 40%, #312e81 100%)',
  '2010s': 'linear-gradient(160deg, #0369a1 0%, #0f766e 40%, #1e40af 100%)',
  '2020s': 'linear-gradient(160deg, #4f46e5 0%, #6d28d9 40%, #1d4ed8 100%)',
}

function blurToGradient(blurColors) {
  if (!blurColors) return null
  return `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
}

export default function AnniversaryCard({ card, onSelect, compact }) {
  const { song, label, yearsAgo } = card
  const artSrc = song.thumb ? albumArtUrl(song.thumb, compact ? 200 : 400) : null
  const gradient = blurToGradient(song.blurColors) || DECADE_GRADIENTS[song.decade] || DECADE_GRADIENTS['1960s']

  return (
    <div
      onClick={() => onSelect(song)}
      style={{
        width: '100%', height: '100%',
        background: gradient,
        borderRadius: compact ? '14px' : '20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Album art as blurred background */}
      {artSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${artSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.18, filter: 'blur(2px)', transform: 'scale(1.05)',
        }} />
      )}

      {/* Dark overlay for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />

      {/* Decade watermark */}
      <div style={{
        position: 'absolute', bottom: '-20px', right: '-10px',
        fontSize: compact ? '80px' : '120px', fontWeight: 900,
        color: 'rgba(255,255,255,0.06)', lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {song.decade}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', padding: compact ? '20px' : '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
        {/* Top */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)', borderRadius: '9999px',
            padding: '4px 12px', marginBottom: compact ? '12px' : '20px',
          }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              🕰 {label}
            </span>
          </div>

          {/* Album art thumbnail + title */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            {artSrc && (
              <img
                src={artSrc}
                alt={song.album}
                style={{
                  width: compact ? '56px' : '80px',
                  height: compact ? '56px' : '80px',
                  borderRadius: '8px', objectFit: 'cover', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              />
            )}
            <div>
              <h2 style={{
                margin: 0, color: '#fff',
                fontSize: compact ? '16px' : '26px',
                fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.3px',
              }}>
                {song.title}
              </h2>
              <p style={{
                margin: compact ? '4px 0 0' : '6px 0 0',
                color: 'rgba(255,255,255,0.7)',
                fontSize: compact ? '12px' : '15px',
              }}>
                {song.artist}
              </p>
              {song.album && !compact && (
                <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
                  {song.album}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {song.billboard_peak && (
            <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: compact ? '5px 10px' : '7px 12px' }}>
              <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peak</p>
              <p style={{ margin: 0, fontSize: compact ? '13px' : '16px', fontWeight: 700, color: song.billboard_peak === 1 ? '#fbbf24' : '#fff' }}>
                #{song.billboard_peak}
              </p>
            </div>
          )}
          <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: compact ? '5px 10px' : '7px 12px' }}>
            <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</p>
            <p style={{ margin: 0, fontSize: compact ? '13px' : '16px', fontWeight: 700, color: '#fff' }}>{song.year}</p>
          </div>
          {song.ratingCount > 0 && !compact && (
            <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '7px 12px' }}>
              <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plays</p>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff' }}>{song.ratingCount.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
