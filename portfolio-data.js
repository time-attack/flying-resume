// Portfolio content for Sina Matian's airport departure board.
// Mutate values here to update the board — no other file needs to change.
window.PORTFOLIO_DATA = {
  identity: {
    name: 'SINA MATIAN',
    tagline: 'SECURITY RESEARCHER · CS @ NYU',
    location: 'LAX / NYC',
    email: 'sina@sinamatian.com',
    github: 'time-attack',
    linkedinUrl: 'https://www.linkedin.com/in/sina-matian-b4210238b/',
  },
  sections: [
    {
      id: 'ventures',
      label: 'VENTURES',
      color: '#ed8e2b',
      items: [
        {
          id: 'ven-002',
          flight: 'VEN 002',
          monogram: 'T',
          destination: 'TEFILLIN TIMER · iOS APP',
          subtitle: '30K+ DAU · AP NEWS',
          year: '2024–',
          status: 'LIVE',
          detail: {
            title: 'TEFILLIN TIMER',
            role: 'FOUNDER · iOS APP · DEC 2024–',
            hero: 'assets/screenshots/tefillin-timer-home.png',
            stats: [
              { label: 'USERS', value: '30,000+' },
              { label: 'PRESS', value: '3 OUTLETS' },
            ],
            body: [
              'Built and launched a free iOS app for tracking tefillin wrapping with custom reminders and prayer guides. Solo design, UI/UX, notifications, and backend infrastructure.',
              'Coverage in 3+ major international outlets including AP News, Jerusalem Post, and i24 News.',
            ],
            links: [
              { label: '→ APP STORE', href: '#', primary: true },
              { label: '→ AP NEWS', href: '#' },
              { label: '→ JERUSALEM POST', href: '#' },
            ],
          },
        },
        {
          id: 'ven-001',
          flight: 'VEN 001',
          monogram: 'S',
          destination: 'SENIORSUPPORTAI.ORG · NONPROFIT',
          subtitle: '10 CENTERS · 300+ SENIORS',
          year: '2024–',
          status: 'LIVE',
          detail: {
            title: 'SENIORSUPPORTAI.ORG',
            role: 'FOUNDER · NONPROFIT · DEC 2024–',
            hero: 'assets/screenshots/seniorsupport-home.png',
            stats: [
              { label: 'SENIORS', value: '300+' },
              { label: 'CENTERS', value: '10+' },
              { label: 'VOLUNTEERS', value: '20+' },
              { label: 'CURRICULUM', value: '4 TRACKS' },
            ],
            body: [
              'Founded and scaled a nonprofit to 10+ senior centers across Los Angeles, providing hands-on tech education to 300+ seniors.',
              'Built a 20+ person volunteer and technician team, managing all onboarding, scheduling, and training operations.',
              'Developed 4 curriculum tracks covering iPhone, Android, online safety, and cybersecurity fundamentals. Drove 100% of partnerships, community outreach, and program design with no external funding.',
            ],
            links: [
              { label: '→ SENIORSUPPORTAI.ORG', href: 'https://SeniorSupportAI.org', primary: true },
            ],
          },
        },
      ],
    },
    {
      id: 'engineering',
      label: 'ENGINEERING',
      color: '#29b09e',
      items: [
        {
          id: 'eng-002',
          flight: 'ENG 002',
          monogram: 'W',
          destination: 'WEBUTATION · SOFTWARE ENGINEER',
          subtitle: 'REVERSE ENG · MVP · VC PITCHES INTL',
          year: '2022–24',
          status: 'DONE',
          detail: {
            title: 'WEBUTATION, INC',
            role: 'SOFTWARE ENGINEER · DEC 2022 – DEC 2024',
            hero: 'assets/screenshots/webutation-arch.png',
            stats: [
              { label: 'PLATFORMS REVERSED', value: '8' },
              { label: 'CHAINED NETWORKS', value: '4' },
            ],
            body: [
              'Reverse engineered 8 social media platforms (authentication flows, private APIs, data pipelines) to build a cross-platform content intelligence system spanning 4 networks.',
              'Designed and implemented a chaining architecture that linked reverse-engineered data across 4 separate platforms, enabling unified analysis not possible through official APIs.',
              'Trained AI/ML models to detect harmful content at scale. Lead developer for the MVP; pitched to VC firms internationally including the Middle East. Collaborated directly with founders on architecture and roadmap as the sole founding engineer.',
            ],
            links: [],
          },
        },
        {
          id: 'eng-001',
          flight: 'ENG 001',
          monogram: 'I',
          destination: 'INDEPENDENT SECURITY RESEARCHER',
          subtitle: '10+ DISCLOSURES',
          year: '2023–',
          status: 'NOW',
          detail: {
            title: 'INDEPENDENT SECURITY RESEARCHER',
            role: 'SELF-EMPLOYED · 2023–',
            hero: 'assets/screenshots/research-banner.png',
            stats: [
              { label: 'DISCLOSURES', value: '10+' },
              { label: 'TRACK RECORD', value: '100% RESPONSIBLE' },
            ],
            body: [
              'Independently discovered and responsibly disclosed 10+ security vulnerabilities across platforms including Hinge, VibeCode, and Wix, earning formal acknowledgment from each company.',
              'Identified critical authentication flaws, insecure API endpoints, and logic-bypass vulnerabilities with real-world exploitability.',
              'Toolkit: manual testing, Burp Suite, API fuzzing, reverse engineering. 100% responsible disclosure track record — every finding reported to vendor security teams before any public exposure.',
            ],
            links: [
              { label: '→ SEE WRITEUPS', href: '#bug-003', primary: true },
            ],
          },
        },
      ],
    },
    {
      id: 'research',
      label: 'RESEARCH · RESPONSIBLE DISCLOSURES',
      color: '#c9432f',
      items: [
        {
          id: 'bug-003',
          flight: 'BUG 003',
          monogram: 'H',
          destination: 'HINGE · PAYWALL BYPASS',
          subtitle: 'FULL WRITEUP',
          year: '2024',
          status: 'DISCLOSED',
          detail: {
            title: 'HINGE · PAYWALL BYPASS',
            role: 'RESPONSIBLE DISCLOSURE · 2024',
            hero: 'assets/screenshots/hinge-bypass-1.png',
            stats: [
              { label: 'SEVERITY', value: 'HIGH' },
              { label: 'STATUS', value: 'ACKNOWLEDGED' },
            ],
            body: [
              'Discovered a flaw in Hinge\'s premium paywall that allowed access to gated features without payment. Reported through responsible disclosure; full writeup published.',
            ],
            links: [
              { label: '→ FULL WRITEUP', href: 'blog-hinge-paywall-bypass.html', primary: true },
            ],
          },
        },
        {
          id: 'bug-002',
          flight: 'BUG 002',
          monogram: 'W',
          destination: 'WIX.COM · IDOR',
          subtitle: '',
          year: '2024',
          status: 'DISCLOSED',
          detail: {
            title: 'WIX.COM · IDOR',
            role: 'RESPONSIBLE DISCLOSURE · 2024',
            hero: 'assets/screenshots/wix-idor-1.png',
            stats: [
              { label: 'SEVERITY', value: 'HIGH' },
              { label: 'STATUS', value: 'ACKNOWLEDGED' },
            ],
            body: [
              'Insecure direct object reference (IDOR) on Wix.com that exposed user-scoped data through predictable endpoints. Reported through responsible disclosure.',
            ],
            links: [
              { label: '→ FULL WRITEUP', href: 'blog-wix-idor.html', primary: true },
            ],
          },
        },
        {
          id: 'bug-001',
          flight: 'BUG 001',
          monogram: 'V',
          destination: 'VIBECODE · SSH BYPASS',
          subtitle: '',
          year: '2024',
          status: 'DISCLOSED',
          detail: {
            title: 'VIBECODE · SSH BYPASS',
            role: 'RESPONSIBLE DISCLOSURE · 2024',
            hero: 'assets/screenshots/vibecode-ssh-1.png',
            stats: [
              { label: 'SEVERITY', value: 'CRITICAL' },
              { label: 'STATUS', value: 'ACKNOWLEDGED' },
            ],
            body: [
              'Authentication bypass in the Vibecode app\'s SSH flow allowing unauthorized access. Reported through responsible disclosure.',
            ],
            links: [
              { label: '→ FULL WRITEUP', href: 'blog-vibecode-ssh.html', primary: true },
            ],
          },
        },
      ],
    },
    {
      id: 'education',
      label: 'EDUCATION',
      color: '#4a3b8c',
      items: [
        {
          id: 'edu-003',
          flight: 'EDU 003',
          monogram: 'N',
          destination: 'NYU · COLLEGE OF ARTS & SCIENCE',
          subtitle: 'B.A. COMPUTER SCIENCE',
          year: '→ 2029',
          status: 'NOW',
          detail: {
            title: 'NYU · COLLEGE OF ARTS & SCIENCE',
            role: 'B.A. COMPUTER SCIENCE · CLASS OF 2029',
            hero: 'assets/screenshots/nyu-campus.jpg',
            stats: [],
            body: [
              'Pursuing a B.A. in Computer Science at NYU\'s College of Arts and Science.',
            ],
            links: [
              { label: '→ NYU CAS', href: 'https://cas.nyu.edu', primary: true },
            ],
          },
        },
        {
          id: 'edu-002',
          flight: 'EDU 002',
          monogram: 'S',
          destination: 'SMC / PIERCE · ADV JAVA & C++',
          subtitle: '4.0 GPA · DEAN\'S LIST',
          year: '2024',
          status: 'DONE',
          detail: {
            title: 'SANTA MONICA COLLEGE / LA PIERCE COLLEGE',
            role: 'ADVANCED JAVA & C++ COURSEWORK · 2024',
            hero: '',
            stats: [
              { label: 'GPA', value: '4.0' },
              { label: 'HONOR', value: 'DEAN\'S LIST' },
            ],
            body: [
              'Completed advanced Java and C++ coursework with a 4.0 GPA. Named to the Dean\'s List.',
            ],
            links: [],
          },
        },
        {
          id: 'edu-001',
          flight: 'EDU 001',
          monogram: 'C',
          destination: 'CALABASAS HIGH SCHOOL',
          subtitle: '',
          year: '2023',
          status: 'DONE',
          detail: {
            title: 'CALABASAS HIGH SCHOOL',
            role: 'GRADUATED · 2023',
            hero: '',
            stats: [],
            body: [
              'Graduated from Calabasas High School in 2023.',
            ],
            links: [],
          },
        },
      ],
    },
    {
      id: 'work',
      label: 'ALSO ON THE LOG',
      color: '#f4eed8',
      muted: true,
      items: [
        {
          id: 'wrk-002',
          flight: 'WRK 002',
          monogram: 'SB',
          destination: 'STARBUCKS · BARISTA',
          subtitle: '',
          year: '2024',
          status: '8 MOS',
          detail: {
            title: 'STARBUCKS',
            role: 'BARISTA · MAY 2024 – DEC 2024',
            hero: '',
            stats: [],
            body: [
              'Full-time barista at Starbucks. Inventory and customer service.',
            ],
            links: [],
          },
        },
        {
          id: 'wrk-001',
          flight: 'WRK 001',
          monogram: 'SL',
          destination: 'SLOAN\'S ICE CREAM · FOOD VENDOR',
          subtitle: '',
          year: '2022–23',
          status: '18 MOS',
          detail: {
            title: 'SLOAN\'S ICE CREAM LLC',
            role: 'FOOD VENDOR · JUL 2022 – DEC 2023',
            hero: '',
            stats: [],
            body: [
              'Part-time food vendor at Sloan\'s Ice Cream LLC.',
            ],
            links: [],
          },
        },
      ],
    },
  ],
};
