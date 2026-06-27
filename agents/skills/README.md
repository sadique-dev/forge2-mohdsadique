# Skills Directory

> Place any custom skills or tools you give to Hermes or OpenClaw here.
> Each skill should be a directory with a `SKILL.md` and optional `scripts/`, `examples/`, `resources/` subdirs.

## Example structure

```
agents/skills/
├── ticket-review/
│   ├── SKILL.md       # trigger name, description, instructions
│   └── scripts/
│       └── check_org_scope.sh
└── sla-checker/
    ├── SKILL.md
    └── scripts/
        └── check_breach.php
```

If no custom skills are used, this directory can remain empty — but it must be committed so judges can see it.
