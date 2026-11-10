/* The forward end: a command module.
 *
 * The page used to begin at a flat cap. The tail is a service-propulsion
 * bell, so the front is the crew compartment that belongs to it — one
 * vehicle, read end to end, rather than two unrelated terminations.
 *
 * Split the same way every full-width piece is: the cone stretches to the
 * tube so it meets the hull at any page width, and the fittings that must not
 * distort — windows, hatch, antenna — are separate and drawn at natural size.
 */

const W = 1000
const H = 196
const TIP = 34 // half-width at the apex: the same 72px the spindle uses
const SHOULDER = 150 // where the cone stops flaring and the hull begins

/* ---- the cone ---- */
function Cone() {
  const l = W / 2 - TIP
  const r = W / 2 + TIP
  // A command module is not a straight cone: it is steep at the apex and
  // shallow at the shoulder. One control point does the whole curve.
  const left = `M${l} 0 Q ${W / 2 - 300} ${SHOULDER * 0.62} 0 ${SHOULDER}`
  const right = `M${r} 0 Q ${W / 2 + 300} ${SHOULDER * 0.62} ${W} ${SHOULDER}`

  return (
    <svg
      className="nose-cone"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="ch-fill"
        d={`${left} L0 ${H} H${W} L${W} ${SHOULDER} Q ${W / 2 + 300} ${SHOULDER * 0.62} ${r} 0 H${l} Z`}
      />
      <path
        className="ch-shade"
        d={`${left} L0 ${H} H${W} L${W} ${SHOULDER} Q ${W / 2 + 300} ${SHOULDER * 0.62} ${r} 0 H${l} Z`}
      />

      {/* section rings down the cone, near arc solid and far arc light */}
      {[0.3, 0.55, 0.78].map((t) => {
        // follow the same quadratic the silhouette uses, so a ring always
        // lands exactly on the edge instead of near it
        const hw = TIP + (W / 2 - TIP) * (2 * t * (1 - t) * 0.72 + t * t)
        const y = SHOULDER * t
        return (
          <g key={t}>
            <path className="ch-ring-far" d={`M${W / 2 - hw} ${y} A ${hw} 13 0 0 0 ${W / 2 + hw} ${y}`} />
            <path className="ch-ring" d={`M${W / 2 - hw} ${y} A ${hw} 13 0 0 1 ${W / 2 + hw} ${y}`} />
          </g>
        )
      })}

      <path className="ch-edge" d={left} />
      <path className="ch-edge" d={right} />

      {/* the shoulder, where the cone becomes the pressurized hull */}
      <path className="ch-ring-far" d={`M0 ${SHOULDER} A ${W / 2} 15 0 0 0 ${W} ${SHOULDER}`} />
      <path className="ch-ring" d={`M0 ${SHOULDER} A ${W / 2} 15 0 0 1 ${W} ${SHOULDER}`} />

      {/* the forward hatch ring at the apex */}
      <path className="ch-ring-far" d={`M${l} 0 A ${TIP} 9 0 0 0 ${r} 0`} />
      <path className="ch-ring" d={`M${l} 0 A ${TIP} 9 0 0 1 ${r} 0`} />
    </svg>
  )
}

/* ---- crew windows ----
 *
 * Five, as a command module has: two forward, two side, one hatch window.
 * Trapezoids because they sit on a curving surface, with a frame, a pane and
 * a sunshade stowed above each.
 */
function Windows() {
  const panes = [
    { x: -188, w: 46, h: 34 },
    { x: -104, w: 54, h: 40 },
    { x: -14, w: 58, h: 44 },
    { x: 78, w: 54, h: 40 },
    { x: 160, w: 46, h: 34 },
  ]
  return (
    <svg
      className="nose-win"
      viewBox="-240 -40 480 96"
      width="480"
      height="96"
      aria-hidden="true"
      focusable="false"
    >
      {panes.map((p) => {
        // The cone widens downward, so a window on it is narrower at the top.
        // Inset the top edge, not the bottom.
        const inset = p.w * 0.13
        const frame = `M${p.x + inset} 0 L${p.x + p.w - inset} 0 L${p.x + p.w} ${p.h} L${p.x} ${p.h} Z`
        return (
          <g key={p.x}>
            <path className="dfill" d={frame} />
            <path className="d1" d={frame} fill="none" />
            <path
              className="d3"
              d={`M${p.x + inset + 4} 5 L${p.x + p.w - inset - 4} 5 L${p.x + p.w - 4} ${p.h - 5} L${p.x + 4} ${p.h - 5} Z`}
              fill="none"
            />
            {/* sunshade, stowed above the frame */}
            <rect className="dfill" x={p.x + inset} y={-11} width={p.w - inset * 2} height="8" />
            <rect className="d2" x={p.x + inset} y={-11} width={p.w - inset * 2} height="8" fill="none" />
          </g>
        )
      })}
    </svg>
  )
}

/* ---- high-gain antenna ----
 *
 * A dish on a gimballed boom, reaching into the gutter the way the arrays do.
 * Drawn as an ellipse seen off-axis, with its rim, radial ribs and a feed
 * horn on a tripod.
 */
export function Antenna() {
  const RX = 54
  const RY = 76
  return (
    <svg
      className="hga"
      viewBox="-20 -96 200 192"
      width="200"
      height="192"
      aria-hidden="true"
      focusable="false"
    >
      {/* boom out from the hull, with its gimbal */}
      <line className="d1" x1="0" y1="0" x2="66" y2="0" />
      <line className="d3" x1="0" y1="-4" x2="66" y2="-4" />
      <rect className="dfill" x="60" y="-16" width="22" height="32" />
      <rect className="d1" x="60" y="-16" width="22" height="32" fill="none" />
      <circle className="d2" cx="71" cy="0" r="7" fill="none" />

      {/* the dish */}
      <ellipse className="dfill" cx={82 + RX} cy="0" rx={RX} ry={RY} />
      <ellipse className="d1" cx={82 + RX} cy="0" rx={RX} ry={RY} fill="none" />
      <ellipse className="d3" cx={82 + RX} cy="0" rx={RX * 0.66} ry={RY * 0.66} fill="none" />
      <ellipse className="d3" cx={82 + RX} cy="0" rx={RX * 0.33} ry={RY * 0.33} fill="none" />
      {/* radial ribs */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <line
            key={i}
            className="d3"
            x1={82 + RX}
            y1="0"
            x2={82 + RX + RX * Math.cos(a)}
            y2={RY * Math.sin(a)}
          />
        )
      })}
      {/* feed horn on its tripod */}
      <line className="d2" x1={82 + RX} y1={-RY * 0.7} x2={102 + RX} y2="0" />
      <line className="d2" x1={82 + RX} y1={RY * 0.7} x2={102 + RX} y2="0" />
      <line className="d2" x1={82 + RX} y1="0" x2={102 + RX} y2="0" />
      <rect className="dfill" x={100 + RX} y="-7" width="14" height="14" />
      <rect className="d1" x={100 + RX} y="-7" width="14" height="14" fill="none" />
    </svg>
  )
}

export default function Nose() {
  return (
    <div className="nose" aria-hidden="true">
      <div className="tube nose-inner">
        <Cone />
        <Windows />
        <p className="nose-plate">
          <span className="np-tag">CM</span>
          <span className="np-name">COMMAND MODULE</span>
        </p>
      </div>
      <span className="hga-mount hga-mount--r">
        <Antenna />
      </span>
    </div>
  )
}
