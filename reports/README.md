# Verification Reports

This directory contains the assessment's manual and automated verification records.

## Final automated verification

Completed on 23 November 2026 using Node.js 24.21.0 and npm 11.19.0.

| Command         | Result                                                           |
| --------------- | ---------------------------------------------------------------- |
| `npm ci`        | PASS - 225 packages installed, 226 audited, zero vulnerabilities |
| `npm test`      | PASS - 21 tests across 3 test files                              |
| `npm run lint`  | PASS                                                             |
| `npm run build` | PASS - TypeScript compilation and Vite production build          |

## Clean-extraction verification

The final `neli-catalogue-submission.zip` archive was extracted into a newly created, empty directory on 23 November 2026.

- `npm ci` - PASS: 225 packages installed, 226 audited, zero vulnerabilities.
- `npm test` - PASS (21/21 tests across 3 files). The first attempt encountered an intermittent Vitest thread-worker startup timeout; an immediate rerun passed all tests.
- `npm run lint` - PASS.
- `npm run build` - PASS.

Environment: Node.js 24.21.0, npm 11.19.0.

The archive was also checked using `unzip -t`. No errors were detected in the compressed data.

## Report files

- `manual-check.md` - manual browser, keyboard, screen-reader and responsive-layout verification.
- `npm-ci.txt` - dependency installation output.
- `npm-test.txt` - automated test output.
- `npm-lint.txt` - ESLint output.
- `npm-build.txt` - TypeScript and production build output.
