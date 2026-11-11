# Anshuu Singh portfolio workspace

The website's frontend is in [`frontend/`](./frontend/README.md).

```powershell
Set-Location frontend
npm install
npm run dev
```

The `backend/` directory is intentionally empty: visitor-created notebooks use browser local storage rather than a separate backend or database. Anshuu's notebook access check is handled by a Next.js server action in the frontend. If a standalone backend is added later, its code can start in `backend/`.

The supplied master prompt and starter content remain at the workspace root. Deployment and build instructions are in [`frontend/README.md`](./frontend/README.md).
