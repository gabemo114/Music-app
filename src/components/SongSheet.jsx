import { useState, useEffect, useRef } from 'react'
import { db } from '../lib/firebase'
import { albumArtUrl, artistArtUrl } from '../lib/plex'
import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc
} from 'firebase/firestore'

const DECADE_GRADIENTS = {
  '1960s': 'linear-gradient(135deg, #b45309, #92400e, #78350f)',
  '1970s': 'linear-gradient(135deg, #a16207, #854d0e, #713f12)',
  '1980s': 'linear-gradient(135deg, #7c3aed, #be185d, #9d174d)',
  '1990s': 'linear-gradient(135deg, #065f46, #1e3a5f, #1e1b4b)',
  '2000s': 'linear-gradient(135deg, #1e40af, #1e3a8a, #312e81)',
  '2010s': 'linear-gradient(135deg, #0f766e, #0369a1, #1e40af)',
  '2020s': 'linear-gradient(135deg, #6d28d9, #4f46e5, #1d4ed8)',
}

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}


export default function SongSheet({ song, onClose, currentSong, isPlaying, onPlayPause, onSongSelect }) {
  const [memories, setMemories] = useState([])
  const [newMemory, setNewMemory] = useState('')
  const [saving, setSaving] = useState(false)
  const [artErrored, setArtErrored] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeTimerRef = useRef(null)

  function handleClose() {
    setClosing(true)
    closeTimerRef.current = setTimeout(() => {
      setClosing(false)
      onClose()
    }, 280)
  }

  // Reset closing state if song changes (e.g. new song opened while closing)
  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current)
  }, [])

  useEffect(() => {
    if (song) setClosing(false)
  }, [song])

  useEffect(() => {
    setArtErrored(false)
    if (!song) return
    const q = query(
      collection(db, 'memories', song.id, 'entries'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, snap => {
      setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [song?.id])

  async function addMemory() {
    if (!newMemory.trim()) return
    setSaving(true)
    await addDoc(collection(db, 'memories', song.id, 'entries'), {
      text: newMemory.trim(),
      createdAt: serverTimestamp(),
    })
    setNewMemory('')
    setSaving(false)
  }

  async function deleteMemory(memoryId) {
    await deleteDoc(doc(db, 'memories', song.id, 'entries', memoryId))
  }

  if (!song) return null

  const blurGradient = song.blurColors
    ? `linear-gradient(160deg, ${song.blurColors.topLeft} 0%, ${song.blurColors.topRight} 50%, ${song.blurColors.bottomRight} 100%)`
    : null
  const gradient = blurGradient || DECADE_GRADIENTS[song.decade] || DECADE_GRADIENTS['1960s']
  const artSrc = song.thumb && !artErrored ? albumArtUrl(song.thumb, 400) : null
  const bgArtSrc = song.artistArt ? artistArtUrl(song.artistArt) : null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        onTouchEnd={(e) => { e.stopPropagation(); handleClose() }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 40, backdropFilter: 'blur(4px)',
          animation: closing ? 'fadeOut 0.28s ease-in forwards' : 'fadeIn 0.25s ease-out',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#09090b', borderTop: '1px solid #27272a',
        borderRadius: '16px 16px 0 0',
        zIndex: 50, maxHeight: '92vh', overflowY: 'auto',
        animation: closing ? 'slideDown 0.28s ease-in forwards' : 'slideUp 0.25s ease-out',
      }}>
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        `}</style>

        {/* Hero header with artist background art */}
        <div style={{
          position: 'relative', borderRadius: '16px 16px 0 0',
          overflow: 'hidden', background: gradient, minHeight: '160px',
        }}>
          {bgArtSrc && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${bgArtSrc})`,
              backgroundSize: 'cover', backgroundPosition: 'center top',
              opacity: 0.35,
            }} />
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
            background: 'linear-gradient(to top, #09090b 0%, transparent 100%)',
          }} />

          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.3)' }} />
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute', top: '16px', right: '20px', zIndex: 1,
              background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff',
              borderRadius: '9999px', width: '28px', height: '28px',
              cursor: 'pointer', fontSize: '14px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {/* Cover art + title inside hero */}
          <div style={{ position: 'relative', zIndex: 1, padding: '16px 24px 24px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            {artSrc ? (
              <img
                src={artSrc}
                alt={song.title}
                onError={() => setArtErrored(true)}
                style={{
                  width: '90px', height: '90px', borderRadius: '10px',
                  objectFit: 'cover', flexShrink: 0,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
              />
            ) : (
              <div style={{
                width: '90px', height: '90px', borderRadius: '10px',
                background: gradient, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
              }}>
                🎵
              </div>
            )}
            <div style={{ overflow: 'hidden', paddingBottom: '4px', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>
                {song.genre} {song.decade ? `· ${song.decade}` : ''}
              </p>
              <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900, lineHeight: 1.2, color: '#fff' }}>
                {song.title}
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {song.artist || 'Unknown Artist'}
              </p>
              {song.album && (
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{song.album}</p>
              )}

              {/* Play button — only shown if track has a stream */}
              {song.streamKey && (
                <button
                  onClick={() => {
                    if (currentSong?.id === song.id) {
                      onPlayPause()
                    } else {
                      onSongSelect(song)
                    }
                  }}
                  style={{
                    marginTop: '12px',
                    background: '#fafafa', color: '#09090b', border: 'none',
                    borderRadius: '9999px', padding: '7px 20px',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {currentSong?.id === song.id && isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px 40px' }}>



          {/* Metadata grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px', marginBottom: '28px',
          }}>
            {[
              { label: 'Year', value: song.year || '—' },
              song.billboard_peak
                ? { label: 'Billboard', value: `#${song.billboard_peak}`, highlight: song.billboard_peak === 1 ? '#facc15' : song.billboard_peak <= 10 ? '#a78bfa' : null }
                : { label: 'Genre', value: song.genre || '—' },
              { label: 'Duration', value: formatDuration(song.duration) || '—' },
              song.billboard_peak_date
                ? { label: 'Charted', value: formatDate(song.billboard_peak_date), span: 2 }
                : { label: 'Album', value: song.album || '—', span: 2 },
              { label: 'Decade', value: song.decade || '—' },
            ].map(({ label, value, highlight, span }) => (
              <div
                key={label}
                style={{
                  background: '#18181b', borderRadius: '10px', padding: '12px 14px',
                  gridColumn: span ? `span ${span}` : undefined,
                }}
              >
                <p style={{ margin: 0, fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {label}
                </p>
                <p style={{
                  margin: 0, fontSize: '14px', fontWeight: 600,
                  color: highlight || '#fafafa',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Memories */}
          <div>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Memories</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <textarea
                placeholder="What does this song remind you of?"
                value={newMemory}
                onChange={e => setNewMemory(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMemory() } }}
                rows={2}
                style={{
                  flex: 1, background: '#18181b', border: '1px solid #3f3f46',
                  borderRadius: '8px', padding: '10px 12px', fontSize: '14px',
                  color: '#fafafa', outline: 'none', resize: 'none', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={addMemory}
                disabled={saving || !newMemory.trim()}
                style={{
                  background: '#fafafa', color: '#09090b', border: 'none',
                  borderRadius: '8px', padding: '0 16px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer',
                  opacity: saving || !newMemory.trim() ? 0.4 : 1, alignSelf: 'stretch',
                }}
              >
                Save
              </button>
            </div>

            {memories.length === 0 ? (
              <p style={{ color: '#52525b', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                No memories yet. Add your first one above.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {memories.map(m => (
                  <div key={m.id} style={{
                    background: '#18181b', borderRadius: '10px', padding: '14px',
                    display: 'flex', justifyContent: 'space-between', gap: '12px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: '#e4e4e7' }}>{m.text}</p>
                      {m.createdAt && (
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#52525b' }}>
                          {m.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMemory(m.id)}
                      style={{
                        background: 'none', border: 'none', color: '#52525b',
                        cursor: 'pointer', fontSize: '14px', padding: '0 4px', alignSelf: 'flex-start',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
