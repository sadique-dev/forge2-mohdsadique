# PulseDesk — Architecture Document

> **Forge 2 · Edition 1**  
> Written as a living document — updated as OpenClaw ships each sprint.

---

## System Overview

PulseDesk is a **multi-tenant** support-desk SaaS where each Organisation (tenant) has isolated data. A single Laravel backend serves a React SPA via a versioned REST API. All authentication is token-based (Laravel Sanctum).

```
Browser (React 19 + Vite)
        │  HTTPS / REST
        ▼
Laravel 11 API  ──► MySQL 8
        │
        └── Tenant Middleware  (scopes every query to current org)
```

---

## Multi-Tenancy Strategy

| Decision | Choice | Rationale |
|---|---|---|
| Isolation model | **Shared database, shared schema** with `organisation_id` FK on every tenant-owned table | Simplest to implement correctly in the time window; avoids per-tenant DB provisioning |
| Enforcement point | `app/Http/Middleware/ScopeTenant.php` + `app/Traits/BelongsToOrganisation.php` | Centralised — all Eloquent models using the trait auto-scope to `auth()->user()->organisation_id` |
| Auth tokens | Sanctum personal access tokens (per-user, per-device) | Stateless, works for SPA + future mobile |
| Cross-tenant probe | Attempted access of another org's resource → 403 Forbidden | Middleware resolved before controller logic |

---

## Data Model

### Core Tables

```
organisations
  id, name, slug, plan, created_at, updated_at

users
  id, organisation_id (FK), name, email, password,
  role (enum: admin|agent|customer), created_at, updated_at

tickets
  id, organisation_id (FK), subject, description,
  status (enum: open|pending|resolved|closed),
  priority (enum: low|medium|high|urgent),
  requester_id (FK → users), assignee_id (FK → users, nullable),
  created_at, updated_at, resolved_at (nullable)

ticket_tags
  id, ticket_id (FK), tag (string)

conversations
  id, ticket_id (FK), user_id (FK), body (text),
  type (enum: reply|note),   -- note = internal, reply = public
  created_at, updated_at

sla_policies (Sprint 4 — SHOULD tier)
  id, organisation_id (FK), name,
  first_response_hours, resolution_hours,
  created_at, updated_at

ticket_sla
  id, ticket_id (FK), sla_policy_id (FK),
  first_response_due_at, resolution_due_at,
  breached (boolean), created_at, updated_at
```

---

## REST API Shape

Base path: `/api/v1`  
Auth: `Authorization: Bearer {token}`  
All endpoints are org-scoped via middleware.

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Returns Sanctum token |
| POST | `/auth/logout` | Revokes current token |
| GET | `/auth/me` | Current user + org |

### Tickets

| Method | Path | Description |
|---|---|---|
| GET | `/tickets` | List (paginated, filterable) |
| POST | `/tickets` | Create ticket |
| GET | `/tickets/{id}` | Single ticket + conversation thread |
| PATCH | `/tickets/{id}` | Update status/priority/assignee/tags |
| DELETE | `/tickets/{id}` | Soft-delete (admin only) |

### Conversations

| Method | Path | Description |
|---|---|---|
| GET | `/tickets/{id}/conversations` | Thread for a ticket |
| POST | `/tickets/{id}/conversations` | Add reply or internal note |

### Users / Agents

| Method | Path | Description |
|---|---|---|
| GET | `/users` | List org members |
| POST | `/users` | Invite user (admin only) |
| PATCH | `/users/{id}` | Update role |

### SLA (Sprint 4)

| Method | Path | Description |
|---|---|---|
| GET | `/sla-policies` | List org's SLA policies |
| POST | `/sla-policies` | Create policy |
| PATCH | `/tickets/{id}/sla` | Attach/update SLA on ticket |

---

## Key Design Decisions

### 1. Org-scoping is middleware-enforced, not controller-enforced
All tenant-owned Eloquent models use a `BelongsToOrganisation` global scope trait. This means forgetting to add a `where('organisation_id', ...)` in a controller does NOT create a data leak — the trait handles it automatically at model boot time.

### 2. Role-based access is policy-enforced
Laravel Policies (not ad-hoc `if ($user->role == ...)` checks) enforce what each role can see or mutate. Policies are registered in `AuthServiceProvider` and tested with PHPUnit / Pest.

### 3. Conversations are typed (not two separate tables)
`conversations.type` enum (`reply` | `note`) keeps the thread unified and ordered. Frontend filters on `type` to show/hide internal notes based on viewer role.

### 4. Vite proxy rewrites `/api` → `localhost:8000`
No CORS config needed in development. The Vite dev server proxies `/api/*` to Laravel. Production would use Nginx or the same-origin deploy.

### 5. Soft deletes are opt-in and scoped
`SoftDeletes` trait is applied only to `tickets` and `users`. Conversations are not soft-deleted — they follow ticket lifecycle.

---

## CI Pipeline

See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

Steps per PR:
1. `composer install`
2. `php artisan migrate --seed` (against a MySQL database)
3. `php artisan test` / `./vendor/bin/pest`
4. `npm install && npm run build` (frontend lint + type-check)

A green ✅ on every merged PR is a hard requirement.

---

## Agent Architecture

```
You (human)
    │ give sprint goal
    ▼
Hermes (deepseek/deepseek-v4-pro)   — listens on #sprint-main
    │ breaks goal into scoped issues
    ▼
OpenClaw (z-ai/glm-5.1)             — listens on #agent-coder
    │ writes code, opens PR, posts report to #agent-log
    ▼
CI runs on PR                       — result visible in #ci-cd
    │
    ▼
You review PR → approve in #human-review → merge to main
```

Every handoff is visible in Slack. No private DMs between agents.
