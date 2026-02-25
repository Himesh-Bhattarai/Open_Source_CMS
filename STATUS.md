# STATUS Commit System (Inspired by HTTP)

**Created by HIMESHCHANCHAL BHATTARAI**

This project uses a STATUS-based commit convention to describe the state and
reliability of the codebase at each commit.

Each commit answers: "What condition is this change in right now?"

## Format

Recommended:

```
status(###): short description
```

Rules:
- Accepted prefixes: `status`, `Status`, `STATUS` (recommended: `status`).
- No space between prefix and code: `status(201)` not `status (201)`.
- Use `:` between code and summary.
- Compatible legacy form: `status:201: short description`.
- Special case: `status(infinity): short description`.

## Quick Reference (Most Frequently Used)

| Code         | Usage                                                         |
| :----------- | :------------------------------------------------------------ |
| status(301)  | New feature: you added something new that works.              |
| status(601)  | Bug fix: you fixed a broken part of the code.                 |
| status(302)  | Improvement: you made an existing feature better.             |
| status(201)  | Stable: general logic update that is working as expected.     |
| status(300)  | Refactor: cleaned up code without changing how it works.      |
| status(102)  | WIP: partial work that isn't finished yet.                    |
| status(203)  | Docs: documentation updates (README, JSDoc, etc.).            |

## Decision Guide

If you are unsure, use this quick logic:
- Works and tested: use 2xx.
- Partially done: use 1xx.
- New feature: use 3xx.
- Refactor: use 300.
- Fixing a bug: use 6xx.
- Broken / failing: use 5xx.
- Design or usage flaw: use 4xx.
- Initial structure / bootstrap: use 0xx.
- Human chaos: use 404.

## Status Codes (Universal)

### 0xx — Initialization

- status(001): Initial commit / project start
- status(002): Base structure established
- status(003): Create / delete folder or file

### 1xx — In Progress

- status(101): Draft or scaffolding added
- status(102): Partial implementation
- status(103): Blocked or waiting on external dependency
- status(104): Research or exploration mode

### 2xx — Stable / Working

- status(201): Working as expected
- status(202): Verified with real usage
- status(203): Documentation updated (README, JSDoc, etc.)
- status(204): Production-ready

### 3xx — Change / Improvement

- status(300): Refactoring (no functional change)
- status(301): Feature or capability added
- status(302): Enhancement or improvement

### 4xx — Design / Usage Issues

- status(401): Incorrect data flow or usage
- status(403): Scope or responsibility issue
- status(408): Performance / latency issues identified
- status(409): Works but known risks or fragility

### 5xx — Broken / Failure

- status(500): Not working / runtime failure
- status(502): Interface or contract mismatch
- status(503): Security vulnerability or auth failure

### 6xx — Recovery

- status(601): Bug or failure fixed
- status(603): Structure or state corrected

### Special Codes

- status(infinity): Gold master / fully stable, tested, and trusted

### 404 — Human State / Chaos

Use when the commit represents human emotion or debugging madness.
This does NOT indicate code quality.

- status(404): brain not found
- status(404): no idea why it works, but it works
- status(404): found the bug, I caused the bug, I fixed the bug
- status(404): everything is broken except me
- status(404): after 24 hrs of debugging i am still alive. Do I ?
- status(404): powered by coffee and regret
- status(404): do not ask, just merge

## Examples

- status(301): add multi-tenant sitemap generation
- status(601): fix page update path resolution
- status(203): update environment reference
- status(103): blocked on OAuth callback approval
