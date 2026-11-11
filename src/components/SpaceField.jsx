import { useEffect, useMemo, useRef, useState } from 'react'

/* What is behind the craft.
 *
 * Drawn, not lit — this is the half of "space" that generated pages get wrong.
 * No glow, no twinkle, no gradient, no opacity animation, nothing that pulses.
 *
 * Two registers, deliberately different. The SHIP is a technical schematic:
 * even-weight lines, three stroke widths, nothing shaded. The SKY is an
 * engraving: form carried entirely by how dense the hatching is, the way a
 * printed plate carries it. Bodies out here have no fill and no gradient —
 * an earlier pass gave them both and they read as stickers. A line that gets
 * tighter and heavier toward the shadow is what makes a disc a sphere.
 *
 * It drifts against the scroll in three layers at three rates, so the page
 * reads as travel rather than as a sheet sliding. Each band is generated once
 * from a fixed seed and stacked, so the drift wraps seamlessly and nothing is
 * regenerated mid-scroll. Under prefers-reduced-motion no transform is ever
 * applied.
 *
 * Marks are placed with percentage x so they spread across any width without
 * distorting. That means nested <svg> for the composite marks: percentages
 * are legal on x/y, and calc() is not legal in SVG geometry attributes. */

const BAND = 1000 // px of pattern before it repeats
const COPIES = 3 // enough that a tall viewport is never short of field

/* Depth. One rate for everything was what made the scroll feel flat:
 * differential motion is the only depth cue available on a white page, and
 * without it the whole field reads as a single sheet sliding. Far stars
 * barely move, rocks move noticeably, and the eye does the rest. */
const LAYERS = [
  { key: 'far', rate: 0.03 },
  { key: 'mid', rate: 0.075 },
  { key: 'near', rate: 0.17 },
]

/* A small deterministic PRNG. The field must be identical on every render and
 * every reload — a field that reshuffles is a field you notice. */
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function buildBands(narrow) {
  const r = rng(20260211)
  const far = []
  const mid = []
  const near = []

  /* Stars, by magnitude the way an atlas prints them: a great many faint
   * points, progressively fewer bright ones, and only the brightest get a
   * plus-tick. The steep falloff is what keeps a dense field from reading as
   * noise — an even spread of equal dots looks like a texture, not a sky.
   *
   * Brightness doubles as depth: faint ones go to the slow layer, bright ones
   * to the middle. That is also the right way round physically. */
  for (let i = 0; i < 124; i += 1) {
    const x = r() * 100
    const y = r() * BAND
    const m = r()
    if (m > 0.955) mid.push({ t: 'tick', x, y, s: 5 })
    else if (m > 0.9) mid.push({ t: 'tick', x, y, s: 3.6 })
    else if (m > 0.78) mid.push({ t: 'ring', x, y, s: 2.8 })
    else if (m > 0.66) far.push({ t: 'ring', x, y, s: 1.9 })
    else if (m > 0.4) far.push({ t: 'dot', x, y, s: 1.4 })
    else far.push({ t: 'dot', x, y, s: 0.9 })
  }

  // a few close pairs — real fields have them, even spacing does not
  for (let i = 0; i < 5; i += 1) {
    const x = r() * 100
    const y = r() * BAND
    far.push({ t: 'dot', x, y, s: 1.3 })
    far.push({ t: 'dot', x: x + 0.5 + r() * 0.7, y: y + 3 + r() * 4, s: 1 })
  }

  // small rocks, in contour — deliberately not circles
  for (let i = 0; i < 2; i += 1) {
    near.push({ t: 'rock', x: 6 + r() * 88, y: r() * BAND })
  }

  /* Bodies. The large one crops a page edge, which is why its x is in px and
   * not a percentage — half off the edge has to stay half off the edge at
   * every width.
   *
   * On a phone the desktop giant is a disaster: 424px of dense latitude
   * hatching across a 375px viewport, so it stops being a body in the gutter
   * and becomes wallpaper behind the text. Narrow screens get a much smaller
   * one pushed almost entirely off the edge, so only a limb shows — which is
   * what it was ever meant to read as. */
  if (narrow) {
    mid.push({ t: 'giant', px: -150, y: BAND * 0.26, r: 104 })
    mid.push({ t: 'ringed', x: 84, y: BAND * 0.76, r: 30 })
  } else {
    mid.push({ t: 'giant', px: -118, y: BAND * 0.26, r: 212 })
    mid.push({ t: 'ringed', x: 78, y: BAND * 0.76, r: 52 })
  }

  /* A transfer arc with range ticks: plotted geometry rather than a body, so
   * it stays schematic and stays in the accent. */
  near.push({ t: 'traj', y: BAND * 0.44 })

  return { far, mid, near }
}

/* One continuous field, the height of the whole page.
 *
 * This is the phone version, and it exists because of how 1:1 scrolling has
 * to be built. A parallax field only ever needs one band: it is stacked and
 * wrapped, so BAND px of pattern covers an unbounded scroll. A field that
 * moves WITH the page cannot wrap - every pixel of the document is on screen
 * at some point - so it has to be as tall as the document.
 *
 * Repeating the 1000px band to get there was the obvious move and it looks
 * wrong: eight copies down the page means the same gas giant passing eight
 * times at even intervals, which reads as tiling rather than as sky. So the
 * field is generated once at the real height instead, at the same density per
 * 1000px, with the bodies placed individually.
 *
 * Same seed, so it is still identical on every reload. */
function buildTall(h) {
  const r = rng(20260211)
  const far = []
  const mid = []
  const near = []

  const n = Math.round(124 * (h / BAND))
  for (let i = 0; i < n; i += 1) {
    const x = r() * 100
    const y = r() * h
    const m = r()
    if (m > 0.955) mid.push({ t: 'tick', x, y, s: 5 })
    else if (m > 0.9) mid.push({ t: 'tick', x, y, s: 3.6 })
    else if (m > 0.78) mid.push({ t: 'ring', x, y, s: 2.8 })
    else if (m > 0.66) far.push({ t: 'ring', x, y, s: 1.9 })
    else if (m > 0.4) far.push({ t: 'dot', x, y, s: 1.4 })
    else far.push({ t: 'dot', x, y, s: 0.9 })
  }

  for (let i = 0; i < Math.round(5 * (h / BAND)); i += 1) {
    const x = r() * 100
    const y = r() * h
    far.push({ t: 'dot', x, y, s: 1.3 })
    far.push({ t: 'dot', x: x + 0.5 + r() * 0.7, y: y + 3 + r() * 4, s: 1 })
  }

  for (let i = 0; i < Math.round(2 * (h / BAND)); i += 1) {
    near.push({ t: 'rock', x: 6 + r() * 88, y: r() * h })
  }

  /* Placed by hand rather than scattered, because there are only four and a
   * body landing on top of another is the one arrangement that looks like a
   * mistake. Spread so something passes roughly every screen and a half, and
   * at two sizes so the two limbs do not read as the same object twice. */
  /* High enough to sit in the approach frame rather than just below it.
   * SPIKE-adjacent: with the landing in place, 0.07 put the limb a screen
   * under the fold, so the first thing a phone showed was bare stars. */
  mid.push({ t: 'giant', px: -150, y: h * 0.022, r: 104 })
  mid.push({ t: 'ringed', x: 84, y: h * 0.29, r: 30 })
  mid.push({ t: 'giant', px: -104, y: h * 0.58, r: 74 })
  mid.push({ t: 'ringed', x: 18, y: h * 0.83, r: 23 })

  near.push({ t: 'traj', y: h * 0.38 })
  near.push({ t: 'traj', y: h * 0.91 })

  return { far, mid, near }
}

/* Both fields are built once, at module load. The seeded rng means the star
 * positions are identical in each; only the bodies differ, so crossing the
 * breakpoint resizes the planets without the sky jumping. */
const NARROW_Q = '(max-width: 860px)'
const BANDS_WIDE = buildBands(false)
const BANDS_NARROW = buildBands(true)

/* =========================================================================
 *  Engraving
 * ====================================================================== */

/* Latitude hatching across a sphere.
 *
 * Every arc bows the same way because the body is seen from slightly above
 * its equator, so the near side of each latitude circle sits lower on the
 * page. The lines span the full width of the disc and stay solid end to end:
 * they are the form.
 *
 * The roundness is NOT carried by the lines. It comes from the same trick
 * the hull uses to read as a cylinder — a flat ink gradient falling off
 * toward the edge, at the hull's own strength. Crosshatching the shadow was
 * the engraver's answer and it was heavier and rougher than this one. */
function latitudes(r, { n = 46, tilt = 0.24, band = 0 } = {}) {
  const out = []
  for (let i = 1; i < n; i += 1) {
    /* Spacing tightens toward the bottom. An even spread reads as a grille;
     * the squeeze is what an engraver does to darken a region. */
    const u = i / n
    const biased = u + 0.2 * u * (1 - u)
    const y = -r * 0.995 + 2 * r * 0.995 * biased
    const w = Math.sqrt(Math.max(0, r * r - y * y))
    if (w < r * 0.05) continue

    const sag = w * tilt
    const lit = (y + r) / (2 * r) // 0 at the top, 1 at the bottom

    /* The spread between lightest and heaviest line is still doing work: an
     * early pass ran 0.4 to 1.2 and the body collapsed into even grey. */
    let weight = 0.45 + lit * 1.75

    /* Banding, for a giant: clusters of heavy line with quieter gaps, not
     * one even field of hatch. */
    if (band) {
      const b = Math.sin((y / r) * band * Math.PI)
      weight *= 0.45 + 1.0 * (b * b)
    }

    out.push(
      <path
        key={`l${i}`}
        className="sf-lat"
        d={`M${-w} ${y} Q 0 ${y + sag} ${w} ${y}`}
        style={{ strokeWidth: weight }}
      />,
    )
  }
  return out
}

/* The sphere's shading, as one flat gradient.
 *
 * Lifted from .tube, which darkens toward both edges to read as a cylinder.
 * A sphere darkens toward its whole limb instead of two sides, so the same
 * falloff goes radial, and the centre is offset up and left to put the light
 * somewhere rather than nowhere. Alphas match the hull's: this is modelling,
 * not a shadow, and anything stronger turns the body back into a sticker. */
function Shade({ r, uid }) {
  return (
    <>
      <defs>
        <radialGradient id={`sg${uid}`} cx="36%" cy="31%" r="72%">
          <stop offset="0%" stopColor="#0F1113" stopOpacity="0" />
          <stop offset="58%" stopColor="#0F1113" stopOpacity="0.022" />
          <stop offset="88%" stopColor="#0F1113" stopOpacity="0.075" />
          <stop offset="100%" stopColor="#0F1113" stopOpacity="0.14" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r={r} fill={`url(#sg${uid})`} />
    </>
  )
}

/* The large body: a giant, banded. No rings — the small one carries those,
 * and two ringed bodies on one page is a motif rather than a sky. */
function Giant({ r, uid }) {
  return (
    <g className="sf-planet">
      <circle className="dfill" cx="0" cy="0" r={r} />
      <Shade r={r} uid={uid} />
      {latitudes(r, { n: 46, tilt: 0.26, band: 3 })}
      <circle className="sf-limb" cx="0" cy="0" r={r} />
    </g>
  )
}

/* The small distant body, after P1: a ringed planet. The ring passes BEHIND
 * the globe at the top and in FRONT of it at the bottom, which is the whole
 * illusion — draw both halves on one side and it collapses into a flat badge
 * with a hoop painted on it. */
const RINGS = [
  [1.5, 1.76],
  [1.86, 2.14],
  [2.22, 2.32],
]
const RING_TILT = -17

function Ringed({ r, uid }) {
  const ry = (rx) => rx * 0.26
  const arc = (rx, front) => `M${-rx} 0 A ${rx} ${ry(rx)} 0 0 ${front ? 0 : 1} ${rx} 0`
  const half = (front) =>
    RINGS.flatMap(([a, b], i) => [
      <path key={`${front}${i}a`} className="sf-ring-line" d={arc(r * a, front)} />,
      <path key={`${front}${i}b`} className="sf-ring-line" d={arc(r * b, front)} />,
    ])

  return (
    <g className="sf-planet">
      {/* ring, far half */}
      <g transform={`rotate(${RING_TILT})`}>{half(false)}</g>

      {/* the globe, on paper so it occludes the far half cleanly */}
      <circle className="dfill" cx="0" cy="0" r={r} />
      <Shade r={r} uid={uid} />
      {latitudes(r, { n: 26, tilt: 0.3, band: 2 })}
      <circle className="sf-limb" cx="0" cy="0" r={r} />

      {/* ring, near half — drawn over the globe, because it is in front */}
      <g transform={`rotate(${RING_TILT})`}>{half(true)}</g>
    </g>
  )
}

/* =========================================================================
 *  The field
 * ====================================================================== */

function Marks({ list, offset }) {
  return (
    <g transform={`translate(0 ${offset})`}>
      {list.map((m, i) => {
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

        if (m.t === 'giant' || m.t === 'ringed') {
          const R = m.r
          // the ringed body needs room either side for its rings
          const box = m.t === 'ringed' ? R * 5.2 : R * 2 + 8
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
              {m.t === 'giant' ? <Giant r={R} uid={key} /> : <Ringed r={R} uid={key} />}
            </svg>
          )
        }

        if (m.t === 'traj') {
          /* Stretched to the page: an arc and a straight tick both survive a
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
            <g className="sf-tumble">
              <path className="dfill" d="M -9 2 L -5 -7 L 3 -9 L 10 -3 L 8 6 L 0 10 L -7 8 Z" />
              <path className="sf-rock-shade" d="M 3 -9 L 10 -3 L 8 6 L 2 1 Z" />
              <path className="sf-rock-edge" d="M -9 2 L -5 -7 L 3 -9 L 10 -3 L 8 6 L 0 10 L -7 8 Z" />
            </g>
          </svg>
        )
      })}
    </g>
  )
}

export default function SpaceField() {
  const refs = useRef([])
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_Q).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(NARROW_Q)
    const onChange = () => setNarrow(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* How tall the page is, so the phone field can be built to fit it.
   *
   * Measured off <main> and not off documentElement.scrollHeight, which would
   * be circular: the field is absolutely positioned, so once it is tall it
   * contributes its own height back to the document and each measurement
   * would make the next one larger. <main> is the content and is unaffected
   * by it.
   *
   * Two heights, because they want opposite rounding. The field is GENERATED
   * at a height quantised up, so a one-pixel reflow does not reshuffle the
   * entire sky and the marks always reach the bottom of the page. The BOX is
   * the exact content height: rounding that up put 106px of empty scroll
   * below the engine, since an absolutely positioned layer taller than the
   * content extends the document. The svg overflows the box and .spacefield
   * clips it, so nothing is lost and nothing is added. */
  const [pageH, setPageH] = useState(0)
  const [genH, setGenH] = useState(0)
  useEffect(() => {
    if (!narrow) return undefined
    const el = document.querySelector('main')
    if (!el) return undefined
    const read = () => {
      const h = el.offsetTop + el.offsetHeight
      setPageH(h)
      setGenH((p) => (Math.abs(p - h) < 240 ? p : Math.ceil(h / 240) * 240))
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    window.addEventListener('resize', read, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [narrow])

  const tall = useMemo(
    () => (narrow && genH ? buildTall(genH) : null),
    [narrow, genH],
  )

  /* The parallax is a desktop effect, deliberately.
   *
   * On a phone the page scrolls on the compositor thread while this runs on
   * the main one, so the field would be positioned from a scroll event firing
   * on a different clock from the frames it is trying to match. During a
   * momentum flick that lags and snaps however fast the main thread is - a
   * synchronisation problem, not a throughput one, so optimising cannot fix
   * it. Only one rate escapes it: 1:1. A background that moves exactly with
   * the page does not need to be told where to go on each frame, because
   * that is already what the page does, so on a phone the field is simply
   * part of the document (position:absolute, see the stylesheet) and the
   * compositor scrolls it with everything else. No scroll handler, no
   * transform, and nothing that can fall out of step.
   *
   * Differential drift was never going to be legible at 390px anyway. */
  useEffect(() => {
    if (narrow) {
      refs.current.forEach((el) => { if (el) el.style.transform = '' })
      return undefined
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    const apply = () => {
      raf = 0
      LAYERS.forEach((layer, i) => {
        const el = refs.current[i]
        if (!el) return
        // wrap within one band so the stacked copies hide the seam
        const y = -((window.scrollY * layer.rate) % BAND)
        // 2D translate on purpose: translate3d promotes a 3000px layer
        el.style.transform = `translateY(${y}px)`
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [narrow])

  const bands = tall || (narrow ? BANDS_NARROW : BANDS_WIDE)

  return (
    <div
      className="spacefield"
      aria-hidden="true"
      style={tall ? { height: `${pageH}px` } : undefined}
    >
      {LAYERS.map((layer, li) => (
        <svg
          key={layer.key}
          className={`sf-svg sf-svg--${layer.key}`}
          ref={(el) => { refs.current[li] = el }}
          width="100%"
          height={tall ? genH : BAND * COPIES}
          focusable="false"
        >
          {Array.from({ length: tall ? 1 : COPIES }).map((_, i) => (
            <Marks key={i} list={bands[layer.key]} offset={i * BAND} />
          ))}
        </svg>
      ))}
    </div>
  )
}
