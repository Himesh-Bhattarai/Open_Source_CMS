# Security Policy

## Supported Versions

Security fixes are provided for the active development branch:

| Version | Supported |
| --- | --- |
| `main` | Yes |
| Older branches/tags | No |

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Use one of these private channels:

- GitHub Security Advisories (preferred)
- Direct maintainer contact on GitHub: `@Himesh-Bhattarai`

## What to Include in Your Report

- Affected endpoint/page/module
- Steps to reproduce
- Expected vs actual behavior
- Impact assessment (data exposure, auth bypass, etc.)
- Proof of concept (logs, request samples, screenshots)
- Suggested remediation (optional)

## Response Targets

- Initial acknowledgement: within 72 hours
- Triage and severity classification: within 7 days
- Fix timeline: depends on severity and complexity

## Scope Notes

In-scope examples:

- Auth or permission bypass
- Broken access control between tenants/users
- Sensitive data exposure
- Injection vulnerabilities
- Misconfigured CORS/cookie/session security

Out-of-scope examples:

- Issues requiring outdated/unpatched third-party software
- Social engineering attempts
- Non-security bugs without exploitable impact
