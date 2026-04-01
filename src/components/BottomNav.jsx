export default function BottomNav({ activeTab, onChange }) {
  const tabs = [
    { id: 'discover', label: 'Discover', icon: '✦' },
    { id: 'library', label: 'Library', icon: '♫' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      background: 'rgba(9,9,11,0.95)',
      borderTop: '1px solid #27272a',
      display: 'flex',
      backdropFilter: 'blur(12px)',
      zIndex: 30,
    }}>
      {tabs.map(tab => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '3px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? '#fafafa' : '#52525b',
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, letterSpacing: '0.05em' }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
