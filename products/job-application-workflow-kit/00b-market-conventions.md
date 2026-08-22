# Market Conventions: USA/Canada, UK, Australia, and International

This system launches in English targeting the USA, Canada, UK, Australia, and international English-speaking customers together. These markets do not share one resume convention, and no single format in this kit is presented as correct for every country. This file exists so no other file in this kit has to guess — it's the single reference every template, prompt, and workflow points back to.

## Quick reference by market

Read your block, then use the detailed sections below for the specifics behind each line.

**USA / Canada resume guidance:** call it a "resume." 1 page under ~8–10 years of experience, 2 pages maximum otherwise. No photo, no date of birth, no marital status, no nationality. Currency: USD (USA) / CAD (Canada).

**UK CV guidance:** call it a "CV" — same document, different label. 2 pages is the standard expectation, even for less experienced candidates. Photo, date of birth, and marital status are uncommon on modern CVs, though norms have loosened over time. Currency: GBP.

**Australia guidance:** call it a "CV." 2–3 pages is commonly accepted — longer than US/Canada norms. Same personal-information defaults as the UK (no photo, no DOB, no marital status expected). Currency: AUD.

**General international guidance (outside these four):** do not assume the USA/Canada defaults above are universal. Length, personal-information norms, and even whether a photo is expected vary significantly by country — some markets outside the four above do expect a photo or date of birth. Check the specific market's current norms before applying any of this kit's defaults, and treat the USA/Canada/UK/Australia guidance as a safe reference point, not a global rule.

## Terminology: "resume" vs "CV"

This kit uses **"resume"** as its working term throughout, for consistency. If you're in the UK or Australia, your local term is **"CV"** — and it means the same thing this kit calls a resume (unlike in the US/Canada, where "CV" specifically means a long-form academic/research document). Wherever you see "resume" in this kit, UK/Australia users should read it as "CV." Nothing about the content or structure changes — only the label.

## Length

| Market | Typical length |
|---|---|
| USA / Canada | 1 page under ~8–10 years of experience; 2 pages maximum otherwise |
| UK | 2 pages is the standard expectation, even for less experienced candidates |
| Australia | 2–3 pages is commonly accepted, longer than US norms |
| International (elsewhere) | Varies significantly — check local norms before assuming US length rules apply |

Both templates in `templates/` default to the US/Canada-style length guidance in their formatting notes. If you're building a UK, Australian, or other-market version, adjust the target length using this table, not the US default.

## Personal information

**USA / Canada:** no photo, no date of birth, no marital status, no nationality — including these is actively discouraged and can create legal risk for the employer, which is why some US/Canada employers will discard an application that includes them.

**UK / Australia:** a photo is not expected and is uncommon on modern CVs; date of birth and marital status are also uncommon now, though norms have shifted over time and are less strictly enforced than in the US/Canada.

**International (elsewhere):** norms vary widely — some markets outside the four above do expect a photo or date of birth. This kit's templates deliberately omit all of this by default (see `templates/`) because that default is safe for USA/Canada/UK/Australia; do not add personal details without checking the specific market's current norms first.

## Address format

The templates use `[City, State/Country]` deliberately, not a full street address — this is accepted practice across all four launch markets and avoids assuming any one country's address format. Do not expand this to a full postal address unless a specific employer's application system requires it.

## Dates

This kit's templates use written-out month/year formats (e.g., "Jan 2021 – Present") specifically to avoid the MM/DD vs. DD/MM ambiguity between US and most other English-speaking markets (the US reads `03/04/2021` as March 4th; the UK, Canada in practice, and Australia commonly read the same string as April 3rd). Keep dates in this written-out format in every market version — never fall back to a slash-separated numeric date.

## Spelling

This master version uses **American spelling** (e.g., "optimization," "summarize," "organize") as its base, since it's the most common default in both general use and in AI assistants' own output. UK and Australian English conventionally use British spelling (e.g., "optimisation," "summarise," "organise"). This is a known, minor adaptation — not a blocker to using the US-spelled master today, but worth a light spelling pass for a dedicated UK/Australia release later (see `localization/localization-manifest.md`, which tracks this as an English-variant consideration even though UK/Australia isn't a translation project).

## Currency and salary research (Prompt 08)

The Salary Negotiation prompt (`prompts/08-salary-negotiation.md`) never supplies a number itself — you always provide your own researched range. Use your local market's sources and currency:

| Market | Common salary-research sources | Currency |
|---|---|---|
| USA | Glassdoor, levels.fyi, Payscale | USD |
| Canada | Glassdoor Canada, Payscale Canada | CAD |
| UK | Glassdoor UK, Reed, Payscale UK | GBP |
| Australia | Seek, Glassdoor Australia, Payscale Australia | AUD |

## Legal and anti-discrimination context

This system makes no legal claims and gives no legal advice (see `quality/limitations-and-safe-use.md`). Anti-discrimination norms around what to include or omit in an application (photo, age, marital status, and similar) differ by country — e.g., US federal and state law, the UK's Equality Act 2010, and Australia's federal and state anti-discrimination framework each shape local hiring-document norms differently. This kit's defaults (no photo, no DOB, no marital status) are a safe baseline across all four launch markets, not a legal opinion about any one of them.
