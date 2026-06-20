# 0007 Phase 3 Charts

## Scope

Phase 3 adds the PRD-required second chart and upgrades chart rendering from a static polyline-only graphic to interactive annual points with callouts.

## Implemented

- Added an Annual payment path chart section.
- Added a Remaining balance path chart section.
- Each chart includes a data-table alternative inside a disclosure control.
- Chart points expose exact plan/year/value callouts through hover, focus, click, and touch event handling.
- Active chart points and lines are visually highlighted while inactive series are de-emphasized.
- Escape clears the active chart callout.
- Chart rendering remains native inline SVG with no charting library.

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

Result: `/`, `/index.html`, `/js/app.js`, `/js/ui/charts/svg-line-chart.js`, and `/css/charts.css` returned HTTP 200.

## Remaining phases

Phase 3 does not complete final print-report sections, full source-backed formula/rule depth, or deployed-browser manual verification.
