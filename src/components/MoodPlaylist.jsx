function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function MoodPlaylist({ mood, songs, onClose, onSongSelect }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 40, backdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#09090b', borderTop: '1px solid #27272a',
        borderRadius: '16px 16px 0 0',
        zIndex: 50, maxHeight: '80vh', overflowY: 'auto',
        animation: 'slideUp 0.25s ease-out',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '9999px', background: '#3f3f46' }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          background: mood.gradient,
          margin: '12px 16px 0',
          borderRadius: '14px',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
              borderRadius: '9999px', width: '28px', height: '28px',
              cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>{mood.emoji}</div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#fff' }}>{mood.name}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
            {mood.description} · {songs.length} songs
          </p>
        </div>

        {/* Song list */}
        <div style={{ padding: '16px 16px 80px' }}>
          {songs.map((song, i) => (
            <div
              key={song.id}
              onClick={() => { onSongSelect(song); onClose() }}
              style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#18181b'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#52525b', fontSize: '13px', textAlign: 'right' }}>{i + 1}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#fafafa' }}>{song.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#71717a' }}>{song.artist}</p>
              </div>
              <span style={{ color: '#52525b', fontSize: '12px' }}>{formatDuration(song.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
