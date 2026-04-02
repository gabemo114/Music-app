import { useState, useEffect } from 'react'
import { fetchGeniusFact } from '../../lib/genius'

export default function TILCard({ card, compact }) {
  const { fact } = card
  const [geniusFact, setGeniusFact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!fact.artist) {
      setLoading(false)
      return
    }
    // Use song title if available, fall back to just artist name
    const title = fact.song || fact.artist
    fetchGeniusFact(title, fact.artist)
      .then(result => {
        if (result?.fact) setGeniusFact(result)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [fact.artist, fact.song])

  const displayFact = geniusFact?.fact || fact.fact
  const displayArtist = geniusFact?.artist || fact.artist
  const isLive = !!geniusFact?.fact

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #18181b 0%, #1c1917 100%)',
      border: '1px solid #27272a',
      borderRadius: compact ? '14px' : '20px',
      padding: compact ? '20px' : '32px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Top */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: compact ? '14px' : '24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '9999px',
            padding: '4px 12px',
          }}>
            <span style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              💡 Did You Know
            </span>
          </div>
          {!loading && isLive && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,204,0,0.12)',
              border: '1px solid rgba(255,204,0,0.3)',
              borderRadius: '9999px',
              padding: '4px 10px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffd700' }}>G</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,215,0,0.8)', fontWeight: 600, letterSpacing: '0.05em' }}>Genius</span>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #7c3aed', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ margin: 0, color: '#52525b', fontSize: '14px' }}>Looking up facts…</p>
          </div>
        ) : (
          <p style={{
            margin: 0, color: '#e4e4e7',
            fontSize: compact ? '14px' : '18px',
            lineHeight: compact ? 1.5 : 1.65,
            fontWeight: 400,
          }}>
            "{displayFact}"
          </p>
        )}
      </div>

      {/* Bottom attribution */}
      {!loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {geniusFact?.thumbnailUrl ? (
              <img
                src={geniusFact.thumbnailUrl}
                alt={displayArtist}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0,
              }}>🎤</div>
            )}
            <div>
              <p style={{ margin: 0, fontSize: compact ? '12px' : '14px', fontWeight: 600, color: '#fafafa' }}>
                {displayArtist}
              </p>
              {fact.song && (
                <p style={{ margin: 0, fontSize: '11px', color: '#52525b' }}>{fact.song}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
