# Neli Catalogue

A reusable React + TypeScript product catalogue exercise demonstrating asynchronous page loading, search, status filtering, deterministic sorting, pagination, stale-request protection and recoverable errors. The demo uses only the supplied synthetic fixture.

## Prerequisites and tested runtime

- Node.js 24.21.0
- npm 11.19.0
- A browser supported by the installed Vite version

The project uses the committed package-lock.json to keep dependency resolution reproducible.

## Install, run and verify

Run these commands from the project root:

```bash
npm ci
npm run dev
npm test
npm run lint
npm run build
```

Vite prints the local development URL after npm run dev starts. The application and tests use local files only; no backend, credentials or runtime API access is required. All demo data is read from fixtures/catalogue.json.

## Catalogue contract

The adapter contract is exported from src/adapters/types.ts:

- Product: id, sku, name, stock, and status.
- CatalogueQuery: search, status, 1-based page, and pageSize.
- CatalogueResponse: items for the requested page and total before pagination.
- FetchPage: a function accepting CatalogueQuery and returning Promise<CatalogueResponse>.

The demo uses a page size of five. Search is trimmed and case-insensitive across product name and SKU. Status filtering is applied before sorting. Names are sorted in English locale order with base sensitivity; IDs break equal-name ties. The view resets to page one when search or status changes.

The asynchronous state and request identity logic live in src/hooks/useCatalogue.ts. The fixture implementation is isolated in src/adapters/fixtureAdapter.ts; a future integration can provide an authorised FetchPage implementation without changing the query and response types. Agree the endpoint, authentication, error and pagination contracts before connecting a production service.

## Demo scenarios

Choose a scenario from the Demo scenario selector:

- **Normal:** resolves after a short delay.
- **Failure:** the first request fails and retry succeeds.
- **Race:** the first request is deliberately slower than the next request.
- **Empty:** returns no matching products.

These timers are for the local demo only. Request ordering is guarded by request identity, not by the expected duration of a response.

## Verification

Automated tests cover page size and total, search by name/SKU, status filtering, stable sorting, empty results, retry after failure, stale-response protection and recovery when a result total shrinks. See tests/.

Manual browser checks are recorded in reports/manual-check.md. Captured local working-checkout output is stored in reports/npm-test.txt, reports/npm-lint.txt and reports/npm-build.txt. A fresh clone was also verified on 23 November 2026: npm ci completed with 0 reported vulnerabilities; npm test passed all 14 tests across 3 files; npm run lint passed; and npm run build passed. The first combined test invocation had an intermittent Vitest worker-startup timeout; an immediate standalone npm test rerun passed with no unhandled errors. See reports/manual-check.md for the full record.

## File index

- src/adapters/types.ts: exported product, query, response and adapter types.
- src/adapters/fixtureAdapter.ts: local synthetic demo adapter.
- src/hooks/useCatalogue.ts: asynchronous request state, retry and request sequencing.
- src/utils/catalogueUtils.ts: filtering, sorting and pagination.
- src/components/Catalogue.tsx: reusable catalogue view that accepts an injected FetchPage adapter.
- src/components/: semantic catalogue table and labelled toolbar controls.
- src/App.tsx: local demo shell and scenario selector.
- tests/: automated unit and hook tests.
- fixtures/catalogue.json: supplied assessment fixture.
- reports/: verification records and captured output.
- HANDOVER.md: adapter contract, integration and recovery notes.
- LEAD_NOTES.md: architecture, blockers, adoption, gates and rollback.

## Time record and assumptions

- Active implementation and verification time: not tracked contemporaneously; an exact total cannot be reconstructed reliably.
- Lead-notes preparation time: not tracked contemporaneously; an exact total cannot be reconstructed reliably.
- Setup blockers: Windows initially encountered a locked native dependency file during installation; closing the running development process/editor and rerunning installation resolved it. Vitest was configured to use a single thread worker after the default worker startup was unreliable in the local Windows environment.
- Remaining untested checks: responsive layout and cross-browser coverage beyond the recorded Windows/Chrome session were not separately tested.

Assumptions: the supplied fixture is the only data source; the API contract, authentication, authorisation, production error model and service-level expectations are not provided. The demo uses page-based pagination and a fixed page size of five.

## AI, third-party source and reuse disclosure

ChatGPT (OpenAI) was used as an AI-assisted development and review tool for implementation suggestions, code changes, test expansion and documentation review. The candidate ran the project locally and performed the recorded manual checks. No third-party application template or copied application source is intentionally included.

Runtime dependencies React and React DOM, and development dependencies listed in package.json, are third-party open-source packages. Their respective licences and package metadata are recorded in the lockfile and package distribution. Review each package's licence before redistributing it outside its permitted terms.

The supplied synthetic fixture was compared byte-for-byte with the original assessment fixture on 23 November 2026 and matched. It is included solely for this assessment and should not be treated as production data or reused outside the assessment without permission. The candidate-authored implementation is provided for assessment review; any later reuse or production adoption remains subject to Neli Arabi GmbH's technical/security review and a separate agreement on reuse terms. No company systems, credentials, customer data or supplier APIs were accessed.
