import { modules } from './data/content.js'
import SpaceField from './components/SpaceField.jsx'
import StationMap from './components/StationMap.jsx'
import Hatch from './components/Hatch.jsx'
import { TubeCap } from './components/Tube.jsx'
import Nose from './components/Nose.jsx'
import Landing from './components/Landing.jsx'
import Intro from './components/Intro.jsx'
import Centrifuge from './components/Centrifuge.jsx'
import Publications from './components/Publications.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'

/* The craft, seen from outside, running down the middle of the page.
 *
 * `modules` in content.js is the single list that the page, the station map and
 * the hatch plates all read, so moving a module moves every one of them. The
 * tube is continuous: a hatch band carries the same hull as the modules either
 * side of it, with a rib at each join. End caps close it top and bottom. The
 * centrifuge breaks out of the tube entirely, because it is outside. */
const SECTIONS = {
  intro: Intro,
  timeline: Centrifuge,
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

      <SpaceField />
      <StationMap />

      <main>
        {/* SPIKE: the approach. See Landing.jsx. */}
        <Landing />
        <Nose />

        {modules.map((mod, i) => {
          const Section = SECTIONS[mod.id]
          if (!Section) return null
          return (
            <div key={mod.id}>
              {i > 0 && (
                <Hatch
                  from={modules[i - 1]}
                  into={mod}
                  index={i + 1}
                  total={modules.length}
                  ord={i}
                  ords={modules.length - 1}
                />
              )}
              <Section mod={mod} />
            </div>
          )
        })}

        <TubeCap />
      </main>
    </>
  )
}
