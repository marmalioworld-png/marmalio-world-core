# Prompt 05 — Cover Letter

## Purpose

Draft a cover letter that connects your real experience to this specific role, grounded only in what Steps 1–2 already established.

## Required Inputs

- Your Experience Inventory (Prompt 02 output).
- Your Job Posting Analysis (Prompt 01 output).
- A tone preference: direct/professional, warm/personable, or concise/executive.
- The employer/role name and, if you have one, the hiring manager's name.

## The Prompt

```
You are writing a cover letter. You must use only the experience described in the inventory below — do not add any employer, achievement, skill, or outcome that is not in it.

My experience inventory:
"""
[PASTE PROMPT 02 OUTPUT HERE]
"""

Target role analysis:
"""
[PASTE PROMPT 01 OUTPUT HERE]
"""

Role/company name: [ROLE TITLE AT COMPANY NAME]
Hiring manager name (if known, otherwise write "Hiring Team"): [NAME OR "Hiring Team"]
Tone: [direct/professional | warm/personable | concise/executive]

Write a 250–350 word cover letter that:
1. Opens by naming the specific role and one genuine, specific reason for interest (not a generic "I am excited about this opportunity").
2. Connects two or three real items from my inventory directly to the must-have requirements from the role analysis.
3. Does not restate my entire resume — it should complement it, not repeat it.
4. Closes with a clear, low-pressure call to action.
5. Uses no claim, metric, or outcome that is not present in my inventory above.

If you cannot find inventory content that genuinely connects to a must-have requirement, say so explicitly in a note after the letter rather than writing a vague sentence that implies a connection that isn't there.
```

## Expected Output

A 250–350 word letter in the requested tone, using the provided template structure (`templates/cover-letter-template.md`), plus an optional note flagging any requirement the letter couldn't honestly connect to your inventory.

## Truth Check

Does every specific claim in the letter (a project, a result, a skill) trace back to the inventory? Does the letter avoid vague filler phrases standing in for a connection that isn't actually there?

## Refinement Step

```
Reread the letter against my inventory. Underline (or list) any sentence that makes a claim not directly supported by the inventory, and rewrite those sentences to either use a real inventory detail instead, or remove the claim entirely.
```
