# MCGI Zoom Meeting Generator

A mobile-first Vue app that generates personalized Zoom meeting links with properly formatted display names.

## Features

- Mobile-first responsive design
- Step-by-step one-question-at-a-time flow
- English and Tagalog locale support
- LocalStorage form persistence
- One-click copy and join functionality

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output is generated in `dist/`.

## Configuration

To use this with your own Zoom meeting, update the `ZOOM_CONFIG` object in `src/App.vue`.

## GitHub Pages Deployment

You can deploy the generated `dist/` files to GitHub Pages (for example using `gh-pages` branch or `docs/` folder flow).
