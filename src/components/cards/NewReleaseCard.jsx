import CardShell from './CardShell'

export default function NewReleaseCard({ card, compact }) {
  const { release } = card

  const daysAgo = Math.floor(
    (Date.now() - new Date(release.releaseDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const when = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`

  return (
    <CardShell
      compact={compact}
      badge={`New ${release.type}`}
      accentColor="#a78bfa"
    >
      <div>
        <p style={{
          margin: '0 0 4px', fontSize: '10px', fontWeight: 600,
          color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {when} · From your library
        </p>
        <h2 style={{
          margin: '0 0 4px', color: '#fff',
          fontSize: compact ? '18px' : '26px',
          fontFamily: "'DM Serif Display', serif",
          fontWeight: 400, lineHeight: 1.15,
          letterSpacing: '-0.3px',
        }}>
          {release.title}
        </h2>
        <p style={{
          margin: 0, fontSize: compact ? '12px' : '14px',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {release.artist}
        </p>
      </div>
    </CardShell>
  )
}
