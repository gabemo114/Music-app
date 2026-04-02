import { albumArtUrl, artistArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

export default function AnniversaryCard({ card, onSelect, compact }) {
  const { song, label, yearsAgo, isOnThisDay } = card
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
      badge={`${isOnThisDay ? '📅' : '🕰'} ${label}`}
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
        <div style={{
          flexShrink: 0, textAlign: 'right',
          background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
          padding: compact ? '6px 10px' : '8px 12px',
        }}>
          <p style={{ margin: 0, fontSize: compact ? '18px' : '28px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{yearsAgo}</p>
          <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>years</p>
        </div>
      </div>
    </CardShell>
  )
}
