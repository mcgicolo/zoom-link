# MCGI Zoom Meeting Generator

A mobile-first Vue app that generates personalized Zoom meeting links with properly formatted display names.

## Features

- Mobile-first responsive design
- Step-by-step one-question-at-a-time flow
- English and Tagalog locale support
- LocalStorage form persistence
- One-click copy and join functionality

## One-Command Installer

Use the installer to generate and publish a ready-to-use Zoom page repository.

Installer script: [https://github.com/mcgicolo/zoom-link](https://github.com/mcgicolo/zoom-link)

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/mcgicolo/zoom-link/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/mcgicolo/zoom-link/main/install.ps1 | iex
```

### Windows (Git Bash)

```bash
curl -fsSL https://raw.githubusercontent.com/mcgicolo/zoom-link/main/install.sh | bash
```

The installer will ask for:

- GitHub repo URL (example: `https://github.com/OWNER/REPO`)
- GitHub email
- GitHub pass/token
- Worker's name
- Worker's phone
- Zoom ID
- Zoom pass
- Allowed locales (press Enter to use defaults)

It then:

- downloads `docs/` into a local folder named after the repo
- creates `config.json` from your answers
- pushes to your target GitHub repo
- enables GitHub Pages and prints the URL

### How the installer works

```mermaid
flowchart TD
    Start([Run install.sh]) --> Deps{"git and gh installed?"}
    Deps -->|No| Install[Install via brew, apt, or winget]
    Install --> Prompts
    Deps -->|Yes| Prompts[Interactive prompts]
    Prompts --> Input[Collect repo URL, email, token, worker, Zoom, locales]
    Input --> Parse[Parse URL to owner/repo. Target dir = ./repo]
    Parse --> Exists{"Target dir empty or new?"}
    Exists -->|No| Abort([Abort: directory exists])
    Exists -->|Yes| Auth[Configure GitHub CLI auth]
    Auth --> Download[Download docs from template repo into target dir]
    Download --> Config[Write config.json from answers]
    Config --> Git[Git init, user config, add, commit]
    Git --> Push{"Remote origin set?"}
    Push -->|No| Create[gh repo create and push]
    Push -->|Yes| PushOnly[git push -f origin main]
    Create --> Pages
    PushOnly --> Pages[Enable GitHub Pages on main branch]
    Pages --> Done([Print Pages URL. Visit after 1-3 minutes])
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output is generated in `docs/`.

## Configuration

To use this with your own Zoom meeting, update the `ZOOM_CONFIG` object in `src/App.vue`.

## GitHub Pages Deployment

You can deploy the generated `dist/` files to GitHub Pages (for example using `gh-pages` branch or `docs/` folder flow).
