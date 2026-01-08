# STATUS Commit System - inspired by HTTP,start to use and create code by HIMESHCHANCHAL BHATTARAI

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
