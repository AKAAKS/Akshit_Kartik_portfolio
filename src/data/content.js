/* =============================================================================
 *  CONTENT — the single source for the page and for print.
 *
 *  EDIT THIS FILE. Nothing else holds copy.
 *
 *  Sourced from Documents/Career/Resumes/Resume_Intuitive.txt and
 *  Resume_Bloomerang.txt (figures and dates) and Base/Base_resume_latex.txt
 *  (breadth). Nothing here is invented.
 *
 *  House rules, because this is where bloat gets in:
 *    - `desc` and each `detail` is ONE line. Hard cap 16 words.
 *    - No decorative numbers. Every figure is traceable to a repo or a venue.
 *    - Resume swap: drop the PDF in public/ and set profile.resumeUrl.
 * ========================================================================== */

export const profile = {
  name: 'Akshit Kartik',
  title: 'AI systems engineer · published researcher',
  tagline: 'I build AI agents and the tooling that keeps them honest.',
  /* Both of these were missing entirely, and their absence was the biggest
   * gap on the site: a reader could not tell that the degree is finished,
   * that the roles ending in 2025 and 2026 ended on purpose, or where in the
   * world this person is. Silence on work location tends to be read as the
   * answer the reader fears. */
  location: 'University Park, PA · open to relocate',
  status: 'BS Computer Science, Penn State · May 2026',
  resumeUrl: '/resume.pdf',
}

/* The station. Order here is the order of the page, and the station map reads
 * from it, so moving a module moves both. `external: true` marks a section
 * outside the pressurized volume — the truss is not a module you walk into. */
export const modules = [
  { id: 'intro', desig: 'Node 1', hatch: 'Hatch 01', name: 'Intro', element: 'NOD1' },
  { id: 'timeline', desig: 'Centrifuge', hatch: 'EVA', name: 'Timeline', element: 'CAM', external: true },
  { id: 'publications', desig: 'Lab B', hatch: 'Hatch 03', name: 'Publications', element: 'LAB2' },
  { id: 'experience', desig: 'Node 2', hatch: 'Hatch 04', name: 'Experience', element: 'NOD2' },
  { id: 'projects', desig: 'Lab C', hatch: 'Hatch 05', name: 'Projects', element: 'LAB3' },
  { id: 'skills', desig: 'Node 3', hatch: 'Hatch 06', name: 'Skills', element: 'NOD3' },
  { id: 'contact', desig: 'Airlock', hatch: 'Hatch 07', name: 'Contact', element: 'A/L' },
]

/* --------------------------------------------------------------- publications */
export const publications = [
  {
    bay: 'O1',
    title: 'AquaTag: An Open-Source Wearable Platform Enabling Flexible Sensor Placement for Aquatic Sensing',
    venue: 'Proc. ACM IMWUT 10(3)',
    year: 'Sept 2026',
    authors: 'Z. Li, R. Liu, et al. (incl. A. Kartik)',
    desc: 'Built the IMU-to-video sync tool and the labeling pipeline behind the dataset.',
    ref: { label: 'doi:10.1145/3831639', url: 'https://dl.acm.org/doi/10.1145/3831639' },
  },
  {
    bay: 'O2',
    title: 'OmniSch: A Multimodal PCB Schematic Benchmark for Structured Diagram Visual Reasoning',
    venue: 'arXiv preprint cs.CV',
    year: 'Mar 2026',
    authors: 'T. Lu, K. Lin, et al. (incl. A. Kartik)',
    desc: 'Tests whether multimodal models can read schematic symbols, nets and connectivity.',
    ref: { label: 'arXiv:2604.00270', url: 'https://arxiv.org/abs/2604.00270' },
  },
]

/* ----------------------------------------------------------------- experience */
export const experience = [
  {
    bay: 'P1',
    role: 'Undergraduate Researcher — Sensing Platforms & Diagnostic Tooling',
    org: 'The Pennsylvania State University',
    place: 'University Park, PA',
    from: 'Jan 2025',
    to: 'May 2026',
    points: [
      'Built the Python/PyQt tool researchers use to sync IMU streams against video and label events.',
      'Debugged timing drift between independently clocked sensor hardware and video capture.',
      'Built the OpenCV/Pandas pipeline behind an accepted ACM IMWUT 2026 publication.',
    ],
  },
  {
    bay: 'P2',
    role: 'Research & Development Intern — Robotics',
    org: 'Meritus.AI',
    place: 'Chennai, India',
    from: 'Jun 2024',
    to: 'Aug 2024',
    points: [
      'Engineered C++ firmware for Arduino and ESP-32: sensor fusion, motor control, pathfinding.',
      'Deployed YOLO/OpenCV perception onto a constrained AI kit for World Robot Olympiad 2024.',
    ],
  },
  {
    bay: 'S1',
    role: 'Learning Assistant',
    org: 'The Pennsylvania State University',
    place: 'University Park, PA',
    from: 'Jan 2024',
    to: 'Dec 2025',
    points: [
      'Led weekly recitation for 40+ students in a large-scale Java course.',
      'Reviewed 100+ programming assignments per cycle for correctness and design.',
    ],
  },
]

export const education = {
  bay: 'D1',
  school: 'The Pennsylvania State University',
  place: 'University Park, PA',
  degree: 'BS Computer Science',
  minor: 'Minor in Cybersecurity Computational Foundations',
  date: 'May 2026',
}

/* -------------------------------------------------------------------- projects
 * Ordered by what a reader should see first, not by date.
 * `metric` is the headline outcome and leads the card. */
export const projects = [
  {
    bay: 'D1',
    name: 'Parts Procurement Engine',
    subtitle: 'B. Braun Medical Inc.',
    from: 'Aug 2025',
    to: 'Dec 2025',
    /* The figure counts something specific, so it says so. On its own
     * "100% test-catalog match" was unreadable - 100% of what, against
     * what? B. Braun supplied a catalog of obsolete parts to test against,
     * and the tool found a replacement for every one of them. */
    metric: '100% of the test catalog',
    desc: 'Production Next.js 15 / React 19 / TypeScript app for a medical-device manufacturer.',
    detail: 'Found a replacement for every obsolete part they sent; days and weeks became minutes.',
    note: 'Senior capstone · team of six',
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'NextAuth', 'OpenAI API'],
    // Live demo omitted on purpose: its sign-in page exposes test credentials.
    links: { repo: 'https://github.com/AadhityaT/capstone-ai-website-app' },
  },
  {
    bay: 'D2',
    name: 'J.A.R.V.I.S.',
    subtitle: 'Agentic voice & text assistant',
    from: 'Mar 2026',
    to: 'Present',
    metric: '41 tools',
    desc: 'Always-on daemon running a Claude tool-use loop over home, media and PC control.',
    detail: 'One audited guard blocks prompt-injection self-approval; tiered router holds a hard budget.',
    note: '1092 tests',
    tags: ['Claude tool-use', 'WebSocket', 'Home Assistant', 'Python'],
    links: {
      site: 'https://jarvis-landing-sooty.vercel.app/',
      repo: 'https://github.com/AKAAKS/personal-assistant',
    },
  },
  {
    bay: 'O1',
    name: 'OS Agent',
    subtitle: 'Windows telemetry & anomaly triage',
    from: 'Jan 2026',
    to: 'Present',
    metric: 'Fail-closed by default',
    desc: 'Python daemon triaging CPU, RAM, GPU and process anomalies via a LangGraph OODA machine.',
    detail: 'Command allowlisting, protected-PID guards, and a Docker sandbox for anything it runs.',
    note: '170 tests',
    tags: ['LangGraph', 'psutil', 'SQLite', 'Docker'],
    links: {
      site: 'https://os-agent-landing.vercel.app/',
      repo: 'https://github.com/AKAAKS/OS_agent',
    },
  },
  {
    bay: 'P1',
    name: 'Agentic Labeling Engine',
    subtitle: 'LLM classification with human review',
    from: '2026',
    to: null,
    // TODO(akshit): add the repo link here and a month for `from`. This is
    // the only project on the page with nothing to click, which makes its
    // claims unverifiable next to four cards that are.
    desc: 'A LangGraph labeler proposes and a critic reviews; Pydantic V2 validates every record.',
    detail: 'One BaseTool abstraction so a Streamlit UI and a Typer CLI run identical code paths.',
    tags: ['LangGraph', 'Pydantic V2', 'Streamlit', 'Typer'],
    links: {},
  },
  {
    bay: 'O2',
    name: 'Macro Chef',
    subtitle: 'Macro-aware meal planning, shipped inside JARVIS',
    from: 'Oct 2026',
    to: 'Present',
    metric: 'One engine, two faces',
    desc: 'A nutrition engine behind food lookup, pantry tracking, logging and meal-prep planning.',
    detail: 'Built as a shared core so the assistant and a planned web client run the same code.',
    note: 'Ships as a JARVIS tool-pack · standalone web client not yet built',
    tags: ['Python', 'USDA / OpenFoodFacts', 'SQLite', 'Tool design'],
    // Deliberately points at the JARVIS repo: the engine lives there, and a
    // link to an empty spec repo would be worse than no link at all.
    links: { repo: 'https://github.com/AKAAKS/personal-assistant' },
  },
  {
    bay: 'S1',
    name: 'Cardio BP',
    subtitle: 'Cuffless blood pressure estimation',
    from: '2026',
    to: 'Present',
    note: 'In progress · unpublished',
    desc: 'Estimates systolic and diastolic pressure from PPG pulse-shape and timing features.',
    detail: 'An agentic layer ties the signal-processing and regression stages together.',
    tags: ['PPG / biosignals', 'Signal processing', 'Agentic AI', 'Python'],
    links: {},
  },
  {
    /* The site you are reading. Listed because it is a real piece of work and
     * because the reader is already looking at it - the one project that
     * needs no screenshot and no demo link to be judged. */
    bay: 'S2',
    name: 'This site',
    subtitle: 'Drawn spacecraft portfolio',
    from: 'Oct 2026',
    to: 'Present',
    metric: 'No stock art',
    desc: 'A spacecraft seen side-on, drawn as SVG line art: hull, docking adapters, engine.',
    detail: 'Career timeline rides a CSS-3D centrifuge; every mark is hand-built, nothing is a library.',
    tags: ['Vite', 'React', 'SVG', 'CSS 3D'],
    links: { repo: 'https://github.com/AKAAKS/Akshit_Kartik_portfolio' },
  },
]

/* ---------------------------------------------------------------------- skills
 * Groups are the ones the resumes use. Every entry names where it was actually
 * used — no self-assigned levels, because nothing backs a number like that. */
export const skills = [
  {
    bay: 'P1',
    group: 'AI & agent tooling',
    items: [
      { name: 'Claude & OpenAI APIs', where: 'JARVIS, OS Agent' },
      { name: 'Tool-use loops', where: '~41 tools in JARVIS' },
      { name: 'LangGraph', where: 'OS Agent, Agentic Labeling Engine' },
      { name: 'Claude Code', where: 'daily driver — agent harness, MCP servers' },
      { name: 'PyTorch, scikit-learn', where: 'Cardio BP regression models' },
    ],
  },
  {
    bay: 'S1',
    group: 'Integrations & automation',
    items: [
      { name: 'REST APIs, webhooks', where: 'B. Braun engine, JARVIS' },
      { name: 'OAuth2 + token refresh', where: 'Spotify in JARVIS' },
      { name: 'WebSocket services', where: 'the JARVIS daemon' },
      { name: 'Docker', where: 'OS Agent sandbox, Home Assistant' },
      { name: 'SQL / SQLite', where: 'OS Agent decision history' },
    ],
  },
  {
    bay: 'O1',
    group: 'Languages, web & tools',
    items: [
      { name: 'Python', where: 'JARVIS, OS Agent, research tooling' },
      { name: 'TypeScript / JavaScript', where: 'B. Braun engine, this site' },
      { name: 'React, Next.js, Vite', where: 'B. Braun engine, this site' },
      { name: 'C / C++', where: 'Arduino and ESP-32 firmware at Meritus.AI' },
      { name: 'Java', where: 'taught it for two years as a Learning Assistant' },
      { name: 'OpenCV, Pandas, NumPy', where: 'the AquaTag labeling pipeline' },
    ],
  },
]

/* -------------------------------------------------------------------- contact */
export const contact = {
  blurb: 'Graduated May 2026. Open to full-time roles in AI systems, agents and automation — University Park, PA, and open to relocating.',
  email: 'akshitkartikcareers@gmail.com',
  socials: [
    { label: 'GitHub', handle: 'github.com/AKAAKS', url: 'https://github.com/AKAAKS' },
    {
      label: 'LinkedIn',
      handle: 'linkedin.com/in/akshit-kartik',
      url: 'https://www.linkedin.com/in/akshit-kartik-4b2a1825a',
    },
    /* The page claims two papers; this is the link that lets someone verify
     * both without taking its word for it. */
    {
      label: 'ORCID',
      handle: '0009-0001-4353-9503',
      url: 'https://orcid.org/0009-0001-4353-9503',
    },
  ],
}

/* ------------------------------------------------------------------- timeline
 * The truss: the career spine, oldest to newest, port to starboard.
 *
 * The order is checked against the sources, not assumed. Both papers were
 * filed here under a bare '2026' and sorted by guess, and both guesses were
 * wrong: AquaTag is dated 30 Sept 2026 by its DOI, so it lands AFTER the
 * degree rather than before it, and OmniSch went to arXiv on 31 Mar 2026,
 * so it lands before. Dates carry months for that reason.
 * `kind`   role | project | publication | education
 * `key`    true for the plotted emphasis (publications and the degree)
 * `href`   the module holding the detail, so a node is a link not an ornament */
export const timeline = [
  {
    seg: 'S0', kind: 'role', date: 'Jan 2024',
    title: 'Learning Assistant', detail: 'Penn State · to Dec 2025', href: '#experience',
  },
  {
    seg: 'S1', kind: 'role', date: 'Jun 2024',
    title: 'R&D Intern, Robotics', detail: 'Meritus.AI · Chennai', href: '#experience',
  },
  {
    seg: 'S2', kind: 'role', date: 'Jan 2025',
    title: 'Undergraduate Researcher', detail: 'Penn State · to May 2026', href: '#experience',
  },
  {
    seg: 'S3', kind: 'project', date: 'Aug 2025',
    title: 'Parts Procurement Engine', detail: 'B. Braun · to Dec 2025', href: '#projects',
  },
  {
    seg: 'S4', kind: 'project', date: 'Jan 2026',
    title: 'OS Agent', detail: 'Ongoing', href: '#projects',
  },
  {
    seg: 'S5', kind: 'publication', date: 'Mar 2026', key: true,
    title: 'OmniSch', detail: 'arXiv preprint', href: '#publications',
  },
  {
    seg: 'P1', kind: 'project', date: 'Mar 2026',
    title: 'J.A.R.V.I.S.', detail: 'Ongoing', href: '#projects',
  },
  {
    seg: 'P2', kind: 'education', date: 'May 2026', key: true,
    title: 'BS Computer Science', detail: 'Penn State · University Park', href: '#experience',
  },
  {
    seg: 'P3', kind: 'publication', date: 'Sept 2026', key: true,
    title: 'AquaTag', detail: 'Proc. ACM IMWUT', href: '#publications',
  },
  {
    seg: 'P4', kind: 'project', date: '2026',
    title: 'Agentic Labeling Engine', detail: 'LangGraph + human review', href: '#projects',
  },
  {
    seg: 'P5', kind: 'project', date: 'Present',
    title: 'Cardio BP', detail: 'In progress', href: '#projects',
  },
]
