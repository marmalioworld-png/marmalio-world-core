# Prompt 07 — STAR Interview Preparation

## Purpose

Convert your real stories into structured, ready-to-use interview answers using the Situation-Task-Action-Result (STAR) format — built from your inventory, not invented for the occasion.

## Required Inputs

- Your Experience Inventory (Prompt 02 output).
- Your Job Posting Analysis (Prompt 01 output).
- Optional: a list of interview questions you already know you'll face (from the employer, a recruiter, or your own research).

## The Prompt

```
You are helping me prepare STAR-format interview answers. Use only the experience in the inventory below — do not invent a story, a result, or a detail that isn't there.

My experience inventory:
"""
[PASTE PROMPT 02 OUTPUT HERE]
"""

Target role analysis:
"""
[PASTE PROMPT 01 OUTPUT HERE]
"""

Known interview questions, if any (otherwise I'll rely on your suggestions below): [PASTE QUESTIONS OR LEAVE BLANK]

Do this:
1. Based on the role analysis, suggest 5–8 likely behavioral interview questions for this role (standard categories: teamwork, conflict, failure/learning, leadership, problem-solving, prioritization).
2. For each question, find the closest matching story in my inventory and structure it as STAR: Situation, Task, Action, Result.
3. If my inventory has no story that genuinely matches a question, do not force one — output [NO MATCHING STORY YET: describe what kind of example would answer this, so I can think of one] instead.
4. In the Result section, only include an outcome if my inventory actually stated one. If not, write the action taken and mark the result as [OUTCOME NOT SPECIFIED IN INVENTORY].
```

## Expected Output

5–8 questions, each with either a complete STAR answer traceable to your inventory, or an honest `[NO MATCHING STORY YET]` flag — never a fabricated story to fill a gap.

## Truth Check

For each STAR answer, confirm the Situation, Task, Action, and Result all come from a single, real inventory entry — not stitched together from unrelated facts to sound more impressive.

## Refinement Step

```
For each STAR answer, tell me which specific inventory entry it came from. If any answer combines details from more than one entry in a way that implies they happened together, separate them or flag the combination explicitly.
```
