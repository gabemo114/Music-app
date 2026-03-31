import { useState } from 'react'
import songs from '../data/songs.json'

const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
const GENRES = [...new Set(songs.map(s => s.genre))]

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LibraryPage({ onSongSelect }) {
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = songs.filter(s => {
    const matchDecade = !selectedDecade || s.decade === selectedDecade
    const matchGenre = !selectedGenre || s.genre === selectedGenre
    const matchSearch =
      search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
    return matchDecade && matchGenre && matchSearch
  })

  return (
    <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid #27272a' }}>
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: '#18181b', border: '1px solid #3f3f46',
            borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
            color: '#fafafa', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Genre tabs */}
      <div style={{ borderBottom: '1px solid #27272a', display: 'flex', overflowX: 'auto' }}>
        <button
          onClick={() => setSelectedGenre(null)}
          style={{
            padding: '12px 20px', fontSize: '14px', fontWeight: 500, flexShrink: 0,
            background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            color: selectedGenre === null ? '#fafafa' : '#71717a',
            borderBottom: selectedGenre === null ? '2px solid #fafafa' : '2px solid transparent',
          }}
        >
          All
        </button>
        {GENRES.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              padding: '12px 20px', fontSize: '14px', fontWeight: 500, flexShrink: 0,
              background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: selectedGenre === genre ? '#fafafa' : '#71717a',
              borderBottom: selectedGenre === genre ? '2px solid #fafafa' : '2px solid transparent',
              textTransform: 'capitalize',
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Decade filter */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #27272a' }}>
        <button
          onClick={() => setSelectedDecade(null)}
          style={{
            padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
            border: '1px solid', cursor: 'pointer', flexShrink: 0,
            background: selectedDecade === null ? '#fafafa' : '#18181b',
            color: selectedDecade === null ? '#09090b' : '#71717a',
            borderColor: selectedDecade === null ? '#fafafa' : '#3f3f46',
          }}
        >
          All
        </button>
        {DECADES.filter(d => songs.some(s => s.decade === d)).map(decade => (
          <button
            key={decade}
            onClick={() => setSelectedDecade(decade)}
            style={{
              padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
              border: '1px solid', cursor: 'pointer', flexShrink: 0,
              background: selectedDecade === decade ? '#fafafa' : '#18181b',
              color: selectedDecade === decade ? '#09090b' : '#71717a',
              borderColor: selectedDecade === decade ? '#fafafa' : '#3f3f46',
            }}
          >
            {decade}
          </button>
        ))}
      </div>

      {/* Song list */}
      <div style={{ padding: '16px' }}>
        <p style={{ color: '#52525b', fontSize: '13px', marginBottom: '12px' }}>
          {filtered.length} songs
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map(song => (
            <div
              key={song.id}
              onClick={() => onSongSelect(song)}
              style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                alignItems: 'center', gap: '12px',
                padding: '10px 10px', borderRadius: '8px', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#18181b'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#52525b', fontSize: '13px', textAlign: 'right' }}>{song.track}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#fafafa' }}>{song.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#71717a' }}>{song.artist}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'right' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chart</p>
                  <p style={{ margin: 0, fontSize: '13px', color: song.billboard_peak === 1 ? '#facc15' : '#a1a1aa', fontWeight: song.billboard_peak <= 10 ? 600 : 400 }}>
                    #{song.billboard_peak}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>{song.year}</p>
                </div>
                <span style={{ color: '#52525b', fontSize: '13px' }}>{formatDuration(song.duration)}</span>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ color: '#52525b', textAlign: 'center', paddingTop: '40px' }}>No songs match your search.</p>
        )}
      </div>
    </div>
  )
}
