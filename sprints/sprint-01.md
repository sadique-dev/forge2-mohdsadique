# Sprint 01 — Foundation: Multi-Tenancy, Auth & Roles

**Window:** 11:00 AM – 12:20 PM  
**Status:** [ ] In progress · [ ] Done · [ ] Slipped items carried to Sprint 2

---

## Goal

> Scaffold the full multi-tenant foundation: org schema, user model with roles (admin/agent/customer), Sanctum auth, and org-scoping middleware. No feature UI — just the working backend skeleton that every subsequent sprint builds on.

---

## Issues Assigned to OpenClaw

| # | Issue | Size | Status |
|---|---|---|---|
| S1-01 | Create `organisations` migration + model | S | |
| S1-02 | Create `users` migration with `organisation_id` + `role` enum | S | |
| S1-03 | `BelongsToOrganisation` trait (global scope on all tenant models) | S | |
| S1-04 | `ScopeTenant` middleware — resolves org from auth user, rejects cross-org | M | |
| S1-05 | Sanctum token auth: `/auth/login`, `/auth/logout`, `/auth/me` | M | |
| S1-06 | Role-based Policies skeleton (admin/agent/customer) | S | |
| S1-07 | Database seeder — 2 orgs, 1 admin + 2 agents + 2 customers per org | S | |
| S1-08 | Pest tests: login, me endpoint, cross-tenant 403 probe | M | |

---

## What Shipped

<!-- OpenClaw fills this in via #agent-log — paste the real summary here after merge -->

---

## What Slipped

<!-- Anything not merged by 12:20 PM — carried explicitly to Sprint 2 -->

---

## PR & Commit

| Item | Value |
|---|---|
| PR # | |
| Merged commit | |
| CI result | |
| Merged by | (your name — not the bot) |
