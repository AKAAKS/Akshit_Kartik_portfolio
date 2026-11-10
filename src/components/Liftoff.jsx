import { useEffect, useRef, useState } from 'react'
import Engine from './Engine.jsx'

/* ============================================================== SPIKE
 * Throwaway. Built to be looked at on a phone and judged, not kept as-is.
 *
 * The back-to-top the craft was always owed: there is an engine at the
 * bottom of the page, so firing it is how you get back to the nose.
 *
 * Two rules it keeps, because they are the rules the rest of the drawing
 * keeps. The plume is DRAWN, not lit - a stippled expansion cone, shock
 * diamonds on the axis, a dashed envelope, the way a cutaway shows flow.
 * No glow, no gradient, no orange. And nothing shakes: the page scrolling
 * up IS the ship moving, so simulating motion on top of motion would only
 * read as jitter. The plume lights, then the page accelerates.
 */

/* Engine coordinates, lifted from Engine.jsx so the plume lands on the bell
 * rather than near it. The plume svg carries the same viewBox x-range and
 * the same rendered width, so a given x means the same place in both. */
const VB_HALF = 266 // ENGINE_VB_HALF: EXIT + 76
const VB_TOP = -18
const ENGINE_H = 520 // the engine svg's own viewBox height
const Y_EXIT = 442 // the bell's exit plane
const EXIT_R = 190 // exit half-width
const PLUME = 330 // how far the plume runs below the exit plane

/* The plume's own frame. A vacuum plume ends up wider than the bell that
 * threw it, so it cannot share the engine's +/-266 viewBox - the envelope
 * simply fell outside it and never drew. This frame is wider in the same
 * proportion that .lo-plume is wider than .engine in CSS, which keeps one
 * unit the same size in both and keeps x=0 on the same centreline. */
const PL_HALF = 320

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/* Half-width of the plume at t (0 at the exit plane, 1 at the end).
 *
 * A vacuum plume is badly underexpanded: it leaves the lip and flares hard,
 * and the barrel shocks pinch it at intervals on the way out. The sine is
 * that pinching - it is also what puts the shock diamonds where they belong,
 * since a diamond sits at each neck. */
function halfWidth(t) {
  /* A clean conical flare. The first pass scalloped this with a cosine to
   * suggest the barrel shocks, and it read as a wobble in the outline rather
   * than as structure. The shock lattice below carries that rhythm properly,
   * so the envelope's only job is to be the edge of the flow. */
  return EXIT_R * (1 + 0.42 * Math.pow(t, 0.55))
}

function envelope() {
  const N = 60
  const right = []
  const left = []
  for (let i = 0; i <= N; i += 1) {
    const t = i / N
    const y = Y_EXIT + PLUME * t
    const w = halfWidth(t)
    right.push(`${w.toFixed(1)} ${y.toFixed(1)}`)
    left.push(`${(-w).toFixed(1)} ${y.toFixed(1)}`)
  }
  return {
    r: `M${right.join(' L')}`,
    l: `M${left.join(' L')}`,
    fill: `M${right.join(' L')} L${left.reverse().join(' L')} Z`,
  }
}

/* The shock diamonds: lens shapes on the axis, one at each neck, getting
 * shorter and fainter as the flow loses energy. Drawn as two arcs meeting at
 * their tips, which is the shape a schlieren photograph actually shows. */
/* The shock structure, drawn the way a schlieren photograph shows it.
 *
 * Not a stack of lens shapes on the axis - that was the first pass and it
 * read as a row of eyes. What is actually there is a single oblique shock
 * reflecting back and forth between the plume's edge and its centreline. One
 * zig-zag, and its mirror image, and the diamonds appear where the two
 * cross. That is the whole mechanism, and drawing the mechanism rather than
 * its silhouette is the difference between a diagram and a doodle. */
const CROSS = 10 // reflections before the flow has lost its structure

function shockLattice() {
  const side = (sign) => {
    const pts = []
    for (let k = 0; k <= CROSS; k += 1) {
      const t = k / CROSS
      // even k rides the envelope, odd k touches the axis
      // well inboard of the envelope: the shock lives in the core flow,
      // and running it out to the edge made each diamond a flat chevron
      // the width of the whole plume.
      const x = k % 2 === 0 ? sign * halfWidth(t) * (0.52 - 0.14 * t) : 0
      pts.push(`${x.toFixed(1)} ${(Y_EXIT + PLUME * t).toFixed(1)}`)
    }
    return `M${pts.join(' L')}`
  }
  return [
    <path key="sr" className="lo-shock" d={side(1)} />,
    <path key="sl" className="lo-shock" d={side(-1)} />,
  ]
}

/* Mach discs: the normal shock sitting at each crossing on the axis. Short,
 * heavy, and square to the flow - which is exactly what distinguishes them
 * from the oblique shocks running into them. */
function machDiscs() {
  const out = []
  for (let k = 1; k < CROSS; k += 2) {
    const t = k / CROSS
    const y = Y_EXIT + PLUME * t
    const w = EXIT_R * (0.21 - 0.014 * k)
    out.push(<path key={`m${k}`} className="lo-disc" d={`M${-w.toFixed(1)} ${y.toFixed(1)} H${w.toFixed(1)}`} />)
  }
  return out
}

/* Stipple inside the cone. Density falls off toward the envelope and down
 * the length, which is the engraver's way of saying "thinning out" without
 * reaching for a lighter ink.
 *
 * ONE path, not one element per dot. The first pass drew 300 <circle>s and
 * put them inside the animating clip, so every frame of the wipe had to
 * re-composite all 300 - it stalled the page for over a second before the
 * scroll could even start. Same drawing, 1 node instead of 300. */
function stipplePath() {
  const r = rng(90210)
  let d = ''
  for (let i = 0; i < 170; i += 1) {
    const t = Math.pow(r(), 0.74)
    if (r() > 1 - t * 0.5) continue // thin it out toward the end
    const y = Y_EXIT + PLUME * t
    // bias toward the axis: two samples averaged is a cheap triangular pdf
    const u = (r() + r()) / 2
    const x = (u * 2 - 1) * halfWidth(t) * 0.94
    const rad = 2.2 * (1 - t * 0.45) * (0.55 + r() * 0.75)
    const a = rad.toFixed(2)
    d += `M${(x - rad).toFixed(1)} ${y.toFixed(1)}a${a} ${a} 0 1 0 ${(rad * 2).toFixed(2)} 0a${a} ${a} 0 1 0 ${(-rad * 2).toFixed(2)} 0`
  }
  return d
}

const ENV = envelope()
const GRAIN = stipplePath()

/* A launch accelerates, so the scroll does too - but arriving at the top at
 * full speed and stopping dead feels like hitting something. Most of the run
 * is acceleration; the last fifth settles. */
function ease(t) {
  if (t < 0.82) return 0.74 * Math.pow(t / 0.82, 2.4)
  const u = (t - 0.82) / 0.18
  return 0.74 + 0.26 * (1 - Math.pow(1 - u, 2))
}

export default function Liftoff() {
  const [firing, setFiring] = useState(false)
  const raf = useRef(0)
  const stop = useRef(null)

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current)
    if (stop.current) stop.current()
  }, [])

  const fire = () => {
    if (firing) return

    // The one setting that turns all of this off. Someone who has asked for
    // less motion is asking for exactly this, so they get the destination.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    setFiring(true)
    const from = window.scrollY
    const dur = Math.min(1500, Math.max(650, from * 0.14))
    const hold = 170 // the engine lights before anything moves
    const t0 = performance.now()

    // A hand on the screen outranks the animation: if they scroll, we are
    // no longer in charge of where the page is.
    let cancelled = false
    const abort = () => { cancelled = true }
    const opts = { passive: true }
    window.addEventListener('wheel', abort, opts)
    window.addEventListener('touchstart', abort, opts)
    window.addEventListener('keydown', abort, opts)
    stop.current = () => {
      window.removeEventListener('wheel', abort, opts)
      window.removeEventListener('touchstart', abort, opts)
      window.removeEventListener('keydown', abort, opts)
    }

    const step = (now) => {
      if (cancelled) { stop.current(); setFiring(false); return }
      const e = now - t0
      if (e < hold) { raf.current = requestAnimationFrame(step); return }
      const t = Math.min(1, (e - hold) / dur)
      /* `behavior: 'instant'` is load-bearing. The two-argument scrollTo
       * obeys CSS scroll-behavior, which html sets to smooth - so every
       * frame was starting a fresh smooth scroll toward that frame's
       * target, and the browser's easing lagged behind ours. The burn took
       * 2.7s instead of 1.2s and sat still for the first second of it.
       * We are doing the easing; the browser must not do its own. */
      window.scrollTo({ top: Math.round(from * (1 - ease(t))), left: 0, behavior: 'instant' })
      if (t < 1) { raf.current = requestAnimationFrame(step); return }
      stop.current()
      setFiring(false)
    }
    raf.current = requestAnimationFrame(step)
  }

  return (
    <>
      {/* One stacking context holding the engine and its flow, so the plume
        * is positioned against the bell rather than against the section. */}
      <div className="lo-stack">
        <Engine />

        {/* Beside the bell, down at its skirt. In the flow above the engine
          * it pushed the hull off its own thrust structure; below it, it
          * stood in the plume it exists to light. Out here it is clear of
          * both, and it is where a control on a real thrust structure would
          * actually be bolted. */}
        <button
          type="button"
          className={`lo-btn${firing ? ' lo-btn--firing' : ''}`}
          onClick={fire}
          aria-label="Return to the top of the page"
        >
          <span className="lo-lamp" aria-hidden="true" />
          <span className="lo-arrow" aria-hidden="true">&#9650;</span>
          <span className="lo-name">{firing ? 'BURN' : 'TOP'}</span>
        </button>
        <svg
          className={`lo-plume${firing ? ' lo-plume--firing' : ''}`}
          viewBox={`${-PL_HALF} ${VB_TOP} ${PL_HALF * 2} ${ENGINE_H + PLUME}`}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* The plume extends rather than appearing: a wipe growing from
              * the exit plane down. Animating the rect's height leaves the
              * drawing unscaled, so the diamonds keep the shape they were
              * drawn in and simply arrive in order. */}
            <clipPath id="lo-wipe">
              <rect className="lo-wipe-rect" x={-PL_HALF} y={Y_EXIT} width={PL_HALF * 2} height="0" />
            </clipPath>
          </defs>
          <g clipPath="url(#lo-wipe)">
            <path className="lo-core" d={ENV.fill} />
            <path className="lo-grain" d={GRAIN} />
              {shockLattice()}
            {machDiscs()}
            <path className="lo-env" d={ENV.r} />
            <path className="lo-env" d={ENV.l} />
          </g>
        </svg>
      </div>
    </>
  )
}
