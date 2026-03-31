const DECADE_GRADIENTS = {
  '1960s': 'linear-gradient(160deg, #92400e 0%, #b45309 40%, #78350f 100%)',
  '1970s': 'linear-gradient(160deg, #713f12 0%, #a16207 40%, #854d0e 100%)',
  '1980s': 'linear-gradient(160deg, #4c1d95 0%, #7c3aed 40%, #be185d 100%)',
  '1990s': 'linear-gradient(160deg, #1e3a5f 0%, #065f46 40%, #1e1b4b 100%)',
  '2000s': 'linear-gradient(160deg, #1e3a8a 0%, #1e40af 40%, #312e81 100%)',
  '2010s': 'linear-gradient(160deg, #0369a1 0%, #0f766e 40%, #1e40af 100%)',
  '2020s': 'linear-gradient(160deg, #4f46e5 0%, #6d28d9 40%, #1d4ed8 100%)',
}

export default function AnniversaryCard({ card, onSelect, compact }) {
  const { song, label, yearsAgo } = card
  const gradient = DECADE_GRADIENTS[song.decade] || DECADE_GRADIENTS['1960s']

  return (
    <div
      onClick={() => onSelect(song)}
      style={{
        width: '100%', height: '100%',
        background: gradient,
        borderRadius: compact ? '14px' : '20px',
        padding: compact ? '20px' : '32px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Background decade text */}
      <div style={{
        position: 'absolute', bottom: '-20px', right: '-10px',
        fontSize: compact ? '80px' : '120px', fontWeight: 900,
        color: 'rgba(255,255,255,0.06)', lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {song.decade}
      </div>

      {/* Top */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.15)', borderRadius: '9999px',
          padding: '4px 12px', marginBottom: compact ? '12px' : '20px',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🕰 {label}
          </span>
        </div>

        <h2 style={{
          margin: 0, color: '#fff',
          fontSize: compact ? '18px' : '28px',
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.5px',
        }}>
          {song.title}
        </h2>
        <p style={{
          margin: compact ? '6px 0 0' : '8px 0 0',
          color: 'rgba(255,255,255,0.7)',
          fontSize: compact ? '13px' : '16px',
        }}>
          {song.artist}
        </p>
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {song.billboard_peak && (
          <div style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
            padding: compact ? '6px 10px' : '8px 14px',
          }}>
            <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peak</p>
            <p style={{
              margin: 0,
              fontSize: compact ? '14px' : '18px',
              fontWeight: 700,
              color: song.billboard_peak === 1 ? '#fbbf24' : '#fff',
            }}>
              #{song.billboard_peak}
            </p>
          </div>
        )}
        <div style={{
          background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
          padding: compact ? '6px 10px' : '8px 14px',
        }}>
          <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</p>
          <p style={{ margin: 0, fontSize: compact ? '14px' : '18px', fontWeight: 700, color: '#fff' }}>{song.year}</p>
        </div>
      </div>
    </div>
  )
}
