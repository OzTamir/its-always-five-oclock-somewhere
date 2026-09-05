# Agent Guide — It's Always Five O'Clock Somewhere

A whimsical, fully static single-page site that tells you where on Earth it's
currently 5 o'clock, in randomized Windows 95 WordArt. Live at
[itsalwaysfiveoclocksomewhere.com](https://itsalwaysfiveoclocksomewhere.com).

**Tone matters here**: this is a fun project. Copy is playful, the aesthetic is
deliberately 1996, and clever-but-accurate beats enterprise-grade. Keep it that
way.

## Stack

- Vite + React 19 + TypeScript (strict), Tailwind CSS **v4** (CSS-first config)
- No backend, no APIs, no fonts or assets fetched from anywhere — everything
  derives from the browser's IANA timezone database via `Intl`. The one
  external request is the Plausible analytics snippet in `index.html`
  (cookie-less pageview counting; never add tracking beyond that)
- Deployed as a Cloudflare **Workers static-assets** project (not Pages)

## Commands

```bash
npm install
npm run build      # tsc -b && vite build → dist/  (use this to verify changes)
npm run lint       # oxlint
npm run preview    # serve dist/ locally (use this over `npm run dev`)
node scripts/generate-zone-meta.mjs   # regenerate src/lib/zoneMeta.ts
```

Don't start `npm run dev` unless explicitly asked; build + preview is the
verification path. There is no test framework — the engine was validated with
one-off Node scripts (see Verifying below).

## Architecture

| Path | What it is |
|------|------------|
| `src/lib/fiveOClock.ts` | **The engine.** Pure functions: who's at 17:xx (freshest first, famous cities win ties), who's next, % of world past five, labels. All time math lives here. |
| `src/lib/zoneMeta.ts` | **Generated — do not hand-edit.** Zone → [country code, lat, lon], built from IANA `zone.tab` by `scripts/generate-zone-meta.mjs` (needs `/usr/share/zoneinfo/zone.tab`, present on macOS/Linux). |
| `src/App.tsx` | Composition + the ticking clock. Report recomputes once per minute (`minuteKey` memo); seconds tick only drives countdowns/taskbar clock. |
| `src/components/WordArt.tsx` | SVG WordArt (`textPath` + gradient + extruded shadow). `PRESETS` holds geometry+palette per variant; `palette` prop borrows colors across variants (the header arch always matches the city's random preset). Stretch is capped at ~1em/char so short names don't become taffy. |
| `src/components/FiveOClockHero.tsx` | Main window: header arch, random-per-visit city WordArt, globe, status line, "also pouring in" chips. Reads `?city=` / `?style=` overrides. |
| `src/components/GlobePanel.tsx` | Pixel world map: every IANA reference city from `zoneMeta` is one dot on an equirectangular grid — the continents emerge from the data. Blinking crosshair pins the featured place. |
| `src/components/Win95Window.tsx` | Window chrome (gradient title bar, fake controls). All widgets wrap in this. |
| `src/components/widgets/` | `YourClock` (LocalStatus.exe), `NextUp` (Next Round.exe), `PartyMeter` (GlobalStatus.exe). |
| `src/components/Ticker.tsx`, `Taskbar.tsx` | Scrolling marquee; fixed Start-bar with live tray clock. |
| `src/index.css` | The whole design system: `@theme` tokens (Win95 palette, font stacks, `--animate-*` keyframes) and `@utility` bevels. |

### Core invariant

IANA offsets span UTC-12:00 to UTC+14:00, so at any moment at least one zone's
clock reads 17:xx. `getFiveOClockReport` relies on this; the fallback path for
threadbare zone lists must stay.

## Conventions

- **Commits**: Conventional Commits, small and logical.
- **Branches**: never commit to `main`; branch per change
  (`feat/…`, `fix/…`, `docs/…`) and open a PR.
- **Styling**: Tailwind utilities in JSX; shared design tokens/utilities go in
  `src/index.css`. Win95 palette colors are theme tokens (`bg-face`,
  `bg-desktop`, `text-sunny`…); bevels are `bevel-out` / `bevel-in` /
  `*-thin`. System fonts only (`font-system`, `font-display`, `font-comic`,
  `font-lcd`) — never add webfonts or any external resource (the Plausible
  script tag in `index.html` is the sole, deliberate exception).
- **Tailwind v4 gotcha**: `@apply` only works with real utilities — custom
  reusable classes must be declared with `@utility`, not `@layer components`.
- **Names**: on-theme window titles (`SomethingStatus.exe`) and playful
  microcopy. Weird IANA city spellings get fixed in `SPECIAL_CITY_NAMES` in
  the engine, not in components.

## Verifying changes

1. `npm run build` (type-checks too) and `npm run lint` must pass.
2. Engine changes: smoke-test in Node, e.g.
   `node --experimental-strip-types -e "import('./src/lib/fiveOClock.ts').then(m => console.log(m.getFiveOClockReport()))"` —
   sweep a full simulated day and assert the featured place is always at 17:xx.
3. UI changes: `npm run preview`, then screenshot with browser tooling at
   **1280×900** and **390×844** (mobile matters). Check the browser console.
4. Test WordArt with extreme names via the easter-egg params:
   `/?city=Fiji`, `/?city=SredNekolymskLongName`, `/?style=chrome|wave|valley|sunset|fiesta`.

## OG image

`public/og-image.png` is a real screenshot of the site (1200×630). To refresh:
build + preview, screenshot the viewport at 1200×630 (device scale 1, or
downscale with `sips -z 630 1200`), overwrite the file. Keep `index.html` OG
tags in sync if copy changes.

## Deploy (don't break this)

Cloudflare **Workers Builds** runs `npm run build` then `npx wrangler deploy`
on pushes to `main`. `wrangler.jsonc` defines an **assets-only Worker**
(`assets.directory: ./dist`, SPA not-found handling) — do **not** reintroduce
Pages-style config (`pages_build_output_dir`) or add a `main` script unless
actually adding server code. `public/_headers` sets immutable caching for
hashed `/assets/*`; Vite copies it into `dist/` automatically. PRs get preview
deployments; merges to `main` go to production.
