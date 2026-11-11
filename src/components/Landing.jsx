import { useEffect, useRef } from 'react'
import { profile } from '../data/content.js'

/* ============================================================== SPIKE
 * Throwaway. Built to be looked at and judged, not kept as-is.
 *
 * The approach. Before this, you arrived already docked: the craft is the
 * whole conceit of the page and a visitor never saw it, because the first
 * thing under the nav was the inside of Node 1. This is the establishing
 * shot that was missing — open space, a planet, the name, and the nose of
 * the ship coming up from the bottom of the frame.
 *
 * Deliberately SHORTER than a viewport. A full-height hero is the usual way
 * this goes wrong: a reader with thirty seconds spends the first five on a
 * name they already knew, because they clicked a link carrying it. At about
 * two thirds, the ship is already visibly beginning at the bottom edge, so
 * the frame reads as an approach rather than a splash screen and the eye is
 * pulled down instead of parked.
 *
 * Nothing is intercepted. No scroll-jacking, no click to enter, no snap —
 * it is a section of the page and the page scrolls normally through it.
 */
export default function Landing() {
  const endRef = useRef(null)

  /* The nav is hidden up here and slides in when the ship arrives.
   *
   * An IntersectionObserver rather than a scroll handler, on purpose. This
   * is a boolean that flips twice in a page, not a position that has to
   * track the scroll, so it costs nothing and cannot fall out of step with
   * the compositor the way the parallax did. */
  useEffect(() => {
    const el = endRef.current
    if (!el) return undefined
    const root = document.documentElement
    const io = new IntersectionObserver(
      ([e]) => {
        const past = !e.isIntersecting && e.boundingClientRect.top < 0
        root.toggleAttribute('data-landed', past)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      root.removeAttribute('data-landed')
    }
  }, [])

  return (
    <section className="landing" aria-label="Approach">
      <div className="landing-inner">
        <h1 className="landing-name">{profile.name}</h1>
        <p className="landing-role">{profile.title}</p>
      </div>

      {/* Not an instruction. A mark that says the page continues, in the
        * same ink as the drawing rather than a bouncing chevron. */}
      <span className="landing-cue" aria-hidden="true" />

      {/* What the nav watches. */}
      <span className="landing-end" ref={endRef} aria-hidden="true" />
    </section>
  )
}
