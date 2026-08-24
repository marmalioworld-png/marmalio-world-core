# AGENTS.md

## Marmalio World — repository handoff rules

This repository is the durable source of truth for implementation work. Chat sessions are not databases and must not be treated as durable project state.

### Required session bootstrap

Before proposing or changing implementation, read these files in order:

1. `docs/ARCHITECTURE_V2_2_MULTI_REVENUE.md`
2. `docs/COMPLIANCE_GATES_2026.md`
3. `docs/GERMANY_BUSINESS_SETUP_2026.md`
4. `docs/KIMI_INTEGRATION_2026.md`
5. `docs/A11Y_EVIDENCE_G1_STATUS.md`
6. `docs/ARCHITECTURE_V2_1_DECISIONS.md` (historical predecessor; v2.2 wins where they conflict)
7. `docs/PROJECT_PLAN.md`
8. `CLAUDE.md`
9. `config/ecosystem.yaml` and any relevant module README/spec for the task

The architecture decisions dated **2026-08-24** in `docs/ARCHITECTURE_V2_2_MULTI_REVENUE.md` are the current approved working architecture. Compliance gates are mandatory and cannot be bypassed by an automation or agent.

### Codex cross-review protocol

When Codex starts a new session on this repository:

1. Read the required bootstrap files above.
2. Compare them against the current Codex chat/context and the current repository state.
3. Report a short **drift review** with:
   - `MATCH` — what already agrees;
   - `CONFLICT` — what the Codex chat or repo still says differently;
   - `MISSING` — decisions from v2.2/compliance not represented in the current work;
   - `NEXT` — the smallest safe next action.
4. Do **not** silently overwrite a conflicting architectural or compliance decision. Surface the conflict first.
5. Do not execute publishing, spending, account creation, destructive actions, production deployment, cold outreach, or major architecture changes without explicit human approval.

Codex should act as an independent cross-reviewer and repository assistant unless the human explicitly assigns it implementation ownership for a task. Claude Code remains the primary implementation layer under the current operating model.

### AI team ownership

- **ChatGPT** — strategic manager/architect; prioritization and cross-tool decisions.
- **Claude Code** — primary implementation owner.
- **Codex** — repository cross-review, tests/QA engineering and explicitly assigned implementation.
- **Kimi** — pilot agent for long-context review, independent research, batch QA/localization checks, third-opinion review and explicitly assigned overflow implementation.

No two coding agents may edit the same file concurrently. Every implementation task must declare:

- owner;
- files allowed;
- files forbidden;
- dependencies;
- acceptance criteria;
- approval requirements.

Kimi-specific rules live in `docs/KIMI_INTEGRATION_2026.md`.

### Current revenue / commerce / automation constraints

- Marmalio World runs a **multi-revenue model**: digital products + media/audience + Amazon + affiliate + later physical/dropshipping.
- Initial digital product: **The AI Productive Prompt Pack**, target price **€10**.
- Internal product ID: `MW-DIG-000001`.
- Customer-facing product name must stay clean; do **not** prefix the visible title with the internal ID.
- **Lemon Squeezy** is the validation-phase commerce system for digital products.
- **Shopify** is deferred until physical products/dropshipping or another explicitly approved storefront need is scheduled.
- Product production does **not** stop after product #1; build a small premium portfolio (#1–#5) in sequence while maintaining QA.
- Revenue automation gate `R10` = **10 real paid customer orders across the live digital-product portfolio**, not 10 sales of one product.
- Do not build production **Make** scenarios before R10 unless the architecture is explicitly re-approved for a named critical workflow.
- Do not route Lemon Squeezy validation events through Make's community connector. If wiring is needed, prefer Lemon Squeezy's native signed webhooks and repository code.
- Start audience/content production early (YouTube, Shorts, TikTok, Instagram), with separate rules for general-audience and kids content.
- Kids content is only one optional lane; do not treat it as the default content direction.
- Customer PII must not be copied into Notion, Sheets, Drive, prompts, blueprints, or repository files.
- Repository-triggered automation belongs in GitHub Actions; business integration/event routing may use Make after the gate.
- AI-to-AI handoff must be durable: repository specs/files/PRs, not assumptions about one chat reading another chat.
- A11y Evidence remains on HOLD for public deployment/outreach until the conditions in `docs/A11Y_EVIDENCE_G1_STATUS.md` are satisfied.

### Localization

- Maintain the approved **17-language localization objective**.
- v2.2 defines a working market-oriented 17-language set and a tiered rollout to avoid delaying every product unnecessarily.
- If an older exact historical list is discovered in repository assets or prior source files, surface the discrepancy before changing v2.2.

### Implementation style

Prefer the smallest revenue-supporting change. Keep logic, prompts, schemas, tests, specs, compliance decisions and audit evidence versioned in the repository. Use external automation tools for routing/integration rather than burying business logic inside them.

Never optimize for raw volume at the expense of quality, platform compliance, IP rights, customer experience or long-term account safety.
