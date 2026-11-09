/* Phase 1 skeleton. The plan view and module shells are real; the module
 * bodies fill in once the section components land (Phase 3). */

import { modules as MODULES } from './data/content.js'

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
                <span className="stamp">{`${m.desig} · ${m.hatch}`}</span>
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
