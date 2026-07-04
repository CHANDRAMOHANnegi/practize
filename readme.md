# Interview Studio

Interview Studio is a Next.js + TypeScript interview-prep platform inspired by modern coding and design interview tools. The goal is not to copy an existing site, but to build a better product with original content, clean architecture, and focused workspaces.

## Current Focus

We are building one module first:

- Frontend machine-coding problem list
- Frontend problem workspace
- Monaco-style editor placeholder, live preview placeholder, and evaluation panel
- Structured seed data that can grow into 100+ original problems

HLD, LLD, DSA, mock interviews, auth, backend evaluation, and payments will come later.

## Stack

- Next.js App Router
- TypeScript
- CSS modules/global CSS for the first MVP
- Future additions: Monaco Editor, React Flow, Zustand, Prisma, Postgres, Auth.js

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

