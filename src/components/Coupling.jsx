/* A docking coupling, drawn at three quarters.
 *
 * This is authored line art, not parametric decoration. The difference
 * matters: a dashed ellipse is not a bolt circle and a repeating gradient is
 * not a knurled collar. Everything here is a real part with a diameter, a
 * thickness and a feature cut into it.
 *
 * Construction: the assembly is built along a horizontal axis in a local
 * frame, where a circle perpendicular to that axis projects to an ellipse of
 * rx = r * FORE and ry = r. The whole group is then rotated by AXIS, so one
 * number changes the viewing angle of every part at once.
 *
 * Pieces are emitted far end first and each solid one is filled with paper, so
 * nearer parts occlude the ones behind them. That is what stops a line drawing
 * reading as a wireframe.
 */

const FORE = 0.32 // how hard a circle foreshortens at this viewing angle
const AXIS = -31 // degrees the assembly's axis sits at on the page

/* ---- primitives ------------------------------------------------------ */

/* A cylinder from x1 to x2. The near cap is drawn; the far one is left to be
 * covered by whatever sits behind it. */
function Barrel({ x1, x2, r, cls = 'd1', shade = true, capFar = false }) {
  return (
    <>
      {/* the far cap, only on the piece at the very end of the stack - every
        * other one is covered by what sits behind it, and an unfilled end
        * face lets the star field show straight through the hardware */}
      {capFar && <ellipse className="dfill" cx={x1} cy={0} rx={r * FORE} ry={r} />}
      <rect className="dfill" x={x1} y={-r} width={x2 - x1} height={r * 2} />
      <ellipse className="dfill" cx={x2} cy={0} rx={r * FORE} ry={r} />
      {/* contour shading: lines along the barrel bunched toward the lower
        * limb, which is how a drawn cylinder reads as round rather than flat */}
      {shade &&
        [0.46, 0.62, 0.73, 0.82].map((f) => (
          <line key={f} className="d3" x1={x1 + r * FORE * 0.4} y1={r * f} x2={x2} y2={r * f} />
        ))}
      <line className={cls} x1={x1} y1={-r} x2={x2} y2={-r} />
      <line className={cls} x1={x1} y1={r} x2={x2} y2={r} />
      <ellipse className={cls} cx={x2} cy={0} rx={r * FORE} ry={r} fill="none" />
    </>
  )
}

/* A taper between two diameters. Without these the stack reads as loose parts
 * floating near each other rather than one machined assembly. */
function Cone({ x1, r1, x2, r2, cls = 'd1' }) {
  return (
    <>
      <path className="dfill" d={`M${x1} ${-r1} L${x2} ${-r2} L${x2} ${r2} L${x1} ${r1} Z`} />
      <ellipse className="dfill" cx={x2} cy={0} rx={r2 * FORE} ry={r2} />
      <line className={cls} x1={x1} y1={-r1} x2={x2} y2={-r2} />
      <line className={cls} x1={x1} y1={r1} x2={x2} y2={r2} />
      <ellipse className={cls} cx={x2} cy={0} rx={r2 * FORE} ry={r2} fill="none" />
    </>
  )
}

/* A plate: a short cylinder whose thickness you can see. */
function Flange({ x, r, t = 5, cls = 'd1' }) {
  return <Barrel x1={x} x2={x + t} r={r} cls={cls} shade={false} />
}

/* Teeth cut around a rim — the knurled collar, and the fine splines. */
function Teeth({ x, r, n, len, cls = 'd2' }) {
  const out = []
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    out.push(
      <line
        key={i}
        className={cls}
        x1={x + r * FORE * c}
        y1={r * s}
        x2={x + (r + len) * FORE * c}
        y2={(r + len) * s}
      />,
    )
  }
  return <g>{out}</g>
}

/* Latching lugs stood off the body, as on the reference's lower half. */
function Lugs({ x, r, n, w = 13, h = 17, cls = 'd1' }) {
  const out = []
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2
    const cx = x + r * FORE * Math.cos(a)
    const cy = r * Math.sin(a)
    out.push(
      <g key={i}>
        <rect className="dfill" x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" />
        <rect className={cls} x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" fill="none" />
        <line className="d3" x1={cx - w / 2 + 3} y1={cy - h / 2 + 3} x2={cx - w / 2 + 3} y2={cy + h / 2 - 3} />
      </g>,
    )
  }
  return <g>{out}</g>
}

/* Rectangular bosses sitting on a barrel — connectors and fittings. */
function Bosses({ x, r, n, cls = 'd1' }) {
  const out = []
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2 + 0.4
    const s = Math.sin(a)
    if (Math.cos(a) < -0.1) continue // only the ones facing us
    const cy = r * s
    out.push(
      <g key={i}>
        <rect className="dfill" x={x} y={cy - 7} width={22} height={14} />
        <rect className={cls} x={x} y={cy - 7} width={22} height={14} fill="none" />
        <line className="d3" x1={x + 5} y1={cy - 2} x2={x + 17} y2={cy - 2} />
      </g>,
    )
  }
  return <g>{out}</g>
}

/* A bellows: stacked rings, which is how the reference draws its flexible
 * section and how it actually looks. */
function Bellows({ x1, x2, r, n = 7, cls = 'd2' }) {
  const out = [
    /* a filled core under the rings. Convolutions are open shapes, so without
     * this the star field shows straight through the flexible section. */
    <rect key="core" className="dfill" x={x1} y={-r} width={x2 - x1} height={r * 2} />,
  ]
  const step = (x2 - x1) / n
  for (let i = 0; i <= n; i += 1) {
    const xx = x1 + step * i
    const rr = r + (i % 2 === 0 ? 0 : 4)
    out.push(<ellipse key={i} className={cls} cx={xx} cy={0} rx={rr * FORE} ry={rr} fill="none" />)
  }
  return <g>{out}</g>
}

/* Ports let into a face. */
function Ports({ x, r, n, cls = 'd2' }) {
  const out = []
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2 + 0.6
    if (Math.cos(a) < 0) continue
    out.push(
      <ellipse
        key={i}
        className={cls}
        cx={x + r * 0.62 * FORE * Math.cos(a)}
        cy={r * 0.62 * Math.sin(a)}
        rx={4 * FORE + 2}
        ry={6}
        fill="none"
      />,
    )
  }
  return <g>{out}</g>
}

/* ---- the assembly ---------------------------------------------------- */

export default function Coupling({ width = 232, height = 208 }) {
  /* The assembly runs x = -96 to 112, so its middle sits at 8. Rotating
   * first and shifting second moves it along its own axis, which is what
   * centres it in the frame without changing the viewing angle. */
  return (
    <svg
      className="coupling"
      viewBox="-134 -120 268 240"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`rotate(${AXIS}) translate(-8 0)`}>
        {/* far end: the passive collar, knurled, with its own back ring */}
        <Teeth x={-96} r={62} n={44} len={7} cls="d2" />
        <Barrel x1={-96} x2={-80} r={62} capFar shade={false} />
        <ellipse className="d3" cx={-96} cy={0} rx={62 * FORE} ry={62} fill="none" />
        <ellipse className="d2" cx={-80} cy={0} rx={50 * FORE} ry={50} fill="none" />
        <ellipse className="d3" cx={-80} cy={0} rx={40 * FORE} ry={40} fill="none" />

        {/* taper down to the neck, so the collar is bolted to the assembly
          * rather than hovering beside it */}
        <Cone x1={-80} r1={56} x2={-66} r2={36} />

        {/* the neck, with fittings stood off it */}
        <Barrel x1={-66} x2={-42} r={36} />
        <Bosses x={-62} r={36} n={7} />
        <Flange x={-42} r={40} t={4} />

        {/* the bolted stack: plates of falling diameter */}
        <Flange x={-38} r={46} t={4} />
        <Flange x={-34} r={41} t={5} />
        <Flange x={-29} r={46} t={5} />
        <Teeth x={-38} r={46} n={30} len={4} cls="d3" />
        <Teeth x={-24} r={46} n={56} len={4} cls="d3" />

        {/* fine splines on the drive band */}
        <Barrel x1={-24} x2={4} r={38} />
        <Teeth x={-19} r={38} n={64} len={4} cls="d3" />
        <Teeth x={-4} r={38} n={64} len={4} cls="d3" />

        {/* main body: the thickest section, ported and lugged */}
        <Cone x1={4} r1={38} x2={11} r2={52} />
        <Flange x={11} r={52} t={6} />
        <Barrel x1={17} x2={54} r={50} />
        <Ports x={54} r={50} n={9} />
        <ellipse className="d2" cx={54} cy={0} rx={50 * 0.66 * FORE} ry={50 * 0.66} fill="none" />

        {/* latches around the active ring */}
        <Lugs x={48} r={54} n={12} />

        {/* flexible section into the far module */}
        <Cone x1={54} r1={50} x2={62} r2={40} />
        <Bellows x1={62} x2={98} r={40} n={6} />
        <Cone x1={98} r1={40} x2={104} r2={58} />
        <Barrel x1={104} x2={116} r={58} shade={false} />
        <Teeth x={116} r={58} n={40} len={6} cls="d2" />
        <ellipse className="d2" cx={116} cy={0} rx={44 * FORE} ry={44} fill="none" />
      </g>
    </svg>
  )
}
