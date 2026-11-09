/* Phase 1 skeleton. The plan view and module shells are real; the module
 * bodies fill in once content.js is rewritten (Phase 2) and the section
 * components land (Phase 3). MODULES moves into content.js in Phase 2. */

const MODULES = [
  { id: 'intro', desig: 'Node 1', name: 'Intro', hatch: 'Node 1 · Hatch 01' },
  { id: 'timeline', desig: 'Lab A', name: 'Timeline', hatch: 'Lab A · Hatch 02' },
  { id: 'publications', desig: 'Lab B', name: 'Publications', hatch: 'Lab B · Hatch 03' },
  { id: 'experience', desig: 'Node 2', name: 'Experience', hatch: 'Node 2 · Hatch 04' },
  { id: 'projects', desig: 'Lab C', name: 'Projects', hatch: 'Lab C · Hatch 05' },
  { id: 'skills', desig: 'Node 3', name: 'Skills', hatch: 'Node 3 · Hatch 06' },
  { id: 'contact', desig: 'Airlock', name: 'Contact', hatch: 'Airlock · Hatch 07' },
]

export default function App() {
  return (
    <>
      <a className="skip" href="#intro">Skip to content</a>

      <div className="page">
        <nav className="plan" aria-label="Station modules">
          {MODULES.map((m) => (
            <a key={m.id} className="plan-mod" href={`#${m.id}`}>
              <span className="desig">{m.desig}</span>
              <span className="name">{m.name}</span>
            </a>
          ))}
        </nav>

        <main>
          {MODULES.map((m) => (
            <section key={m.id} id={m.id} className="module" aria-labelledby={`${m.id}-h`}>
              <div className="module-head">
                <span className="stamp">{m.hatch}</span>
                <h2 id={`${m.id}-h`} className="module-title">{m.name}</h2>
              </div>
              <div className="module-body">
                <p className="mono">Phase 1 skeleton — body pending.</p>
              </div>
            </section>
          ))}
        </main>
      </div>
    </>
  )
}
