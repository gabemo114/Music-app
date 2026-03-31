import { useState, useEffect } from 'react'

export default function IntroAnimation({ onDone }) {
  const [dots, setDots] = useState('')
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'))
    }, 400)

    const fadeTimer = setTimeout(() => setFading(true), 2600)
    const doneTimer = setTimeout(() => onDone(), 3100)

    return () => {
      clearInterval(dotInterval)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: '#09090b',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '32px', zIndex: 100,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vinylPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(139,92,246,0.2); }
          50% { box-shadow: 0 0 80px rgba(139,92,246,0.5); }
        }
      `}</style>

      {/* Vinyl record */}
      <div style={{
        width: '180px', height: '180px', borderRadius: '50%',
        background: `
          radial-gradient(circle at center,
            #1c1c1e 0%, #1c1c1e 12%,
            #2a2a2e 12%, #2a2a2e 14%,
            #111113 14%, #111113 28%,
            #1e1e22 28%, #1e1e22 30%,
            #0d0d0f 30%, #0d0d0f 48%,
            #1a1a1e 48%, #1a1a1e 50%,
            #0a0a0c 50%, #0a0a0c 68%,
            #181820 68%, #181820 70%,
            #080808 70%
          )
        `,
        animation: 'spin 1.8s linear infinite, vinylPulse 2s ease-in-out infinite',
        position: 'relative',
      }}>
        {/* Center label */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
        }}>
          🎵
        </div>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#71717a', fontSize: '14px', letterSpacing: '0.15em',
          textTransform: 'uppercase', fontWeight: 500,
          fontFamily: 'system-ui, sans-serif',
          minWidth: '160px',
        }}>
          in rotation{dots}
        </p>
      </div>
    </div>
  )
}
