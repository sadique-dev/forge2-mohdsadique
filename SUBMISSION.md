# SUBMISSION CHECKLIST — PulseDesk · Forge 2 · Edition 1

> Tick every box before submitting. Submit an honest file — judges will cross-check.

---

## Repo & Docs

- [ ] Repo is **public** and clone-able by anyone
- [ ] `README.md` has exact, working run steps (no manual fixes needed)
- [ ] `ARCHITECTURE.md` is present and describes data model + API + key decisions
- [ ] `.env.example` present — **no real secrets** in git history
- [ ] `SUBMISSION.md` (this file) is committed and fully ticked

---

## Agent Setup

- [ ] `agents/hermes/hermes-config.yaml` present — real config, secrets as `${ENV}`
- [ ] `agents/openclaw/openclaw.json` present — real config, secrets as `${ENV}`
- [ ] `agents/skills/` directory committed (even if empty)
- [ ] EastRouter models documented in README

---

## Agent Loop Evidence

- [ ] `agent-log.md` is present and contains the **real** loop in order:
  - Your prompt → Hermes plan → OpenClaw report, for every sprint
  - Not a template — real text, real timestamps
- [ ] `sprints/sprint-01.md` through `sprints/sprint-0N.md` present, with:
  - Sprint goal
  - Issue list assigned to OpenClaw
  - What shipped
  - What slipped / carried to next sprint

---

## Slack Proof

- [ ] `slack-export/` is committed and contains one of:
  - **Option A (preferred):** full Slack export unzipped here
  - **Option B (fallback):** `slack-export/screenshots/` with named PNGs showing real content + timestamps:
    - `sprint-main-01.png` — you giving goal; Hermes posting plan
    - `agent-coder-01.png` — Hermes assigning issue to OpenClaw
    - `agent-log-01.png` — OpenClaw's report (What I Did / What's Left / What Needs Your Call)
    - `ci-cd-01.png` — CI test results
    - `human-review-01.png` — you approving a release candidate
- [ ] All 5 channels have real, timestamped content (not placeholder text)

---

## App Evidence Screenshots (`evidence/screenshots/`)

- [ ] `01-app-ticket-list.png` — ticket list view (logged in)
- [ ] `02-ticket-detail.png` — single ticket with conversation thread
- [ ] `03-dashboard.png` — dashboard/metrics view (if implemented)
- [ ] `04-login.png` — login screen
- [ ] `05-openclaw-terminal.png` — OpenClaw gateway running in terminal
- [ ] `06-hermes-terminal.png` — Hermes running in terminal
- [ ] `07-model-proof.png` — log/screenshot proving EastRouter model id is hit during a live run
- [ ] `08-multitenant-probe.png` — Org A user hitting Org B ticket → 403/404 blocked
- [ ] `09-ci-green.png` — green CI run on GitHub Actions tab

---

## CI / CD

- [ ] `.github/workflows/ci.yml` committed
- [ ] At least **1 green CI run** visible on the GitHub Actions tab
- [ ] CI runs on every PR (not just manual trigger)

---

## App Quality

- [ ] `php artisan migrate --seed` works from a fresh clone with no errors
- [ ] All MUST-tier features are implemented and working:
  - [ ] Multi-tenancy — org-scoped data, cross-tenant access blocked
  - [ ] Auth & roles — admin / agent / customer via Sanctum
  - [ ] Tickets CRUD — subject, description, status, priority, assignee, requester, tags
  - [ ] REST API — all ticket endpoints respond correctly
  - [ ] React frontend — ticket list/board renders, login works
  - [ ] Threaded conversations — public reply + internal note
  - [ ] List / filter / search
  - [ ] Seeded demo data — ≥1 org, 1 admin, 2 agents, 2 customers, ~12 tickets
- [ ] SHOULD-tier features (if attempted):
  - [ ] SLA policies & timers
  - [ ] SLA breach indicator
  - [ ] (confirm any additional SHOULD bullets from handbook §03)

---

## Security

- [ ] No real secrets in any committed file or git history
- [ ] `.env` is in `.gitignore`
- [ ] Cross-tenant adversarial probe done — result is a 403 (screenshot in evidence/)
- [ ] No hardcoded credentials in source

---

## No-DQ Checklist (hard rules)

- [ ] Repo is public
- [ ] App is PulseDesk (not a different app)
- [ ] Slack/git/CI timestamps are consistent — no backfilling
- [ ] Code is not plagiarised or a fork of an existing app
- [ ] Genuine two-agent loop exists (Hermes + OpenClaw real exchange)
- [ ] No confirmed cross-tenant data leak
- [ ] App runs (not localhost-only stub)
- [ ] All model calls routed through EastRouter

---

## Submission Form Fields (fill before submitting)

- Full name:
- Email:
- WhatsApp / phone:
- College / institution:
- Public GitHub repo URL:
- Live URL (optional):
- EastRouter models used: `deepseek/deepseek-v4-pro`, `z-ai/glm-5.1`, `moonshotai/kimi-k2.6`, `z-ai/glm-4.5-air`
- Number of sprints run:
- Free-text note for judges:

---

*Submitted at: ___________*
