# AGENTS.md

## Marmalio World — repository handoff rules

This repository is the durable source of truth for implementation work. Chat sessions are not databases and must not be treated as durable project state.

### Required session bootstrap

Before proposing or changing implementation, read these files in order:

1. `docs/ARCHITECTURE_V2_1_DECISIONS.md`
2. `docs/PROJECT_PLAN.md`
3. `CLAUDE.md`
4. `config/ecosystem.yaml` and any relevant module README/spec for the task

The architecture decisions dated **2026-08-24** in `docs/ARCHITECTURE_V2_1_DECISIONS.md` supersede older chat assumptions and older repository statements where they conflict.

### Codex cross-review protocol

When Codex starts a new session on this repository:

1. Read the required bootstrap files above.
2. Compare them against the current Codex chat/context and the current repository state.
3. Report a short **drift review** with:
   - `MATCH` — what already agrees;
   - `CONFLICT` — what the Codex chat or repo still says differently;
   - `MISSING` — decisions from the architecture file not represented in the current work;
   - `NEXT` — the smallest safe next action.
4. Do **not** silently overwrite a conflicting architectural decision. Surface the conflict first.
5. Do not execute publishing, spending, account creation, destructive actions, production deployment, or major architecture changes without explicit human approval.

Codex should act as an independent cross-reviewer and repository assistant unless the human explicitly assigns it implementation ownership for a task. Claude Code remains the primary implementation layer under the current operating model.

### Current commerce/automation constraints

- Validation product: **The AI Productive Prompt Pack**, price target **€10**.
- Internal product ID: `MW-DIG-000001`.
- Customer-facing product name must stay clean; do **not** prefix the visible title with the internal ID.
- **Lemon Squeezy** is the validation-phase commerce system for this digital product.
- **Shopify** is deferred until physical products/dropshipping or another explicitly approved storefront need is scheduled.
- Do not build production **Make** scenarios before the revenue gate of **10 real paying customers**.
- Do not route Lemon Squeezy validation events through Make's community connector. If wiring is needed, prefer Lemon Squeezy's native signed webhooks and repository code.
- Customer PII must not be copied into Notion, Sheets, Drive, prompts, blueprints, or repository files.
- Repository-triggered automation belongs in GitHub Actions; business integration/event routing may use Make after the gate.
- AI-to-AI handoff must be durable: repository specs/files/PRs, not assumptions about one chat reading another chat.

### Implementation style

Prefer the smallest revenue-supporting change. Keep logic, prompts, schemas, tests, and specs versioned in the repository. Use external automation tools for routing/integration rather than burying business logic inside them.
