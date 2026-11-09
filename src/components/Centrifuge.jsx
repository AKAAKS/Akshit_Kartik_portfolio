import { useCallback, useEffect, useRef, useState } from 'react'
import { timeline } from '../data/content.js'
import { Placard } from './Module.jsx'

/* The centrifuge — the career spine as a spin-gravity ring.
 *
 * A ring normally cannot carry a timeline, because a circle has no beginning
 * and no end and chronology is the only thing a timeline owes the reader. The
 * fix is to clamp the rotation: the oldest node is one hard stop, the newest
 * is the other, and it will not wrap past either. So it rotates, drags and
 * scrolls like a wheel while still running Jan 2024 to now, in order.
 *
 * All eleven nodes stay on screen at once, so nothing is hidden behind the
 * hub — the rotation moves which one sits at the read position rather than
 * revealing anything. Gondolas stay upright as the ring turns, ferris-wheel
 * fashion, because radial text cannot be read.
 *
 * It hangs outside the pressure hull with the field behind it. Rotation lives
 * entirely in two CSS custom properties, so there is one style write per frame
 * no matter how many nodes there are, and the reduced-motion and narrow-screen
 * fallbacks can switch the whole thing to a plain list in CSS alone. */

const N = timeline.length
const STEP = 360 / N
const MIN = -(N - 1) * STEP // newest at the read position
const MAX = 0               // oldest at the read position
const DRAG = 0.3            // degrees per pixel
const WHEEL = 0.25

const clamp = (v) => Math.min(MAX, Math.max(MIN, v))
const indexFor = (theta) => Math.min(N - 1, Math.max(0, Math.round(-theta / STEP)))

export default function Centrifuge({ mod }) {
  const ringRef = useRef(null)
  const theta = useRef(0)
  const [current, setCurrent] = useState(0)

  /* One style write per frame, on the container only. Every gondola's own
   * counter-rotation is derived from --theta in CSS. */
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

  // ---- drag to spin (mouse and touch), vertical gestures left to the page
  useEffect(() => {
    const el = ringRef.current
    if (!el) return

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
        el.classList.add('spinning')
      }
      if (moved) {
        theta.current = clamp(startT + dx * DRAG)
        paint()
      }
    }

    const onUp = () => {
      down = false
      el.classList.remove('spinning')
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

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('wheel', onWheel)
    }
  }, [paint])

  const node = timeline[current]

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

      <div className="ring-wrap">
        {/* the read position: fixed while the ring turns under it */}
        <span className="ring-index" aria-hidden="true" />

        <div
          className="ring"
          ref={ringRef}
          role="group"
          aria-label="Career timeline, drag to rotate"
        >
          <svg className="ring-svg" viewBox="-340 -340 680 680" aria-hidden="true" focusable="false">
            <circle className="rim" r="286" />
            <circle className="rim rim-inner" r="272" />
            {timeline.map((n, i) => {
              const a = (i * STEP - 90) * (Math.PI / 180)
              return (
                <g key={n.seg}>
                  <line
                    className="strut"
                    x1={Math.cos(a) * 54} y1={Math.sin(a) * 54}
                    x2={Math.cos(a) * 286} y2={Math.sin(a) * 286}
                  />
                  <line
                    className="rim-tick"
                    x1={Math.cos(a) * 286} y1={Math.sin(a) * 286}
                    x2={Math.cos(a) * 303} y2={Math.sin(a) * 303}
                  />
                </g>
              )
            })}
            <circle className="hub" r="54" />
            <circle className="hub hub-core" r="22" />
          </svg>

          <ol className="spokes">
            {timeline.map((n, i) => (
              <li
                className="spoke"
                key={n.seg}
                style={{ '--a': i * STEP }}
                data-key={n.key ? 'true' : undefined}
                data-current={current === i ? 'true' : undefined}
              >
                <a
                  className="attach-box"
                  href={n.href}
                  onFocus={() => rotateTo(i)}
                >
                  <span className="seg">{n.seg}</span>
                  <span className="w">{n.title}</span>
                  <span className="d">{n.date}</span>
                </a>
              </li>
            ))}
          </ol>

        </div>

        {/* The hub readout sits OUTSIDE .ring on purpose: anything inside it
         * turns with the ring, and a readout that rotates is unreadable. */}
        <div className="ring-read" aria-live="polite">
          <p className="rr-date">{node.date}</p>
          <p className="rr-title">{node.title}</p>
          <p className="rr-detail">{node.detail}</p>
        </div>
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
          {current + 1} / {N}
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
