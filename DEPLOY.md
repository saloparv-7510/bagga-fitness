# BAGGA FITNESS — Vercel deployment

The website and the app are **one codebase, two builds** (the same split
`ANDROID.md` opens with):

| Target        | Build command       | Output      | What it is                          |
| ------------- | ------------------- | ----------- | ----------------------------------- |
| Website       | `npm run build`     | `dist/`     | `src/App.jsx` — one long scroll     |
| App (web)     | `npm run build:app` | `dist-app/` | `src/shell/AppShell.jsx` — 5 tabs   |

On Vercel that becomes **two separate projects pointed at the same GitHub repo**
(`saloparv-7510/bagga-fitness`), each with its own build command and output
directory. The Android app is not here — that ships as an APK from `android/`
(see `ANDROID.md`); Vercel only hosts the two web builds.

Both projects use Vercel's GitHub integration, so **every push to `master`
redeploys both sites**. No CLI, no manual upload after the one-time setup below.

---

## Prerequisites

- A Vercel account with access to the `saloparv-7510/bagga-fitness` GitHub repo.
- Nothing to install and nothing to change in the repo. There is deliberately
  **no `vercel.json`** — see [Why there is no `vercel.json`](#why-there-is-no-verceljson).
- Vercel's default Node version is fine; the build pins no `engines`.

---

## Site 1 — Website (`dist/`)

1. Go to **https://vercel.com/new**.
2. **Import Git Repository** → select `saloparv-7510/bagga-fitness`.
3. **Framework Preset:** Vite (auto-detected — leave it).
4. **Build Command:** `npm run build`  *(the default; leave it)*
5. **Output Directory:** `dist`  *(the default; leave it)*
6. **Deploy.**

You get a URL like `bagga-fitness.vercel.app`. This is the marketing site —
the long single-page scroll.

---

## Site 2 — App, web version (`dist-app/`)

Same repo, second project. The two build settings below are the whole reason
this is a separate project — **if you skip them, Vercel builds the website
again** and the "app" URL shows the long scroll instead of the tab bar.

1. Go to **https://vercel.com/new** again → import the **same** repo
   `saloparv-7510/bagga-fitness`.
2. Give the project a **different name**, e.g. `bagga-fitness-app` (Vercel will
   not let two projects share a name).
3. **Framework Preset:** Vite.
4. Expand **Build and Output Settings** and **override both**:
   - **Build Command:** `npm run build:app`
   - **Output Directory:** `dist-app`
5. **Deploy.**

You get a URL like `bagga-fitness-app.vercel.app` — the five-tab app shell
running in a browser.

> The `--mode app` build reads the committed `.env.app` (`VITE_TARGET=app`),
> which is what selects `AppShell.jsx` over `App.jsx` in `src/main.jsx`. That
> file is tracked, so the cloud build picks the tabs with no extra config.

### Verify Site 2 built the app, not the site

Open the Site 2 URL and confirm you see the **five bottom tabs**
(Home · Train · Tools · Food · Gym). If you see the long scrolling page
instead, the two overrides in step 4 didn't take — re-check them under
**Project → Settings → Build & Development Settings**, then redeploy.

---

## After setup: automatic deploys

Both projects are now bound to `master`:

- Push to `master` (or merge a PR into it) → **both** sites redeploy.
- Open a PR → Vercel posts a **preview URL** per project for that branch.

Nothing else to run.

---

## Why there is no `vercel.json`

A `vercel.json` at the repo root applies to **every** project built from that
repo. The two sites need **different** build commands (`npm run build` vs
`npm run build:app`) and **different** output directories (`dist` vs
`dist-app`), so a single shared file cannot express both — put a `buildCommand`
in it and the website project would start building the app, or vice versa.
So the per-project build settings live in the **Vercel dashboard**, and the
repo stays config-free.

Routing needs no config either: the app has **no router** and never touches
`history.pushState`; navigation is component state, so there are no deep-link
URLs that would need a SPA rewrite. Assets resolve from a relative base
(`base: './'` in `vite.config`), so both sites work at their own root domain.

---

## CLI alternative (one-off, no GitHub integration)

If you'd rather deploy by hand instead of connecting GitHub:

```bash
# authenticate this machine once (interactive)
npx vercel login

# website
npm run build
npx vercel deploy dist --prod

# app (web)
npm run build:app
npx vercel deploy dist-app --prod
```

The GitHub-integration path above is preferred: it redeploys on every push,
gives PR preview URLs, and needs no logged-in session on any particular machine.
