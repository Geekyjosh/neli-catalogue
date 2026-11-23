# Handover

## What is included

- React and TypeScript catalogue interface.
- Promise-based fixture adapter with normal, failure, race and empty scenarios.
- Search by product name or SKU, status filters, alphabetical ordering and five-row pagination.
- Request sequencing in the catalogue hook to prevent stale responses from replacing newer data.
- Error feedback and retry while retaining the last successful response.
- Unit and hook tests using Vitest and React Testing Library.

## Run locally

1. Install the supported Node.js LTS release.
2. Run npm ci to install dependencies.
3. Run npm run dev to start the local application.
4. Run npm test to execute tests.
5. Run npm run lint to check code quality.
6. Run npm run build to type-check and create a production build.

## Demo scenarios

Use the Demo scenario selector in the page heading. The failure scenario rejects its first request and succeeds on retry. The race scenario deliberately delays the first request longer than the second. The empty scenario returns no matching products.

## Operational notes

The fixture is local synthetic data. Replace the fixture adapter with the agreed service adapter when an API contract and authentication approach are supplied. Do not add production credentials to this repository.
