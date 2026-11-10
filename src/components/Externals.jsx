/* External hardware: arrays, thrusters, the main engine.
 *
 * Everything here is drawn the same way the coupling is — real parts with
 * real geometry, on the shared .d1/.d2/.d3 line scale — so the outside of the
 * craft matches the inside of the drawing.
 */

/* ---- solar array -------------------------------------------------------
 *
 * Drawn from the ISS array-configuration and Spektr sheets: a beta gimbal at
 * the root, a lattice mast, then two blankets in a gridded frame with a
 * centre batten between them.
 *
 * The wing is skewed rather than drawn as a flat rectangle. A real array is a
 * plane in space, and seen from slightly off its edge the outboard end sits
 * higher on the page than the root — the skew is what puts it in the same 3D
 * scene as the ring instead of pasting a rectangle over it.
 */
/* Cell counts per blanket. The big variant is not the small one scaled up -
 * it carries more cells, because a longer array has more cells, not larger
 * ones. Stretching nine cells across 760px would read as a fence. */
const SMALL = { len: 232, h: 118, cx: 9, cy: 3 }
const BIG = { len: 760, h: 252, cx: 22, cy: 5 }

function Blanket({ x1, x2, y1, y2, CX, CY }) {
  const w = x2 - x1
  const h = y2 - y1
  const out = []
  for (let i = 1; i < CX; i += 1) {
    const x = x1 + (w * i) / CX
    out.push(<line key={`v${i}`} className="d3" x1={x} y1={y1} x2={x} y2={y2} />)
  }
  for (let j = 1; j < CY; j += 1) {
    const y = y1 + (h * j) / CY
    out.push(<line key={`h${j}`} className="d3" x1={x1} y1={y} x2={x2} y2={y} />)
  }
  return (
    <g>
      <rect className="dfill" x={x1} y={y1} width={w} height={h} />
      {/* SPIKE: the photovoltaic wash. Under the cell grid, inside the frame
       * line - a fill, never a stroke, so the blanket stays drawn. */}
      <rect className="pv" x={x1} y={y1} width={w} height={h} />
      <g className="pv-grid">{out}</g>
      <rect className="d2" x={x1} y={y1} width={w} height={h} fill="none" />
    </g>
  )
}

export function SolarArray({ big = false, flip = false }) {
  const { len, h, cx: CX, cy: CY } = big ? BIG : SMALL
  const k = big ? 2.1 : 1 // fitting sizes scale with the wing, cells do not
  const mastX = big ? 128 : 54
  const tip = len - 4
  const mid = h / 2

  return (
    <svg
      className={`array${flip ? ' array--flip' : ''}`}
      viewBox={`0 0 ${len} ${h}`}
      width={len}
      height={h}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`skewY(-5) translate(0 ${h * 0.08})`}>
        {/* beta gimbal: the joint the whole wing rotates on */}
        <rect className="dfill" x="2" y={mid - 17 * k} width={30 * k} height={34 * k} />
        <rect className="pv-frame" x="2" y={mid - 17 * k} width={30 * k} height={34 * k} />
        <rect className="d1" x="2" y={mid - 17 * k} width={30 * k} height={34 * k} fill="none" />
        <ellipse className="d2" cx={17 * k} cy={mid} rx={8 * k} ry={11 * k} fill="none" />
        <ellipse className="d3" cx={17 * k} cy={mid} rx={3.5 * k} ry={5 * k} fill="none" />
        <line className="d3" x1={6 * k} y1={mid - 12 * k} x2={6 * k} y2={mid + 12 * k} />
        <line className="d3" x1={28 * k} y1={mid - 12 * k} x2={28 * k} y2={mid + 12 * k} />

        {/* lattice mast — a boom is a truss, not a stick */}
        <line className="d1" x1={32 * k} y1={mid - 9 * k} x2={mastX} y2={mid - 9 * k} />
        <line className="d1" x1={32 * k} y1={mid + 9 * k} x2={mastX} y2={mid + 9 * k} />
        {[0, 1, 2, 3, 4, 5].map((j) => {
          const a = 32 * k + ((mastX - 32 * k) * j) / 6
          const b = 32 * k + ((mastX - 32 * k) * (j + 1)) / 6
          return (
            <line
              key={j}
              className="d3"
              x1={a}
              y1={j % 2 ? mid + 9 * k : mid - 9 * k}
              x2={b}
              y2={j % 2 ? mid - 9 * k : mid + 9 * k}
            />
          )
        })}

        {/* the two blankets, and the batten that separates them */}
        <Blanket x1={mastX} x2={tip} y1={6} y2={mid - 5} CX={CX} CY={CY} />
        <Blanket x1={mastX} x2={tip} y1={mid + 5} y2={h - 6} CX={CX} CY={CY} />
        <line className="d1" x1={mastX} y1={mid} x2={tip} y2={mid} />

        {/* tip batten, with its tensioning fittings */}
        <line className="d1" x1={tip} y1="4" x2={tip} y2={h - 4} />
        <line className="d2" x1={tip + 3} y1="10" x2={tip + 3} y2={h - 10} />
        <line className="d3" x1={tip} y1={mid - 24 * k} x2={tip + 3} y2={mid - 24 * k} />
        <line className="d3" x1={tip} y1={mid + 24 * k} x2={tip + 3} y2={mid + 24 * k} />
      </g>
    </svg>
  )
}

/* ---- reaction control quad --------------------------------------------
 *
 * From the Apollo service-module sheet: four engines on one pad, firing in
 * four directions. Three read as bells from this angle; the fourth points at
 * the camera, so it is correctly just a rim.
 */
function Bell({ x, y, r, dir }) {
  // dir: 1 down, -1 up, 2 outboard
  const p =
    dir === 2
      ? `M${x} ${y - r * 0.5} L${x + r * 1.7} ${y - r} L${x + r * 1.7} ${y + r} L${x} ${y + r * 0.5} Z`
      : `M${x - r * 0.5} ${y} L${x - r} ${y + dir * r * 1.7} L${x + r} ${y + dir * r * 1.7} L${x + r * 0.5} ${y} Z`
  return (
    <>
      <path className="dfill" d={p} />
      <path className="eng-tint" d={p} />
      <path className="d1" d={p} fill="none" />
    </>
  )
}

export function RcsQuad({ size = 54 }) {
  const c = size / 2
  return (
    <svg
      className="rcs"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {/* mounting pad */}
      <rect className="dfill tz-mech" x={c - 11} y={c - 11} width="22" height="22" />
      <rect className="d1" x={c - 11} y={c - 11} width="22" height="22" fill="none" />
      <line className="d3" x1={c - 7} y1={c - 7} x2={c + 7} y2={c - 7} />
      <line className="d3" x1={c - 7} y1={c + 7} x2={c + 7} y2={c + 7} />

      <Bell x={c} y={c - 10} r={6} dir={-1} />
      <Bell x={c} y={c + 10} r={6} dir={1} />
      <Bell x={c + 10} y={c} r={6} dir={2} />
      {/* the fourth fires toward you */}
      <circle className="dfill" cx={c - 6} cy={c} r="5" />
      <circle className="d2" cx={c - 6} cy={c} r="5" fill="none" />
      <circle className="d3" cx={c - 6} cy={c} r="2" fill="none" />
    </svg>
  )
}

/* ---- array boom --------------------------------------------------------
 *
 * The span between the adapter's rim and the array's gimbal. Without it the
 * wings hang in the gutter attached to nothing, because the hull has necked
 * in by the height they mount at.
 *
 * Stretched to whatever the gap is: a lattice is straight lines, and straight
 * lines survive a non-uniform scale. The bays get wider on a wider page,
 * which is what a longer truss looks like anyway.
 */
export function Boom() {
  const BAYS = 7
  const W = 210
  const step = W / BAYS
  return (
    <svg
      className="boom"
      viewBox={`0 0 ${W} 56`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <line className="d2" x1="0" y1="16" x2={W} y2="16" />
      <line className="d2" x1="0" y1="40" x2={W} y2="40" />
      {Array.from({ length: BAYS }).map((_, i) => (
        <g key={i}>
          <line
            className="d3"
            x1={i * step}
            y1={i % 2 ? 40 : 16}
            x2={(i + 1) * step}
            y2={i % 2 ? 16 : 40}
          />
          <line className="d3" x1={(i + 1) * step} y1="16" x2={(i + 1) * step} y2="40" />
        </g>
      ))}
    </svg>
  )
}
