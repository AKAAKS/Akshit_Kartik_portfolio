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
  title: 'AI & automation engineer · applied ML researcher',
  tagline: 'I build AI agents, developer tooling, and the interfaces that sit on top of them.',
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
    title: 'AquaTag: a wearable platform for flexible sensor placement in aquatic sensing',
    venue: 'Proc. ACM IMWUT',
    year: '2026',
    authors: 'Co-author',
    desc: 'Built the IMU-to-video sync tool and the labeling pipeline behind the dataset.',
    ref: { label: 'doi:10.1145/3831639', url: 'https://dl.acm.org/doi/10.1145/3831639' },
  },
  {
    bay: 'O2',
    title: 'OmniSch: a multimodal PCB schematic benchmark for diagram reasoning',
    venue: 'arXiv preprint cs.CV',
    year: '2026',
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
      'Lead weekly recitation for 40+ students in a large-scale Java course.',
      'Review 100+ programming assignments per cycle for correctness and design.',
    ],
  },
]

export const education = {
  bay: 'D1',
  school: 'The Pennsylvania State University',
  place: 'University Park, PA',
  degree: 'BS Computer Science',
  minor: 'Minor in Cybersecurity Computational Foundations',
  gpa: 'GPA 3.56',
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
    metric: '100% test-catalog match',
    desc: 'Production Next.js 15 / React 19 / TypeScript app for a medical-device manufacturer.',
    detail: 'Replaced a weeks-to-months sourcing workflow; per-part search cut to 1–2 minutes.',
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
    metric: '1092 tests',
    desc: 'Claude tool-use loop exposing ~41 tools behind an always-on WebSocket daemon.',
    detail: 'One audited guard blocks prompt-injection self-approval; tiered router holds a hard budget.',
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
    metric: '170 tests',
    desc: 'Python daemon triaging CPU, RAM, GPU and process anomalies via a LangGraph OODA machine.',
    detail: 'Fail-closed approval gate, command allowlisting, protected-PID guards, Docker sandbox.',
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
    desc: 'A LangGraph labeler proposes and a critic reviews; Pydantic V2 validates every record.',
    detail: 'One BaseTool abstraction so a Streamlit UI and a Typer CLI run identical code paths.',
    tags: ['LangGraph', 'Pydantic V2', 'Streamlit', 'Typer'],
    links: {},
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
  blurb: 'Open to roles in AI, automation and applied ML.',
  email: 'akshitkartikcareers@gmail.com',
  socials: [
    { label: 'GitHub', handle: 'github.com/AKAAKS', url: 'https://github.com/AKAAKS' },
    {
      label: 'LinkedIn',
      handle: 'linkedin.com/in/akshit-kartik',
      url: 'https://www.linkedin.com/in/akshit-kartik-4b2a1825a',
    },
  ],
}

/* ------------------------------------------------------------------- timeline
 * The truss: the career spine, oldest to newest, port to starboard.
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
    seg: 'S5', kind: 'project', date: 'Mar 2026',
    title: 'J.A.R.V.I.S.', detail: 'Ongoing', href: '#projects',
  },
  {
    seg: 'P1', kind: 'publication', date: '2026', key: true,
    title: 'AquaTag', detail: 'Proc. ACM IMWUT', href: '#publications',
  },
  {
    seg: 'P2', kind: 'education', date: 'May 2026', key: true,
    title: 'BS Computer Science', detail: 'Penn State · GPA 3.56', href: '#experience',
  },
  {
    seg: 'P3', kind: 'project', date: '2026',
    title: 'Agentic Labeling Engine', detail: 'LangGraph + human review', href: '#projects',
  },
  {
    seg: 'P4', kind: 'publication', date: '2026', key: true,
    title: 'OmniSch', detail: 'arXiv preprint', href: '#publications',
  },
  {
    seg: 'P5', kind: 'project', date: 'Now',
    title: 'Cardio BP', detail: 'In progress', href: '#projects',
  },
]
