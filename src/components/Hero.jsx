import { motion } from 'framer-motion'
import { profile } from '../data/content.js'
import { FiArrowDownRight, FiDownload } from 'react-icons/fi'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div>
          <motion.p
            className="hero-greet"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ▲ System online · welcome back
          </motion.p>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            {profile.name}
          </motion.h1>

          <motion.p
            className="hero-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            {profile.title}
          </motion.p>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.26 }}
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
          >
            <a className="btn" href="#projects">
              View Systems <FiArrowDownRight />
            </a>
            <a className="btn gold" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <FiDownload /> Download Resume
            </a>
          </motion.div>
        </div>

        <div className="reactor-wrap">
          <motion.div
            className="reactor"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="ring r1" />
            <span className="ring r2" />
            <span className="ring r3" />
            <span className="tri" />
            <span className="core" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
