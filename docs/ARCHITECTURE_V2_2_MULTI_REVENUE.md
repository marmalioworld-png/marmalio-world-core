# Marmalio World — Architecture v2.2: Multi-Revenue Engine

Date: 2026-08-24
Status: APPROVED by human owner
Supersedes: `docs/ARCHITECTURE_V2_1_DECISIONS.md` where this file conflicts

## 1. Executive decision

Marmalio World is not only a store. It is a factory of durable digital assets that can earn repeatedly across several channels.

The execution model changes from a linear sequence (one product -> wait for validation -> build everything else) to a controlled multi-revenue model with several active engines, while preserving strict legal, QA, security and human-approval gates.

The objective is faster revenue without turning the project into uncontrolled tool sprawl or low-quality mass production.

## 2. Revenue engines

### Engine A — Digital Product Factory (highest priority)

Do not wait for product #1 to reach 10 sales before creating product #2.

Launch a small portfolio in sequence:

1. `MW-DIG-000001` — The AI Productive Prompt Pack — target price EUR 10
2. `MW-DIG-000002` — next validated digital product
3. `MW-DIG-000003`
4. `MW-DIG-000004`
5. `MW-DIG-000005`

Each sprint must end with actual customer files, listing copy, price, thumbnails/mockups, delivery setup, QA and launch assets.

Approved product families include ebooks, guides, workbooks, templates, checklists, prompt packs and document packs. Courses come later.

### Engine B — Media / Audience Factory

Start immediately; do not treat social content only as product advertising.

Two content classes:

- `SALES_CONTENT` — useful content that can also lead to Marmalio products, affiliate offers or later stores.
- `MEDIA_ASSET` — content whose primary purpose is audience growth and platform monetization through views, subscriptions, memberships, ads, affiliate or sponsorship.

Core distribution:

- YouTube long-form
- YouTube Shorts
- TikTok
- Instagram Reels

One researched topic may generate several platform-native outputs, but do not publish identical low-effort copies everywhere. Hooks, length, captions, pacing, aspect ratio and CTA must be adapted per platform.

### Engine C — Amazon Factory

Start earlier than v2.1, but only from material that already passes QA.

- Amazon KDP: adapt suitable Marmalio digital products into ebooks, workbooks or print formats.
- Amazon Merch on Demand: publish original, licensable design collections; begin with quality batches and scale winning themes rather than uploading thousands of generic designs.

### Engine D — Affiliate Engine

Use relevant affiliate programs as an additional monetization layer for useful content. Affiliate links and sponsored/commercial relationships must always be disclosed clearly and must never override editorial usefulness.

### Engine E — Physical Commerce / Dropshipping

Keep as a planned revenue engine, but not the immediate priority.

Before any physical product goes live, validate supplier, sample quality, delivery time, return path, margin, product-safety obligations, labeling, responsible economic operator where required and customer support burden.

Shopify returns as a core storefront when physical products/dropshipping are actually scheduled or when a separate approved storefront requirement justifies it.

### Engine F — A11y Evidence (B2B / later gated)

A11y Evidence is part of the Marmalio World opportunity portfolio but is NOT cleared for public launch or outreach yet.

See `docs/A11Y_EVIDENCE_G1_STATUS.md` and `docs/COMPLIANCE_GATES_2026.md`.

## 3. Portfolio validation gate

Replace the old product-specific automation gate with a portfolio gate:

**Gate R10 = 10 real paid customer orders across the live Marmalio digital-product portfolio.**

Before R10:

- product creation and launch may continue;
- content creation and audience building may continue;
- Amazon preparation/publication may continue after channel-specific compliance review;
- Make may be installed/learned but must not become a production dependency for critical commerce;
- do not spend large amounts of time building automation that does not directly help launch/sell a named asset.

At R10:

- review winning products and traffic sources;
- reassess Make Core and sanitized order logging;
- automate only workflows proven to repeat;
- increase production around winners instead of increasing volume blindly.

## 4. Localization strategy — 17-language standard

Marmalio World keeps a 17-language global-localization objective.

Historical project state confirms a 17-language standard existed, but the exact old list was not recoverable from current durable context. Therefore v2.2 defines a market-oriented working set that Codex/Claude must compare against any older source they find before deleting or replacing historical language assets.

### Working 17-language set

Tier A — launch/high-priority commercial languages:

1. English
2. German
3. Spanish
4. French
5. Portuguese
6. Polish

Tier B — strong purchasing-power / major online markets:

7. Italian
8. Dutch
9. Japanese
10. Korean
11. Arabic
12. Turkish

Tier C — reach/expansion markets, release after localization QA:

13. Indonesian
14. Hindi
15. Simplified Chinese
16. Swedish
17. Czech

### Speed rule

Do not hold every new product for weeks waiting for all 17 languages.

Preferred release pattern:

- launch a validated premium product in Tier A first;
- roll out Tier B and Tier C in controlled localization waves;
- all translations must pass language QA before sale;
- use actual conversion, traffic and support data to reprioritize languages.

Product identity remains one internal product ID with language/version metadata, rather than pretending every translation is a separate concept.

## 5. Premium / trend-driven product and content loop

Every product/content batch should follow this loop:

1. Observe current demand from platform-native sources and public trend data.
2. Identify a real problem, curiosity, entertainment desire or repeatable audience pattern.
3. Score: demand, monetization potential, competition, originality, evergreen value, localization potential, legal/IP risk, build effort.
4. Produce one premium concept, not many near-duplicates.
5. Create a strong visual identity and platform-native packaging.
6. QA for factual accuracy, language, design, copyright/licensing, platform rules, legal claims and customer experience.
7. Publish only after human approval where required.
8. Measure CTR, retention/watch time, conversion, refunds, comments/search intent and revenue.
9. Kill weak patterns quickly; expand winners.

### Trend/research sources

Prefer first-party/native sources where possible:

- Google Trends
- YouTube Studio / Analytics / search research
- TikTok Creative Center / TikTok Studio analytics
- Instagram / Meta insights
- Amazon category/search signals and KDP/Merch dashboards once accounts are active
- store analytics and Lemon Squeezy transaction data

Do not treat social-media revenue screenshots, influencer claims or viral videos as verified market evidence without independent checking.

## 6. Content system

### Adult/general-audience channels

Start with English/global-first content where the topic permits, then localize proven winners into the strongest languages rather than creating 17 empty channels at once.

Initial production pattern:

- 1 researched topic
- 1 YouTube long-form asset when the topic supports depth
- 2–5 Shorts/Reels/TikTok derivatives where they remain genuinely useful/entertaining
- platform-specific title/hook/caption/thumbnail
- optional product/affiliate CTA only when relevant

### Kids/family content

Kids content is a separate channel/brand lane, not mixed into the main Marmalio business/AI channel.

Rules:

- classify audience correctly (`Made for Kids` where applicable);
- do not depend on personalized ads or engagement features that are disabled/restricted for kids content;
- prioritize original, safe, enriching, high-quality storytelling/education/animation;
- do not mass-produce repetitive AI-slop;
- do not use copyrighted characters, franchises, music, recordings or likenesses without rights;
- no collection of child personal data;
- no manipulative commercial pressure aimed at children.

Kids-channel launch is gated until the Content Factory can consistently produce premium original work.

## 7. AI-content rules

AI is allowed as a production tool, not as an excuse for low quality.

- YouTube: disclose realistic/meaningfully altered AI content when platform policy requires it.
- TikTok: label AI-generated/significantly AI-edited content when required, especially realistic AIGC.
- Amazon KDP: disclose AI-generated text, images or translations during publication where KDP requires disclosure.
- Always retain evidence of licenses/source rights for music, footage, images, fonts, templates and datasets.
- Never create fake endorsements or misleading realistic depictions of real people.

## 8. App / service stack

### CORE NOW — do not duplicate

Control / AI / implementation:

- ChatGPT — strategy, architecture, prioritization, cross-review
- Claude Code — primary implementation layer
- Codex — independent repo cross-review / implementation when explicitly assigned
- VS Code — local development workspace
- GitHub — durable source of truth, specs, code, prompts, schemas, Actions, PR audit trail

Planning / assets / commerce:

- Notion — planning/editorial metadata, not secrets or customer PII
- Canva — primary design system and fast creative production
- Google Drive — approved asset storage/exports/backups
- Gmail — operations/correspondence
- Lemon Squeezy — validation-phase digital commerce / file delivery / transaction authority

Native distribution:

- YouTube Studio
- TikTok Studio
- Instagram + Meta Business Suite
- Amazon KDP (when account/channel is approved to launch)
- Amazon Merch on Demand (when account/channel is approved to launch)

### NEXT — add only when the named bottleneck exists

- Metricool — cross-platform scheduling/analytics when manual native publishing becomes the bottleneck; do not duplicate with a custom Make social scheduler.
- Make — automation bus after R10 for repeated cross-SaaS workflows; not core logic.
- One dedicated editing tool beyond Canva if needed for premium video throughput: choose ONE after testing (e.g. CapCut Desktop or DaVinci Resolve), not both by default.
- German bookkeeping software (one system, e.g. sevdesk or equivalent) after business/tax setup is confirmed; accountant/tax-adviser compatibility takes priority over feature count.

### LATER / GATED

- Shopify — physical products/dropshipping or explicitly approved storefront need
- HeyGen — only after revenue and a measurable need for presenters/localized video
- Ahrefs — when SEO scale justifies it
- Polar Analytics — when multi-channel sales/ad volume justifies it
- Tool4seller — once Amazon seller operations require it
- OpenArt / Smart Shot — only if Canva/native generation becomes a measured bottleneck
- Book-to-Skill — later/pilot
- OmniRoute — later; avoid premature model routing
- 10x.app / Micro-App Factory — later after the core product/content engine is earning

## 9. Automation architecture

Durable control chain:

Human -> ChatGPT -> repository spec/decision -> Claude Code / explicitly assigned Codex -> specialist roles -> QA -> human approval

Rules:

- chat sessions are not durable handoff media;
- GitHub/specs/PRs are the handoff medium;
- GitHub Actions handles repository-triggered automation;
- Make later handles cross-SaaS routing, mapping, retries and notifications;
- testable business logic, prompts, schemas and evaluation cases stay in repo;
- customer PII does not flow into repo/Notion/Drive/automation logs.

## 10. 30-day execution plan

### Week 1

- Codex drift review against v2.2
- patch stale v2.1 assumptions in `PROJECT_PLAN.md`, `CLAUDE.md`, `config/ecosystem.yaml`
- complete legal/business launch prerequisites from `COMPLIANCE_GATES_2026.md`
- Lemon Squeezy test-mode setup
- finish `MW-DIG-000001`
- begin `MW-DIG-000002`
- create channel identities/templates
- publish first compliant content assets after approval

### Week 2

- products #2–#3 live if QA passes
- products #4–#5 in production
- regular YouTube/TikTok/Instagram cadence
- identify first KDP adaptation
- prepare first original Merch design collection

### Week 3

- expand winning product languages
- repurpose winning content formats
- test relevant affiliate monetization with disclosure
- publish KDP/Merch assets only after channel compliance checks
- track revenue/traffic/retention/conversion

### Week 4

- cut weak offers/formats
- double down on winners
- check R10 gate
- if R10 reached, design only the first proven automation workflows
- review whether Metricool/Make/bookkeeping integration now saves measurable time

## 11. Time allocation target

Default daily allocation when approximately six hours are available:

- 3.0 h — products + Amazon adaptations
- 2.5 h — audience/content production and analytics
- 0.5 h — repo, compliance, systems and automation

AI/agents should absorb research, first drafts, localization preparation, formatting checks and repetitive QA where safe, while human approval remains required for high-impact actions.

## 12. Legal/compliance rule

No revenue engine is allowed to bypass `docs/COMPLIANCE_GATES_2026.md`.

The objective is not merely to avoid platform strikes; it is to create auditable evidence that Marmalio World checked business registration, tax/accounting, consumer rights, privacy, IP/licensing, AI disclosure, platform policies, child-safety rules and product-safety requirements before the relevant launch.

## 13. Codex review tomorrow

Codex must read this file first, then compare it with:

- `AGENTS.md`
- `docs/ARCHITECTURE_V2_1_DECISIONS.md`
- `docs/PROJECT_PLAN.md`
- `CLAUDE.md`
- `config/ecosystem.yaml`
- current repository implementation
- its existing chat/context

Return `MATCH / CONFLICT / MISSING / NEXT` and explicitly identify stale Shopify-first, one-product-only, delayed-content, outdated automation-gate or missing-compliance assumptions.
