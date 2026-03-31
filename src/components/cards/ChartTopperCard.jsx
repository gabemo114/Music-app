import { albumArtUrl, artistArtUrl } from '../../lib/plex'

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function blurToGradient(blurColors) {
  if (!blurColors) return null
  return `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
}

export default function ChartTopperCard({ card, onSelect, compact }) {
  const { song } = card
  const artSrc = song.thumb ? albumArtUrl(song.thumb, compact ? 200 : 400) : null
  const bgSrc = song.artistArt ? artistArtUrl(song.artistArt) : null
  const gradient = blurToGradient(song.blurColors) || 'linear-gradient(160deg, #1a1200 0%, #2d1f00 40%, #1a1200 100%)'

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
        border: '1px solid rgba(251,191,36,0.15)',
      }}
    >
      {/* Artist background art */}
      {bgSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.25,
        }} />
      )}

      {/* Gold glow top-right */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Dark gradient overlay — bottom half for text legibility */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', padding: compact ? '16px' : '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
        {/* Top badge */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: '9999px',
            padding: '4px 12px', marginBottom: compact ? '10px' : '16px',
          }}>
            <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {card.isFeatured ? '⭐ Featured Artist' : '🏆 Billboard #1'}
            </span>
          </div>

          {/* Album art + title row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {artSrc && (
              <img
                src={artSrc}
                alt={song.album}
                style={{
                  width: compact ? '52px' : '72px',
                  height: compact ? '52px' : '72px',
                  borderRadius: '8px', objectFit: 'cover', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                }}
              />
            )}
            <div style={{ overflow: 'hidden' }}>
              <h2 style={{
                margin: 0, color: '#fff',
                fontSize: compact ? '16px' : '26px',
                fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.3px',
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {song.title}
              </h2>
              <p style={{ margin: compact ? '4px 0 0' : '6px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: compact ? '12px' : '14px' }}>
                {song.artist}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div>
          {song.billboard_peak_date && !compact && (
            <p style={{ margin: '0 0 10px', color: '#fbbf24', fontSize: '12px', fontWeight: 500 }}>
              Peaked · {formatDate(song.billboard_peak_date)}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '8px', padding: compact ? '5px 10px' : '7px 14px',
            }}>
              <span style={{ fontSize: compact ? '22px' : '36px', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>
                #1
              </span>
            </div>
            {song.year && (
              <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: compact ? '5px 10px' : '7px 12px' }}>
                <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</p>
                <p style={{ margin: 0, fontSize: compact ? '13px' : '16px', fontWeight: 700, color: '#fff' }}>{song.year}</p>
              </div>
            )}
            {song.ratingCount > 0 && !compact && (
              <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', padding: '7px 12px' }}>
                <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plays</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff' }}>{song.ratingCount.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
