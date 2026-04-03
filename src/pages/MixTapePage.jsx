export default function MixTapePage() {
  return (
    <div style={{
      height: 'calc(100dvh - 64px - env(safe-area-inset-bottom, 0px))',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '12px', padding: '24px',
    }}>
      <span style={{ fontSize: '40px', opacity: 0.4 }}>⋮</span>
      <p style={{
        margin: 0, fontSize: '20px', fontWeight: 700,
        fontFamily: "'DM Serif Display', serif", color: '#fafafa',
      }}>
        Mixtapes
      </p>
      <p style={{ margin: 0, fontSize: '14px', color: '#52525b', textAlign: 'center', maxWidth: '260px' }}>
        Curate songs for someone. Write a note on each one. Share the link — no account needed to receive it.
      </p>
      <button style={{
        marginTop: '8px',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '9999px', padding: '10px 24px',
        color: '#fafafa', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
      }}>
        + New Mixtape
      </button>
    </div>
  )
}
