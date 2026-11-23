# Manual verification record

**Date:** 23 November 2026  
**Environment:** Windows desktop and mobile screen sizes; Google Chrome, Mozilla Firefox and Microsoft Edge; local Vite development server; Windows Narrator.  
**Record:** I performed these checks against the current local project and confirmed the results in the assessment session.

| Check                                                                     | Status | Notes                                                                                                                                                       |
| ------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal scenario loads products                                            | PASS   | Product rows and controls displayed.                                                                                                                        |
| Search matches product name                                               | PASS   | Matching product results displayed.                                                                                                                         |
| Search matches SKU                                                        | PASS   | Partial SKU search returned matching products.                                                                                                              |
| Status filters and page reset                                             | PASS   | Changing search/status returned the view to page one.                                                                                                       |
| Pagination and disabled boundaries                                        | PASS   | Previous/Next changed pages; unavailable boundary actions were disabled.                                                                                    |
| Failure retains labelled previous rows/count/page and disables pagination | PASS   | Previous successful results remained visible and were identified as previous results; pagination was disabled.                                              |
| Retry succeeds for the failed query                                       | PASS   | Retry recovered and cleared the error state.                                                                                                                |
| Race scenario: latest request wins                                        | PASS   | The stale slower response did not overwrite the newer result.                                                                                               |
| Empty state uses page one                                                 | PASS   | Empty scenario displayed the empty state on page one.                                                                                                       |
| Keyboard access and visible focus                                         | PASS   | Tab navigation reached the controls and table interactions; focus was visible.                                                                              |
| Screen-reader announcement and accessible names                           | PASS   | Windows Narrator announced the search, status filter, table headers and pagination controls.                                                                |
| Cross-browser operation                                                   | PASS   | I manually tested on Windows in Google Chrome, Mozilla Firefox and Microsoft Edge; the application rendered and operated as expected in all three browsers. |
| Responsive layout on mobile and desktop                                   | PASS   | I manually checked on mobile and desktop screen sizes; the layout adapted and worked as expected.                                                           |

## Automated verification — working checkout

I ran the following commands in my local working checkout, and they completed successfully:

- `npm test`: 3 test files passed, 14 tests passed.
- `npm run lint`: passed with no errors or warnings.
- `npm run build`: TypeScript compilation and Vite production build passed.

I stored the captured terminal output in `npm-test.txt`, `npm-lint.txt` and `npm-build.txt`.

## Clean-clone verification

I created a fresh clone in `neli-catalogue-clean` using Node.js 24.21.0 (the version specified in `.nvmrc`) and npm 11.19.0, and installed dependencies using `npm ci`:

- **npm ci - PASS:** 225 packages added, 226 audited, 0 vulnerabilities reported.
- **npm test - PASS:** the first combined invocation encountered an intermittent worker-startup timeout. A separate immediate rerun passed all 3 test files and all 14 tests with no unhandled errors.
- **npm run lint - PASS.**
- **npm run build - PASS:** TypeScript compilation and Vite production build completed successfully.

I have kept the first transient worker-startup error in this record for transparency; the standalone rerun was clean.
