# Prompt 01 — Job Posting Analysis

## Purpose

Before you tailor anything, you need to know exactly what the role is actually asking for — not what you assume it's asking for. This step extracts requirements, themes, and keywords directly from the posting text, and separates what's explicitly stated from what's ambiguous.

## Required Inputs

- The full text of the job posting (copy the entire posting, including the "about us" and "responsibilities" sections — don't trim it down first).

## The Prompt

```
You are helping me analyze a job posting before I tailor my application materials to it.

Use only the information explicitly provided in this conversation. Do not invent, assume, or infer any requirement, responsibility, or expectation that is not stated in the posting text below. If something in the posting is vague or ambiguous, note it as unclear rather than resolving it yourself.

Job posting text:
"""
[PASTE FULL JOB POSTING HERE]
"""

Produce a structured breakdown with these sections:

1. MUST-HAVE REQUIREMENTS — explicitly required qualifications, experience, or skills.
2. NICE-TO-HAVE / PREFERRED — explicitly stated as preferred, bonus, or a plus.
3. RECURRING KEYWORDS AND THEMES — words, phrases, or concepts that appear more than once or are clearly emphasized.
4. IMPLIED PRIORITIES — what the posting's structure, order, or emphasis suggests matters most to this employer (label this section as inference, since it is reading between the lines rather than a direct quote).
5. UNCLEAR OR AMBIGUOUS ITEMS — anything in the posting that is vague, contradictory, or could be interpreted more than one way.

Do not evaluate whether I am a good fit. That is not this step's job — this step is only about understanding the posting itself.
```

## Expected Output

A five-section breakdown as specified. Sections 1–3 should be near-verbatim extractions from the posting. Section 4 should be clearly labeled as inference. Section 5 may be short or even empty if the posting is clear — an empty section 5 is a valid, good result, not a failure.

## Truth Check

Does every item in sections 1–3 trace back to actual text in the posting? If the AI added a requirement that "most postings like this" usually have but this one didn't state, that's a fabrication — remove it.

## Refinement Step

If you find an added requirement, paste this back:

```
Re-check your breakdown against the posting text. Remove any item in sections 1–3 that is not explicitly stated in the posting, even if it's common for similar roles. Move genuinely inferred items to section 4 and label them clearly as inference.
```
