/* The threshold between two modules.
 *
 * On the station you do not cross a line from one module to the next, you pass
 * through a hatch in a bulkhead. This is that: a full-bleed bulkhead arc (the
 * pressure hull curving away past the content column), a hatch ring, and the
 * designator plate of the module you are entering.
 *
 * The arc is deliberately full width so the curvature reads in the gutters
 * rather than stopping at the edge of the text. */

export default function Hatch({ into, index, total }) {
  const external = Boolean(into.external)

  return (
    <div className={`hatch${external ? ' hatch--eva' : ''}`} aria-hidden="true">
      {/* bulkhead: a shallow dome, stretched to whatever the viewport is */}
      <svg
        className="hatch-bulkhead"
        viewBox="0 0 1000 44"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d="M0 44 Q500 0 1000 44" />
      </svg>

      <div className="hatch-ring">
        <svg viewBox="0 0 64 64" focusable="false">
          <circle className="ring-outer" cx="32" cy="32" r="27" />
          <circle className="ring-inner" cx="32" cy="32" r="20" />
          {/* dogs around the hatch rim */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="32" y1="5" x2="32" y2="11"
              transform={`rotate(${i * 45} 32 32)`}
            />
          ))}
        </svg>
      </div>

      <p className="hatch-plate">
        <span className="hp-desig">{into.desig}</span>
        <span className="hp-sep">/</span>
        <span className="hp-elem">{into.element}</span>
        <span className="hp-seq">{index} of {total}</span>
      </p>
    </div>
  )
}
