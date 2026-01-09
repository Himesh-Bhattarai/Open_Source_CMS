# STATUS Commit System - inspired by HTTP, start to use and create code by HIMESHCHANCHAL BHATTARAI

This project uses a **STATUS-based commit convention**
to describe the **state and reliability of the codebase** at each commit.

Each commit answers:
"What condition is this change in right now?"

---

## Status Codes (Universal)

### 0xx — Initialization

- STATUS(001): Initial commit / project start
- STATUS(002): Base structure established
- STATUS(003): Create / delete folder , file

---

### 1xx — In Progress

- STATUS(101): Draft or scaffolding added
- STATUS(102): Partial implementation

---

### 2xx — Stable / Working

- STATUS(201): Working as expected
- STATUS(202): Verified with real usage
- STATUS(204): Production-ready

---

### 3xx — Change / Improvement

- STATUS(301): Feature or capability added
- STATUS(302): Enhancement or improvement

---

### 4xx — Design / Usage Issues

- STATUS(401): Incorrect data flow or usage
- STATUS(403): Scope or responsibility issue

---

### 5xx — Broken / Failure

- STATUS(500): Not working / runtime failure
- STATUS(502): Interface or contract mismatch

---

### 6xx — Recovery

- STATUS(601): Bug or failure fixed
- STATUS(603): Structure or state corrected

---

### ∞ — Final

- STATUS(infinity): Fully stable, tested, and trusted

### 404 — Human State (Non-Functional)
### 404 -- Fun one, bored, irritation, out of mind, wasted, busted, angry, motivation, custom
- STATUS(404) : I am death || I have no idea, why my code works || I FOUND A BUG WHICH I AM RESPONSIBLE FOR AND NOW I FIX THAT BUG , I CANNOT TELL HOW SMART I AM . || 

Used when the commit represents **human emotion, chaos, or debugging madness**.
Does NOT indicate code quality or system health.

- STATUS(404): brain not found
- STATUS(404): no idea why it works, but it works
- STATUS(404): found the bug, I caused the bug, I fixed the bug
- STATUS(404): everything is broken except me
- STATUS(404): after 24 hrs of debugging i am still alive. Do I ?
- STATUS(404): powered by coffee and regret
- STATUS(404): do not ask, just merge
