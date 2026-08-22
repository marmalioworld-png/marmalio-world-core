# Localization Manifest — Polish, German, Spanish, French

Status of every planned language release. **All four are "not started."** This manifest exists to plan the work, not to report progress on work that hasn't begun.

## Status table

| Language | Locale code | Status | Target market(s) | Translator assigned | Language QA reviewer assigned |
|---|---|---|---|---|---|
| Polish | `pl` | Not started | Poland | — | — |
| German | `de` | Not started | Germany (primary), Austria/Switzerland (secondary, see notes) | — | — |
| Spanish | `es` | Not started | Spain (primary) — see notes on Latin America | — | — |
| French | `fr` | Not started | France (primary) — see notes on Canada/Quebec | — | — |

## Per-language market decisions (to confirm before translation starts)

### Polish (`pl`)

- **Formality register:** Polish job-application writing is typically formal ("Pan/Pani" register in cover letters and any direct address); confirm this register throughout rather than defaulting to the more casual tone acceptable in English.
- **Resume/CV terminology:** Poland uses "CV" (curriculum vitae) as the standard term, not "resume" — same document, different label, consistent with the UK/Australia note in `00b-market-conventions.md`.
- **Local conventions:** Polish CVs commonly include a data-processing consent clause (referencing RODO, Poland's implementation of GDPR) — this is a market-specific disclaimer addition, not present in the English master, and must be added accurately, not invented from a template guess.
- **Currency:** PLN. Local salary-research sources differ from the English-market list in `00b-market-conventions.md` (e.g., Pracuj.pl, No Fluff Jobs, wynagrodzenia.pl) — confirm current, reputable sources before publishing Prompt 08's market note.
- **Files in scope:** all customer-facing sections, per `localization/README.md`'s split — full file list mirrors the English master (see `packaging-manifest.md`).

### German (`de`)

- **Formality register:** German professional correspondence defaults to formal "Sie," not "du" — confirm this throughout; this is a bigger stylistic shift from the English master's direct-but-friendly tone than the other three languages, so budget extra language-QA attention here.
- **Resume/CV terminology:** Germany uses "Lebenslauf" (CV) with its own strong structural conventions — German CVs traditionally include a signed photo and a chronological (often table-based) layout very different from this kit's plain one-column, no-photo default. This is the single largest true-localization decision in this manifest: whether to keep the kit's honest, ATS-conscious one-column structure (recommended, since German employers increasingly accept it, especially at larger/international companies) or build a second, photo-inclusive, traditional-format template specifically for the German release. **This decision needs explicit owner sign-off before German production starts** — it is not a translation question.
- **Market variants:** Austria and Switzerland share German as a language but have their own market conventions (e.g., Switzerland's CV norms and currency, CHF); scope for this release is Germany only unless separately approved.
- **Currency:** EUR. Local salary sources: kununu, Glassdoor Germany, StepStone Gehaltsreport.

### Spanish (`es`)

- **Regional variant decision required before translation starts:** Spain Spanish vs. Latin American Spanish are meaningfully different in vocabulary, formality conventions, and resume terminology (e.g., "currículum" / "hoja de vida" varies by country). This manifest defaults to **Spain Spanish** as the first release (`es`), matching a European launch alongside Polish, German, and French; a Latin American variant (`es-MX` or similar, market TBD) is a distinct, later decision, not an automatic extension of the Spain version.
- **Resume/CV terminology:** Spain commonly uses "currículum" or "CV."
- **Currency:** EUR (Spain). Local salary sources: InfoJobs, Glassdoor España.
- **Formality register:** formal address ("usted") is standard in Spanish professional writing, particularly in cover letters.

### French (`fr`)

- **Regional variant decision required before translation starts:** France French vs. Canadian/Quebec French differ in vocabulary and resume conventions (Quebec CVs follow some North American norms atypical in France). This manifest defaults to **France French** as the first release (`fr`); a Quebec/Canadian French variant (`fr-CA`) is a distinct, later decision — relevant given Canada is already one of the four English master target markets, so a French-Canadian version may be a nearer-term priority than Spain-vs-Latin-America is. Flag this for owner prioritization.
- **Resume/CV terminology:** France uses "CV."
- **Local conventions:** French CVs traditionally include a photo more often than UK/US/Australia norms, though this has been shifting, especially at larger and international employers — same category of decision as the German photo question above, needs explicit confirmation, not an assumption either way.
- **Currency:** EUR (France). Local salary sources: Glassdoor France, Indeed Salaires.

## Per-file localization map

Every customer-facing source file, what it needs beyond translation (numbered tags map to the categories in `localization-vs-translation.md`), and whether it currently contains the public product name "Marmalio Apply" (per `product-identity.md` — if the name is ever revised after formal trademark clearance, every "Yes" row below must be updated together, in every language edition, not just English).

Tags: **[1]** terminology · **[2]** spelling/regional variant · **[3]** examples · **[4]** employment conventions · **[5]** Shopify copy · **[6]** SEO · **[7]** currency · **[8]** disclaimers · **[9]** video/social hooks.

Internal-only files are excluded from this map — they are never translated: `README.md`, `packaging-manifest.md`, `product-identity.md`, and everything inside `localization/` itself.

| Source file | Translate | Market-adapt tags | Contains "Marmalio Apply" |
|---|---|---|---|
| `00-start-here-guide.md` | Yes | [1] | Yes |
| `00b-market-conventions.md` | Yes — but see note below | [1][2][4][7] | No |
| `01-workflow-overview.md` | Yes | [1] | No |
| `prompts/00-prompt-library-overview.md` | Yes | [1] | No |
| `prompts/01-job-posting-analysis.md` | Yes | [1] | No |
| `prompts/02-experience-inventory.md` | Yes | [1] | No |
| `prompts/03-resume-bullet-rewrite.md` | Yes | [1] | No |
| `prompts/04-resume-tailoring.md` | Yes | [1] | No |
| `prompts/05-cover-letter.md` | Yes | [1][4] | No |
| `prompts/06-linkedin-headline-summary.md` | Yes | [1] | No |
| `prompts/07-star-interview-prep.md` | Yes | [1][4] | No |
| `prompts/08-salary-negotiation.md` | Yes | [1][7] | No |
| `prompts/09-career-change-narrative.md` | Yes | [1][3] | No |
| `templates/resume-template-1-onecolumn.md` | Yes | [1][4] | No |
| `templates/resume-template-2-onecolumn.md` | Yes | [1][4] | No |
| `templates/cover-letter-template.md` | Yes | [1][4] | No |
| `workflows/linkedin-optimization-workflow.md` | Yes | [1] | No |
| `workflows/star-interview-prep-workflow.md` | Yes | [1] | No |
| `workflows/salary-negotiation-workflow.md` | Yes | [1][7] | No |
| `workflows/career-change-workflow.md` | Yes | [1][3] | No |
| `quality/truth-and-quality-checklist.md` | Yes | [1][4] | No |
| `quality/limitations-and-safe-use.md` | Yes | [4][8] | No |
| `examples/example-mid-career-professional.md` | Yes — full rebuild, not literal translation | [1][3][4][7] | No |
| `examples/example-career-changer.md` | Yes — full rebuild, not literal translation | [1][3][4][7] | No |
| `examples/example-recent-graduate.md` | Yes — full rebuild, not literal translation | [1][3][4][7] | No |
| `before-after/before-after-examples.md` | Yes | [1][3] | No |
| `marketing/shopify-product-page.md` | Yes | [1][5][7][8] | Yes |
| `marketing/shopify-faq.md` | Yes | [1][5][7][8] | No |
| `marketing/free-excerpt.md` | Yes | [1][5][6] | Yes |
| `marketing/video-scripts-6.md` | Yes | [9] | No |
| `marketing/shot-list-and-voiceover.md` | Voiceover/on-screen text only — shot lists stay in English as production instructions | [9] | No |
| `marketing/canva-graphic-briefs.md` | Text content only — visual specs stay in English as production instructions | [5] | No |
| `marketing/social-launch-pack-week1.md` | Captions only — posting schedule stays in English as production instructions | [5][6][9] | No |

**Note on `00b-market-conventions.md`:** this file is translated, but its *content* changes per language rather than being a straight translation — e.g., the Polish version replaces the USA/Canada/UK/Australia currency and salary-source table with Poland-specific sources (see `localization-manifest.md`'s per-language notes above), rather than translating references to Glassdoor UK into Polish for a Polish reader who wouldn't use it.

## Scope note

Every language above carries the same file list and structure as the English master (34 source files, ~16,000 words as of the current master — see the Sprint 001 production report), reduced by whatever content is genuinely market-adapted rather than 1:1 translated (e.g., a German version may need one additional template variant, per the photo decision above, rather than a straight file-for-file match). Exact per-language word counts and file lists will be finalized once each language's market decisions above are confirmed.

## What does not wait for translation

Nothing. Per the binding requirement, English production is not delayed by this planning — this manifest and the market-conventions file exist alongside the English master, not instead of finishing it.
