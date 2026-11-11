# Anshuu Singh Portfolio — supplied assets

## Files

- `assets/profile-original.png` — user's original supplied portrait (1086×1448). Use when an authentic, unaltered representation is preferred.
- `assets/hero-portrait-cinematic.png` — generated cinematic portrait (1312×1199) with dark background and warm amber rim lighting. It is an optional visual treatment and may not reproduce the face with perfect fidelity; use only if the owner approves it.
- `assets/reference-homepage-screenshot.png` — user-provided screenshot of the reference portfolio homepage (1920×1200). Design reference only. Do not publish it as part of the portfolio.
- `portfolio-content-starter.json` — editable starter data. Fields marked TODO must be confirmed before publishing.
- `MASTER-PROMPT.md` — full implementation prompt for the coding agent.

## Suggested use

For a close match to the reference hero, use `hero-portrait-cinematic.png` against the near-black hero background. For the About page, profile card or any context where facial identity fidelity matters most, prefer `profile-original.png`. Keep the portrait responsive with deliberate `object-position` and do not crop out the face.

Do not present the generated portrait as an untouched original photograph. Do not use the reference screenshot or reference owner's identity/content in the deployed website.
