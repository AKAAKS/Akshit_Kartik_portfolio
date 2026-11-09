/* The structural primitives: a module (one section of the station) and a rack
 * (one entry inside it, in a numbered bay). Every section is built from these,
 * so spacing and rule weight stay consistent without being restated. */

export function Module({ mod, lead, children }) {
  return (
    <section id={mod.id} className="module" aria-labelledby={`${mod.id}-h`}>
      <div className="module-head">
        <span className="stamp">{mod.desig} · {mod.hatch}</span>
        <h2 id={`${mod.id}-h`} className="module-title">{mod.name}</h2>
      </div>
      <div className="module-body">
        {lead && <p className="module-lead">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

export function Rack({ bay, children }) {
  return (
    <div className="rack">
      <div className="rack-bay"><span className="b">{bay}</span></div>
      <div className="rack-load">{children}</div>
    </div>
  )
}
