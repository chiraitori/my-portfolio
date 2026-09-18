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
- `migrations/` — D1 schema for viewer analytics and donations.

## External data

Pinned projects are fetched from `gh.chiraitori.dev`. Discord presence uses the Lanyard WebSocket. Viewer counts use the `/api/viewers` route and the D1 database bound as `DB` in `wrangler.toml`.

For local analytics, run `npm run db:migrate:local`. When setting up a new Cloudflare Pages environment, configure its D1 `DB` binding and run `npm run db:migrate:remote` for the production schema.

## PayOS donations

The donation sheet lets visitors choose a VND amount (10,000–2,000,000 VND, in 1,000 VND increments) and leave an optional message. `POST /api/donations/payos` creates a fresh hosted PayOS checkout on the server. The return page checks payment status with PayOS. PayOS sends a signed payment webhook to `/api/donations/payos/webhook`; after verifying the signature, PAID status, order code, and amount, the server sends the donor's message to Discord. Duplicate webhook deliveries do not send duplicate notifications. No PayOS key or Discord webhook URL is sent to the browser.

Create a PayOS payment channel, then add these **encrypted secrets** to the Cloudflare Pages project under **Settings → Variables and Secrets** for the relevant environment:

- `PAYOS_CLIENT_ID`
- `PAYOS_API_KEY`
- `PAYOS_CHECKSUM_KEY`
- `WEBHOOK_URL` (Discord webhook)

Apply D1 migrations with `npm run db:migrate:local` for local development and `npm run db:migrate:remote` for production. Set the PayOS payment channel webhook URL to `https://new-portfolio-v2.pages.dev/api/donations/payos/webhook` after deployment (or use the new portfolio's custom domain if one is configured). Redeploy after setting the secrets. For local testing, put the same names in a git-ignored `.env` or `.dev.vars` file. Do not commit or send the values through chat. Until the credentials and DB binding are configured, PayOS cannot create a checkout. A successful payment needs an internet-accessible webhook URL to deliver the Discord message.

## Direct bank transfer

The Bank transfer option displays a local VietQR image for the Techcombank account and a copy button for its number. Visitors choose the amount and transfer note in their banking app. This option does not create an order, confirm payment on the site, or send a donation message; PayOS remains available for an optional message and automatic confirmation.
