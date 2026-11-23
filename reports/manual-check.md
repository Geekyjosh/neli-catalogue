# Manual verification record

**Date:** 23 November 2026  
**Environment:** Windows desktop and mobile screen sizes; Google Chrome, Mozilla Firefox and Microsoft Edge; local Vite development server; Windows Narrator.

**Manual-check scope:** The manual browser, keyboard, screen-reader and responsive-layout checks below were performed against an earlier revision of the project. They were not repeated after the latest implementation changes. The results are retained as historical evidence and should not be interpreted as verification of the final revision.

| Check                                                                     | Status | Notes                                                                                                                                                     |
| ------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal scenario loads products                                            | PASS   | Product rows and controls displayed.                                                                                                                      |
| Search matches product name                                               | PASS   | Matching product results displayed.                                                                                                                       |
| Search matches SKU                                                        | PASS   | Partial SKU search returned matching products.                                                                                                            |
| Status filters and page reset                                             | PASS   | Changing search/status returned the view to page one.                                                                                                     |
| Pagination and disabled boundaries                                        | PASS   | Previous/Next changed pages; unavailable boundary actions were disabled.                                                                                  |
| Failure retains labelled previous rows/count/page and disables pagination | PASS   | Previous successful results remained visible and were identified as previous results; pagination was disabled.                                            |
| Retry succeeds for the failed query                                       | PASS   | Retry recovered and cleared the error state.                                                                                                              |
| Race scenario: latest request wins                                        | PASS   | The stale slower response did not overwrite the newer result.                                                                                             |
| Empty state uses page one                                                 | PASS   | Empty scenario displayed the empty state on page one.                                                                                                     |
| Keyboard access and visible focus                                         | PASS   | Tab navigation reached the controls and table interactions; focus was visible.                                                                            |
| Screen-reader announcement and accessible names                           | PASS   | Windows Narrator announced the search, status filter, table headers and pagination controls.                                                              |
| Cross-browser operation                                                   | PASS   | Manually tested in Google Chrome, Mozilla Firefox and Microsoft Edge on Windows. The application rendered and operated as expected in all three browsers. |
| Responsive layout on mobile and desktop                                   | PASS   | Manually checked on mobile (f12) and desktop screen sizes; the layout adapted and worked as expected.                                                     |

## Final automated verification — 23 November 2026

After the latest implementation changes, I ran the following commands successfully in the working checkout:

- `npm ci` — PASS: 225 packages added, 226 audited, zero vulnerabilities reported.
- `npm test` — PASS: all 3 test files and all 21 tests passed.
- `npm run lint` — PASS.
- `npm run build` — PASS: TypeScript compilation and Vite production build completed successfully.

Captured terminal output is stored in:

- `reports/npm-ci.txt`
- `reports/npm-test.txt`
- `reports/npm-lint.txt`
- `reports/npm-build.txt`

## Verification limitations

The manual checks above were not repeated against the final implementation revision. A fresh extraction of the final submission ZIP must also be verified using the documented installation, test, lint and build commands before submission.

Real API integration, authentication, authorisation, production load behaviour, macOS, Linux, Safari and other screen-reader combinations were not tested. The application uses synthetic local fixtures and does not require a backend or runtime network access.
