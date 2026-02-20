# Deployment Guide (GitHub Actions + Ubuntu VPS + PM2/Docker)

This project supports two deployment methods in the same workflow:

- `pm2` (default): CI artifact -> SSH to VPS -> install prod deps -> PM2 reload
- `docker`: build/push image, SSH to VPS, pull image, restart compose stack

Set repository variable `DEPLOY_METHOD` to `pm2` or `docker`.

## Workflow Path

- `.github/workflows/deploy.yml`

Deployment jobs in this workflow target:

- `environment: production`

Configure required reviewers in GitHub:

- Repository Settings -> Environments -> `production` -> Required reviewers

## Pipeline Model

1. CI builds and tests.
2. CI packages a release artifact (`release-<sha>.tar.gz`).
3. CD deploys the artifact (PM2 path) or image (Docker path).
4. Health checks run post-deploy.
5. Automatic rollback executes on health-check failure.

This avoids rebuilding application code on the server for PM2 deployments.
Secrets are not packed into artifacts; env files are written on server from
GitHub Secrets during deploy.

## Required GitHub Secrets

### SSH / VPS

- `SSH_HOST`: VPS IP or hostname
- `SSH_PORT`: SSH port (usually `22`)
- `SSH_USER`: deployment user
- `SSH_PRIVATE_KEY`: private key used by Actions
- `SSH_FINGERPRINT`: host key fingerprint for SSH verification
- `SERVER_APP_PATH`: absolute app path on VPS (example: `/var/www/contentflow`)
- `HEALTHCHECK_URL`: server health endpoint (example: `http://127.0.0.1:5000/health`)

### PM2 deployment (recommended)

- `SERVER_ENV_FILE` (optional): full content for `Server/.env`
- `CLIENT_ENV_FILE` (optional): full content for `Client/.env.local`

### Docker deployment

- `GHCR_USERNAME`: registry username for pull on VPS
- `GHCR_TOKEN`: registry token with `read:packages` permission

### Sentry (optional)

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

### Notifications (optional)

- `SLACK_WEBHOOK_URL`
- `DISCORD_WEBHOOK_URL`

## Repository Variables

- `DEPLOY_METHOD`: `pm2` or `docker`
- `DOCKER_IMAGE` (optional): full image name, example `ghcr.io/org/repo`
- `DOCKERFILE_PATH` (optional): custom Dockerfile path

## Ubuntu VPS Preparation

## 1. Base packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential ufw
```

## 2. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 3. Install PM2

```bash
sudo npm install -g pm2
pm2 -v
```

## 4. Create deploy directory and clone

```bash
sudo mkdir -p /var/www/contentflow
sudo chown -R $USER:$USER /var/www/contentflow
cd /var/www/contentflow
git clone <YOUR_REPO_URL> .
git checkout deploy
```

## 5. Configure PM2 startup

```bash
pm2 startup
# run the command PM2 prints
pm2 save
```

## 6. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 7. Health endpoint

Ensure backend exposes and serves:

- `GET /health` -> `200`

Then set `HEALTHCHECK_URL` secret to an internal or public URL.

## PM2 Zero-Downtime Note

Use PM2 cluster mode in your ecosystem config for true zero-downtime reload:

```js
instances: "max",
exec_mode: "cluster"
```

The workflow uses a release-directory strategy:

- `releases/<sha>`
- `current` symlink
- atomic symlink switch + PM2 reload

This is a blue/green-style rollout on a single host with fast rollback.

## Docker Deployment Notes

For rollback to work, your compose stack should use `IMAGE_TAG` from `.env`:

```yaml
services:
  server:
    image: ghcr.io/your-org/your-repo:${IMAGE_TAG}
```

The workflow updates `IMAGE_TAG` to `${GITHUB_SHA}` and rolls back to previous tag
if health checks fail.

## Canary / Blue-Green Extension

Current workflow provides blue/green-style release slots on PM2 via
`releases/<sha>` + `current` symlink.

For full canary (weighted traffic split), place Nginx/Traefik/ALB in front and:

1. Run old and new versions in parallel (different upstream pools).
2. Shift traffic gradually (e.g., 10% -> 25% -> 50% -> 100%).
3. Promote or rollback automatically based on health/error metrics.

## Suggested Branch Protection Rules

For branch `deploy`:

- Require pull request before merging
- Require 1-2 approving reviews
- Dismiss stale approvals when new commits are pushed
- Require status checks to pass:
  - `CI`
- Require branches to be up to date before merging
- Restrict who can push directly
- Enable "Require conversation resolution before merging"
- Enforce administrators (recommended)

The workflow also includes a guard step that fails deployments for direct pushes
to `deploy` when the commit is not associated with a merged PR.

For branch `production`:

- No direct pushes
- Require approvals from release owners
- Require successful deployment checks from `deploy` pipeline

## Rollback Strategy

- PM2 mode: rollback to previous release symlink target and PM2 reload
- Docker mode: rollback to previous `IMAGE_TAG` and compose restart

Both modes automatically rollback when health check fails.
