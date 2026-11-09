import { useEffect, useRef, useState } from 'react'
import { modules } from '../data/content.js'

/* The plan view: a cutaway of the station that doubles as the navigation.
 * These are ordinary anchors — the browser does the scrolling. The observer
 * only reports which module is at the top of the viewport. */
export default function PlanNav() {
  const [active, setActive] = useState(modules[0].id)
  const navRef = useRef(null)

  useEffect(() => {
    const els = modules
      .map((m) => document.getElementById(m.id))
      .filter(Boolean)
    if (!els.length || typeof IntersectionObserver === 'undefined') return

    const visible = new Set()
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        // The topmost module still in the band wins, in page order.
        const first = modules.find((m) => visible.has(m.id))
        if (first) setActive((p) => (p === first.id ? p : first.id))
      },
      // Band = just under the sticky nav, so "active" means "at the top".
      { rootMargin: '-58px 0px -55% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // On narrow screens the nav scrolls; keep the current module in view.
  useEffect(() => {
    const nav = navRef.current
    if (!nav || nav.scrollWidth <= nav.clientWidth) return
    const chip = nav.querySelector(`[href="#${active}"]`)
    if (chip) chip.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  }, [active])

  return (
    <nav className="plan" aria-label="Station modules" ref={navRef}>
      {modules.map((m) => (
        <a
          key={m.id}
          className="plan-mod"
          href={`#${m.id}`}
          aria-current={active === m.id ? 'true' : undefined}
        >
          <span className="desig">{m.desig}</span>
          <span className="name">{m.name}</span>
        </a>
      ))}
    </nav>
  )
}
