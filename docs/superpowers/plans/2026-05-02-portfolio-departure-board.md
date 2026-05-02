# Portfolio Departure Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing LAX 3D scene so that pressing Enter (or clicking the airplane) runs the takeoff sequence and reveals a personal-portfolio "Departure Board" — a resume rendered as airport flight rows. Each row opens a detail panel with logos, screenshots, and links.

**Architecture:** All UI is added inside the existing `index.html` as overlay layers on top of the Three.js canvas. A small state machine (`AIRPORT` ↔ `BOARD` ↔ `DETAIL`) toggles the `body` class. Resume content lives in a separate `portfolio-data.js` module that the renderer reads at runtime. The 3D animation loop pauses while the board is visible. Two new writeup pages (Wix, Vibecode) mirror the existing `blog-hinge-paywall-bypass.html` format.

**Tech Stack:** Plain HTML / CSS / JS (no framework), Three.js (already loaded), CSS2DRenderer (already loaded). No build tools, no test framework. Verification is performed against the running preview server (`python3 -m http.server 4731`, configured via `.claude/launch.json`) using the `preview_*` MCP tools.

**Verification approach:** Because there is no test framework, every task ends with a "Verify in preview" step that uses one or more of `preview_screenshot`, `preview_eval`, `preview_console_logs`, or `preview_inspect`. Treat a clean preview render with no console errors as the green-test signal.

**Spec:** [docs/superpowers/specs/2026-05-02-portfolio-departure-board-design.md](../specs/2026-05-02-portfolio-departure-board-design.md)

---

## File Structure

**Created:**
- `portfolio-data.js` — single source of truth for all resume content (sections, rows, detail-panel copy, asset paths). Loaded as a `<script>` before the main module.
- `assets/logos/` — directory of SVG/PNG logos (NYU, Hinge, Wix, AP News, etc.). Populated incrementally; missing files degrade to monogram.
- `assets/screenshots/` — directory of PNG/JPG screenshots (Tefillin Timer screens, Hinge bypass GIF, etc.). Same incremental policy.
- `blog-wix-idor.html` — long-form writeup, mirrors `blog-hinge-paywall-bypass.html`.
- `blog-vibecode-ssh.html` — long-form writeup, same format.

**Modified:**
- `index.html`:
  - `<head>` — add a `<style>` block for the board, detail panel, and ambient plane animations.
  - `<body>` inside `#app` — add `<div id="board">` and `<div id="detail-panel">` as new sibling overlays.
  - Existing `<script src="osm_lax_data.js">` block — add `<script src="portfolio-data.js">` immediately after.
  - Inside the existing module `<script type="module">` — add board renderer, detail-panel renderer, state-machine helpers, transition wiring, and event listeners. Hook into the existing `updateMapFX` ascent-complete moment to show the board.

**Untouched:**
- `osm_lax_data.js` — pure data, unchanged.
- `blog.html`, `blog-hinge-paywall-bypass.html` — unchanged. (The Hinge writeup is linked from the new detail panel; new Wix/Vibecode writeups are clones of its layout.)

---

## Conventions used throughout

- **Existing CSS variables / colors** — reuse the palette from index.html: `#0a0908`, `#141311` (background), `#f4eed8` (foreground), `#ed8e2b` (orange accent), `#29b09e` (teal), `#c9432f` (red), `#4a3b8c` (purple). Do not introduce new colors.
- **Fonts** — `'Syne'` for big headlines, `'JetBrains Mono'` for everything else. Both already imported in `<head>`.
- **Verification screenshots** — when capturing one, save to disk via `save_to_disk: true` so it can be attached to the response if needed. The preview server runs at `http://localhost:4731`.

---

## Task 1: Create the portfolio data module

**Files:**
- Create: `portfolio-data.js`

This is the single source of truth for all resume content. Every later task reads from it. Defining it first means the renderer in Task 3 has real data to work against.

- [ ] **Step 1: Create the file with the full PORTFOLIO_DATA object**

Create `portfolio-data.js` with exactly this content:

```javascript
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
```

- [ ] **Step 2: Verify the file parses cleanly**

Run: `node -e "require('./portfolio-data.js')"` from the project root.
Expected: errors out with `ReferenceError: window is not defined` (because the module sets `window.PORTFOLIO_DATA` and Node has no `window`). That's the expected outcome — it means the JavaScript itself is syntactically valid.

If you see a `SyntaxError` instead, fix the typo and re-run.

- [ ] **Step 3: Commit**

```bash
git add portfolio-data.js
git commit -m "Add portfolio data module for departure board"
```

---

## Task 2: Wire portfolio-data.js into index.html and add board container CSS

**Files:**
- Modify: `index.html` (add `<script>` tag near other data scripts, add `<style>` rules near end of existing `<style>` block)

This loads the data module and lays the visual foundation: a dark-themed board container that becomes visible when `body.board-view` is set.

- [ ] **Step 1: Locate the existing `<script src="osm_lax_data.js"></script>` tag**

Run: `grep -n 'osm_lax_data.js' index.html`
Expected output: a single line like `1072:<script src="osm_lax_data.js"></script>`

- [ ] **Step 2: Insert the portfolio-data.js script tag immediately after**

Edit `index.html`. Find:

```html
<script src="osm_lax_data.js"></script>
```

Replace with:

```html
<script src="osm_lax_data.js"></script>
<script src="portfolio-data.js"></script>
```

- [ ] **Step 3: Add board container CSS**

Find the closing `</style>` tag of the main `<head>` style block (it appears just before `</head>`). Run `grep -n '^</style>' index.html` to find the line number.

Insert the following block immediately *before* the closing `</style>`:

```css
/* ═══════════════════════════════════════════════
   PORTFOLIO DEPARTURE BOARD
   ═══════════════════════════════════════════════ */
#board {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: #0a0908;
  color: #f4eed8;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  overflow-y: auto;
  display: none;
  opacity: 0;
  transition: opacity .4s ease;
}
body.board-view #board {
  display: block;
  opacity: 1;
}
body.board-view #canvas,
body.board-view #labels,
body.board-view .header,
body.board-view .legend,
body.board-view .compass,
body.board-view .presets,
body.board-view .site-nav,
body.board-view #mapTitle,
body.board-view .pov-plate,
body.board-view #exitPovBtn,
body.board-view #tutorial {
  display: none !important;
}

#board .board-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 48px 80px;
}
```

- [ ] **Step 4: Verify in preview**

The preview server is already running at port 4731. Reload the page via:

```
preview_eval(serverId, "window.location.reload(); 'reloaded'")
```

Then trigger the board temporarily for visual check:

```
preview_eval(serverId, "document.body.classList.add('board-view'); 'board-on'")
```

Take a screenshot. Expected: the 3D scene is fully hidden behind a near-black `#0a0908` background. There is no visible board content yet — that's correct, only the container is wired.

Reset:

```
preview_eval(serverId, "document.body.classList.remove('board-view'); 'board-off'")
```

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Wire portfolio-data.js and add board container CSS"
```

---

## Task 3: Render the board header strip from PORTFOLIO_DATA

**Files:**
- Modify: `index.html` (add markup, add CSS, add JS in the existing `<script type="module">`)

The header is the top of the board: `← KLAX` return button on the far left, "DEPARTURES · KLAX" mini-label, the wordmark, the tagline, and the contact strip on the right. The ambient cruising plane glyph drifts across the strip.

- [ ] **Step 1: Add the board markup as a sibling of `#labels`**

Find the line `<div id="labels"></div>` in `index.html`. Insert immediately after:

```html
  <!-- Portfolio departure board overlay (hidden until takeoff completes) -->
  <div id="board">
    <div class="board-inner">
      <header class="board-header">
        <button class="board-back" id="boardBack" aria-label="Return to LAX">← KLAX</button>
        <div class="board-header__left">
          <div class="board-header__pre">▸ DEPARTURES · KLAX</div>
          <div class="board-header__name" id="boardName"></div>
          <div class="board-header__tag" id="boardTagline"></div>
        </div>
        <div class="board-header__right">
          <span id="boardLocation"></span><br>
          <span id="boardEmail"></span><br>
          <span id="boardSocial"></span>
        </div>
        <div class="board-header__plane" aria-hidden="true">✈</div>
      </header>
      <div id="boardSections"></div>
    </div>
  </div>
```

- [ ] **Step 2: Add CSS for the header**

Inside the same `<style>` block where Task 2 added rules, append:

```css
.board-header {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: flex-start;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(244, 238, 216, .12);
  margin-bottom: 22px;
}
.board-header__pre {
  font-size: 9px;
  letter-spacing: .35em;
  color: rgba(244, 238, 216, .5);
  margin-bottom: 6px;
}
.board-header__name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 32px;
  letter-spacing: -.02em;
  line-height: 1;
}
.board-header__tag {
  font-size: 11px;
  letter-spacing: .18em;
  opacity: .65;
  margin-top: 5px;
  text-transform: uppercase;
}
.board-header__right {
  text-align: right;
  font-size: 10px;
  letter-spacing: .18em;
  opacity: .6;
  line-height: 1.7;
}
.board-header__plane {
  position: absolute;
  top: 4px;
  right: 240px;
  font-size: 14px;
  color: #ed8e2b;
  opacity: .55;
  animation: ambientCruise 14s linear infinite;
}
@keyframes ambientCruise {
  0%   { transform: translateX(-120px); opacity: 0; }
  10%  { opacity: .55; }
  90%  { opacity: .55; }
  100% { transform: translateX(120px); opacity: 0; }
}
.board-back {
  position: absolute;
  top: -32px;
  left: 0;
  background: transparent;
  border: 1px solid rgba(244, 238, 216, .25);
  color: #f4eed8;
  font-family: inherit;
  font-size: 10px;
  letter-spacing: .25em;
  padding: 6px 12px;
  cursor: pointer;
  text-transform: uppercase;
}
.board-back:hover {
  border-color: #ed8e2b;
  color: #ed8e2b;
}
```

- [ ] **Step 3: Add JS to populate the header**

Find the existing `<script type="module">` block (`grep -n 'script type="module"' index.html`). Just before its closing `</script>`, insert:

```javascript
/* ═══════════════════════════════════════════════
   PORTFOLIO BOARD — RENDERER
   ═══════════════════════════════════════════════ */
function renderBoardHeader() {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const i = data.identity;
  document.getElementById('boardName').textContent = i.name;
  document.getElementById('boardTagline').textContent = i.tagline;
  document.getElementById('boardLocation').textContent = i.location;
  const email = document.getElementById('boardEmail');
  email.textContent = i.email.toUpperCase();
  document.getElementById('boardSocial').textContent =
    `GH: ${i.github.toUpperCase()} · LINKEDIN`;
}
renderBoardHeader();
```

- [ ] **Step 4: Verify in preview**

Reload, then enable the board:

```
preview_eval(serverId, "document.body.classList.add('board-view'); 'on'")
```

Screenshot. Expected: the dark board fills the screen, the `← KLAX` button is at top-left, "SINA MATIAN" wordmark in the upper-left, "SECURITY RESEARCHER · CS @ NYU" beneath it, and the right column shows location / email / GH+LinkedIn. The orange ✈ glyph drifts horizontally near the top-right (allow ~14 s for one full cycle).

Reset:

```
preview_eval(serverId, "document.body.classList.remove('board-view'); 'off'")
```

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Render board header strip from PORTFOLIO_DATA"
```

---

## Task 4: Render board sections and rows

**Files:**
- Modify: `index.html` (add CSS, extend the renderer JS)

Each section gets a colored mini-label, then a list of rows. Each row has a 28 px monogram tile, the flight code, the destination text + faded subtitle, and the year.

- [ ] **Step 1: Add row/section CSS**

Append to the `<style>` block (after the header rules from Task 3):

```css
.board-section {
  margin-top: 22px;
}
.board-section__label {
  font-size: 8px;
  letter-spacing: .3em;
  margin: 0 0 6px;
}
.board-section__cols {
  display: grid;
  grid-template-columns: 34px 76px 1fr 70px;
  gap: 12px;
  font-size: 8px;
  letter-spacing: .25em;
  color: rgba(244, 238, 216, .4);
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(244, 238, 216, .08);
  margin-bottom: 6px;
}
.board-row {
  display: grid;
  grid-template-columns: 34px 76px 1fr 70px;
  gap: 12px;
  align-items: center;
  font-size: 11px;
  padding: 7px 6px 7px 0;
  border-bottom: 1px solid var(--row-color, rgba(244, 238, 216, .08));
  cursor: pointer;
  transition: background .18s ease;
}
.board-row:hover {
  background: rgba(244, 238, 216, .04);
}
.board-row.is-headline {
  background: var(--row-bg, rgba(237, 142, 43, .06));
  border-left: 2px solid var(--row-color, #ed8e2b);
  padding-left: 6px;
}
.board-row__monogram {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}
.board-row__monogram.solid {
  color: #141311;
  background: var(--row-color, #ed8e2b);
}
.board-row__monogram.outlined {
  color: var(--row-color, #ed8e2b);
  border: 1.5px solid var(--row-color, #ed8e2b);
  background: transparent;
}
.board-row__monogram.dashed {
  color: rgba(244, 238, 216, .5);
  border: 1px dashed rgba(244, 238, 216, .4);
  background: transparent;
}
.board-row__flight {
  color: var(--row-color, #ed8e2b);
  font-weight: 700;
}
.board-row__dest .sub {
  opacity: .55;
  margin-left: 6px;
}
.board-row__year {
  opacity: .7;
}
.board-section.is-muted {
  margin-top: 26px;
}
.board-section.is-muted .board-section__label {
  color: rgba(244, 238, 216, .35);
}
.board-section.is-muted .board-row {
  opacity: .6;
}
```

- [ ] **Step 2: Extend the renderer JS**

In the same `<script type="module">` block, immediately after the `renderBoardHeader();` call from Task 3, add:

```javascript
function renderBoardSections() {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const root = document.getElementById('boardSections');
  root.innerHTML = '';

  for (const section of data.sections) {
    const sec = document.createElement('section');
    sec.className = 'board-section' + (section.muted ? ' is-muted' : '');

    const label = document.createElement('div');
    label.className = 'board-section__label';
    label.style.color = section.color;
    label.textContent = '▸ ' + section.label;
    sec.appendChild(label);

    const cols = document.createElement('div');
    cols.className = 'board-section__cols';
    cols.innerHTML = `<span></span><span>FLIGHT</span><span>DESTINATION</span><span>YEAR</span>`;
    sec.appendChild(cols);

    section.items.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'board-row';
      row.dataset.id = item.id;
      row.style.setProperty('--row-color', section.color);
      row.style.setProperty('--row-bg', hexToRgba(section.color, 0.06));
      const isHeadline = i === 0 && !section.muted;
      if (isHeadline) row.classList.add('is-headline');

      const mono = document.createElement('div');
      mono.className = 'board-row__monogram '
        + (section.muted ? 'dashed' : (isHeadline ? 'solid' : 'outlined'));
      mono.textContent = item.monogram;
      row.appendChild(mono);

      const flight = document.createElement('span');
      flight.className = 'board-row__flight';
      flight.textContent = item.flight;
      row.appendChild(flight);

      const dest = document.createElement('span');
      dest.className = 'board-row__dest';
      dest.innerHTML = item.subtitle
        ? `${item.destination} <span class="sub">— ${item.subtitle}</span>`
        : item.destination;
      row.appendChild(dest);

      const year = document.createElement('span');
      year.className = 'board-row__year';
      year.textContent = item.year;
      row.appendChild(year);

      sec.appendChild(row);
    });

    root.appendChild(sec);
  }
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

renderBoardSections();
```

- [ ] **Step 3: Verify in preview**

Reload and toggle the board on:

```
preview_eval(serverId, "window.location.reload(); 'reloading'")
```

Wait ~3 seconds, then:

```
preview_eval(serverId, "document.body.classList.add('board-view'); 'on'")
```

Screenshot. Expected: 5 sections rendered top-down (Ventures → Engineering → Research → Education → Also On The Log). Tefillin Timer, Webutation, Hinge, NYU, and Starbucks each appear as the first row in their section with a solid monogram + colored left border. Subsequent rows in each section use outlined monograms. The dimmed `ALSO ON THE LOG` section sits at the bottom at reduced opacity.

Check console for errors:

```
preview_console_logs(serverId, level: "error")
```

Expected: empty (no errors).

Reset:

```
preview_eval(serverId, "document.body.classList.remove('board-view'); 'off'")
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Render board sections and rows from data"
```

---

## Task 5: Add detail panel CSS shell

**Files:**
- Modify: `index.html` (CSS only, no JS yet)

Set up the slide-in panel that will appear when a row is clicked. This task only adds the CSS so we can verify the panel renders correctly when toggled on; content rendering comes in Task 6.

- [ ] **Step 1: Add panel markup as a sibling of `#board`**

In `index.html`, immediately after the closing `</div>` of `#board` (the outer `<div id="board">`), insert:

```html
  <!-- Detail panel for a clicked board row -->
  <aside id="detail-panel" aria-hidden="true">
    <button class="detail-panel__close" id="detailClose" aria-label="Close">✕</button>
    <div class="detail-panel__inner" id="detailInner"></div>
  </aside>
```

- [ ] **Step 2: Add panel CSS**

Append to the `<style>` block:

```css
#detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 45%;
  min-width: 420px;
  max-width: 640px;
  background: #141311;
  border-left: 1px solid rgba(237, 142, 43, .25);
  color: #f4eed8;
  z-index: 40;
  transform: translateX(100%);
  transition: transform .35s cubic-bezier(.2, .8, .2, 1);
  overflow-y: auto;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  display: none;
}
body.detail-open #detail-panel {
  display: block;
  transform: translateX(0);
}
.detail-panel__inner {
  padding: 32px 28px 56px;
  font-size: 11px;
}
.detail-panel__close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: 1px solid rgba(244, 238, 216, .25);
  color: #f4eed8;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  z-index: 1;
}
.detail-panel__close:hover {
  border-color: #ed8e2b;
  color: #ed8e2b;
}
.detail-panel__pre {
  font-size: 9px;
  letter-spacing: .3em;
  color: rgba(244, 238, 216, .4);
  margin-bottom: 12px;
}
.detail-panel__head {
  display: flex;
  gap: 14px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(244, 238, 216, .1);
  margin-bottom: 18px;
}
.detail-panel__monogram {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 24px;
  flex-shrink: 0;
  color: #141311;
}
.detail-panel__title {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -.01em;
}
.detail-panel__role {
  opacity: .65;
  font-size: 10px;
  letter-spacing: .12em;
  margin-top: 4px;
  text-transform: uppercase;
}
.detail-panel__hero {
  aspect-ratio: 16 / 9;
  border-radius: 3px;
  margin-bottom: 18px;
  background-size: cover;
  background-position: center;
  background-color: #1a1410;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-panel__hero.is-placeholder {
  background-image: linear-gradient(135deg, #1a1410 0%, #3a2818 50%, #5a3a20 100%);
  font-size: 9px;
  letter-spacing: .3em;
  color: rgba(244, 238, 216, .4);
}
.detail-panel__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 18px;
}
.detail-panel__stat {
  padding: 10px;
  background: rgba(237, 142, 43, .08);
  border-left: 2px solid #ed8e2b;
}
.detail-panel__stat-label {
  opacity: .5;
  letter-spacing: .2em;
  font-size: 8px;
  text-transform: uppercase;
}
.detail-panel__stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #ed8e2b;
  margin-top: 2px;
}
.detail-panel__body p {
  line-height: 1.6;
  opacity: .85;
  margin-bottom: 10px;
}
.detail-panel__links {
  margin-top: 18px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 9px;
  letter-spacing: .15em;
}
.detail-panel__links a {
  padding: 6px 10px;
  border: 1px solid rgba(244, 238, 216, .2);
  color: rgba(244, 238, 216, .75);
  text-decoration: none;
  text-transform: uppercase;
}
.detail-panel__links a.is-primary {
  border-color: rgba(237, 142, 43, .4);
  color: #ed8e2b;
}
.detail-panel__links a:hover {
  border-color: #ed8e2b;
  color: #ed8e2b;
}
```

- [ ] **Step 3: Verify in preview**

Reload, then turn the board AND detail panel on with stub content:

```
preview_eval(serverId, "document.body.classList.add('board-view','detail-open'); document.getElementById('detailInner').innerHTML = '<div class=\"detail-panel__pre\">▸ TEST</div><div class=\"detail-panel__head\"><div class=\"detail-panel__monogram\" style=\"background:#ed8e2b\">T</div><div><div class=\"detail-panel__title\">PANEL SHELL TEST</div><div class=\"detail-panel__role\">VERIFICATION</div></div></div><div class=\"detail-panel__hero is-placeholder\">[ HERO PLACEHOLDER ]</div>'; 'on'")
```

Screenshot. Expected: the right ~45% of the screen shows a darker `#141311` panel sliding in from the right edge, with a close button (✕) top-right, "▸ TEST" header, an orange monogram T, "PANEL SHELL TEST" title, and a gradient hero placeholder strip. The board is still visible underneath on the left.

Reset:

```
preview_eval(serverId, "document.body.classList.remove('board-view','detail-open'); 'off'")
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add detail panel CSS shell"
```

---

## Task 6: Render detail panel content from data + wire row clicks

**Files:**
- Modify: `index.html` (extend the renderer JS)

Add `renderDetail(itemId)` that pulls the row's data, builds the panel content, and shows it. Wire up click listeners on every row.

- [ ] **Step 1: Add the detail renderer + wiring**

Inside the same `<script type="module">` block, after the `renderBoardSections();` call from Task 4, append:

```javascript
function findItemById(id) {
  for (const section of window.PORTFOLIO_DATA.sections) {
    const found = section.items.find(it => it.id === id);
    if (found) return { item: found, section };
  }
  return null;
}

function renderDetail(itemId) {
  const found = findItemById(itemId);
  if (!found) return;
  const { item, section } = found;
  const d = item.detail;

  const stats = (d.stats || []).map(s => `
    <div class="detail-panel__stat" style="border-left-color:${section.color};background:${hexToRgba(section.color, 0.08)}">
      <div class="detail-panel__stat-label">${s.label}</div>
      <div class="detail-panel__stat-value" style="color:${section.color}">${s.value}</div>
    </div>
  `).join('');

  const links = (d.links || []).map(l => `
    <a href="${l.href}" class="${l.primary ? 'is-primary' : ''}"
       ${l.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${l.label}</a>
  `).join('');

  const heroStyle = d.hero
    ? `background-image:url('${d.hero}')`
    : '';
  const heroClass = d.hero ? '' : 'is-placeholder';
  const heroContent = d.hero ? '' : '[ ASSET PENDING ]';

  document.getElementById('detailInner').innerHTML = `
    <div class="detail-panel__pre">▸ FLIGHT ${item.flight} · NOW BOARDING</div>
    <div class="detail-panel__head">
      <div class="detail-panel__monogram" style="background:${section.color}">${item.monogram}</div>
      <div>
        <div class="detail-panel__title">${d.title}</div>
        <div class="detail-panel__role">${d.role}</div>
      </div>
    </div>
    <div class="detail-panel__hero ${heroClass}" style="${heroStyle}">${heroContent}</div>
    ${stats ? `<div class="detail-panel__stats">${stats}</div>` : ''}
    <div class="detail-panel__body">
      ${(d.body || []).map(p => `<p>${p}</p>`).join('')}
    </div>
    ${links ? `<div class="detail-panel__links">${links}</div>` : ''}
  `;
  document.body.classList.add('detail-open');
  document.getElementById('detail-panel').setAttribute('aria-hidden', 'false');
}

function closeDetail() {
  document.body.classList.remove('detail-open');
  document.getElementById('detail-panel').setAttribute('aria-hidden', 'true');
}

// Delegated click handler for all rows (covers both initial render and any future re-renders)
document.getElementById('boardSections').addEventListener('click', e => {
  const row = e.target.closest('.board-row');
  if (row && row.dataset.id) renderDetail(row.dataset.id);
});

document.getElementById('detailClose').addEventListener('click', closeDetail);
```

- [ ] **Step 2: Verify in preview**

Reload, enable board, then programmatically click the first row (Tefillin Timer):

```
preview_eval(serverId, "document.body.classList.add('board-view'); document.querySelector('[data-id=\"ven-002\"]').click(); 'clicked'")
```

Screenshot. Expected: the right-side panel slides in showing "▸ FLIGHT VEN 002 · NOW BOARDING" header, a 48 px orange T monogram, "TEFILLIN TIMER" title, "FOUNDER · iOS APP · DEC 2024–" role line, a gradient hero placeholder labeled `[ ASSET PENDING ]`, two stat tiles (USERS 30,000+ / PRESS 3 OUTLETS), three paragraphs of body copy, and three link buttons (App Store, AP News, Jerusalem Post).

Programmatically close:

```
preview_eval(serverId, "document.getElementById('detailClose').click(); 'closed'")
```

Screenshot. Expected: panel slides back off-screen to the right; board fully visible again.

Console check:

```
preview_console_logs(serverId, level: "error")
```

Expected: empty.

Reset:

```
preview_eval(serverId, "document.body.classList.remove('board-view'); 'off'")
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Render detail panel from data and wire row clicks"
```

---

## Task 7: Add additional close behaviors (outside-click, Escape, row-switch)

**Files:**
- Modify: `index.html` (extend JS only)

The panel must close when the user clicks outside it, presses Escape, or clicks another row (in which case it transitions content rather than closing).

- [ ] **Step 1: Add the listeners**

Append after the `detailClose` listener registered in Task 6:

```javascript
// Esc closes the panel
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.body.classList.contains('detail-open')) {
    closeDetail();
  }
});

// Click outside the panel (but inside the board) closes it.
document.getElementById('board').addEventListener('click', e => {
  if (!document.body.classList.contains('detail-open')) return;
  const panel = document.getElementById('detail-panel');
  if (panel.contains(e.target)) return;
  if (e.target.closest('.board-row')) return; // row click is handled separately, not a "close" click
  closeDetail();
});
```

Note: clicking another row already triggers `renderDetail` from Task 6 — that overwrites the panel content while the body class stays `detail-open`, producing the desired "switch row" behavior with no extra code.

- [ ] **Step 2: Verify in preview**

Reload, enable board, open a panel, then test Esc:

```
preview_eval(serverId, "document.body.classList.add('board-view'); document.querySelector('[data-id=\"ven-002\"]').click(); 'opened'")
```

Then:

```
preview_eval(serverId, "document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); document.body.classList.contains('detail-open')")
```

Expected return value: `false`.

Re-open and test row-switch:

```
preview_eval(serverId, "document.querySelector('[data-id=\"ven-002\"]').click(); document.querySelector('[data-id=\"bug-003\"]').click(); document.querySelector('.detail-panel__title').textContent")
```

Expected return: `"HINGE · PAYWALL BYPASS"`.

Test outside-click closes:

```
preview_eval(serverId, "document.querySelector('[data-id=\"ven-002\"]').click(); document.querySelector('.board-header__name').click(); document.body.classList.contains('detail-open')")
```

Expected return: `false`.

Reset:

```
preview_eval(serverId, "document.body.classList.remove('board-view'); 'off'")
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add Esc, outside-click, and row-switch close behaviors"
```

---

## Task 8: Add the airport ↔ board state machine

**Files:**
- Modify: `index.html` (extend JS only)

A small state machine handles `AIRPORT` ↔ `BOARD` transitions, pauses the 3D render loop while the board is up, and gives the rest of the codebase a single function (`setMode('airport' | 'board')`) to flip between them.

- [ ] **Step 1: Add state machine helpers**

Append in the `<script type="module">` block, after the close-handler block from Task 7:

```javascript
/* ═══════════════════════════════════════════════
   PORTFOLIO STATE MACHINE
   ═══════════════════════════════════════════════ */
let portfolioMode = 'airport';
let renderLoopPaused = false;

function setMode(mode) {
  portfolioMode = mode;
  if (mode === 'board') {
    document.body.classList.add('board-view');
    renderLoopPaused = true;
  } else {
    document.body.classList.remove('board-view');
    document.body.classList.remove('detail-open');
    renderLoopPaused = false;
  }
}

window.PORTFOLIO_SET_MODE = setMode; // exposed for transition wiring + manual testing
```

- [ ] **Step 2: Gate the existing animation loop**

Find the existing `function tick() {` definition. Run:

```
grep -n "function tick" index.html
```

The function body looks like:

```javascript
function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.1);
  updateTutorial(dt);
  ...
  renderer.render(scene, camera);
  if ((_labelFrame++ & 1) === 0) labelRenderer.render(scene, camera);
}
```

Replace the body with:

```javascript
function tick() {
  requestAnimationFrame(tick);
  if (renderLoopPaused) return;
  const dt = Math.min(clock.getDelta(), 0.1);
  updateTutorial(dt);
  updatePullUp();
  updateChaseCam();
  updatePathFX();
  updateMapFX(dt);
  updateTutorialAudio(dt);
  controls.update();
  renderer.render(scene, camera);
  if ((_labelFrame++ & 1) === 0) labelRenderer.render(scene, camera);
}
```

(The only changes: `if (renderLoopPaused) return;` immediately after `requestAnimationFrame(tick);`. Everything else stays.)

- [ ] **Step 3: Wire the back button**

Append after the `window.PORTFOLIO_SET_MODE = setMode;` line:

```javascript
document.getElementById('boardBack').addEventListener('click', () => setMode('airport'));
```

- [ ] **Step 4: Verify in preview**

Reload, then exercise the state machine:

```
preview_eval(serverId, "window.PORTFOLIO_SET_MODE('board'); document.body.classList.contains('board-view')")
```

Expected: `true`.

Then:

```
preview_eval(serverId, "document.getElementById('boardBack').click(); document.body.classList.contains('board-view')")
```

Expected: `false`.

Confirm the 3D render loop resumes by checking the canvas is visible:

```
preview_screenshot(serverId)
```

Expected: 3D LAX scene visible.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add airport ↔ board state machine and pause render loop"
```

---

## Task 9: Wire the takeoff → board transition

**Files:**
- Modify: `index.html` (small edit inside `updateMapFX`)

The existing `updateMapFX` function tracks `ascentActive`. When `t >= 1`, ascent finishes. We hook here: after the existing `ascentActive = false; airplane.rotation.z = -0.03; airplane.rotation.x = 0;` lines, fade and trigger `setMode('board')`.

- [ ] **Step 1: Locate the ascent-complete block**

Run:

```
grep -n "ascentActive = false;" index.html
```

You should see two matches; the one inside `updateMapFX` is the relevant one (located just after `if (t >= 1) {`). Read 5 lines of context around it to confirm.

- [ ] **Step 2: Add the transition trigger**

Inside `updateMapFX`, find:

```javascript
    if (t >= 1) {
      ascentActive = false;
      airplane.rotation.z = -0.03;
      airplane.rotation.x = 0;
    }
```

Replace with:

```javascript
    if (t >= 1) {
      ascentActive = false;
      airplane.rotation.z = -0.03;
      airplane.rotation.x = 0;
      if (portfolioMode === 'airport') triggerBoardReveal();
    }
```

- [ ] **Step 3: Add the reveal helper**

Append in the same `<script type="module">` block, after the `setMode` definition:

```javascript
function triggerBoardReveal() {
  // Fade existing canvas via the existing fadeOverlay element, then swap modes.
  const fade = document.getElementById('fadeOverlay');
  fade.classList.add('active');
  setTimeout(() => {
    setMode('board');
    requestAnimationFrame(() => fade.classList.remove('active'));
  }, 400);
}
```

- [ ] **Step 4: Verify in preview**

Reload, then trigger the existing tutorial-complete + ascent path. The simplest forced-trigger path:

```
preview_eval(serverId, "ascentActive = false; mapActive = true; window.PORTFOLIO_SET_MODE && triggerBoardReveal(); 'fired'")
```

Wait ~600 ms then screenshot. Expected: the LAX scene fades to black for ~400 ms, then the departure board fades in fully.

For the natural path: load the page, click the airplane in the tutorial flow until the post-ascent state is reached. The board should appear automatically when ascent completes.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Wire takeoff ascent-complete to reveal departure board"
```

---

## Task 10: Make the back button reverse the transition cleanly

**Files:**
- Modify: `index.html` (extend the back-button handler)

The Task 8 back button just toggles `setMode('airport')`. When returning, we should also fade through black so the transition matches the "land back at LAX" feel.

- [ ] **Step 1: Replace the back-button handler**

Find the existing handler (added in Task 8, Step 3):

```javascript
document.getElementById('boardBack').addEventListener('click', () => setMode('airport'));
```

Replace with:

```javascript
document.getElementById('boardBack').addEventListener('click', () => {
  const fade = document.getElementById('fadeOverlay');
  fade.classList.add('active');
  setTimeout(() => {
    setMode('airport');
    // exitMapView() (defined elsewhere in this file) restores scene background,
    // fog, lights, backdrop visibility, and clears mapActive/ascentActive.
    // Always call it on return so the user lands back at the LAX scene fully reset.
    if (typeof exitMapView === 'function') exitMapView();
    requestAnimationFrame(() => fade.classList.remove('active'));
  }, 400);
});
```

- [ ] **Step 2: Verify in preview**

Reload, then go to the board:

```
preview_eval(serverId, "window.PORTFOLIO_SET_MODE('board'); 'on'")
```

Click back:

```
preview_eval(serverId, "document.getElementById('boardBack').click(); 'back'")
```

Wait ~600 ms, screenshot. Expected: the board fades to black for ~400 ms, then the LAX scene is visible again.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Fade through black when returning from board to airport"
```

---

## Task 11: Mobile responsive pass

**Files:**
- Modify: `index.html` (CSS only)

Below 900 px viewport width: collapse the board header to a single column, swap the detail panel from a side panel to a full-screen modal, and tighten padding.

- [ ] **Step 1: Append responsive CSS**

After all the existing portfolio CSS in the `<style>` block, append:

```css
@media (max-width: 900px) {
  #board .board-inner {
    padding: 56px 18px 60px;
  }
  .board-header {
    grid-template-columns: 1fr;
  }
  .board-header__right {
    text-align: left;
    margin-top: 8px;
    line-height: 1.9;
  }
  .board-header__plane {
    display: none;
  }
  .board-section__cols {
    grid-template-columns: 30px 64px 1fr 56px;
    gap: 8px;
  }
  .board-row {
    grid-template-columns: 30px 64px 1fr 56px;
    gap: 8px;
    font-size: 10px;
  }
  .board-row__monogram {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  .board-row__dest .sub {
    display: none;
  }

  #detail-panel {
    width: 100%;
    min-width: 0;
    max-width: none;
    border-left: none;
  }
}
```

- [ ] **Step 2: Verify in preview**

Resize the preview window to mobile width:

```
preview_resize(serverId, width: 420, height: 800)
```

Then enable the board:

```
preview_eval(serverId, "window.PORTFOLIO_SET_MODE('board'); 'on'")
```

Screenshot. Expected: header is one column, contact info wraps left-aligned beneath the wordmark, the ambient plane glyph is hidden, rows are tighter, subtitles are hidden.

Open a row:

```
preview_eval(serverId, "document.querySelector('[data-id=\"ven-002\"]').click(); 'open'")
```

Screenshot. Expected: the detail panel covers the full screen (no board visible underneath).

Reset:

```
preview_resize(serverId, width: 1280, height: 800)
preview_eval(serverId, "window.PORTFOLIO_SET_MODE('airport'); 'off'")
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add mobile responsive rules for board and detail panel"
```

---

## Task 12: Add company logos to the assets folder and wire them in

**Files:**
- Create: `assets/logos/<name>.svg` (one per source listed below)
- Modify: `portfolio-data.js` (add `logo` fields)
- Modify: `index.html` (extend monogram rendering to swap in `<img>` when a logo path is present)

Real company logos go in the assets folder; rows that have a logo render the logo *inside* the monogram tile (centered, 22 px) instead of the letter. Rows without a logo file continue to show the monogram letter.

- [ ] **Step 1: Create the logos directory**

```bash
mkdir -p assets/logos
```

- [ ] **Step 2: Source and save each logo as SVG**

For each company below, download the official SVG (or PNG fallback) from the listed source and save with the listed filename. If a source is unavailable or licensing is unclear at build time, **skip that file** — the row will fall back to its monogram letter and that's fine.

| Filename | Company | Suggested source |
|---|---|---|
| `assets/logos/nyu.svg` | NYU | https://www.nyu.edu/about/policies-guidelines-compliance/policies-and-guidelines/use-nyu-name-graphic-images.html (brand kit) |
| `assets/logos/hinge.svg` | Hinge | press kit on hinge.co |
| `assets/logos/wix.svg` | Wix | press.wix.com |
| `assets/logos/starbucks.svg` | Starbucks | starbucks.com newsroom |
| `assets/logos/apnews.svg` | AP News | apnews.com |
| `assets/logos/jpost.svg` | Jerusalem Post | jpost.com |
| `assets/logos/i24.svg` | i24 News | i24news.tv |

> If you cannot find a clean SVG, save a PNG at 64 × 64 px instead and update the filename extension in the data file accordingly.

- [ ] **Step 3: Add `logo` field to relevant items in portfolio-data.js**

Edit `portfolio-data.js`. For each item below, add a `logo` key with the path. Example for the Tefillin Timer block:

```javascript
{
  id: 'ven-002',
  flight: 'VEN 002',
  monogram: 'T',
  logo: '', // intentionally empty — Tefillin Timer has no separate brand logo, monogram T stays
  destination: 'TEFILLIN TIMER · iOS APP',
  ...
}
```

For items where you have a logo file, set the path:

```javascript
{
  id: 'edu-003',
  flight: 'EDU 003',
  monogram: 'N',
  logo: 'assets/logos/nyu.svg',
  destination: 'NYU · COLLEGE OF ARTS & SCIENCE',
  ...
}
```

Apply the `logo` field to: `edu-003` (NYU), `bug-003` (Hinge), `bug-002` (Wix), `wrk-002` (Starbucks). Leave `logo: ''` (or omit) on every other item.

- [ ] **Step 4: Update the monogram renderer to prefer logos**

In `index.html`, find the monogram element creation inside `renderBoardSections()` (Task 4):

```javascript
      const mono = document.createElement('div');
      mono.className = 'board-row__monogram '
        + (section.muted ? 'dashed' : (isHeadline ? 'solid' : 'outlined'));
      mono.textContent = item.monogram;
      row.appendChild(mono);
```

Replace with:

```javascript
      const mono = document.createElement('div');
      mono.className = 'board-row__monogram '
        + (section.muted ? 'dashed' : (isHeadline ? 'solid' : 'outlined'));
      if (item.logo) {
        const img = document.createElement('img');
        img.src = item.logo;
        img.alt = '';
        img.className = 'board-row__logo';
        img.onerror = () => { mono.removeChild(img); mono.textContent = item.monogram; };
        mono.appendChild(img);
      } else {
        mono.textContent = item.monogram;
      }
      row.appendChild(mono);
```

Also update `renderDetail()` (Task 6). Find:

```javascript
      <div class="detail-panel__monogram" style="background:${section.color}">${item.monogram}</div>
```

Replace with:

```javascript
      <div class="detail-panel__monogram" style="background:${section.color}">${
        item.logo
          ? `<img src="${item.logo}" alt="" class="detail-panel__monogram-img"
                onerror="this.replaceWith(document.createTextNode('${item.monogram}'))">`
          : item.monogram
      }</div>
```

- [ ] **Step 5: Add CSS for inline logos**

Append to the `<style>` block:

```css
.board-row__logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
}
.detail-panel__monogram-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  display: block;
}
.board-row__monogram.solid .board-row__logo,
.board-row__monogram.solid .detail-panel__monogram-img {
  filter: brightness(0) invert(0); /* dark logo on light background */
}
```

- [ ] **Step 6: Verify in preview**

Reload, enable board:

```
preview_eval(serverId, "window.location.reload(); 'reload'")
```

Wait 3 s:

```
preview_eval(serverId, "window.PORTFOLIO_SET_MODE('board'); 'on'")
```

Screenshot. Expected: rows with a logo file present (NYU, Hinge, Wix, Starbucks if you sourced them) show the logo inside their monogram tile; everyone else keeps the letter monogram.

Console check:

```
preview_console_logs(serverId, level: "error")
```

Expected: no errors. (404s for missing logo files are *warnings*, not errors, and the `onerror` fallback hides them visually — that's acceptable.)

- [ ] **Step 7: Commit**

```bash
git add assets/logos portfolio-data.js index.html
git commit -m "Add company logos and render them inline in monograms"
```

---

## Task 13: Add real screenshots to detail panel hero slots

**Files:**
- Create: `assets/screenshots/<name>.png` (one per item that has a `hero` field set in `portfolio-data.js`)
- (No code changes needed — the renderer already reads from `detail.hero` in Task 6.)

- [ ] **Step 1: Create the screenshots directory**

```bash
mkdir -p assets/screenshots
```

- [ ] **Step 2: Source one image per item that has a `hero` field**

The `portfolio-data.js` from Task 1 already declares hero paths for these items. Capture / source one image per row:

| Filename | Source |
|---|---|
| `assets/screenshots/tefillin-timer-home.png` | Take the App Store hero screenshot of Tefillin Timer (1242 × 2208 or similar; will be cropped to 16:9). |
| `assets/screenshots/seniorsupport-home.png` | Screenshot of `https://SeniorSupportAI.org` homepage. |
| `assets/screenshots/webutation-arch.png` | Anonymized architecture diagram or product screenshot from Webutation work (or omit — see note below). |
| `assets/screenshots/research-banner.png` | Generic security/research banner — can be a Burp Suite screenshot, masked code snippet, or a custom dark image with the title overlay. |
| `assets/screenshots/hinge-bypass-1.png` | Pull a hero frame from the existing `blog-hinge-paywall-bypass.html` writeup, or capture a fresh demo screenshot. |
| `assets/screenshots/wix-idor-1.png` | Capture from your Wix writeup work. |
| `assets/screenshots/vibecode-ssh-1.png` | Capture from your Vibecode writeup work. |
| `assets/screenshots/nyu-campus.jpg` | A photo of the NYU Washington Square Arch / NYU campus (your own photo preferred; otherwise a CC-licensed image). |

> **For any image you can't source right now**, simply leave the file missing. The renderer's `is-placeholder` fallback (Task 5 CSS) shows a clean gradient with `[ ASSET PENDING ]` until the file appears. No code changes are needed when you eventually drop the file in.
>
> **For the Webutation hero specifically**, you may prefer to redact and use a heavily-stylized diagram instead of a real product screenshot — the data exposure risk is real here.

- [ ] **Step 3: Verify in preview**

Reload, enable board, click each row in turn:

```
preview_eval(serverId, "window.PORTFOLIO_SET_MODE('board'); 'on'")
preview_eval(serverId, "document.querySelector('[data-id=\"ven-002\"]').click(); 'tef'")
preview_screenshot(serverId)
preview_eval(serverId, "document.querySelector('[data-id=\"bug-003\"]').click(); 'hinge'")
preview_screenshot(serverId)
```

Expected: each detail panel shows either the real screenshot (when the file exists) or the gradient placeholder.

- [ ] **Step 4: Commit**

```bash
git add assets/screenshots
git commit -m "Add detail panel screenshots"
```

---

## Task 14: Create the Wix IDOR writeup page

**Files:**
- Read: `blog-hinge-paywall-bypass.html` (use as template — copy its full structure, swap content)
- Create: `blog-wix-idor.html`

The detail panel for `bug-002` (Wix IDOR) links to `blog-wix-idor.html`. This task creates that page mirroring the existing Hinge writeup format so the link doesn't 404.

- [ ] **Step 1: Read the existing Hinge writeup to copy its structure**

```bash
wc -l blog-hinge-paywall-bypass.html
```

Then read the full file. Its layout is the template we mirror.

- [ ] **Step 2: Create blog-wix-idor.html**

Create `blog-wix-idor.html` with the same `<head>` (fonts, meta, favicon) and `<body>` skeleton as `blog-hinge-paywall-bypass.html`. Replace:

- The page `<title>` → `Wix.com IDOR · Sina Matian`
- The meta description → `Insecure direct object reference disclosure on Wix.com.`
- The h1 / hero title → `Wix.com · IDOR Disclosure`
- The body content blocks → an outline matching how the Hinge writeup is structured: TL;DR, Background, Discovery, Reproduction, Impact, Disclosure Timeline, Lessons.

Fill the body blocks with placeholder copy that the user (Sina) will edit; mark each section with a clear `<!-- TODO Sina: replace with real writeup -->` HTML comment so it's obvious the content is pending. Example body block:

```html
<section class="prose">
  <h2>TL;DR</h2>
  <!-- TODO Sina: replace with real writeup -->
  <p>An insecure direct object reference (IDOR) on Wix.com allowed access to user-scoped data through a predictable endpoint identifier. Reported through responsible disclosure; acknowledged by Wix.</p>
</section>

<section class="prose">
  <h2>Background</h2>
  <!-- TODO Sina: replace with real writeup -->
  <p>...</p>
</section>
```

Repeat for the remaining sections (Discovery, Reproduction, Impact, Disclosure Timeline, Lessons), each with a TODO comment and a one-paragraph placeholder.

> The TODO comments are intentional and acceptable for *content* placeholders authored by the page owner — distinct from the "no placeholders in the implementation plan" rule. They mark spots Sina will fill in with the actual technical details only he knows.

- [ ] **Step 3: Verify in preview**

Reload, then navigate the preview to the new page:

```
preview_eval(serverId, "window.location.href = '/blog-wix-idor.html'; 'navigating'")
```

Wait 2 s, screenshot. Expected: the page loads with the same look-and-feel as the existing Hinge writeup, header reads "Wix.com · IDOR Disclosure", placeholder body sections are visible.

Console check:

```
preview_console_logs(serverId, level: "error")
```

Expected: empty.

Navigate back:

```
preview_eval(serverId, "window.location.href = '/index.html'; 'back'")
```

- [ ] **Step 4: Commit**

```bash
git add blog-wix-idor.html
git commit -m "Add Wix IDOR writeup page (placeholder body)"
```

---

## Task 15: Create the Vibecode SSH writeup page

**Files:**
- Read: `blog-hinge-paywall-bypass.html` (template)
- Create: `blog-vibecode-ssh.html`

Same shape as Task 14, different content.

- [ ] **Step 1: Create blog-vibecode-ssh.html**

Mirror the structure exactly as in Task 14. Replace:

- `<title>` → `Vibecode · SSH Bypass · Sina Matian`
- meta description → `Authentication bypass in the Vibecode app's SSH flow.`
- h1 → `Vibecode · SSH Bypass`
- Body sections (TL;DR, Background, Discovery, Reproduction, Impact, Disclosure Timeline, Lessons) — same `<!-- TODO Sina: replace with real writeup -->` comments, one paragraph of placeholder copy each. The TL;DR placeholder:

```html
<p>An authentication bypass in the Vibecode app's SSH flow allowed unauthorized access. Reported through responsible disclosure; acknowledged by Vibecode.</p>
```

- [ ] **Step 2: Verify in preview**

```
preview_eval(serverId, "window.location.href = '/blog-vibecode-ssh.html'; 'navigating'")
```

Screenshot, then check console for errors. Then return:

```
preview_eval(serverId, "window.location.href = '/index.html'; 'back'")
```

- [ ] **Step 3: End-to-end smoke test**

This is the final cross-task validation.

```
preview_eval(serverId, "window.location.reload(); 'reload'")
```

Wait 4 seconds for the LAX scene to load. Then take a screenshot. Expected: LAX 3D scene with the tutorial card visible.

Force the takeoff path:

```
preview_eval(serverId, "ascentActive = false; mapActive = true; triggerBoardReveal(); 'fire'")
```

Wait ~600 ms, screenshot. Expected: board fully visible.

Click into Hinge:

```
preview_eval(serverId, "document.querySelector('[data-id=\"bug-003\"]').click(); 'open'")
```

Screenshot. Expected: detail panel open with Hinge content; the `→ FULL WRITEUP` link points to `blog-hinge-paywall-bypass.html`.

Click into Wix (testing row-switch):

```
preview_eval(serverId, "document.querySelector('[data-id=\"bug-002\"]').click(); 'open-wix'")
```

Verify the link href:

```
preview_eval(serverId, "document.querySelector('.detail-panel__links a.is-primary').getAttribute('href')")
```

Expected return: `"blog-wix-idor.html"`.

Press Escape, then return to airport:

```
preview_eval(serverId, "document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); document.getElementById('boardBack').click(); 'home'")
```

Screenshot. Expected: 3D LAX scene visible again.

- [ ] **Step 4: Commit**

```bash
git add blog-vibecode-ssh.html
git commit -m "Add Vibecode SSH bypass writeup page (placeholder body)"
```

---

## Self-review notes

After implementing all 15 tasks, do one final pass:

1. **Spec coverage** — every section of the design spec is covered:
   - User flow (1–6) → Tasks 8, 9, 10
   - Board structure (5 sections) → Task 4
   - Visual system → Tasks 2, 3, 4, 5
   - Detail panel → Tasks 5, 6, 7
   - Plane integration → Tasks 3 (ambient), 9 (transition)
   - Tech architecture → Tasks 1 (data module), 2 (script load), 8 (state machine + render-loop pause)
   - Mobile → Task 11
   - Logos & screenshots → Tasks 12, 13
   - Wix + Vibecode writeups → Tasks 14, 15

2. **Build-order MVP gate** — after Task 11 you have a fully usable site (placeholder hero gradients, monogram fallbacks). Tasks 12–15 are async polish.

3. **Console must be clean** — at every verification step, `preview_console_logs(serverId, level: "error")` should return empty. 404s on intentionally-missing logo/screenshot files are warnings (acceptable).
