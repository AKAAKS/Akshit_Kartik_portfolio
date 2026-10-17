import { motion, useReducedMotion } from 'framer-motion'

/* Floating holographic artifacts layered over the cutting-mat lattice.
 * All decorative + aria-hidden; rotation is disabled under reduced-motion. */

function Reticle({ size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 4" />
      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="7 3" />
      <circle cx="50" cy="50" r="2.4" fill="currentColor" />
      <line x1="50" y1="0" x2="50" y2="12" stroke="currentColor" strokeWidth="0.8" />
      <line x1="50" y1="88" x2="50" y2="100" stroke="currentColor" strokeWidth="0.8" />
      <line x1="0" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="0.8" />
      <line x1="88" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.8" />
      {/* tick marks around the outer ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180
        const r1 = 44
        const r2 = i % 2 === 0 ? 40 : 42
        return (
          <line
            key={i}
            x1={50 + r1 * Math.cos(a)}
            y1={50 + r1 * Math.sin(a)}
            x2={50 + r2 * Math.cos(a)}
            y2={50 + r2 * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="0.5"
          />
        )
      })}
    </svg>
  )
}

function Crosshair({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 6" />
      <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeWidth="0.4" />
      <line x1="8" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="0.4" />
      <rect x="40" y="40" width="20" height="20" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  )
}

const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1" />
    <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1" />
  </svg>
)

// Cutting-mat style registration marks, scattered at fixed spots.
const MARKS = [
  { top: '16%', left: '7%' },
  { top: '70%', left: '12%' },
  { top: '40%', left: '48%' },
  { top: '24%', left: '88%' },
  { top: '82%', left: '82%' },
  { top: '58%', left: '64%' },
]

export default function BgDecor() {
  const reduce = useReducedMotion()
  const spin = (dur, dir = 1) =>
    reduce ? {} : { animate: { rotate: 360 * dir }, transition: { duration: dur, ease: 'linear', repeat: Infinity } }

  return (
    <div className="bg-decor" aria-hidden="true">
      <motion.div className="decor reticle-c" style={{ top: '-80px', right: '-70px' }} {...spin(70)}>
        <Reticle size={340} />
      </motion.div>

      <motion.div className="decor reticle-g" style={{ bottom: '-60px', left: '-60px' }} {...spin(90, -1)}>
        <Crosshair size={300} />
      </motion.div>

      <motion.div
        className="decor reticle-c"
        style={{ top: '46%', left: '40%', opacity: 0.1 }}
        {...spin(120)}
      >
        <Reticle size={160} />
      </motion.div>

      {MARKS.map((m, i) => (
        <span key={i} className="decor plus" style={m}>
          <Plus />
        </span>
      ))}
    </div>
  )
}
