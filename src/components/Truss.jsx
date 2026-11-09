import { useEffect, useRef } from 'react'
import { timeline } from '../data/content.js'

/* The truss: the career spine as a cross-braced beam with items at attach
 * points, port to starboard. The site's one piece of deliberate novelty.
 *
 * Scrolling is native. Trackpad swipes and shift+wheel already work, a plain
 * vertical wheel still scrolls the page, and touch keeps its own momentum.
 * The only thing added is click-and-drag for mouse users; under
 * prefers-reduced-motion CSS turns the whole thing into a vertical list. */
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
      // Touch and pen pan natively; only mice need help.
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
    <section id={mod.id} className="module" aria-labelledby={`${mod.id}-h`}>
      <div className="module-head">
        <span className="stamp">{mod.desig} · {mod.hatch}</span>
        <h2 id={`${mod.id}-h`} className="module-title">{mod.name}</h2>
      </div>
      <div className="module-body" style={{ paddingBottom: 0 }}>
        <p className="module-lead" style={{ marginBottom: 0 }}>
          Roles, publications and projects in order, January 2024 to now. Each node
          links to its detail.
        </p>
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
