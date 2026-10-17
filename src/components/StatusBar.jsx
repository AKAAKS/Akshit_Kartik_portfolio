import { useEffect, useState } from 'react'
import { profile, nav } from '../data/content.js'

export default function StatusBar() {
  const [time, setTime] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="statusbar">
      <div className="container statusbar-inner">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <span className="dot" />
          {profile.codename}
        </a>

        <button
          className="menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '≡'}
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>

        <span className="clock" aria-hidden="true">
          ◉ {time} UTC{new Date().getTimezoneOffset() <= 0 ? '+' : '-'}
          {String(Math.abs(new Date().getTimezoneOffset() / 60)).padStart(2, '0')}
        </span>
      </div>
    </header>
  )
}
