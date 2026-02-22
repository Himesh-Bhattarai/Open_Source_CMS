# STATUS Commit System - Inspired by HTTP

**Created by HIMESHCHANCHAL BHATTARAI**

This project uses a **STATUS-based commit convention**
to describe the **state and reliability of the codebase** at each commit.

Each commit answers:
"What condition is this change in right now?"

---

## 💡 Quick Reference (Most Frequently Used)

If you are unsure which code to use, these are the most common:

| Code            | Usage                                                         |
| :-------------- | :------------------------------------------------------------ |
| **STATUS(301)** | **New Feature:** You added something new that works.          |
| **STATUS(601)** | **Bug Fix:** You fixed a broken part of the code.             |
| **STATUS(302)** | **Improvement:** You made an existing feature better.         |
| **STATUS(201)** | **Stable:** General logic update that is working as expected. |
| **STATUS(300)** | **Refactor:** Cleaned up code without changing how it works.  |
| **STATUS(102)** | **WIP:** Partial work that isn't finished yet.                |

---

## Status Codes (Universal)

### 0xx — Initialization

- STATUS(001): Initial commit / project start
- STATUS(002): Base structure established
- STATUS(003): Create / delete folder or file

---

### 1xx — In Progress

- STATUS(101): Draft or scaffolding added
- STATUS(102): Partial implementation

---

### 2xx — Stable / Working

- STATUS(201): Working as expected
- STATUS(202): Verified with real usage
- STATUS(203): Documentation updated (README, JSDoc, etc.)
- STATUS(204): Production-ready

---

### 3xx — Change / Improvement

- STATUS(300): Refactoring (no functional change)
- STATUS(301): Feature or capability added
- STATUS(302): Enhancement or improvement

---

### 4xx — Design / Usage Issues

- STATUS(401): Incorrect data flow or usage
- STATUS(403): Scope or responsibility issue
- STATUS(408): Performance / Latency issues identified

---

### 5xx — Broken / Failure

- STATUS(500): Not working / runtime failure
- STATUS(502): Interface or contract mismatch
- STATUS(503): Security vulnerability or Auth failure

---

### 6xx — Recovery

- STATUS(601): Bug or failure fixed
- STATUS(603): Structure or state corrected

---

### ∞ — Final

- STATUS(infinity): Gold Master / Fully stable, tested, and trusted

### 404 — Human State / Chaos

Used when the commit represents **human emotion or debugging madness**. Does NOT indicate code quality.

- STATUS(404): brain not found
- STATUS(404): no idea why it works, but it works
- STATUS(404): found the bug, I caused the bug, I fixed the bug
- STATUS(404): everything is broken except me
- STATUS(404): after 24 hrs of debugging i am still alive. Do I ?
- STATUS(404): powered by coffee and regret
- STATUS(404): do not ask, just merge
