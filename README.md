# Single-Task

A **frontend-only** anti-multitasking shell. Name the **one** thing you're doing,
and everything else literally fades away: full-screen focus mode, the one task
huge, a radial haze dimming the edges, nothing else on screen. An optional timer
(default 25m, pause/resume) keeps you honest. Extras can be parked "for later"
in a quiet queue. No backend, works offline.

## The flow

Type the one thing (or queue extras "for later") → **focus mode** with just the
task (and an optional timer) → **Done** offers the next from the queue, or "give
up for now" backs out.

## Tech

React 19 + TypeScript (strict), Vite, Tailwind v4, Zustand, Zod-validated
localStorage, PWA. Tested with Vitest + Testing Library and Playwright.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Notes

- The queue and settings persist (parsed with Zod; safe defaults). The repository
  round-trip is unit-tested.
- Entrances animate transform only (opacity stays 1); the focus-mode fade
  deliberately animates opacity from 0.4, never 0, so it can't freeze invisible.
  Reduced motion honored. Two themes (void + paper).

## License

MIT.
