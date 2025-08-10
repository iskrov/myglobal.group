ROLE
You are a senior brand + web designer/developer. Build a fast, accessible, responsive site for a consulting firm named “MyGlobal Group” (domain: https://myglobal.group). The visual feel is premium, editorial, discreet—credible for defense, enterprise, and government buyers.

NON-NEGOTIABLES
- All provided copy must be used VERBATIM (only fix trivial punctuation/spacing). Preserve UK/US spelling as written.
- Do NOT mention or display the previous brand name anywhere.
- If you cannot fetch assets, create tasteful placeholders.

ROUTES (information architecture)
- “/” (Home) — hero + Who we are + pillars + trust strip + team teaser + contact CTA
- “/crowd-analytics” — separate page for the analytics text below
- “/team” — leadership cards with bios (provided below)
- “/contact” — form + email alias
- “/privacy”, “/terms”

DESIGN TOKENS (use these exact values)
- Colors (dark-first):
  --bg-1: #0B1526        (page/hero background)
  --bg-2: #0F1E34        (cards/raised sections)
  --surface: #101B2D     (inputs/panels)
  --ink: #E7EEF6         (text on dark)
  --ink-muted: #A7B3C6   (secondary text on dark)
  --ink-dark: #202733    (text on light)
  --bg-light: #F5F7FA    (alternating light sections)
  --stroke: #1E2C47      (dividers/borders)
  --accent-1: #2F6BFF    (primary CTAs/links/focus ring)
  --accent-2: #00C389    (positive highlight)
  --amber-cta: #FFB020   (warnings / “risk window”)
  --scarlet: #E54B4B     (errors/critical)
- Typography:
  Headings: “Newsreader”, serif (700/600). Editorial tone.
  Body/UI: “Inter”, sans (400/500/600), line-height 1.6.
  Type scale (clamp): H1 clamp(40px, 6vw, 72px); H2 clamp(28px, 4vw, 44px); H3 24–28px; Body 17–18px.
- Components:
  Cards radius 16px; subtle shadow; 1px border rgba(30,44,71,0.4).
  Primary button: bg #2F6BFF, text #FFFFFF; Secondary: outline #2F6BFF on dark.
  Links: #2F6BFF with underline on hover (visited: #2B5FE3).
- Imagery motif:
  Subtle “operational intelligence” backgrounds only—thin radar arcs, faint geo-grids, satellite dots at 3–6% opacity. No stock clichés.

HEADER / FOOTER
- Sticky header with blur on scroll; left wordmark “MyGlobal Group”; right nav: Home, Crowd Analytics, Team, Contact. Active link underlined in accent-2.
- Footer: one-line company blurb, quick links, © YEAR MyGlobal Group, domain shown.

HERO & MOTION (tasteful)
- Background (noisy blobs forbidden):
  radial-gradient(1200px at 20% 10%, rgba(47,107,255,0.18), transparent 60%), linear-gradient(180deg, #0C1729 0%, #0A1322 100%)
  Overlay faint circular arcs (opacity ≤ 0.06) with very slow parallax (20–30s). Respect prefers-reduced-motion.
- Headline (exact): “Dual-Use Strategy and AI Execution for Complex Environments.”
- Subline: one concise sentence summarizing services (no new claims).
- CTAs: Primary “Book a briefing”; Secondary “Contact us”.

HOME — “Who we are” + pillars (VERBATIM COPY)
Render the following verbatim. Group each pillar into a card with a small headline and bullets.

"Who we are:

Defense & Security
• Battlefield Validation & TRL Acceleration — live-combat trials that push dual-use tech from prototype to TRL 7+.
• Combat Trend Intelligence — data-driven briefs on how drones, AI, and EW reshape force composition and platform relevance.
• Dual-Use Tech Scouting & Integration — source frontline innovations and adapt them for civilian markets.
Enterprise & Industry
• Industry AI Horizon Scanning & ROI Roadmaps — map emerging trends, size value pools, and build multi-year investment strategies.
• Industry Transformation Programs — end-to-end AI-adoption playbooks covering budgeting, vendor selection, and change management.
• Implementation PMO & Change Acceleration — orchestrate pilots, vendor partnerships, and talent upskilling to embed AI at speed and scale.
Education & Training
• Executive War-Room Workshops — red-team scenarios and crisis simulations translating frontline insight into boardroom action.
• Executive AI Education — targeted workshops and briefings that turn technical advances into decisive strategy.
Healthcare
• AI-Powered Support for Autistic Children — Smart Room sensor-AI kit deciphers each child’s stress and engagement cues in real time, giving families and clinicians instant guidance and restoring up to ten calm hours weekly.
AI Behavioral Analysis
• Privacy-First Crowd-Analytics Layer — converts ordinary cameras into live dashboards of audience mood and engagement, clustering people by real-time stance without storing personal identities.
Logistics & Supply Chain
• Ukraine Grain Corridor Risk-Free Route Optimisation — AI blends satellite AIS feeds, conflict-zone intelligence, and other data to chart dynamic, low-risk maritime corridors that let grain convoys sidestep Russian interdiction."

Below pillars:
- Trust strip (monochrome logo placeholders), caption “Selected projects & partners”.
- Team teaser: 3 cards → “Meet the team”.
- Full-width CTA band on dark: “Work with us” + button “Book a briefing”.

SEPARATE PAGE — /crowd-analytics (VERBATIM COPY)
Desktop: three columns (stack on mobile).
- Left: the intro paragraph.
- Middle: “What you get” as stacked feature cards with simple line icons.
- Right: sticky heat-map mock (SVG gradient placeholder) + CTA “Request a demo”.
- Slim privacy banner: “Aggregate analytics only. No PII stored.” → link /privacy.

"Cross-modal AI analytics of mass behavior for stadiums, political rallies, and any large events: a real-time platform that reads the crowd’s atmosphere by combining computer vision, audio, and other sensors.
What you get
The system captures gestures, posture, eye contact, and emotional cues—instantly showing where enthusiasm, skepticism, or fatigue is rising.

Algorithms detect hotspots of antagonism—clusters with elevated aggression or opposing reactions—and flag potential conflicts in advance.

A live reaction heat map lets you adjust the script, music, security placement, and visitor flows on the fly.

After the event, you receive a report with precise metrics: engagement peaks tied to specific remarks, tension zones, and the effectiveness of interventions—without subjective guesswork."

TEAM PAGE — Leadership Team (VERBATIM COPY)
Use uniform headshots (neutral mid-gray background, consistent crop 3:4). Show Name, Role, and the bio exactly as written. Order as provided. Add accessible alt text “Headshot of {Name}, {Role}”.

- **Igor Kolos** — Co-Founder  
  Defense-grade AI specialist with 10+ years deploying artificial intelligence at scale across military, construction, mining, and energy sectors (projects valued at $50M+). Expert in privacy-first automation with a focus on measurable ROI.

- **Alexey Iskrov** — Co-Founder  
  Senior data engineer with 20+ years in edge AI systems and education. Specializes in privacy-centric video analytics, edge computing, and large-scale infrastructure data solutions.

- **Sergii Vlas** — Co-Founder  
  AI strategist with 15+ years leading high-impact national-scale projects, including military-grade counter-propaganda, cognitive warfare analytics, and smart-city platforms serving over 20M users. Honored for exceptional contributions to national security innovation.

CONTACT PAGE
- Form: Name, Email, Organization, Country, Area of interest (dropdown with the six pillars), Message.
- Anti-spam: honeypot + basic rate-limit. Clear success confirmation.
- Also show alias: hello@myglobal.group and a “Book a briefing” calendar link (placeholder).

ACCESSIBILITY & PERFORMANCE
- WCAG: visible keyboard focus, semantic landmarks, aria-labels on nav, AAA contrast (Ice on Navy; Ink on Bone).
- Responsive from 320px+. Max content width 1200–1320px. Spacing grid = 8px.
- Lazy-load below-fold images; preload fonts; compress assets; avoid layout shift.

SEO & META
- Title: “MyGlobal Group — Dual-Use & AI Strategy”
- Meta description: “Consulting at the intersection of defense, industry, and AI: validation, trend intelligence, executive training, healthcare AI, behavioral analytics, and logistics.”
- OG/Twitter images: MG monogram on deep-navy gradient with faint arcs.
- Generate sitemap.xml and robots.txt; set canonical URLs.

QUALITY BAR (must pass)
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.
- Copy matches provided text verbatim (only trivial punctuation normalization allowed).
- No generic “blob” gradients or cliché stock photography; use the defined arc/geo motif.

DELIVERABLES
- Fully built pages with the specified routes.
- Design tokens implemented (CSS variables or Tailwind config).
- MG monogram favicon + OG image.
- Reusable components: Hero, PillarCard, LogoRow, TeamCard, HeatmapPanel, ContactForm.

STACK NOTE
Prefer Vite + Tailwind (recommended), but any stack is acceptable if it reproduces the visuals, tokens, interactions, and accessibility above exactly.
