# Duta Alamin — Portfolio

Personal portfolio of **Duta Alamin**, software engineer. Interactive single-page experience with real-time 3D characters, project case studies, and a custom "fighting game" character-select interface for browsing the work.

Live: [duta1.com](https://duta1.com)

## Stack

| Area | Technology |
| ---- | ---------- |
| Framework | Vue 3 (`<script setup>`) + TypeScript |
| Build | Vite 6 |
| 3D | three.js (FBX characters, custom render targets) |
| Motion | GSAP + Lenis (smooth scroll) |
| Audio | Howler |
| Styling | SCSS (shared mixins in `src/assets/styles/`) |
| Shaders | GLSL via `vite-plugin-glsl` |

## Getting started

```bash
npm install
npm run env:copy-example   # create .env from .env.example
npm run dev                # http://localhost:3000
```

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Dev server on port **3000** (`strictPort`) |
| `npm run build` | `vue-tsc` typecheck, then production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Typecheck only (`vue-tsc -b`) |
| `npm run env:copy-example` | Copy `.env.example` → `.env` (skips if present) |
| `npm run env:remove` | Delete `.env` |

## Project structure

```
src/
├── animations/      GSAP timelines, scroll waypoints, scene transitions
├── assets/          SCSS design system, 3D models, project thumbnails
├── components/      Reusable UI (buttons, header, footer, cursor, icons)
├── composables/     Vue composables (router, scroll, preloader, transitions)
├── content/         Project copy and metadata, typed per locale
├── features/
│   ├── home/        Landing page sections + character-select store
│   ├── projects/    Project detail page components
│   └── sounds/      Howler audio engine, sprites, hover/click sounds
├── i18n/            Translation helpers and message namespaces
├── three/           three.js core (camera, renderer, scene) and objects
└── utils/           Shared helpers (math, sizes, observer, resources)
```

## Content

- **Projects** — `src/content/projects/{en}/<slug>.ts` holds copy, tags, media and links. Slugs must match `projectIds` in `src/content/projects/index.ts`. Current roster: `quran`, `wave`, `rubic`, `bravo`, `draken`, `pacman`.
- **Previews** — `src/content/projects/previews/` for listing cards.
- **Tags** — variants and labels live in `src/components/tagVariants.ts` (used by `Tag.vue` and the content types).
- **Characters** — the 3D roster is defined in `src/features/home/store/characterSelect.ts`; character setups and the fighter switch live in `src/three/objects/kenney/index.ts`.
- **i18n** — only `en` is currently registered (`src/i18n/constants/index.ts`). Adding a locale means a new folder under `src/content/projects/` and a matching namespace in `src/i18n/messages/namespaces/`.

## Environment

| Variable | Description |
| -------- | ----------- |
| `VITE_SHOW_ATTRIBUTION` | Reserved attribution flag (see Credits below) |

## Credits & Attribution

This project was created and designed by David Heckhoff.

If you use this project or substantial parts of its source code as a base for your own portfolio or work, attribution must be preserved.

Please keep:

- existing credit comments in the source code
- this attribution section in the README
- a visible reference to the original project/repository in derivative works

Original portfolio:
-> https://david-hckh.com

Commercial reuse or redistribution of substantial portions of this project without permission is prohibited.
