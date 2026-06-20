# Student Loan Repayment Plan Estimator

A privacy-first static web app for estimating and comparing federal student loan repayment options.

## Current status

This repository is in **Pass 1: Static foundation and deployment proof**. The current site proves that the root HTML pages, relative assets, CSS, and browser-native JavaScript modules load without a build step. The temporary preview interaction on `index.html` is not a production repayment calculation.

## Local preview

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Deployment model

GitHub Pages should be configured as:

```text
Settings -> Pages -> Build and deployment
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

No build command, package install, or custom deployment workflow is required.
