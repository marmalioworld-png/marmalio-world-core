# Prompt 04 — Resume Tailoring

## Purpose

Select and order your already-verified bullets (Prompt 03 output) to match the specific role's priorities (Prompt 01 output). Tailoring here means choosing what to emphasize and how to order it — never inventing new content.

## Required Inputs

- Your rewritten resume bullets (Prompt 03 output).
- Your job posting analysis (Prompt 01 output).
- Your choice of resume template (`templates/resume-template-1-onecolumn.md` or `templates/resume-template-2-onecolumn.md`).

## The Prompt

```
You are tailoring my resume to a specific job posting. You must only select from and reorder the bullets I give you below — you must not write any new bullet, add any detail, or change the meaning of an existing bullet.

My verified resume bullets:
"""
[PASTE PROMPT 03 OUTPUT HERE]
"""

The target role's must-have requirements, nice-to-have items, and recurring themes:
"""
[PASTE PROMPT 01 OUTPUT HERE]
"""

Do this:
1. For each role/section, select the bullets most relevant to the target role's requirements and themes. You may reorder bullets within a role, but do not alter their wording beyond trivial punctuation.
2. If a bullet is not relevant to this specific role, you may omit it from this tailored version — but list what you omitted and why, separately, so I can review the decision.
3. Do not add a bullet, a skill, or a qualification that addresses a requirement I have no matching content for. If there's a must-have requirement I don't seem to have covered, flag it as a gap instead of inventing coverage for it.
4. Output the final tailored content organized to fit this resume structure:
"""
[PASTE TEMPLATE STRUCTURE HERE]
"""
```

## Expected Output

A tailored resume draft using only your existing bullets, reordered and selectively included, fit into the chosen template structure — plus a separate list of omitted bullets and any flagged coverage gaps.

## Truth Check

Confirm every bullet in the tailored draft appears, unchanged in substance, in your Prompt 03 output. Confirm any flagged "gap" is a real gap and not something the AI could have found if it had looked more carefully at your inventory.

## Refinement Step

```
List every bullet you removed from this tailored version and your reason for removing it. Then list every requirement from the job posting analysis that I do not appear to have matching content for — do not suggest how to fake coverage for these; just list them as gaps for me to decide how to address.
```
