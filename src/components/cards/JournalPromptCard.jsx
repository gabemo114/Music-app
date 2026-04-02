import { albumArtUrl } from '../../lib/plex'
import CardShell from './CardShell'

const PROMPTS = [
  "Where were you the first time you heard this?",
  "What does this song remind you of?",
  "Who introduced you to this artist?",
  "What were you going through when this album came out?",
  "What is the memory that comes to mind instantly?",
  "When do you listen to this most?",
  "What would you tell someone hearing this for the first time?",
  "Has your feeling about this song changed over time?",
]

export default function JournalPromptCard({ card, onSelect, compact }) {
  const { song, prompt } = card
  const bgSrc = song.thumb ? albumArtUrl(song.thumb, compact ? 400 : 800) : null

  return (
    <CardShell
      bgSrc={bgSrc}
      blurColors={song.blurColors}
      compact={compact}
      onClick={() => onSelect(song)}
      badge="✍️ Journal Prompt"
    >
      <div>
        <p style={{
          margin: '0 0 12px',
          fontSize: compact ? '15px' : '20px',
          fontWeight: 700, lineHeight: 1.35,
          color: '#fff', fontStyle: 'italic',
          letterSpacing: '-0.2px',
        }}>
          "{prompt}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{
            margin: 0, fontSize: compact ? '12px' : '13px',
            color: 'rgba(255,255,255,0.5)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>
            {song.title} · {song.artist}
          </p>
          <div style={{
            flexShrink: 0, marginLeft: '10px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            borderRadius: '9999px', padding: '5px 14px',
            fontSize: '12px', fontWeight: 700, color: '#fff',
          }}>
            Write →
          </div>
        </div>
      </div>
    </CardShell>
  )
}
