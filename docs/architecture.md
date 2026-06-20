# Architecture

The app is static HTML, CSS, SVG assets, and browser-native JavaScript modules. `index.html` owns document structure, `js/app.js` bootstraps DOM interactions, `js/engine/**` owns calculations, `js/rules/**` owns versioned rule data, `js/state/**` owns browser-local state, and `js/ui/**` owns rendering helpers.

No build step, framework, backend, analytics, accounts, or external runtime dependency is required.
