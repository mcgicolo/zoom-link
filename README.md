# MCGI Zoom Meeting Generator

A mobile-first Vue app that generates personalized Zoom meeting links with properly formatted display names. It's hosted on GitHub Pages and can be installed as an app (PWA).

## Features

- Mobile-first responsive design
- Step-by-step one-question-at-a-time flow
- English and Tagalog locale support
- LocalStorage form persistence
- One-click copy and join functionality
- Installable as an app (PWA); after the first visit the app itself opens offline, but joining a meeting still needs internet

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output goes to `docs/` and now also includes the web app manifest (`manifest.webmanifest`), the service worker (`sw.js`) and the app icons.

## Configuration

- The meeting ID, contact name/phone, and locale list live in `config.json`, which `src/main.js` loads at runtime.
- `config.json` is gitignored. `npm run dev` and `npm run build` create it from `config.json.sample` if it's missing (`scripts/ensure-config.js`).
- The dev server serves a copy at `public/config.json` (also gitignored); the build copies it to `docs/config.json`, which is the copy the live site uses.
- The service worker always fetches `config.json` from the network and uses its saved copy only when offline, so changes show up the next time the app opens.

## App icons

Icons are generated from `public/favicon.svg` (currently a placeholder) using `npm run generate-pwa-assets` (settings in `pwa-assets.config.js`).

To change the icon, replace `public/favicon.svg`, or point `pwa-assets.config.js` at a square PNG logo at least 512×512. Then run that script and rebuild.

## Deployment

GitHub Pages serves `docs/` from the `main` branch at [https://mcgicolo.github.io/zoom-link/](https://mcgicolo.github.io/zoom-link/).

To deploy, run `npm run build`, then commit and push `docs/`.
