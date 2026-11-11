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
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  /* The marker's position is written straight to the node, and everything it
   * needs is measured once rather than per frame.
   *
   * What was here before did four expensive things on every scroll frame: a
   * getComputedStyle on the root, seven getElementById calls, seven
   * offsetTop/offsetHeight reads - each of which forces a synchronous
   * layout - and a React setState, re-rendering the whole chain. None of
   * that is needed: a module's offsetTop cannot change while you scroll, it
   * changes when the page is laid out. So it is cached at layout time and
   * the scroll path does arithmetic and one style write.
   *
   * `active` stays React state because it changes seven times in a page
   * rather than sixty times a second. */
  useEffect(() => {
    let raf = 0
    let navH = 72
    let geom = []
    let chips = []

    const remeasure = () => {
      navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10,
      ) || 72
      geom = modules.map((m) => {
        const el = document.getElementById(m.id)
        if (!el) return null
        /* Document coordinates, not offsetTop.
         *
         * offsetTop is measured from the offsetParent, and <main> is
         * positioned, so every module came back 96px short of where it
         * actually is while this compares against window.scrollY. The error
         * was uniform, so it did not look obviously wrong - it just switched
         * each module slightly early. A rect plus scrollY is the real
         * document position whatever the offsetParent turns out to be. */
        const r = el.getBoundingClientRect()
        return { top: Math.round(r.top + window.scrollY), h: el.offsetHeight || 1 }
      })

      /* Where the chips REALLY are.
       *
       * The marker used to be placed at an even fraction of the chain,
       * (idx + frac) / N, which assumes every chip is the same width. On a
       * desktop they are flex: 1 1 auto and stretch to roughly equal, so it
       * passed. Mobile sets flex: 0 0 auto and chips size to their text -
       * "Intro" is 54px and "Publications" is 94px - so the even fraction
       * drifted away from the chip it was supposed to be under, by about a
       * chip's width through the middle of the run.
       *
       * offsetLeft is safe here, unlike above: these are measured against
       * .station-chain, which is positioned and is also what the marker is
       * positioned in, so both sides of the sum share an origin. */
      const map = mapRef.current
      chips = map
        ? [...map.querySelectorAll('.station-mod')].map((c) => ({
          x: c.offsetLeft,
          w: c.offsetWidth,
        }))
        : []
    }

    const measure = () => {
      raf = 0
      const line = window.scrollY + navH + 1

      let idx = 0
      for (let i = 0; i < geom.length; i += 1) {
        if (geom[i] && geom[i].top <= line) idx = i
      }
      const g = geom[idx]
      const frac = g ? Math.min(1, Math.max(0, (line - g.top) / g.h)) : 0

      setActive((p) => (p === idx ? p : idx))
      const el = markerRef.current
      const c = chips[idx]
      if (el && c) el.style.left = `${c.x + c.w * frac}px`
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    const onResize = () => { remeasure(); onScroll() }

    remeasure()
    measure()
    /* Web fonts land after first paint and reflow everything under them, so
     * the offsets taken before that are wrong by a few pixels per module. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onResize).catch(() => {})
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
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
          <span className="station-marker" ref={markerRef} aria-hidden="true" />
        </div>
      </div>
    </nav>
  )
}
