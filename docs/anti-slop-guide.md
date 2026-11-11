# Avoiding AI slop in a website

Written from the rebuild of this portfolio, where the first version was
competent and completely generic and the second one wasn't. It is a guide for
a future session: if you are a model picking this up cold, read the whole
thing before proposing a design, and prefer its specifics to your defaults.

The short version: **generic output is not a style problem, it is a decision
problem.** A generic site is one where nobody decided anything. Every tell
below is a place where a decision was avoided and a default filled the gap.

---

## 1. The core move: commit to one real thing

The first site was "Tony Stark's HUD" — cyan and gold, glowing panels,
scanlines, a reticle that locked onto sections. It was executed well. It was
still slop, because "sci-fi HUD" is a *vibe*, and a vibe has no opinions. Any
question it can't answer gets answered by the default.

The rebuild picked something with a real answer to every question: **the site
is a technical drawing of a spacecraft, seen side-on.** Not a render. A
drawing — the kind in an assembly manual.

That single commitment decides things a vibe cannot:

| Question | A vibe shrugs | The conceit answers |
|---|---|---|
| What colour is a shadow? | "subtle grey blur" | Drawings aren't lit. A hard 2px offset in the same ink. No blur, ever. |
| What does a nav look like? | a row of tabs | The station seen end-on: modules as cylinders, hatch connectors between them, a position marker travelling the chain. |
| How do sections join? | margin | A docking adapter — barrel, transition rings, bolt circle, grapple fixture, placard. |
| What's a "card"? | rounded rect + shadow | A rack in a bay, with a real ISS bay code. |
| Dark mode? | both, obviously | Engineering drawings are ink on paper. Light only, declared in the meta tag. |

**Test for whether your conceit is real:** ask it three questions it was not
designed to answer. If you can derive the answers, it's a conceit. If you have
to invent, it's a vibe, and the site will drift back to default.

**Pick from the person's actual domain.** This one worked because the owner is
a systems engineer who builds agent daemons — a machine drawn as a machine.
A florist should not get a spacecraft.

---

## 2. The tells, and what to do instead

### 2.1 The default palette

**Tell:** an accent colour at full saturation, a neutral grey ramp, white
cards on a near-white page, `#0f172a` text. Usually indigo, teal, or
violet-to-pink.

**Instead:** derive the palette from the physical thing. Here it is ink on
paper, so the tokens are named for what they *are*, not how dark they are:

```
--paper   the page          --draw      a visible edge
--card    one step up       --draw-mid  internal structure
--sunk    behind the page   --draw-far  something receding
--ink     text              --rule      a faint division
--accent  used ~5 times     --mark      annotation / trajectory
```

Named this way you cannot casually add a colour: you would have to say what
physical role it plays. That is the point.

**Measure contrast and write the number in the file.** `tokens.css` carries
"Every colour below is measured against --paper" with the WCAG ratios in
comments. Measured values stop a palette drifting pale over time.

### 2.2 Three weights of one geometric sans

**Tell:** Inter for everything, 400/500/600, nothing else.

**Instead:** give each *kind of information* its own voice, and have a reason:

- headings — Inter (the NASA digital-era look)
- prose — Public Sans (a US federal typeface; reads long)
- data, codes, placards, readouts — DM Mono

The mono is doing real work: bay codes, dates, metrics and status lines are
*readouts about an object*, and setting them in mono says so without a label.

### 2.3 Decoration that means nothing

**Tell:** floating blurred gradient orbs, a dot grid, generic "tech" glyphs,
particles.

**Instead:** every mark is a real part. Bolts sit on real bolt circles. Dashed
lines mean *unpressurised* — the centrifuge truss and the EVA module are
dashed, the pressurised modules solid. A dotted ring means a part seen
*through* a surface. The star field is seeded, so it is identical on every
load, because a drawing does not reshuffle itself.

If you cannot say what a decorative element *is*, delete it.

### 2.4 Soft shadows and glassmorphism

**Tell:** `box-shadow: 0 10px 30px rgba(0,0,0,.1)`, `backdrop-filter: blur()`.

**Instead:** **depth is drawn, not lit.** A panel standing off a plate gets
`box-shadow: 2px 2px 0 0 var(--rule-hard)` — hard, no blur, no spread. A soft
shadow is a photograph of a panel; this is a drawing of one.

### 2.5 The full-viewport hero

**Tell:** `height: 100vh`, huge name, a bouncing chevron saying "scroll".

**Instead, if you have a landing at all, make it shorter than a viewport.**
Ours is 66vh, floored at 330px and capped at 600px. At two thirds, the nose of
the ship is already entering the bottom of the frame, so it reads as an
approach rather than a splash screen, and the eye is pulled down instead of
parked. A reader with thirty seconds should not spend five of them on a name
they already knew — they clicked a link carrying it.

No scroll-jacking, no click-to-enter, no snap. It is a section of the page and
the page scrolls through it normally.

### 2.6 Animation as filler

**Tell:** everything fades up on scroll, 600ms, staggered.

**Instead:** motion only where it carries meaning. The only real motion here is
the centrifuge ring, because a centrifuge *spins* — and it spins because you
drag it, not because you scrolled past it. The nav marker moves because your
position moved.

A corollary learned the hard way: **1:1 with the page is the only rate that
needs no JavaScript.** A parallax background positioned from a scroll handler
jitters on mobile no matter how fast the handler is, because the page scrolls
on the compositor thread and the handler runs on the main thread. It is a
synchronisation problem, not a throughput problem. Matching the page means
being part of the page.

---

## 3. Content tells (these matter more than the visuals)

A recruiter reads the words. Most AI-written portfolio copy fails the same five
ways.

### 3.1 Unverifiable claims

**Cut anything the reader cannot check.** We removed a whole project card
because its repo was private and its claims rested on the owner's word. The
problem was never quality — an unverifiable claim sitting next to verifiable
ones makes the *verifiable* ones look like marketing too.

Every remaining project has a link, or an explicit "in progress · unpublished".

### 3.2 Metrics that aren't

**Tell:** "improved efficiency by 40%", "10x faster", "99% accuracy".

**Instead:** a number plus the thing it counts, stated so a reader can picture
the work.

- before: "100% match rate"
- after: `metric: '100% of the test catalog'`, with
  "Found a replacement for every obsolete part they sent; days and weeks
  became minutes."

"41 tools", "1092 tests" and "Fail-closed by default" pass the same test: they
each name a countable thing.

### 3.3 Stating what the reader can see, or doesn't need

We cut a timeline description from four sentences to two. What went was an
explanation that rotation is clamped at both ends — true, and you learn it by
dragging, in the half second it takes to hit the end. And "clicking a gondola
opens its detail rather than turning the wheel", which existed because the
behaviour had surprised *the builder*, which is not the same as surprising a
reader.

**What survived is the two things you cannot discover without being told:**
that the handrail is the thing you drag, and that the gondolas are links.

### 3.4 Padding the credentials

GPA went. "Both 2026" after two publications went — the dates are right there.
An ORCID went *in*, because it is a verifiable identity and costs one line.

### 3.5 Ordering that flatters instead of informs

Publications moved **above** projects. For someone with peer-reviewed work that
is the strongest signal and it should not be third. Order sections by what the
specific person has, not by the template.

Then add the one line that answers the reader's real question. Ours:
"Looking for full-time roles and internships."

### 3.6 Voice

Em-dashes everywhere, "passionate about", "leveraging", "seamless",
"cutting-edge", "I'm a developer who loves to build" — all of it goes. Say what
the thing does. "I build AI agents and the tooling that keeps them honest" works
as a tagline because it is a claim with an edge on it.

---

## 4. The og:image

**Tell:** no og:image at all, or a screenshot of the page body. Neither works —
a crop of a content section reads as a glitch at 500px wide.

**What we did:** built the landing frame so it doubles as the card, then
*photographed the real page* — headless Chrome, 1200x630 layout captured at 2x,
driven by `npm run og` (`scripts/make-og.mjs`). It is checked in and
regenerated whenever the landing changes.

**Why captured, not redrawn:** a hand-built SVG card is a second drawing of the
same thing, and it drifts from the first one silently. The star field is seeded
and the nose shares the hull's geometry; keeping a copy in step by hand is a
promise nobody keeps. A photograph of the real page cannot disagree with it.

Also: `twitter:card` must be `summary_large_image`. Plain `summary` crops to a
small square and throws away the composition the card exists for. Add
`og:image:alt` — a shared link with no alt is unreadable to anyone using a
screen reader.

---

## 5. Process — this is what actually produced the difference

### 5.1 Spike, judge, then promote

Build the risky idea as an explicitly labelled throwaway. The landing shipped
as `SPIKE` in three files, with a header saying "Built to be looked at and
judged, not kept as-is." It stayed labelled until the owner said keep it, and
promoting it was its own commit that rewrote the comments as intent.

This stops "I tried it" and "we decided" from blurring together.

### 5.2 Measure. Do not reason from plausibility

Nearly every bug in this build had a plausible explanation that was wrong.

- The mobile jitter "must be" performance. Every frame was 16.7ms. It was
  main-thread/compositor synchronisation.
- "There is no horizontal overflow." There was 0.8px. The earlier measurement
  had been taken in a window whose scrollbar made the viewport fractional,
  which masked it.
- The nav marker "lagged". It could not physically reach the last three chips:
  it was positioned as a percentage of a 332px container while the chips ran
  out to 552px.
- The handrail was "a rasterisation problem", so I supersampled it. It was a
  48-sided polygon. No amount of supersampling fixes a polygon.
- The replacement outline was "continuous". Colouring it red showed it arriving
  as broken dashes — a flat ellipse sliced by the 96 opaque tiles it passed
  through.

**Rule: when you cannot reproduce something, ask for the one detail that
discriminates between your hypotheses before you change code.** "It goes into
the chip on the left, every time, except the intro" identified a paint-order
bug in one sentence, after two wrong theories and a wasted afternoon.

**Corollary: colour the thing in question bright red and look at it.** Three of
the above were solved that way and none of them by reasoning.

### 5.3 Comments carry the why and the number

Every non-obvious value in this codebase says where it came from:

```css
/* Derived, not chosen. connH/2 - dockH/2 = connH * (48/360),
 * so H = 0.3394 x W at every size. */
aspect-ratio: 1000 / 339.4;
```

```css
/* 38%, not 50%. At 50% the vertical radius is half the height, so the whole
 * side of the chip is ONE ellipse arc and there is no straight edge for a
 * connector to land on. At 38% the corner arcs leave 24% of the height
 * straight through the middle - about 11px on a 46px chip. */
border-radius: 7px / 38%;
```

This is what stops the next session — or the next model — from "tidying" a
value back to a default. A number with a derivation is defended. A magic number
is not.

### 5.4 Reuse the values already decided

When the landing's role line needed a panel, it took **every** value from the
nav's existing panel — same four bolts at the same 9px inset, same surface mix,
same 2px offset — rather than choosing new ones that looked similar. Verified
by comparing computed styles.

Re-choosing is how a design ends up with six slightly different greys.

### 5.5 Finish the whole surface

A fix is not done until you have checked the *other* rendering of the same
thing. The pole added to the centrifuge looked right on desktop and painted a
white column down the middle of the mobile list, because mobile renders that
timeline as a list and nothing hid the new element. Desktop and mobile are two
renderings of one section; changing one means checking both.

---

## 6. Things that look like slop but are not

Do not over-correct. These are fine, and a reviewer may wrongly flag them:

- **A system font stack**, if chosen for a reason and the reason is stated.
- **Plain, boring section ordering**, when the person's material has no
  stronger order.
- **Repetition of a motif.** This site repeats one `7px / 38%` radius and one
  hatching angle everywhere. Consistency is not laziness; arbitrary variety is.
- **Short copy.** Two sentences that say something beat six that hedge.
- **Codes and jargon from a real system.** The bay codes here are genuine ISS
  rack locations — the letter is the module wall the rack is bolted to. I
  called them arbitrary during a review and was wrong. Check before cutting
  something as decorative; it may be load-bearing.

---

## 7. Checklist

**Design**

- [ ] Can I name the real thing this site *is*, in one sentence?
- [ ] Does the conceit answer three questions it wasn't designed for?
- [ ] Is every colour token named for a role, not a darkness?
- [ ] Does each typeface carry a different kind of information?
- [ ] Can I say what every decorative mark *is*?
- [ ] Are shadows hard, or justified as lit?
- [ ] Is any hero shorter than a viewport, or absent?
- [ ] Does every animation carry meaning?

**Content**

- [ ] Can a reader verify every claim, or is it marked unverified?
- [ ] Does every metric name a countable thing?
- [ ] Have I cut everything discoverable by using the page?
- [ ] Are sections ordered by this person's strengths?
- [ ] Is the reader's real question answered in one line?
- [ ] Any "passionate", "leveraging", "seamless", "cutting-edge"?

**Ship**

- [ ] og:image exists, is the best frame, and is regenerable
- [ ] `twitter:card` is `summary_large_image`, `og:image:alt` present
- [ ] Checked on a real phone, not a narrowed desktop window
- [ ] Every non-obvious number has its derivation in a comment
- [ ] Both renderings of every section checked

---

## 8. Handing this to a model

Paste this file at the start of the session, then:

> Follow `anti-slop-guide.md`. Before proposing any design, tell me in one
> sentence what real thing the site *is*, and answer three questions the
> conceit wasn't designed for. Don't start building until I've agreed the
> conceit. When you hit a bug, measure before you theorise, and if you can't
> reproduce it, ask me for the one detail that separates your hypotheses.
