# Marmalio World — Architecture v2.1 decisions

Date: 2026-08-24
Status: accepted working architecture for validation phase

This file is the durable handoff from the ChatGPT/Claude architecture review. It supersedes older chat assumptions and older repository statements where they conflict.

## 1. Control and responsibility model

- Human owner: final approval for publishing, spending, account creation, destructive actions, production deployment, and major architecture changes.
- ChatGPT: strategic manager / architect. Sets direction, priorities, architecture, and cross-tool decisions.
- Claude Code: primary implementation/execution layer for repository code, scripts, schemas, tests, and technical wiring.
- Codex: independent cross-reviewer and repository assistant unless explicitly assigned implementation ownership for a task.
- Specialist agents: Research, Product Builder, Localization, Compliance, QA.
- QA gate: target >= 85/100 before publication unless explicitly overridden by the human owner.

Durable AI-to-AI handoff happens through repository files/specs/PRs, not by assuming one chat product can read another chat session.

## 2. Validation product and revenue gate

Validation product:
- Name: `The AI Productive Prompt Pack`
- Price target: `€10`
- Internal ID: `MW-DIG-000001`

Revenue/automation gate:
- Phase 3+ automation remains locked until **10 real paying customers** have been reached for the validation product or the architecture is explicitly re-approved.
- Before the gate, prioritize product quality, checkout, delivery, listing, launch, and real customer validation over infrastructure.

## 3. Commerce platform decision

### Validation phase

Use **Lemon Squeezy** as the commerce system for the validation-phase digital product.

Role:
- checkout;
- digital file delivery;
- customer/order authority for this product;
- payment/financial transaction authority for this product;
- Merchant of Record handling for transaction-level VAT/GST where applicable under Lemon Squeezy's service model.

### Shopify

Shopify is **deferred for the validation product**. Keep the existing Shopify work/store available, but do not make it the system of record for this first digital-product validation sprint.

Reactivate Shopify when:
- physical products are scheduled;
- dropshipping is scheduled;
- or an explicitly approved storefront requirement makes Shopify materially useful.

This changes older repository language that called Shopify the immediate primary channel for the first digital product.

## 4. Product identity and source of truth

The visible customer-facing product title must remain clean:

`The AI Productive Prompt Pack`

Do not expose the internal product ID in the customer-facing title unless a later explicit decision changes this.

Internal mapping:

`MW-DIG-000001 <-> Lemon Squeezy product_id / variant_id`

Where available, direct checkout links may also carry:

`custom_data.product_id = "MW-DIG-000001"`

Do not rely on custom data as the only identity mechanism. Persist Lemon Squeezy native identifiers in the internal mapping as well.

Shared identifier rules:
- `product_id` identifies a product across systems;
- `task_id` identifies AI/implementation handoffs;
- `run_id` identifies automation/job executions and logs.

## 5. Data ownership

### Product commercial fields

Before first publish:
- Notion/repository planning data may define draft commercial fields.

After first publish in Lemon Squeezy:
- Lemon Squeezy is authoritative for the live product's commercial state such as live price/product/variant state.
- Internal systems should mirror rather than silently overwrite live commerce fields.

### Customer PII

Customer identity/order PII stays in the commerce/payment system and approved correspondence system only.

Do not copy customer name, email, payment data, or address into:
- Notion;
- Sheets;
- Drive;
- prompts;
- repository files;
- automation blueprints;
- logs not explicitly designed for compliant PII handling.

If sanitized order analytics are later added, limit them to fields such as:
- order ID;
- timestamp;
- product ID;
- quantity;
- net value;
- currency;
- destination country where justified.

## 6. Make decision

Make remains a planned automation bus, but **no production Make scenarios are built before the 10-customer gate** for the validation product.

Reasoning:
- one product and a handful of orders do not justify automation build/maintenance time;
- Lemon Squeezy's Make connector is community-supported rather than the preferred first-party path for this critical validation flow;
- Lemon Squeezy provides native signed webhooks and test mode for direct event handling if wiring becomes necessary.

Therefore:
- install/learn Make if useful, but do not make it a production dependency yet;
- do not route Lemon Squeezy validation events through the community connector;
- after the gate, reassess Make Core and scenario needs.

Make's role after the gate:
- cross-SaaS event routing;
- mapping/filtering/retries/error routing;
- moving data between business systems.

Do not put durable business logic, long prompts, schemas, or testable AI generation logic inside Make when repository code is a better fit.

## 7. GitHub Actions and repository logic

Use GitHub Actions for repository-triggered automation and release/repository workflows.

Keep in the repository:
- prompts as code;
- JSON schemas;
- evaluation cases;
- Claude Code skills/project guidance;
- scripts;
- tests;
- automation specs;
- architecture decisions.

Rule of thumb:
- if it needs a diff or a test, it belongs in the repository;
- if it primarily moves data between SaaS products, Make may be appropriate after the gate.

## 8. Lemon Squeezy integration rules

Start with Lemon Squeezy **test mode**.

Before switching live:
- validate checkout;
- validate digital file delivery;
- validate internal product ID mapping;
- if webhook wiring exists, validate the full checkout-to-webhook path with test/simulated events;
- use separate test vs live credentials where supported;
- verify webhook signatures using the Lemon Squeezy signing secret;
- never commit API keys/signing secrets.

If no automation is needed before the revenue gate, manual entry of the one validation product into Notion/internal tracking is preferred to building a sync for a single row.

## 9. Make scenario triage

Current status:
- `SCN-01` Shopify -> Notion mirror: superseded/deferred for validation phase.
- `SCN-02` sanitized order log: defer until after 10 paying customers; source should be Lemon Squeezy native webhook/direct code path rather than Shopify-via-Make.
- `SCN-12` central error sink: keep the specification/design intent, but do not build until there is an automation scenario to protect.
- GitHub-triggered scenarios/workflows: move to GitHub Actions.
- AI generation/KPI logic: prefer repository scripts.

## 10. Tools — NOW / NEXT / LATER

### NOW / core
- ChatGPT
- Claude Code
- VS Code
- GitHub
- Notion
- Canva
- Lemon Squeezy for the validation product

### Installed/learned but not yet production-critical
- Make — learn/install, production automation gated until 10 customers.

### Deferred / gated
- Shopify — validation-product commerce deferred; returns for physical/dropshipping or explicitly approved storefront need.
- Metricool — when regular social publishing starts; avoid duplicating with a separate Make social scheduler.
- HeyGen — activate only once business revenue justifies it and avatar/localization video workflows are needed.
- Tool4seller — when Amazon selling is active.
- Polar Analytics — when sales/ad volume justifies deeper cross-channel analytics.
- Ahrefs — when SEO scale/competitor analysis justifies cost.
- Book-to-Skill — later/pilot.
- OmniRoute — later; avoid premature model-routing complexity.
- OpenArt / Smart Shot — defer unless a measurable creative bottleneck appears.
- Micro-App Factory / 10x.app — later, after core product/content revenue engine is working.

### Claude continuity candidates
- Do not add both Claude-Mem and Task Observer by default. Reassess only if repository guidance/docs are insufficient.

## 11. Immediate implementation sequence

1. Read this architecture file before changing commerce or automation assumptions.
2. Confirm/retain internal ID `MW-DIG-000001` for the validation product.
3. Create/configure Lemon Squeezy in test mode, subject to human approval for account creation where required.
4. Create the validation product with clean customer-facing title.
5. Upload/attach the actual customer delivery file(s).
6. Persist the mapping from `MW-DIG-000001` to Lemon Squeezy native product/variant IDs in an appropriate internal record/spec.
7. Configure direct checkout custom data with `product_id` where supported and useful.
8. Run end-to-end test checkout and delivery.
9. Verify no customer PII is leaking into Notion/repo/logs.
10. Launch only after QA and explicit human approval.
11. Stop infrastructure work and focus on acquiring the first 10 real paying customers.
12. After the gate, re-review Make/Core, sanitized order logging, analytics, and next automation phase.

## 12. Codex cross-review request

On the next Codex session, compare:
- this file;
- `AGENTS.md`;
- `docs/PROJECT_PLAN.md`;
- `CLAUDE.md`;
- `config/ecosystem.yaml`;
- the current Codex chat/context;
- the current repository implementation.

Return four sections:

### MATCH
What already agrees with v2.1.

### CONFLICT
Any stale statements or implementation assumptions, especially:
- Shopify treated as immediate validation commerce;
- Make scenarios assumed before the 10-customer gate;
- internal product ID exposed in the visible product name;
- customer PII copied to secondary systems;
- AI-to-AI state assumed to exist only in chats.

### MISSING
What v2.1 requires that is not yet represented in code/docs/config.

### NEXT
The smallest safe implementation/documentation change needed next. Do not make a major architecture change without surfacing it to the human owner first.
