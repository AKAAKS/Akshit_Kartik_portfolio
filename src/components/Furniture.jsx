/* Hull furniture: the fittings bolted to the inside of a module.
 *
 * Drawn from the module-interior wireframe: every surface carries handrails
 * with standoff brackets, louvred grilles, small utility panels and rows of
 * fasteners. That repeated small hardware is what makes the interior read as
 * built rather than textured, and it is the thing CSS gradients cannot do —
 * a gradient can make a stripe, but it cannot make a bracket.
 *
 * These live in the --hull margin, inboard of the racks, so they never sit
 * behind text.
 */

/* An EVA handrail: a round rail held off the wall on two brackets. The two
 * close parallel lines are what make it a tube rather than a stripe. */
function Handrail({ h = 124 }) {
  return (
    <svg width="26" height={h} viewBox={`0 0 26 ${h}`} aria-hidden="true" focusable="false">
      {[10, h - 10].map((y) => (
        <g key={y}>
          <rect className="dfill" x="2" y={y - 7} width="9" height="14" />
          <rect className="d2" x="2" y={y - 7} width="9" height="14" fill="none" />
          <line className="d3" x1="11" y1={y} x2="16" y2={y} />
        </g>
      ))}
      <line className="d2" x1="14" y1="10" x2="14" y2={h - 10} />
      <line className="d2" x1="19" y1="10" x2="19" y2={h - 10} />
      <path className="d2" d={`M14 10 A 2.5 2.5 0 0 1 19 10`} fill="none" />
      <path className="d2" d={`M14 ${h - 10} A 2.5 2.5 0 0 0 19 ${h - 10}`} fill="none" />
    </svg>
  )
}

/* A louvred grille, screwed at the corners. */
function Grille() {
  return (
    <svg width="36" height="50" viewBox="0 0 36 50" aria-hidden="true" focusable="false">
      <rect className="dfill" x="2" y="2" width="32" height="46" rx="3" />
      <rect className="d2" x="2" y="2" width="32" height="46" rx="3" fill="none" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} className="d3" x1="7" y1={9 + i * 5.5} x2="29" y2={9 + i * 5.5} />
      ))}
      {[[6, 6], [30, 6], [6, 44], [30, 44]].map(([x, y]) => (
        <circle key={`${x}-${y}`} className="d3" cx={x} cy={y} r="1.4" fill="none" />
      ))}
    </svg>
  )
}

/* A utility panel: a readout and a button grid, as every wall in the
 * reference carries. */
function Panel() {
  return (
    <svg width="34" height="46" viewBox="0 0 34 46" aria-hidden="true" focusable="false">
      <rect className="dfill" x="2" y="2" width="30" height="42" rx="2" />
      <rect className="d2" x="2" y="2" width="30" height="42" rx="2" fill="none" />
      <rect className="d3" x="6" y="6" width="22" height="9" fill="none" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            className="d3"
            x={6 + c * 5.6}
            y={19 + r * 5.6}
            width="3.4"
            height="3.4"
            fill="none"
          />
        )),
      )}
    </svg>
  )
}

/* A run of fasteners down a panel seam. */
function Fasteners({ n = 7 }) {
  const h = n * 13
  return (
    <svg width="10" height={h} viewBox={`0 0 10 ${h}`} aria-hidden="true" focusable="false">
      <line className="d3" x1="5" y1="2" x2="5" y2={h - 2} />
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} className="d3" cx="5" cy={6 + i * 13} r="1.8" fill="none" />
      ))}
    </svg>
  )
}

/* Four fittings, ordered differently per module so the hull does not repeat
 * itself down the page. */
const ORDERS = [
  ['rail', 'grille', 'bolts', 'panel'],
  ['bolts', 'rail', 'panel', 'grille'],
  ['grille', 'bolts', 'rail', 'rail'],
  ['panel', 'rail', 'grille', 'bolts'],
]

export default function HullFurniture({ seed = 0, side = 'left' }) {
  const order = ORDERS[Math.abs(seed) % ORDERS.length]
  return (
    <div className={`furniture furniture--${side}`} aria-hidden="true">
      {order.map((kind, i) => (
        <span className="fx" key={`${kind}-${i}`}>
          {kind === 'rail' && <Handrail />}
          {kind === 'grille' && <Grille />}
          {kind === 'panel' && <Panel />}
          {kind === 'bolts' && <Fasteners />}
        </span>
      ))}
    </div>
  )
}
