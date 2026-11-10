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
   * These are the one thing on the page that is NOT a drawing. The ship is
   * the schematic; what it is flying through is real. So a body gets shading,
   * banding and a soft terminator, and it gets no outline, no latitude
   * circles, no designation and no scale bar - all of which were turning it
   * into another diagram.
   *
   * px x, not percent, because a body meant to be half off the edge has to
   * stay half off the edge at every width. */
  marks.push({ t: 'body', px: -118, y: BAND * 0.26, r: 212, kind: 'giant' })
  marks.push({ t: 'body', x: 84, y: BAND * 0.72, r: 58, kind: 'rock' })

  /* A transfer arc with range ticks. The one piece of plotted geometry out
   * here, so it is the one thing drawn in the accent rather than in ink. */
  marks.push({ t: 'traj', y: BAND * 0.46 })

  return marks
}

/* A body.
 *
 * Shading is one offset radial gradient: lit toward the upper left, falling
 * off into a darkened limb on the other side. That single gradient is what
 * makes a flat circle read as a sphere, and it is why these are the only
 * elements on the site allowed to carry one.
 *
 * Surface is flat shapes clipped to the disc - bands for a giant, maria for a
 * rocky body. Deliberately low contrast: at this opacity the eye reads them
 * as surface rather than as pattern. */
/* Wider apart in hue than the first pass, which sat in such a narrow band of
 * slate that the banding read as noise rather than as a surface. */
const GIANT = ['#55678A', '#A3B2C6', '#495B80', '#BCC8D6', '#5F7094', '#8C9DB5']

/* Craters, as fractions of the radius: x, y, size. Hand-placed rather than
 * random - a real surface has a few big basins and a scatter of small ones,
 * and an even sprinkle of equal circles is what makes a moon look like a golf
 * ball. */
const CRATERS = [
  [-0.30, -0.26, 0.21], [0.27, 0.11, 0.17], [-0.08, 0.40, 0.14],
  [0.44, -0.38, 0.11], [-0.55, 0.14, 0.10], [0.12, -0.52, 0.09],
  [-0.22, 0.04, 0.08], [0.58, 0.22, 0.07], [-0.44, -0.54, 0.06],
  [0.33, 0.49, 0.06], [0.02, 0.16, 0.05], [-0.62, -0.22, 0.05],
  [0.20, -0.18, 0.045], [-0.14, -0.66, 0.04], [0.50, -0.08, 0.04],
  [-0.36, 0.56, 0.035],
]

function Body({ r, kind, uid }) {
  const giant = kind === 'giant'
  const base = giant ? '#8794A7' : '#8A8F96'

  const surface = []
  if (giant) {
    /* Bands of uneven height, because evenly striped is a beach ball. */
    const h = [0.18, 0.1, 0.22, 0.13, 0.19, 0.18]
    let y = -r
    h.forEach((f, i) => {
      const hh = f * 2 * r
      surface.push(
        <rect key={`b${i}`} x={-r} y={y} width={r * 2} height={hh} fill={GIANT[i % GIANT.length]} />,
      )
      y += hh
    })
    // one storm, the asymmetry that stops it reading as wallpaper
    surface.push(
      <ellipse key="storm" cx={r * 0.28} cy={r * 0.14} rx={r * 0.21} ry={r * 0.1} fill="#44557A" />,
    )
  } else {
    /* Each crater is two ellipses: a floor, and a rim offset AWAY from the
     * light. The offset is the whole trick - it is what makes a flat disc
     * read as a dish rather than as a spot. Light is upper left, matching the
     * gradient below, so the rim shadow falls lower right. */
    CRATERS.forEach(([fx, fy, fs], i) => {
      const cx = fx * r
      const cy = fy * r
      const rad = fs * r
      // foreshorten toward the limb, so craters near the edge flatten
      const d = Math.min(1, Math.hypot(fx, fy))
      const sq = Math.sqrt(Math.max(0.12, 1 - d * d))
      surface.push(
        <g key={`c${i}`}>
          <ellipse cx={cx + rad * 0.14} cy={cy + rad * 0.14} rx={rad} ry={rad * sq} fill="#5F646C" />
          <ellipse cx={cx - rad * 0.08} cy={cy - rad * 0.08} rx={rad * 0.86} ry={rad * 0.86 * sq} fill="#969BA3" />
        </g>,
      )
    })
  }

  return (
    <g className="sf-planet">
      <defs>
        <clipPath id={`pc${uid}`}>
          <circle cx="0" cy="0" r={r} />
        </clipPath>
        <radialGradient id={`pg${uid}`} cx="33%" cy="29%" r="74%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A0F16" stopOpacity="0.66" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r={r} fill={base} />
      <g clipPath={`url(#pc${uid})`}>{surface}</g>
      <circle cx="0" cy="0" r={r} fill={`url(#pg${uid})`} />
    </g>
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
          const box = R * 2 + 8
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
              <Body r={R} kind={m.kind} uid={key} />
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
            <path className="sf-rock-body" d="M -9 2 L -5 -7 L 3 -9 L 10 -3 L 8 6 L 0 10 L -7 8 Z" />
            <path className="sf-rock-shade" d="M 3 -9 L 10 -3 L 8 6 L 2 1 Z" />
            <path className="sf-rock-edge" d="M -9 2 L -5 -7 L 3 -9 L 10 -3 L 8 6 L 0 10 L -7 8 Z" />
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
