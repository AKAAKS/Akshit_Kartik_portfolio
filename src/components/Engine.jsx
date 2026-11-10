/* The main engine.
 *
 * Drawn from the engine sheet in inspo/: a regeneratively cooled chamber and
 * nozzle, which is why the whole thing is sheathed in closely spaced
 * longitudinal tubes rather than being a smooth cone. That tube bundle is the
 * engine's entire visual identity — a plain bell with a few ribs reads as a
 * funnel.
 *
 * The tubes are the silhouette's own profile scaled horizontally. A tube at
 * angle t around the bell sits at x = r·cos t, so scaling the profile in x by
 * cos t IS that tube, exactly, over its whole length from chamber to exit.
 * Spacing the angles evenly bunches the tubes toward the edges, which is what
 * foreshortening does and what the reference shows.
 */

const FLAT = 0.18 // how open the engine's own rings are

const EXIT = 190
const THROAT = 34
const CHAM = 54 // the convergent's top, where it meets the injector dome
const TOP_R = 118 // thrust mount ring: what the hull necks down onto
const INJ = 72

const Y_RING = 0
const Y_RING2 = 24
const Y_INJ = 88
const Y_INJ2 = 106
/* No straight chamber section. The bell converges to the throat directly
 * under the injector dome, so one shape runs from the bolted dome to the
 * exit with nothing cylindrical in between. */
const Y_THR = 150
const Y_EXIT = 442

/* Control point of the bell's quadratic, and the only thing that decides
 * whether the nozzle is a cone or a bell.
 *
 * Outboard of the throat-to-exit chord the wall is convex: it swells away
 * from the throat and then runs nearly parallel to the axis at the exit,
 * which is the hemispherical bell a real nozzle has and the bullet end this
 * one should have. Keeping CX close to EXIT holds that exit tangent near
 * vertical. Inboard of the chord it would be a straight cone. */
const CX = THROAT + 142
const CY = Y_THR + 84

/* One continuous profile, injector dome to nozzle exit. Everything else on
 * the engine is this curve transformed. */
const PROF = `M${CHAM} ${Y_INJ2} L${THROAT} ${Y_THR} Q ${CX} ${CY} ${EXIT} ${Y_EXIT}`
const PROF_L = `M${-CHAM} ${Y_INJ2} L${-THROAT} ${Y_THR} Q ${-CX} ${CY} ${-EXIT} ${Y_EXIT}`

/* Radius of the bell at parameter t along the quadratic, so a hoop lands on
 * the silhouette instead of near it. */
const rAt = (t) => {
  const m = 1 - t
  return m * m * THROAT + 2 * m * t * CX + t * t * EXIT
}
const yAt = (t) => {
  const m = 1 - t
  return m * m * Y_THR + 2 * m * t * CY + t * t * Y_EXIT
}

/* A ring seen at this engine's viewing angle. */
function Ring({ y, r, cls = 'd2' }) {
  const ry = r * FLAT
  return (
    <>
      <path className="d3" d={`M${-r} ${y} A ${r} ${ry} 0 0 0 ${r} ${y}`} fill="none" />
      <path className={cls} d={`M${-r} ${y} A ${r} ${ry} 0 0 1 ${r} ${y}`} fill="none" />
    </>
  )
}

/* A band: two rings and the wall between them. */
function Band({ y1, y2, r, cls = 'd1', tz }) {
  const ry = r * FLAT
  return (
    <>
      <path
        className={tz ? `dfill ${tz}` : 'dfill'}
        d={`M${-r} ${y1} L${-r} ${y2} A ${r} ${ry} 0 0 0 ${r} ${y2} L${r} ${y1} Z`}
      />
      <line className={cls} x1={-r} y1={y1} x2={-r} y2={y2} />
      <line className={cls} x1={r} y1={y1} x2={r} y2={y2} />
      <Ring y={y1} r={r} cls={cls} />
      <Ring y={y2} r={r} cls={cls} />
    </>
  )
}

/* A turbopump: a vaned volute on a bolted flange, one either side. */
function Pump({ x, y, r = 44, flip = false }) {
  /* Impeller vanes. These were straight radial spokes, which is why the
   * pump read as a wheel rather than as a pump - a volute's vanes sweep
   * back as they go out. Each is a quadratic from the inner radius to the
   * outer one, trailing by SWEEP radians, with its control point at an
   * intermediate radius and angle so the curve bows the right way. */
  const SWEEP = 0.46
  const vanes = []
  for (let i = 0; i < 40; i += 1) {
    const a = (i / 40) * Math.PI * 2
    const pt = (ang, rad) => [x + Math.cos(ang) * r * rad, y + Math.sin(ang) * r * rad]
    const [x0, y0] = pt(a, 0.5)
    const [cx, cy] = pt(a + SWEEP * 0.45, 0.63)
    const [x1, y1] = pt(a + SWEEP, 0.86)
    vanes.push(
      <path key={i} className="d3" d={`M${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`} fill="none" />,
    )
  }
  const bolts = []
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2 + 0.26
    bolts.push(
      <circle
        key={i}
        className="d3"
        cx={x + Math.cos(a) * r * 0.93}
        cy={y + Math.sin(a) * r * 0.93}
        r="2.4"
        fill="none"
      />,
    )
  }
  const s = flip ? -1 : 1
  return (
    <g>
      {/* Mounting arm back to the chamber, inboard toward the axis. A
        * cast arm is waisted, not a rectangle, so its edges are curves that
        * pinch toward the middle of the span. */}
      {(() => {
        const dir = flip ? -1 : 1
        const x0 = x + dir * (r - 6)
        const x1 = x + dir * (r + 40)
        const mx = (x0 + x1) / 2
        const arm = `M${x0} ${y - 13} Q ${mx} ${y - 6} ${x1} ${y - 10} L${x1} ${y + 10} Q ${mx} ${y + 6} ${x0} ${y + 13} Z`
        return (
          <>
            <path className="dfill" d={arm} />
            <path className="d2" d={arm} fill="none" />
          </>
        )
      })()}

      <circle className="dfill tz-mech" cx={x} cy={y} r={r} />
      <circle className="d1" cx={x} cy={y} r={r} fill="none" />
      <circle className="d2" cx={x} cy={y} r={r * 0.86} fill="none" />
      {vanes}
      <circle className="d2" cx={x} cy={y} r={r * 0.5} fill="none" />
      <circle className="d1" cx={x} cy={y} r={r * 0.22} fill="none" />
      <circle className="d3" cx={x} cy={y} r={r * 0.1} fill="none" />
      {bolts}
      {/* drive take-off, curving away from the housing */}
      <path
        className="d2"
        d={`M${x} ${y} Q ${x + s * r * 1.0} ${y + r * 0.1} ${x + s * r * 1.5} ${y + r * 0.52}`}
        fill="none"
      />
    </g>
  )
}

export default function Engine({ width = 480 }) {
  const H = Y_EXIT + EXIT * FLAT + 26

  // Tube angles. Evenly spaced in angle, not in x, so they crowd at the
  // edges exactly as the real bundle does.
  const N = 46
  const cs = []
  for (let i = 0; i < N; i += 1) cs.push(Math.cos(((i + 0.5) / N) * Math.PI))

  const hoops = [0.3, 0.56, 0.8]

  return (
    <svg
      className="engine"
      viewBox={`${-EXIT - 76} ${-18} ${(EXIT + 76) * 2} ${H + 18}`}
      width={width}
      height={(width * (H + 18)) / ((EXIT + 76) * 2)}
      aria-hidden="true"
      focusable="false"
    >
      {/* ---- thrust mount ring: what the hull bolts to ---- */}
      <Band y1={Y_RING} y2={Y_RING2} r={TOP_R} />
      <Ring y={Y_RING} r={TOP_R * 0.82} cls="d3" />

      {/* struts from the mount down to the injector */}
      {[-1, 1].map((s) =>
        [0, 1].map((k) => {
          const x0 = s * (TOP_R - 14 - k * 9)
          const x1 = s * (INJ - 10 - k * 7)
          // bowed slightly outboard, the way a real thrust strut is formed
          const cx = s * (Math.abs(x0) * 0.46 + Math.abs(x1) * 0.54 + 10)
          return (
            <path
              key={`${s}-${k}`}
              className={k ? 'd3' : 'd1'}
              d={`M${x0} ${Y_RING2} Q ${cx} ${(Y_RING2 + Y_INJ) / 2} ${x1} ${Y_INJ}`}
              fill="none"
            />
          )
        }),
      )}

      {/* ---- injector dome, bolted ---- */}
      <Band y1={Y_INJ} y2={Y_INJ2} r={INJ} tz="tz-therm" />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2
        return (
          <circle
            key={i}
            className="d3"
            cx={Math.cos(a) * INJ * 0.84}
            cy={Y_INJ + Math.sin(a) * INJ * 0.84 * FLAT}
            r="2"
            fill="none"
          />
        )
      })}
      <Ring y={Y_INJ2} r={CHAM} cls="d2" />

      {/* ---- the chamber and nozzle as one cooled body ---- */}
      <path
        className="dfill"
        d={`${PROF_L} A ${EXIT} ${EXIT * FLAT} 0 0 1 ${EXIT} ${Y_EXIT} Q ${CX} ${CY} ${THROAT} ${Y_THR} L${CHAM} ${Y_INJ2} Z`}
      />
      {/* Heat tint. A bell that has fired is copper near the throat and
       * straw at the exit; one flat wash is the printed version of that. */}
      <path
        className="eng-tint"
        d={`${PROF_L} A ${EXIT} ${EXIT * FLAT} 0 0 1 ${EXIT} ${Y_EXIT} Q ${CX} ${CY} ${THROAT} ${Y_THR} L${CHAM} ${Y_INJ2} Z`}
      />

      {/* the tube bundle */}
      {cs.map((c, i) => (
        <path key={i} className="d3" d={PROF} fill="none" transform={`scale(${c} 1)`} />
      ))}

      {/* stiffening hoops */}
      {hoops.map((t) => (
        <Ring key={t} y={yAt(t)} r={rAt(t)} cls="d2" />
      ))}

      {/* the silhouette, drawn last so it sits over the tubes */}
      <path className="d1" d={PROF} fill="none" />
      <path className="d1" d={PROF_L} fill="none" />

      {/* the exit: a full rim, because you can see into the nozzle */}
      <path
        className="d3"
        d={`M${-EXIT} ${Y_EXIT} A ${EXIT} ${EXIT * FLAT} 0 0 0 ${EXIT} ${Y_EXIT}`}
        fill="none"
      />
      <path
        className="d1"
        d={`M${-EXIT} ${Y_EXIT} A ${EXIT} ${EXIT * FLAT} 0 0 1 ${EXIT} ${Y_EXIT}`}
        fill="none"
      />
      <path
        className="d3"
        d={`M${-EXIT + 12} ${Y_EXIT} A ${EXIT - 12} ${(EXIT - 12) * FLAT} 0 0 0 ${EXIT - 12} ${Y_EXIT}`}
        fill="none"
      />

      {/* Hazard decal on the thrust structure. Diagonal bars between
        * the two mount rings, clipped to that band. */}
      <g className="hz">
        <clipPath id="hz-clip">
          <rect x={-TOP_R} y={Y_RING} width={TOP_R * 2} height={Y_RING2 - Y_RING} />
        </clipPath>
        <g clipPath="url(#hz-clip)">
          {Array.from({ length: 40 }).map((_, i) => (
            <path
              key={i}
              className="hz-bar"
              d={`M${-TOP_R + i * 12} ${Y_RING2} l10 0 l10 ${-(Y_RING2 - Y_RING)} l-10 0 Z`}
            />
          ))}
        </g>
      </g>

      {/* ---- turbopumps ---- */}
      <Pump x={-148} y={62} />
      <Pump x={148} y={62} flip />
    </svg>
  )
}

/* The mount ring's half-width, published so the hull's aft taper can neck
 * down onto exactly this and not approximately it. */
export const ENGINE_TOP_R = TOP_R
export const ENGINE_VB_HALF = EXIT + 76
