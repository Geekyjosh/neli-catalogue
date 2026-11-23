# Handover

## Exported API and adapter contract

The reusable query contract is exported from src/adapters/types.ts:

- Product: id, sku, name, stock and status (active, draft or archived).
- CatalogueQuery: search, status (all/active/draft/archived), 1-based page and pageSize.
- CatalogueResponse: items (the current page) and total (matching records before pagination).
- FetchPage: (query: CatalogueQuery) => Promise<CatalogueResponse>.

The useCatalogue hook accepts a FetchPage function and a CatalogueQuery. It exposes data, dataQuery, loading, error and retry. dataQuery describes the last successful response, so the UI can keep its count and page position accurate if a newer request fails.

Example input:

    {
      search: "desk",
      status: "active",
      page: 1,
      pageSize: 5
    }

Example output:

    {
      items: [
        {
          id: "sku-101",
          sku: "DESK-101",
          name: "Desk",
          stock: 12,
          status: "active"
        }
      ],
      total: 1
    }

## What is included

- React and TypeScript catalogue demo.
- Promise-based local fixture adapter with normal, failure, race and empty scenarios.
- Trimmed, case-insensitive search by product name or SKU.
- Status filtering, English alphabetical ordering with ID tie-breaker and five-row pagination.
- Request identity protection, retry and automatic last-page recovery when a positive result total shrinks.
- Semantic table, labelled search and status controls, keyboard operation and visible focus indicators.
- Vitest and React Testing Library tests.

## Run locally

Tested runtime: Node.js 24.21.0 and npm 11.19.0 (Node version is specified in .nvmrc).

1. Install the documented Node.js version.
2. Run npm ci.
3. Run npm run dev.
4. Run npm test.
5. Run npm run lint.
6. Run npm run build.

The package-lock.json pins the dependency tree. The demo uses local fixture data and does not require a backend or runtime network access.

## Demo scenarios

Use the Demo scenario selector in the page heading. The failure scenario rejects its first request and succeeds on retry. The race scenario deliberately delays the first request longer than the next. The empty scenario returns no matching products. The normal scenario returns the supplied catalogue after a short delay.

## Extension and production integration

The fixture adapter is isolated in src/adapters/fixtureAdapter.ts. To integrate an authorised service:

1. Agree the API endpoint, authentication and authorisation method, pagination semantics and error contract with the API/security owners.
2. Implement a new FetchPage function that maps the service response to CatalogueResponse and validates untrusted response data.
3. Inject that function into the catalogue state/view layer; keep fixture scenario selection out of reusable catalogue logic.
4. Add adapter contract tests, including authentication failure, network failure, empty pages and changing totals.
5. Keep credentials in the approved secret-management mechanism; never commit them to this repository.

## Known limitations and recovery

- The demo uses local synthetic data, a fixed page size of five and simulated scenario delays.
- No production API, authentication, authorisation or service-level behaviour is implemented.
- The demo's visual shell is an assessment harness, not a production design system.
- A failed request retains the last successful rows and their query metadata, disables pagination and exposes retry. A filter/search change starts a new request and withdraws the previous retry action.
- If a positive total shows that the requested page is now out of range, the hook requests the last valid page once. Request identity still determines which result may be committed.
- If a regression is introduced, revert the responsible implementation commit(s), reinstall from package-lock.json with npm ci, and run npm test, npm run lint and npm run build. Keep the synthetic fixture and tests for regression checks.

## Verification records

Assessment verification is complete. See reports/manual-check.md for the manual scenario, keyboard, Windows Narrator, browser and responsive-layout results. The interface was manually tested on Windows in Google Chrome, Mozilla Firefox and Microsoft Edge and rendered and operated as expected in all three. Responsive layout was manually checked on mobile and desktop screen sizes and worked as expected.

A fresh clone was created on 23 November 2026 using Node.js 24.21.0 and npm 11.19.0. npm ci completed successfully (225 packages added, 226 audited, 0 vulnerabilities reported); a standalone npm test rerun passed all 3 test files and 14 tests; npm run lint passed; and npm run build passed. The first combined test invocation had an intermittent Vitest worker-startup timeout, which is disclosed in reports/manual-check.md. Captured local working-checkout output is committed in reports/npm-test.txt, reports/npm-lint.txt and reports/npm-build.txt.
