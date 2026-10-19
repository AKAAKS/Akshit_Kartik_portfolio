/* =============================================================================
 *  EDIT THIS FILE. It is the single source of all text and links on the site.
 *
 *  To swap your resume: drop your PDF into  public/  and set `resumeUrl`
 *  (currently "/resume.pdf").
 * ========================================================================== */

export const profile = {
  // Shown large in the hero
  name: 'Akshit Kartik',
  // Short role line under the name
  title: 'AI & Automation Engineer · Applied ML Researcher',
  // The "J.A.R.V.I.S. greeting" tagline (one sentence)
  tagline:
    'I build AI agents, developer tooling, and the interfaces that sit on top of them.',
  // Where the "Download Resume" button points (file lives in public/)
  resumeUrl: '/resume.pdf',
  // Codename shown in the status bar (keep it short/uppercase)
  codename: 'AKAAKS',
}

export const about = {
  // A paragraph or two about you. Keep it punchy.
  body: [
    'I’m a developer working across AI agents, automation, and interface design. Lately that has meant a voice assistant that runs my home, a Windows optimization daemon, and applied ML research.',
    'I like building the whole thing, from the models and signal processing underneath to the UI people actually touch.',
  ],
  // Quick "status" stat readouts (edit freely)
  stats: [
    { label: 'Focus', value: 'AI · Automation · UI' },
    { label: 'Status', value: 'Open to opportunities' },
    { label: 'Publications', value: '2 · 2026' },
  ],
}

// Skill groups → each skill has a 0–100 "power level" for the HUD meter.
export const skills = [
  {
    group: 'Languages',
    items: [
      { name: 'Python', level: 95 },
      { name: 'JavaScript / TypeScript', level: 88 },
      { name: 'Java', level: 80 },
      { name: 'C / C++', level: 70 },
      { name: 'Bash Scripting', level: 65 }
    ],
  },
  {
    group: 'AI / ML',
    items: [
      { name: 'LLM agents & tool-use', level: 92 },
      { name: 'PyTorch / scikit-learn', level: 80 },
      { name: 'TensorFlow / Keras', level: 78 },
      { name: 'Open CV', level: 75 },
      { name: 'LangGraph', level: 70 }      
    ],
  },
  {
    group: 'Platforms',
    items: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'React / Vite', level: 85 },
      { name: 'ChromaDB', level: 80 },
      { name: 'Docker / Home Assistant', level: 75 },
      { name: 'REST API', level: 70 }
    ],
  },
]

/* Projects, split into CURRENT (in progress) and COMPLETED.
 * Each project: { code, name, summary, tags, status?, links? }
 * Omit `links` (or leave {}) for a project with nothing to link yet. */
export const projects = {
  current: [
    {
      code: 'PRJ-01',
      name: 'Cardio BP: Cuffless Blood Pressure',
      summary:
        'Estimating blood pressure from PPG and related physiological signals, without a cuff. It cleans the raw waveforms, pulls out pulse-shape and timing features (like pulse transit time), and runs them through ML regression models to predict the systolic and diastolic numbers, with an agentic layer tying the stages together. Not published yet; the paper is in progress.',
      tags: ['PPG / biosignals', 'Signal processing', 'Agentic AI', 'Python'],
      status: 'In progress · unpublished',
      links: {},
    },
  ],
  completed: [
    {
      code: 'PRJ-02',
      name: 'J.A.R.V.I.S. Personal Assistant',
      summary:
        'A voice and text assistant built on Claude’s tool-use loop. It turns a plain request into the right tool calls across Home Assistant (lights, climate, scenes), Spotify, the TV, and the PC. The streaming voice supports barge-in, so you can cut in mid-sentence, and you can dial its tone up or down.',
      tags: ['Claude tool-use', 'Voice / TTS', 'Home Assistant', 'Python'],
      links: {
        site: 'https://jarvis-landing-sooty.vercel.app/',
        repo: 'https://github.com/AKAAKS/personal-assistant',
      },
    },
    {
      code: 'PRJ-03',
      name: 'OS Agent',
      summary:
        'A Windows background daemon that uses an LLM to watch the machine and suggest or apply optimizations. A telemetry kernel collects and normalizes process, service, and resource data into model context; the agent returns concrete, reviewable actions. 163 tests passing.',
      tags: ['Windows daemon', 'LLM', 'Telemetry', 'Python'],
      links: {
        site: 'https://os-agent-landing.vercel.app/',
        repo: 'https://github.com/AKAAKS/OS_agent',
      },
    },
    {
      code: 'PRJ-04',
      name: 'PROPS: Possible Replacements for Obsolete Parts',
      summary:
        'Senior-year capstone with a team of six. An AI-assisted web app that helps engineering and procurement teams find viable substitutes for obsolete or discontinued parts: search a part, get candidate replacements to evaluate. Built in Next.js and deployed on Vercel.',
      tags: ['Next.js', 'AI search', 'Team capstone', 'Vercel'],
      // Live demo omitted on purpose: its sign-in page exposes test credentials.
      links: { repo: 'https://github.com/AadhityaT/capstone-ai-website-app' },
    },
  ],
}

// Research & publications. Add an optional `blurb` for a one-line description.
export const research = {
  intro: 'Papers I’ve co-authored.',
  papers: [
    {
      title:
        'OmniSch: A Multimodal PCB Schematic Benchmark for Structured Diagram Visual Reasoning',
      venue: 'arXiv preprint (cs.CV)',
      year: '2026',
      blurb:
        'A benchmark for how well multimodal models can read PCB schematics: parsing the symbols, nets, and connectivity, then reasoning over the whole diagram.',
      link: 'https://arxiv.org/abs/2604.00270',
    },
    {
      title:
        'AquaTag: An Open-Source Wearable Platform Enabling Flexible Sensor Placement for Aquatic Sensing',
      venue: 'Proc. ACM IMWUT',
      year: '2026',
      blurb:
        'An open-source wearable platform for aquatic sensing, built so sensors can be placed flexibly on the body for in-water activity and physiological monitoring.',
      link: 'https://dl.acm.org/doi/10.1145/3831639',
    },
  ],
}

export const contact = {
  blurb: 'Got a project or a role in mind? Send me a message.',
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

// Nav links in the status bar (label → section id)
export const nav = [
  { label: 'HOME', id: 'home' },
  { label: 'ABOUT', id: 'about' },
  { label: 'SKILLS', id: 'skills' },
  { label: 'PROJECTS', id: 'projects' },
  { label: 'RESEARCH', id: 'research' },
  { label: 'CONTACT', id: 'contact' },
]
