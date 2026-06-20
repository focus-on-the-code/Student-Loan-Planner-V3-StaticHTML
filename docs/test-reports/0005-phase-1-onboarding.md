# 0005 Phase 1 Onboarding Workflow

## Scope

Phase 1 rebuilds the estimator entry workflow from one compact form into a five-step guided onboarding shell while keeping the existing static, no-build architecture.

## Implemented

- Five visible onboarding steps: loan overview, loan types/dates, income/household, forgiveness/history, and assumptions review.
- Quick/Detailed mode remains available at the start of the workflow.
- Detailed-mode starter fields are conditionally displayed.
- Unknown/skip controls were added for balance uncertainty, loan dates, and repayment history.
- “Why we ask” explanations were added to every step.
- Step Back/Next controls preserve values and keep results visible.

## Commands run

```bash
node --check js/app.js
```

Result: pass.

```bash
node --test tests/unit/*.test.js tests/official-examples/*.test.js
```

Result: 30 tests passed, 0 failed.

```bash
python3 -m http.server 8000
curl --retry 2 --retry-delay 1 -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/
```

Result: `/`, `/index.html`, `/js/app.js`, and `/css/components.css` returned HTTP 200.

## Remaining phases

Phase 1 does not complete results-table help controls, grouped show-all sections, dual interactive charts, final print report, or full source-backed formula/rule depth.
