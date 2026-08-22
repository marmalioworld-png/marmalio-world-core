# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This is the central repository for the Marmalio World ecosystem. This repository now contains the machine-readable ecosystem core, its validator and CI gate, and the first functional research-readiness module. There is still no build or lint step. The directory layout is:

- `apps/research-market-validation/` — first functional module: a deterministic research-readiness preflight for one product/content idea (see its README.md). `apps/` otherwise empty; intended home for future applications.
- `assets/` — empty; intended home for future static assets
- `scripts/` — the ecosystem configuration validator and its tests (`validate-ecosystem.js`, `validate-ecosystem.test.js`)
- `docs/PROJECT_PLAN.md` — mission, business areas, and goals for the ecosystem

## Commands

- `npm install` — install dependencies (currently just `yaml`, used to parse `config/ecosystem.yaml` and idea files).
- `npm run validate:ecosystem` — validate `config/ecosystem.yaml`: real YAML parse, required-section/type checks, duplicate-ID checks, kebab-case checks, QA bounds, and operating-model chain/responsibilities cross-checks. Exits non-zero on any issue.
- `npm run validate:idea -- <path>` — run the research-market-validation preflight on one idea file (JSON or YAML). Prints a machine-readable readiness result; exits non-zero only on invalid input or a tool failure, never on a low readiness score.
- `npm run brief:idea -- <path>` — turn a valid preflight result into a deterministic, prioritized action plan (evidence-gathering, evidence-verification, definition-gap, strengthening tasks). Plans only — never gathers or verifies evidence itself.
- `npm test` — run all unit tests (`node --test`, using Node's built-in automatic test-file discovery) using Node's built-in test runner only.

There is still no build or lint step beyond these. Update this file's Commands and directory-layout notes as new apps are added under `apps/`.

## Project context

From `docs/PROJECT_PLAN.md`:

**Mission:** Build a global ecosystem of digital products, AI tools, e-commerce, education, and automation under the Marmalio World brand.

**Main areas:** Shopify Store, Amazon KDP, Amazon Merch, Digital Products, AI Tools, Marketing, Automation.

**Goals:** a sustainable online business generating 10,000+ EUR net/month, products launched on Shopify/Amazon KDP/Amazon Merch, digital products and courses, automated content/marketing/sales workflows, AI-powered tools supporting the ecosystem, and scalable social channels (Instagram, TikTok, X, etc.).

Marmalio World is one global umbrella ecosystem, not a set of unrelated projects. This repository (`marmalio-world-core`) is the central orchestration/core repository that everything else hangs off of. When adding a new app, module, or integration, treat it as a piece of this one ecosystem — check for overlap with existing/planned modules before introducing something new.

## Operating model

- **ChatGPT** acts as strategic manager and architect: sets direction, prioritizes, and makes high-level design calls.
- **Claude Code** acts as the primary implementation/execution layer: builds, wires up, and maintains the actual code and repository content.
- **Human approval is required** before: important publishing actions, production deployments, anything that spends money, destructive actions (deleting data, force-pushing, dropping resources, revoking access), and major architectural changes. Propose these; do not execute them unilaterally.

### Specialist agent roles

Use specialist agent roles where useful rather than one generic agent doing everything:

- **Research** — market/product/competitor investigation
- **Product Builder** — turning validated ideas into shippable product work
- **Localization** — adapting content/products for other languages and markets
- **Compliance** — legal, platform-policy, and licensing checks
- **QA** — quality assurance and review

**QA is mandatory before publishing anything.** Target QA score is at least 85/100; do not publish below that bar without explicit human sign-off.

## System modules

These are the main planned modules of the Marmalio World system. Treat new work as belonging to one of these (or explicitly propose a new module) rather than inventing ad hoc structure:

1. Product Factory / Digital Product Microfactory
2. Content Factory
3. Content Intelligence / Faceless Growth Engine
4. Micro-App Factory / App Venture Lab
5. Shopify integration
6. Creative Generation Gateway
7. Tool Registry
8. Research and market validation
9. Localization
10. Compliance and QA

## Channel strategy

Shopify is the primary store. Other channels — Amazon KDP, Amazon Merch, Etsy, Gumroad/Lemon Squeezy, and social platforms — are expansion channels to layer in over time, not things to launch simultaneously. Default to depth on the primary channel before breadth across others.

## Tool and MCP policy

- Prefer a small, high-quality toolset. Do not add tools that duplicate existing capabilities without justification.
- Any external skill, MCP server, plugin, or community tool must be reviewed for security, licensing, maintenance status, and functional duplication before installation.
- **OpenArt MCP** belongs to the Creative Generation Gateway module.
- **Smart Shot** remains experimental until it can be supported appropriately — do not treat it as production-ready.

### Claude ecosystem candidates

- **CORE/NOW:** Claude Code, Claude Code Setup
- **PILOT:** Claude-Mem, Task Observer
- **LATER/PILOT:** Book-to-Skill
- **LATER:** OmniRoute

## Validating claims

Never treat social-media revenue claims, RPM estimates, search volumes, market demand figures, or competitor claims as verified facts by default. Validate them from current reliable sources before they inform decisions or get repeated as fact in this repo's docs.

## Working principles

- Work incrementally. Do not scaffold many apps at once.
- Before making a major implementation, inspect existing files and propose the smallest sensible next step.
- Keep documentation (this file, `docs/PROJECT_PLAN.md`, and related docs) updated when architecture or decisions change.
- Never expose secrets, API keys, tokens, credentials, or private customer data in the repository.
