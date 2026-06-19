---
title: "Student Loan Repayment Plan Estimator V2"
subtitle: "Product Requirements Document, Static Software Architecture, and Codex Build Plan"
author: "Neon Dreams Engineering Division"
date: "June 2026"
version: "2.1 - Two-Pass Plain HTML, CSS, and JavaScript Build"
---

# Contents

- [Document status](#document-status)
- [1. Executive summary](#1-executive-summary)
- [2. Architecture decision](#2-architecture-decision)
- [3. Product identity](#3-product-identity)
- [4. Product goals and non-goals](#4-product-goals-and-non-goals)
- [5. Intended users](#5-intended-users)
- [6. Release scope](#6-release-scope)
- [7. Legal, tax, and estimation posture](#7-legal-tax-and-estimation-posture)
- [8. Information architecture](#8-information-architecture)
- [9. Core user experience](#9-core-user-experience)
- [10. Input requirements](#10-input-requirements)
- [11. Unknown, skipped, and assumed information](#11-unknown-skipped-and-assumed-information)
- [12. Eligibility and plan-display rules](#12-eligibility-and-plan-display-rules)
- [13. Calculation-engine requirements](#13-calculation-engine-requirements)
- [14. PSLF requirements](#14-pslf-requirements)
- [15. Recommendations and plain-language results](#15-recommendations-and-plain-language-results)
- [16. Charts and data visualization](#16-charts-and-data-visualization)
- [17. Print and browser-PDF report](#17-print-and-browser-pdf-report)
- [18. Visual design system](#18-visual-design-system)
- [19. Accessibility requirements](#19-accessibility-requirements)
- [20. Privacy and security](#20-privacy-and-security)
- [21. Static technical architecture](#21-static-technical-architecture)
- [22. Repository structure](#22-repository-structure)
- [23. GitHub Pages deployment](#23-github-pages-deployment)
- [24. Rules and annual-data architecture](#24-rules-and-annual-data-architecture)
- [25. Testing strategy](#25-testing-strategy)
- [26. Performance and browser compatibility](#26-performance-and-browser-compatibility)
- [27. Error handling](#27-error-handling)
- [28. Documentation requirements](#28-documentation-requirements)
- [29. Migration from the SvelteKit repository](#29-migration-from-the-sveltekit-repository)
- [30. Two-pass Codex development process](#30-two-pass-codex-development-process)
- [31. Phased build plan](#31-phased-build-plan)
- [32. Codex execution contract](#32-codex-execution-contract)
- [33. Acceptance criteria](#33-acceptance-criteria)
- [34. Risks and mitigations](#34-risks-and-mitigations)
- [35. Definition of done](#35-definition-of-done)
- [36. Initial official source register](#36-initial-official-source-register)
- [Appendix A. Required plan IDs](#appendix-a-required-plan-ids)
- [Appendix B. Core data model](#appendix-b-core-data-model)
- [Appendix C. GitHub Pages owner setup](#appendix-c-github-pages-owner-setup)
- [Appendix D. AGENTS.md minimum content](#appendix-d-agentsmd-minimum-content)

# Document status

| Field | Value |
|---|---|
| Product | Student Loan Repayment Plan Estimator V2 |
| Tagline | Estimate. Compare. Plan. |
| Product owner | Neon Dreams Engineering Division |
| Repository | `focus-on-the-code/Student-Loan-Planner` |
| Planned public URL | `https://focus-on-the-code.github.io/Student-Loan-Planner/` |
| Release target | Public beta |
| Architecture | Plain static HTML, CSS, and JavaScript |
| JavaScript model | Native browser ES modules; no framework |
| Backend | None |
| Build step | None |
| Package manager | None required for production |
| Hosting | GitHub Pages |
| Deployment | Publish directly from `main` branch, repository root |
| Development process | Two-pass Codex process: foundation/deployment proof, then full estimator |
| Rules review baseline | June 18, 2026 |
| Privacy model | All borrower data remains in the browser; no analytics or tracking |
| Accessibility target | WCAG 2.2 Level AA |
| Copyright | © June 2026 Neon Dreams Engineering Division |

# 1. Executive summary

The Student Loan Repayment Plan Estimator is a privacy-first, browser-based public-beta tool that helps current and prospective federal student loan borrowers estimate and compare repayment options. It is an estimator, not an official eligibility determination, loan-servicing tool, tax calculator, or source of financial or legal advice.

This revision deliberately removes SvelteKit, TypeScript compilation, npm dependencies, adapter configuration, prerendering, Playwright installation, and custom GitHub Actions deployment. The production application will consist only of files that a browser can open directly: HTML, CSS, JavaScript, JSON, and image assets.

The deployment model is intentionally simple:

```text
Edit static files
  -> commit to the main branch
  -> GitHub Pages republishes the repository root
  -> visitors receive the updated HTML, CSS, and JavaScript
```

There is no compilation step between the repository and the deployed site. The files committed to `main` are the files delivered to users. This sharply reduces the number of configuration layers and failure points.

The application will still use a modular architecture. The interface, state management, rules, calculations, charts, and content will be kept in separate browser-native JavaScript modules. The app will use standard browser features such as ES modules, `sessionStorage`, SVG, semantic HTML, native form controls, and print stylesheets.

The primary experience remains a one-page estimator. After onboarding, the borrower can edit inputs directly beside the results and see estimates update live. The default comparison shows the three clearly eligible plans with the lowest current monthly payments, using projected total borrower payments as the tie-breaker. A control expands the same comparison to show all remaining plans, including potentially eligible, unavailable, and ineligible plans with concise explanations.

Development must use the two-pass Codex process defined in Section 30: first prove the static foundation and deployed GitHub Pages path, then implement the complete estimator on top of that verified base.

The current single-file HTML prototype remains the visual and interaction reference. The production repository will divide that prototype into maintainable files without changing the overall product experience. The user-facing “Design tone / Light vaporwave” description card must be removed. The visual influence remains an internal design direction, not product copy.

# 2. Architecture decision

## 2.1 Decision

Build the production estimator as a static website using only:

- HTML5;
- CSS3;
- modern browser JavaScript;
- native ES modules;
- JSON or JavaScript data modules;
- SVG and PNG assets.

Do not use:

- Svelte or SvelteKit;
- TypeScript compilation;
- React, Vue, Angular, or another framework;
- Vite, Webpack, Rollup, Parcel, or another bundler;
- npm packages required to run the production site;
- Node.js during deployment;
- a server, database, API, or serverless function;
- a custom GitHub Actions deployment workflow.

## 2.2 Why this architecture was selected

The product is a static calculator. It does not require:

- server rendering;
- authenticated accounts;
- database access;
- secret API keys;
- server-side form processing;
- dynamic route generation;
- file uploads;
- background jobs.

The earlier framework implementation introduced infrastructure that was not required by the product: dependency installation, generated configuration files, framework adapters, prerender rules, build artifacts, lockfiles, formatter integrations, browser-test installation, and multiple Actions workflows. The revised architecture removes those layers while preserving the calculation and user-interface requirements.

## 2.3 Architectural principle

**Simple deployment does not mean one giant file.**

The production app should not return to a single several-thousand-line HTML file. It should use multiple static files connected by normal relative paths and browser-native module imports.

Example:

```html
<link rel="stylesheet" href="./css/main.css">
<link rel="stylesheet" href="./css/print.css" media="print">
<script type="module" src="./js/app.js"></script>
```

```js
// js/app.js
import { createEstimatorStore } from './state/estimator-store.js';
import { calculateScenario } from './engine/calculate-scenario.js';
import { renderApplication } from './ui/render-application.js';
```

## 2.4 Consequences

Benefits:

- direct GitHub Pages branch deployment;
- no production dependency installation;
- no adapter or prerender configuration;
- no framework-generated files;
- no build artifact folder;
- easier local inspection and debugging;
- every deployed file is visible in the repository;
- lower long-term maintenance burden;
- faster first recovery from a broken deployment.

Tradeoffs:

- the team must impose its own module boundaries;
- DOM rendering code is more manual;
- there is no compile-time TypeScript enforcement;
- advanced component patterns are not provided by a framework;
- tests must be deliberately designed without depending on a framework test ecosystem.

Mitigation:

- use strict JavaScript modules;
- use JSDoc types and `// @ts-check` in important modules;
- keep modules small and single-purpose;
- use schemas and runtime validation at boundaries;
- use native browser test pages and optional Node built-in tests;
- document every public module API.

# 3. Product identity

## 3.1 Name and tagline

**Product name:** Student Loan Repayment Plan Estimator  
**Tagline:** Estimate. Compare. Plan.

## 3.2 Attribution

The product remains brand-neutral and must not imply affiliation with the U.S. Department of Education, Federal Student Aid, a loan servicer, a law firm, a tax professional, or a financial advisory firm.

The footer must include:

> © June 2026 Neon Dreams Engineering Division

No contact email is required.

## 3.3 Logo requirements

Use the approved visual direction: an abstract, brand-neutral mark combining:

- three ascending or diverging repayment-path lines;
- a small horizon, arc, or sun form;
- pastel blue, pink, yellow, and orange accents;
- a dark navy or near-black wordmark;
- simple geometry that remains legible at favicon size.

The logo must not use:

- a government seal or government-like insignia;
- a graduation cap;
- a dollar sign;
- a bank building;
- a shield that implies official certification;
- third-party trademarks.

Required assets:

- `assets/brand/logo-horizontal.svg`
- `assets/brand/logo-mark.svg`
- `assets/brand/logo-monochrome.svg`
- `assets/brand/favicon.svg`
- `assets/brand/favicon-32.png`
- `assets/brand/apple-touch-icon.png`

All site paths must be relative, not root-absolute. Use:

```html
<img src="./assets/brand/logo-horizontal.svg" alt="Student Loan Repayment Plan Estimator">
```

Do not use:

```html
<img src="/logo.svg" alt="...">
```

The latter points to the domain root and can break on a GitHub Pages project site.

# 4. Product goals and non-goals

## 4.1 Product goals

1. Let a borrower obtain a useful estimate with only a small set of inputs.
2. Let a borrower add details when known without blocking progress when information is unknown.
3. Distinguish clearly eligible, potentially eligible, unavailable, and ineligible plans.
4. Explain why a plan is or is not shown.
5. Estimate monthly, annual, and lifetime borrower costs under each modeled plan.
6. Show how payments and balances may change over time.
7. Explain plan-specific benefits and tradeoffs, including RAP interest protection and principal support.
8. Model PSLF at an estimator level when the borrower supplies public-service assumptions.
9. Provide an estimate-quality indicator based on input completeness.
10. Keep all financial and household information inside the browser.
11. Meet WCAG 2.2 Level AA and work well on current mobile and desktop browsers.
12. Make legal and annual rule changes maintainable through versioned, source-backed data modules.
13. Deploy automatically when static files on the publishing branch change, without a custom build pipeline.

## 4.2 Non-goals

Version 1 must not:

- provide an official repayment-plan eligibility determination;
- apply for, enroll in, or switch a borrower’s repayment plan;
- connect to StudentAid.gov or a loan servicer;
- import NSLDS or credit-report data;
- store user accounts or cloud scenarios;
- calculate a complete federal or state tax return;
- recommend a tax filing status as tax advice;
- model private student loans as federal repayment-plan options;
- provide legal, tax, investment, or financial advice;
- scrape federal websites automatically;
- use runtime network requests to obtain rules or borrower information;
- include advertising, analytics, tracking pixels, session replay, or behavior profiling;
- include a PDF-generation library;
- include side-by-side saved-scenario comparison;
- include a custom domain;
- require Node.js, npm, or a framework to deploy the production site.

# 5. Intended users

## 5.1 Primary audience

The estimator is intended for:

- current federal student loan borrowers;
- new borrowers planning repayment;
- Parent PLUS borrowers;
- graduate and professional borrowers;
- public-service employees exploring PSLF;
- borrowers with FFEL or Perkins loans;
- financial-aid counselors and nonprofit educators using the estimator as an explanatory aid.

The interface must assume beginner-level financial literacy by default. Technical details must remain available through expandable explanations, methodology content, source links, and calculation disclosures.

## 5.2 Representative user needs

### Borrower seeking the lowest current payment

“I need to know which eligible plan has the lowest payment now and what I may give up in exchange.”

### Borrower minimizing lifetime cost

“I can afford more now, but I want to know which plan is expected to cost the least overall.”

### Public-service borrower

“I need to understand which eligible plans support PSLF and how my existing qualifying months change the projection.”

### Parent PLUS borrower

“I need the tool to recognize that my options differ from ordinary Direct Loan borrowers and tell me which details are missing.”

### Borrower with incomplete records

“I do not know every disbursement date or prior repayment-plan detail, but I still want a useful estimate and a list of facts I need to confirm.”

### Counselor

“I need a transparent estimate that explains its assumptions and can be printed for discussion.”

# 6. Release scope

## 6.1 Loan-program scope

Version 1 supports federal loans only:

- Direct Subsidized Loans;
- Direct Unsubsidized Loans;
- Direct PLUS Loans made to graduate or professional students;
- Direct Parent PLUS Loans;
- Direct Consolidation Loans;
- FFEL Subsidized and Unsubsidized Loans;
- FFEL PLUS and Consolidation Loans;
- Federal Perkins Loans.

Private loans are out of scope. The UI may display a short informational message explaining that private-loan repayment is determined by the private lender and is not modeled.

## 6.2 Repayment-plan scope

| Plan or path | Version 1 treatment |
|---|---|
| Repayment Assistance Plan (RAP) | Full estimator model |
| Tiered Standard | Full estimator model |
| Standard Repayment | Full estimator model |
| Graduated Repayment | Full estimator model |
| Extended Repayment | Full estimator model |
| Income-Based Repayment, 10% variant | Full estimator model |
| Income-Based Repayment, 15% variant | Full estimator model |
| Pay As You Earn (PAYE) | Formula model with strict grandfathering and uncertainty handling |
| Income-Contingent Repayment (ICR) | Full estimator model, including annual factor tables |
| FFEL Income-Sensitive Repayment | Estimator model with documented lender-formula limitation |
| Perkins repayment | Estimator and informational model |
| Parent PLUS transition routes | Eligibility and scenario modeling to estimator-level fidelity |
| PSLF | Projection layer over qualifying repayment plans |
| Alternative Repayment Plan | Informational only; no invented custom payment formula |
| SAVE/REPAYE | Historical or unavailable status unless future official rules restore availability |

The application must be rules-version aware and must not present every plan as universally available.

# 7. Legal, tax, and estimation posture

## 7.1 Required disclaimer

The main estimator and print report must display a concise version of the following. The methodology page must display the full version.

> This tool provides estimates for educational and planning purposes only. It is not financial, tax, or legal advice and does not determine official eligibility, payment amounts, qualifying payment counts, or forgiveness. Federal student loan rules can change, and individual results depend on loan records and circumstances that may not be fully represented here. Before making a final decision, confirm current rules and account information with Federal Student Aid and your loan servicer, and consider advice from qualified financial, tax, or legal professionals who represent your interests.

## 7.2 Tax disclaimer

Whenever forgiveness tax is shown, display:

> This is a simplified estimate, not a tax calculation. The estimator does not determine whether a discharge is taxable or calculate your full federal or state tax liability.

## 7.3 Filing-status disclaimer

When comparing married filing jointly and married filing separately, display:

> This comparison shows estimated student-loan effects only. It does not calculate the broader tax costs, credits, deductions, or filing consequences of either status.

## 7.4 Terminology

Use “estimate,” “projected,” and “potential” consistently. Avoid “guaranteed,” “you qualify,” and “best plan” without qualification. Prefer:

- “Appears eligible based on your entries”;
- “Potentially eligible - more information is needed”;
- “Lowest estimated payment now”;
- “Lowest projected borrower payments under these assumptions.”

# 8. Information architecture

Use actual static HTML files rather than framework routes.

| File | Public path | Purpose |
|---|---|---|
| `index.html` | `/Student-Loan-Planner/` | Landing, guided input, live editor, results, charts, plan details |
| `methodology.html` | `/Student-Loan-Planner/methodology.html` | Calculation approach, assumptions, rounding, limitations |
| `sources.html` | `/Student-Loan-Planner/sources.html` | Official source registry, rules version, review date |
| `accessibility.html` | `/Student-Loan-Planner/accessibility.html` | Accessibility statement and interaction guidance |
| `404.html` | GitHub Pages fallback | Friendly not-found page with link back to estimator |

Use relative links:

```html
<a href="./methodology.html">Methodology</a>
```

Do not use framework routing, hash routing, or history-API routing.

No sensitive input may be encoded in URLs, hashes, or query strings.

# 9. Core user experience

## 9.1 Landing state

The landing state must include:

- product logo, name, and tagline;
- a one-sentence explanation;
- a clear “Start estimate” button;
- brief privacy statement: “Your information stays in this browser.”;
- short disclaimer;
- links to Methodology, Sources, and Accessibility.

Do not show a card explaining the design aesthetic. The words “vaporwave,” “80s,” and “design tone” must not appear in the production user interface.

## 9.2 Input-mode choice

At the start, users can choose:

- **Quick estimate:** aggregated balance and a small number of household assumptions;
- **Detailed estimate:** loan-level entries and expanded repayment history.

The default is Quick estimate. Detailed mode must remain available before and after results.

## 9.3 Guided onboarding

Recommended structure:

1. Loan overview
2. Loan types and dates
3. Income and household
4. Forgiveness and repayment history
5. Assumptions review

Nonessential questions must include “I don’t know” or “Skip for now.” Skipping must not block progress.

Each question that materially affects eligibility must include a short “Why we ask” explanation.

The onboarding experience may remain inside one `index.html` document. JavaScript controls which sections are visible. Use semantic sections and preserve form values when the user moves between steps.

## 9.4 Results workspace

After initial calculation, the page becomes a live scenario workspace:

- results remain visible;
- a persistent editable input panel appears on desktop;
- a sticky “Adjust estimate” button opens a drawer or dialog on mobile;
- changes recalculate after a 300-500 ms debounce;
- existing results remain visible while updating;
- a small “Updating estimate...” status appears;
- significant changes are announced through an `aria-live="polite"` region.

The user must never be forced back through the original onboarding sequence to change an input.

## 9.5 Undo, reset, and delete behavior

### Undo

- Maintain a session-only undo history of up to 20 meaningful scenario snapshots.
- Group rapid typing into one history entry after the input debounce.
- Only user-input state belongs in the history.
- Disable Undo when no prior state exists.

### Reset estimate

- Ask for confirmation.
- Return fields to recommended defaults.
- Clear results and return to the initial input state.

### Delete all entered data

Button label:

> Delete all entered data

Confirmation copy:

> This clears the information currently entered in this browser session. It does not delete reports you previously printed or saved.

Behavior:

- clear in-memory state;
- clear session recovery data;
- clear undo history;
- clear application UI preferences stored in session storage;
- return to the landing state;
- do not claim to delete browser downloads or arbitrary files.

# 10. Input requirements

## 10.1 Quick-estimate inputs

### Essential inputs

- total federal student loan balance;
- average interest rate;
- current or expected adjusted gross income;
- family size;
- broad loan program or type selection;
- whether the borrower expects public-service employment.

### Optional quick inputs

- current repayment plan;
- whether any Direct Loan was first disbursed on or after July 1, 2026;
- Parent PLUS involvement;
- tax filing status;
- spouse AGI;
- spouse eligible federal student loan debt;
- RAP dependents;
- existing IDR count;
- existing PSLF count;
- federal forgiveness tax rate;
- state forgiveness tax rate.

## 10.2 Detailed-estimate inputs

The detailed mode must support multiple loans with these fields:

- stable local loan ID;
- program: Direct, FFEL, or Perkins;
- subtype;
- current principal;
- accrued interest, optional;
- interest rate;
- first disbursement date, optional;
- repayment-entry date, optional;
- consolidation date, optional;
- whether the consolidation includes Parent PLUS debt;
- current plan, optional;
- current status: repayment, grace, deferment, forbearance, default, unknown;
- official IDR qualifying count, optional;
- official PSLF qualifying count, optional.

Repayment-history inputs are manual and optional:

- months under prior plans;
- consolidation events;
- SAVE or REPAYE history;
- administrative forbearance periods;
- deferment periods;
- default periods;
- dates where known.

Unknown history must reduce certainty and must not silently be interpreted as zero.

## 10.3 Household and tax inputs

- current AGI;
- spouse AGI;
- tax filing status;
- family size;
- RAP tax dependents;
- spouse eligible federal debt;
- poverty-guideline region: contiguous states/DC, Alaska, Hawaii;
- optional federal forgiveness tax rate;
- optional state forgiveness tax rate.

The application must not maintain a state-by-state tax-law database.

## 10.4 Projection assumptions

| Assumption | Default | Editable |
|---|---:|---|
| Annual income growth | 3.0% | Yes |
| General inflation | 2.5% | Yes |
| Future poverty-guideline growth | 2.5% | Yes |
| Family size | Constant | Yes |
| Federal forgiveness tax rate | 25% | Yes |
| State forgiveness tax rate | 0% | Yes |
| Interest rate | Fixed per loan | No future change unless loan is variable |
| Retirement or income decline | None | Optional detailed event |

The app must show all defaults in the assumptions summary.

# 11. Unknown, skipped, and assumed information

Unknown is a first-class value. It must never be automatically converted to “No,” zero, or false when the distinction affects eligibility.

## 11.1 Eligibility behavior

Plans must use one of four user-facing statuses:

1. **Appears eligible**
2. **Potentially eligible**
3. **Not eligible based on entries**
4. **Unavailable or informational**

A potentially eligible plan must not occupy a default top-three eligible position.

For every potentially eligible or ineligible plan, provide:

- a one-sentence reason;
- a short list of missing or disqualifying facts;
- a direct control to edit the relevant inputs.

## 11.2 Mathematical defaults

When a calculation can proceed using a reasonable default, attach an assumption record containing:

- field name;
- assumed value;
- reason;
- effect category: payment, eligibility, timeline, tax, or confidence;
- user-facing explanation.

## 11.3 Estimate-quality indicator

### Basic estimate

Only essential or aggregated inputs are available. Some plan eligibility is uncertain.

### Improved estimate

Loan program, loan type, rate, key cohort dates, and major household fields are supplied.

### Detailed estimate

Most loan-level, consolidation, household, and repayment-history fields are supplied.

The quality label represents input completeness, not guaranteed accuracy. Display the missing information that would most improve the estimate.

# 12. Eligibility and plan-display rules

## 12.1 Eligibility engine output

Eligibility must be computed separately from payment simulation.

```js
/**
 * @typedef {'eligible'|'potentially_eligible'|'ineligible'|'unavailable'} EligibilityStatus
 *
 * @typedef {Object} EligibilityResult
 * @property {string} planId
 * @property {EligibilityStatus} status
 * @property {string[]} reasonCodes
 * @property {string} userMessage
 * @property {string[]} missingFields
 * @property {string} effectiveRuleVersion
 * @property {string[]} sourceIds
 */
```

The calculation engine must not infer eligibility from payment affordability.

## 12.2 Default top-three comparison

The comparison card initially shows no more than three plans meeting all of these conditions:

- `eligibility.status === 'eligible'`;
- simulation completes without a blocking error;
- plan is not informational-only or unavailable.

Sort order:

1. `monthlyPaymentNow` ascending;
2. `totalBorrowerPayments` ascending;
3. stable plan display order as final deterministic tie-breaker.

This sorting must rerun after every input change.

If fewer than three plans are clearly eligible, show only those plans and explain that additional options may require more information.

## 12.3 Expanded comparison

Button labels:

- collapsed: **Show all plans**;
- expanded: **Show top 3**.

Expanded grouping:

1. other eligible plans;
2. potentially eligible plans;
3. unavailable or informational plans;
4. ineligible plans.

The detailed plan-card section must use the same ordering logic.

## 12.4 Column help

Every comparison-table header must include an accessible information control that works with hover, focus, click, and touch.

| Column | Help text |
|---|---|
| Plan | The federal repayment option being estimated. |
| Eligibility | Whether the plan appears available based on the information entered. |
| Monthly now | Your estimated required payment each month using today’s inputs. |
| Annual now | Your estimated required payments during the first 12 months. |
| Year 5 monthly | Your projected monthly payment in the fifth year. |
| Total paid | All projected borrower payments through payoff or forgiveness, excluding estimated forgiveness tax unless stated. |
| Forgiven | The projected balance that may remain when forgiveness occurs. |
| Forgiveness tax | A simplified estimate of federal and optional state tax associated with projected forgiveness. |
| Timeline | The projected time until payoff or forgiveness. |
| Key notes | Important plan benefits, limitations, or assumptions. |

Do not rely only on the HTML `title` attribute.

# 13. Calculation-engine requirements

## 13.1 General approach

The production engine must be independent from the DOM. Calculation modules must not query or modify HTML elements.

UI code calls the engine with a plain scenario object:

```js
const result = calculateScenario(scenario, activeRules);
```

The engine returns plain objects. The UI renders those objects separately.

The simulation must operate month by month because interest, payment allocation, plan benefits, qualifying-payment counts, recertification, and forgiveness events can occur monthly.

Each plan simulation must operate on a deep copy or immutable representation of the source scenario. Comparing plans must never mutate another plan’s state.

## 13.2 JavaScript quality conventions

Every engine and rules module must begin with:

```js
// @ts-check
```

Use JSDoc definitions for public functions and data structures. Editors and Codex can then use TypeScript-language-service checks without adding a TypeScript build step.

Use strict modules:

```html
<script type="module" src="./js/app.js"></script>
```

ES modules are strict mode automatically.

## 13.3 Monetary precision

Use integer cents wherever possible.

Recommended rules:

- parse user currency values into cents immediately;
- store balances, payments, interest, credits, and taxes as integers;
- store rates as integer basis points or validated decimal values;
- centralize rounding in `js/engine/money.js`;
- apply rule-specific rounding where official guidance specifies it;
- never format currency inside the calculation engine.

Avoid a runtime decimal package. Where exact decimal operations are required, implement a small, tested integer or rational helper designed specifically for the formulas used.

## 13.4 Monthly simulation order

1. Determine active rule version and plan state.
2. Apply scheduled income, family, filing-status, and employment changes.
3. Recalculate payment when recertification is due.
4. Determine required payment and minimum or maximum caps.
5. Accrue interest by loan.
6. Apply borrower payment according to allocation rules.
7. Apply plan-specific interest subsidy or waiver.
8. Apply RAP principal matching or support, when eligible.
9. Apply capitalization only when a modeled rule requires it.
10. Update principal, accrued interest, and total borrower payments.
11. Update IDR and PSLF count estimates.
12. Check payoff, PSLF discharge, IDR forgiveness, or term completion.
13. Record monthly audit output.

## 13.5 Simulation output

```js
/**
 * @typedef {Object} PlanProjection
 * @property {string} planId
 * @property {EligibilityResult} eligibility
 * @property {'basic'|'improved'|'detailed'} estimateQuality
 * @property {number} monthlyPaymentNowCents
 * @property {number} annualPaymentNowCents
 * @property {number|null} year5MonthlyPaymentCents
 * @property {number} highestMonthlyPaymentCents
 * @property {number} totalBorrowerPaymentsCents
 * @property {number} totalInterestPaidCents
 * @property {number} endingBalanceCents
 * @property {number} estimatedForgivenessCents
 * @property {number} estimatedFederalForgivenessTaxCents
 * @property {number} estimatedStateForgivenessTaxCents
 * @property {number} projectedResolutionMonth
 * @property {'paid_off'|'idr_forgiveness'|'pslf'|'term_end'} projectedResolutionType
 * @property {number} waivedInterestCents
 * @property {number} planCreditsCents
 * @property {Array<Object>} yearly
 * @property {Array<Object>} warnings
 * @property {Array<Object>} assumptions
 * @property {string[]} sourceIds
 */
```

## 13.6 Income and poverty projection

- Begin with user-entered AGI.
- Apply the annual income-growth assumption at recertification boundaries.
- Use official current-year HHS poverty guidelines from versioned rules data.
- For future unpublished years, grow guidelines by the user’s future-guideline assumption, default 2.5%.
- Mark projected future poverty values as assumptions.
- Keep separate values for contiguous states/DC, Alaska, and Hawaii.

## 13.7 Married borrowers

- Use the applicable rule for joint versus separate income.
- Implement applicable debt proration when combined income and eligible spousal debt are used.
- Do not model broader tax liability.
- Allow a temporary filing-status comparison without replacing the main scenario until selected.
- Display the filing-status disclaimer.

## 13.8 Forgiveness tax estimate

```text
estimated federal tax = projected taxable forgiveness × federal rate
estimated state tax = projected taxable forgiveness × state rate
combined estimate = federal estimate + state estimate
```

Do not determine taxability by state. Present the state value only as a user-selected planning assumption.

PSLF forgiveness should default to zero estimated federal forgiveness tax unless active official rules say otherwise. All tax behavior must be rules-versioned and source-backed.

## 13.9 Plan-specific requirements

### RAP

Support:

- whole-AGI bracket calculation rather than a marginal bracket calculation;
- minimum monthly payment;
- monthly dependent adjustment;
- marital income and debt-proration rules;
- on-time-payment unpaid-interest protection;
- principal matching or support calculation;
- forgiveness term and qualifying-count rules;
- transition and loan-type restrictions;
- separate visualization of estimated interest waived and principal support.

Boundary tests are mandatory at every AGI threshold.

### Tiered Standard

Support fixed amortized payments and balance-based terms, including exact threshold behavior.

### Standard

Support ordinary Direct and FFEL fixed schedules and consolidation-specific terms where applicable.

### Graduated

Support scheduled payment increases and applicable term and payment-ratio constraints. Label any exact-servicer-schedule limitations.

### Extended

Support eligibility thresholds, program-specific debt tests, fixed and graduated variants, and term length.

### IBR

Support 10%/20-year and 15%/25-year variants, historical new-borrower tests, discretionary-income calculation, payment cap, loan-program rules, and transition rules.

### PAYE

Support the formula and forgiveness term, but apply strict grandfathering and transition checks. Unknown historical facts normally yield potentially eligible.

### ICR

Support the lesser-of calculation, annual factor table, interpolation method, 12-year comparison, forgiveness term, and Parent PLUS consolidation pathways.

### FFEL Income-Sensitive

Because lender formulas may vary, present an estimate range or explicit limitation. Do not imply a single exact Department-wide payment where rules permit lender-specific methods.

### Perkins

Model ordinary repayment at an estimator level and warn that school-specific servicing and occupation or service cancellation benefits may be more important than consolidation.

### Alternative Repayment

Informational only. Do not invent a payment formula.

### SAVE/REPAYE

Display as unavailable or historical according to the active rules version. Include history only where needed for transition or count estimates.

## 13.10 Payment-history portability

Do not display a universal “you lose prior credit” warning.

```js
/**
 * @typedef {Object} HistoryImpact
 * @property {'preserved'|'weighted'|'partially_preserved'|'uncertain'|'not_applicable'} outcome
 * @property {number|null} estimatedCreditedMonths
 * @property {string} explanation
 * @property {string[]} missingFields
 * @property {string[]} sourceIds
 */
```

Where rules are too fact-specific for a reliable estimate, state that official payment counts must be obtained from Federal Student Aid.

# 14. PSLF requirements

Inputs:

- current qualifying-payment count;
- expected qualifying full-time public-service employment;
- optional year the borrower expects to leave public service;
- current Direct Loan status;
- optional historical employment or count details.

Outputs:

- projected remaining months to 120;
- estimated PSLF resolution date;
- projected borrower payments until PSLF;
- projected amount forgiven;
- qualifying-plan warning;
- assumptions and missing information.

A plan must not be labeled PSLF-compatible solely because it is income-driven. Use the active plan-specific rules.

# 15. Recommendations and plain-language results

Do not present one universal “best plan.” Use outcome-specific labels:

- Lowest estimated payment now
- Lowest projected borrower payments
- Fastest projected payoff
- Best PSLF-compatible estimate
- Most predictable payment
- Strongest balance-growth protection

The recommendation summary must compare at least the top two eligible results. Example:

> RAP has the lowest estimated payment now. Tiered Standard is projected to cost less overall and resolve the debt sooner under your current income-growth assumptions.

Every recommendation must cite the assumptions that drive it and include a “What could change this result?” disclosure.

# 16. Charts and data visualization

## 16.1 Required charts

1. Annual payment path
2. Remaining balance path

Charts default to the top three eligible plans. The user may select eligible plans to show, capped at four simultaneous series.

## 16.2 Implementation

Use native inline SVG generated by JavaScript. Do not add a charting library.

Recommended module:

```text
js/ui/charts/svg-line-chart.js
```

The chart module receives data and returns or updates SVG elements. It must not calculate repayment values.

## 16.3 Interaction

Every yearly point supports:

- mouse hover;
- keyboard focus;
- tap or click;
- visible callout showing plan, year, metric, and exact dollar value;
- highlighting of the active line and point;
- temporary de-emphasis of other lines;
- Escape to dismiss a pinned callout.

## 16.4 Detail density

- Plot annual points, not monthly points.
- Label the x-axis at sensible intervals.
- Use exact values in tooltips and data tables.
- Do not render every year label when it causes overlap.
- Maintain useful chart height on desktop and mobile.

## 16.5 Accessible alternatives

Each chart includes:

- accessible heading and description;
- concise text summary;
- “View data table” control;
- semantic table containing the same annual values;
- distinctions beyond color, such as point shapes or line patterns.

# 17. Print and browser-PDF report

Version 1 uses browser printing rather than a PDF library.

Button label:

> Print or save as PDF

The print stylesheet must include:

1. Product name, logo, and scenario title
2. Date generated
3. Rules version and last-reviewed date
4. Estimate-quality indicator
5. Plain-language recommendation summary
6. Top-three eligible plan comparison
7. Entered inputs and assumptions
8. Annual payment table
9. Remaining-balance table
10. Estimated forgiveness and tax assumptions
11. PSLF summary, when relevant
12. Benefits and tradeoffs
13. Missing-information warnings
14. Full disclaimer
15. Official source list
16. Copyright

Print behavior:

- hide form controls, navigation, tooltips, and buttons;
- expand result details needed for the report;
- avoid splitting small cards across pages when practical;
- repeat table headers where browsers support it;
- print charts as SVG and always include data tables;
- use near-black text on white;
- remove decorative backgrounds that reduce readability;
- support browser “Save as PDF.”

# 18. Visual design system

## 18.1 Direction

Use the current prototype as the visual reference:

- light background;
- near-black body copy;
- pastel blue, pink, yellow, orange, mint, and purple accents;
- rounded cards;
- subtle gradients;
- soft depth and restrained glass-like surfaces;
- clear hierarchy;
- generous spacing;
- minimal decorative clutter.

The aesthetic must never reduce legibility or imply that the product is entertainment rather than a financial-planning estimator.

## 18.2 Contrast

- Regular-weight body text should generally use near-black.
- Muted text must still meet WCAG contrast requirements.
- Pastel colors are for surfaces, borders, highlights, and charts, not essential low-contrast copy.
- Focus indicators must be highly visible.
- Eligibility must use text and icons in addition to color.

## 18.3 Suggested tokens

```css
:root {
  --color-text: #111827;
  --color-text-secondary: #29334a;
  --color-bg: #f8fbff;
  --color-surface: #ffffff;
  --color-border: #cfd6e4;
  --color-blue: #59c7ff;
  --color-blue-strong: #1769e0;
  --color-pink: #ff78c8;
  --color-pink-strong: #a61f6a;
  --color-yellow: #ffe37a;
  --color-orange: #ffad5c;
  --color-mint: #8ce7cf;
  --color-purple: #8d73f8;
  --color-success: #0f7657;
  --color-warning: #805500;
  --color-danger: #a32954;
  --radius-card: 1.25rem;
  --shadow-card: 0 1.25rem 3rem rgba(37, 52, 94, 0.12);
}
```

Codex must verify actual contrast values and adjust tokens as necessary.

## 18.4 Typography

Use a system font stack. Do not load fonts from third parties.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Inter may be used only when already installed locally on the visitor’s system.

# 19. Accessibility requirements

Target WCAG 2.2 Level AA.

Required behavior:

- semantic landmarks and heading order;
- skip link;
- complete keyboard operation;
- visible focus indicators;
- no keyboard traps;
- minimum touch-target sizing;
- labels and descriptions for all inputs;
- field-level validation associated with inputs;
- focus management when onboarding steps or mobile drawers change;
- tooltips available through focus and click, not hover alone;
- reduced-motion support;
- no autoplaying animation;
- status announcements for recalculation;
- error summary for blocked step progression;
- accessible chart alternatives;
- color-independent eligibility and status cues;
- print output readable in grayscale;
- automated and manual accessibility checks before release.

The Accessibility page must describe:

- the conformance target;
- keyboard support;
- chart data-table alternatives;
- known beta limitations;
- the absence of a feedback email, without inventing one.

# 20. Privacy and security

## 20.1 Privacy principles

- No backend.
- No accounts.
- No analytics.
- No tracking.
- No advertisements.
- No telemetry containing user inputs.
- No runtime rule or calculation requests.
- No user inputs in URLs.
- No persistent scenario storage.

## 20.2 Session recovery

Use `sessionStorage` only to recover an accidental refresh during the same browser session.

Recommended key:

```text
student-loan-estimator:draft:v1
```

Store only:

- current scenario draft;
- current onboarding or results stage;
- expanded or collapsed UI state;
- undo metadata if needed.

Do not store calculated audit trails if they can be regenerated.

Requirements:

- validate stored data before use;
- migrate only when a safe migration exists;
- discard invalid or incompatible state;
- clear state on “Delete all entered data.”

## 20.3 Security controls

- Validate all user-entered numbers and dates.
- Never insert user text through `innerHTML`.
- Prefer `textContent`, `createElement`, templates, and sanitized fixed content.
- Use no third-party scripts.
- Use no CDN assets.
- Add a restrictive static Content Security Policy where compatible with the implementation.
- Keep all paths relative.
- Do not add a service worker in version 1, because stale cached rules could outlive a deployment.
- Set `rel="noopener noreferrer"` on external links that open a new tab.

# 21. Static technical architecture

## 21.1 Stack

- HTML5
- CSS3
- ECMAScript modules supported by current browsers
- JSDoc type annotations
- browser-native SVG
- `sessionStorage`
- GitHub Pages branch publishing

No package is required to run or deploy the production site.

## 21.2 Architectural layers

### Presentation layer

HTML documents and JavaScript UI modules. Responsible for input, rendering, focus, responsive behavior, tooltips, charts, and print preparation.

### Application-state layer

A central scenario store coordinates onboarding, live editing, undo, validation, and session recovery. It calls the domain engine and exposes immutable result objects.

### Domain layer

DOM-independent JavaScript modules for:

- eligibility;
- payment formulas;
- monthly simulation;
- forgiveness;
- PSLF;
- plan ranking;
- estimate quality;
- history impact;
- recommendation generation.

### Rules and annual-data layer

Versioned formulas, thresholds, factor tables, source references, and effective dates.

### Content layer

Plain-language plan descriptions, glossary, disclaimers, methodology, and source metadata. Content must not duplicate numeric rules in ways that can drift.

## 21.3 Data flow

```text
User input
  -> scenario validation
  -> normalized scenario
  -> eligibility evaluation per plan
  -> plan simulations
  -> comparison and ranking
  -> recommendation summaries
  -> view model
  -> HTML results, charts, tables, and print report
```

## 21.4 Central state model

```js
/**
 * @typedef {Object} EstimatorState
 * @property {1} schemaVersion
 * @property {'quick'|'detailed'} mode
 * @property {'landing'|'onboarding'|'results'} stage
 * @property {Object} scenario
 * @property {Object} validation
 * @property {Object|null} results
 * @property {'idle'|'calculating'|'ready'|'error'} calculationStatus
 * @property {boolean} expandedAllPlans
 * @property {string[]} selectedChartPlanIds
 * @property {'basic'|'improved'|'detailed'} estimateQuality
 * @property {boolean} undoAvailable
 */
```

The state must not contain DOM elements, event objects, functions, or other nonserializable values.

## 21.5 Rendering model

Use two kinds of rendering:

1. **Static HTML shell:** headings, forms, cards, dialogs, tables, and templates exist in `index.html` where practical.
2. **Dynamic result rendering:** JavaScript fills predefined containers using safe DOM operations.

Use `<template>` elements for repeated UI structures when helpful.

Example:

```html
<template id="plan-row-template">
  <tr>
    <td data-field="plan-name"></td>
    <td data-field="eligibility"></td>
    <td data-field="monthly"></td>
    <td data-field="total"></td>
  </tr>
</template>
```

## 21.6 Events

Use event delegation for repeated controls. Keep event wiring in UI controller modules rather than calculation modules.

Use semantic custom events only where they reduce coupling, such as:

```js
document.dispatchEvent(new CustomEvent('estimator:scenario-change', {
  detail: { reason: 'income-update' }
}));
```

Do not create a complex event bus unnecessarily.

## 21.7 Calculation execution

Run calculations on the main thread initially. Profile realistic detailed scenarios. Add a Web Worker only if calculation regularly blocks interaction beyond 100 ms on supported mobile hardware.

The domain modules must remain worker-compatible by avoiding DOM APIs.

# 22. Repository structure

```text
Student-Loan-Planner/
├── .nojekyll
├── 404.html
├── index.html
├── methodology.html
├── sources.html
├── accessibility.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── charts.css
│   ├── utilities.css
│   └── print.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── content/
│   │   ├── disclaimers.js
│   │   ├── glossary.js
│   │   └── plan-copy.js
│   ├── engine/
│   │   ├── calculate-scenario.js
│   │   ├── eligibility/
│   │   ├── formulas/
│   │   ├── history/
│   │   ├── money.js
│   │   ├── ranking.js
│   │   ├── recommendations.js
│   │   ├── simulation/
│   │   ├── tax.js
│   │   └── types.js
│   ├── rules/
│   │   ├── annual/
│   │   │   └── 2026/
│   │   │       ├── icr-factors.js
│   │   │       ├── poverty-guidelines.js
│   │   │       └── tax-defaults.js
│   │   ├── versions/
│   │   │   └── 2026-07-01/
│   │   │       ├── eligibility.js
│   │   │       ├── plans.js
│   │   │       ├── transitions.js
│   │   │       └── fixtures.js
│   │   ├── rule-version.js
│   │   └── sources.js
│   ├── state/
│   │   ├── estimator-store.js
│   │   ├── session-storage.js
│   │   ├── undo.js
│   │   └── validation.js
│   ├── ui/
│   │   ├── onboarding.js
│   │   ├── scenario-editor.js
│   │   ├── plan-comparison.js
│   │   ├── plan-details.js
│   │   ├── recommendations.js
│   │   ├── tooltips.js
│   │   ├── dialogs.js
│   │   ├── print.js
│   │   ├── render-application.js
│   │   └── charts/
│   │       ├── svg-line-chart.js
│   │       └── chart-table.js
│   └── utils/
│       ├── dates.js
│       ├── dom.js
│       ├── formatting.js
│       └── object.js
├── assets/
│   └── brand/
│       ├── logo-horizontal.svg
│       ├── logo-mark.svg
│       ├── logo-monochrome.svg
│       ├── favicon.svg
│       ├── favicon-32.png
│       └── apple-touch-icon.png
├── tests/
│   ├── test-runner.html
│   ├── test-runner.js
│   ├── unit/
│   ├── fixtures/
│   ├── official-examples/
│   └── manual-checklist.md
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── calculation-methodology.md
│   ├── rules-maintenance.md
│   ├── testing.md
│   ├── accessibility-checklist.md
│   ├── source-register.md
│   └── deployment.md
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 22.1 File-size guidance

- No JavaScript module should normally exceed 400 lines.
- Split modules when they have more than one major responsibility.
- `index.html` should contain semantic structure but not calculation logic.
- CSS should remain separated by purpose.
- Do not minify source files in the repository. GitHub Pages can serve readable source; maintainability is more important than tiny savings for this app.

# 23. GitHub Pages deployment

## 23.1 Selected deployment method

Use **Deploy from a branch**, not GitHub Actions.

Repository Settings:

```text
Settings
  -> Pages
  -> Build and deployment
  -> Source: Deploy from a branch
  -> Branch: main
  -> Folder: /(root)
  -> Save
```

GitHub Pages will publish the static files from the repository root when changes are pushed to `main`.

## 23.2 Why no deployment workflow is needed

The repository already contains final browser-ready files. There is nothing to compile. A custom workflow would reintroduce complexity without creating a necessary artifact.

Remove:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/deploy-pages.yml`

Do not replace them with another required deployment workflow.

## 23.3 `.nojekyll`

Commit an empty `.nojekyll` file at the repository root. This tells GitHub Pages not to process the site as a Jekyll project.

## 23.4 Path rules

All internal files and links must use relative paths.

Correct:

```html
<link rel="stylesheet" href="./css/main.css">
<script type="module" src="./js/app.js"></script>
<a href="./sources.html">Sources</a>
<img src="./assets/brand/logo-mark.svg" alt="">
```

Incorrect:

```html
<link rel="stylesheet" href="/css/main.css">
<script type="module" src="/js/app.js"></script>
```

Relative paths allow the same repository to work:

- under the GitHub Pages project subdirectory;
- from a local HTTP server;
- if the repository name changes later.

## 23.5 Local preview

ES modules should be tested through a local HTTP server, not by double-clicking `index.html` as a `file://` URL.

Recommended no-dependency command on systems with Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Alternative editors may provide a simple local server extension, but the repository must not depend on one.

## 23.6 Deployment verification

After each major release:

1. Push changes to `main`.
2. Wait for the Pages deployment entry to complete.
3. Open the public URL in a private or incognito window.
4. Confirm the logo, CSS, JavaScript, and supporting pages load.
5. Complete one quick estimate.
6. Refresh and confirm session recovery.
7. Test on a mobile device or responsive browser view.
8. Confirm print preview.

## 23.7 Optional validation later

A lightweight GitHub Actions validation workflow may be added later, but it must be optional and must not control deployment until it has been proven stable. If added, it should use only simple checks such as:

- verify required files exist;
- run Node built-in unit tests if the repository adopts them;
- check that HTML does not contain root-absolute asset paths;
- check for syntax errors in JavaScript modules.

The public site must remain deployable from the branch without that workflow.

# 24. Rules and annual-data architecture

## 24.1 Versioning model

Rules are manual, source-backed, and immutable after release except for documented corrections.

Recommended structure:

```text
js/rules/versions/2026-07-01/
js/rules/annual/2026/
```

Metadata shape:

```js
export const ruleSetMetadata = Object.freeze({
  id: '2026-07-01',
  effectiveFrom: '2026-07-01',
  effectiveThrough: null,
  reviewedOn: '2026-06-18',
  status: 'active',
  sourceIds: ['fed-register-2026-final-rule'],
  notes: []
});
```

## 24.2 Manual maintenance process

Neon Dreams Engineering Division owns maintenance.

Review rules:

- at least once each January;
- whenever major student-loan legislation is enacted;
- whenever the Department of Education publishes new final rules or operational guidance;
- when HHS publishes annual poverty guidelines;
- when annual ICR factors are published;
- when IRS treatment relevant to forgiveness changes;
- before a new public-beta release.

Update workflow:

1. Review primary official sources.
2. Add a new dated rules or annual-data module.
3. Preserve the prior version.
4. Update source metadata and retrieval dates.
5. Add or update official-example and boundary tests.
6. Run the browser test harness and manual checklist.
7. Update the rules-review date and changelog.
8. Manually test representative borrower scenarios.
9. Commit to `main`; branch publishing handles release.

Do not scrape rules automatically.

## 24.3 Staleness warning

Display:

> Rules reviewed through June 18, 2026

If the current date is more than 12 months after `reviewedOn`, display:

> These repayment rules have not been reviewed in more than 12 months. Confirm current options through Federal Student Aid before relying on this estimate.

Do not disable the estimator solely because the rules are stale.

## 24.4 Source metadata

```js
/**
 * @typedef {Object} SourceRecord
 * @property {string} id
 * @property {string} title
 * @property {string} publisher
 * @property {string} url
 * @property {string} retrievedOn
 * @property {string=} publishedOn
 * @property {string=} effectiveFrom
 * @property {'statute'|'regulation'|'federal-register'|'agency-guidance'|'annual-data'|'technical-doc'} sourceType
 * @property {string=} notes
 */
```

# 25. Testing strategy

Testing remains required, but it must not make deployment dependent on a framework toolchain.

## 25.1 Browser unit-test harness

Create `tests/test-runner.html` that loads test modules in a browser and displays pass or fail results.

The test harness must:

- import the same engine modules used by production;
- run without network access;
- show total tests, passed tests, and failed tests;
- provide detailed expected and actual values;
- set a visible overall status;
- expose a simple machine-readable result on `window.__TEST_RESULTS__` for optional automation later.

Do not link the test runner from the public navigation.

## 25.2 Optional Node built-in tests

Engine modules should remain compatible with Node’s native ES-module support where practical. Codex may add tests using the built-in `node:test` and `node:assert` modules without adding npm packages.

Example:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { amortizedPaymentCents } from '../../js/engine/formulas/amortization.js';

test('calculates a fixed payment', () => {
  assert.equal(amortizedPaymentCents(/* fixture */), 61234);
});
```

This is optional for deployment but recommended for calculation confidence.

## 25.3 Required unit tests

Test:

- money and rounding utilities;
- amortization;
- poverty calculations;
- RAP bracket thresholds and dependent adjustments;
- IBR 10% and 15% formulas and caps;
- PAYE formula and cap;
- ICR factor interpolation;
- Tiered Standard term thresholds;
- Standard consolidation terms;
- Extended eligibility thresholds;
- forgiveness-tax estimate;
- spousal debt proration;
- ranking and tie-breaking;
- estimate-quality scoring;
- history-impact results;
- rule-version selection.

## 25.4 Eligibility matrix tests

At minimum:

- pre-July-2026 Direct borrower;
- post-July-2026 Direct borrower;
- mixed cohort;
- Direct Parent PLUS;
- Parent PLUS consolidation;
- graduate PLUS;
- FFEL-only;
- Perkins-only;
- consolidation after July 1, 2026;
- grandfathered PAYE facts complete;
- PAYE history unknown;
- ICR Parent PLUS transition;
- default status;
- missing disbursement date;
- SAVE historical borrower.

## 25.5 Simulation tests

- payment below monthly interest;
- RAP unpaid-interest protection;
- RAP principal support;
- fixed-plan payoff;
- early payoff;
- income increase and decrease;
- family-size change;
- filing-status change;
- PSLF at 120 total qualifying months;
- IDR forgiveness at applicable term;
- consolidation or history weighting;
- zero and very low income;
- very high income;
- zero-interest loan;
- final payment smaller than scheduled payment.

## 25.6 Official-example regression tests

Where official rules provide examples, encode them as fixtures with:

- source ID;
- input data;
- expected result;
- accepted rounding tolerance;
- rule version.

## 25.7 Manual interaction checklist

Test in at least Chrome, Firefox, and Safari before public beta:

1. Quick estimate from landing to results.
2. Detailed estimate with multiple loans.
3. Skip unknown eligibility facts.
4. Change income and observe live resorting.
5. Expand and collapse all plans.
6. Use chart callouts with mouse and keyboard.
7. Refresh and restore the session draft.
8. Delete all entered data.
9. Print or save as PDF.
10. Navigate all static pages from the public GitHub Pages URL.
11. Confirm no browser console errors.
12. Confirm no failed network requests for local assets.

## 25.8 Accessibility testing

- browser accessibility-tree inspection;
- keyboard-only test;
- focus order and focus visibility;
- 200% zoom and reflow;
- reduced motion;
- mobile target size;
- chart table alternative;
- screen-reader announcements;
- grayscale print review;
- optional axe browser extension during manual QA.

Do not make the production site depend on an automated accessibility package.

# 26. Performance and browser compatibility

## 26.1 Browser support

Support current stable versions of:

- Chrome;
- Edge;
- Firefox;
- Safari;
- iOS Safari;
- Android Chrome.

Older browsers are out of scope.

## 26.2 Responsive support

- Minimum design width: 320 CSS pixels.
- No horizontal page scrolling at supported widths.
- Comparison tables may use contained horizontal scrolling with a sticky first column.
- Mobile controls must be touch friendly.

## 26.3 Performance budgets

- no runtime API dependency;
- total uncompressed production JavaScript target below 500 KB;
- initial JavaScript target below 250 KB uncompressed;
- no charting library;
- main-thread calculation below 100 ms for typical quick scenarios;
- live update perceived within 500 ms after input settles;
- no production console errors;
- no missing assets;
- page usable before decorative imagery finishes loading.

# 27. Error handling

## 27.1 Validation errors

- Validate at field level and on step progression.
- Do not erase user entries.
- Move focus to an error summary when a step cannot proceed.
- Allow skipping nonessential fields.

## 27.2 Calculation errors

A failure in one plan must not prevent other plan results.

```js
/**
 * @typedef {Object} ProjectionFailure
 * @property {string} planId
 * @property {string} code
 * @property {string} message
 * @property {boolean} recoverable
 * @property {string[]} relatedFields
 */
```

Show a concise user message and preserve diagnostic details for tests and development only.

## 27.3 Session recovery errors

If stored session data is invalid or incompatible:

- discard it safely;
- begin with a clean state;
- show a brief nontechnical message;
- never prevent the page from loading.

## 27.4 Module-load errors

If a required JavaScript module cannot load:

- the static HTML shell must still display product identity, privacy statement, and a clear error message;
- provide a “Reload page” button;
- do not leave an empty page;
- log a developer-readable error to the console without borrower data.

# 28. Documentation requirements

Codex must create:

- `README.md`: overview, local preview, GitHub Pages setup, privacy, beta disclaimer;
- `AGENTS.md`: implementation guardrails and commands for future coding agents;
- `docs/PRD.md`: repository copy of this specification;
- `docs/architecture.md`: module boundaries, state, rendering, and data flow;
- `docs/calculation-methodology.md`: formulas, rounding, assumptions, limitations;
- `docs/rules-maintenance.md`: versioning and update checklist;
- `docs/testing.md`: browser harness and manual test matrix;
- `docs/accessibility-checklist.md`;
- `docs/source-register.md`;
- `docs/deployment.md`;
- `CONTRIBUTING.md`;
- `CHANGELOG.md`;
- an open-source license selected by the repository owner or a marked placeholder requiring owner confirmation before public release.

Do not invent a legal license decision.

# 29. Migration from the SvelteKit repository

The conversion must be intentional, not an incremental attempt to make framework files coexist with the static app.

## 29.1 Preserve before deletion

Before removing the existing framework implementation, extract and review:

- current estimator formulas;
- current rules and source metadata;
- unit-test fixtures;
- current visual styles;
- current copy and disclaimers;
- logo SVG;
- any accessibility findings;
- PRD and documentation.

Do not automatically trust formulas merely because they exist in the old implementation. Verify them against the rules sources and tests.

## 29.2 Remove framework and build files

Remove after equivalent static functionality is committed:

```text
src/
static/            # move useful assets into assets/
.svelte-kit/
build/
node_modules/
package.json
package-lock.json
svelte.config.js
vite.config.*
tsconfig.json
playwright.config.*
vitest.config.*
eslint.config.*
.prettierrc
.prettierignore
.github/workflows/ci.yml
.github/workflows/deploy.yml
.github/workflows/deploy-pages.yml
```

Keep `.gitignore`, but simplify it to exclude only local/editor artifacts that remain relevant.

## 29.3 Preserve history

Perform the conversion in a dedicated branch. Recommended branch name:

```text
codex/static-html-rebuild
```

Use a sequence of comprehensible commits rather than one opaque replacement commit:

1. Add static shell and assets.
2. Port rules and engine modules.
3. Port UI and state behavior.
4. Add tests and documentation.
5. Remove SvelteKit and workflow files.
6. Final accessibility and deployment fixes.

## 29.4 Do not merge until verified

Before merge:

- run the browser test harness;
- run any Node built-in tests;
- inspect the site through a local HTTP server;
- verify all relative paths;
- test mobile behavior;
- test print preview;
- inspect the browser console;
- confirm `.nojekyll` exists;
- confirm `index.html` is at the repository root.

# 30. Two-pass Codex development process

The static architecture does not require a separate dependency-installation or framework-bootstrap stage. However, Codex must still build the project in **two controlled passes** so deployment is proven before the complex estimator is added.

The purpose of this process is to prevent Codex from creating thousands of lines of rules and interface code on top of an unverified repository structure. Pass 1 proves that the browser can load the files and that GitHub Pages can publish them. Pass 2 adds the full estimator without changing the already verified deployment foundation.

## 30.1 Pass 1: Static foundation and deployment proof

### Objective

Create the smallest complete static site that proves the repository structure, relative paths, browser module loading, responsive design shell, and GitHub Pages publishing method all work.

### Codex scope for Pass 1

Codex must create only the foundation needed to verify deployment:

- root `index.html`;
- root `.nojekyll`;
- `404.html`;
- approved logo and favicon assets;
- base, token, layout, component, and print CSS files;
- browser-native ES-module entry point;
- one small state object;
- one simple calculator interaction using clearly labeled demonstration logic;
- empty or stubbed methodology, sources, and accessibility pages with real navigation;
- README deployment instructions;
- a deployment smoke-test checklist.

Pass 1 must **not** implement the complete repayment rules, monthly simulator, full onboarding workflow, recommendation engine, or all plan cards. Demonstration calculations must be visibly labeled as temporary and must be removed before Pass 2 completion.

### Pass 1 verification

Codex must verify the site through a local HTTP server, not only by opening `index.html` as a local file:

```bash
python3 -m http.server 8000
```

Codex must then inspect:

```text
http://localhost:8000/
```

Required local checks:

1. `index.html` loads without a blank screen.
2. CSS and logo assets load.
3. ES modules load without console errors.
4. At least one input changes a visible result.
5. Navigation to supporting pages works.
6. Refreshing the page does not create path errors.
7. The layout works at desktop and mobile widths.
8. Print preview opens and remains readable.
9. Every local asset uses a relative path.
10. `.nojekyll` is committed at the repository root.

### Pass 1 pull request and merge gate

Pass 1 must be submitted as its own pull request. Recommended branch:

```text
codex/static-foundation
```

Do not begin Pass 2 until all of the following are true:

- the Pass 1 pull request has been reviewed;
- the static site works through the local HTTP server;
- GitHub Pages is configured for **Deploy from a branch -> main -> /(root)**;
- the Pass 1 site has been merged to `main`;
- the public GitHub Pages URL loads in a private or incognito browser window;
- the public site loads its CSS, JavaScript, logo, and supporting pages;
- one basic interaction works on the deployed site;
- the deployed browser console has no errors.

A successful local preview is not a substitute for this deployed-site verification.

### Pass 1 completion report

Codex must report:

- all files created;
- the local-server command used;
- the URLs inspected;
- confirmation that no build command or package installation is required;
- confirmation that paths are relative;
- console-error status;
- mobile and print checks performed;
- any owner action still required in GitHub Pages settings.

## 30.2 Pass 2: Full estimator implementation

### Objective

Starting from the verified Pass 1 foundation, implement the complete public-beta estimator described in this PRD without replacing or destabilizing the proven static deployment structure.

### Codex scope for Pass 2

Codex must add the full application incrementally:

- production data model and JSDoc types;
- rules-version and source registry;
- money and rounding utilities;
- eligibility engine;
- all launch-scope repayment formulas;
- monthly simulation engine;
- PSLF and payment-history logic;
- quick and detailed onboarding;
- unknown and skipped-value handling;
- estimate-quality indicator;
- live scenario editor;
- dynamic top-three eligible-plan ranking;
- show-all plan expansion;
- accessible plan-header explanations;
- interactive SVG charts and data tables;
- session recovery, undo, reset, and delete-all behavior;
- methodology, sources, and accessibility content;
- print-optimized report;
- browser and optional Node tests;
- final documentation.

### Pass 2 implementation order

Pass 2 must follow the phases in Section 31. Codex must not implement the entire product in one unverified edit batch.

After each phase, Codex must:

1. run the relevant browser test harness;
2. run optional Node built-in tests when present;
3. serve the site locally through HTTP;
4. inspect the browser console;
5. test the changed interaction manually;
6. update the changelog;
7. resolve failures before starting the next phase.

### Preserve the deployment foundation

During Pass 2, Codex must not:

- move `index.html` away from the repository root;
- remove `.nojekyll`;
- introduce Svelte, React, Vue, TypeScript compilation, Vite, or another build system;
- add production npm dependencies;
- replace relative asset paths with root-absolute paths;
- add a required deployment workflow;
- require a generated output directory;
- make GitHub Pages dependent on tests or package installation.

### Pass 2 pull request and merge gate

Pass 2 must be submitted as a separate pull request. Recommended branch:

```text
codex/full-estimator
```

Before merge, Codex and the repository owner must verify:

- all required formulas and eligibility paths are implemented or explicitly informational;
- no temporary Pass 1 demonstration logic remains;
- browser tests pass;
- all required manual checks pass;
- top-three ranking re-sorts after input changes;
- charts work by mouse, keyboard, and touch;
- print preview contains the required report sections;
- session recovery and delete-all behavior work;
- there are no browser console errors;
- the full site works from a local HTTP server;
- the PR is not merged merely because Codex says it is complete.

After merge to `main`, GitHub Pages republishes the static files automatically. The public URL must then receive a final smoke test before the release is considered complete.

## 30.3 Why two passes are still required

The two-pass process is a development-control measure, not an environment requirement.

The plain static site does not need:

- an npm installation stage;
- a framework bootstrap stage;
- a compilation stage;
- a generated deployment artifact;
- a custom Actions deployment workflow.

It still benefits from two passes because the full estimator contains complex rules, financial projections, accessibility requirements, and many interacting UI states. Proving the foundation first makes later failures easier to diagnose.

## 30.4 Failure and stop conditions

Codex must stop and report the problem rather than continuing when:

- the local static server cannot load the page;
- a JavaScript module fails to load;
- the browser console shows an uncaught error;
- GitHub Pages does not load the Pass 1 foundation;
- an asset works locally but fails on GitHub Pages;
- a required formula test fails;
- an accessibility check produces a release-blocking issue;
- Codex cannot actually run a test it intends to claim as passed.

Codex must never replace verification with statements such as “this should work.” Completion claims require observed results.

# 31. Phased build plan

## Phase 0: Static repository foundation

Tasks:

- create root HTML pages;
- add `.nojekyll`;
- create CSS token and base files;
- create ES-module entry point;
- add logo and favicon assets;
- create documentation skeleton;
- add a simple 404 page.

Exit criteria:

- `index.html` loads through a local HTTP server;
- supporting pages load;
- all assets use relative paths;
- no console errors;
- the static shell is responsive.

## Phase 1: Domain foundations

Tasks:

- define JSDoc scenario, loan, plan, rule, source, and output types;
- implement money and rounding utilities;
- implement immutable rules metadata;
- implement 2026 poverty and ICR annual data;
- implement eligibility result model;
- create fixtures.

Exit criteria:

- domain modules have no DOM imports;
- foundational tests pass;
- source-backed metadata exists;
- modules load in both browser and optional Node tests.

## Phase 2: Plan formulas and simulation

Tasks:

- implement fixed-plan amortization;
- implement Standard, Graduated, Extended, and Tiered Standard;
- implement IBR, PAYE, ICR, and RAP;
- implement FFEL and Perkins estimator behavior;
- implement Parent PLUS transitions;
- implement PSLF layer;
- implement history-impact estimation;
- implement forgiveness-tax assumptions;
- implement plan ranking and recommendation summaries.

Exit criteria:

- official-example and boundary tests pass;
- plan-level failures are isolated;
- top-three ranking is deterministic;
- monthly audit output reconciles with totals.

## Phase 3: Guided inputs and state

Tasks:

- build quick and detailed flows;
- support unknown and skipped values;
- implement estimate-quality indicator;
- implement validation;
- implement central state store;
- implement session recovery;
- implement 20-step undo;
- implement reset and delete-all behavior.

Exit criteria:

- quick flow completes with minimal inputs;
- detailed flow supports multiple loans;
- refresh restores session state;
- delete-all clears session state;
- keyboard navigation works through onboarding.

## Phase 4: Results workspace

Tasks:

- build persistent live editor;
- build top-three comparison and show-all expansion;
- build header help controls;
- build plan cards and recommendation summaries;
- build assumptions and missing-information panels;
- build interactive SVG charts and accessible data tables;
- implement responsive mobile drawer.

Exit criteria:

- input changes update and re-sort results live;
- only clearly eligible plans appear in top three;
- chart points work by mouse, keyboard, and touch;
- all results remain readable at mobile widths.

## Phase 5: Print, content, and support pages

Tasks:

- create print stylesheet and report layout;
- complete methodology, sources, and accessibility pages;
- add disclaimers and glossary;
- add staleness warning;
- remove prototype-only design-aesthetic copy;
- complete brand and footer.

Exit criteria:

- browser print contains all required report sections;
- static pages work by direct navigation;
- source links and rules dates are correct;
- print is readable in grayscale.

## Phase 6: Static deployment and public-beta hardening

Tasks:

- complete browser and optional Node tests;
- run accessibility and manual browser checks;
- review privacy behavior;
- remove all root-absolute asset paths;
- remove SvelteKit and workflow files;
- enable or verify GitHub Pages branch publishing;
- test the actual Pages URL.

Exit criteria:

- definition of done is satisfied;
- site is served directly from `main` and `/(root)`;
- no build workflow is required;
- no blocker or critical accessibility defect remains;
- known beta limitations are documented.

# 32. Codex execution contract

Codex must treat this document as the authoritative implementation brief.

## 32.1 Required behavior

1. Build the complete static repository, not a mockup.
2. Use plain HTML, CSS, and JavaScript only.
3. Use browser-native ES modules.
4. Do not add Svelte, React, Vue, TypeScript compilation, Vite, or another framework or bundler.
5. Keep the domain engine independent from the DOM.
6. Use primary official sources for legal and annual rule data.
7. Add source IDs to every rule module.
8. Add tests before considering a formula complete.
9. Keep all calculations and borrower data in the browser.
10. Do not add analytics, telemetry, accounts, APIs, or a backend.
11. Do not use `localStorage` for borrower scenarios.
12. Do not put borrower information in URLs.
13. Do not add a service worker.
14. Do not treat the prototype’s formulas as authoritative.
15. Preserve the prototype’s visual direction while increasing accessibility and maintainability.
16. Remove the user-facing design-tone bubble.
17. Use relative paths for all local resources.
18. Commit an empty `.nojekyll` file.
19. Place `index.html` in the repository root.
20. Remove custom deployment workflows.
21. Leave the repository ready for GitHub Pages **Deploy from a branch -> main -> /(root)**.
22. Complete Pass 1 and Pass 2 as separate pull requests.
23. Do not begin the full estimator until the Pass 1 foundation has been verified on the public GitHub Pages URL.
24. Stop and report any test or deployment failure; do not claim unexecuted tests passed.

## 32.2 Implementation sequence

Implement using the two-pass process in Section 30. Pass 1 must be completed, merged, and verified on the public GitHub Pages URL before Pass 2 begins. Within Pass 2, implement in the phase order above. After each phase:

- run relevant tests;
- update the changelog;
- update documentation if architecture changes;
- resolve errors before beginning the next phase.

## 32.3 No-placeholder rule

The final repository must not contain:

- fake calculations;
- TODO formulas for launch plans;
- dummy source citations;
- inaccessible placeholder charts;
- buttons that do nothing;
- fabricated legal statements;
- hidden data transmission;
- framework remnants that are no longer used.

Informational-only features must be explicitly labeled informational rather than simulated.

## 32.4 Agent verification checklist

Before declaring completion, Codex must report:

- files created and deleted;
- major architecture decisions;
- browser test results;
- optional Node test results;
- public Pages path verification;
- browser console status;
- known limitations;
- owner actions still required, including choosing a license and confirming Pages settings.

# 33. Acceptance criteria

## 33.1 Product acceptance

- A new user can reach a quick estimate without entering unknown optional details.
- A detailed user can enter multiple federal loans.
- Results show estimate quality and assumptions.
- Top three contains only clearly eligible plans.
- Top three re-sorts live by current monthly payment, then total borrower payments.
- “Show all plans” reveals remaining statuses with reasons.
- Users can edit inputs without returning through onboarding.
- Monthly, annual, year-five, total, forgiveness, tax, and timeline estimates are shown where calculable.
- RAP interest protection and principal support are displayed separately.
- History impacts are specific or explicitly uncertain.
- PSLF results show remaining months and assumptions.
- Charts are interactive and accessible.
- Print or save as PDF produces a complete plain-language report.

## 33.2 Technical acceptance

- `index.html` loads from a simple local HTTP server.
- All JavaScript modules load without syntax or import errors.
- No build command is required.
- No package installation is required.
- No runtime network request is required for core operation.
- No borrower data persists beyond session storage.
- Delete-all clears the session draft.
- All static pages work beneath the repository subdirectory.
- Every local asset path is relative.
- GitHub Pages serves the site directly from the repository root.
- Production has no console errors or failed local-asset requests.

## 33.3 Accessibility acceptance

- Complete keyboard operation.
- Visible focus throughout.
- Chart data available in semantic tables.
- Tooltips work by focus and click.
- No essential information depends only on color.
- Layout works at 320 px and 200% zoom.
- Print output is legible in grayscale.
- Manual accessibility checklist has no release-blocking issue.

## 33.4 Privacy acceptance

- No analytics or tracking scripts.
- No third-party runtime scripts.
- No borrower data in URLs.
- No borrower data in `localStorage`.
- No network submission of borrower inputs.
- Session data clears through the delete control.

## 33.5 Deployment acceptance

- Pass 1 was merged and verified on the public GitHub Pages URL before full estimator development began.
- Pass 2 was completed as a separate pull request.

- GitHub Pages source is set to Deploy from a branch.
- Branch is `main`.
- Folder is `/(root)`.
- `.nojekyll` exists.
- Root contains `index.html`.
- A push to `main` causes the Pages site to refresh without a custom workflow.
- The public URL loads all assets and modules.

# 34. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Federal rules change | Estimates become stale | Versioned rules, review date, 12-month warning, manual update workflow |
| Eligibility is fact-specific | False confidence | Four-state eligibility model, unknown values, missing-field explanations |
| Calculation drift | Incorrect totals | DOM-independent engine, official examples, boundary tests, audit records |
| Parent PLUS complexity | Misleading results | Dedicated lineage fields, uncertainty state, transition tests |
| Tax uncertainty | Misstated total cost | User-entered rates, no state-law database, tax disclaimer |
| Large vanilla JS codebase | Harder maintenance | Strict module boundaries, JSDoc, line limits, documented APIs |
| Root-absolute paths | Broken GitHub Pages assets | Relative-path rule and deployment checklist |
| Browser differences | Inconsistent behavior | Current-browser support matrix and manual checks |
| Accessibility regression | Excludes users | Semantic HTML, manual checklist, keyboard and screen-reader review |
| Stale service-worker cache | Old rules remain active | No service worker in v1 |
| Sensitive data persistence | Privacy harm | Session-only recovery, delete-all, no analytics or backend |
| Calculation blocks UI | Poor mobile experience | Profiling and Web Worker-ready domain architecture |
| Accidental framework reintroduction | Build complexity returns | AGENTS.md prohibition and no-package deployment acceptance criteria |

# 35. Definition of done

The public beta is done when:

- the static repository structure and documentation are complete;
- all launch-scope plans have tested estimator behavior or explicit informational treatment;
- official source registry and rules dates are populated;
- quick and detailed input modes work;
- skipped information is handled without false certainty;
- the live results editor works on desktop and mobile;
- top-three sorting and show-all behavior match the specification;
- chart interactions and data tables are accessible;
- print reporting works;
- session recovery, undo, reset, and delete-all work;
- accessibility checks and manual review have no release-blocking issue;
- browser and optional Node tests pass;
- the site runs correctly from a local HTTP server;
- the site runs correctly at the GitHub Pages URL;
- there are no custom build or deployment workflows;
- there are no required production packages;
- the README documents the branch deployment setup;
- known public-beta limitations are visible;
- the repository owner has selected a license or release is withheld until one is chosen.

# 36. Initial official source register

Codex must verify these sources during implementation and record retrieval dates in `js/rules/sources.js` and `docs/source-register.md`.

## Federal student-loan rules and guidance

1. U.S. Department of Education, Federal Register, “Reimagining and Improving Student Education - Federal Student Loan Program Final Regulations,” May 1, 2026.  
   `https://www.federalregister.gov/documents/2026/05/01/2026-08556/reimagining-and-improving-student-education-federal-student-loan-program-final-regulations`

2. Federal Student Aid, “One Big Beautiful Bill Act Updates.”  
   `https://studentaid.gov/announcements-events/big-updates/`

3. Electronic Code of Federal Regulations, 34 CFR Part 685.  
   `https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-685`

4. Electronic Code of Federal Regulations, 34 CFR Part 682.  
   `https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-682`

5. Electronic Code of Federal Regulations, 34 CFR Part 674.  
   `https://www.ecfr.gov/current/title-34/subtitle-B/chapter-VI/part-674`

6. Federal Register, annual ICR formula update for 2026.  
   `https://www.federalregister.gov/documents/2026/06/09/2026-11540/annual-updates-to-the-income-contingent-repayment-icr-plan-formula-for-2026-william-d-ford-federal`

7. Federal Student Aid, PSLF guidance.  
   `https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service`

## Annual financial and tax data

8. HHS ASPE, Poverty Guidelines.  
   `https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines`

9. Internal Revenue Service, Topic No. 431, Canceled Debt.  
   `https://www.irs.gov/taxtopics/tc431`

## Technical platform and accessibility

10. GitHub Docs, “Configuring a publishing source for your GitHub Pages site.”  
    `https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site`

11. GitHub Docs, “Creating a GitHub Pages site.”  
    `https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site`

12. W3C, Web Content Accessibility Guidelines 2.2.  
    `https://www.w3.org/TR/WCAG22/`

# Appendix A. Required plan IDs

```js
export const PLAN_IDS = Object.freeze([
  'rap',
  'tiered_standard',
  'standard',
  'graduated',
  'extended_fixed',
  'extended_graduated',
  'ibr_10',
  'ibr_15',
  'paye',
  'icr',
  'ffel_income_sensitive',
  'perkins_standard',
  'alternative_informational',
  'save_unavailable'
]);
```

# Appendix B. Core data model

```js
/**
 * @typedef {Object} BorrowerScenario
 * @property {1} schemaVersion
 * @property {'quick'|'detailed'} mode
 * @property {string} asOfDate
 * @property {Array<Object>} loans
 * @property {Object=} aggregate
 * @property {Object} household
 * @property {Object} income
 * @property {Object} repaymentHistory
 * @property {Object} pslf
 * @property {Object} tax
 * @property {Object} assumptions
 * @property {string[]} unknownFields
 */
```

# Appendix C. GitHub Pages owner setup

1. Open the public repository `focus-on-the-code/Student-Loan-Planner`.
2. Confirm `index.html` and `.nojekyll` are in the repository root on `main`.
3. Open **Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
6. Select branch **main**.
7. Select folder **/(root)**.
8. Select **Save**.
9. Wait for the Pages deployment to complete.
10. Open `https://focus-on-the-code.github.io/Student-Loan-Planner/`.
11. Run the deployment verification checklist in `docs/deployment.md`.

# Appendix D. AGENTS.md minimum content

```md
# Project guardrails

- Plain static HTML, CSS, and JavaScript only.
- No Svelte, React, Vue, TypeScript build, bundler, npm runtime dependency, or backend.
- Use native browser ES modules and relative paths.
- Domain logic must not access the DOM.
- Every legal rule must cite a source ID and have tests.
- Unknown is not false and not zero.
- Top-three results include only clearly eligible plans.
- Borrower data may use sessionStorage only; never localStorage or URLs.
- No analytics, tracking, runtime APIs, accounts, or service worker.
- Keep index.html and .nojekyll at repository root.
- Deployment is GitHub Pages: main branch, /(root), Deploy from a branch.
- Do not add a required GitHub Actions deployment workflow.
- Run the browser test harness and manual checklist before completion.
- Verify the public GitHub Pages URL after merge.
```
