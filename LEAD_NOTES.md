# Lead Notes

## Delivery summary
The implementation separates catalogue query logic, the asynchronous adapter, request state and presentation. The supplied synthetic fixture is used as the demo data source.

## State ownership
- App owns the selected demo scenario, search input, status filter, current requested page and page size.
- useCatalogue owns the last successful response and its query metadata, loading state, recoverable error and retry trigger.
- fixtureAdapter owns local scenario timing and simulated failure behaviour.
- getCataloguePage is a pure function for filtering, sorting and pagination.

## Error and retry policy
A failed request does not clear the last successful response or its query metadata. The view labels retained rows as previous successful results, keeps the count and page position tied to that successful response, disables pagination and offers retry for the failed query. A changed query starts a newer request and clears the prior error/retry action.

## Concurrency and page-boundary policy
Each effect invocation receives an incrementing request identity and is invalidated during cleanup. Only the current request may commit a result. If a successful response reports a positive total smaller than the requested page requires, the hook issues one request for the last valid page; that request remains subject to the same request-identity guard. Empty results are represented on page one.

## Review blockers and assumptions
- The assessment supplies synthetic data and simulated scenarios only.
- No production API schema, authentication, authorisation or service-level expectations were supplied.
- The production adapter should not be implemented until the backend contract and ownership are agreed.
- The supplied fixture was byte-compared with the original assessment asset on 23 November 2026 and matched.
- Fresh-clone verification was completed on 23 November 2026 using Node.js 24.21.0 and npm 11.19.0: npm ci succeeded with 0 reported vulnerabilities; a standalone npm test rerun passed all 14 tests; lint and production build passed. The initial combined test invocation had an intermittent worker-startup timeout, which is disclosed in reports/manual-check.md.
- Manual assessment checks were completed: scenario behaviour, keyboard navigation, Windows Narrator, Google Chrome, Mozilla Firefox, Microsoft Edge, and responsive layout on mobile and desktop. Results are recorded in reports/manual-check.md.

## Adoption plan and owners
1. Frontend owner: confirm table columns, English sorting expectations, accessibility requirements and loading/error copy with product/design.
2. API owner: publish endpoint contract, pagination semantics, error model and authentication/authorisation requirements.
3. Frontend owner: implement an authorised FetchPage adapter against the approved contract while preserving the view-facing types where possible.
4. QA owner: add production-adapter contract tests and run any additional regression checks required for the agreed production browser/device support matrix. The assessment's Chrome, Firefox, Edge, mobile and desktop checks are already complete and recorded in reports/manual-check.md.
5. Security/product owners: review data handling, credentials, dependency licences and reuse terms before production adoption.

## Verification gates
- npm ci completes from a clean checkout.
- npm test, npm run lint and npm run build pass; clean-clone results are recorded in reports/manual-check.md.
- Automated tests cover normal pagination, sorting ties, search/status intersection, page reset, empty results, shrinking totals, failure/retry and out-of-order responses.
- Manual keyboard and screen-reader checks are recorded in reports/.
- The fixture matches the supplied original file byte-for-byte (comparison completed 23 November 2026).
- Manual scenario, keyboard, Windows Narrator, cross-browser and responsive checks are complete and recorded in reports/manual-check.md.
- Captured local test, lint and build output is committed under reports/.

## Rollback
If a regression is identified, revert the relevant implementation commit(s) on the main branch. Retain the fixture and test tooling for local regression testing.
