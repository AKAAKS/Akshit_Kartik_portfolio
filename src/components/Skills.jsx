import { skills } from '../data/content.js'
import { Module, Rack } from './Module.jsx'

/* Node 3. Every entry names where it was used. No levels: nothing backs them. */
export default function Skills({ mod }) {
  return (
    <Module mod={mod} lead="Each entry names where it was actually used.">
      {skills.map((g) => (
        <Rack bay={g.bay} key={g.bay}>
          <h3 className="entry-title">{g.group}</h3>
          <ul className="skill-items">
            {g.items.map((it) => (
              <li key={it.name}>
                <span className="n">{it.name}</span>
                <span className="w">{it.where}</span>
              </li>
            ))}
          </ul>
        </Rack>
      ))}
    </Module>
  )
}
