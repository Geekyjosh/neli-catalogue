# Verification evidence

The following files contain the actual output captured from the candidate's local Windows working checkout on 23 November 2026:

- `npm-test.txt` — Vitest: 3 test files and 14 tests passed.
- `npm-lint.txt` — ESLint completed without errors or warnings.
- `npm-build.txt` — TypeScript project build and Vite production build passed.

The manual browser, scenario, keyboard and Windows Narrator results are recorded in `manual-check.md`.

**Clean-checkout limitation:** These command logs are from the working checkout, not a fresh clone. Before claiming clean-checkout verification, clone the submitted commit into a new directory, run `npm ci`, `npm test`, `npm run lint` and `npm run build`, and capture those outputs separately. Do not replace the existing logs with summaries or claim a clean-checkout pass before running those commands.
