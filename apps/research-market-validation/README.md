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
