import { useEffect, useRef } from 'react'
import { timeline } from '../data/content.js'
import { Placard } from './Module.jsx'

/* The truss — and the one place you are outside.
 *
 * The real integrated truss is external: perpendicular to the module chain,
 * unpressurized, hung with payloads at its attach points. So this section is
 * treated as EVA rather than as another cylinder: no hull curvature, a
 * recessed field instead of the paper white, and the bare beam.
 *
 * It is also the one section that scrolls sideways, which is the point — the
 * change of direction and the change of environment are the same event.
 *
 * Scrolling is native. Trackpad swipes and shift+wheel already work, a plain
 * vertical wheel still scrolls the page, and touch keeps its own momentum.
 * Only click-and-drag is added, for mice. Under prefers-reduced-motion, CSS
 * alone turns the whole thing into a vertical list. */
export default function Truss({ mod }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let down = false
    let moved = false
    let startX = 0
    let startLeft = 0

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      down = true
      moved = false
      startX = e.clientX
      startLeft = el.scrollLeft
    }

    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 4) {
        moved = true
        el.classList.add('dragging')
      }
      if (moved) el.scrollLeft = startLeft - dx
    }

    const onUp = () => {
      down = false
      el.classList.remove('dragging')
    }

    // A drag that ends on a node must not also follow its link.
    const onClick = (e) => {
      if (!moved) return
      e.preventDefault()
      e.stopPropagation()
      moved = false
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  return (
    <section id={mod.id} className="module module--eva" aria-labelledby={`${mod.id}-h`}>
      <div className="module-inner">
        <Placard mod={mod} note="External · unpressurized" />
        <div className="module-body" style={{ paddingBottom: 0 }}>
          <p className="module-lead" style={{ marginBottom: 0 }}>
            Roles, publications and projects in order, January 2024 to now. Each node
            links to its detail.
          </p>
        </div>
      </div>

      <div
        className="track"
        ref={trackRef}
        role="region"
        aria-label="Career timeline, scrolls horizontally"
      >
        <div className="truss">
          <div className="truss-beam" aria-hidden="true">
            {timeline.map((n) => <i key={n.seg} />)}
          </div>
          <ol className="truss-attachments">
            {timeline.map((n) => (
              <li className="attach" key={n.seg} data-key={n.key ? 'true' : undefined}>
                <span className="seg">{n.seg}</span>
                <a className="attach-box" href={n.href}>
                  <span className="w">{n.title}</span>
                  <span className="d">{n.date} · {n.detail}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="track-hint" aria-hidden="true">← drag or shift-scroll →</p>
    </section>
  )
}
