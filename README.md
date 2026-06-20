# Student Loan Repayment Plan Estimator

A privacy-first, no-build static web app for estimating and comparing federal student loan repayment options. The app runs entirely in the browser and is designed for GitHub Pages deployment from repository files.

## Status

The static foundation, estimator UI, modular calculation engine, versioned rules, monthly simulation scaffolding, PSLF handling, rankings, recommendations, browser-session recovery, undo/reset/delete controls, support pages, and verification artifacts are implemented for public-beta review.

The estimator is educational planning software. It does not determine official eligibility, payment amounts, tax treatment, qualifying payment counts, or forgiveness. Borrowers should confirm official outcomes with Federal Student Aid, their servicer, and qualified tax/legal advisors.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Verification

```bash
node --test tests/unit/*.test.js tests/official-examples/*.test.js
```

```bash
python3 -m http.server 8000
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/
```

Detailed verification artifacts live in `docs/test-reports/`.

## Architecture commitments

- No framework.
- No production package dependencies.
- No build step.
- Relative URLs for GitHub Pages subpath compatibility.
- Source-backed rule and formula modules.
- Browser-only state; no analytics, backend, accounts, or tracking.

## Documentation

- `docs/PRD.md`
- `docs/architecture.md`
- `docs/calculation-methodology.md`
- `docs/rules-maintenance.md`
- `docs/testing.md`
- `docs/deployment.md`
- `docs/source-register.md`
