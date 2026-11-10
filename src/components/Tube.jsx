import { RcsQuad, EngineBell } from './Externals.jsx'

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
        {/* Attitude control, where it actually lives: on the hull at the
          * ends of the pressurized volume, firing fore and aft. */}
        <span className="quad quad--l"><RcsQuad /></span>
        <span className="quad quad--r"><RcsQuad /></span>
      </div>

      {/* The aft end. The page used to simply stop here; a craft ends in an
        * engine. */}
      {edge === 'bottom' && (
        <div className="aft">
          <EngineBell />
          <p className="aft-label">
            <span className="al-tag">SPS</span>
            <span className="al-name">SERVICE PROPULSION</span>
          </p>
        </div>
      )}
    </div>
  )
}
