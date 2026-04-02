/**
 * Shared shell for all feed cards.
 * Full-bleed background image, gradient scrim, badge top-left, content bottom.
 */
export default function CardShell({ bgSrc, blurColors, compact, onClick, badge, children, accentColor }) {
  const fallbackBg = blurColors
    ? `linear-gradient(160deg, ${blurColors.topLeft} 0%, ${blurColors.topRight} 50%, ${blurColors.bottomRight} 100%)`
    : 'linear-gradient(160deg, #18181b, #09090b)'

  return (
    <div
      onClick={onClick}
      style={{
        width: '100%', height: '100%',
        borderRadius: compact ? '16px' : '20px',
        overflow: 'hidden', position: 'relative',
        cursor: 'pointer',
        background: fallbackBg,
      }}
    >
      {/* Full-bleed background image */}
      {bgSrc && (
        <img
          src={bgSrc}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top scrim for badge legibility */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom scrim for text legibility */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Badge — top left */}
      {badge && (
        <div style={{
          position: 'absolute', top: compact ? '12px' : '16px', left: compact ? '12px' : '16px',
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          borderRadius: '9999px', padding: '4px 10px',
          border: `1px solid ${accentColor || 'rgba(255,255,255,0.15)'}`,
        }}>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: accentColor || 'rgba(255,255,255,0.85)',
          }}>
            {badge}
          </span>
        </div>
      )}

      {/* Content slot — bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: compact ? '14px' : '20px',
      }}>
        {children}
      </div>
    </div>
  )
}
