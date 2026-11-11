# Anshuu Singh — frontend

A responsive portfolio with animated Three.js scenes, a date-wheel gate for Anshuu's notebook, and a local-only diary maker.

The `backend/` directory at the workspace root is intentionally empty. Anshuu's access check uses a Next.js server action; visitor-created diaries are stored only in their browser and are never sent to a database or separate backend.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Before using the notebook gate, create a `.env.local` file in this folder:

```env
DIARY_ACCESS_CODE=replace-with-an-eight-digit-code
```

Keep the code private and do not commit `.env.local`. The gate only protects the notebook's maintenance notice; it is not suitable protection for sensitive diary content.

Open [http://localhost:3000](http://localhost:3000).

## Verify and build

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Notebook features

- `/` — maintenance homepage and link to the notebook.
- `/personal-diary` — Anshuu's book-style notebook, with links to create a diary or open your bookshelf.
- `/bookshelf` — manage, unlock, and delete diaries saved in this browser.
- `/create-diary` — set a name, diary title, and animated date-of-birth lock.
- `/my-diary/<id>` — write and draw on pages, format text, and turn pages.
- Visitor diaries can be reopened with their date-of-birth lock and are autosaved in that browser's local storage.
- The bookshelf can delete one notebook or clear all notebooks from local storage.
- `/maintenance` — shown after Anshuu's notebook unlocks or when a visitor asks to save/share online; it explains that online saving is unavailable and diaries remain only in the current browser.
- Local storage is not encrypted or backed up.

## Deploy

Import this folder into Vercel and use the standard Next.js build settings. Set `DIARY_ACCESS_CODE` in the deployment environment. No separate backend or database is required.

The supplied portraits are used on the homepage and notebook respectively. The reference screenshot is not included in the deployed site.
