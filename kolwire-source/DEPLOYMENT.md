# Deploying KOLwire to GitHub

This guide takes the KOLwire source code from this ZIP to a GitHub repository and a live deployment.

## 1. Prerequisites

- [Node.js 20+](https://nodejs.org) (or [Bun](https://bun.sh))
- [Git](https://git-scm.com)
- A GitHub account

## 2. Unzip and verify locally

```sh
unzip kolwire-source.zip
cd kolwire-source
npm install
npm run dev
```

Open http://localhost:8080 and confirm the app loads. Run the test suite with:

```sh
npm run test
```

## 3. Create the GitHub repository

Option A — GitHub website:

1. Go to https://github.com/new
2. Name the repository (e.g. `kolwire`), choose Public or Private, and click **Create repository**. Do not initialize with a README — one is included.

Option B — GitHub CLI:

```sh
gh repo create kolwire --public --source . --remote origin
```

## 4. Push the code

From the unzipped project folder:

```sh
git init
git add .
git commit -m "Initial commit: KOLwire KOL intelligence platform"
git branch -M main
git remote add origin https://github.com/<your-username>/kolwire.git
git push -u origin main
```

Skip the `git remote add` and `git init` steps if you used `gh repo create --source .`.

## 5. Deploy from GitHub

KOLwire is a TanStack Start app that builds to a Cloudflare Workers target by default.

### Cloudflare Pages / Workers (recommended)

1. In the Cloudflare dashboard, create a new Workers/Pages project connected to your GitHub repo.
2. Build command: `npm run build`
3. Output directory: `.output` (or `dist` depending on your adapter version)
4. Node version: 20

### Vercel / Netlify

1. Import the GitHub repository.
2. Build command: `npm run build`
3. Output directory: `dist` (client assets) — TanStack Start SSR requires the matching adapter; for a static-only deploy you can prerender routes.

### Lovable (one click)

If you keep building in Lovable, use **Publish** in the editor — no GitHub setup needed. Connecting the project to GitHub in Lovable settings keeps this repo in sync automatically.

## 6. Keeping it in sync

- Every push to `main` triggers a new deployment on the connected platform.
- If the project is linked to Lovable, changes made in Lovable are committed to the repo automatically, and pushes to GitHub sync back into Lovable.

## Troubleshooting

- **404 on refresh or deep links**: TanStack Start routes handle this on the Lovable/Cloudflare targets; on static hosts, add a SPA fallback rewrite to `index.html`.
- **Build fails on `routeTree.gen.ts`**: it is generated at dev/build time — run `npm run dev` once, and never edit it by hand.
- **Port already in use locally**: `npm run dev -- --port 3000`.
