import { useState } from 'react'
import songs from './data/songs.json'

const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
const GENRES = [...new Set(songs.map(s => s.genre))]

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [search, setSearch] = useState('')
  const [playing, setPlaying] = useState(null)

  const filtered = songs.filter(s => {
    const matchDecade = !selectedDecade || s.decade === selectedDecade
    const matchGenre = !selectedGenre || s.genre === selectedGenre
    const matchSearch = search === '' ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
    return matchDecade && matchGenre && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>Music Time Machine</h1>
          <p style={{ color: '#71717a', fontSize: '13px', marginTop: '2px' }}>Travel through the decades</p>
        </div>
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '14px',
            color: '#fafafa',
            width: '260px',
            outline: 'none',
          }}
        />
      </header>

      {/* Genre tabs */}
      <div style={{ borderBottom: '1px solid #27272a', padding: '0 24px', display: 'flex', gap: '0' }}>
        <button
          onClick={() => setSelectedGenre(null)}
          style={{
            padding: '12px 20px', fontSize: '14px', fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer',
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
              padding: '12px 20px', fontSize: '14px', fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer',
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
      <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #27272a' }}>
        <button
          onClick={() => setSelectedDecade(null)}
          style={{
            padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
            border: '1px solid', cursor: 'pointer',
            background: selectedDecade === null ? '#fafafa' : '#18181b',
            color: selectedDecade === null ? '#09090b' : '#71717a',
            borderColor: selectedDecade === null ? '#fafafa' : '#3f3f46',
          }}
        >
          All decades
        </button>
        {DECADES.filter(d => songs.some(s => s.decade === d)).map(decade => (
          <button
            key={decade}
            onClick={() => setSelectedDecade(decade)}
            style={{
              padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
              border: '1px solid', cursor: 'pointer',
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
      <main style={{ padding: '24px' }}>
        <p style={{ color: '#52525b', fontSize: '13px', marginBottom: '16px' }}>
          {filtered.length} songs
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map((song) => {
            const isPlaying = playing === song.id
            return (
              <div
                key={song.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: isPlaying ? '#18181b' : 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#18181b'}
                onMouseLeave={e => e.currentTarget.style.background = isPlaying ? '#18181b' : 'transparent'}
                onClick={() => setPlaying(isPlaying ? null : song.id)}
              >
                <span style={{ color: '#52525b', fontSize: '13px', textAlign: 'right' }}>
                  {isPlaying ? '▶' : song.track}
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isPlaying ? '#a78bfa' : '#fafafa' }}>
                    {song.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#71717a', marginTop: '2px' }}>
                    {song.artist}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', textAlign: 'right' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billboard</p>
                    <p style={{ margin: 0, fontSize: '13px', color: song.billboard_peak === 1 ? '#facc15' : '#a1a1aa', fontWeight: song.billboard_peak <= 10 ? 600 : 400 }}>
                      #{song.billboard_peak}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>{song.year}</p>
                  </div>
                  <span style={{ color: '#52525b', fontSize: '13px' }}>{formatDuration(song.duration)}</span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: '#52525b', textAlign: 'center', paddingTop: '60px' }}>No songs match your search.</p>
        )}
      </main>
    </div>
  )
}
