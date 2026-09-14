# AGENTS.md — Nicole's Adventure

## Project overview
Pure static HTML5 Canvas platformer game (Valentine's Day themed). No build step, no backend, no database, no dependencies. Vanilla JavaScript + Web Audio API.

## Structure
- `index.html` — entry point, loads all scripts in order
- `src/*.js` — game logic (audio, particles, sprites, player, world, hud, screens, main)
- `styles/main.css` — styling

## Running in Base44
- Served by `nginx:alpine` via `docker-compose.base44.yml` on port 3000
- Source is bind-mounted read-only; edits appear after `reload_preview` (no live-reload dev server for static files)
- **No secrets or environment variables required**
- The `/app` directory needs `chmod 755` so the nginx worker process can read files (the sandbox default is 700)

## Verifying it works
```bash
docker compose -f docker-compose.base44.yml up -d
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/  # expect 200
```
