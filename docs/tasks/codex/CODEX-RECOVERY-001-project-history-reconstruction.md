# CODEX-RECOVERY-001 — Project History Reconstruction

Status: READY_FOR_CODEX
Owner: CODEX
Requested by: HUMAN via ChatGPT
Date: 2026-08-28
Mode: READ-ONLY RECOVERY AUDIT

## Objective

Help recover as much missing Marmalio World project history, decisions, task results, local repository state, and durable evidence as possible after ChatGPT UI history disappeared back to Monday.

Do not guess missing facts. Distinguish clearly between:

- CONFIRMED
- STRONG INFERENCE
- POSSIBLE
- NOT RECOVERED

## Hard safety rules

READ-ONLY only.

Do NOT:

- reset;
- clean;
- checkout another branch;
- rebase;
- merge;
- stash pop/apply/drop/clear;
- delete/move/rename files;
- stage;
- commit;
- push;
- publish;
- deploy;
- access external commerce/social accounts;
- expose credentials, API keys, tokens, customer PII or unrelated private files.

The known local working tree contains important approved uncommitted work. Preserve it exactly.

Expected local baseline from prior reports:

- branch: `feature/marmalio-flow-v1`
- HEAD: `9415cf057d4eb970d224220304cb5529690c9191`
- staged files: `0`
- preserved stash: `stash@{0}: pre-origin-main-sync-2026-08-24`

If actual baseline differs, REPORT the difference and continue only with safe read-only inspection.

## Read first

1. `AGENTS.md`
2. `docs/CURRENT_SESSION_CHECKPOINT.md`
3. `docs/RECOVERY_AUDIT_2026-08-24_TO_2026-08-28.md`
4. `docs/ARCHITECTURE_V2_2_MULTI_REVENUE.md`
5. `docs/COMPLIANCE_GATES_2026.md`
6. `docs/GERMANY_BUSINESS_SETUP_2026.md`
7. `docs/WORK_SPLIT_AI_TEAM_2026-08-24.md`
8. `docs/chat-logs/README.md`
9. `docs/chat-logs/2026-08-28.md`
10. all relevant `docs/tasks/claude/**` and `docs/reports/claude/**`
11. all Product #1 release/readiness/content-pilot evidence
12. current repository status and local Git metadata

## Recovery sources to inspect

Inspect all safe project-local sources that may preserve decisions or work from 2026-08-24 through 2026-08-28, including:

### Git / repository

- `git status --short --branch -uall`
- `git branch --show-current`
- `git rev-parse HEAD`
- `git log --all --decorate --oneline --date=iso --since=2026-08-24`
- `git reflog --all --date=iso --since=2026-08-24`
- `git stash list --date=local`
- `git stash show --stat stash@{0}`
- safe read-only inspection of stash contents where useful
- tracked and untracked files
- local-only task/report/spec files
- branches/tags/remotes
- diff against HEAD and against relevant remote refs
- any orphaned/unreferenced but safely discoverable Git objects only if inspectable without modifying repository state

### Project files

- `docs/**`
- `products/**`
- `content/**`
- `integrations/**`
- `config/**`
- `assets/**`
- task/report folders
- generated release evidence
- markdown/txt/json/yaml files containing Claude/Codex/HUMAN decisions
- timestamps and file provenance where useful

### Local project-adjacent recovery sources

Only inspect project-related material and only read-only:

- VS Code project-local history/recovery artifacts if directly accessible and clearly scoped to this repository;
- OneDrive-local copies/version remnants visible in the Marmalio World project folder;
- temp/export files clearly belonging to Marmalio World;
- local markdown/text files containing pasted Codex/Claude results;
- screenshots or exported reports already stored inside the project folder.

Do NOT browse unrelated browser history, personal mailboxes, credentials stores, unrelated Documents/Desktop content or private personal data.

## Specific missing items to search for

Try to recover evidence for all of the following:

1. Exact final Codex acceptance/review for `CLAUDE-009-REPAIR-003`.
2. Exact final independent review result for `KONTROLA v3` — ACCEPT / MODIFY / REJECT — and whether it was integrated.
3. Any final ChatLLM decision/integration conclusion.
4. Whether Make/plugin installation was actually completed.
5. Any missing decisions about creative/video tool stack: Canva, CapCut, Runway, ElevenLabs, OpusClip, HeyGen, OpenArt/Smart Shot, Metricool.
6. Any missing decisions about 17-language strategy or exact historical language list.
7. Any missing Product #2–#5 concepts, priorities, manifests, market-validation decisions or content plans.
8. Any missing Finance Control Tower decisions.
9. Any missing AIVM/shared-memory decision details.
10. Any missing NFC Review Cards Munich assumptions/decisions.
11. Any missing Germany business/tax/legal decisions or HUMAN confirmations.
12. Any missing Lemon Squeezy TEST/live sequence decisions or native IDs — REPORT IDs only if already present in project evidence; do not expose secrets or customer data.
13. Any missing Codex/Claude task selections, verdicts, scores, blockers and NEXT actions.
14. Any missing content-pilot script/visual decisions before `CLAUDE-010-REPAIR-004`.
15. Any important project agreement from 2026-08-24 through 2026-08-28 that is absent from `RECOVERY_AUDIT_2026-08-24_TO_2026-08-28.md`.

## Cross-check requirement

Compare recovered evidence against:

- `docs/RECOVERY_AUDIT_2026-08-24_TO_2026-08-28.md`
- `docs/CURRENT_SESSION_CHECKPOINT.md`

For every recovered item, state whether it:

- MATCHES current recovery audit;
- CORRECTS it;
- ADDS missing detail;
- CONFLICTS with it.

## Required output

Return exactly this structure in Codex chat; do not edit repository files during the audit:

# CODEX RECOVERY AUDIT — RESULT

RECOVERY COVERAGE:
- date range checked
- sources checked
- sources inaccessible

CONFIRMED RECOVERED ITEMS:
1. ...

CORRECTIONS TO CHATGPT RECOVERY AUDIT:
1. ...

NEW DETAILS NOT YET IN RECOVERY AUDIT:
1. ...

MISSING FINAL VERDICTS / TASK RESULTS RECOVERED:
- CLAUDE-009-REPAIR-003: ...
- KONTROLA v3: ...
- other: ...

LOCAL-ONLY WORK RECOVERED:
- ...

PROJECT DECISIONS RECOVERED BY DATE:
### 2026-08-24
- ...
### 2026-08-25
- ...
### 2026-08-26
- ...
### 2026-08-27
- ...
### 2026-08-28
- ...

UNRECOVERED / NOT PROVABLE:
1. ...

SAFETY STATE:
- branch
- HEAD
- staged files
- stash
- files modified by this audit = 0
- commit = NO
- push = NO
- external action = NONE

BEST NEXT RECOVERY ACTION:
- one safest next step, if any

Then STOP.
