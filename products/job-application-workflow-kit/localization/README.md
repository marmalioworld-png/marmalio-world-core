# Localization Architecture

This folder plans localized releases of Marmalio Apply (internal code: `job-application-workflow-kit`). **Nothing in this folder has been translated yet.** The English master (everything outside `localization/`) is the only version that exists today, and it ships first so the business can start selling quickly — localization work starts only after that master is approved and live.

## Why the master was built this way

Every file in the English master already separates two kinds of content:

1. **Customer-facing / localizable text** — guide prose, prompt text (inside the fenced code blocks in `prompts/`), template structures, example content, marketing copy, video scripts, voiceover text.
2. **Internal production notes** — instructions like "Design intent for DOCX production," Canva/InVideo AI production briefs, packaging/conversion notes, and this folder's own planning documents. These stay in English always, for whoever is producing the files, regardless of which language the customer-facing output is in.

This split already exists structurally in every file (internal notes are consistently under headings like "Formatting notes," "Design intent," "Production notes," or in bracketed `[PENDING...]`/`[...NOTE]` markers) — a translator or localization reviewer works only with the customer-facing sections, not the whole file. No file needs to be restructured to support this; the convention just needs to be followed consistently going forward, including in this folder's own guidance below.

## Locale codes used across this product

`en` (master — American spelling, built for USA/UK/Canada/Australia together), `pl`, `de`, `es`, `fr`. See `packaging-manifest.md` for the exact filename suffix convention.

## Localization workflow (for each future language)

1. **Do not start until the English master is approved and live.** This is a hard sequencing rule, not a preference — see the product's revenue-first priority.
2. **Translate** the customer-facing sections of every file listed in `localization-manifest.md`, by a fluent, professional translator — never a raw machine-translation pass treated as final (see `localization-vs-translation.md` for exactly which elements a translator must adapt rather than translate literally).
3. **Market-adapt** the elements flagged in `localization-vs-translation.md` — resume/CV terminology and conventions for that specific country, spelling/regional variant decisions, currency, local salary-research sources, SEO keywords, and video hooks.
4. **Language QA** — a separate, fluent reviewer (not the original translator) checks the localized version against both the English master (for completeness and accuracy) and against local market norms (for the market-adapted elements). This is a required, separate step, not a formality.
5. **Publish** only after language QA sign-off and the same owner-approval gate that applies to the English master (see the product's `README.md` and the operating model in `CLAUDE.md`).

## What "premium in every language" means here

The English master's standard — complete, specific, honestly positioned, structurally consistent — is the bar every localized version must also clear. A localized version that reads as translated (awkward phrasing, examples that don't fit the local job market, disclaimers that don't reference local norms) does not meet that bar, even if every sentence is technically correct. This is why `localization-vs-translation.md` exists: to name, in advance, exactly where literal translation will produce a lower-quality product than the English master, so those specific spots get real market attention instead of a direct swap.
