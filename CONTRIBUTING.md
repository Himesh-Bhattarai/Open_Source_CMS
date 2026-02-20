# Contributing

Thanks for contributing to ContentFlow CMS.

## Project Layout

- `Client/`: Next.js CMS/frontend
- `Server/`: Express backend
- Root scripts run both services using `concurrently`

## Development Setup

1. Install dependencies:

```bash
npm install
npm --prefix Client install
npm --prefix Server install
```

2. Configure:

- `Client/.env.local`
- `Server/.env`

3. Start locally:

```bash
npm run dev
```

## Branch Naming

Use focused branches:

- `feature/<name>`
- `fix/<name>`
- `refactor/<name>`
- `docs/<name>`

## Pull Request Checklist

- Changes are scoped and focused
- No secrets committed
- API contracts remain backward compatible, or breaking changes are documented
- Frontend builds successfully: `npm --prefix Client run build`
- Backend tests pass: `npm --prefix Server run test`
- Docs updated when behavior changes

## Commit Format

This repo uses STATUS-style commit messages.

Format:

```text
STATUS(<code>): short description
```

Examples:

- `STATUS(301): add theme load fallback handling`
- `STATUS(601): fix update-page endpoint path`
- `STATUS(203): update environment docs`

See `STATUS.md` for full code mapping.

## Coding Notes

- Prefer consistent toast/message UX patterns already used in CMS.
- Keep route changes aligned with `Server/server.js` mount points.
- For frontend API calls, keep env key names explicit in `Client/Api/*`.
- Follow `CODE_OF_CONDUCT.md` in all project interactions.
