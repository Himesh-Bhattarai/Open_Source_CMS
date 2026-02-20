# ContentFlow CMS

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

- `Client/.env.local`
- `Server/.env`
- See `docs/ENVIRONMENT_REFERENCE.md`

3. Start development:

```bash
npm run dev
```

Default dev ports:

- Client: `http://localhost:3000`
- Server: `http://localhost:5000`

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
