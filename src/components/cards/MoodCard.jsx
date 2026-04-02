import { albumArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

export default function MoodCard({ card, onMoodSelect, compact }) {
  const { mood } = card
  const bgSrc = mood.coverThumb ? albumArtUrl(mood.coverThumb, compact ? 400 : 800) : null

  return (
    <CardShell
      bgSrc={bgSrc}
      blurColors={mood.blurColors}
      compact={compact}
      onClick={() => onMoodSelect(mood)}
      badge="🎧 Mood"
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: compact ? '32px' : '44px', lineHeight: 1, marginBottom: '6px' }}>
            {mood.emoji}
          </div>
          <h2 style={{
            margin: '0 0 3px', color: '#fff',
            fontSize: compact ? '18px' : '26px',
            fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            {mood.name}
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: compact ? '11px' : '13px' }}>
            {mood.trackCount || mood.songIds?.length || 0} songs
          </p>
        </div>
        <div style={{
          flexShrink: 0,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          borderRadius: '9999px', padding: '8px 16px',
          fontSize: '13px', fontWeight: 700, color: '#fff',
        }}>
          Play →
        </div>
      </div>
    </CardShell>
  )
}
