# chiraitori.dev

Chiraitori's portfolio, built with SvelteKit and deployed on Cloudflare Pages. It includes a writing section, pinned GitHub projects, Discord presence, and viewer counts.

## Development

```sh
npm install
npm run dev
```

`npm run check` validates the Svelte and TypeScript code. `npm run build` creates the Cloudflare Pages output.

## Project layout

- `src/routes/` — site pages, global stylesheet, and API routes.
- `src/lib/components/` — reusable UI and page sections.
- `src/lib/data/` — post metadata, presence helpers, and activity icons.
- `src/lib/posts/` — Markdown bodies for the writing section.
- `src/lib/assets/` — images and icons imported by components.
- `static/` — files served by URL, including the easter egg audio.
- `migrations/` — D1 schema for viewer analytics.

## External data

Pinned projects are fetched from `gh.chiraitori.dev`. Discord presence uses the Lanyard WebSocket. Viewer counts use the `/api/viewers` route and the D1 database bound as `DB` in `wrangler.toml`.

For local analytics, run `npm run db:migrate:local`. When setting up a new Cloudflare Pages environment, configure its D1 `DB` binding and run `npm run db:migrate:remote` for the production schema.
