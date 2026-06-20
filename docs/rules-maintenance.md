# Rules Maintenance

Rules are versioned under `js/rules/versions/<effective-date>/`. Annual data is under `js/rules/annual/<year>/`. Each plan definition must include a formula ID, eligibility-rule ID, source IDs, summary, and required borrower fields.

When official rules change, add a new version folder rather than silently mutating historical behavior.
