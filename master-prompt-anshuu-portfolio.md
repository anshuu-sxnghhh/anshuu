# MASTER BUILD PROMPT — ANSHUU SINGH PERSONAL PORTFOLIO

> Give this entire brief and the accompanying `portfolio-assets.zip` to your coding agent. The reference website is: https://sarthak-sharma-portfolio-six.vercel.app/  
> Goal: build a complete, polished, responsive personal portfolio for **Anshuu Singh**, strongly matching the reference site's visual language, layout rhythm, page architecture and motion experience—without copying the reference owner's identity, personal copy, photos, project content, or proprietary assets.

---

## 1. Your role and the expected result

Act as a senior creative developer, UI/UX designer, motion designer and full-stack frontend engineer. First inspect the reference website thoroughly, then implement the portfolio—not just a static mockup.

The end result must feel like a carefully art-directed personal portfolio made by a professional designer/developer. It must not look like a generic AI-generated template, a dashboard, a SaaS landing page, or a collection of premade cards.

**Primary objective:** reproduce the reference's overall experience as closely as practical:
- Dark, cinematic, editorial visual direction.
- Oversized high-contrast serif typography for the personal name and major statements.
- Small uppercase mono-style metadata and labels.
- Restrained warm orange/amber accents.
- A centered floating/pill-shaped navigation bar.
- A dramatic portrait-led hero composition.
- Fine grid lines, deliberate whitespace, subtle borders and carefully controlled contrast.
- Long-form storytelling sections, a strong selected-work presentation and detailed project case studies.
- Thoughtful scroll-based motion, hover states and page transitions.
- A coherent responsive version for mobile and tablet, not simply a compressed desktop layout.

Do not stop after the homepage. Build all required routes, all major sections, real links, responsive states and working interactions.

## 2. Reference inspection — do this before coding

Reference URL: `https://sarthak-sharma-portfolio-six.vercel.app/`

Use a browser to inspect and record:
1. Every navigation item and route.
2. The complete homepage from top to footer, including section order and approximate section heights.
3. All visible buttons, links, hover states, accordions/tabs, menus and motion controls.
4. Every project card and the corresponding project-detail route.
5. Desktop, tablet and mobile behavior.
6. Typography: inspect computed `font-family`, font weight, letter spacing, line height and actual font files where possible.
7. Colors, borders, grid lines, page gutters, max-widths, radii and spacing.
8. Motion: entrance timing, stagger, scroll triggers, easing, image masks, marquee speed, hover transitions and whether motion can be disabled.
9. Page loading, navigation transitions, footer behavior and external links.

Take reference screenshots at a consistent viewport (at least 1440×900 desktop and approximately 390×844 mobile). Compare the implementation against these screenshots section by section.

**Do not claim an exact font, library or original tech stack unless you verify it from browser devtools, loaded assets or public source.** The reference being hosted on Vercel does not, by itself, prove that it uses Next.js. If a detail cannot be verified, reproduce the visible behavior and document the uncertainty instead of inventing facts.

The reference has a multi-page structure. Recreate the following information architecture as the starting point:
- `/` — Home
- `/about` — About
- `/work` — Work / Projects
- `/education` — Education / Teaching / Learning
- `/content` — Content / Videos / Writing
- `/speaking` — Speaking / Events
- `/contact` — Contact
- Individual project case studies under `/work/[slug]`

The reference includes individual case-study URLs. For Anshuu's site, create a detail route for each genuine project that has enough confirmed information. Do not manufacture projects just to hit a route count. Use a data-driven route system so real projects can be added later.

## 3. Personal identity and verified content to pre-fill

Use the following profile as a **careful starting point**, not as permission to invent credentials:

### Identity
- Name: **Anshuu Singh**
- Location: **India**. Use a city only after it is confirmed by the owner.
- Current positioning: **BCA student / aspiring software developer and technology builder**.
- Interests evidenced in prior project discussions: native Android development, Kotlin, web development, practical software projects, AI-assisted product ideas, hackathons and student tech communities.
- University context: **Shivalik University** has appeared in the owner's event and college context. Confirm the exact degree, current semester, department and dates before publishing them as formal education facts.
- Community context: **StackFlame**, described as a BCA department club. The owner has discussed organizing student coding events and technical competitions. Present this as student-community/event involvement, not as a formal employment position.

### Safe introductory copy — use or refine without exaggeration
**Hero eyebrow:** `DEVELOPER · STUDENT · BUILDER`

**Hero subheading:** `Building practical digital experiences and learning by shipping real projects.`

**Short intro:** `I'm Anshuu Singh, a BCA student interested in software development, mobile applications and the way thoughtful technology can solve everyday problems. I enjoy turning ideas into working prototypes, exploring new tools and contributing to student tech communities.`

**About paragraph:** `My journey is shaped by curiosity, hands-on experimentation and a desire to understand how products work beyond the screen. From exploring native Android development with Kotlin to building web projects and developing ideas for hackathons, I learn best by creating, testing and improving. I am continuing to grow my engineering fundamentals while looking for opportunities to contribute to meaningful products and collaborative teams.`

**Personal positioning statement:** `Curious by nature. Practical by approach. Always building.`

### Confirmed project directions — label the maturity honestly
1. **Kavach — SOS Safety App Concept / Prototype**  
   A safety-focused mobile application concept explored for an SOS experience, emergency contact/location sharing and evidence-supported incident reporting. Describe only features that are genuinely implemented in the current code. If something was only planned, label it `planned`, `prototype concept` or `in progress`. Do not claim production deployment, verified AI accuracy, police integration, background capture, or real-world safety outcomes without evidence. Build privacy-conscious UX and explicit consent into any description of evidence capture.

2. **Flash Flood Prediction System for Hilly Regions — Hackathon Project Concept**  
   A disaster-management concept focused on using multiple data sources to support flash-flood risk prediction in hilly regions. Mention the problem area and intended approach, but do not invent model accuracy, datasets, government adoption, live deployment, awards or SIH results. Ask the owner to provide the final implementation details, team role, datasets, model and demo link before presenting these as completed facts.

3. **Web development / internship assignments**  
   The owner has discussed completing website projects for internship/project submissions. Keep these as unpublished draft entries until exact project names, brief, features, stack, screenshots, repository and live URLs are supplied. Do not invent an employer, internship duration, certificate, job title or company.

### Technical skills — careful wording
Use a section such as `Tools I am learning and building with`, not `Expert in`. Kotlin, Android Studio, MongoDB, HTML, CSS, JavaScript and Git/GitHub have appeared in the owner's development context. Verify actual proficiency and project usage before adding them to a public skill list. Do not add React, Next.js, TypeScript, Tailwind, Java, Python, Firebase, Supabase or any other technology as a confirmed skill unless the owner verifies it. The website's own implementation stack is separate from the owner's skills.

### Event / community experience
The owner has discussed student coding events associated with StackFlame and Shivalik University, including Code Clash and Prompt Wars / Shiva Tech 2026. Present these as event organization or student-community contributions only after confirming the owner's actual role and whether the event took place. Do not make up participant counts, prize amounts, sponsors, attendance, outcomes or awards.

### Explicitly unknown — never fabricate
The following must remain editable placeholders or be omitted until verified:
- Exact degree title, semester, enrollment/graduation dates and formal education chronology.
- Work experience, employer names, job titles, internship provider, dates and certificates.
- Awards, rankings, hackathon finalist/winner status and quantified achievements.
- Number of projects, users, downloads, students taught, clients, revenue or impact.
- Email, phone number, GitHub, LinkedIn, Instagram, YouTube and other social URLs.
- Resume URL, location below country level and availability status.
- Project deployment status, production readiness, repository links, screenshots and exact technology stacks.

If a value is missing, use a clear content TODO in code/data, not fake public-facing copy. Never show placeholder social links as if they work. Hide unavailable social icons and contact methods.

## 4. Supplied assets — use these correctly

The ZIP includes:
- `assets/profile-original.png` — the owner's supplied original portrait. This is the most faithful source for the owner's real appearance.
- `assets/hero-portrait-cinematic.png` — a generated, cinematic, black-background portrait with warm amber rim lighting, intended as an optional hero visual. It may not be a pixel-perfect likeness; do not present it as an untouched photograph.
- `assets/reference-homepage-screenshot.png` — a screenshot of the reference homepage, for design comparison only.
- `portfolio-content-starter.json` — editable starter profile/project data.
- `ASSET-README.md` — notes about each file.

Use the cinematic portrait as the desktop hero image if the owner approves it. Use the original portrait for an authentic profile/about image or as the preferred identity reference. Do not alter the owner's face in any further image processing. The screenshot of the reference site is not a production asset and must never appear in the deployed site.

Prepare optimized responsive image variants (WebP/AVIF where supported) while retaining original files in the assets folder. Use `object-fit` and `object-position` carefully so the face is not cropped on mobile. Add meaningful alt text. Avoid unnecessary filters that distort skin tone or facial identity.

## 5. Visual design system

Treat the screenshot and live reference as the source of truth. The following values are an approximate starting palette sampled by eye, not verified original CSS values:
- Background: near-black, around `#050505` / `#080807`.
- Main text: warm ivory, around `#E9E4DA` / `#F0EDE6`.
- Secondary text: warm muted gray, around `#8A857D`.
- Accent: restrained burnt orange / amber, around `#C96F43`.
- Surface/nav: charcoal, around `#171615`.
- Hairline border: warm dark gray, around `#393630`.

Visual rules:
- Use a dark, nearly black canvas with subtle tonal variation rather than obvious gradients.
- Use a high-contrast editorial serif for the large name/headlines and a highly legible sans-serif for body copy. Use a compact mono/technical face for tiny labels if it matches the reference.
- Inspect the actual reference font first. If it cannot be reliably identified, select a tasteful pair such as `Bodoni Moda` or `Cormorant Garamond` for display and `DM Sans` or `Manrope` for interface/body. Do not use a font pairing blindly if it clashes with the inspected reference.
- Oversized headings should be responsive with `clamp()` and controlled line wrapping.
- Keep content width and gutters consistent. Preserve generous negative space.
- Use thin borders, subtle separators, minimal radii and small orange details.
- The nav should feel like a floating capsule/panel, not a generic full-width navbar.
- Avoid excessive glassmorphism, neon gradients, glowing buttons, random blobs, generic icon grids and oversized rounded cards.
- Keep text hierarchy deliberate: large serif headlines, medium sans-serif body, small uppercase metadata.

## 6. Homepage experience and section blueprint

Recreate the reference's content rhythm and visual density. Validate the exact order against the live site during inspection. Use these as the initial content sections:

1. **Floating navigation** — Anshuu Singh wordmark; links to Work, About, Content, Speaking and a clear `Let's talk` CTA. On mobile use a compact menu with accessible open/close behavior.
2. **Hero / Presence** — tiny role label and location metadata; cinematic portrait in a centered/overlapping composition; oversized `Anshuu Singh` display name; a one- or two-line intro; `Explore my work` and `Start a conversation` actions; bottom-edge scroll cue and small status metadata. Recreate the reference's portrait-led composition and text placement as closely as the responsive layout allows.
3. **Introduction** — a short, strong statement about building practical products, learning through making and human-centered technology.
4. **Perspectives / disciplines** — three concise pillars. Suggested starting pillars: `BUILD` (software and prototypes), `LEARN` (continuous learning and engineering fundamentals), `CONNECT` (collaboration and student tech communities). Make the selector genuinely interactive only if the reference has a working interaction; keyboard support is required.
5. **Selected work** — large editorial project rows/cards with title, category, short summary, year/status only when verified, project image and a clear case-study link.
6. **How I approach building** — explain problem understanding, planning, implementation, testing and iteration. Do not portray a beginner as a senior engineer; focus on process and growth.
7. **Skills / tools** — group verified skills into sensible categories such as Mobile, Web, Database and Workflow. Clearly distinguish `Used in projects`, `Learning` and `Exploring` when appropriate.
8. **Experience / community** — StackFlame and student event work only after the owner confirms their contribution. No invented metrics.
9. **Journey / timeline** — education and project milestones with confirmed years only. Omit unknown dates rather than guessing.
10. **Content / learning** — show published videos, articles or notes only when actual URLs exist. Otherwise hide the section or use a tasteful `Coming soon` state only if the owner explicitly wants it.
11. **Speaking / events** — show actual events, event role, dates and photos only when verified. Never invent speaking invitations or conference appearances.
12. **Final contact CTA and footer** — a strong `Have a project or an idea? Let's talk.` call to action, working verified contact links and small location/copyright metadata.

Do not force every section to contain content. It is better to hide an empty section than to publish fake experience, filler metrics or dead links.

## 7. Inner pages and project case studies

Create consistent, reusable page templates:

### About (`/about`)
- Personal introduction and portrait.
- Current focus and interests.
- Education (verified details only).
- Learning journey / timeline.
- Values and approach.
- Tools and skills grouped by confidence/usage.

### Work (`/work`)
- Featured projects first.
- Filter or category navigation only if it fits the reference.
- Each project should show a real screenshot/visual, title, type, concise problem/solution and status.
- Use real GitHub/live demo URLs only.

### Project case study (`/work/[slug]`)
Use a repeatable data-driven template:
- Project title, type, status and concise overview.
- Hero media or screenshot.
- Problem / context.
- Goal and constraints.
- My role and contributions (only what the owner did).
- Key features (implemented vs planned clearly separated).
- Tech stack (only verified).
- Design/architecture decisions.
- Challenges and lessons learned.
- Outcome (qualitative unless verified numbers exist).
- Real repository / demo link if supplied.
- Previous/next project navigation and return-to-work link.

### Education (`/education`)
- Education chronology and learning milestones.
- Workshops, courses and teaching activity only if real and confirmed.
- Certificates only when provided.

### Content (`/content`)
- Actual YouTube/videos/articles/social posts, with thumbnails and live links.
- If no public content exists yet, do not invent video titles or views. Hide this page from nav until ready, or make a simple honest placeholder.

### Speaking (`/speaking`)
- Actual talks, seminars, workshops, event photos and topics only.
- If the owner's experience is event organization rather than speaking, distinguish the two accurately.

### Contact (`/contact`)
- Working email link once supplied.
- Optional functional contact form with validation and a real backend/service only if configured.
- Otherwise use a `mailto:` link; never show a form that silently does nothing.
- Social links only if supplied.

## 8. Recommended implementation stack

Unless the environment/repository requires something else, use:
- Next.js with App Router.
- TypeScript with strict type checking.
- Tailwind CSS for responsive layout and design tokens.
- GSAP + ScrollTrigger for complex scroll choreography, reveals and pinned sections where justified.
- Motion (formerly Framer Motion) for component/page transitions and small interface interactions where appropriate.
- `next/font` for reliable font loading.
- Local data files / typed content objects for profile, navigation and projects. Do not add a database or backend unless there is a real requirement.
- Vercel-ready configuration and optimized Next.js images.

Use GSAP and Motion selectively—do not animate the same element with both libraries. Avoid unnecessary Three.js, Redux, API services, analytics or dependencies. A personal portfolio can be mostly static and data-driven; optimize for speed, reliability and maintainability.

If an existing repository is supplied, inspect it first and preserve working configuration. Do not overwrite the project blindly.

## 9. Motion design specification

Study the real reference behavior and reproduce its timing/feel. Potential motion patterns to implement where supported by inspection:
- Intro/hero: restrained portrait reveal, heading reveal and subtle amber light/rim treatment in the image asset—not a fake animated spotlight over the whole screen.
- Text: word/line stagger using clipping/masks, with a short, elegant duration.
- Scroll: opacity/translate reveals, carefully staggered content and image masks.
- Marquee: continuous, seamless ticker with no visible jump; pause or adapt when reduced motion is requested.
- Project cards: restrained hover shift, image scale/crop and arrow movement.
- Navigation: subtle state/hover transition and clean mobile menu animation.
- Page transitions: brief and purposeful; never delay navigation noticeably.
- Statistics: animate only real verified values. Do not invent counts for animation.
- Motion control: implement a working `Motion off` toggle if the reference supports it. It must disable non-essential animations and persist the preference locally if appropriate.

Accessibility requirements:
- Respect `prefers-reduced-motion` by default.
- Provide a visible motion-off control if included.
- Never make essential content accessible only through animation.
- Avoid scroll hijacking, forced long pinning and motion that causes nausea.
- Ensure keyboard navigation, visible focus states and semantic buttons/links.

## 10. Responsive behavior

Test at minimum:
- Desktop: 1440×900 and 1920×1080.
- Tablet: 768×1024.
- Mobile: 390×844 and 360×800.

Mobile is a designed layout, not an afterthought:
- Reflow the hero portrait and typography without overlap.
- Keep the name legible and intentionally wrapped.
- Ensure buttons are thumb-friendly.
- Convert the floating nav into a compact accessible menu.
- Prevent horizontal overflow from marquee, oversized serif words and grids.
- Reposition hero labels and footnotes so they do not collide with the portrait.
- Crop images deliberately while keeping the face visible.
- Maintain generous but efficient spacing.

## 11. Functionality checklist

Everything visible must work:
- All internal navigation links lead to real pages.
- Every project card opens the correct case study.
- All external URLs are real and supplied by the owner.
- Email and resume actions work only after URLs/details exist.
- Mobile menu opens, closes and closes after navigation.
- Motion toggle genuinely disables the relevant motion.
- Any filters, tabs or selectors update content correctly.
- Contact form validates and submits to a configured destination, or is not displayed.
- No dead buttons, `href="#"`, fake social icons, fake testimonials, fake counters or fake loading states.
- Add 404 page and sensible empty states.

## 12. SEO, quality and engineering requirements

- Set page-specific metadata/title/description and Open Graph metadata.
- Use semantic HTML and a logical heading hierarchy.
- Add descriptive image alt text; decorative images should have empty alt text.
- Optimize images and fonts; lazy-load below-the-fold media.
- Avoid layout shift; reserve image dimensions/aspect ratios.
- Keep the page fast and avoid heavy effects on lower-end phones.
- Check Lighthouse or equivalent for performance, accessibility, best practices and SEO.
- Ensure no console errors, broken routes, missing assets or TypeScript build errors.
- Add favicon and site metadata using the owner's initials/name, not reference-site branding.
- Provide clear README with setup, dev, build and deploy instructions.

## 13. Working method and deliverables

Follow this sequence:
1. Inspect reference and prepare a short implementation spec with screenshots and observations.
2. Inspect the provided assets and existing project structure.
3. Set up the design tokens, typography, global layout and responsive navigation.
4. Build the homepage and compare it against the reference screenshot.
5. Build the reusable inner-page and project case-study templates.
6. Add only confirmed content from the starter profile; leave unknowns as clearly marked TODOs in the content data.
7. Add and test interactions/motion.
8. Test mobile/tablet/desktop and every route.
9. Run lint, typecheck and production build; fix all errors.
10. Deliver the complete source code, README, asset references and a concise list of owner-supplied details still needed.

Final deliverables:
- A fully working portfolio project, not just a screenshot or design mockup.
- All routes and project detail pages implemented from real supplied data.
- Reusable components and organized content files.
- Optimized supplied assets.
- Responsive polished experience with motion controls and accessibility support.
- README with local run and Vercel deployment steps.
- A short `OWNER-TODO.md` listing any missing facts, profile links, project screenshots or URLs that still need Anshuu's confirmation.

## 14. Non-negotiable rules

1. Match the reference's visual design and interaction quality as closely as reasonably possible, but use **Anshuu Singh's** identity and original content.
2. Do not use Sarthak Sharma's face, name, personal biography, projects, testimonials, metrics, social URLs or project screenshots as Anshuu's content.
3. Do not invent qualifications, internships, awards, impact numbers, users, revenue, event attendance or technical expertise.
4. Do not claim a planned feature is implemented. Label prototypes, concepts and planned features honestly.
5. Do not leave dead links or decorative controls that do nothing.
6. Do not substitute generic gradients, giant rounded cards or boilerplate portfolio copy for the reference's editorial art direction.
7. Do not stop at the homepage.
8. Do not say the website is complete until the production build and route/functionality checks pass.

**Definition of done:** a stranger opening the deployed website should immediately see a distinctive, cinematic, editorial portfolio that feels closely aligned with the reference, understand who Anshuu Singh is, explore genuine projects in depth, and contact him through working links—on desktop and mobile.
