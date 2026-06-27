# PulseDesk — Multi-Tenant Support-Desk SaaS

> **Forge 2 · Edition 1 submission**  
> Stack: Laravel 11 · MySQL 8 · React 19 + Vite · Tailwind CSS  
> Agents: **Hermes** (orchestrator/PO) + **OpenClaw** (coder) via EastRouter

---

## Quick Start — Exact Run Steps

> Judges: these steps should work from a fresh clone with no manual fixes.

### Prerequisites

| Tool | Min Version |
|---|---|
| PHP | 8.2+ |
| Composer | 2.x |
| MySQL | 8.x |
| Node.js | 20+ |
| npm | 10+ |

### 1. Clone & configure

```bash
git clone https://github.com/<your-handle>/forge2-pulsedesk.git
cd forge2-pulsedesk
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Configure your MySQL database credentials in .env.
composer install
php artisan key:generate
php artisan migrate --seed
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

### 4. Run locally

Open **two** terminals:

```bash
# Terminal 1 — Laravel API
cd backend && php artisan serve
# Runs at http://localhost:8000

# Terminal 2 — Vite dev server
cd frontend && npm run dev
# Runs at http://localhost:5173
```

### 5. Login with seeded demo accounts

| Role | Email | Password |
|---|---|---|
| Admin (Org A) | `admin@orga.test` | `password` |
| Agent (Org A) | `agent1@orga.test` | `password` |
| Customer (Org A) | `customer1@orga.test` | `password` |
| Admin (Org B) | `admin@orgb.test` | `password` |

---

## Running Tests

```bash
cd backend
php artisan test
# or: ./vendor/bin/pest
```

---

## Multi-Tenant Isolation — Self-Probe

Log in as `admin@orga.test` and attempt to access an Org B ticket by direct ID in the URL:

```
GET /api/tickets/{orgB_ticket_id}
```

Expected: **403 Forbidden** — tenant middleware blocks cross-org access.

---

## Evidence & Agent Logs

| Location | Contents |
|---|---|
| `agent-log.md` | Full Hermes ↔ OpenClaw ↔ human loop, chronological |
| `sprints/` | One `.md` per sprint: goal, issues, shipped, slipped |
| `slack-export/` | Full Slack workspace export (all 5 channels) |
| `evidence/screenshots/` | Numbered screenshots per checklist in `SUBMISSION.md` |
| `.github/workflows/ci.yml` | CI pipeline — green run visible on Actions tab |

---

## Architecture Overview

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full data model, API shape, multi-tenancy strategy, and key design decisions.

---

## EastRouter Models Used

| Agent | Model |
|---|---|
| Hermes (orchestrator) | `deepseek/deepseek-v4-pro` |
| OpenClaw (coder) | `z-ai/glm-5.1` |
| OpenClaw (long tasks) | `moonshotai/kimi-k2.6` |
| Cheap/repetitive edits | `z-ai/glm-4.5-air` |

---

## Repo Layout

```
forge2-pulsedesk/
├── README.md
├── ARCHITECTURE.md
├── SUBMISSION.md
├── .env.example
├── .github/workflows/ci.yml
├── agents/
│   ├── hermes/hermes-config.yaml
│   ├── openclaw/openclaw.json
│   └── skills/
├── agent-log.md
├── sprints/
│   ├── sprint-01.md  …  sprint-04.md
├── slack-export/
├── evidence/screenshots/
├── backend/          (Laravel 11)
└── frontend/         (React 19 + Vite)
```
