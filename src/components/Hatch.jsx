/* The connection between two modules.
 *
 * Three pieces, split by what may and may not be distorted:
 *
 *  1. The flare — the hull necking in from full width to the adapter and back
 *     out. It must reach the tube's edges at whatever width the page is, so it
 *     is drawn with preserveAspectRatio="none". Straight tapers and wide
 *     shallow arcs survive that; detail would not.
 *  2. The adapter itself (Dock), sized as a percentage of the tube and scaled
 *     uniformly, so its flanges, teeth and lugs keep their proportions. Being
 *     a percentage is also what keeps the flare's tapers landing exactly on
 *     its rim at every page width — both are the same fraction of the tube.
 *  3. The placard, on a solid plate so it stays legible over the hardware.
 *
 * `from` and `into` decide which of three this is: an ordinary hatch, the
 * airlock out to the truss, or the way back in.
 */

import Dock from './Dock.jsx'
import { SolarArray, Boom } from './Externals.jsx'

const W = 1000 // flare viewBox width, stretched to the tube
const H = 360 // connector height in px; the flare viewBox matches it 1:1
const NECK = 48 // where the hull has finished necking in
const CORE = 264 // adapter half-width, in flare viewBox units (52.8% of W)

export default function Hatch({ from, into, index, total }) {
  const exiting = Boolean(into.external)
  const entering = Boolean(from.external)
  const eva = exiting || entering

  // Arrays on the first connection, then every other one. A wing on every
  // connector would read as wallpaper; three down the craft reads as power.
  const wings = index % 2 === 1

  const l = W / 2 - CORE
  const r = W / 2 + CORE
  const top = `M0 0 H${W} L${r} ${NECK} H${l} Z`
  const bot = `M0 ${H} H${W} L${r} ${H - NECK} H${l} Z`

  return (
    <div
      className={`hatch${eva ? ' hatch--eva' : ''}`}
      data-cap={exiting ? 'exit' : entering ? 'enter' : undefined}
    >
      <div className="connector">
        {/* ---- the hull flare: stretches with the tube ---- */}
        <svg
          className="conn-hull"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
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

          {/* the hull's own fill, carried through so the pressure vessel does
            * not go transparent and show the star field */}
          <path className="ch-fill" d={top} />
          <path className="ch-shade" d={top} />
          <path className="ch-fill" d={bot} />
          <path className="ch-shade" d={bot} />

          {/* transition rings at full hull width */}
          <path className="ch-ring-far" d={`M0 0 A ${W / 2} 15 0 0 0 ${W} 0`} />
          <path className="ch-ring" d={`M0 0 A ${W / 2} 15 0 0 1 ${W} 0`} />
          <path className="ch-ring-far" d={`M0 ${H} A ${W / 2} 15 0 0 0 ${W} ${H}`} />
          <path className="ch-ring" d={`M0 ${H} A ${W / 2} 15 0 0 1 ${W} ${H}`} />

          {/* the tapers themselves */}
          <path className="ch-edge" d={`M0 0 L${l} ${NECK}`} />
          <path className="ch-edge" d={`M${W} 0 L${r} ${NECK}`} />
          <path className="ch-edge" d={`M0 ${H} L${l} ${H - NECK}`} />
          <path className="ch-edge" d={`M${W} ${H} L${r} ${H - NECK}`} />
        </svg>

        {/* ---- the adapter ---- */}
        <Dock eva={eva} />

        {/* ---- placard ---- */}
        <p className="hatch-plate">
          <span className="hp-desig">{into.desig}</span>
          <span className="hp-sep">/</span>
          <span className="hp-elem">{into.element}</span>
          <span className="hp-seq">
            {eva ? (exiting ? 'airlock' : 'ingress') : `${index} of ${total}`}
          </span>
        </p>

        <p className="conn-callout" aria-hidden="true">
          <span className="cc-leader" />
          <span className="cc-text">CBM ⌀ 50 IN</span>
        </p>
      </div>

      {/* Arrays live out here on the hatch, not inside .connector, so they can
        * reach past the hull into the gutters. */}
      {wings && (
        <>
          <span className="dock-boom dock-boom--l" aria-hidden="true"><Boom /></span>
          <span className="dock-boom dock-boom--r" aria-hidden="true"><Boom /></span>
          <span className="dock-wing dock-wing--l" aria-hidden="true">
            <SolarArray flip />
          </span>
          <span className="dock-wing dock-wing--r" aria-hidden="true">
            <SolarArray />
          </span>
        </>
      )}
    </div>
  )
}
