import { albumArtUrl, artistArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

export default function ChartTopperCard({ card, onSelect, compact }) {
  const { song } = card
  const bgSrc = song.artistArt
    ? artistArtUrl(song.artistArt)
    : song.thumb ? albumArtUrl(song.thumb, compact ? 400 : 800) : null
  const thumbSrc = song.thumb ? albumArtUrl(song.thumb, 120) : null

  return (
    <CardShell
      bgSrc={bgSrc}
      blurColors={song.blurColors}
      compact={compact}
      onClick={() => onSelect(song)}
      badge={card.isFeatured ? '⭐ Featured' : '🏆 Billboard #1'}
      accentColor="rgba(251,191,36,0.8)"
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
        {thumbSrc && (
          <img
            src={thumbSrc}
            alt={song.album}
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
            {song.title}
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: compact ? '12px' : '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {song.artist}{song.year ? ` · ${song.year}` : ''}
          </p>
        </div>
        {!card.isFeatured && (
          <div style={{
            flexShrink: 0, textAlign: 'center',
            background: 'rgba(251,191,36,0.15)', borderRadius: '10px',
            padding: compact ? '6px 10px' : '8px 12px',
            border: '1px solid rgba(251,191,36,0.3)',
          }}>
            <p style={{ margin: 0, fontSize: compact ? '18px' : '26px', fontWeight: 900, color: '#fbbf24', lineHeight: 1 }}>#1</p>
          </div>
        )}
      </div>
    </CardShell>
  )
}
