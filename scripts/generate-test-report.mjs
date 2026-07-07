import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const reportPath = join('docs', 'test-report', 'results.json')
const outPath = join('docs', 'test-report', 'TEST_REPORT.md')

if (!existsSync(reportPath)) {
  console.error('Missing docs/test-report/results.json — run npm run test:e2e:ci first.')
  process.exit(1)
}

const report = JSON.parse(readFileSync(reportPath, 'utf-8'))

let passed = 0
let failed = 0
let skipped = 0
const suites = []

for (const suite of report.suites ?? []) {
  collectSpecs(suite, suite.title, suites)
}

function collectSpecs(suite, prefix, list) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const status = test.results?.[0]?.status ?? 'unknown'
      if (status === 'passed') passed++
      else if (status === 'failed') failed++
      else if (status === 'skipped') skipped++

      list.push({
        name: `${prefix} › ${spec.title}`,
        status,
        duration: test.results?.[0]?.duration ?? 0,
      })
    }
  }
  for (const child of suite.suites ?? []) {
    collectSpecs(child, `${prefix} › ${child.title}`, list)
  }
}

const total = passed + failed + skipped
const date = new Date().toISOString().split('T')[0]

const md = `# Playwright E2E Test Report

**Generated:** ${date}  
**Total tests:** ${total}  
**Passed:** ${passed}  
**Failed:** ${failed}  
**Skipped:** ${skipped}  
**Pass rate:** ${total > 0 ? Math.round((passed / total) * 100) : 0}%

## Summary

| Suite | Tests |
|-------|-------|
| Task management workflow | User registration, login, task CRUD, logout |
| Accessibility | WCAG checks (axe-core), keyboard navigation, ARIA |
| Responsive design | Mobile, tablet, desktop viewports |
| Error handling | Invalid login, validation errors, empty states |
| Product search | Search, filters, sort, pagination, error states |
| Documentation screenshots | Automated screenshot capture |

## Test Results

| Status | Test | Duration |
|--------|------|----------|
${suites.map((t) => `| ${t.status === 'passed' ? '✅' : t.status === 'failed' ? '❌' : '⏭️'} ${t.status} | ${t.name} | ${t.duration}ms |`).join('\n')}

## How to reproduce

\`\`\`bash
npm install
npx playwright install chromium
npm run test:e2e:ci
\`\`\`

Open the HTML report:

\`\`\`bash
open docs/test-report/html/index.html
\`\`\`
`

mkdirSync(join('docs', 'test-report'), { recursive: true })
writeFileSync(outPath, md)
console.log(`Wrote ${outPath} (${passed}/${total} passed)`)

// Copy HTML report if available
if (existsSync('playwright-report')) {
  cpSync('playwright-report', join('docs', 'test-report', 'html'), { recursive: true })
  console.log('Copied HTML report to docs/test-report/html/')
}
