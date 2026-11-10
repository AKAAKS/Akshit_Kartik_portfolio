import { RcsQuad } from './Externals.jsx'
import Engine from './Engine.jsx'

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

/* The aft taper: the hull closing down onto the engine mount.
 *
 * The craft used to stop at a flat cap with an engine floating below it. A
 * vehicle ends in a thrust structure, so the pressurized volume necks down to
 * the mount and the bell bolts straight onto it. Stretched to the tube's
 * width like every other full-width piece; the mount half-width is set so it
 * lands exactly on the bell's injector. */
/* Half-width of the engine mount, in the flare's viewBox units. Set from the
 * engine's own thrust-mount ring: 118 of its 532 viewBox units rendered at
 * 480px is a 106px half-width, which is 100 of the 1000 units this taper is
 * stretched across. The hull necks onto the ring it actually bolts to. */
const MOUNT = 100

function AftTaper() {
  const H = 116
  const l = 500 - MOUNT
  const r = 500 + MOUNT
  return (
    <svg
      className="aft-taper"
      viewBox={`0 0 1000 ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ch-fill" d={`M0 0 H1000 L${r} ${H} H${l} Z`} />
      <path className="ch-shade" d={`M0 0 H1000 L${r} ${H} H${l} Z`} />
      {/* section rings down the cone, each a near arc and a far arc */}
      {[0.3, 0.6, 0.85].map((t) => {
        const y = H * t
        const hw = 500 - (500 - MOUNT) * t
        return (
          <g key={t}>
            <path className="ch-ring-far" d={`M${500 - hw} ${y} A ${hw} 13 0 0 0 ${500 + hw} ${y}`} />
            <path className="ch-ring" d={`M${500 - hw} ${y} A ${hw} 13 0 0 1 ${500 + hw} ${y}`} />
          </g>
        )
      })}
      <path className="ch-edge" d={`M0 0 L${l} ${H}`} />
      <path className="ch-edge" d={`M1000 0 L${r} ${H}`} />
      <path className="ch-ring-far" d={`M0 0 A 500 15 0 0 0 1000 0`} />
      <path className="ch-ring" d={`M0 0 A 500 15 0 0 1 1000 0`} />
    </svg>
  )
}

/* The tail. Since the nose took over the forward end there is only one cap
 * left on the craft, and it is this one: the hull closing onto the thrust
 * structure. */
export function TubeCap() {
  return (
    <div className="cap cap--bottom" aria-hidden="true">
      <div className="tube cap-inner">
        <AftTaper />
        {/* Attitude control, where it actually lives: on the hull at the
          * ends of the pressurized volume, firing fore and aft. */}
        <span className="quad quad--l"><RcsQuad /></span>
        <span className="quad quad--r"><RcsQuad /></span>
      </div>

      {/* The engine, bolted to the mount ring the taper just closed onto.
        * Four RCS quads ring the cone above it. */}
      <>
        <span className="quad quad--aft quad--a1"><RcsQuad size={46} /></span>
        <span className="quad quad--aft quad--a2"><RcsQuad size={46} /></span>
        <span className="quad quad--aft quad--a3"><RcsQuad size={38} /></span>
        <span className="quad quad--aft quad--a4"><RcsQuad size={38} /></span>

        <div className="aft">
          <Engine />
          <p className="aft-label">
            <span className="al-tag">SPS</span>
            <span className="al-name">SERVICE PROPULSION</span>
          </p>
        </div>
      </>
    </div>
  )
}
