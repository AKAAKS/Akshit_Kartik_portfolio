import { useEffect, useRef, useState } from 'react'
import { modules } from '../data/content.js'

/* The station seen side-on, and the navigation.
 *
 * Modules are cylinders joined by hatch connectors. The truss hangs off the
 * chain rather than sitting in it, because it is not pressurized. A position
 * marker travels along the chain as you scroll, so this is a map of where you
 * are rather than a row of tabs.
 *
 * The chips are ordinary anchors — the browser does all the scrolling. */
export default function StationMap() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0) // 0..1 across the whole chain
  const mapRef = useRef(null)

  useEffect(() => {
    let raf = 0

    // Read the nav height from the token rather than restating it, so the
    // sticky bar and the measuring line cannot drift apart.
    const navH = () =>
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10,
      ) || 72

    const measure = () => {
      raf = 0
      const els = modules.map((m) => document.getElementById(m.id))
      const line = window.scrollY + navH() + 1

      let idx = 0
      for (let i = 0; i < els.length; i += 1) {
        if (els[i] && els[i].offsetTop <= line) idx = i
      }
      const el = els[idx]
      let frac = 0
      if (el) {
        const h = el.offsetHeight || 1
        frac = Math.min(1, Math.max(0, (line - el.offsetTop) / h))
      }
      setActive((p) => (p === idx ? p : idx))
      setProgress((idx + frac) / modules.length)
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Keep the current module visible when the chain overflows on narrow screens.
  useEffect(() => {
    const map = mapRef.current
    if (!map || map.scrollWidth <= map.clientWidth) return
    const chip = map.querySelector('[data-active="true"]')
    if (!chip) return

    /* Centred by hand, on one axis of one element.
     *
     * scrollIntoView was doing this, and it was the thing making the page
     * feel locked on a phone. It scrolls EVERY scrollable ancestor, the
     * document included, and it takes its animation from `scroll-behavior`,
     * which html sets to smooth. So each time a section boundary went past,
     * this fired a smooth animated scroll of the whole page against a finger
     * that was already dragging it - the two fought, and the page stuttered
     * or snapped back. Setting scrollLeft touches this strip and nothing
     * else, and `scroll-behavior` does not inherit, so it lands instantly. */
    const cr = chip.getBoundingClientRect()
    const mr = map.getBoundingClientRect()
    const delta = (cr.left + cr.width / 2) - (mr.left + mr.width / 2)
    const max = map.scrollWidth - map.clientWidth
    map.scrollLeft = Math.max(0, Math.min(max, map.scrollLeft + delta))
  }, [active])

  return (
    <nav className="station" aria-label="Station modules">
      <div className="station-scroll" ref={mapRef}>
        <div className="station-chain">
          {modules.map((m, i) => (
            <div className="station-slot" key={m.id}>
              {i > 0 && <span className="station-joint" aria-hidden="true" />}
              <a
                className={`station-mod${m.external ? ' station-mod--eva' : ''}`}
                href={`#${m.id}`}
                data-active={active === i ? 'true' : undefined}
                aria-current={active === i ? 'true' : undefined}
              >
                <span className="sm-desig">{m.desig}</span>
                <span className="sm-name">{m.name}</span>
              </a>
            </div>
          ))}
          <span
            className="station-marker"
            style={{ left: `${progress * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </nav>
  )
}
