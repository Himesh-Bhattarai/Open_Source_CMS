# QA and Launch Validation Runbook

Last updated: 2026-02-21

## 1. E2E smoke tests (cross-browser + mobile)

From `Client/`:

```bash
npm run test:e2e:install
E2E_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

If you want Playwright to auto-start Next dev server, run:

```bash
E2E_START_SERVER=true E2E_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

Configured projects:

- `chromium`
- `firefox`
- `webkit`
- `mobile-chrome` (Pixel 7 profile)

Report output:

- CLI list reporter locally
- GitHub + HTML report in CI

## 2. Manual responsive checks

Validate at minimum:

- 360x800 (mobile)
- 768x1024 (tablet)
- 1366x768 (laptop)
- 1920x1080 (desktop)

Critical pages:

- `/`
- `/site/[tenant]/...`
- `/login`, `/signup`
- `/cms/content/pages`
- `/cms/content/blog`
- `/cms/global/menus`
- `/cms/global/footer`

## 3. TTFB smoke gate

From repository root:

```bash
npm run perf:ttfb -- http://127.0.0.1:5000/health --threshold=500 --samples=7
```

Default threshold is `500ms` (p95). Override with:

- `--threshold=<ms>`
- `--samples=<count>`
- `PERF_TARGET_URL`
- `PERF_TTFB_THRESHOLD_MS`
- `PERF_SAMPLE_COUNT`

## 4. Monitoring endpoints

Server exposes:

- `GET /health` -> basic readiness JSON
- `GET /metrics` -> Prometheus text metrics

If `METRICS_TOKEN` is set in `Server/.env`, requests to `/metrics` must include:

- `x-metrics-token: <METRICS_TOKEN>`

## 5. Launch evidence checklist

Capture and attach to release PR:

- E2E run summary (all configured browser projects)
- Mobile screenshot set for public pages and CMS editor
- TTFB output from `perf:ttfb`
- `/health` and `/metrics` probe output
- Alert routing test (Sentry/Slack/Discord)
