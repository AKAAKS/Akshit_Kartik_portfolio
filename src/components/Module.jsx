/* The structural primitives.
 *
 * A module is a pressurized cylinder: full-bleed so the hull curvature reads
 * in the gutters, with the content held to a measure down the middle. Its head
 * is a designator placard, the way a real hatch carries one.
 *
 * A rack sits in a numbered bay. Bay codes are genuine ISS rack locations —
 * the letter is the module wall it is bolted to. */

const WALL = { D: 'DECK', O: 'OVHD', P: 'PORT', S: 'STBD' }

export function Module({ mod, lead, children }) {
  return (
    <section
      id={mod.id}
      className={`module${mod.external ? ' module--eva' : ''}`}
      aria-labelledby={`${mod.id}-h`}
    >
      <div className="tube module-inner">
        <Placard mod={mod} />
        <div className="module-body">
          {lead && <p className="module-lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}

export function Placard({ mod, note }) {
  return (
    <div className="placard">
      <p className="placard-top">
        <span className="pl-desig">{mod.desig}</span>
        <span className="pl-elem">{mod.element}</span>
        {note && <span className="pl-note">{note}</span>}
      </p>
      <h2 id={`${mod.id}-h`} className="module-title">{mod.name}</h2>
    </div>
  )
}

export function Rack({ bay, children }) {
  const wall = WALL[bay[0]]
  return (
    <div className="rack">
      <div className="rack-bay">
        <span className="b">{bay}</span>
        {wall && <span className="w">{wall}</span>}
      </div>
      <div className="rack-load">{children}</div>
    </div>
  )
}
