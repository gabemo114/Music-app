import { albumArtUrl } from '../../lib/plex'

const PROMPTS = [
  'Where were you the first time you heard this?',
  'What does this song remind you of?',
  'Who introduced you to this artist?',
  'What were you going through when this album came out?',
  'What's the memory that comes to mind instantly?',
  'When do you listen to this most?',
  'What would you tell someone hearing this for the first time?',
  'Has your feeling about this song changed over time?',
]

function blurToGradient(blurColors, fallback) {
  if (!blurColors) return fallback
  return `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
}

export default function JournalPromptCard({ card, onSelect, compact }) {
  const { song, prompt } = card
  const artSrc = song.thumb ? albumArtUrl(song.thumb, compact ? 200 : 400) : null
  const gradient = blurToGradient(song.blurColors, 'linear-gradient(160deg, #1c1917, #292524, #1c1917)')

  return (
    <div
      onClick={() => onSelect(song)}
      style={{
        width: '100%', height: '100%',
        background: gradient,
        borderRadius: compact ? '14px' : '20px',
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Blurred art bg */}
      {artSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${artSrc})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, filter: 'blur(6px)', transform: 'scale(1.1)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', height: '100%', boxSizing: 'border-box',
        padding: compact ? '16px' : '28px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.1)', borderRadius: '9999px',
          padding: '4px 12px', alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ✍️ Journal Prompt
          </span>
        </div>

        {/* Center — the prompt */}
        <div>
          <p style={{
            margin: '0 0 16px',
            fontSize: compact ? '18px' : '24px',
            fontWeight: 700, lineHeight: 1.3,
            color: '#fff', fontStyle: 'italic',
            letterSpacing: '-0.2px',
          }}>
            "{prompt}"
          </p>

          {/* Song reference */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {artSrc && (
              <img
                src={artSrc}
                alt={song.title}
                style={{
                  width: compact ? '36px' : '44px',
                  height: compact ? '36px' : '44px',
                  borderRadius: '6px', objectFit: 'cover', flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              />
            )}
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: compact ? '13px' : '14px', fontWeight: 700, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {song.title}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {song.artist}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.12)', borderRadius: '9999px',
          padding: '6px 16px', alignSelf: 'flex-start',
          fontSize: '12px', fontWeight: 700, color: '#fafafa',
        }}>
          Write a memory →
        </div>
      </div>
    </div>
  )
}
