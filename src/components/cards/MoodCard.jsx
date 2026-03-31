export default function MoodCard({ card, onMoodSelect, compact }) {
  const { mood } = card

  return (
    <div
      onClick={() => onMoodSelect(mood)}
      style={{
        width: '100%', height: '100%',
        background: mood.gradient,
        borderRadius: compact ? '14px' : '20px',
        padding: compact ? '20px' : '32px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Top badge */}
      <div style={{
        display: 'inline-flex',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '9999px', padding: '4px 12px',
        alignSelf: 'flex-start',
      }}>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          🎧 Mood
        </span>
      </div>

      {/* Center emoji */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: compact ? '48px' : '72px', lineHeight: 1, marginBottom: '12px' }}>
          {mood.emoji}
        </div>
        <h2 style={{
          margin: 0, color: '#fff',
          fontSize: compact ? '20px' : '28px',
          fontWeight: 800, letterSpacing: '-0.5px',
        }}>
          {mood.name}
        </h2>
        <p style={{
          margin: compact ? '6px 0 0' : '8px 0 0',
          color: 'rgba(255,255,255,0.7)',
          fontSize: compact ? '13px' : '15px',
        }}>
          {mood.description}
        </p>
      </div>

      {/* Bottom */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.6)', fontSize: '13px',
        }}>
          {mood.trackCount || mood.songIds?.length || 0} songs
        </span>
        <div style={{
          background: 'rgba(255,255,255,0.2)', borderRadius: '9999px',
          padding: '6px 14px', fontSize: '13px', fontWeight: 600, color: '#fff',
        }}>
          Play →
        </div>
      </div>
    </div>
  )
}
