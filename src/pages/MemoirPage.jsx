export default function MemoirPage() {
  return (
    <div style={{
      height: 'calc(100dvh - 64px - env(safe-area-inset-bottom, 0px))',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '12px', padding: '24px',
    }}>
      <span style={{ fontSize: '40px', opacity: 0.4 }}>✒</span>
      <p style={{
        margin: 0, fontSize: '20px', fontWeight: 700,
        fontFamily: "'DM Serif Display', serif", color: '#fafafa',
      }}>
        Your Memoir
      </p>
      <p style={{ margin: 0, fontSize: '14px', color: '#52525b', textAlign: 'center', maxWidth: '260px' }}>
        Journal entries you've written will collect here — your library as autobiography.
      </p>
    </div>
  )
}
