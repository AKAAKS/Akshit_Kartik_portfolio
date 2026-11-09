import { education, experience } from '../data/content.js'
import { Module, Rack } from './Module.jsx'

/* Node 2. Education leads, since it is the first thing screened for. */
export default function Experience({ mod }) {
  return (
    <Module mod={mod}>
      <Rack bay={education.bay}>
        <h3 className="entry-title">{education.degree}</h3>
        <p className="entry-meta">
          {education.school} · {education.place} · {education.date}
        </p>
        <ul className="points">
          <li>{education.minor}</li>
          <li>{education.gpa}</li>
        </ul>
      </Rack>

      {experience.map((r) => (
        <Rack bay={r.bay} key={r.bay}>
          <h3 className="entry-title">{r.role}</h3>
          <p className="entry-meta">
            {r.org} · {r.place} · {r.from} – {r.to}
          </p>
          <ul className="points">
            {r.points.map((pt) => <li key={pt}>{pt}</li>)}
          </ul>
        </Rack>
      ))}
    </Module>
  )
}
