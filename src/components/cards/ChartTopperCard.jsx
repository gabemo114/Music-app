function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ChartTopperCard({ card, onSelect, compact }) {
  const { song } = card

  return (
    <div
      onClick={() => onSelect(song)}
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(160deg, #1a1200 0%, #2d1f00 40%, #1a1200 100%)',
        borderRadius: compact ? '14px' : '20px',
        padding: compact ? '20px' : '32px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
        border: '1px solid rgba(251,191,36,0.15)',
      }}
    >
      {/* Gold glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: '9999px',
          padding: '4px 12px', marginBottom: compact ? '12px' : '20px',
        }}>
          <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🏆 Billboard #1
          </span>
        </div>

        <h2 style={{
          margin: 0, color: '#fff',
          fontSize: compact ? '18px' : '30px',
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.5px',
        }}>
          {song.title}
        </h2>
        <p style={{
          margin: compact ? '6px 0 0' : '10px 0 0',
          color: 'rgba(255,255,255,0.65)',
          fontSize: compact ? '13px' : '16px',
        }}>
          {song.artist}
        </p>
      </div>

      {/* Bottom */}
      <div>
        {song.billboard_peak_date && (
          <p style={{
            margin: '0 0 10px',
            color: '#fbbf24', fontSize: compact ? '12px' : '13px', fontWeight: 500,
          }}>
            Peaked · {formatDate(song.billboard_peak_date)}
          </p>
        )}
        <div style={{
          display: 'inline-block',
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: '10px', padding: compact ? '6px 12px' : '8px 16px',
        }}>
          <span style={{
            fontSize: compact ? '28px' : '48px', fontWeight: 900,
            color: '#fbbf24', lineHeight: 1,
          }}>
            #1
          </span>
        </div>
      </div>
    </div>
  )
}
