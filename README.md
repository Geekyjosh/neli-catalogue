# Neli Catalogue

A React + TypeScript product catalogue assessment demonstrating asynchronous data loading, search, status filtering, pagination, deterministic alphabetical sorting, request-race protection and recoverable errors.

## Requirements
- Node.js LTS and npm.

## Install and run
```bash
npm install
npm run dev
```

## Verification
```bash
npm test
npm run lint
npm run build
```

## Features
- Case-insensitive search across product names and SKUs.
- All, Active, Draft and Archived filters.
- Five products per page with previous/next controls.
- Alphabetical sorting with an ID tie-breaker for duplicate names.
- Promise-based fixture adapter.
- Latest-request-wins concurrency handling.
- Previous successful data is retained when a request fails; retry is available.
- Empty, loading and error states.
- Keyboard-accessible controls and semantic table markup.

## Fixture scenarios
Select a scenario from the Demo scenario control:
- **Normal:** resolves after 100 ms.
- **Failure:** the first request rejects; retry succeeds.
- **Race:** the first request takes 600 ms and the second 50 ms.
- **Empty:** returns no matching products.

The supplied `fixtures/catalogue.json` is intentionally kept unchanged.
