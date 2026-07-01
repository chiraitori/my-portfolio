# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Cloudflare viewer analytics

The viewer card uses Cloudflare Pages Functions and a D1 database. It stays within the
Cloudflare free tier for normal portfolio traffic.

1. Log in to Wrangler with `npx wrangler login`.
2. Create the database with `npm run db:create`.
3. Copy the returned database ID into `wrangler.toml`.
4. Apply the schema with `npm run db:migrate:remote`.
5. In Cloudflare Pages, add a D1 binding named `DB` for the `portfolio-analytics` database.
6. In Cloudflare Pages, go to **Settings → Functions** and enable **View Analytics**.
7. Add this custom path to route viewer requests to the function:
```
/api/v1/analytics/view/*
```

Use `npm run db:migrate:local` to create the local development database.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.0 create --template minimal --types ts --add prettier tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:auto" mcp="ide:other+setup:remote" --no-install new-portfolio-v2
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
