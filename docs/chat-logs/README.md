# Marmalio World — Continuous Conversation Backup

Purpose: preserve durable summaries of Marmalio World decisions and work so project continuity does not depend on ChatGPT UI history.

## Mandatory logging rule

**Every newly agreed project decision must be written to durable project state immediately after it is agreed — not only after a large session, milestone, or major change.**

This includes small but binding decisions, corrections, new constraints, changed priorities, approved/rejected options, tool choices, product/content decisions, legal/compliance decisions, agent-task outcomes, and changes to the next action.

The assistant must not wait for the end of a conversation or for a "big enough" event. If a new project agreement changes what the team should remember or do later, log it in the current day's file as part of the same interaction whenever repository access is available.

If repository access is temporarily unavailable, explicitly mark the decision as pending durable write and write it at the first available opportunity.

## Storage rule

Create one Markdown file per day under:

`docs/chat-logs/YYYY-MM-DD.md`

Append/update that day's file continuously as new project agreements occur.

## What to capture

Record only project-relevant content:

- every new decision approved by the human owner;
- architecture/process changes;
- priority/order changes;
- tasks sent to Claude Code / Codex / Kimi;
- results received from those agents;
- product/content/compliance status changes;
- tool/application choices or removals;
- platform/test evidence;
- open blockers;
- next actions;
- files created/updated in the repository;
- important corrections to earlier assumptions;
- explicit HUMAN approvals/rejections that affect future execution.

Do not copy customer PII, passwords, API keys, signed URLs, private order identifiers, personal secrets, or unnecessary private conversation.

## Daily file format

# Marmalio World — Daily Chat Log — YYYY-MM-DD

## Decisions

## Work completed

## Agent tasks / results

## Product & content status

## Commerce / platform status

## Compliance / legal

## Open blockers

## Next actions

## Repository changes

## Corrections / superseded assumptions

## Reliability note

This is a durable project summary, not a verbatim transcript. When exact wording/evidence matters, reference the source file, screenshot evidence record, task report, PR, or architecture decision in the repository.
