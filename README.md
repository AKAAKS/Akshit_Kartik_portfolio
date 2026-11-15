# Akshit Kartik · portfolio

A personal site built as a **drawn spacecraft, seen side-on**, in the style of a
printed engineering drawing or a star atlas. You scroll down the length of the
craft: the nose at the top, then one pressurized module per section, joined by
hatch bands, with the centrifuge hung outside the hull. Black ink on near-white
paper, one spot colour, hairline rules, no shadows, no dark mode.

React 18 + Vite 5. No UI framework, no CSS framework, two runtime dependencies
(`react`, `react-dom`).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the build
npm run og       # recapture public/og.png (needs the dev server running)
```

There is no test suite. Verification is `npm run build` plus looking at the page
in a browser, usually by measuring in the console rather than eyeballing. See
`docs/anti-slop-guide.md`, section 5.

## Editing content

**All copy lives in `src/data/content.js`.** Nothing else holds text. The
exports are:

| Export | What it feeds |
|---|---|
| `profile` | name, title, tagline, location, status, the three `proof` chips, `resumeUrl` |
| `modules` | the section list. Order here *is* the page order, and the station map and hatch plates read the same array |
| `publications` | papers: title, venue, year, link |
| `experience`, `education` | the roles and the degree |
| `projects` | the featured builds: name, summary, tags, metric, links |
| `skills` | grouped skill lists |
| `contact` | blurb, email, socials |
| `timeline` | the stops drawn on the centrifuge ring |

The file's header comment carries house rules that exist to keep bloat out:
one line per `desc` and per `detail`, hard cap sixteen words, and no decorative
numbers (every figure has to be traceable to a repo or a venue). Keep them.

### Adding or moving a section

A module needs an entry in `modules` and a matching component registered in
`SECTIONS` in `src/App.jsx`, keyed by the same `id`. The hatch between two
modules is generated from the pair, so you do not place hatches by hand.
`external: true` marks a section that sits outside the pressurized volume.

### Resume

`public/resume.pdf`, pointed at by `profile.resumeUrl`. Replace the file in
place, or drop a new PDF in `public/` and update `resumeUrl`.

### og:image

`public/og.png` is a screenshot of the real landing section, not a second
drawing of it, so it cannot drift from the page. Regenerate it with
`npm run dev` in one terminal and `npm run og` in another. The script
(`scripts/make-og.mjs`) drives headless Chrome already on the machine and
captures 2400×1260 for retina, while the meta tags in `index.html` describe the
1200×630 layout size, which is what they are supposed to describe.

## Layout of the code

```
index.html              meta, OG/Twitter cards, Google Fonts
src/App.jsx             the craft, top to bottom: Landing, Nose, modules, cap
src/data/content.js     ALL copy
src/styles/tokens.css   colours, type scale, measure, rhythm
src/styles/base.css     document, focus, reduced motion
src/styles/components.css  everything drawn, plus the print stylesheet
src/components/         see below
scripts/make-og.mjs     og:image capture
docs/anti-slop-guide.md how this site avoided looking AI-generated
inspo/                  the reference photographs the hardware is drawn from
```

Components split into content sections and drawn hardware:

- **Sections** — `Intro`, `Publications`, `Experience`, `Projects`, `Skills`,
  `Contact`, and `Centrifuge` (which is both: the timeline is drawn on a ring
  you can drag).
- **Chrome and structure** — `Module` (the shell plus `Rack` and `Placard`),
  `Hatch`, `Tube`, `Nose`, `Landing`, `StationMap` (the sticky nav),
  `SpaceField` (the seeded star field).
- **Drawn detail** — `Furniture` (interior fittings), `Externals` (solar array,
  boom, RCS quads), `Dock`, `Engine`, `Liftoff`.

## Theme

Every colour, size and spacing value is a CSS variable at the top of
`src/styles/tokens.css`. Two things in there are decisions, not defaults:

- **Light only.** `color-scheme: light`, and the file says not to add
  `prefers-color-scheme` branches. A printed drawing does not have a dark mode.
- **Two line scales.** Body text and page rules use the quiet `--rule` weights;
  anything drawn uses the near-black `--draw` / `--draw-mid` / `--draw-far`
  scale, because dense line art at 0.13 alpha turns to grey mush. Three weights
  is what a real drawing uses: object line, internal structure, far side.

Contrast ratios for the ink colours are recorded in the same file and verified.
Keep them passing if you change a value.

## Accessibility and print

- Skip link, semantic sections, keyboard focus styles.
- `prefers-reduced-motion` is honoured in three components and four CSS blocks:
  the centrifuge holds a single angle, the star field applies no transform, and
  the liftoff animation does not run.
- Horizontal overflow is clamped at source and backstopped with
  `overflow-x: clip` on `html, body` (not `hidden`, which would break the
  sticky nav).
- Responsive to ~400px. Below 860px the drawn ring, the spindles and the RCS
  quads drop out, and the centrifuge timeline falls back to a plain inline
  list of the same stops.
- There is a real print stylesheet: all the drawn hardware drops out and the
  content prints as a plain document at 11pt.

## Deploy

Vercel, from `main`. `dist/` is plain static output, so Netlify or GitHub Pages
work too; for Pages under a sub-path, set `base` in `vite.config.js`.

Branches: `main` is primary, `rebuild/drawn-space` tracks it, and
`legacy/mark-hud` is the previous HUD-themed build, kept as a backup.

## Reading before changing it

`docs/anti-slop-guide.md` records why the site looks the way it does: the
conceit, the visual and content tells that were removed, what replaced each
one, and the process rules. If you are handing this repo to another person or
model, start there.
