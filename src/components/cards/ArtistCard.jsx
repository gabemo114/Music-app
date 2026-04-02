import { artistArtUrl } from '../../lib/plex'

function blurToGradient(blurColors, fallback) {
  if (!blurColors) return fallback
  return `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
}

export default function ArtistCard({ card, onSelect, compact }) {
  const { artist, representativeTrack } = card
  const artSrc = artist.art ? artistArtUrl(artist.art) : null
  const thumbSrc = artist.thumb ? artistArtUrl(artist.thumb) : null
  const gradient = blurToGradient(artist.blurColors, 'linear-gradient(160deg, #1c1c1e, #2a2a2e)')

  // Truncate bio to ~2 sentences
  const bio = artist.summary
    ? artist.summary.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
    : null

  return (
    <div
      onClick={() => representativeTrack && onSelect(representativeTrack)}
      style={{
        width: '100%', height: '100%',
        background: gradient,
        borderRadius: compact ? '14px' : '20px',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Artist background art */}
      {artSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${artSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.3, filter: 'blur(2px)', transform: 'scale(1.05)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)',
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
          background: 'rgba(255,255,255,0.12)', borderRadius: '9999px',
          padding: '4px 12px', alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🎤 Artist
          </span>
        </div>

        {/* Bottom */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: bio ? (compact ? '8px' : '12px') : 0 }}>
            {/* Artist thumbnail */}
            {thumbSrc && (
              <img
                src={thumbSrc}
                alt={artist.name}
                style={{
                  width: compact ? '52px' : '72px',
                  height: compact ? '52px' : '72px',
                  borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                  border: '2px solid rgba(255,255,255,0.1)',
                }}
              />
            )}
            <div style={{ overflow: 'hidden' }}>
              {artist.country && (
                <p style={{ margin: '0 0 3px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {artist.country}
                </p>
              )}
              <h2 style={{
                margin: 0, color: '#fff',
                fontSize: compact ? '20px' : '28px',
                fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {artist.name}
              </h2>
              {artist.genre && (
                <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
                  {artist.genre}
                </p>
              )}
            </div>
          </div>

          {bio && !compact && (
            <p style={{
              margin: 0, fontSize: '13px', lineHeight: 1.6,
              color: 'rgba(255,255,255,0.6)',
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {bio}
            </p>
          )}
          {bio && compact && (
            <p style={{
              margin: 0, fontSize: '11px', lineHeight: 1.5,
              color: 'rgba(255,255,255,0.5)',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
