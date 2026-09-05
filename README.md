# It's Always Five O'Clock Somewhere 🍺

[itsalwaysfiveoclocksomewhere.com](https://itsalwaysfiveoclocksomewhere.com) — a live
world clock that tells you where on Earth it's currently 5 o'clock, in glorious
Windows 95 WordArt.

Because IANA timezone offsets span UTC-12:00 to UTC+14:00, at any moment at
least one timezone's clock reads 17:xx. This site finds it, arches it in
rainbow gradient Arial Black, and pinpoints it on a world map drawn entirely
out of timezone reference cities.

## How it works

- **No backend, no APIs, no data downloads.** Everything derives from the
  browser's own IANA timezone database via `Intl.supportedValuesOf('timeZone')`
  and `Intl.DateTimeFormat`. The only thing the page phones home to is
  [Plausible](https://plausible.io), for cookie-less visit counting.
- Country names and map coordinates come from a table generated off IANA
  `zone.tab` (`scripts/generate-zone-meta.mjs`).
- The city WordArt picks a random preset per visit (`wave`, `valley`,
  `chrome`, `sunset`, `fiesta`). Try `?style=chrome` to pick one, or
  `?city=Your Town` to make it 5 o'clock wherever you like.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

Built with Vite, React 19, TypeScript, and Tailwind CSS v4. System fonts only —
the WordArt is SVG, not images.

## Project layout

```
src/lib/fiveOClock.ts     the timezone engine (all the time math)
src/lib/zoneMeta.ts       generated zone → country/lat/lon table (do not edit)
scripts/                  generator for the above (reads IANA zone.tab)
src/components/           WordArt, Win95 window chrome, hero, globe, ticker, taskbar
src/components/widgets/   LocalStatus.exe, Next Round.exe, GlobalStatus.exe
src/index.css             Tailwind v4 theme: Win95 palette, bevels, keyframes
```

Working on this with a coding agent? Read [AGENTS.md](./AGENTS.md) — it covers
conventions, verification steps, and deploy constraints (`CLAUDE.md` points
there too).

## Deploying (Cloudflare Workers)

Connected via [Workers git integration](https://developers.cloudflare.com/workers/ci-cd/builds/)
as a static-assets Worker — `wrangler.jsonc` points at `dist/` and there is no
server code:

| Setting           | Value                |
| ----------------- | -------------------- |
| Production branch | `main`               |
| Build command     | `npm run build`      |
| Deploy command    | `npx wrangler deploy` |

No environment variables or bindings required. Hashed assets under `/assets/*`
get immutable cache headers via `public/_headers`.

---

Made with 🍺 by [Oz Tamir](https://oztamir.com). Please drink responsibly,
wherever it's five.
