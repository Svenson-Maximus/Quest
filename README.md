# Danita's Quest

A static GitHub Pages-ready quest tracker for Danita's Minecraft progression.

## Features

- Personal password gate with the phrase `Danitas-Quest`
- Three independent active quest paths
- Browser-local save progress with `localStorage`
- XP, levels, completion history, export, import, and reset
- No backend and no build step

## Run Locally

Open `index.html` in a browser.

For a local server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages

Push this repository to GitHub, then enable:

```text
Settings -> Pages -> Deploy from branch -> main -> /root
```

The app is static, so GitHub Pages can host it for free.

## Quest Data

Quest content lives in `quests.js`. The Pathfinder list currently includes the complete quests that were provided before the source text cut off.
