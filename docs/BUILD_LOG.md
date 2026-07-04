# Build Log

## 2026-07-04

### Decision: Build Original Product

We reviewed ScaleMock-style flows and decided to build a similar category product, not a copy. We will use public metadata only as inspiration/competitive research, then write our own problem content and UI.

### Decision: Start With Frontend Module

The first real module is frontend machine coding because it gives a concrete, runnable product surface quickly:

- Problem listing
- Filters/search
- Problem detail workspace
- Editor area
- Preview area
- Evaluation output

### Decision: Next.js + TypeScript

We will use Next.js App Router with TypeScript for production-minded routing, typed data models, and room to add backend features later.

### First MVP Routes

```txt
/
/frontend
/frontend/[slug]
```

### Implemented

- Added Next.js + TypeScript project skeleton at the workspace root.
- Added `README.md` with product direction and run instructions.
- Added frontend seed problem model and six original starter problems.
- Added dashboard route `/`.
- Added frontend listing route `/frontend` with search and difficulty filters.
- Added frontend workspace route `/frontend/[slug]` with problem panel, code editor placeholder, preview iframe, and simulated evaluation.
- Replaced deprecated `next lint` script with ESLint CLI and flat config.

### Verification

```txt
npm run typecheck
npm run lint
npm run build
```

All three pass.

### Reference Inventory

Reference files:

- `outputs/scalemock-structure-inventory.md`
- `outputs/scalemock-structure-inventory.json`

These files are for structure and metadata reference only. We will not copy full proprietary statements, editorials, or starter code.
