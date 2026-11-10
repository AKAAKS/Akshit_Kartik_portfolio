import { useEffect, useRef } from 'react'

/* What is behind the craft.
 *
 * Drawn, not lit — this is the half of "space" that generated pages get wrong.
 * Marks are printed the way a star atlas prints them: open circles sized by
 * magnitude, plus-ticks for the bright ones, and the
 * occasional rock in contour. No glow, no twinkle, no gradient, no opacity
 * animation, nothing that pulses.
 *
 * It drifts slowly against the scroll so the page reads as travel along the
 * station. The band is generated once from a fixed seed and stacked three
 * times, so the drift wraps seamlessly, tall viewports stay covered, and
 * nothing is ever regenerated mid-scroll. Under prefers-reduced-motion the
 * transform is simply never applied.
 *
 * Marks are placed with percentage x so they spread across any width without
 * distorting. That means nested <svg> for the composite marks: percentages are
 * legal on x/y, and calc() is not legal in SVG geometry attributes at all. */

const BAND = 1000   // px of pattern before it repeats
const COPIES = 3    // enough that a tall viewport is never short of field
const RATE = 0.08   // parallax: 8% of scroll distance

/* A small deterministic PRNG. The field must be identical on every render and
 * every reload — a field that reshuffles is a field you notice. */
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function buildBand() {
  const r = rng(20260211)
  const marks = []

  /* Stars, by magnitude the way an atlas prints them: a great many faint
   * points, progressively fewer bright ones, and only the brightest get a
   * plus-tick. The steep falloff is what keeps a dense field from reading as
   * noise — an even spread of equal dots looks like a texture, not a sky. */
  for (let i = 0; i < 124; i += 1) {
    const x = r() * 100
    const y = r() * BAND
    const m = r()
    if (m > 0.955) marks.push({ t: 'tick', x, y, s: 5 })
    else if (m > 0.9) marks.push({ t: 'tick', x, y, s: 3.6 })
    else if (m > 0.78) marks.push({ t: 'ring', x, y, s: 2.8 })
    else if (m > 0.66) marks.push({ t: 'ring', x, y, s: 1.9 })
    else if (m > 0.4) marks.push({ t: 'dot', x, y, s: 1.4 })
    else marks.push({ t: 'dot', x, y, s: 0.9 })
  }

  // a few close pairs — real fields have them, even spacing does not
  for (let i = 0; i < 5; i += 1) {
    const x = r() * 100
    const y = r() * BAND
    marks.push({ t: 'dot', x, y, s: 1.3 })
    marks.push({ t: 'dot', x: x + 0.5 + r() * 0.7, y: y + 3 + r() * 4, s: 1 })
  }

  // rocks, in contour — deliberately not circles
  for (let i = 0; i < 2; i += 1) {
    marks.push({ t: 'rock', x: 6 + r() * 88, y: r() * BAND })
  }

  return marks
}

const BAND_MARKS = buildBand()

function Marks({ offset }) {
  return (
    <g transform={`translate(0 ${offset})`}>
      {BAND_MARKS.map((m, i) => {
        const key = `${offset}-${i}`

        if (m.t === 'dot') {
          return <circle key={key} className="sf-dot" cx={`${m.x}%`} cy={m.y} r={m.s} />
        }

        if (m.t === 'ring') {
          return <circle key={key} className="sf-ring" cx={`${m.x}%`} cy={m.y} r={m.s} />
        }

        if (m.t === 'tick') {
          const s = m.s
          return (
            <svg key={key} className="sf-tick" x={`${m.x}%`} y={m.y - 10} viewBox="-10 -10 20 20" width="20" height="20">
              <line x1="0" y1={-s} x2="0" y2={s} />
              <line x1={-s} y1="0" x2={s} y2="0" />
              <circle className="sf-dot" cx="0" cy="0" r="1.3" />
            </svg>
          )
        }

        return (
          <svg key={key} className="sf-rock" x={`${m.x}%`} y={m.y - 14} viewBox="-14 -14 28 28" width="28" height="28">
            <path d="M -9 2 L -5 -7 L 3 -9 L 10 -3 L 8 6 L 0 10 L -7 8 Z" />
            <path className="sf-rock-shade" d="M 3 -9 L 10 -3 L 8 6 L 2 1 Z" />
          </svg>
        )
      })}
    </g>
  )
}

export default function SpaceField() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const apply = () => {
      raf = 0
      // wrap within one band so the stacked copies hide the seam
      const y = -((window.scrollY * RATE) % BAND)
      // 2D translate on purpose: translate3d promotes a 3000px layer
      el.style.transform = `translateY(${y}px)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="spacefield" aria-hidden="true">
      <svg className="sf-svg" ref={ref} width="100%" height={BAND * COPIES} focusable="false">
        {Array.from({ length: COPIES }).map((_, i) => (
          <Marks key={i} offset={i * BAND} />
        ))}
      </svg>
    </div>
  )
}
