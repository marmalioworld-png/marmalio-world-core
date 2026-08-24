# Marmalio World — Kimi Integration 2026

Date: 2026-08-24
Status: APPROVED FOR PILOT

## Decision

Add Kimi to the Marmalio World AI/tool stack as an independent third technical/research agent. Kimi does not replace ChatGPT, Claude Code or Codex.

## Role

Kimi is assigned to work where an independent model, long-context review, batch analysis or second implementation opinion adds measurable value:

- large-repository and long-document review;
- independent architecture/code review after Claude/Codex work;
- market/trend research cross-checks with explicit sources;
- batch classification/scoring of product/content candidates;
- localization QA and cross-language consistency checks;
- test generation and edge-case hunting;
- alternative implementation proposals when Claude/Codex disagree;
- bounded overflow implementation on files explicitly assigned to Kimi.

Kimi must not duplicate work already owned by another agent unless the task is explicitly a cross-review.

## Product choice

Preferred technical surface: **Kimi Code CLI** and optionally **Kimi Code for VS Code**.

Official Kimi documentation (checked 2026-08-24) says Kimi Code can read/edit code, run shell commands, search/fetch web pages, operate in Plan mode, and integrate with VS Code and third-party coding agents including Claude Code and Codex.

Kimi Code is treated as a separate agent seat in the repository, not as a hidden replacement model inside Claude or Codex. This preserves attribution and makes comparisons auditable.

## Installation / onboarding

Windows pilot path:

1. Ensure Git for Windows is installed.
2. Install Kimi Code CLI from the official Kimi installer.
3. Verify with `kimi --version`.
4. Log in using `/login` or the supported Kimi Code authentication flow.
5. Start inside the repository in **Plan mode** first.
6. Point Kimi to `AGENTS.md` and the current architecture/compliance docs.
7. Do not enable YOLO/AFK auto-approval modes for Marmalio World.

Optional: install Kimi Code for VS Code if the CLI pilot is useful and a second editor surface measurably improves throughput.

## Commercial rule

Do not purchase or upgrade a Kimi membership automatically. The owner must approve any paid plan.

Official Kimi pricing checked 2026-08-24 lists paid membership tiers beginning at ¥49/month and says Kimi Code is available within membership plans. Kimi web/chat also has free access for general use, while coding benefits/quotas are membership-based.

Pilot success must be measured before any higher tier:

- does Kimi find real defects or conflicts missed by Claude/Codex?
- does it save meaningful time on long-context review or batch work?
- does it reduce localization/QA errors?
- is its output reliable enough to justify a third coding-agent subscription?

If not, keep Kimi as an occasional free research/cross-check tool rather than a paid core seat.

## Security / permissions

- No customer PII, credentials, tax IDs, API secrets or private correspondence may be pasted into Kimi chat or committed via Kimi.
- Kimi may only modify files explicitly assigned in the shared task board/spec.
- Kimi may not publish, deploy, spend money, create accounts, contact customers/leads, change tax settings or accept contracts.
- Plan mode is preferred for architecture/review tasks.
- Any Kimi plugins/MCP servers require the same security/licensing/maintenance/duplication review as Claude/Codex extensions.
- Do not install Kimi Computer Use or browser-control plugins merely because they exist; add them only for a named, approved bottleneck and with least privilege.

## Work ownership

Default roles:

- ChatGPT — manager/architect/prioritization and cross-tool decisions.
- Claude Code — primary implementation owner.
- Codex — repository cross-review, test/QA engineering and assigned implementation.
- Kimi — independent research/long-context/batch QA/third-opinion agent and assigned overflow implementation.
- Specialist apps — design, planning, distribution, automation and analytics in their native domains.

No two coding agents should edit the same file concurrently. Every implementation task must declare `owner`, `files_allowed`, `files_forbidden`, dependencies and acceptance criteria.

## First pilot tasks for Kimi

1. Read `AGENTS.md`, Architecture v2.2, Compliance Gates and Germany Business Setup.
2. Run a read-only architecture drift review against current repo.
3. Cross-review the 17-language plan for operational/localization risks without changing the approved list silently.
4. Review Product Factory / Content Factory task specs created by Codex/Claude for missing tests and edge cases.
5. Produce an independent QA report; do not implement unless assigned after review.

## Tool boundary

Use Kimi Code for repository/technical work and Kimi research capabilities for independent evidence checks. Keep durable outcomes in GitHub specs/PRs. Kimi chat/session memory is not a source of truth.
