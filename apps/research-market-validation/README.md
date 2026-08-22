# research-market-validation

A deterministic **research-readiness preflight** for one product or content idea. It checks
whether an idea's supporting documentation is structurally complete and internally consistent —
it does not judge whether the idea is good, whether its claims are true, or whether there is
market demand for it. See `limitations` in every output.

## Usage

```
npm run validate:idea -- <path-to-idea.json-or-yaml>
```

Example: `npm run validate:idea -- apps/research-market-validation/examples/sample-idea.json`

Exit codes: `0` for any completed evaluation (including `insufficient-input` — that is a valid
result, not a tool failure); non-zero only when the input or the tool itself failed (bad
arguments, unreadable/malformed input, unreadable/malformed `config/ecosystem.yaml`).

## Input contract

```jsonc
{
  "id": "kebab-case-idea-id",
  "kind": "product",              // or "content"
  "title": "non-empty string",
  "problem": {                     // optional container; each field optional-if-present
    "statement": "non-empty string",
    "current_alternative": "non-empty string",
    "desired_outcome": "non-empty string"
  },
  "target_audience": {             // optional container
    "segment": "non-empty string",
    "context": "non-empty string"
  },
  "target_channel": "shopify",     // required; must match config/ecosystem.yaml channels.primary or channels.expansion
  "assumptions": [                 // optional array; each item's fields are required if the item exists
    { "id": "unique-kebab-case-id", "claim": "non-empty string" }
  ],
  "evidence": [                    // optional array; each item's fields are required if the item exists
    {
      "id": "unique-kebab-case-id",
      "claim": "non-empty string",
      "source_type": "non-empty-kebab-case-string",
      "source_reference": "non-empty string",
      "supports_assumption_ids": ["existing assumption id, no duplicates"]
    }
  ],
  "alternatives": [                // optional array; each item's fields are required if the item exists
    { "name": "non-empty string", "difference": "non-empty string" }
  ]
}
```

An unrecognized `target_channel`, a duplicate `assumptions[].id`/`evidence[].id`, or an
`evidence[].supports_assumption_ids` entry that references a non-existent or duplicated
assumption id is a structural **input error** (the tool refuses to score it), not a lower score.

## Output contract

On valid input:

```jsonc
{
  "valid": true,
  "idea_id": "...",
  "module": "research-market-validation",
  "schema_version": 1,
  "readiness": "ready-for-research",   // or "revise-input" | "insufficient-input"
  "research_readiness_score": { "total": 76, "scale": 100, "breakdown": { "...": "0-20 each" } },
  "assumptions": [ "..." ],
  "missing_evidence": [ "..." ],
  "risks": [ { "severity": "low|medium|high", "message": "..." } ],
  "next_actions": [ "..." ],
  "limitations": [ "..." ],
  "policy": { "ecosystem_version": 1, "qa_min_score": 85, "qa_scale": 100, "qa_mandatory_before_publish": true, "approval_required": ["..."], "note": "..." }
}
```

`policy` values are read live from `config/ecosystem.yaml` at run time — never hard-coded here.

On invalid input: `{ "valid": false, "errors": ["..."] }`.

## Readiness bands

Five criteria (`problem_definition`, `audience_definition`, `evidence_coverage`,
`channel_alignment`, `alternatives_coverage`), each 0–20, summed to a 0–100
`research_readiness_score.total`:

- `70–100` → `ready-for-research`
- `40–69` → `revise-input`
- `0–39` → `insufficient-input`

These bands are module-local constants, unrelated to the ecosystem-wide QA threshold in
`config/ecosystem.yaml`'s `qa.min_score` (which governs publishing, not research readiness).

## Research brief (`brief-idea.js`)

Turns a valid `validate-idea.js` result into a deterministic, prioritized action plan. It is a
**plan generator only** — it never gathers, fetches, or verifies evidence itself. The underlying
preflight only confirms evidence was *declared*, never that it is real, current, or actually
supports the claim; every declared evidence entry therefore gets its own verification task, not
just a pass.

### Usage

```
npm run brief:idea -- <path-to-idea.json-or-yaml>
```

Example: `npm run brief:idea -- apps/research-market-validation/examples/sample-idea-needs-work.json`

Same input contract and exit-code semantics as `validate-idea.js` (invalid input is delegated to
`evaluateIdea` unchanged, so a structurally broken idea fails the same way for both commands).

### Output contract

```jsonc
{
  "valid": true,
  "idea_id": "...",
  "module": "research-market-validation",
  "artifact": "research-brief",
  "schema_version": 1,
  "based_on": { "readiness": "revise-input", "score_total": 49, "scale": 100 },
  "action_plan": [
    {
      "id": "kebab-case-task-id",
      "category": "evidence-gathering",        // | "evidence-verification" | "definition-gap" | "strengthening"
      "priority": "high",                      // | "medium" | "low"
      "assumption_id": "...",                  // present only for evidence-gathering
      "evidence_id": "...",                    // present only for evidence-verification
      "field": "problem.desired_outcome",      // present only for definition-gap
      "action": "concise instruction",
      "suggested_source_types": ["user-interview", "survey", "analytics-export", "expert-review"], // evidence-gathering only, fixed generic list
      "completion_criteria": ["observable requirement", "..."]
    }
  ],
  "summary": { "total": 7, "by_category": { "...": 0 }, "by_priority": { "high": 0, "medium": 0, "low": 0 } },
  "limitations": ["... the four validate-idea.js limitations plus a fifth specific to this artifact ..."],
  "policy": { "...": "same shape and live-read discipline as validate-idea.js" }
}
```

Only the optional keys relevant to a task's category are present — never included as `null`.

### Task categories

- `evidence-gathering` (priority `high`) — one per assumption with zero declared evidence.
- `evidence-verification` (priority `medium`) — one per declared evidence entry; asks the human
  or agent to check source accessibility/identity, publication date or context, whether it
  actually supports the claim, and to record any contradiction found. The module performs none
  of these checks itself.
- `definition-gap` (priority `medium`) — one per missing `problem.*`/`target_audience.*` field.
- `strengthening` (priority `medium` or `low`) — optional improvements: fewer than two
  `alternatives`, or a `target_channel` that isn't the ecosystem's primary channel.

### Ordering

Deterministic: priority (`high` → `medium` → `low`), then fixed category order
(`evidence-gathering` → `evidence-verification` → `definition-gap` → `strengthening`), then the
relevant input's declared order, then task `id` as a final tie-breaker.
