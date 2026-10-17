import { profile } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {profile.name} · all systems nominal.</span>
        <span>{profile.codename} · built with React + Vite</span>
      </div>
    </footer>
  )
}
