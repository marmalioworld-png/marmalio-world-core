# Marmalio World — Project Plan

## Mission

Build a global ecosystem of digital products, AI tools, e-commerce, education, and automation under the Marmalio World brand — one umbrella ecosystem, not a set of unrelated projects, orchestrated from this core repository.

## Business objective

Build a sustainable online business generating 10,000+ EUR net per month, through digital products, courses, AI-powered tools, and e-commerce, with as much repetitive work automated as possible.

## Operating model

Work flows through a fixed chain of responsibility:

**Human → ChatGPT (strategic manager) → Claude Code (execution) → specialist agents → QA → human approval**

- **Human** sets intent, priorities, and gives final sign-off on anything important.
- **ChatGPT** acts as strategic manager and architect: sets direction, prioritizes work, makes high-level design calls.
- **Claude Code** acts as the primary implementation/execution layer: builds, wires up, and maintains the actual code and repository content.
- **Specialist agents** handle focused work within execution: Research, Product Builder, Localization, Compliance, QA.
- **QA** reviews all work before publishing; a score of at least 85/100 is required.
- **Human approval** is required before publishing, production deployments, spending, destructive actions, or major architectural changes — none of these happen unilaterally.

See `CLAUDE.md` for the detailed operating rules Claude Code follows day to day.

## Main system modules

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

**Shopify is the primary commerce channel.** All other channels are expansion channels, layered in as later phases rather than launched simultaneously:

- Amazon KDP
- Amazon Merch
- Etsy
- Gumroad / Lemon Squeezy
- Social platforms (Instagram, TikTok, X, and others) for distribution and growth

## Claude ecosystem status

- **CORE/NOW:** Claude Code, Claude Code Setup
- **PILOT:** Claude-Mem, Task Observer
- **LATER/PILOT:** Book-to-Skill
- **LATER:** OmniRoute

Tool and MCP additions (including the above as they mature) go through security, licensing, maintenance-status, and duplication review before adoption. Prefer a small, high-quality toolset over a large one.

## Validating external claims

Social-media revenue claims, RPM estimates, search volumes, market demand figures, and competitor claims are never treated as verified facts by default. They must be validated against current, reliable sources before informing decisions or being recorded as fact.

## Implementation principle

Work incrementally. **Phase 1 is to build the Marmalio World core** — this repository's orchestration, module structure, and operating model — before launching multiple apps or expansion channels. Do not scaffold many apps at once; inspect existing structure and propose the smallest sensible next step before each major implementation.

## Goals

- Build a sustainable online business generating 10,000+ EUR net per month
- Launch and grow on Shopify as the primary channel, then expand to Amazon KDP, Amazon Merch, and other channels
- Create digital products and courses
- Automate content creation, marketing, and sales workflows
- Build AI-powered tools that support the Marmalio World ecosystem
- Build scalable social media channels across Instagram, TikTok, X, and other platforms
- Use AI to automate as much repetitive work as possible
