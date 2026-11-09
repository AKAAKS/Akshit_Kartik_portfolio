import { Rib, HatchRing } from './Tube.jsx'

/* The threshold between two modules.
 *
 * On the station you do not cross a line from one module to the next, you pass
 * through a hatch in a bulkhead. The tube runs continuously through this band —
 * same hull edges, same shading — so the craft reads as one unbroken cylinder
 * with ribs at intervals rather than as a stack of separate cards.
 *
 * Leaving for the truss is different: that is an airlock, and the tube ends.
 * `from` and `into` tell this component which of the three it is. */

export default function Hatch({ from, into, index, total }) {
  const exiting = Boolean(into.external)   // going outside
  const entering = Boolean(from.external)  // coming back in
  const eva = exiting || entering

  return (
    <div
      className={`hatch${eva ? ' hatch--eva' : ''}`}
      data-cap={exiting ? 'exit' : entering ? 'enter' : undefined}
      aria-hidden="true"
    >
      <div className="tube hatch-inner">
        <Rib ry={15} />
        <div className="hatch-ring">
          <HatchRing eva={eva} />
        </div>
        <p className="hatch-plate">
          <span className="hp-desig">{into.desig}</span>
          <span className="hp-sep">/</span>
          <span className="hp-elem">{into.element}</span>
          <span className="hp-seq">
            {eva ? (exiting ? 'airlock' : 'ingress') : `${index} of ${total}`}
          </span>
        </p>
      </div>
    </div>
  )
}
