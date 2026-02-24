# ContentFlow CMS

[![Deploy](https://github.com/Himesh-Bhattarai/Open_Source_CMS/actions/workflows/deploy.yml/badge.svg?branch=deploy)](https://github.com/Himesh-Bhattarai/Open_Source_CMS/actions/workflows/deploy.yml)

ContentFlow is a monorepo CMS with:

- `Client/`: Next.js App Router frontend (CMS UI + website rendering)
- `Server/`: Express + MongoDB backend (auth, content, media, APIs, backup)

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind, Radix UI, Sonner
- Backend: Express, Mongoose, JWT, session/cookies, Redis rate-limiter
- Database: MongoDB

## Repository Structure

```text
Content_Management_System/
|- Client/
|- Server/
|- CONTRIBUTING.md
|- STATUS.md
`- README.md
```

## Prerequisites

- Node.js 20+ recommended
- npm
- MongoDB instance
- Redis instance (required for external API rate limiting)

## Setup

1. Install dependencies:

```bash
npm install
npm --prefix Client install
npm --prefix Server install
```

2. Configure environment files:

- Local development: `Client/.env.local`, `Server/.env`
- Production profile templates: `Client/.env.local.frontend`, `Server/.env.server`
- See `docs/ENVIRONMENT_REFERENCE.md`

3. Start development:

```bash
npm run dev
```

Default dev ports:

- Client: `http://localhost:3000`
- Server: `http://localhost:5000`

## Fork And Branch Policy

- Fork from `main` only.
- Do not fork from `deploy` and do not develop directly on `deploy`.
- Use short-lived feature branches from your fork's `main`, then open PRs back to `main`.
- Promote to production by merging `main` -> `deploy` via PR (no direct pushes).

## Post-Fork Production Checklist

1. Create local env files: `Client/.env.local` and `Server/.env`, then follow `docs/ENVIRONMENT_REFERENCE.md`.
2. Replace local endpoints: change `http://localhost:5000/...` entries in `Client/.env.local` to your API domain.
3. Rotate secrets: generate new JWT/session secrets and OAuth credentials for your own project.
4. Configure deploy secrets/variables in your fork: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`, `SSH_FINGERPRINT`, `SERVER_APP_PATH`, `HEALTHCHECK_URL`, `SERVER_ENV_FILE`, `CLIENT_ENV_FILE`.
5. Configure optional deploy integrations only if used: `SLACK_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL`, and Docker settings (`DEPLOY_METHOD=docker`, `DOCKER_IMAGE`, `GHCR_USERNAME`, `GHCR_TOKEN`).
6. Configure URLs and callbacks: set server `CORS_ORIGIN`, `SERVER_BASE_URL`, OAuth callback URLs, and frontend auth redirect for your domain.
7. Run pre-deploy checks locally before merging to `deploy`: `npm --prefix Client run lint`, `npm --prefix Client run typecheck`, `npm --prefix Client run build`, `npm --prefix Server run test`.

## Common Commands

From repo root:

```bash
# Run client + server together
npm run dev

# Run production start (both)
npm run start

# Frontend build
npm --prefix Client run build

# Frontend lint
npm --prefix Client run lint

# Backend tests
npm --prefix Server run test
```

## API Mount Overview

Server route mounts are centralized in `Server/server.js`.

Detailed map:

- `docs/API_ROUTE_MAP.md`

## Documentation Index

- `docs/README.md`
- `docs/ENVIRONMENT_REFERENCE.md`
- `docs/API_ROUTE_MAP.md`
- `docs/CODEBASE_MAP.md`
- `docs/DEPLOYMENT_GUIDE.md`
- `docs/RELEASE_PROCESS.md`
- `CHANGELOG.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `SUPPORT.md`
- `STATUS.md`

## Commit Convention

This repository uses a `STATUS(code): message` convention.

Examples:

- `STATUS(301): add backup restore endpoint`
- `STATUS(601): fix page update path resolution`

See full mapping in `STATUS.md`.
