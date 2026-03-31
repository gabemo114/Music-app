import { albumArtUrl } from '../../lib/plex'

function blurToGradient(blurColors, fallback) {
  if (!blurColors) return fallback
  return `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
}

export default function MoodCard({ card, onMoodSelect, compact }) {
  const { mood } = card
  const artSrc = mood.coverThumb ? albumArtUrl(mood.coverThumb, compact ? 200 : 400) : null
  const gradient = blurToGradient(mood.blurColors, mood.gradient)

  return (
    <div
      onClick={() => onMoodSelect(mood)}
      style={{
        width: '100%', height: '100%',
        background: gradient,
        borderRadius: compact ? '14px' : '20px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Album art blurred background */}
      {artSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${artSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.2, filter: 'blur(3px)', transform: 'scale(1.05)',
        }} />
      )}

      {/* Bottom scrim */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', padding: compact ? '16px' : '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
        {/* Top badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.15)', borderRadius: '9999px',
          padding: '4px 12px', alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🎧 Mood
          </span>
        </div>

        {/* Center */}
        <div>
          <div style={{ fontSize: compact ? '40px' : '60px', lineHeight: 1, marginBottom: '10px' }}>
            {mood.emoji}
          </div>
          <h2 style={{
            margin: 0, color: '#fff',
            fontSize: compact ? '18px' : '26px',
            fontWeight: 800, letterSpacing: '-0.5px',
          }}>
            {mood.name}
          </h2>
          <p style={{
            margin: compact ? '4px 0 0' : '6px 0 0',
            color: 'rgba(255,255,255,0.65)',
            fontSize: compact ? '12px' : '14px',
          }}>
            {mood.description}
          </p>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            {mood.trackCount || mood.songIds?.length || 0} songs
          </span>
          <div style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: '9999px',
            padding: '5px 14px', fontSize: '12px', fontWeight: 600, color: '#fff',
          }}>
            Play →
          </div>
        </div>
      </div>
    </div>
  )
}
