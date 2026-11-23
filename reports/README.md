# Verification evidence

**Revision note:** I produced the captured `npm-*.txt` logs and the manual-check record on the earlier revision (14 tests). The latest revision adds and changes tests (expected total: 21 tests), pins exact dependency versions, removes unused template assets and fixes the `pageSize` prop. Status of that revision: **NOT RUN**. Re-run the commands in README.md and replace these logs.

The following files contain the actual output I captured from my local Windows working checkout on 23 November 2026:

- `npm-test.txt` — Vitest: 3 test files and 14 tests passed.
- `npm-lint.txt` — ESLint completed without errors or warnings.
- `npm-build.txt` — TypeScript project build and Vite production build passed.

I recorded the manual browser, scenario, keyboard and Windows Narrator results in `manual-check.md`.

## Fresh-clone verification

I created a new clone in `neli-catalogue-clean` on 23 November 2026.

- `npm ci`: completed successfully; 225 packages added, 226 audited, 0 vulnerabilities reported.
- `npm test`: the first combined invocation encountered one intermittent Vitest thread-worker startup timeout while 9 tests had passed. Running `npm test` separately immediately afterward passed all 3 test files and all 14 tests, with no unhandled errors.
- `npm run lint`: passed.
- `npm run build`: TypeScript compilation and Vite production build passed.

I ran the fresh-clone commands against the committed repository after cloning, using the project runtime specified above. I have disclosed the initial worker timeout rather than omitted it. The captured `npm-test.txt`, `npm-lint.txt` and `npm-build.txt` files remain the original working-checkout logs; I recorded the clean-clone results above from my terminal session.
