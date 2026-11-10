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
const CHAM = 46
const TOP_R = 118 // thrust mount ring: what the hull necks down onto
const INJ = 72

const Y_RING = 0
const Y_RING2 = 24
const Y_INJ = 88
const Y_INJ2 = 106
const Y_CHAM = 118
const Y_CONV = 230
const Y_THR = 268
const Y_EXIT = 560

/* Control point of the bell's quadratic. The tangent at the throat points at
 * it and the tangent at the exit comes from it, so this one pair of numbers
 * sets both how hard the nozzle flares and how straight it runs afterwards.
 * Pulled down the axis from the first attempt, which flared so early the bell
 * came out domed instead of conical. */
const CX = THROAT + 96
const CY = Y_THR + 162

/* One continuous profile, chamber lip to nozzle exit. Everything else on the
 * engine is this curve transformed. */
const PROF = `M${CHAM} ${Y_CHAM} L${CHAM} ${Y_CONV} L${THROAT} ${Y_THR} Q ${CX} ${CY} ${EXIT} ${Y_EXIT}`
const PROF_L = `M${-CHAM} ${Y_CHAM} L${-CHAM} ${Y_CONV} L${-THROAT} ${Y_THR} Q ${-CX} ${CY} ${-EXIT} ${Y_EXIT}`

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
function Band({ y1, y2, r, cls = 'd1' }) {
  const ry = r * FLAT
  return (
    <>
      <path
        className="dfill"
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
  const vanes = []
  for (let i = 0; i < 40; i += 1) {
    const a = (i / 40) * Math.PI * 2
    vanes.push(
      <line
        key={i}
        className="d3"
        x1={x + Math.cos(a) * r * 0.5}
        y1={y + Math.sin(a) * r * 0.5}
        x2={x + Math.cos(a) * r * 0.86}
        y2={y + Math.sin(a) * r * 0.86}
      />,
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
      {/* Bracket back to the chamber. It runs inboard - toward the axis -
        * because that is the only thing there is to mount to. */}
      <rect className="dfill" x={flip ? x - r - 38 : x + r - 8} y={y - 11} width="46" height="22" />
      <rect className="d2" x={flip ? x - r - 38 : x + r - 8} y={y - 11} width="46" height="22" fill="none" />

      <circle className="dfill" cx={x} cy={y} r={r} />
      <circle className="d1" cx={x} cy={y} r={r} fill="none" />
      <circle className="d2" cx={x} cy={y} r={r * 0.86} fill="none" />
      {vanes}
      <circle className="d2" cx={x} cy={y} r={r * 0.5} fill="none" />
      <circle className="d1" cx={x} cy={y} r={r * 0.22} fill="none" />
      <circle className="d3" cx={x} cy={y} r={r * 0.1} fill="none" />
      {bolts}
      {/* drive shaft out to the side */}
      <line className="d2" x1={x} y1={y} x2={x + s * r * 1.5} y2={y + r * 0.5} />
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
      {/* ---- feed lines, behind everything ---- */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path
            className="d3"
            d={`M${s * 176} ${Y_INJ} C ${s * 232} ${Y_CHAM}, ${s * 236} ${Y_THR}, ${s * 212} ${Y_EXIT - 10}`}
            fill="none"
          />
          <path
            className="d3"
            d={`M${s * 182} ${Y_INJ} C ${s * 240} ${Y_CHAM}, ${s * 244} ${Y_THR}, ${s * 220} ${Y_EXIT - 10}`}
            fill="none"
          />
        </g>
      ))}

      {/* ---- thrust mount ring: what the hull bolts to ---- */}
      <Band y1={Y_RING} y2={Y_RING2} r={TOP_R} />
      <Ring y={Y_RING} r={TOP_R * 0.82} cls="d3" />

      {/* struts from the mount down to the injector */}
      {[-1, 1].map((s) =>
        [0, 1].map((k) => (
          <line
            key={`${s}-${k}`}
            className={k ? 'd3' : 'd1'}
            x1={s * (TOP_R - 14 - k * 9)}
            y1={Y_RING2}
            x2={s * (INJ - 10 - k * 7)}
            y2={Y_INJ}
          />
        )),
      )}

      {/* ---- injector dome, bolted ---- */}
      <Band y1={Y_INJ} y2={Y_INJ2} r={INJ} />
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
      <Ring y={Y_INJ2} r={CHAM + 8} cls="d2" />

      {/* ---- the chamber and nozzle as one cooled body ---- */}
      <path
        className="dfill"
        d={`${PROF_L} A ${EXIT} ${EXIT * FLAT} 0 0 1 ${EXIT} ${Y_EXIT} Q ${CX} ${CY} ${THROAT} ${Y_THR} L${CHAM} ${Y_CONV} L${CHAM} ${Y_CHAM} Z`}
      />

      {/* the tube bundle */}
      {cs.map((c, i) => (
        <path key={i} className="d3" d={PROF} fill="none" transform={`scale(${c} 1)`} />
      ))}

      {/* stiffening hoops */}
      {hoops.map((t) => (
        <Ring key={t} y={yAt(t)} r={rAt(t)} cls="d2" />
      ))}
      <Ring y={Y_CONV} r={CHAM} cls="d2" />

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
