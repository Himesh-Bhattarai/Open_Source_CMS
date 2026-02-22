# Deployment Guide (GitHub Actions + Ubuntu VPS + PM2)

This repository deploys with a PM2-only pipeline:

1. CI runs lint/typecheck/tests/build.
2. CI packages a release artifact (`release-<sha>.tar.gz`).
3. CD uploads artifact to VPS, installs production deps, switches release symlink.
4. PM2 reloads app and runs health checks.
5. Rollback triggers automatically on failure.

Workflow path:

- `.github/workflows/deploy.yml`

## Required GitHub Secrets

- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_FINGERPRINT`
- `SERVER_APP_PATH`
- `HEALTHCHECK_URL`
- `SERVER_ENV_FILE` (optional)
- `CLIENT_ENV_FILE` (optional)

Optional:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SLACK_WEBHOOK_URL`
- `DISCORD_WEBHOOK_URL`

## Pipeline safeguards

- Deploy branch guard (requires merged PR history on push).
- Node dependency cache + `npm ci` lockfile determinism check.
- Artifact-only deploy with release directories (`releases/<sha>`).
- Rollback to previous `current` symlink target if health check fails.
- PM2 command logging for reload/rollback traceability.

## PM2 release layout

- `${SERVER_APP_PATH}/releases/<sha>`
- `${SERVER_APP_PATH}/current` (symlink)

The pipeline updates `current` atomically and then reloads PM2.

## VPS prep checklist

1. Install Node 20 and PM2.
2. Ensure deploy user owns `${SERVER_APP_PATH}`.
3. Configure PM2 startup and `pm2 save`.
4. Expose backend health endpoint (`GET /health`).
5. Set firewall rules for SSH/HTTP/HTTPS.

## Rollback behavior

On deployment failure:

1. Symlink reverts to previous release.
2. PM2 reload/start runs against previous release.
3. Failed new release directory is removed.

## Branch protection recommendations

For `deploy` branch:

- Require pull request before merge.
- Require status checks to pass (`CI` job).
- Restrict direct pushes.
- Require review approvals.
