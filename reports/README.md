# Verification command output

This file is reserved for captured output from the final clean-checkout verification.

After pulling the final commit and running the commands locally, capture output with:

```bash
npm test 2>&1 | tee reports/npm-test.txt
npm run lint 2>&1 | tee reports/npm-lint.txt
npm run build 2>&1 | tee reports/npm-build.txt
```

Record the actual command output. Do not replace it with a summary or claim a pass when a command has not been run.
