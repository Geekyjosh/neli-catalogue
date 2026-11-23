# Neli Catalogue

A reusable React + TypeScript product catalogue table with an injectable asynchronous data adapter: search, status filter, deterministic sorting, pagination, newest-request-wins protection and recoverable errors. The demo uses only the supplied synthetic fixture.

## Prerequisites and tested runtime

- Node.js 24.21.0 (see `.nvmrc`), npm 11.19.0
- A browser supported by Vite 8
- Dependencies are pinned to exact versions in `package.json` and locked in `package-lock.json`.

## Commands

```bash
npm ci          # install exactly the locked versions
npm run dev     # local demo; Vite prints the URL
npm test        # vitest (jsdom), no network
npm run lint
npm run build
```

After install nothing needs a network or backend. All data comes from `fixtures/catalogue.json`.

## Component props

```tsx
import { Catalogue } from "./components/Catalogue";
<Catalogue fetchPage={fetchPage} pageSize={5} />;
```

| Prop        | Type        | Default  | Notes                                                                                                                                                              |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fetchPage` | `FetchPage` | required | `(query) => Promise<{ items, total }>`. Pass a **stable reference** (module constant, `useMemo` or `useCallback`). A new function identity triggers a new request. |
| `pageSize`  | `number`    | `5`      | Sent to the adapter as `query.pageSize`. Changing it is honoured on the next request.                                                                              |

## Adapter contract

Exported from `src/adapters/types.ts`:

- `Product`: `id`, `sku`, `name`, `stock`, `status` (`active | draft | archived`)
- `CatalogueQuery`: `search`, `status` (`all | active | draft | archived`), 1-based `page`, `pageSize`
- `CatalogueResponse`: `items` (the requested page) and `total` (matches before pagination)
- `FetchPage`: `(query: CatalogueQuery) => Promise<CatalogueResponse>`

Reference behaviour (`src/utils/catalogueUtils.ts`): search is trimmed and case-insensitive against name or SKU. Filter first, then sort by name with `localeCompare("en", { sensitivity: "base" })` (case- and accent-insensitive English order), break ties by `id`, then paginate. Empty results use page 1. If `total > 0` and the page is past the end, the view issues exactly one request for the last page. Full integration notes: `HANDOVER.md`.

## Demo scenarios

Selector in the page heading (demo only; the reusable component never reads it): **Normal** (100 ms), **Failure** (first request rejects, retry succeeds), **Race** (first request 600 ms, later requests 50 ms), **Empty** (no matches). Timers exist only in the demo adapter. Ordering correctness uses request identity, not timing.

## File index

- `src/adapters/types.ts`: exported types
- `src/adapters/fixtureAdapter.ts`: mock adapter and scenarios (kept separate from the core)
- `src/hooks/useCatalogue.ts`: async state, retry, request identity, last-page recovery
- `src/utils/catalogueUtils.ts`: pure filter, sort and paginate
- `src/components/`: `Catalogue.tsx` (reusable view), `CatalogueTable.tsx`, `CatalogueToolbar.tsx`
- `src/App.tsx`: demo shell and scenario selector
- `tests/`: automated tests
- `fixtures/catalogue.json`: supplied fixture, unchanged
- `reports/`: captured output and `manual-check.md`
- `HANDOVER.md`: API contract, examples, integration, rollback
- `LEAD_NOTES.md`: state ownership, error policy, blockers, adoption plan

## Tests

Cases covered: pagination and stable ordering (including reverse-id input), search/status intersection and page reset, empty results, page bounds, shrinking total with one last-page request, failure with labelled old rows then retry, Retry withdrawn on filter change, older request resolving or failing last, keyboard operation, accessible names and disabled pagination. Additional cases use different ids and data (`desk`/`lamp` products, `z-900`/`a-100`/`m-500`, a mutable shrinking dataset).

## Verification status

| Item                                                    | Status                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Clean dependency installation: `npm ci`                 | PASS (see `reports/npm-ci.txt`)                                                                           |
| Automated tests: `npm test`                             | PASS — 21 tests across 3 test files (see `reports/npm-test.txt`)                                          |
| ESLint: `npm run lint`                                  | PASS (see `reports/npm-lint.txt`)                                                                         |
| TypeScript and production build: `npm run build`        | PASS (see `reports/npm-build.txt`)                                                                        |
| Manual browser, keyboard and Narrator checks            | Recorded against the earlier revision in `reports/manual-check.md`; NOT repeated after the latest changes |
| Real API, authentication, authorisation, load behaviour | NOT TESTED (out of scope)                                                                                 |
| macOS, Linux, Safari, other screen readers              | NOT TESTED                                                                                                |

## Actual time

I worked from 3:30 PM to 7:10 PM on 23 November 2026 (3 h 40 min elapsed), and spent about 25 min of that on the lead notes. I hit two setup blockers: a locked native dependency file during installation on Windows (which I resolved by closing the dev process), and unreliable default Vitest worker startup on Windows, so my tests run with `--pool=threads --maxWorkers=1`. One intermittent worker timeout occurred during my clean-clone verification; an immediate rerun passed.

## Assumptions

I assumed page-based pagination, a page size of 5, and that the fixture is the only data source. I was not given the real API contract, auth or error model.

## Tool and source disclosure

- **Scaffold:** I generated the project from the official Vite React + TypeScript template (MIT) and removed the unused template images. `public/favicon.svg` is the template favicon.
- **AI assistance:** I used Claude (Anthropic) to review my submission against the brief and to help revise code, tests and documents. I reviewed all of its changes myself.
- **My own work:** the component, hook, adapter, utilities, tests and documents.
- **Runtime dependencies:** React 19.3.1 and React DOM 19.3.1 (MIT). Development dependencies (Vite, Vitest, Testing Library, ESLint, TypeScript, jsdom and their transitive packages) are open source. The lockfile lists these licences: MIT, Apache-2.0, ISC, BSD-2/3-Clause, MPL-2.0, 0BSD, BlueOak-1.0.0 and CC-BY-4.0. No third-party code is copied into `src/`.

## Reuse restrictions

I know of no restrictions on my code. I am submitting it for assessment and for Neli's technical and security review, and reuse terms are to be agreed before adoption. The third-party licences above apply to the dependencies. Submission is not production acceptance.
