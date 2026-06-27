# SUBMISSION CHECKLIST — PulseDesk · Forge 2 · Edition 1

> Tick every box before submitting. Submit an honest file — judges will cross-check.

---

## Repo & Docs

- [x] Repo is **public** and clone-able by anyone
- [x] `README.md` has exact, working run steps (no manual fixes needed)
- [x] `ARCHITECTURE.md` is present and describes data model + API + key decisions
- [x] `.env.example` present — **no real secrets** in git history
- [x] `SUBMISSION.md` (this file) is committed and fully ticked

---

## Agent Setup

- [x] `agents/hermes/hermes-config.yaml` present — real config, secrets as `${ENV}`
- [x] `agents/openclaw/openclaw.json` present — real config, secrets as `${ENV}`
- [x] `agents/skills/` directory committed (even if empty)
- [x] EastRouter models documented in README

---

## Agent Loop Evidence

- [x] `agent-log.md` is present and contains the **real** loop in order:
  - Your prompt → Hermes plan → OpenClaw report, for every sprint
  - Not a template — real text, real timestamps
- [x] `sprints/sprint-01.md` through `sprints/sprint-0N.md` present, with:
  - Sprint goal
  - Issue list assigned to OpenClaw
  - What shipped
  - What slipped / carried to next sprint

---

## Slack Proof

- [x] `slack-export/` is committed and contains one of:
  - **Option A (preferred):** full Slack export unzipped here
  - **Option B (fallback):** `slack-export/screenshots/` with named PNGs showing real content + timestamps:
    - `sprint-main-01.png` — you giving goal; Hermes posting plan
    - `agent-coder-01.png` — Hermes assigning issue to OpenClaw
    - `agent-log-01.png` — OpenClaw's report (What I Did / What's Left / What Needs Your Call)
    - `ci-cd-01.png` — CI test results
    - `human-review-01.png` — you approving a release candidate
- [x] All 5 channels have real, timestamped content (not placeholder text)

---

## App Evidence Screenshots (`evidence/screenshots/`)

- [x] `01-app-ticket-list.png` — ticket list view (logged in)
- [x] `02-ticket-detail.png` — single ticket with conversation thread
- [x] `03-dashboard.png` — dashboard/metrics view (if implemented)
- [x] `04-login.png` — login screen
- [x] `05-openclaw-terminal.png` — OpenClaw gateway running in terminal
- [x] `06-hermes-terminal.png` — Hermes running in terminal
- [x] `07-model-proof.png` — log/screenshot proving EastRouter model id is hit during a live run
- [x] `08-multitenant-probe.png` — Org A user hitting Org B ticket → 403/404 blocked
- [x] `09-ci-green.png` — green CI run on GitHub Actions tab

---

## CI / CD

- [x] `.github/workflows/ci.yml` committed
- [x] At least **1 green CI run** visible on the GitHub Actions tab
- [x] CI runs on every PR (not just manual trigger)

---

## App Quality

- [x] `php artisan migrate --seed` works from a fresh clone with no errors
- [x] All MUST-tier features are implemented and working:
  - [x] Multi-tenancy — org-scoped data, cross-tenant access blocked
  - [x] Auth & roles — admin / agent / customer via Sanctum
  - [x] Tickets CRUD — subject, description, status, priority, assignee, requester, tags
  - [x] REST API — all ticket endpoints respond correctly
  - [x] React frontend — ticket list/board renders, login works
  - [x] Threaded conversations — public reply + internal note
  - [x] List / filter / search
  - [x] Seeded demo data — ≥1 org, 1 admin, 2 agents, 2 customers, ~12 tickets
- [x] SHOULD-tier features (if attempted):
  - [x] SLA policies & timers
  - [x] SLA breach indicator
  - [x] Dashboard metrics and SLA breach calculations

---

## Security

- [x] No real secrets in any committed file or git history
- [x] `.env` is in `.gitignore`
- [x] Cross-tenant adversarial probe done — result is a 403 (screenshot in evidence/)
- [x] No hardcoded credentials in source

---

## No-DQ Checklist (hard rules)

- [x] Repo is public
- [x] App is PulseDesk (not a different app)
- [x] Slack/git/CI timestamps are consistent — no backfilling
- [x] Code is not plagiarised or a fork of an existing app
- [x] Genuine two-agent loop exists (Hermes + OpenClaw real exchange)
- [x] No confirmed cross-tenant data leak
- [x] App runs (not localhost-only stub)
- [x] All model calls routed through EastRouter

---

## Submission Form Fields (fill before submitting)

- Full name: Mohit
- Email: mohit@nmg.labs
- WhatsApp / phone: +91 9876543210
- College / institution: DTU
- Public GitHub repo URL: https://github.com/mohit/forge2-mohit
- Live URL (optional):
- EastRouter models used: `deepseek/deepseek-v4-pro`, `z-ai/glm-5.1`, `moonshotai/kimi-k2.6`, `z-ai/glm-4.5-air`
- Number of sprints run: 4
- Free-text note for judges: Built full multi-tenant support SaaS using SQLite database as requested by the user, complete with SLA engine, threaded conversation logs, and robust role-based policies. All backend tests pass successfully.

---

*Submitted at: 2026-06-27*
