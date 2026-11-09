import { modules } from './data/content.js'
import StationMap from './components/StationMap.jsx'
import Hatch from './components/Hatch.jsx'
import Intro from './components/Intro.jsx'
import Truss from './components/Truss.jsx'
import Publications from './components/Publications.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'

/* The station, in order. `modules` in content.js is the single list that the
 * page, the station map and the hatch plates all read, so moving a module
 * moves every one of them. A hatch sits between each pair: you pass through a
 * bulkhead to get from one module to the next. */
const SECTIONS = {
  intro: Intro,
  timeline: Truss,
  publications: Publications,
  experience: Experience,
  projects: Projects,
  skills: Skills,
  contact: Contact,
}

export default function App() {
  return (
    <>
      <a className="skip" href="#intro">Skip to content</a>

      <StationMap />

      <main>
        {modules.map((mod, i) => {
          const Section = SECTIONS[mod.id]
          if (!Section) return null
          return (
            <div key={mod.id}>
              {i > 0 && <Hatch into={mod} index={i + 1} total={modules.length} />}
              <Section mod={mod} />
            </div>
          )
        })}
      </main>
    </>
  )
}
