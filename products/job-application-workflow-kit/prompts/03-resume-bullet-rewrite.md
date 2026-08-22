# Prompt 03 — Resume Bullet Rewrite

## Purpose

Turn the raw, unpolished entries from your Experience Inventory into clear, strong resume bullets — using only what's already there. This step is about clarity and structure, not new content.

## Required Inputs

- The relevant section(s) of your Experience Inventory (Prompt 02 output).
- Optionally, the recurring keywords/themes from your Job Posting Analysis (Prompt 01), so phrasing can lean toward language the employer already used — without changing what actually happened.

## The Prompt

```
You are rewriting resume bullets from a factual experience inventory. You must not add any fact, metric, or outcome that is not already present in the inventory text below.

Experience inventory (source of truth):
"""
[PASTE RELEVANT INVENTORY SECTION HERE]
"""

Optional — recurring keywords/themes from the target job posting, for phrasing only, not for adding claims:
"""
[PASTE KEYWORDS HERE, OR LEAVE BLANK]
"""

Rewrite each inventory item into one strong resume bullet using this pattern where the inventory supports it: [Action verb] + [what was done] + [result or scope, only if stated in the inventory].

Rules:
- If the inventory has a number or result, use it exactly — do not round up, exaggerate, or add a percentage that wasn't given.
- If the inventory has no number or result for an item, write the bullet without one, and add a note: [METRIC NEEDED: ask the candidate for an approximate number or scope, if one exists].
- Do not use words like "successfully," "significantly," or "expertly" unless the inventory's own description clearly supports that weight.
- Keep each bullet to one line where possible.
```

## Expected Output

One rewritten bullet per inventory item, each traceable back to a specific inventory sentence, with `[METRIC NEEDED: ...]` notes wherever a number would help but wasn't provided — never a fabricated number filling that gap.

## Truth Check

Pick three rewritten bullets at random and match each word or claim back to the inventory. If a bullet says "reduced costs by 20%" and the inventory only said "worked on reducing costs," that 20% is fabricated and must be removed.

## Refinement Step

```
Compare each bullet you wrote against the original inventory text, word by word for any claim, number, or outcome. List any bullet that contains a detail not present in the inventory, and rewrite it without that detail — replace it with a [METRIC NEEDED] note instead.
```
