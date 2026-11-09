/* The connector between two modules.
 *
 * On the station you do not cross a line from one module to the next, you
 * pass through a docking adapter: a narrower barrel bolted between two
 * pressure hulls, ringed with fasteners, strung with utility jumpers, and
 * placarded. Nothing here carries content, so it is the one place on the page
 * that can be dense.
 *
 * Geometry is split deliberately. The silhouette stretches to whatever the
 * tube's width is, so it is drawn in a viewBox with preserveAspectRatio="none"
 * and non-scaling strokes — lines and arcs survive that, and an arc stretched
 * wider is exactly the ellipse we want. The detail cluster must NOT stretch,
 * or the bolt circle turns into an oval and the target goes lopsided, so it
 * is a second SVG at natural size, centred.
 *
 * `from` and `into` decide which of three this is: an ordinary hatch, the
 * airlock out to the truss, or the way back in. */

const W = 1000 // silhouette viewBox width; maps to the tube's full width
const H = 190
const BARREL = 300 // half-width of the narrow section, in viewBox units

export default function Hatch({ from, into, index, total }) {
  const exiting = Boolean(into.external)
  const entering = Boolean(from.external)
  const eva = exiting || entering

  const l = W / 2 - BARREL // left edge of the barrel
  const r = W / 2 + BARREL
  const yA = 32             // where the wide hull stops
  const yB = 62             // where the barrel starts
  const yC = H - 62
  const yD = H - 32

  return (
    <div
      className={`hatch${eva ? ' hatch--eva' : ''}`}
      data-cap={exiting ? 'exit' : entering ? 'enter' : undefined}
    >
      <div className="connector">
        {/* ---- silhouette: stretches with the tube ---- */}
        <svg
          className="conn-hull"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* The hull's own fill, carried through the connector. Without it
            * the tube would go transparent here and the star field would
            * show straight through the pressure vessel. Same cross-axis
            * shading as the straight runs, so the hull reads continuous. */}
          <defs>
            <linearGradient id="hullshade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(15,17,19,0.075)" />
              <stop offset="4%" stopColor="rgba(15,17,19,0.022)" />
              <stop offset="16%" stopColor="rgba(15,17,19,0)" />
              <stop offset="84%" stopColor="rgba(15,17,19,0)" />
              <stop offset="96%" stopColor="rgba(15,17,19,0.022)" />
              <stop offset="100%" stopColor="rgba(15,17,19,0.075)" />
            </linearGradient>
          </defs>
          <path
            className="ch-fill"
            d={`M0 0 H${W} V${yA} L${r} ${yB} V${yC} L${W} ${yD} V${H} H0 V${yD} L${l} ${yC} V${yB} L0 ${yA} Z`}
          />
          <path
            className="ch-shade"
            d={`M0 0 H${W} V${yA} L${r} ${yB} V${yC} L${W} ${yD} V${H} H0 V${yD} L${l} ${yC} V${yB} L0 ${yA} Z`}
          />

          {/* hull stepping in to the adapter and back out */}
          <path className="ch-edge" d={`M0 0 V${yA} L${l} ${yB} V${yC} L0 ${yD} V${H}`} />
          <path className="ch-edge" d={`M${W} 0 V${yA} L${r} ${yB} V${yC} L${W} ${yD} V${H}`} />

          {/* transition rings, near arc solid and far arc light */}
          <path className="ch-ring-far" d={`M0 ${yA} A ${W / 2} 15 0 0 0 ${W} ${yA}`} />
          <path className="ch-ring" d={`M0 ${yA} A ${W / 2} 15 0 0 1 ${W} ${yA}`} />
          <path className="ch-ring-far" d={`M0 ${yD} A ${W / 2} 15 0 0 0 ${W} ${yD}`} />
          <path className="ch-ring" d={`M0 ${yD} A ${W / 2} 15 0 0 1 ${W} ${yD}`} />

          {/* the barrel's own rings */}
          <path className="ch-ring-far" d={`M${l} ${yB} A ${BARREL} 11 0 0 0 ${r} ${yB}`} />
          <path className="ch-ring" d={`M${l} ${yB} A ${BARREL} 11 0 0 1 ${r} ${yB}`} />
          <path className="ch-ring-far" d={`M${l} ${yC} A ${BARREL} 11 0 0 0 ${r} ${yC}`} />
          <path className="ch-ring" d={`M${l} ${yC} A ${BARREL} 11 0 0 1 ${r} ${yC}`} />

          {/* utility jumpers bridging the two modules outside the barrel */}
          {[-1, 1].map((side) =>
            [0, 1, 2].map((k) => {
              const x = W / 2 + side * (BARREL + 52 + k * 26)
              return (
                <path
                  key={`${side}-${k}`}
                  className="ch-jumper"
                  d={`M${x} ${yA - 4} C ${x + side * 16} ${yB + 14}, ${x + side * 16} ${yC - 14}, ${x} ${yD + 4}`}
                />
              )
            }),
          )}
        </svg>

        {/* ---- detail cluster: must not stretch ---- */}
        <svg
          className="conn-detail"
          viewBox="-150 -56 300 112"
          width="300"
          height="112"
          aria-hidden="true"
          focusable="false"
        >
          {/* the hatch opening */}
          <ellipse className="cd-hatch" cx="0" cy="0" rx="62" ry="23" />
          <ellipse className="cd-hatch-in" cx="0" cy="0" rx="50" ry="17" />

          {/* bolt circle around the rim */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2
            return (
              <circle
                key={i}
                className="cd-bolt"
                cx={Math.cos(a) * 70}
                cy={Math.sin(a) * 26}
                r="1.6"
              />
            )
          })}

          {/* docking target: cross in a circle, in the one accent colour */}
          <g className="cd-target">
            <circle cx="0" cy="0" r="9" />
            <line x1="-14" y1="0" x2="14" y2="0" />
            <line x1="0" y1="-7" x2="0" y2="7" />
          </g>

          {/* grapple fixture, off to one side */}
          <g className="cd-grapple">
            <rect x="94" y="-13" width="26" height="26" />
            <line x1="100" y1="0" x2="114" y2="0" />
            <line x1="107" y1="-7" x2="107" y2="7" />
          </g>

          {/* a handrail on the adapter, because every real surface has one */}
          <g className="cd-handrail">
            <line x1="-120" y1="-10" x2="-120" y2="10" />
            <line x1="-124" y1="-10" x2="-116" y2="-10" />
            <line x1="-124" y1="10" x2="-116" y2="10" />
          </g>
        </svg>

        {/* ---- placard. Solid backing so it stays legible over the hardware,
          * which is also what a real bolted-on placard looks like. ---- */}
        <p className="hatch-plate">
          <span className="hp-desig">{into.desig}</span>
          <span className="hp-sep">/</span>
          <span className="hp-elem">{into.element}</span>
          <span className="hp-seq">
            {eva ? (exiting ? 'airlock' : 'ingress') : `${index} of ${total}`}
          </span>
        </p>

        {/* ---- a drawn callout, the way a diagram labels its parts ---- */}
        <p className="conn-callout" aria-hidden="true">
          <span className="cc-leader" />
          <span className="cc-text">CBM ⌀ 50 IN</span>
        </p>
      </div>
    </div>
  )
}
