import { artistArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

export default function ArtistCard({ card, onSelect, compact }) {
  const { artist, representativeTrack } = card
  const bgSrc = artist.art ? artistArtUrl(artist.art) : null
  const thumbSrc = artist.thumb ? artistArtUrl(artist.thumb) : null

  const bio = artist.summary
    ? artist.summary.split(/(?<=[.!?])\s+/).slice(0, compact ? 1 : 2).join(' ')
    : null

  return (
    <CardShell
      bgSrc={bgSrc}
      blurColors={artist.blurColors}
      compact={compact}
      onClick={() => representativeTrack && onSelect(representativeTrack)}
      badge="🎤 Artist"
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: bio ? '10px' : 0 }}>
          {thumbSrc && (
            <img
              src={thumbSrc}
              alt={artist.name}
              style={{
                width: compact ? '36px' : '48px',
                height: compact ? '36px' : '48px',
                borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.15)',
              }}
            />
          )}
          <div style={{ overflow: 'hidden' }}>
            {artist.country && (
              <p style={{ margin: '0 0 2px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {artist.country}
              </p>
            )}
            <h2 style={{
              margin: 0, color: '#fff',
              fontSize: compact ? '18px' : '26px',
              fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {artist.name}
            </h2>
          </div>
        </div>

        {bio && (
          <p style={{
            margin: 0, fontSize: compact ? '11px' : '13px', lineHeight: 1.55,
            color: 'rgba(255,255,255,0.6)',
            display: '-webkit-box', WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {bio}
          </p>
        )}
      </div>
    </CardShell>
  )
}
