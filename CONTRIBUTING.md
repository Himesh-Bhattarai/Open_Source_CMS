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
- Use issue/PR templates in `.github/` for consistency

## Commit Format

This repo uses STATUS-style commit messages.

Recommended format:

```text
status(###): short description
```

Accepted prefixes: `status`, `Status`, `STATUS` (recommended: `status`).
Do not add a space between prefix and code. Use `:` between code and summary.

Examples:

- `status(301): add theme load fallback handling`
- `status(601): fix update-page endpoint path`
- `status(203): update environment docs`

See `STATUS.md` for full code mapping.

## STATUS Commit Quickstart (Optional)

If you want local enforcement and a guided commit prompt, use the STATUS_COMMIT
tooling (kept in the separate STATUS_COMMIT repo).

Option A: Copy tooling files into this repo.

1. Copy these files from STATUS_COMMIT into this repo:

```text
.gitmessage
.githooks/commit-msg
.githooks/prepare-commit-msg
scripts/install-hooks.sh
scripts/install-hooks.ps1
```

2. Set the commit template:

```bash
git config commit.template .gitmessage
```

3. Install the hooks:

```bash
bash scripts/install-hooks.sh
```

```powershell
powershell -ExecutionPolicy Bypass -File scripts/install-hooks.ps1
```

Option B: One-command install from the STATUS_COMMIT repo.

1. macOS/Linux:

```bash
./bin/status-commit install --repo /path/to/your/repo
```

2. Windows:

```powershell
powershell -ExecutionPolicy Bypass -File bin/status-commit.ps1 -Repo C:\path\to\your\repo
```

## Coding Notes

- Prefer consistent toast/message UX patterns already used in CMS.
- Keep route changes aligned with `Server/server.js` mount points.
- For frontend API calls, keep env key names explicit in `Client/Api/*`.
- Follow `CODE_OF_CONDUCT.md` in all project interactions.
