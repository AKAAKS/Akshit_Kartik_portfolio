import { useEffect, useState } from 'react'

/* SPIKE. THROWAWAY.
 *
 * Flips the tint level on <html> so the four states can be compared by eye on
 * the real page instead of in a mockup. Level 0 removes the attribute
 * entirely, which is the current site exactly.
 *
 * Deliberately not persisted and deliberately not in the station map: this is
 * scaffolding for one decision, not a feature. */
const LEVELS = [0, 1, 2, 3]

export default function SpikeTint() {
  const [level, setLevel] = useState(2)

  useEffect(() => {
    const root = document.documentElement
    if (level === 0) root.removeAttribute('data-tint')
    else root.setAttribute('data-tint', String(level))
  }, [level])

  return (
    <div className="spike-tint">
      <span>tint</span>
      {LEVELS.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === level}
          onClick={() => setLevel(l)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
