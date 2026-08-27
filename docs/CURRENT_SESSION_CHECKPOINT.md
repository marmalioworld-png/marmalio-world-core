# Marmalio World — Current Session Checkpoint

Last updated: 2026-08-28 00:17 CEST
Status: durable chat/project recovery checkpoint
Purpose: preserve the active state when ChatGPT/Codex/Claude chat history disappears or becomes unavailable.

> This is a decision/state checkpoint, not a verbatim transcript. For implementation, architecture files and accepted repo artifacts remain authoritative where more specific.

## 1. Operating rule — chats are not durable state

Important project decisions must not remain only inside ChatGPT, Claude or Codex chats.

Durable handoff medium:

- GitHub repository docs/specs/PRs/checkpoints;
- current architecture decisions;
- approved product/release artifacts;
- test/QA evidence.

When a chat disappears, read this file plus `AGENTS.md` and the latest architecture file before continuing.

## 2. Current architecture direction

Approved architecture: **v2.2 — Multi-Revenue Engine**.

Marmalio World is not only a store. It is a factory of durable digital assets and audience assets that can earn across several channels.

Active revenue engines:

1. Digital Product Factory — highest priority.
2. Media / Audience Factory — YouTube, YouTube Shorts, TikTok, Instagram Reels.
3. Amazon Factory — KDP + Merch on Demand.
4. Affiliate Engine.
5. Physical commerce / dropshipping later through Shopify when validated.
6. A11y Evidence — portfolio opportunity, still gated/HOLD pending its own compliance requirements.

Main principle: do not wait for product #1 to reach 10 sales before creating product #2. Build a small portfolio while content/audience work starts in parallel.

Portfolio automation gate: **R10 = 10 real paid customer orders across the live digital-product portfolio**, not 10 sales of only one product.

## 3. Digital products / localization

Validation product:

- `MW-DIG-000001`
- visible title: **The AI Productive Prompt Pack**
- target price: EUR 10
- customer-facing title must remain clean; do not expose the internal ID in the visible title.

More than one product will be launched. Initial target is a sequence of products #1–#5, each completed to a premium launchable standard before scaling volume.

Localization objective remains **17 languages**. Products should be globally oriented and not restricted to one customer group/one country.

Current working localization strategy is tiered so new products are not blocked waiting for all 17 versions; launch highest-priority languages first, then expand after QA and market data.

## 4. Content / audience strategy

YouTube/TikTok/Instagram content is not only advertising for Marmalio products.

Two content classes:

- `SALES_CONTENT` — useful/entertaining content that may lead to products, affiliate offers or stores;
- `MEDIA_ASSET` — content intended to build views, subscribers/followers and long-term platform monetization itself.

Content Factory should research world markets, platform trends, audience demand, monetization potential, competition, originality, evergreen value and legal/IP risk before selecting formats.

Do not build one channel that mixes unrelated audiences. Separate channel/brand lanes when the audience/topic differs materially.

**Kids/family videos were only an example**, not the chosen primary niche. They remain one optional format among many. Potential content areas include storytelling, explainers, curiosities, AI/tech/productivity, rankings, travel, educational/faceless formats and other trend-validated themes.

Content should be premium, platform-native and measured by retention/watch time, CTR, comments/search intent, conversion and revenue. Scale winners; stop weak formats.

## 5. Applications / tool policy

Core now:

- ChatGPT — strategy / architecture / prioritization
- Claude Code — primary implementation
- Codex — independent cross-reviewer / implementation when explicitly assigned
- VS Code
- GitHub — durable source of truth
- Notion — planning metadata, no customer PII
- Canva — primary design/creative production
- Google Drive
- Gmail
- Lemon Squeezy — validation digital commerce/file delivery
- YouTube Studio
- TikTok Studio
- Instagram / Meta Business Suite
- Amazon KDP / Merch when their launch gates are cleared

Next only when a real bottleneck appears:

- Metricool — publishing/analytics
- Make — production automation after R10; do not bury core business logic in it
- one additional premium video editor if Canva becomes a bottleneck
- German bookkeeping software after business/tax setup is confirmed

Later/gated:

- Shopify — physical/dropshipping or explicit storefront need
- HeyGen — after revenue and measurable need
- Ahrefs / Polar / Tool4seller / OpenArt / Smart Shot / Book-to-Skill / OmniRoute / 10x.app — only when justified by measured value

## 6. Legal / Germany business setup — current working recommendation

A dedicated document exists: `docs/GERMANY_BUSINESS_SETUP_2026.md`.

Current working recommendation from the research session:

- start Marmalio World as an **Einzelunternehmen** with **Gewerbeanmeldung** in Germany rather than forming a UG/GmbH immediately;
- `Kleingewerbe` / `Nebengewerbe` are descriptive concepts, not separate legal forms;
- `Kleinunternehmerregelung` is a VAT regime, not a legal form and not an income-tax exemption;
- conservative project rule: complete Gewerbeanmeldung **before the first public revenue-oriented launch**, rather than waiting for the first payout;
- prepare ELSTER/tax registration and bookkeeping from day one;
- Kleinunternehmer treatment is only a candidate if the founding-year turnover forecast and platform mix make it sensible; it must not be selected automatically;
- UG/GmbH should be reassessed later when stable profit, physical-product liability, employees/contracts, retained earnings, partners/investors or a measurable tax/structural advantage justify the extra administration.

Compliance rule remains mandatory: `docs/COMPLIANCE_GATES_2026.md`.

## 7. Recent Codex / Claude production sequence recovered from the last hour

### REPAIR-003

A previous repair reportedly fixed claim/cover/count issues, but Codex final review returned `CHANGES_REQUIRED` because:

- YouTube Short spoken-word count needed to include the spoken hook, giving about 83 words;
- TikTok hook-inclusive spoken total was about 154 words and exceeded the timing target;
- `REPAIR-004` was therefore required as a microscopic count/timing correction, with TikTok <=136 spoken words and no architectural/content drift.

Locked visual directions from that stage:

- YouTube: `GENERIC vs. CLEAR`
- YouTube Short: `AFTER — 6 PARTS`
- TikTok: six-part list card
- Instagram Reel: opening static card

### CLAUDE-010-REPAIR-004 — FINAL CODEX ACCEPTANCE

Codex verdict supplied by the owner:

- **VERDICT:** `APPROVE_FOR_VISUAL_PRODUCTION`
- **OVERALL SCORE:** `97/100`
- **YOUTUBE SHORT COUNT:** PASS — exactly 83 spoken words = 7-word spoken hook + 76-word body; silent on-screen hook excluded correctly.
- **TIKTOK COUNT:** PASS — exactly 128 spoken words = 24-word spoken hook + 104-word body; below max 136.
- **TIKTOK TIMING:** PASS — approx. 45.2s at 170 wpm, 42.7s at 180 wpm, 40.4s at 190 wpm; complete spoken content fits existing 48-second production sequence and 30–50s target.
- **CLAIM SAFETY:** PASS — no unsupported statistic, guarantee, superiority claim, universal performance promise, fabricated result or previously prohibited active phrase introduced by shortening.
- **FORMULA:** PASS — exact active order remains `ROLE -> CONTEXT -> TASK -> CONSTRAINTS -> OUTPUT FORMAT -> QUALITY CHECK`.
- **COVER LOCK:** PASS — all four accepted locks unchanged.
- **TESTS:** PASS — `validate:ecosystem`, `validate:compliance`, `validate:products`; product tests 57/58 with one unchanged intentional opt-in skip; manifest tests 85/85; complete suite 237/238 with same intentional skip; JSON parse and `git diff --check` passed.
- **REPO SAFETY:** PASS — branch `feature/marmalio-flow-v1`; HEAD `9415cf057d4eb970d224220304cb5529690c9191`; staged files 0; `stash@{0}` preserved; writes stayed inside authorized REPAIR-004 scope; no protected product/manifest/Flow/Apply/assets/rights/commerce/architecture/release material modifications; no commit, push, publication, deployment, Canva action or other external action occurred.
- **NEW CRITICAL/HIGH REGRESSIONS:** NONE.
- **READY FOR CANVA PRODUCTION:** YES.
- **READY FOR PUBLICATION:** NO.
- **READY FOR LIVE SALE:** NO.
- **FILES MODIFIED:** NONE.
- **COMMIT:** NO.
- **PUSH:** NO.
- **EXTERNAL ACTION:** NONE.

Codex NEXT:

> Produce the four locked visual directions and their required scene assets in Canva from the approved visual-production brief, then submit the resulting exports and asset-level licensing evidence for independent visual QA before recording or publication.

## 8. Immediate next action

Current next project action for the approved REPAIR-004 path:

1. Produce the four locked visual directions in Canva from the approved visual-production brief.
2. Preserve asset-level licensing/source evidence.
3. Export required assets.
4. Submit exports + licensing evidence to independent visual QA.
5. Do not record/publish until visual QA passes.
6. Publication remains a separate human/compliance gate.
7. Live sale remains a separate commerce/legal gate.

## 9. Recovery instruction for the next chat

If the current conversation disappears again, the first instruction to ChatGPT/Codex/Claude should be:

`Read AGENTS.md, docs/CURRENT_SESSION_CHECKPOINT.md, docs/ARCHITECTURE_V2_2_MULTI_REVENUE.md, docs/COMPLIANCE_GATES_2026.md and docs/GERMANY_BUSINESS_SETUP_2026.md before continuing. Report any conflict before changing project state.`
