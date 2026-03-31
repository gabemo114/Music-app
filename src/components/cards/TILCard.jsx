export default function TILCard({ card, compact }) {
  const { fact } = card

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #18181b 0%, #1c1917 100%)',
      border: '1px solid #27272a',
      borderRadius: compact ? '14px' : '20px',
      padding: compact ? '20px' : '32px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Top */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '9999px',
          padding: '4px 12px', marginBottom: compact ? '14px' : '24px',
        }}>
          <span style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            💡 Today I Learned
          </span>
        </div>

        <p style={{
          margin: 0, color: '#e4e4e7',
          fontSize: compact ? '14px' : '18px',
          lineHeight: compact ? 1.5 : 1.65,
          fontWeight: 400,
        }}>
          "{fact.fact}"
        </p>
      </div>

      {/* Bottom attribution */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', flexShrink: 0,
        }}>
          🎤
        </div>
        <div>
          <p style={{ margin: 0, fontSize: compact ? '12px' : '14px', fontWeight: 600, color: '#fafafa' }}>
            {fact.artist}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#52525b' }}>{fact.year}</p>
        </div>
      </div>
    </div>
  )
}
