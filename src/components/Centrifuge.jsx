import { useCallback, useEffect, useRef, useState } from 'react'
import { timeline } from '../data/content.js'
import { Placard } from './Module.jsx'

/* The centrifuge — the career spine as a spin-gravity ring, seen from the side.
 *
 * Real CSS 3D. The ring lies in a horizontal plane with its axis along the
 * craft's long axis, and the camera sits just above that plane, so the ring is
 * seen at the same angle as the tube and belongs to the same ship. Nothing is
 * drawn as an ellipse — the discs are round and laid flat into the ring's
 * plane, so they foreshorten correctly at every angle.
 *
 * The camera angle is not fixed: it starts oblique as the section comes into
 * view and flattens toward the horizontal as you scroll, so you see enough of
 * the ring's shape to read it as a wheel, then settle into the craft's own
 * eye level. Under prefers-reduced-motion it simply holds one angle.
 *
 * Gondolas are real boxes, not cards — six faces each, shaded by face — so
 * they match the rest of the geometry instead of being flat panels floating
 * in a 3D scene.
 *
 * A ring cannot normally carry a timeline, because a circle has no beginning
 * and no end. The rotation is clamped: oldest is one hard stop, newest the
 * other, no wrapping. So it spins like a wheel and still runs in order. */

const N = timeline.length
const STEP = 360 / N
const MIN = -(N - 1) * STEP // newest at the front
const MAX = 0               // oldest at the front
const DRAG = 0.3            // degrees per pixel
const WHEEL = 0.25

const TILT_FAR = 21         // degrees above the ring's plane, on approach
const TILT_NEAR = 4         // once the section is settled in view
const TILT_STILL = 9        // the one angle used when motion is unwanted

const clamp = (v) => Math.min(MAX, Math.max(MIN, v))
const indexFor = (theta) => Math.min(N - 1, Math.max(0, Math.round(-theta / STEP)))

export default function Centrifuge({ mod }) {
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const theta = useRef(0)
  const [current, setCurrent] = useState(0)

  const paint = useCallback(() => {
    const el = ringRef.current
    if (el) el.style.setProperty('--theta', String(theta.current))
    const i = indexFor(theta.current)
    setCurrent((p) => (p === i ? p : i))
  }, [])

  const rotateTo = useCallback((i) => {
    theta.current = clamp(-i * STEP)
    paint()
  }, [paint])

  useEffect(() => { paint() }, [paint])

  /* ---- camera: oblique on approach, flattening to eye level ---- */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.style.setProperty('--tilt', `${TILT_STILL}deg`)
      return
    }

    let raf = 0
    const apply = () => {
      raf = 0
      const r = stage.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const centre = r.top + r.height / 2
      // 0 while the section is still coming up from the bottom of the
      // viewport, 1 once its middle has reached the middle of the screen
      const p = Math.min(1, Math.max(0, (vh - centre) / (vh / 2)))
      const tilt = TILT_FAR - (TILT_FAR - TILT_NEAR) * p
      stage.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* ---- drag to spin ---- */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    let down = false
    let moved = false
    let startX = 0
    let startT = 0

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      down = true
      moved = false
      startX = e.clientX
      startT = theta.current
    }

    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 4) {
        moved = true
        stage.classList.add('spinning')
      }
      if (moved) {
        theta.current = clamp(startT + dx * DRAG)
        paint()
      }
    }

    const onUp = () => {
      down = false
      stage.classList.remove('spinning')
    }

    // a drag that ends on a gondola must not also follow its link
    const onClick = (e) => {
      if (!moved) return
      e.preventDefault()
      e.stopPropagation()
      moved = false
    }

    /* Only sideways intent spins the ring. A plain vertical wheel is left
     * alone so the page keeps scrolling through the section. */
    const onWheel = (e) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : (e.shiftKey ? e.deltaY : 0)
      if (!dx) return
      const next = clamp(theta.current - dx * WHEEL)
      if (next !== theta.current) {
        e.preventDefault()
        theta.current = next
        paint()
      }
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    stage.addEventListener('click', onClick, true)
    stage.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      stage.removeEventListener('click', onClick, true)
      stage.removeEventListener('wheel', onWheel)
    }
  }, [paint])

  return (
    <section id={mod.id} className="module module--eva" aria-labelledby={`${mod.id}-h`}>
      <div className="module-inner">
        <Placard mod={mod} note="External · spin gravity" />
        <div className="module-body" style={{ paddingBottom: 0 }}>
          <p className="module-lead" style={{ marginBottom: 0 }}>
            Roles, publications and projects in order, January 2024 to now. Drag to
            spin; it stops at both ends. Each gondola links to its detail.
          </p>
        </div>
      </div>

      <div className="ring-stage" ref={stageRef}>
        <div className="ring-tilt">
          <div
            className="ring"
            ref={ringRef}
            role="group"
            aria-label="Career timeline, drag to rotate"
          >
            {/* ---- machinery: round divs laid flat into the ring's plane ---- */}
            <div className="rim rim-outer" />
            <div className="rim rim-inner" />
            <div className="rim rim-hub" />

            {timeline.map((n, i) => (
              <div className="strut" key={`s-${n.seg}`} style={{ '--a': i * STEP }} />
            ))}

            <div className="shaft" />
            <div className="shaft-cap" />

            <ol className="gondolas">
              {timeline.map((n, i) => (
                <li
                  className="gondola"
                  key={n.seg}
                  style={{ '--a': i * STEP }}
                  data-key={n.key ? 'true' : undefined}
                  data-current={current === i ? 'true' : undefined}
                >
                  {/* six faces, so it is a box on the ring rather than a flat
                    * card floating in a 3D scene */}
                  <a className="gon gon-face" href={n.href} onFocus={() => rotateTo(i)}>
                    <span className="seg">{n.seg}</span>
                    <span className="w">{n.title}</span>
                    <span className="d">{n.date}</span>
                  </a>
                  <span className="gon gon-back" aria-hidden="true" />
                  <span className="gon gon-top" aria-hidden="true" />
                  <span className="gon gon-bot" aria-hidden="true" />
                  <span className="gon gon-lt" aria-hidden="true" />
                  <span className="gon gon-rt" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* the read position, fixed while the ring turns past it */}
        <span className="ring-index" aria-hidden="true" />
      </div>

      <div className="ring-controls">
        <button
          type="button"
          className="ref"
          onClick={() => rotateTo(current - 1)}
          disabled={current === 0}
        >
          ← earlier
        </button>
        <span className="ring-count">
          <span className="rc-now">{timeline[current].date}</span>
          <span className="rc-of">{current + 1} / {N}</span>
        </span>
        <button
          type="button"
          className="ref"
          onClick={() => rotateTo(current + 1)}
          disabled={current === N - 1}
        >
          later →
        </button>
      </div>
    </section>
  )
}
