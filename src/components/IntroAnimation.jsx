import { useState, useEffect } from 'react'

export default function IntroAnimation({ onDone }) {
  const [phase, setPhase] = useState('in') // 'in' | 'hold' | 'out'

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('out'), 1800)
    const doneTimer = setTimeout(() => onDone(), 2400)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: '#09090b',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
      opacity: phase === 'out' ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <style>{`
        @keyframes epochFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes epochTagline {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          margin: 0,
          fontSize: '52px',
          fontWeight: 900,
          letterSpacing: '-2px',
          color: '#fafafa',
          fontFamily: "'Lato', system-ui, sans-serif",
          animation: 'epochFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}>
          Epoch
        </h1>
        <p style={{
          margin: '10px 0 0',
          fontSize: '13px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#3f3f46',
          fontFamily: "'Lato', system-ui, sans-serif",
          fontWeight: 300,
          animation: 'epochTagline 0.8s ease 0.4s both',
        }}>
          your library · your story
        </p>
      </div>
    </div>
  )
}
