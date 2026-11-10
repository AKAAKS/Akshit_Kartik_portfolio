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

  /* SPIKE: bodies.
   *
   * Drawn as an atlas plate, not as scenery: a limb in contour, latitude
   * circles, a hatched night side, a designation and a scale bar. Cropped at
   * a page edge the way a plate crops a body too big for the sheet — which is
   * also what keeps it from reading as a sticker floating in the gutter.
   *
   * px x, not percent, because a body that is meant to be half off the edge
   * has to stay half off the edge at every width. */
  marks.push({ t: 'body', px: -118, y: BAND * 0.26, r: 212, phase: 0.6, desig: 'B-1', scale: '2 410 km' })
  marks.push({ t: 'body', x: 84, y: BAND * 0.72, r: 58, phase: 0.34, desig: 'B-2', scale: '680 km' })

  /* A transfer arc with range ticks. The one piece of plotted geometry out
   * here, so it is the one thing drawn in the accent rather than in ink. */
  marks.push({ t: 'traj', y: BAND * 0.46 })

  return marks
}

/* A body. Everything is derived from r so one function draws both. */
function Body({ r, phase, desig, scale }) {
  const lat = [-0.66, -0.36, 0, 0.36, 0.66]
  const term = r * (phase * 2 - 1)
  return (
    <>
      {/* the tint wash, under everything */}
      <circle className="sf-body" cx="0" cy="0" r={r} />

      {/* night side: hatched between the limb and the terminator */}
      <path
        className="sf-night"
        d={`M0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${Math.abs(term)} ${r} 0 0 ${term > 0 ? 1 : 0} 0 ${-r} Z`}
      />

      {/* latitude circles, seen from the body's own plane */}
      {lat.map((f) => {
        const y = f * r
        const w = Math.sqrt(r * r - y * y)
        return (
          <path
            key={f}
            className="sf-lat"
            d={`M${-w} ${y} A ${w} ${w * 0.3} 0 0 0 ${w} ${y}`}
            fill="none"
          />
        )
      })}

      {/* the terminator itself, and the limb last so it sits over everything */}
      <path
        className="sf-term"
        d={`M0 ${-r} A ${Math.abs(term)} ${r} 0 0 ${term > 0 ? 1 : 0} 0 ${r}`}
        fill="none"
      />
      <circle className="sf-limb" cx="0" cy="0" r={r} fill="none" />

      {/* plate furniture: designation, and a bar that says how big it is */}
      <g className="sf-plate" transform={`translate(0 ${r + 20})`}>
        <line className="sf-bar" x1={-r * 0.32} y1="0" x2={r * 0.32} y2="0" />
        <line className="sf-bar" x1={-r * 0.32} y1="-4" x2={-r * 0.32} y2="4" />
        <line className="sf-bar" x1={r * 0.32} y1="-4" x2={r * 0.32} y2="4" />
        <text className="sf-txt" x="0" y="16" textAnchor="middle">{desig} · {scale}</text>
      </g>
    </>
  )
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

        if (m.t === 'body') {
          const R = m.r
          const box = R * 2 + 90
          return (
            <svg
              key={key}
              className="sf-bodysvg"
              x={m.px !== undefined ? m.px : `${m.x}%`}
              y={m.y - box / 2}
              viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`}
              width={box}
              height={box}
            >
              <Body r={R} phase={m.phase} desig={m.desig} scale={m.scale} />
            </svg>
          )
        }

        if (m.t === 'traj') {
          /* Stretched to the page: an arc and a straight tick survive a
           * non-uniform scale, which is why the ticks are drawn vertical. */
          return (
            <svg
              key={key}
              className="sf-traj"
              x="0"
              y={m.y}
              width="100%"
              height="260"
              viewBox="0 0 1000 260"
              preserveAspectRatio="none"
            >
              <path className="sf-arc" d="M -20 240 Q 420 -90 1020 110" fill="none" />
              {[0.18, 0.36, 0.54, 0.72, 0.9].map((t) => {
                const u = 1 - t
                const x = u * u * -20 + 2 * u * t * 420 + t * t * 1020
                const y = u * u * 240 + 2 * u * t * -90 + t * t * 110
                return <line key={t} className="sf-tick2" x1={x} y1={y - 6} x2={x} y2={y + 6} />
              })}
            </svg>
          )
        }

        return (
          <svg key={key} className="sf-rock" x={`${m.x}%`} y={m.y - 14} viewBox="-14 -14 28 28" width="28" height="28">
            <path className="sf-rock-tint" d="M -9 2 L -5 -7 L 3 -9 L 10 -3 L 8 6 L 0 10 L -7 8 Z" />
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
        {/* SPIKE: the night-side hatch. One definition for every body. */}
        <defs>
          <pattern id="sf-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line className="sf-hatchline" x1="0" y1="0" x2="0" y2="7" />
          </pattern>
        </defs>
        {Array.from({ length: COPIES }).map((_, i) => (
          <Marks key={i} offset={i * BAND} />
        ))}
      </svg>
    </div>
  )
}
