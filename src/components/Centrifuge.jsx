import { useCallback, useEffect, useRef, useState } from 'react'
import { timeline } from '../data/content.js'
import { Placard } from './Module.jsx'

/* The centrifuge — the career spine as a spin-gravity ring, seen from the side.
 *
 * This is real 3D, not a circle drawn on the page. The ring lies in a
 * horizontal plane, its axis along the craft's long axis, and the camera looks
 * at it from barely above that plane — the same viewing angle as the tube, so
 * it belongs to the same ship. A horizontal circle seen that way is a shallow
 * ellipse: gondolas at the front come toward you and are readable, the ones at
 * the sides turn edge-on, and the far half is behind the machinery. Three or
 * four legible at a time is the point, not a cost.
 *
 * Seen face-on it would be a merry-go-round, which is indistinguishable from a
 * list arranged in a circle. The foreshortening is the whole idea.
 *
 * A ring cannot normally carry a timeline, because a circle has no beginning
 * and no end. The rotation is clamped: oldest is one hard stop, newest is the
 * other, no wrapping. So it spins like a wheel and still runs in order.
 *
 * Rotation lives in one custom property, --theta, set on .ring. Everything
 * else — gondola angles, strut angles — is static CSS, so a frame costs one
 * style write, and the reduced-motion, narrow and print fallbacks can flatten
 * the entire mechanism without this component knowing. */

const N = timeline.length
const STEP = 360 / N
const MIN = -(N - 1) * STEP // newest at the front
const MAX = 0               // oldest at the front
const DRAG = 0.3            // degrees per pixel
const WHEEL = 0.25

const clamp = (v) => Math.min(MAX, Math.max(MIN, v))
const indexFor = (theta) => Math.min(N - 1, Math.max(0, Math.round(-theta / STEP)))

export default function Centrifuge({ mod }) {
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

  useEffect(() => {
    const el = ringRef.current
    if (!el) return
    const stage = el.closest('.ring-stage') || el

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

      <div className="ring-stage">
        {/* camera tilt: how far above the ring's plane we are looking from.
          * Low, because the rest of the craft is seen from the side too. */}
        <div className="ring-tilt">
          <div
            className="ring"
            ref={ringRef}
            role="group"
            aria-label="Career timeline, drag to rotate"
          >
            {/* ---- machinery. Discs laid into the horizontal plane, so they
              * foreshorten with everything else instead of being drawn as
              * ellipses that only look right at one angle. ---- */}
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
                  <a className="gon-box" href={n.href} onFocus={() => rotateTo(i)}>
                    <span className="seg">{n.seg}</span>
                    <span className="w">{n.title}</span>
                    <span className="d">{n.date}</span>
                  </a>
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
