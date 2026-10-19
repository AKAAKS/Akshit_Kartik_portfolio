# Akshit Kartik · Developer Portfolio

A personal developer portfolio themed as **Tony Stark's / J.A.R.V.I.S. computer** — a moderate holographic HUD built with **React + Vite**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Production build:

```bash
npm run build    # outputs to dist/
npm run preview  # preview the build locally
```

## Make it yours (edit ONE file)

Almost everything you'll want to change lives in **`src/data/content.js`**:

- **Profile** — your name, title, tagline, codename, and resume URL
- **About** — bio paragraphs + "systems status" stats
- **Skills** — groups and 0–100 power levels for the HUD meters
- **Projects** — the featured "systems" (name, summary, tags, links). Use `"#"` for links you haven't published
- **Research** — your papers (title / venue / year / link) and resume download
- **Contact** — email + social links
- **Nav** — the status-bar menu items

### Resume
Your resume lives at **`public/resume.pdf`** and `resumeUrl` points to it.
To update it, replace that file (keep the name) or drop a new PDF into
`public/` and point `resumeUrl` at it in `content.js`.

### Colors / theme
The entire look is driven by CSS variables at the top of
**`src/styles/theme.css`** (`--cyan`, `--gold`, `--bg`, fonts, etc.).

## Deploy
The `dist/` folder is static — deploy it to **Vercel**, **Netlify**, or
**GitHub Pages**. For GitHub Pages under a sub-path, set `base` in
`vite.config.js` to `'/<repo-name>/'`.

## Accessibility
Respects `prefers-reduced-motion` (animations and scanlines quiet down),
uses semantic sections, and is fully responsive down to ~400px.
