# Sprint 03 — Threaded Conversations, Filters/Search & Demo Seed

**Window:** 2:35 PM – 3:55 PM  
**Status:** [ ] In progress · [ ] Done · [ ] Slipped items carried to Sprint 4

---

## Goal

> Complete the MUST tier. Add threaded conversations (public reply + internal note) to tickets. Add list filtering and search. Harden and finish the demo seed (≥1 org, 1 admin, 2 agents, 2 customers, ~12 tickets with conversation threads). By end of this sprint the MUST tier must be solid.

---

## Issues Assigned to OpenClaw

| # | Issue | Size | Status |
|---|---|---|---|
| S3-01 | `conversations` migration + model (`type` enum: reply/note) | S | |
| S3-02 | ConversationController: index (thread for ticket), store (add reply or note) | M | |
| S3-03 | Internal-note visibility: agents/admins only (policy guard) | S | |
| S3-04 | React: `ConversationThread` component (public replies + internal notes, role-gated) | M | |
| S3-05 | React: `TicketFilters` — filter by status, priority, assignee; search by subject | M | |
| S3-06 | Backend: filter + search query params on `/api/v1/tickets` | M | |
| S3-07 | Seed: 2 orgs, 1 admin + 2 agents + 2 customers each, ~12 tickets, ~3 conversation entries per ticket | M | |
| S3-08 | Pest tests: conversation thread, note visibility, filter accuracy | M | |

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
