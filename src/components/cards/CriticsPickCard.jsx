import CardShell from './CardShell'

export default function CriticsPickCard({ card, compact }) {
  const { pick } = card

  return (
    <CardShell
      compact={compact}
      badge="Critic's Pick"
      accentColor="#fbbf24"
    >
      <div>
        <p style={{
          margin: '0 0 4px', fontSize: '10px', fontWeight: 600,
          color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {pick.source} · {pick.score ? `${pick.score}/100` : 'Acclaimed'}
        </p>
        <h2 style={{
          margin: '0 0 4px', color: '#fff',
          fontSize: compact ? '18px' : '26px',
          fontFamily: "'DM Serif Display', serif",
          fontWeight: 400, lineHeight: 1.15,
          letterSpacing: '-0.3px',
        }}>
          {pick.album}
        </h2>
        <p style={{
          margin: 0, fontSize: compact ? '12px' : '14px',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {pick.artist} · {pick.year}
        </p>
      </div>
    </CardShell>
  )
}
