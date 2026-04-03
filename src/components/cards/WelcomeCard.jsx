import { albumArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

export default function WelcomeCard({ card, onSelect, compact }) {
  const { song } = card
  const bgSrc = song?.thumb ? albumArtUrl(song.thumb, compact ? 400 : 800) : null

  return (
    <CardShell
      bgSrc={bgSrc}
      blurColors={song?.blurColors}
      compact={compact}
      onClick={() => song && onSelect(song)}
      badge="Start here"
      accentColor="#a78bfa"
    >
      <div>
        <h2 style={{
          margin: '0 0 8px', color: '#fff',
          fontSize: compact ? '18px' : '24px',
          fontFamily: "'DM Serif Display', serif",
          fontWeight: 400, lineHeight: 1.25,
          letterSpacing: '-0.3px',
        }}>
          Your library, your story.
        </h2>
        <p style={{
          margin: '0 0 12px', fontSize: compact ? '12px' : '13px',
          color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
        }}>
          Write your first memory about a song. What does it take you back to?
        </p>
        {song && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{
              margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
            }}>
              {song.title} · {song.artist}
            </p>
            <div style={{
              flexShrink: 0, marginLeft: '10px',
              background: 'rgba(167,139,250,0.25)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '9999px', padding: '5px 14px',
              fontSize: '12px', fontWeight: 700, color: '#c4b5fd',
            }}>
              Write →
            </div>
          </div>
        )}
      </div>
    </CardShell>
  )
}
