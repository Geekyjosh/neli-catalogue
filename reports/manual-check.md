# Manual verification record

**Date:** 23 November 2026  
**Environment:** Windows desktop and mobile screen sizes; Google Chrome, Mozilla Firefox and Microsoft Edge; local Vite development server; Windows Narrator.

**Manual-check scope:** The checks below cover the catalogue's core workflows, keyboard interaction, screen-reader accessibility, cross-browser operation and responsive layout. The results are recorded in the table.

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

## Final verification status

Manual verification:

- Browser checks - PASS in Google Chrome, Mozilla Firefox and Microsoft Edge.
- Keyboard interaction - PASS.
- Windows Narrator checks - PASS.
- Responsive layout - PASS at mobile and desktop screen sizes.

Final clean-extraction verification was completed on 23 November 2026 using the final submission archive, `neli-catalogue-submission.zip`.

The archive was extracted into a newly created, empty directory. Using Node.js 24.21.0 and npm 11.19.0, the following commands all passed:

- `npm ci` - PASS: 225 packages installed, 226 audited, zero vulnerabilities.
- `npm test` - PASS: 21 tests across 3 test files.
- `npm run lint` - PASS.
- `npm run build` - PASS: TypeScript compilation and Vite production build.

The ZIP integrity check (`unzip -t neli-catalogue-submission.zip`) also passed with no errors.

Production API integration, authentication, authorisation and cross-platform testing remain outside the scope of this assessment.

## Verification limitations

Real API integration, authentication, authorisation, production load behaviour, macOS, Linux, Safari and other screen-reader combinations were not tested. The application uses synthetic local fixtures and does not require a backend or runtime network access.
