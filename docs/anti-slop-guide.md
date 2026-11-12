# Avoiding AI slop in a website

Written from two rebuilds, in deliberately different registers:

- **the drawing** — a personal portfolio rebuilt as a technical drawing of a
  spacecraft, seen side-on.
- **the record** — a project landing page rebuilt as *the machine's own record
  of three things it did*, with the real log timings and permission verdicts
  intact.

In both cases a competent, completely generic first version was replaced by one
that wasn't. Examples below are tagged **[drawing]** or **[record]** so you can
tell a principle from the project it came out of.

The short version: **generic output is not a style problem, it is a decision
problem.** A generic site is one where nobody decided anything. Every tell
below is a place where a decision was avoided and a default filled the gap.

If you are a model picking this up cold: read the whole thing before proposing
a design, and prefer its specifics to your defaults.

---

## 0. What the second project changed

One project teaches you what worked. Two let you separate **the method** from
**that project's answers** — which is the only way to know what generalises.

| Claim from the first rebuild | Verdict after the second |
|---|---|
| Commit to one real thing; test it with three questions | **Held, unchanged.** It survived a completely different domain. The strongest validation in this document. |
| Derive the palette from the physical thing | **Held, and tightened.** The record's rule is stricter: colour appears *only* where the system itself assigns meaning. See §3.1. |
| Depth is drawn, not lit | **Project-specific.** True of a drawing. The record has no depth at all — it is a terminal. The general rule is *pick a physical logic and never leave it*, not *use hard shadows*. |
| Give each kind of information its own typeface | **Partly project-specific.** The record uses one mono and one sans, because a log has exactly two kinds of content. Three typefaces was the drawing's answer, not a minimum. |
| Measure, do not reason from plausibility | **Held, and it got worse.** The record's bugs were mostly in my *verification*, not the code. New: §6.4–6.5. |
| Hero shorter than a viewport | **Held.** Both. |
| Photograph the real page for the og:image | **Held, plus an invalidation rule.** §5. |

**What the second project added that the first could not:** everything in §2.
The drawing's content was *written* — claims about projects, chosen and phrased.
The record's content was *transcribed* — real log lines from real sessions. Once
the page is made of real data, a stricter set of rules applies, and they are the
most transferable thing here, because most technical pages want to show real
output and almost none of them do it honestly.

---

## 1. The core move: commit to one real thing

Both first versions failed the same way.

**[drawing]** The first site was "Tony Stark's HUD" — cyan and gold, glowing
panels, scanlines, a reticle that locked onto sections. Executed well. Still
slop, because "sci-fi HUD" is a *vibe*, and a vibe has no opinions.

**[record]** The first version was built around a persistent morphing WebGL
orb. Three sessions went into making it behave: bounding it, scaling it,
anchoring its edge rather than its centre, reserving 45vh of nothing for it on
mobile. Every layout decision in the page was downstream of *"where can content
go so the orb doesn't eat it."* The orb was an abstract object with no story,
driving the structure of a page whose actual subject had plenty.

Any question a vibe can't answer gets answered by the default.

A real commitment decides things a vibe cannot:

| Question | A vibe shrugs | **[drawing]** answers | **[record]** answers |
|---|---|---|---|
| What colour is a shadow? | "subtle grey blur" | Drawings aren't lit. Hard 2px offset, same ink. No blur, ever. | There are no shadows. A terminal is flat. |
| What's a heading? | bigger and bolder | A placard, in mono, with a part code. | The same dim grey as the log. Emphasis is weight and space, never hue. |
| How do sections join? | margin | A docking adapter — barrel, rings, bolt circle, placard. | A timestamp. The record is continuous. |
| What's a "card"? | rounded rect + shadow | A rack in a bay, with a real ISS bay code. | There are no cards. There are log lines. |
| What gets colour? | an accent | ~5 uses, derived from ink-on-paper | Only what the daemon itself assigns: a permission verdict, the routing tier, which file a line came from. |
| Dark mode? | both, obviously | Drawings are ink on paper. Light only, declared in the meta. | It's a terminal. Dark only. |
| What does scroll do? | reveal animations | Nothing special. It's a page. | Advances time through the record. |

### 1.1 The test for whether your conceit is real

Ask it **three questions it was not designed to answer.** If you can derive the
answers, it's a conceit. If you have to invent, it's a vibe, and the site will
drift back to default.

This is the single most reliable item in this guide, and the only one that
survived both projects without amendment.

### 1.2 A conceit can be a document, not an object

The drawing is a *thing*. The record is a *document type*. Both work. A log, a
receipt, a lab notebook, a flight recorder, an index, a changelog, a ledger, a
transcript — these answer design questions as well as objects do, often better,
because a document already has rules about provenance and ordering that you can
simply obey.

### 1.3 The strongest conceit is one your material already contains

The drawing's conceit was *chosen* and then executed faithfully. The record's
conceit was **found**: the logs already existed, so the page's governing
metaphor was also its literal content. That is strictly stronger, and worth
hunting for before you invent anything.

Ask: *does this project already produce an artefact that could be the page?*
Logs, test output, a diff, a schedule, a parts list, a map, a scorecard. If
yes, the page can be that artefact — and then §2 applies.

### 1.4 Pick from the person's actual domain

The drawing worked because the owner is a systems engineer who builds agent
daemons — a machine drawn as a machine. The record worked because the subject
*is* a logging daemon. A florist should get neither.

### 1.5 A conceit must forbid things, or it isn't load-bearing

Write the anti-goals down, as things that mean failure **even if the page
ships**. The record's list, verbatim from its plan:

- A reader who flicks to the bottom in four seconds gets nothing, because the
  content was behind motion.
- Scroll is hijacked, pinned or rate-limited at any point.
- A recruiter on a phone sees a broken or empty-feeling page.
- The page reads as an ad.
- **Any coloured element whose colour cannot be explained.**

That last one did real work months later. When the owner said the page "looks
too plain, mainly the background," the obvious move — add accent colours — was
already forbidden. That forced a better diagnosis, and the actual cause turned
out to be something else entirely (§3.7). **A good anti-goal blocks the lazy fix
and makes you find the real problem.**

---

## 2. When the page is made of real data

This is the section the first project couldn't teach, and the one most likely to
matter to you. The moment a page shows real output — logs, metrics, test
results, screenshots of your own tool — you have stopped designing and started
**publishing evidence**, and evidence has rules.

### 2.1 Transcribe, never write

**Every line must trace to a real line in a real file, in session.** Not
"realistic". Not "representative". Copied.

**[record]** The source files, named in the repo's README with the commands to
re-derive them:

```
logs/voice_client.log   wake word, "Listening...", capture length
logs/jarvisd.log        "Heard: ...", "Routing to ...", "Audio in: ..."
logs/audit.jsonl        tool, input, verdict, reason, result_preview
```

Two consequences people get wrong:

**If the data doesn't contain it, the page doesn't claim it.** There is no
thinking-time number anywhere in that codebase — no `perf_counter`, no duration
string. So the readout shows timestamps and *does not* invent a "thought for
1.4s" line. The gap between two timestamps is the only honest signal, and it is
enough.

**The absence of a line is itself a finding.** A reconstructed `JARVIS:` reply
was proposed for one moment and cut, because no such line exists on disk. What
looked like a gap in the design was an accurate report of a gap in the logging.

### 2.2 A line may be cut, never rewritten — and the cut must be visible

Paraphrasing a log line is forbidden. Trimming one is fine, **if the trim
shows**.

**[record]** A Maps URL carried real latitude and longitude where a place name
would go. It reads `[my coordinates]` on the page. Not removed silently, not
replaced with a plausible fake address — marked, so a reader knows exactly what
was taken out and that nothing else was.

A silent edit to real data is worse than no real data, because the reader can't
tell which lines you touched.

### 2.3 The redaction pass is a build step, not a one-off

Real logs contain your home address, your coordinates, your email, tokens,
internal hostnames. You will not catch these by reading carefully once, because
**the content changes and the leak comes back.**

Make it a command, keep it in the README, re-run it on every content change:

```bash
# re-run after ANY change to the page's data
for p in "<street>" "<lat>" "<lon>" "<email>" "<client-name>"; do
  echo "$p -> $(grep -rIl "$p" src/ dist/ 2>/dev/null | wc -l)"
done
```

Scan the **rendered** text as well as the source: a readout that composes a line
from several fields can print something no single source file contains. And scan
`dist/`, not just `src/` — the thing you publish is the build.

### 2.4 Say where it came from, and say what you did to it

**[record]** Nothing on the user's own screen merges those log streams — the
merge is the page's doing. So each moment carries a slug naming the files it was
composed from with a line count each, and the footer says plainly: *"Every line
is real; nothing shows these two files merged except this page."*

Two separate claims, both needed: **the lines are real** and **the arrangement
is mine.** State the second or the first reads as a lie by omission.

### 2.5 Derive every count from the data

Any number *about* the data must be computed *from* the data. Write "20 lines"
by hand and it is wrong the first time anyone edits anything.

**[record]** One module, imported by every view that needs a count:

```js
export function composition(m) {
  const by = {}
  for (const l of m.lines) if (l.src) by[l.src] = (by[l.src] || 0) + 1
  return {
    files: ORDER.filter(s => by[s]).map(s => ({ src: s, file: FILE_OF[s], n: by[s] })),
    gaps:  m.lines.filter(l => l.k === 'gap').length,
    total: m.lines.length,
    dates: datesOf(m.from),
  }
}
```

The hero's index ("50 lines across 2 log files") and each moment's slug
("jarvisd.log 7 / audit.jsonl 11") both come from it. Adding a line moves every
number on the page by itself.

A real trap this avoids: a date **span**. One moment runs 17:01:34 → 00:45:52
across two dates a fortnight apart. Rendered as a span it reads as though time
runs backwards. The derivation emits dates only — deliberately, with the reason
in a comment.

### 2.6 Semantic colour needs a legend, or it is decoration that happens to be data

The sharpest lesson of the second project.

**[record]** The source column was tinted by which log file each line came
from — tan for `jarvisd.log`, mauve for `audit.jsonl`, both sat at the dim
metadata brightness so they read as provenance rather than judgment. Correct,
derived, defensible. **And completely meaningless to a reader**, who meets two
colours with no way to learn they mean anything at all.

The fix was not to remove the tints. It was to give each moment a slug naming
its files *in those same colours*, so the legend sits six inches above the thing
it explains and doubles as useful metadata.

> **If you add a semantic colour, name the thing it means somewhere the reader
> will see before or with it. An unexplained meaningful colour is strictly worse
> than no colour**, because it spends the reader's attention and returns
> nothing.

Verify the legend by **computed colour**, not by eye:

```js
getComputedStyle(slugFile).color === getComputedStyle(readoutCell).color
```

Two tokens that look identical in a screenshot and differ by one hex digit will
quietly uncouple the legend from the thing it legends.

### 2.7 Know which version you recorded

**[record]** The logs were captured while the source repo had a feature branch
checked out, not `master`. Every string the page quotes exists on `master` too,
so the record is faithful to the shipped code — but establishing that took a
check, and it is written down:

```bash
git grep -c "<the string>" master -- '*.py'
```

Two strings turned out to be branch-only. They are named in the README as
**never to appear on the page.** If you publish output, you are publishing a
claim about *which build* produced it.

---

## 3. The visual tells

### 3.1 The default palette

**Tell:** an accent at full saturation, a neutral grey ramp, white cards on a
near-white page, `#0f172a` text. Usually indigo, teal, or violet-to-pink.

**Instead:** derive the palette from the thing, and **name tokens for the role
they play, not for how dark they are.**

**[drawing]** ink on paper:

```
--paper   the page          --draw      a visible edge
--card    one step up       --draw-mid  internal structure
--sunk    behind the page   --draw-far  something receding
--ink     text              --rule      a faint division
--accent  used ~5 times     --mark      annotation / trajectory
```

**[record]** a terminal, where every colour is a thing the daemon decided:

```
--ground    near-black, the terminal ground
--text      log default, dim — body and headings alike
--speech    what the USER said; the only bright text
--allowed   verdict: allowed (read)
--write     verdict: write
--blocked   verdict: blocked / refused
--local     routed on-device
--sonnet    escalated to the expensive tier
--src-*     which log file a line came from
```

Named this way you cannot casually add a colour — you would have to say what
role it plays. That is the entire point.

**Measure every ratio and write the number in the file.** Both projects do, and
in both it caught something. Measured values stop a palette drifting pale.

**The record's stricter rule, which generalises well:** colour appears *only*
where the system being described assigns meaning. Not "where the designer wants
emphasis". Headings get no hue; emphasis is weight and space.

**A corollary found the hard way:** put the hue on **what actually differs.**
The routing list coloured its tier badge, but two rows share the label "cloud" —
so the same word appeared twice in two colours, which reads as a bug. The hue
belongs on the model name, the part that is genuinely different.

### 3.2 Typefaces

**Tell:** Inter for everything, 400/500/600, nothing else.

**Instead:** give each *kind of information* its own voice, with a reason.

**[drawing]** three, because it has three kinds: Inter for headings (NASA
digital-era), Public Sans for prose (a US federal typeface, reads long), DM Mono
for data, codes, placards and readouts.

**[record]** two, because a log has two kinds: one mono for everything
transcribed, one sans for everything the page says in its own voice. **The
typeface is the boundary between quoted and authored.** That is load-bearing,
not decorative.

Three was the drawing's answer, not a target. Count the kinds of information you
actually have.

### 3.3 Decoration that means nothing

**Tell:** floating blurred gradient orbs, a dot grid, generic "tech" glyphs,
particles.

**Instead:** every mark is a real part. **[drawing]** Bolts sit on real bolt
circles. Dashed lines mean *unpressurised*. A dotted ring means a part seen
*through* a surface. The star field is seeded, so it is identical on every load,
because a drawing does not reshuffle itself.

**[record]** went further and deleted the category: `react-icons` came out of
`package.json` on the grounds that a log-derived page has no place for
decorative glyphs. Where a label is needed, words do it.

**If you cannot say what a decorative element *is*, delete it.** And if the
conceit is a document, you may not need any.

### 3.4 Soft shadows and glassmorphism

**Tell:** `box-shadow: 0 10px 30px rgba(0,0,0,.1)`, `backdrop-filter: blur()`.

**[drawing]** Depth is *drawn*, not lit:
`box-shadow: 2px 2px 0 0 var(--rule-hard)` — hard, no blur, no spread. A soft
shadow is a photograph of a panel; this is a drawing of one.

**[record]** No shadows, no radius, no gradient, no `backdrop-filter`, because a
terminal has none of those things.

The general rule is **pick a physical logic and never leave it.** "Hard shadows"
is the drawing's answer to it, not the rule itself.

### 3.5 The full-viewport hero

**Tell:** `height: 100vh`, huge name, a bouncing chevron saying "scroll".

**Instead, make it shorter than a viewport, or skip it.** **[drawing]** 66vh,
floored at 330px, capped at 600px: at two thirds the nose of the ship is already
entering the bottom of the frame, so it reads as an approach rather than a
splash screen, and the eye is pulled down instead of parked.

A reader with thirty seconds should not spend five on a name they already knew —
they clicked a link carrying it.

No scroll-jacking, no click-to-enter, no snap.

### 3.6 Animation as filler

**Tell:** everything fades up on scroll, 600ms, staggered.

**Instead:** motion only where it carries meaning. **[drawing]** the centrifuge
ring spins because a centrifuge *spins* — and because you drag it, not because
you scrolled past it. **[record]** scroll advances *time through the record*,
which is the one thing scroll can honestly mean on that page.

**Corollary, learned the hard way: 1:1 with the page is the only rate that needs
no JavaScript.** A parallax background positioned from a scroll handler jitters
on mobile no matter how fast the handler is, because the page scrolls on the
compositor thread and the handler runs on the main thread. It is a
synchronisation problem, not a throughput problem.

### 3.7 "It looks too plain" is usually a type-contrast problem

**[record]** The owner's note was *"looks too plain, mainly the background."*
The background was the obvious suspect and the wrong one.

Measured, the body copy was `#8f8f93` on near-black — **6.11:1**. Most of the
words on the page were mid-grey. Lifting it to `#a3a3a8` (**7.83:1**) did more
than anything done to the ground, and preserved the ordering that carries the
meaning:

```
faint 3.05  <  text 7.83  <  ink-mid 11.09  <  speech 17.30
```

A hierarchy you can now actually read *as* a hierarchy.

> **When a page reads as washed out, measure the text before you touch the
> background.** "Plain" is a report of a symptom, not a diagnosis. Dim body copy
> over a flat ground reads as *the ground* being wrong, because the ground is
> the larger area — but the text is where the contrast went.

Banding the sections helped too, and was the right second move. It was not the
first one.

### 3.8 Full-bleed sections by padding, never `100vw`

**[record]** To get section backgrounds reaching the window edge while content
stays on the measure, with **no markup change**:

```css
main         { max-width: none; margin: 0; padding: 0; }
main > *     { padding-inline: max(var(--gut), calc((100% - var(--maxw)) / 2)); }
main > *:nth-child(even) { background: var(--ground-b); }
```

`width: 100vw` includes the scrollbar, and is exactly how that page acquired
16px of phantom horizontal scroll once already.

Two reasons this shape is worth memorising: it needs no wrapper element, and the
band is the **section's own background** rather than a layer behind the content —
which is what let a page whose rule was *"nothing lives behind the content"*
have banded grounds without breaking its own rule. Adding a real background
layer would have broken it. On that page, a background element is the specific
sin the rebuild existed to undo.

### 3.9 Progressive disclosure: the rules that make it safe

If scroll reveals content, these are not optional.

**Monotonic.** A revealed line never hides. This is what makes fast scrolling
safe with no special case, and it means a reader who flicks to the footer has
the complete content.

**Every degradation shows everything.** `prefers-reduced-motion`, narrow
viewports, and reaching the end all print the full content.

**A defined failure mode on every viewport — and distinguish "ugly" from
"unreachable".** This is the part people miss. **[record]** On a phone the
readouts are *taller than the phone*: at 390px wide they measure 938px, 380px
and 840px against a viewport of roughly 660–780. A sticky `100vh` stage would
pin and reveal lines into a region **scrolling cannot reach**, because scroll
advances the reveal rather than the stage. That is a correctness failure, not a
taste call, and it needs a gate.

It also needs a *second* gate. The middle readout is only 380px and would pass
the fit check on its own — so without a width gate one phone would play one
moment and print two, unexplained. Measured height thresholds: **597px / 560px /
399px**, which means a 1366×768 laptop sits right on the line.

> **Write the correctness reason in the code, not the taste reason.** That
> comment originally read *"just the width below which a mono readout wraps too
> hard"* — which invites someone to lower it later on the grounds that the
> wrapping looks fine, reintroducing unreachable content. A guard whose comment
> understates its own importance will be removed.

---

## 4. Content tells

A recruiter reads the words. Most AI-written copy fails the same ways, and these
matter more than anything in §3.

### 4.1 Unverifiable claims

**Cut anything the reader cannot check.** **[drawing]** A whole project card
went because its repo was private and its claims rested on the owner's word. The
problem was never quality — **an unverifiable claim next to verifiable ones
makes the verifiable ones look like marketing too.**

Everything remaining has a link, or an explicit "in progress · unpublished".

### 4.2 Metrics that aren't

**Tell:** "improved efficiency by 40%", "10x faster", "99% accuracy".

**Instead:** a number plus the thing it counts.

- before: "100% match rate"
- after: `metric: '100% of the test catalog'` — "Found a replacement for every
  obsolete part they sent; days and weeks became minutes."

"41 tools", "1092 tests", "Fail-closed by default" pass the same test: each
names a countable thing.

**And count it with a command you ran.** **[record]** keeps the derivations in
the README, including a warning:

```bash
# tools — 72. Import the modules; do NOT grep for '"name":', because nested
# JSON-schema properties carry a name key too and that overcounts to 88.
```

A plausible counting method gave a number 22% too high. The comment is there so
nobody re-derives it the easy wrong way.

### 4.3 Stating what the reader can see, or doesn't need

**[drawing]** A timeline description went from four sentences to two. What went
was an explanation that rotation is clamped at both ends — true, and you learn
it by dragging, in half a second. And "clicking a gondola opens its detail
rather than turning the wheel", which existed because the behaviour had
surprised *the builder* — not the same as surprising a reader.

**What survived is the two things you cannot discover without being told:** that
the handrail is the thing you drag, and that the gondolas are links.

### 4.4 Padding the credentials

GPA went. "Both 2026" after two publications went — the dates are right there.
An ORCID went **in**, because it is a verifiable identity and costs one line.

### 4.5 Ordering that flatters instead of informs

**[drawing]** Publications moved **above** projects: for someone with
peer-reviewed work that is the strongest signal and should not be third. Order
sections by what the specific person has, not by the template.

Then add the one line that answers the reader's real question. Theirs: "Looking
for full-time roles and internships."

### 4.6 Voice

Em-dashes everywhere, "passionate about", "leveraging", "seamless",
"cutting-edge", "I'm a developer who loves to build" — all of it goes. Say what
the thing does. "I build AI agents and the tooling that keeps them honest" works
because it is a claim with an edge on it.

### 4.7 Capability claims rot, and one good day is not a capability

The hardest content lesson, and it is specific to pages about software you are
still building.

**[record]** Three claims on a shipped page were contradicted within a
fortnight. All three came from **building a moment out of one good day's logs
and assuming it generalised.**

The worst was a feature that worked on 30 October and not on 12 November. There
was no code change, and both my regression theories were wrong. The capability
was never granted in the system prompt: October was improvisation that
reproduced about **4 times in 5** from a clean context and **0 times in 5** from
a context containing its own earlier refusal — and since 20 turns of history
reload at startup, that refusal came back after every restart. It was never a
regression and never a feature. The page had promoted a coin flip to a claim.

Three rules out of it:

1. **A capability claim needs a mechanism, not an observation.** "I saw it do
   this" is weaker than "the prompt grants this" or "a tool exists for this".
   Check which one you have.
2. **Re-verify every claim against the source before each publish**, not once
   when written. Keep the grep in the README.
3. **Write down what it still cannot do, in the same breath.** That page says
   plainly that there is no duration tool anywhere in the codebase, so it cannot
   report travel time — *and* instructs future sessions never to write copy
   implying an ETA, "approximate or otherwise; a spoken guess is not logged and
   not checkable."

That honest-limitations column was the best thing on the first version and the
one piece the rebuild was required to keep. **A page that names its own gaps is
read as credible about everything else.** The gaps are content.

### 4.8 Don't protest authenticity

**[record]** The first version had "1092 tests", permission tiers, and "a real
session, not a mockup" — three separate protests of authenticity in one
screenful. That buys credibility the reader **wasn't withholding**, using the
eight seconds in which they decide whether to care.

Proof is the floor, not the content. Make it checkable, put it underneath, and
stop saying it. One authenticity claim, not three.

---

## 5. The og:image

**Tell:** no og:image, or a screenshot of the page body. A crop of a content
section reads as a glitch at 500px wide.

**What both did:** built a frame that doubles as the card, then **photographed
the real page** — headless Chrome, 1200×630 captured at 2x, driven by
`npm run og`. Checked in, regenerated whenever the page changes.

**Why captured, not redrawn:** a hand-built SVG card is a second drawing of the
same thing, and it drifts silently. A photograph of the real page cannot
disagree with it.

**The invalidation rule, from the second project:** a look change *invalidates
the card*, so regenerating it is part of that change, not a follow-up task. Ship
them in the same commit. The record's card went 158K → 176K on the banding pass
and would otherwise have advertised the old page for weeks.

Mechanics worth remembering: `twitter:card` must be `summary_large_image` —
plain `summary` crops to a small square and throws away the composition. Add
`og:image:alt`; a shared link with no alt is unreadable to anyone on a screen
reader.

---

## 6. Process — this is what actually produced the difference

### 6.1 Spike, judge, then promote

Build the risky idea as an explicitly labelled throwaway. **[drawing]** The
landing shipped as `SPIKE` in three files with a header saying "Built to be
looked at and judged, not kept as-is." **[record]** The less-flat pass was three
commits each prefixed `SPIKE:`.

It stays labelled until the owner says keep it, and promoting it is its own
commit.

**Addition from the second project: squash the spike on promotion.** Its
internal history is "fix the thing I just added" steps — three of them were my
own corrections. Those are not worth keeping in a repo's history. **The lessons
go in the README; the git log gets the clean version.** Keeping both is how a
log becomes unreadable.

This stops "I tried it" and "we decided" from blurring together.

### 6.2 Measure. Do not reason from plausibility

Nearly every bug across both builds had a plausible explanation that was wrong.

- The mobile jitter "must be" performance. Every frame was 16.7ms. It was
  main-thread/compositor synchronisation.
- "There is no horizontal overflow." There was 0.8px — an earlier measurement
  was taken in a window whose scrollbar made the viewport fractional.
- The nav marker "lagged". It could not physically reach the last three chips:
  positioned as a percentage of a 332px container while the chips ran to 552px.
- The handrail was "a rasterisation problem", so I supersampled it. It was a
  48-sided polygon. No amount of supersampling fixes a polygon.
- The replacement outline was "continuous". Colouring it red showed it arriving
  as broken dashes — a flat ellipse sliced by the 96 opaque tiles it crossed.
- The readout parse gave 12 lines for all three moments. The regex was wrong;
  the real values were 20/13/17. Fixed by importing the module in `node` instead
  of parsing its text.

**Rule: when you cannot reproduce something, ask for the one detail that
discriminates between your hypotheses before you change code.** "It goes into
the chip on the left, every time, except the intro" identified a paint-order bug
in one sentence, after two wrong theories and a wasted afternoon.

**Corollary: colour the thing in question bright red and look at it.** Three of
the above were solved that way and none by reasoning.

**Corollary: parse data by importing it, never by regex.** If it's a module,
`node -e` it. Text-parsing your own data structure invents facts.

### 6.3 Who is the source of truth for what

New, and uncomfortable. Across the second project the owner corrected me on
facts **four times**, and I caught none of those four myself.

| Question | Source of truth |
|---|---|
| What the system can do now | the owner, and the prompt / tool definitions |
| What it did on a given day | the logs |
| Whether a string exists | `git grep` on the shipped branch |
| What the page should say | the owner |
| Whether the page says it | measurement |

**The model is the source of truth for none of these.** I was wrong about a
regression, about which branch a feature shipped on, about how many log streams
the page used, and about whether a scroll mechanism worked. Each was settled by
running a command, and each would have shipped if the owner had taken my word.

Practical form: **before asserting anything about the subject's behaviour, name
the command that would check it, and run it.** If there isn't one, say the claim
is unverified and let the owner decide.

I was also, once, right when the owner was wrong — they recalled a spoken
approximate travel time, and the prompt text plus an empty grep showed no
duration tool exists. **The right response was to show the evidence, not to
defer.** Deference and credulity are the same failure.

### 6.4 A test that can only pass is not a test

**[record]** I reported the scroll reveal working. It wasn't verified: I had
sampled only the **end** of the track, where every line is legitimately
revealed. The measurement could not have failed, so it measured nothing.

Before trusting a check, ask: **what result would have told me it was broken?**
If there isn't one, it isn't a check. Sample where the expected and broken
behaviours differ — for a progressive reveal, the middle.

### 6.5 When results contradict, suspect the harness before the code

Same bug, three runs, three answers, on code that was fine:

| Run | Result | Actual cause |
|---|---|---|
| 1000ms settles, fresh load | perfect — 1,4,7,10,13,16,19,20 | correct |
| 50ms steps, fresh load | 0 lines throughout | **my tab was unfocused and rAF throttles** |
| any run after prior scrolling | 20 lines throughout | **state is monotonic and never resets without a reload** |

Both traps were *documented in that repo's own README* and I walked into both.

> **Contradictory measurements of deterministic code mean your instrument is
> wrong.** Stop measuring and go read how the mechanism works.

Specifically, for anything scroll- or animation-driven:

- **rAF throttles in unfocused tabs.** Any automated fast-scroll test is
  meaningless unless the tab has focus.
- **Monotonic state invalidates repeat runs.** Reload between measurements or
  you measure your own previous scroll.
- **`offsetTop` is not document-relative.** Use
  `getBoundingClientRect().top + scrollY`. This started one scan at 31.7%
  instead of 0.

And when you cannot reproduce what the owner reports, **give them the numbers
and ask for the one discriminating value** — here, the fit thresholds and a
request for their `innerHeight`. They came back with "it works now, reloading
resets it, perfect." There had never been a bug.

### 6.6 Comments carry the why and the number

Every non-obvious value says where it came from.

```css
/* Derived, not chosen. connH/2 - dockH/2 = connH * (48/360),
 * so H = 0.3394 x W at every size. */
aspect-ratio: 1000 / 339.4;
```

```css
/* 38%, not 50%. At 50% the vertical radius is half the height, so the whole
 * side of the chip is ONE ellipse arc and there is no straight edge for a
 * connector to land on. At 38% the corner arcs leave 24% of the height
 * straight - about 11px on a 46px chip. */
border-radius: 7px / 38%;
```

This is what stops the next session — or the next model — from "tidying" a value
back to a default. **A number with a derivation is defended. A magic number is
not.** §3.9 is the cautionary case: a guard whose comment gave the weak reason
nearly invited its own removal.

### 6.7 Reuse the values already decided — and mark deliberate copies

**[drawing]** When the landing's role line needed a panel, it took **every**
value from the nav's existing panel — same four bolts at the same 9px inset,
same surface mix, same 2px offset — rather than choosing new ones that looked
similar. Verified by comparing computed styles. Re-choosing is how a design ends
up with six slightly different greys.

**Addition: when you must duplicate, say so in both places.** **[record]** A
standalone privacy page inlines its own copy of the tokens rather than linking
the app's hashed stylesheet — correct, since the hash moves. The cost is that it
**silently missed the `--text` lift** and sat at the old contrast. It now carries
a comment naming the drift and what to check.

Any deliberate copy of a shared value needs a note saying it is a copy, or it
becomes a stale value nobody knows is stale.

### 6.8 Finish the whole surface

A fix is not done until you have checked the **other** rendering of the same
thing. **[drawing]** A pole added to the centrifuge looked right on desktop and
painted a white column down the middle of the mobile list, because mobile
renders that timeline as a list and nothing hid the new element.

**[record]** adds a second axis: **height, not just width.** Every layout bug
there was found at a narrow width; every playback bug was found at a short
*height*. A 1366×768 laptop breaks a page that is fine at 1920×1080 and fine at
390px. Check a short window explicitly.

### 6.9 Keep a bite-list in the repo

Both repos carry a README section of mistakes already made. The record's are
titled **"Things that will bite you"**, **"Claims that were wrong, and how they
got caught"**, and **"Things this rework decided that are easy to undo by
accident."**

This is the highest-leverage artefact in either project, because the reader is
usually a model with no memory of the session that learned the lesson. Three
properties make an entry useful:

- **The wrong theory, not just the right answer.** "It was a 48-sided polygon,
  not a rasterisation problem" stops the next person re-supersampling.
- **The command that settles it.** `grep -rn "40\.8154" src/ dist/`.
- **The instruction, imperative.** "Do not write copy implying an ETA."

A guide like this one is that list, generalised. Write the local version first;
it's cheaper and it fires at the right moment.

### 6.10 Shipping a rewrite: diff the file lists both ways

**A rewrite branch is defined by what it deletes, which makes merging it
dangerous.**

**[record]** `main` held one commit the rework branch had never seen, which had
added a 212-line privacy policy page — the one the Gmail OAuth client points at,
citing Google's user-data policy. A naive merge would have deleted a live URL
that app verification depends on. It survived because of this check:

```bash
# commits on main the branch does not have
git log --oneline <branch>..main

# files on main that would vanish
comm -23 <(git ls-tree -r --name-only main | sort) \
         <(git ls-tree -r --name-only <branch> | sort)
```

The output was eleven files: nine *intended* deletions (the orb modules, old
screenshots) and two that must not be. **You cannot tell those apart from a
diffstat.** Read the list.

Then merge `main` into the branch first, so the kept file arrives with its
history, and fast-forward.

Two more, both cheap:

- **`git branch --merged` cannot see a squash-merge.** Verify by content —
  `git diff <branch> main` — before deleting anything.
- **`*.local` does not match `settings.local.json`.** It matches names *ending*
  in `.local`. A personal permissions file needs its own explicit `.gitignore`
  line, and in a public repo it belongs in `settings.local.json` rather than the
  shared `settings.json`, because a push grant is a personal trust decision and
  not team policy.

---

## 7. Things that look like slop but are not

Do not over-correct. These are fine, and a reviewer may wrongly flag them:

- **A system font stack**, if chosen for a reason and the reason is stated.
- **Plain, boring section ordering**, when the material has no stronger order.
- **Repetition of a motif.** The drawing repeats one `7px / 38%` radius and one
  hatching angle everywhere; the record repeats one row shape for fifty log
  lines. Consistency is not laziness; arbitrary variety is.
- **Short copy.** Two sentences that say something beat six that hedge.
- **Codes and jargon from a real system.** The drawing's bay codes are genuine
  ISS rack locations — the letter is the module wall the rack is bolted to. I
  called them arbitrary during a review and was wrong. **Check before cutting
  something as decorative; it may be load-bearing.**
- **A monochrome page.** The record has almost no colour by design, and the fix
  for "too plain" was contrast and rhythm, not hue (§3.7).
- **Visible redaction marks.** `[my coordinates]` looks unfinished and is the
  honest form (§2.2).
- **Admitting what the thing cannot do.** Reads as under-selling; actually the
  most credible content on the page (§4.7).
- **One readout line that is nothing but a timestamp gap.** Dead space that is
  *true* beats a filler line that is plausible.

---

## 8. Checklist

**Conceit**

- [ ] Can I name the real thing this site *is*, in one sentence?
- [ ] Does it answer three questions it wasn't designed for?
- [ ] Did I check whether the project already *produces* an artefact that could
      be the page?
- [ ] Are the anti-goals written down — including one that forbids the lazy fix?

**If the page shows real data**

- [ ] Does every line trace to a real file, checked in session?
- [ ] Is every edit a visible cut, never a rewrite?
- [ ] Is the redaction scan a command in the README, re-run on this change?
- [ ] Did I scan the *rendered* text and `dist/`, not just the source?
- [ ] Does the page say both "the lines are real" and "the arrangement is mine"?
- [ ] Is every count derived from the data rather than typed?
- [ ] Does every semantic colour have a legend the reader meets first?
- [ ] Do I know which branch/build produced the output I'm publishing?

**Visual**

- [ ] Is every colour token named for a role, not a darkness?
- [ ] Is every contrast ratio measured and written in the file?
- [ ] Does the hue sit on what actually differs between the cases?
- [ ] Does each typeface carry a different kind of information?
- [ ] Can I say what every decorative mark *is*?
- [ ] One physical logic for depth, never left?
- [ ] Is any hero shorter than a viewport, or absent?
- [ ] Does every animation carry meaning, and run at 1:1 if it has no JS?
- [ ] If it reads "plain", did I measure the body text before touching the
      background?
- [ ] Full-bleed by padding, not `100vw`?
- [ ] If content reveals on scroll: monotonic, all degradations complete, and a
      defined failure mode at every viewport *height*?

**Content**

- [ ] Can a reader verify every claim, or is it marked unverified?
- [ ] Does every metric name a countable thing, counted by a command I ran?
- [ ] Have I cut everything discoverable by using the page?
- [ ] Are sections ordered by this person's strengths?
- [ ] Is the reader's real question answered in one line?
- [ ] Does every capability claim rest on a mechanism, not one observation?
- [ ] Is there an honest "cannot do this yet" section?
- [ ] One authenticity claim, not three?
- [ ] Any "passionate", "leveraging", "seamless", "cutting-edge"?

**Ship**

- [ ] og:image regenerated **in this commit** if the look changed
- [ ] `twitter:card` is `summary_large_image`, `og:image:alt` present
- [ ] Checked on a real phone, and in a *short* window, not just a narrow one
- [ ] Every non-obvious number has its derivation in a comment
- [ ] Every guard's comment gives its strongest reason, not its weakest
- [ ] Both renderings of every section checked
- [ ] Before merging a rewrite: `git log <branch>..main` and the `comm` file
      diff, both read
- [ ] Bite-list updated with what this change decided and what it got wrong

---

## 9. Handing this to a model

Paste this file at the start of the session, then:

> Follow `anti-slop-guide.md`. Before proposing any design, tell me in one
> sentence what real thing the site *is*, and answer three questions the conceit
> wasn't designed for. Check whether the project already produces an artefact
> that could *be* the page before inventing a metaphor. Don't start building
> until I've agreed the conceit.
>
> If the page will show real output, read §2 again and treat every line as a
> quotation: transcribe, never write; cut, never rewrite; derive every count.
>
> When you hit a bug, measure before you theorise. If you can't reproduce it,
> ask me for the one detail that separates your hypotheses. If two of your
> measurements contradict each other, your instrument is wrong, not my code.
> Before you tell me something works, tell me what result would have shown it
> broken.

**And the one that matters most**, because it is the failure this guide cannot
prevent on its own: you are not the source of truth for what the subject does.
Name the command, run it, show me the output. Four factual errors in the second
rebuild were caught by the owner and none by me.
