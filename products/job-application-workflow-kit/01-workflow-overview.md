# Complete Workflow: Step by Step

This is the full map of the system. Each step lists what it needs, what it produces, and which file to open next.

## Step 1 — Job Posting Analysis

**File:** `prompts/01-job-posting-analysis.md`
**Input:** the full text of one job posting.
**Output:** a structured breakdown of must-have requirements, nice-to-have requirements, recurring keywords/themes, and anything ambiguous or unclear in the posting.
**Why it comes first:** every later step tailors your materials to this specific role. Skipping this step is the single most common reason tailored materials end up generic.

## Step 2 — Experience Inventory

**File:** `prompts/02-experience-inventory.md`
**Input:** your own answers to a structured set of questions about your real work history, education, and projects.
**Output:** a single, organized document containing only facts you provided — no rewriting, no polish yet. This is the source of truth for every step that follows.
**Why it matters:** this is the anti-fabrication safeguard. Nothing downstream is allowed to introduce a fact that isn't already in this document.

## Step 3 — Resume Bullet Rewrite

**File:** `prompts/03-resume-bullet-rewrite.md`
**Input:** the relevant section(s) of your Step 2 inventory, plus the themes identified in Step 1.
**Output:** clear, results-oriented resume bullets — rephrased and structured, with zero new facts added. Any bullet that would benefit from a metric you didn't provide is flagged, not invented.
**Truth boundary:** every rewritten bullet must be traceable word-for-fact back to Step 2.

## Step 4 — Resume Tailoring

**File:** `prompts/04-resume-tailoring.md`
**Input:** your rewritten bullets (Step 3), the job posting analysis (Step 1), and one of the two templates in `templates/`.
**Output:** a role-tailored resume draft — the right bullets, in the right order, for this specific posting. Tailoring here means selection and ordering, never invention.

## Step 5 — Cover Letter

**File:** `prompts/05-cover-letter.md`
**Input:** your experience inventory (Step 2), the job posting analysis (Step 1), and a tone preference.
**Output:** a 250–350 word cover letter grounded only in what Steps 1–2 established, in the cover letter template.

## Step 6 — LinkedIn Optimization

**File:** `workflows/linkedin-optimization-workflow.md` (uses `prompts/06-linkedin-headline-summary.md`)
**Input:** your experience inventory and target roles/industries.
**Output:** three headline options and a rewritten About section, consistent with your resume and cover letter.

## Step 7 — STAR Interview Preparation

**File:** `workflows/star-interview-prep-workflow.md` (uses `prompts/07-star-interview-prep.md`)
**Input:** your experience inventory, the job posting analysis, and a list of likely interview questions.
**Output:** 5–8 STAR-format answers built from your real stories, with gaps flagged rather than filled.

## Step 8 — Salary Negotiation Preparation (optional)

**File:** `workflows/salary-negotiation-workflow.md` (uses `prompts/08-salary-negotiation.md`)
**Input:** market-range data you have researched yourself (e.g., from sites like Glassdoor or levels.fyi) and your inventory highlights.
**Output:** a negotiation script, a response to a lowball offer, and a walk-away-criteria worksheet — using only the numbers you supplied.

## Step 9 — Career-Change Workflow (optional)

**File:** `workflows/career-change-workflow.md` (uses `prompts/09-career-change-narrative.md`)
**Input:** your inventory from your prior field and the target field's requirements from Step 1.
**Output:** a transferable-skills bridge narrative that is honest about what's directly relevant, what transfers indirectly, and what you're still building toward — never a narrative that implies direct experience you don't have.

## Final pass — Truth & Quality Checklist

**File:** `quality/truth-and-quality-checklist.md`
Run every output from Steps 3–9 through this checklist before you send anything to an employer. This step is not optional.
