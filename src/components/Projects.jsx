import { projects } from '../data/content.js'
import { Module, Rack } from './Module.jsx'

/* Lab C. Each card leads with its outcome, not its description. */
export default function Projects({ mod }) {
  return (
    <Module mod={mod}>
      {projects.map((p) => {
        const when = p.to ? `${p.from} – ${p.to}` : p.from
        return (
          <Rack bay={p.bay} key={p.bay}>
            {p.metric && <p className="entry-metric">{p.metric}</p>}
            <h3 className="entry-title">{p.name}</h3>
            <p className="entry-meta">{p.subtitle} · {when}</p>
            <p className="entry-desc">{p.desc}</p>
            <p className="entry-desc">{p.detail}</p>
            <div className="tags">
              {p.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
            {(p.links.site || p.links.repo) && (
              <div className="entry-links">
                {p.links.site && (
                  <a className="ref" href={p.links.site} target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
                {p.links.repo && (
                  <a className="ref" href={p.links.repo} target="_blank" rel="noreferrer">
                    Repository
                  </a>
                )}
              </div>
            )}
            {p.note && <p className="entry-note">{p.note}</p>}
          </Rack>
        )
      })}
    </Module>
  )
}
