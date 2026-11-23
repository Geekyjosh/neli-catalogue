# Manual verification record

**Date:** 23 November 2026  
**Environment:** Windows desktop, Chrome, local Vite development server, Windows Narrator.  
**Record:** The candidate performed these checks against the current local project and confirmed the results in the assessment session.

| Check | Status | Notes |
|---|---|---|
| Normal scenario loads products | PASS | Product rows and controls displayed. |
| Search matches product name | PASS | Matching product results displayed. |
| Search matches SKU | PASS | Partial SKU search returned matching products. |
| Status filters and page reset | PASS | Changing search/status returned the view to page one. |
| Pagination and disabled boundaries | PASS | Previous/Next changed pages; unavailable boundary actions were disabled. |
| Failure retains labelled previous rows/count/page and disables pagination | PASS | Previous successful results remained visible and were identified as previous results; pagination was disabled. |
| Retry succeeds for the failed query | PASS | Retry recovered and cleared the error state. |
| Race scenario: latest request wins | PASS | The stale slower response did not overwrite the newer result. |
| Empty state uses page one | PASS | Empty scenario displayed the empty state on page one. |
| Keyboard access and visible focus | PASS | Tab navigation reached the controls and table interactions; focus was visible. |
| Screen-reader announcement and accessible names | PASS | Windows Narrator announced the search, status filter, table headers and pagination controls. |

## Automated verification

The final local commands completed successfully:

- `npm test`: 3 test files passed, 14 tests passed.
- `npm run lint`: passed with no errors or warnings.
- `npm run build`: TypeScript compilation and Vite production build passed.

Captured terminal output is stored in `npm-test.txt`, `npm-lint.txt` and `npm-build.txt`.

## Remaining verification

- A fresh clone / clean-checkout install and verification using `npm ci`, tests, lint and build has not yet been completed. Do not describe the project as clean-checkout verified until this is done.
- Responsive layout and cross-browser coverage beyond the recorded Windows/Chrome session were not separately tested.
