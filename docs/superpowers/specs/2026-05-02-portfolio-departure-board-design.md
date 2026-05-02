# Sina Matian — Airport Departure Board Portfolio

**Status:** Approved design, ready for implementation planning
**Owner:** Sina Matian
**Date:** 2026-05-02

## Overview

A personal portfolio that opens with the existing LAX 3D airport scene as a hero, runs the takeoff sequence on user interaction, and lands in a **resume-as-airport-departure-board** view. Each row is one career item (venture, role, disclosure, school) styled as a flight. Clicking a row opens a detail panel with logos, screenshots, and writeups.

The 3D scene anchors brand identity. The board carries the actual resume content in a scannable, recruiter-friendly form. The airplane is the connective metaphor — present at takeoff, ambient at the board, and the visual signal for navigating back.

## Goals & non-goals

**Goals**
- Single site that doubles as personal brand (the LAX scene) and resume (the board).
- Recruiters can scan the entire career in under 30 seconds without leaving the board.
- Each accomplishment has a deeper story available one click away (logos, screenshots, links).
- Mobile-readable.

**Non-goals**
- No themed mini-airports per category (rejected as too heavy).
- No CMS or backend — content is static.
- No analytics, no contact form, no blog index beyond the existing writeups.
- No login or interactivity beyond navigation.

## User flow

1. **Land** on `/` — the existing LAX 3D scene, "DRAG · SCROLL · CLICK" controls visible. The "CLICK HERE TO FLY PLANE / OR PRESS ENTER TO BOARD" tutorial card is already wired.
2. **Engage** — user clicks the airplane or presses Enter. Existing takeoff animation runs (plane lifts off, ascends, scene already supports this via `enterPov` / chase cam / pull-up logic).
3. **Transition to board** — at peak ascent (the existing "post-departure ascent into the clouds" state, hooked off the existing `updateMapFX` ascent-complete moment), a 400 ms fade-to-black overlays the canvas. The Departure Board fades in over the dimmed scene.
4. **Browse** — user reads the board. Hover highlights a row; click opens the detail panel.
5. **Detail** — on desktop ≥900 px the panel slides in from the right, occupying ~45 % of the viewport, board on the left. On mobile / narrow it overlays as a full-screen modal with a close button.
6. **Return to airport** — the LAX wordmark / "← KLAX" button in the header reverses the transition: board fades out, plane descends back to the LAX scene.

## Information architecture

The board is grouped into five sections, in this exact top-down order:

| Section | Color | Items |
|---|---|---|
| ▸ VENTURES | orange `#ed8e2b` | VEN 002 Tefillin Timer · VEN 001 SeniorSupportAI |
| ▸ ENGINEERING | teal `#29b09e` | ENG 002 Webutation (Software Engineer) · ENG 001 Independent Security Researcher |
| ▸ RESEARCH · RESPONSIBLE DISCLOSURES | red `#c9432f` | BUG 003 Hinge Paywall Bypass · BUG 002 Wix.com IDOR · BUG 001 Vibecode SSH Bypass |
| ▸ EDUCATION | purple `#4a3b8c` | EDU 003 NYU CAS · EDU 002 SMC / Pierce · EDU 001 Calabasas HS |
| ▸ ALSO ON THE LOG (dimmed) | white `#f4eed8` @ 0.5 | WRK 002 Starbucks · WRK 001 Sloan's Ice Cream |

Each row has 4 columns: **monogram tile (28 px)**, **flight code**, **destination**, **year**. **The first item in each section** gets a solid-fill monogram and a left accent border (treated as the section's headline); subsequent items in the same section get an outlined monogram. Rows in `ALSO ON THE LOG` use a dashed outline and the whole section sits at 50 % opacity.

### Header strip

Above the board:
- Left: `▸ DEPARTURES · KLAX` label, then "SINA MATIAN" wordmark (Syne 700), then tagline "SECURITY RESEARCHER · CS @ NYU".
- Right: location ("LAX / NYC"), email, social handles (`GH: TIME-ATTACK · LINKEDIN`).
- Far-right corner: tiny ✈ icon drifting horizontally on a slow CSS animation (the "ambient cruising" cue).
- Top-left: `← KLAX` return button.

## Visual system

Inherits from the existing LAX scene:
- Background `#0a0908` to `#141311`
- Foreground `#f4eed8`
- Accent `#ed8e2b`
- Section colors as above
- Type: Syne 700 for headlines, JetBrains Mono for everything else
- Same border / divider language: 1 px lines at 8–15 % opacity

Monograms render as 28 × 28 px squares using the section color. **Solid fill** = headline item; **outlined** = secondary; **dashed outline** = the dimmed "Also On The Log" rows.

## Detail panel

Triggered by click on a row. Contents:
- **Header strip:** large monogram (48 px) + role/title + dates.
- **Hero image slot** (16:9): a real screenshot, app screenshot, exploit GIF, or campus photo — depending on what the row represents. If no image is available, falls back to a stylized gradient placeholder with the section color.
- **Stat tiles** (2 columns): up to 4 metrics where applicable (e.g. Tefillin Timer → "30,000+ users", "3 outlets press").
- **Body copy** (1–3 short paragraphs, expanded from the bullet points in the existing resume content).
- **Action buttons:** outlined links (e.g. "→ APP STORE", "→ AP NEWS", "→ FULL WRITEUP", "→ GITHUB").

Closes on:
- Click `✕` in the panel
- Click outside the panel (desktop)
- Esc key
- Click another row (panel transitions content rather than closing)

## Plane integration

The plane appears in three states across the experience:

1. **Hero (LAX scene):** full 3D plane, existing rendering. User interacts here to start the journey.
2. **Transition:** the existing takeoff sequence runs unchanged. At peak (when the existing post-ascent state activates), the board fades in over a darkened canvas.
3. **Ambient (board):** a small ✈ glyph in the header drifts horizontally on a 12-second loop. The 3D scene is paused (`pause animation loop`) to free GPU while the board is visible.

Returning to the LAX scene un-pauses the loop and triggers the existing landing/exit camera animation.

## Tech architecture

**Extend `index.html`** rather than create a parallel app. Reasoning: the LAX scene, takeoff logic, and tutorial flow already live there. A separate page would mean duplicating asset loading and re-mounting Three.js.

Structure inside `index.html`:
- `#canvas` — existing Three.js canvas
- `#labels` — existing CSS2DRenderer overlay
- `#board` — **new** absolutely-positioned overlay, `display:none` until takeoff completes
- `#detail-panel` — **new**, slides in from `#board`
- `#fade-overlay` — already exists (`fadeOverlay`)

JavaScript:
- The existing animation loop pauses while `#board` is visible (gate in `tick()`).
- A small state machine: `STATE_AIRPORT` → `STATE_TRANSITIONING` → `STATE_BOARD` → `STATE_DETAIL` → back.
- Content lives in a single JS object literal (`PORTFOLIO_DATA`) at the top of a new module so editing copy doesn't require touching layout.

CSS:
- New stylesheet block for `#board` and `#detail-panel`, scoped via `body.board-view` class.

Asset folder layout (new):
```
assets/
  logos/
    nyu.svg   hinge.svg   wix.svg   apnews.svg   jpost.svg   ...
  screenshots/
    tefillin-timer-home.png   tefillin-timer-reminder.png
    seniorsupport-home.png    seniorsupport-class.jpg
    hinge-bypass-1.png        wix-idor-1.png   vibecode-ssh-1.png
    nyu-campus.jpg            calabasas-hs.jpg
```

Real logos are sourced from each company's brand kit / Wikipedia (SVGs preferred). For things without official assets (Tefillin Timer, SeniorSupportAI), use existing app screenshots and homepage captures. Where neither logo nor screenshot is available at build time, the monogram + gradient placeholder displays — the system degrades cleanly.

## Build order

1. **Board UI shell** — markup, CSS, all 5 sections rendered with mock data; no interactivity.
2. **Wire real content** — populate the `PORTFOLIO_DATA` object from the resume content; monograms only.
3. **Detail panel** — markup, slide-in animation, content rendered from the data object; placeholder hero gradients only.
4. **Takeoff → board transition** — hook into existing post-ascent state, fade overlay, show board, pause render loop.
5. **Return to LAX** — `← KLAX` button reverses the transition.
6. **Mobile pass** — single-column board, full-screen detail modal under 900 px.
7. **Logos & screenshots** — added progressively; each asset is independent, no rebuild required.
8. **Wix + Vibecode writeup pages** — mirror the existing `blog-hinge-paywall-bypass.html` format. Hinge writeup gets linked from the Hinge detail panel.

Phases 1–6 deliver a fully usable site. Phases 7–8 are polish that can ship in waves.

## Out of scope (for this spec)

- Themed 3D destination scenes (rejected earlier).
- Search, filter, or sort UI on the board.
- Analytics / tracking.
- A back-end or contact form.
- New blog content beyond the three writeup pages already implied (Hinge exists, Wix and Vibecode are new).
- Any feature flag or A/B infrastructure.

## Open implementation choices (decide during planning)

- Exact easing curves for board fade-in and panel slide.
- Whether the "Independent Security Researcher" engineering row links to the same content as the three Research rows or is its own writeup.
- Image format strategy: WebP vs PNG; lazy loading thresholds.
