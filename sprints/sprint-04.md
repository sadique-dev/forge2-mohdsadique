# Sprint 04 — SHOULD Tier: SLA Policies & Breach Indicator

**Window:** 4:10 PM – 5:00 PM  
**Status:** [ ] In progress · [ ] Done · [ ] Slipped items carried to README note

---

## Decision Gate

> ⚠️ Only run this sprint if MUST tier (Sprints 1–3) is **solid and green**.
> If MUST is shaky, use this window to harden it instead.
> A finished MUST tier beats a half-broken SHOULD attempt (handbook FAQ explicit).

---

## Goal

> Implement SLA policies per org: configurable first-response and resolution hours. Attach SLA policies to tickets. Show breach indicator (visual warning) when a ticket is overdue. Confirm any additional SHOULD bullets from handbook §03 and implement if time allows.

---

## Issues Assigned to OpenClaw

| # | Issue | Size | Status |
|---|---|---|---|
| S4-01 | `sla_policies` migration + model | S | |
| S4-02 | `ticket_sla` migration + model (due dates, breached flag) | S | |
| S4-03 | SLA policy CRUD API (`/api/v1/sla-policies`) | M | |
| S4-04 | Attach SLA to ticket on create (or manual attach endpoint) | M | |
| S4-05 | `SlaBreachChecker` — computes `breached` flag (artisan command or queue job) | M | |
| S4-06 | React: breach indicator badge on ticket list (red timer icon if breached) | S | |
| S4-07 | Pest tests: SLA due-date math, breach flag accuracy | M | |
| S4-08 | (Confirm from §03) Any additional SHOULD tier items | TBD | |

---

## What Shipped

<!-- Paste from #agent-log after merge -->

---

## What Slipped

---

## PR & Commit

| Item | Value |
|---|---|
| PR # | |
| Merged commit | |
| CI result | |
| Merged by | |
