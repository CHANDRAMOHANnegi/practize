# Interview Studio

Interview Studio is a Next.js + TypeScript interview-prep platform inspired by modern coding and design interview tools. The goal is not to copy an existing site, but to build a better product with original content, clean architecture, and focused workspaces.

## Current Focus

We are building one module first:

- Frontend machine-coding problem list
- Frontend problem workspace
- ScaleMock-style dark workspace with problem, editor, live preview, and console panels
- Monaco-powered `App.js` and `styles.css` editor tabs
- Browser iframe runner for React starter code with `App.js` and `styles.css` tabs
- Local preview runtime routes for React, ReactDOM, and Babel; no CDN dependency for the workspace runner
- Real runnable content for the first three problems: Tag Input, Star Rating, and Accordion
- Per-problem test scripts, constraints, starter files, and solution notes
- Local Submit flow that saves attempts and displays them in the History tab
- Local progress dashboard showing attempted/passed state from saved submissions
- Structured 102-problem metadata inventory with original generated summaries and requirements

HLD, LLD, DSA, mock interviews, auth, backend evaluation, and payments will come later.

## Stack

- Next.js App Router
- TypeScript
- Monaco Editor via `@monaco-editor/react`
- CSS modules/global CSS for the first MVP
- Preview runner: iframe + local React/ReactDOM/Babel browser runtime
- Local persistence: browser `localStorage` for first-pass submission history
- Future additions: React Flow, Zustand, Prisma, Postgres, Auth.js

## Planned Routes

```txt
/
/frontend
/frontend/[slug]
```

Later:

```txt
/hld
/hld/[slug]/whiteboard
/lld
/lld/[slug]
/dsa
/mock-interview
```

## Workspace Notes

The `outputs/` directory contains reference artifacts and metadata inventories from earlier exploration. The real app lives in the root Next.js project under `src/`.

## Run

After dependencies are installed:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000/frontend
```

Current workspace engine route:

```txt
http://localhost:3000/frontend/tag-input-component
```

First runnable problem set:

```txt
http://localhost:3000/frontend/tag-input-component
http://localhost:3000/frontend/star-rating-component
http://localhost:3000/frontend/accordion-component
```

Local preview runtime assets:

```txt
http://localhost:3000/frontend-runner/react.js
http://localhost:3000/frontend-runner/react-dom.js
http://localhost:3000/frontend-runner/babel.js
```
