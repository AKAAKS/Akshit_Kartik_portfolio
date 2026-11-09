import { publications } from '../data/content.js'
import { Module, Rack } from './Module.jsx'

/* Lab B. First content module after the timeline: publications lead projects. */
export default function Publications({ mod }) {
  return (
    <Module mod={mod} lead="Peer-reviewed and preprint work, both 2026.">
      {publications.map((p) => (
        <Rack bay={p.bay} key={p.bay}>
          <h3 className="entry-title">{p.title}</h3>
          <p className="entry-meta">{p.venue} · {p.year} · {p.authors}</p>
          <p className="entry-desc">{p.desc}</p>
          <a className="ref" href={p.ref.url} target="_blank" rel="noreferrer">
            {p.ref.label}
          </a>
        </Rack>
      ))}
    </Module>
  )
}
