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

### Frontend Module Expansion

- Replaced the six-item seed list with a 102-item frontend metadata inventory.
- Added listing pagination, company filtering, difficulty filtering, and search.
- Restyled `/frontend` to a dark card grid with a ScaleMock-like top navigation and Practice dropdown.
- Restyled `/frontend/[slug]` into a dark coding workspace with title bar, problem tabs, editor tabs, preview, and terminal panel.
- Kept generated descriptions, requirements, and starter snippets original instead of copying reference-site content.

### Workspace Engine V1

- Split the frontend workspace into editable `App.js` and `styles.css` tabs.
- Added starter CSS to the frontend problem model.
- Replaced the static preview mock with an iframe runner that compiles React JSX in the browser.
- Added parent/iframe messaging so Run Code can report pass/fail/error states into the terminal panel.
- Added the first concrete Tag Input checks:
  - renders the input
  - shows initial tags
  - adds a tag on Enter
  - removes a tag by clicking close
- Verified the starter Tag Input code reports `3/5` checks passed because the two TODO interactions are intentionally incomplete.
- Note: the current iframe runner uses browser-loaded React/Babel scripts. This is good for MVP validation; later we should bundle the runtime or move evaluation into a more controlled sandbox.

### Workspace Engine V2

- Added `monaco-editor` as a direct dependency alongside `@monaco-editor/react`.
- Replaced the workspace textarea with a client-only Monaco editor.
- Added JSX/JavaScript and CSS language switching for the `App.js` and `styles.css` tabs.
- Added a custom dark Monaco theme to match the workspace.
- Added editor basics:
  - line numbers
  - syntax highlighting
  - auto layout
  - word wrap
  - minimap disabled
  - Command/Ctrl+S runs checks
- Verified Monaco renders in the browser and Run Code still reports the expected Tag Input starter result: `3/5` checks passed.

### Frontend Problem Content V1

- Added a dedicated problem override registry for high-quality runnable problems.
- Expanded the frontend problem model with:
  - `constraints`
  - `solutionNotes`
  - `testScript`
- Extracted test scripts out of the workspace component so each problem owns its own checks.
- Upgraded the first three problems with original starter code, CSS, requirements, constraints, solution notes, and runnable checks:
  - Tag Input Component
  - Star Rating Component
  - Accordion Component
- Updated the Solution tab to show problem-specific solution notes.
- Kept the remaining catalog items backed by generated metadata and generic starter/test content for now.
- Browser verification:
  - `/frontend/tag-input-component` reports `3/5` checks passed for the intentionally incomplete starter.
  - `/frontend/star-rating-component` reports `2/4` checks passed for the intentionally incomplete starter.
  - `/frontend/accordion-component` reports `3/5` checks passed for the intentionally incomplete starter.

### Workspace Runner V2

- Added `@babel/standalone` as a local dependency.
- Replaced CDN runtime scripts in the preview iframe with local same-origin assets:
  - `/frontend-runner/react.js`
  - `/frontend-runner/react-dom.js`
  - `/frontend-runner/babel.js`
- Added a Next route handler that serves the runtime scripts from installed packages.
- Extracted preview HTML generation into `src/features/frontend/runner/create-preview-html.ts`.
- Extracted preview message and test result types into `src/features/frontend/runner/types.ts`.
- Added clearer runtime handling for:
  - missing `App` component
  - render/compile errors
  - test-script errors
- Verification:
  - runtime assets return `200`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - browser Run Code checks still report the expected starter results:
    - Tag Input: `3/5`
    - Star Rating: `2/4`
    - Accordion: `3/5`

### Submit Flow V1

- Added local submission attempt types and localStorage helpers.
- Wired the top-level Submit button:
  - if checks have not been run, Submit starts a run first
  - when results return, the attempt is saved locally
  - saved attempts include problem slug, timestamp, status, pass count, code, CSS, and test results
- Replaced the History placeholder with a real local attempt list.
- Added Restore for a saved attempt, which puts the saved `App.js` and `styles.css` back into the editor.
- Added compact History styling for attempt rows, status badges, notices, and restore actions.
- Verification:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - browser Submit on Accordion saved an attempt and switched to History
  - Restore loaded the saved attempt back into the editor

### Frontend Progress V1

- Added local submission summaries derived from saved attempts.
- Wired the `/frontend` listing to read local attempt progress from `localStorage`.
- Added dashboard progress filters:
  - All
  - Attempted
  - Passed
  - Needs Work
- Added per-card progress badges and best-check counts so workspace submissions are visible from the problem list.
- Kept progress local-only for the MVP; backend user accounts and synced progress come later.

### History V2

- Added local history mutation helpers for deleting one attempt and clearing a problem's history.
- Expanded the workspace History tab:
  - expandable attempt rows
  - per-check pass/fail details
  - runtime error display
  - best-attempt badge
  - restore and delete controls per attempt
  - clear-history control for the current problem
- Added latest attempt score to the workspace title metadata.
- Kept all history state in browser `localStorage`; synced user history remains a backend/auth milestone.

### Tag Input Solution V1

- Expanded the frontend problem model with `solutionCode` and `solutionCss`.
- Updated the Solution tab to render problem-owned notes plus final `App.js` and `styles.css`.
- Polished the Tag Input solution first:
  - controlled input state
  - Enter key handling
  - trim and empty-input rejection
  - duplicate prevention
  - immutable add/remove updates
  - accessible remove buttons
- Also added a full Accordion solution as the next polished solution target:
  - active index state model
  - toggle-open/toggle-close logic
  - single-open-row behavior
  - semantic button controls
  - `aria-expanded` accessibility
  - conditional answer rendering
