import { albumArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

export default function AlbumOfTheDayCard({ card, onSelect, compact }) {
  const { album } = card
  const bgSrc = album.thumb ? albumArtUrl(album.thumb, compact ? 400 : 800) : null
  const thumbSrc = album.thumb ? albumArtUrl(album.thumb, 120) : null

  return (
    <CardShell
      bgSrc={bgSrc}
      blurColors={album.blurColors}
      compact={compact}
      onClick={() => onSelect(album.tracks[0])}
      badge="💿 Album of the Day"
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
        {thumbSrc && (
          <img
            src={thumbSrc}
            alt={album.title}
            style={{
              width: compact ? '48px' : '64px',
              height: compact ? '48px' : '64px',
              borderRadius: '8px', objectFit: 'cover', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            }}
          />
        )}
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <h2 style={{
            margin: '0 0 3px', color: '#fff',
            fontSize: compact ? '15px' : '22px',
            fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.3px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {album.title}
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: compact ? '12px' : '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {album.artist}{album.year ? ` · ${album.year}` : ''}
          </p>
          <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
            {album.tracks.length} tracks
          </p>
        </div>
      </div>
    </CardShell>
  )
}
