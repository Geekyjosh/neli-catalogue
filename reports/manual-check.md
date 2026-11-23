# Manual verification record

**Environment:** Windows desktop, Chrome, local Vite development server.
**Status after the latest implementation refactor:** NOT RUN.

The candidate previously reported that the normal, race, failure/retry and empty demo scenarios worked, and that keyboard Tab navigation and visible focus indicators worked. Those checks were performed before the latest reusable-component and page-boundary changes. They must be repeated against the current commit before submission.

| Check | Status | Notes |
|---|---|---|
| Normal scenario loads products | NOT RUN after latest changes | |
| Search matches product name and SKU | NOT RUN after latest changes | |
| Status filters and page reset | NOT RUN after latest changes | |
| Pagination and disabled boundaries | NOT RUN after latest changes | |
| Failure retains labelled previous rows/count/page and disables pagination | NOT RUN after latest changes | |
| Retry succeeds for the failed query | NOT RUN after latest changes | |
| Race scenario: latest request wins | NOT RUN after latest changes | |
| Empty state uses page one | NOT RUN after latest changes | |
| Keyboard access and visible focus | NOT RUN after latest changes | |
| Screen-reader announcement and accessible names | NOT RUN | Requires a screen-reader check; keyboard-only testing is not a substitute. |

Do not change NOT RUN to PASS until the corresponding check has been completed on the final local checkout.
