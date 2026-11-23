# Lead Notes

## Delivery summary

The implementation separates catalogue query logic, the asynchronous adapter, request state, and presentation. The fixture remains the source of truth for the assessment demo.

## State ownership

- `App` owns the selected demo scenario, search input, status filter, page and page size.
- `useCatalogue` owns the latest successful response, loading state, error state and retry trigger.
- `fixtureAdapter` owns fixture scenario timing and simulated failure behavior.
- `getCataloguePage` is a pure function for filtering, sorting and pagination.

## Error and retry policy

A failed request does not clear the last successful data. The error is announced through an alert region and a retry action issues a fresh request. Loading state is shown independently so the existing table can remain visible while a new request is pending.

## Concurrency policy

Every effect invocation receives an incrementing request sequence. Only the currently active request may commit a success or failure. Effect cleanup also marks the request inactive, preventing updates after unmount or dependency changes.

## Blockers and assumptions

- The assessment provides synthetic data and simulated scenarios only.
- No production API schema, authentication method, authorization rules, or service-level expectations were supplied.
- The demo adapter should be replaced only after the backend contract and ownership are agreed.

## Adoption plan and owners

1. Frontend owner: confirm table columns, sorting rules, accessibility expectations and loading/error copy with product/design.
2. API owner: publish endpoint contract, pagination semantics, error model and authentication requirements.
3. Frontend owner: implement the production adapter against the approved contract without changing the UI-facing types unless required by the contract.
4. QA owner: add contract-level tests and verify keyboard, screen-reader, responsive and failure behavior against supported browsers.

## Verification gates

- `npm test` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Manually exercise all four fixture scenarios.
- Confirm keyboard operation and visible focus indicators.
- Verify that the fixture file is unchanged from the supplied assessment asset.

## Rollback

Revert the implementation commit on the feature branch. The fixture and Vite toolchain are independent of any production service and can be retained for local regression testing.
