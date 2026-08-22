# Elements Requiring True Localization, Not Literal Translation

A direct, literal translation of the English master would produce a lower-quality product than the master itself in every one of the categories below. This file names them explicitly so a translator, a language-QA reviewer, and the owner can budget real attention to each one, instead of discovering the gap after publishing.

## 1. Resume terminology

The English master uses "resume" throughout, with a note that UK/Australia readers substitute "CV." A translated version cannot carry this same dual-term trick — each target language has one dominant local term ("CV" in Poland, "Lebenslauf" in Germany, "currículum"/"CV" in Spain, "CV" in France) and it must be used consistently and correctly throughout, not translated word-by-word from "resume" in a way that sounds foreign to a native reader.

## 2. Spelling and regional variants

Beyond word-level translation, each language has its own regional-variant decision that changes vocabulary, not just spelling: Spain vs. Latin American Spanish, France vs. Quebec French, Germany vs. Austria/Switzerland German (see `localization-manifest.md` for the specific decisions required for each). Picking the wrong variant is not a typo-level error — it can make the whole product read as written for the wrong country.

## 3. Examples

The three fictional worked examples (`examples/`) use US/Canada-flavored job titles, company-culture references, and career paths (e.g., "Assistant Store Manager," an American-style retail structure). A literal translation keeps American assumptions in Polish, German, Spanish, or French words. True localization means rebuilding at least one example per language around a locally recognizable job title, career path, and company-culture reference, so a local reader sees themselves in it — not an American example wearing a translated label.

## 4. Job-market conventions

Covered in detail per language in `localization-manifest.md`: photo-on-CV norms (expected in Germany and France more often than in the English-master markets; not expected in Poland), formality register (formal "Sie"/"usted"/"Pan-Pani" address vs. the English master's direct-but-friendly tone), typical CV length, and what personal information is normal to include. These are structural, not linguistic — a perfect translation of a no-photo, informal-register template is still wrong for a market that expects a photo and formal address.

## 5. Shopify copy

Product titles, taglines, and CTAs need to read as native marketing copy in each language, not as translated English sentence structure. This includes reworking the "What This Is NOT" honesty framing (the ❌/✅ myth-busting pattern) so the specific myths addressed match what job seekers in that market actually believe or worry about — the English master's ATS-myth framing, for instance, may need a different specific claim to debunk if ATS anxiety isn't the dominant local narrative.

## 6. SEO keywords

The English master's discoverability strategy (organic search, hashtags, the free excerpt as a lead magnet) targets English search terms like "ChatGPT resume prompts." Each language needs its own keyword research — a literal translation of an English keyword phrase is frequently not what native speakers actually search for. This requires local keyword research per language, not a translation of the English keyword list.

## 7. Currencies

Every price, salary example, and negotiation-prompt placeholder must use the local currency (PLN, EUR for Germany/Spain/France) at locally realistic figures — not a converted USD number, which would look foreign and potentially wrong as the market moves. See `localization-manifest.md` for currency and local salary-source references per language.

## 8. Disclaimers

The core honesty disclaimers (no guaranteed interviews, no ATS-beating claims, no fabricated experience) translate in substance to every market — but some markets need an additional, legally- or culturally-specific disclaimer the English master doesn't have. Poland's RODO/GDPR data-consent clause convention (noted in `localization-manifest.md`) is the clearest example: this isn't in the English master at all, and a literal translation would simply omit it, leaving the Polish version incomplete in a way a Polish reader would immediately notice.

## 9. Video hooks

The 6 video scripts' hooks ("Your resume isn't the problem. Your prompt is.") rely on English wordplay and rhythm that will not land the same way translated word-for-word. Each language needs its own hook writing pass — keeping the same underlying idea per script (problem/pain, before/after, listicle, myth-busting, behind-the-scenes, career-changer) but writing the actual hook line to work natively in that language, the same way a good ad campaign is adapted per market rather than subtitled.

## What this list is not

This is not a claim that everything needs rebuilding. The prompts' core mechanics (required inputs → prompt text → expected output → truth check → refinement step), the workflow structure, the Truth & Quality Checklist's logic, and the overall product architecture translate directly and don't need market reinvention — only the nine categories above do. Scoping localization work around this list, rather than treating the whole product as needing equal rebuilding, is what keeps localized releases both premium-quality and actually achievable.
