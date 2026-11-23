# Verification evidence

The following files contain the actual output captured from the candidate's local Windows working checkout on 23 November 2026:

- `npm-test.txt` — Vitest: 3 test files and 14 tests passed.
- `npm-lint.txt` — ESLint completed without errors or warnings.
- `npm-build.txt` — TypeScript project build and Vite production build passed.

The manual browser, scenario, keyboard and Windows Narrator results are recorded in `manual-check.md`.

## Fresh-clone verification

A new clone was created in `neli-catalogue-clean` on 23 November 2026.

- `npm ci`: completed successfully; 225 packages added, 226 audited, 0 vulnerabilities reported.
- `npm test`: the first combined invocation encountered one intermittent Vitest thread-worker startup timeout while 9 tests had passed. Running `npm test` separately immediately afterward passed all 3 test files and all 14 tests, with no unhandled errors.
- `npm run lint`: passed.
- `npm run build`: TypeScript compilation and Vite production build passed.

The fresh-clone commands were run against the committed repository after cloning. The initial worker timeout is disclosed rather than omitted. The captured `npm-test.txt`, `npm-lint.txt` and `npm-build.txt` files remain the original working-checkout logs; the clean-clone results above are recorded from the terminal session.

## Remaining untested

Responsive layout across different screen sizes was not separately tested. Cross-browser manual verification was completed on Windows in Google Chrome, Mozilla Firefox and Microsoft Edge; the application rendered and operated as expected in all three.
