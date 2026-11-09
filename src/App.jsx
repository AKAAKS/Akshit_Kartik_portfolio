import { modules } from './data/content.js'
import PlanNav from './components/PlanNav.jsx'
import Intro from './components/Intro.jsx'
import Truss from './components/Truss.jsx'
import Publications from './components/Publications.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'

/* The station, in order. `modules` in content.js is the single list that both
 * the page and the plan view read, so moving a module moves both. */
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

      <div className="page">
        <PlanNav />
        <main>
          {modules.map((mod) => {
            const Section = SECTIONS[mod.id]
            return Section ? <Section key={mod.id} mod={mod} /> : null
          })}
        </main>
      </div>
    </>
  )
}
