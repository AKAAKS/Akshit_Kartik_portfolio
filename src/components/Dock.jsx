/* The docking adapter between two modules.
 *
 * This IS the connector, not a picture of one beside it. The coupling drawing
 * was floating next to the hull because it was built at three quarters and the
 * craft is drawn side-on; the fix is to build the same assembly in the page's
 * own projection so it can simply be the structure.
 *
 * Construction mirrors a real solid of revolution. The axis is vertical, so a
 * circle of radius r projects to a wide shallow ellipse of ry = r * FLAT.
 * FLAT is matched to the hull's own apparent ratio — the ribs render about
 * 20.7px of rise on 530px of half-width — so every ring on the page is seen
 * from the same height. That consistency is the whole reason the adapter sits
 * in the craft instead of on top of it.
 *
 * Near arcs (sweep 1, bulging down toward you) are solid; far arcs (sweep 0)
 * are light. Same rule as Rib, same rule everywhere.
 */

const FLAT = 0.04
const e = (r) => r * FLAT

/* A ring: the section of the solid at one height. */
function Ring({ y, r, cls = 'd2' }) {
  const ry = e(r)
  return (
    <>
      <path className="d3" d={`M${-r} ${y} A ${r} ${ry} 0 0 0 ${r} ${y}`} />
      <path className={cls} d={`M${-r} ${y} A ${r} ${ry} 0 0 1 ${r} ${y}`} />
    </>
  )
}

/* A cylinder. Filled so it occludes whatever is behind it, with the far wall
 * drawn inside as a light arc — that pair is what reads as hollow. */
function Can({ y1, y2, r, cls = 'd1', shade = true, tz }) {
  const ry = e(r)
  return (
    <>
      <path
        className={tz ? `dfill ${tz}` : 'dfill'}
        d={`M${-r} ${y1} L${-r} ${y2} A ${r} ${ry} 0 0 0 ${r} ${y2} L${r} ${y1} Z`}
      />
      {shade &&
        [0.62, 0.78, 0.9].map((f) => (
          <line key={f} className="d3" x1={r * f} y1={y1} x2={r * f} y2={y2} />
        ))}
      <line className={cls} x1={-r} y1={y1} x2={-r} y2={y2} />
      <line className={cls} x1={r} y1={y1} x2={r} y2={y2} />
      <path className="d3" d={`M${-r} ${y2} A ${r} ${ry} 0 0 1 ${r} ${y2}`} />
      <path className={cls} d={`M${-r} ${y2} A ${r} ${ry} 0 0 0 ${r} ${y2}`} />
    </>
  )
}

/* A taper between two diameters. */
function Taper({ y1, r1, y2, r2, cls = 'd1' }) {
  const ry = e(r2)
  return (
    <>
      <path
        className="dfill"
        d={`M${-r1} ${y1} L${-r2} ${y2} A ${r2} ${ry} 0 0 0 ${r2} ${y2} L${r1} ${y1} Z`}
      />
      <line className={cls} x1={-r1} y1={y1} x2={-r2} y2={y2} />
      <line className={cls} x1={r1} y1={y1} x2={r2} y2={y2} />
    </>
  )
}

/* Teeth around a rim: the knurled collars and the fine drive splines. */
function Teeth({ y, r, n, len, cls = 'd3' }) {
  const ry = e(r)
  const out = []
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    out.push(
      <line
        key={i}
        className={cls}
        x1={r * c}
        y1={y + ry * s}
        x2={(r + len) * c}
        y2={y + e(r + len) * s}
      />,
    )
  }
  return <g>{out}</g>
}

/* Latching lugs stood off the body. Drawn back half first so the front ones
 * sit over the barrel. */
function Lugs({ y, r, n, w = 17, h = 22 }) {
  const ry = e(r)
  const idx = Array.from({ length: n }, (_, i) => i)
  idx.sort((p, q) => Math.sin((p / n) * Math.PI * 2) - Math.sin((q / n) * Math.PI * 2))
  return (
    <g>
      {idx.map((i) => {
        const a = (i / n) * Math.PI * 2
        const cx = r * Math.cos(a)
        const cy = y + ry * Math.sin(a)
        return (
          <g key={i}>
            <rect className="dfill" x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" />
            <rect className="d1" x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" fill="none" />
            <line className="d3" x1={cx - w / 2 + 4} y1={cy - h / 2 + 4} x2={cx + w / 2 - 4} y2={cy - h / 2 + 4} />
            <line className="d3" x1={cx} y1={cy - h / 2 + 7} x2={cx} y2={cy + h / 2 - 4} />
          </g>
        )
      })}
    </g>
  )
}

/* Fittings stood off a barrel — the small boxes all over the reference. */
function Bosses({ y, r, n }) {
  const ry = e(r)
  const out = []
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2
    if (Math.sin(a) < -0.2) continue // the back of the barrel
    const cx = r * Math.cos(a) * 0.96
    const cy = y + ry * Math.sin(a)
    out.push(
      <g key={i}>
        <rect className="dfill" x={cx - 11} y={cy - 8} width="22" height="16" />
        <rect className="d2" x={cx - 11} y={cy - 8} width="22" height="16" fill="none" />
        <line className="d3" x1={cx - 6} y1={cy + 2} x2={cx + 6} y2={cy + 2} />
      </g>,
    )
  }
  return <g>{out}</g>
}

/* The flexible section: convolutions, over a filled core so the star field
 * cannot show through a pressure element. */
function Bellows({ y1, y2, r, n = 8 }) {
  const out = []
  const step = (y2 - y1) / n
  for (let i = 0; i <= n; i += 1) {
    const yy = y1 + step * i
    const rr = i % 2 === 0 ? r : r + 9
    out.push(
      <path key={i} className="d2" d={`M${-rr} ${yy} A ${rr} ${e(rr)} 0 0 1 ${rr} ${yy}`} />,
    )
    out.push(
      <path key={`b${i}`} className="d3" d={`M${-rr} ${yy} A ${rr} ${e(rr)} 0 0 0 ${rr} ${yy}`} />,
    )
  }
  return (
    <g>
      <path
        className="dfill"
        d={`M${-r} ${y1} L${-r} ${y2} A ${r} ${e(r)} 0 0 0 ${r} ${y2} L${r} ${y1} Z`}
      />
      {out}
    </g>
  )
}

/* ---- the assembly -------------------------------------------------------
 *
 * Read top to bottom: passive collar, neck, the bolted flange stack, the
 * splined drive band, the ported main body with its latches, the flexible
 * section, and the active collar into the module below.
 */
export const DOCK_W = 560
export const DOCK_H = 264

export default function Dock({ eva = false }) {
  return (
    <svg
      className="dock-core"
      viewBox={`${-DOCK_W / 2} 0 ${DOCK_W} ${DOCK_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* passive collar */}
      <Can y1={0} y2={12} r={280} shade={false} />
      <Teeth y={0} r={280} n={72} len={9} cls="d2" />
      <Ring y={6} r={238} cls="d3" />

      {/* neck, with fittings */}
      <Taper y1={12} r1={280} y2={20} r2={210} />
      <Can y1={20} y2={42} r={210} />
      <Bosses y={30} r={210} n={11} />

      {/* the bolted flange stack */}
      <Can y1={42} y2={48} r={248} shade={false} tz="tz-struct" />
      <Can y1={48} y2={54} r={228} shade={false} tz="tz-struct" />
      <Can y1={54} y2={61} r={248} shade={false} tz="tz-struct" />
      <Teeth y={61} r={248} n={60} len={6} />

      {/* splined drive band */}
      <Can y1={61} y2={92} r={205} tz="tz-mech" />
      <Teeth y={68} r={205} n={84} len={5} />
      <Teeth y={85} r={205} n={84} len={5} />

      {/* main body: the thickest section, ported and latched */}
      <Taper y1={92} r1={205} y2={100} r2={268} />
      <Can y1={100} y2={107} r={268} shade={false} />
      <Can y1={107} y2={148} r={262} />
      <Lugs y={128} r={262} n={16} />

      {/* the docking target, in the one accent colour on the page */}
      <g className="dk-target">
        <ellipse cx="0" cy="120" rx="15" ry="9" />
        <line x1="-24" y1="120" x2="24" y2="120" />
        <line x1="0" y1="112" x2="0" y2="128" />
      </g>

      {/* flexible section */}
      <Taper y1={148} r1={262} y2={156} r2={200} />
      <Bellows y1={156} y2={204} r={200} n={8} />

      {/* active collar into the module below */}
      <Taper y1={204} r1={200} y2={212} r2={250} />
      <Can y1={212} y2={226} r={250} shade={false} />
      <Teeth y={226} r={250} n={64} len={8} cls="d2" />
      <Taper y1={226} r1={250} y2={238} r2={280} />
      <Can y1={238} y2={DOCK_H} r={280} shade={false} />
      <Teeth y={DOCK_H} r={280} n={72} len={9} cls="d2" />

      {/* handrails, because every surface a crew touches has one */}
      {[-1, 1].map((s) => (
        <g key={s} className="dk-rail tz-eva">
          <line x1={s * 236} y1="112" x2={s * 236} y2="144" />
          <line x1={s * 228} y1="112" x2={s * 244} y2="112" />
          <line x1={s * 228} y1="144" x2={s * 244} y2="144" />
        </g>
      ))}

      {eva && (
        <g className="dk-eva">
          <ellipse cx="0" cy="178" rx="46" ry="12" />
        </g>
      )}
    </svg>
  )
}
