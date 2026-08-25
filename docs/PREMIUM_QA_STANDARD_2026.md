# Marmalio World — Premium QA Standard 2026

Date: 2026-08-25
Status: APPROVED by HUMAN/ChatGPT
Scope: all products, content, localization, creative assets and publish-ready packages

## 1. Mandatory release principle

Every material created by Marmalio World must follow:

`CREATE -> INDEPENDENT REVIEW -> PREMIUM QA -> COMPLIANCE -> RELEASE GATE`

No generator, model, application or agent may approve its own final work.

**Hard rule:** the creator and the final reviewer must be different roles/tools/agents.

This applies to:

- digital products;
- ebooks;
- PDFs;
- workbooks;
- checklists;
- templates;
- prompt packs;
- product listings;
- social-media graphics;
- thumbnails;
- mockups;
- long-form video;
- Shorts;
- TikTok;
- Instagram Reels;
- scripts;
- voice-over;
- AI-generated video or B-roll;
- localization and translations;
- Amazon KDP assets;
- Amazon Merch assets;
- affiliate content;
- Canva assets;
- future Shopify/physical-commerce assets.

## 2. Creator cannot self-approve

Examples:

- If Claude creates a product or script, Claude cannot be the final approver of that asset.
- If Kimi performs localization, Kimi cannot be the only localization QA reviewer.
- If Canva creates or assembles the design, a separate agent/tool must review readability, consistency, visual quality and licensing evidence.
- If a video-generation/editing tool creates a film, a separate review must check visual/audio quality, captions, pacing, factual accuracy and platform fit.
- If one agent creates listing copy, another reviewer must check clarity, claims, conversion quality and compliance.

Self-checks are allowed as an intermediate step, but never replace independent review.

## 3. Required QA dimensions

Every important asset receives a `Premium Score` from 0–100.

Default pass threshold:

`PREMIUM_QA_PASS >= 85/100`

A critical failure overrides the numeric score and causes automatic FAIL.

Score dimensions should cover, where applicable:

1. Content quality
2. Design / visual quality
3. Originality
4. Factual accuracy
5. Localization quality
6. Platform fit
7. Commercial quality / customer value
8. Technical correctness
9. Licensing / rights evidence
10. Compliance / policy fit
11. Brand consistency
12. Accessibility/readability where relevant

Not every asset needs all dimensions, but the task/spec must explicitly define which dimensions apply.

## 4. Critical-fail conditions

Examples of automatic FAIL regardless of score:

- fabricated facts presented as verified;
- missing required legal/platform disclosure;
- copyright/trademark/licensing risk without evidence;
- customer PII or secrets exposed in an unauthorized system;
- broken customer deliverable;
- unreadable or corrupted PDF/export;
- missing pages/sections/assets;
- obvious unresolved AI artifacts in final creative;
- false or misleading commercial claims;
- wrong language/localization version;
- prohibited platform content;
- publishing state marked LIVE/APPROVED without required approval evidence;
- product safety/legal blockers for regulated or physical products;
- known placeholder text or internal IDs visible to customers where not intended.

## 5. Asset-specific review pattern

### Text / ebook / product

Creator:
- ChatGPT / Claude / assigned Kimi / specialist generation tool

Independent review:
- different model/agent than creator

QA must include:
- usefulness;
- structure;
- factual accuracy;
- language quality;
- originality;
- formatting;
- rights/licensing;
- customer experience;
- compliance.

### Design / graphics / Canva

Creator:
- Canva / assigned design workflow

Independent review:
- AI reviewer or separate design-QA agent/tool

QA must include:
- hierarchy;
- typography;
- spacing;
- consistency;
- readability;
- mobile/desktop/print suitability where applicable;
- brand fit;
- export quality;
- licensing evidence;
- absence of obvious AI/design artifacts.

### Video / Shorts / Reels / TikTok

Creator stack may include:
- script model;
- voice tool;
- video generation tool;
- editing tool;
- Canva thumbnail/design.

Independent review must check:
- hook;
- pacing;
- narrative clarity;
- factual accuracy;
- visual artifacts;
- audio quality;
- captions/subtitles;
- platform-native format;
- title/thumbnail/caption fit;
- copyright/music/footage rights;
- AI disclosure requirements;
- CTA quality when relevant.

### Localization

Creator:
- localization model/agent

Independent review:
- different model/agent or language-QA role

QA must include:
- meaning preservation;
- terminology consistency;
- untranslated fragments;
- formatting;
- local naturalness;
- market adaptation;
- legal/commercial wording where relevant.

## 6. Multi-tool premium production principle

Marmalio World must use applications not only for management/distribution but also for **premium asset creation**.

The Creative Production Stack should eventually cover:

- text / scripts / product content;
- ebooks / PDFs / workbooks;
- images / graphics / thumbnails / mockups;
- voice-over / dubbing;
- long-form video;
- short-form video;
- AI-generated scenes/B-roll;
- subtitles/captions;
- localization;
- listing/SEO packaging;
- QA and release validation.

When selecting tools, Codex/Claude must evaluate:

- output quality;
- commercial-use licensing;
- automation/API/MCP capability;
- reliability;
- cost;
- speed;
- overlap with tools already owned;
- ability to support independent review;
- privacy/security risk.

Do not add an application merely because it exists. Prefer one strong tool per primary capability unless a second tool provides measurable independent-QA value.

## 7. Recommended responsibility model

- **ChatGPT** — strategic manager, priorities, final cross-system decisions.
- **Claude Code** — primary implementation/integration owner and production-pipeline builder.
- **Codex** — technical dispatcher, independent repo review, tests, QA architecture and task ownership control.
- **Kimi** — long-context research, localization QA, batch QA and third independent review.
- **Canva / creative tools** — asset production within approved workflows.
- **Specialist voice/video/image tools** — premium generation where they provide measurable value.
- **GitHub** — durable source of truth for specs, rules, tests, audit evidence and handoff.

## 8. Autonomy target

This standard supports the approved goal of progressively moving Marmalio World toward 80–90% autonomous operational execution.

Autonomy must increase only for workflows that are:

- repeatable;
- tested;
- bounded;
- auditable;
- low enough risk;
- covered by independent QA;
- covered by required compliance gates.

High-impact actions still require HUMAN approval unless separately approved by architecture:

- spending;
- new paid accounts;
- contracts;
- tax/legal filings;
- regulated/high-risk actions;
- major architecture changes;
- destructive actions;
- new classes of external publication/production risk.

## 9. Revenue-first rule

Premium QA must not become an excuse for endless perfectionism.

Marmalio World operates as:

`REVENUE FIRST + AUTOPILOT IN PARALLEL`

The goal is to reach publish-ready premium assets quickly, measure real data, and improve winners.

Use the smallest QA process that reliably prevents low-quality, misleading, unsafe or non-compliant output.

## 10. Required statuses

Recommended asset/release statuses:

- `DRAFT`
- `CREATED`
- `INDEPENDENT_REVIEW_REQUIRED`
- `REVISION_REQUIRED`
- `PREMIUM_QA_PASS`
- `COMPLIANCE_REVIEW_REQUIRED`
- `READY_FOR_HUMAN_REVIEW`
- `APPROVED`
- `PUBLISH_READY`
- `LIVE`
- `HOLD`
- `REJECTED`

`PREMIUM_QA_PASS` does not automatically imply legal/compliance approval or permission to publish.

## 11. Codex / Claude implementation requirement

Codex and Claude must treat this document as a mandatory design constraint for future Product Factory, Content Factory, Localization Engine, Canva workflows, video workflows, Amazon workflows and Marmalio Autopilot.

Every new production workflow must explicitly define:

- creator role/tool;
- independent reviewer role/tool;
- applicable Premium Score dimensions;
- pass threshold;
- critical-fail conditions;
- compliance gate;
- release gate;
- human approval requirement;
- audit evidence location.

If a workflow allows the same generator to create and finally approve its own output, the workflow is non-compliant with this standard and must not be considered production-ready.
