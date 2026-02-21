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

## 5. Dashboard minimums (required)

Before production cutover, confirm these dashboards exist and are shared with engineering owners:

- `Availability`: uptime, `/health` success rate, failed health probes
- `Latency`: p50/p95/p99 request duration and route-level outliers
- `Errors`: 4xx/5xx rate by route + top error signatures (Sentry)
- `Capacity`: CPU, memory, disk, process restarts, PM2 restart count
- `Traffic`: request volume, tenant distribution, and burst patterns

## 6. Alert policy (required)

Configure alert routing to Slack/Discord and incident owner email for:

- `P1`: app unavailable for 5 minutes (health check fails continuously)
- `P1`: 5xx error rate >= 5% for 5 minutes
- `P2`: p95 latency > 1000ms for 10 minutes
- `P2`: memory usage > 85% for 10 minutes
- `P2`: repeated PM2 restarts (>= 3 in 10 minutes)
- `P3`: disk usage > 80%

Alert payload should include:

- environment (`production`)
- service (`client` or `server`)
- timestamp (UTC)
- alert rule and threshold
- quick links (dashboard + runbook + latest deploy SHA)

## 7. Incident response drill

Run one pre-launch test alert per channel and verify:

- alert delivered to Slack/Discord
- owner email received
- acknowledgement workflow documented
- rollback command path validated from deploy logs

## 8. Launch evidence checklist

Capture and attach to release PR:

- E2E run summary (all configured browser projects)
- Mobile screenshot set for public pages and CMS editor
- TTFB output from `perf:ttfb`
- `/health` and `/metrics` probe output
- Alert routing drill output (Slack/Discord/email) + dashboard links
