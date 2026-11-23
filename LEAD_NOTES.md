# Lead Notes

## State ownership
- **App** (demo only) owns the selected scenario and builds the adapter from it.
- **Catalogue** owns the search text, status filter and requested page. Any filter change resets the page to 1. `pageSize` comes from props.
- **useCatalogue** owns the last successful response with the query that produced it, the loading flag, the error and the retry trigger.
- **Adapter** owns data access only. The view never sees fixtures or scenarios.
- **getCataloguePage** is a pure function (filter, sort, paginate) used by the mock adapter.

## Error and retry policy
A failure never clears the last successful rows. They are labelled as previous results, and count and page position describe that earlier result. Pagination is disabled until a query succeeds. With no earlier result, nothing is shown except the error. Retry re-runs the failed query only. Any filter change starts a newer request, which clears the error and withdraws Retry, including while loading. There is no automatic retry, so a flaky API cannot cause a request storm.

## Concurrency
Each effect run gets an incrementing request id and is invalidated on cleanup. Only the latest id may commit a success or an error, so out-of-order responses and late failures from older requests are ignored. This does not rely on timing. A shrunken total triggers one last-page request under the same rule.

## Review blockers (before production use)
1. No abort signal is passed to the adapter, so superseded requests still run to completion server-side.
2. Responses are not validated at runtime. A real adapter needs schema checks.
3. After last-page recovery the requested page in `Catalogue` is not updated, so the view and the requested query briefly disagree. Lift the recovered page into state.
4. The component needs a stable `fetchPage` reference. An inline function refetches on every parent render.
5. The API contract, authentication and error model are undefined, so the adapter cannot be reviewed yet.
6. Sorting uses `localeCompare("en")` with base sensitivity. Confirm that product and design want accent-insensitive ordering.

## Adoption plan
| Step | Owner | Gate |
|---|---|---|
| Agree API contract, auth and error model | API owner | Written contract |
| Build the real `FetchPage`, add `AbortSignal` and runtime validation | Frontend owner | Adapter contract tests pass |
| Security and licence review, reuse terms | Security/product | Sign-off recorded |
| Behind a feature flag, run beside the old table | Frontend lead | `npm ci`, test, lint and build green; manual keyboard and screen-reader pass |
| Ramp to all users | Product owner | No rise in error rate or support tickets |

## Rollback
Switch the feature flag off to restore the old table immediately. If needed, revert the adapter commit. The view and fixture adapter stay unchanged, so the demo and tests remain a regression baseline.
