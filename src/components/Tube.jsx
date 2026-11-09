/* Cylinder drawing primitives.
 *
 * A ring around a tube seen side-on is an ELLIPSE, not a circle, and drawing
 * it as one is most of what makes the page read as three-dimensional. Each rib
 * is a full section: the near arc bulges toward you and is drawn solid, the far
 * arc bulges away and is drawn light. That pair is the whole 3D cue — a curved
 * line across a shape says "round" faster than any amount of shading.
 *
 * The viewBox is stretched to the tube's width with preserveAspectRatio="none",
 * so the section is always a wide shallow ellipse whatever the page width.
 * Strokes are kept at 1px through vector-effect, so nothing fattens up. */

/* A rib: an open section, used where the tube continues past it. */
export function Rib({ ry = 15, back = true }) {
  const h = ry * 2 + 2
  const mid = ry + 1
  return (
    <svg
      className="rib"
      viewBox={`0 0 1000 ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ height: `${h}px` }}
    >
      {/* far side of the ring, curving away from you */}
      {back && <path className="rib-back" d={`M1 ${mid} A 500 ${ry} 0 0 0 999 ${mid}`} />}
      {/* near side, curving toward you */}
      <path className="rib-front" d={`M1 ${mid} A 500 ${ry} 0 0 1 999 ${mid}`} />
    </svg>
  )
}

/* An end cap: a closed section. Both arcs solid, because you are looking at
 * the end of the pressurized volume rather than through it. */
export function TubeCap({ edge = 'top' }) {
  const ry = 17
  const h = ry * 2 + 2
  const mid = ry + 1
  return (
    <div className={`cap cap--${edge}`} aria-hidden="true">
      <div className="tube cap-inner">
        <svg
          className="rib rib--cap"
          viewBox={`0 0 1000 ${h}`}
          preserveAspectRatio="none"
          focusable="false"
          style={{ height: `${h}px` }}
        >
          <path className="rib-front" d={`M1 ${mid} A 500 ${ry} 0 0 0 999 ${mid}`} />
          <path className="rib-front" d={`M1 ${mid} A 500 ${ry} 0 0 1 999 ${mid}`} />
        </svg>
      </div>
    </div>
  )
}

/* The hatch ring itself. Drawn at natural size rather than stretched, so it
 * stays a believable opening on the tube's surface instead of a flat target. */
export function HatchRing({ eva = false }) {
  const rx = 38
  const ry = 14
  return (
    <svg
      className={`hring${eva ? ' hring--eva' : ''}`}
      viewBox="0 0 100 44"
      width="100"
      height="44"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="hring-outer" cx="50" cy="22" rx={rx} ry={ry} />
      <ellipse className="hring-inner" cx="50" cy="22" rx={rx - 7} ry={ry - 5} />
      {/* dogs around the rim, spaced around the ellipse rather than a circle */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        const x = 50 + Math.cos(a) * rx
        const y = 22 + Math.sin(a) * ry
        const x2 = 50 + Math.cos(a) * (rx + 4)
        const y2 = 22 + Math.sin(a) * (ry + 2.5)
        return <line key={i} className="hring-dog" x1={x} y1={y} x2={x2} y2={y2} />
      })}
    </svg>
  )
}
