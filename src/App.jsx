import StatusBar from './components/StatusBar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Research from './components/Research.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import BgDecor from './components/BgDecor.jsx'

export default function App() {
  return (
    <>
      {/* Background field layers (fixed, behind everything) */}
      <div className="bg-field" aria-hidden="true" />
      <div className="bg-mat" aria-hidden="true" />
      <BgDecor />
      <div className="bg-scan" aria-hidden="true" />

      <StatusBar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Research />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
