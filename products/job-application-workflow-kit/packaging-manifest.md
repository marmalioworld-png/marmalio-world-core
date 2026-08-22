# Packaging Manifest

This defines what the source files in this directory become once converted into final, customer-delivered files. No conversion has happened yet — the files below do not exist yet. This manifest exists so production (Canva/Docs/PDF export) knows exactly what to produce and from which source.

This manifest covers the English master only. For Polish, German, Spanish, and French, see `localization/localization-manifest.md` — those releases follow the same file list and structure below, produced only after the English master is approved and live.

## Final customer-facing files

| Final file | Format | Built from these source files |
|---|---|---|
| `Marmalio-Apply_Start-Here-Guide.pdf` | PDF | `00-start-here-guide.md` |
| `Marmalio-Apply_Complete-Guide.pdf` | PDF | `00b-market-conventions.md` + `01-workflow-overview.md` + all of `prompts/` + all of `workflows/` + all of `quality/` + all of `examples/` + `before-after/before-after-examples.md` |
| `Marmalio-Apply_Prompt-Library.xlsx` (or Google Sheet, copy-paste format) | XLSX/Sheet | all of `prompts/` — reformatted as one row per prompt with columns: Prompt #, Purpose, Required Inputs, Prompt Text, Truth Check, Refinement Step |
| `Marmalio-Apply_Resume-Template-1-OneColumn.docx` | DOCX | `templates/resume-template-1-onecolumn.md` |
| `Marmalio-Apply_Resume-Template-2-OneColumn.docx` | DOCX | `templates/resume-template-2-onecolumn.md` |
| `Marmalio-Apply_Cover-Letter-Template.docx` | DOCX | `templates/cover-letter-template.md` |
| `Marmalio-Apply_Full-Package.zip` | ZIP | bundles all six files above |
| `Marmalio-Apply_Free-Excerpt.pdf` | PDF (lead magnet, distributed separately from the paid ZIP) | `marketing/free-excerpt.md` |

## Conversion notes

- PDFs: source Markdown → formatted document (tool not yet chosen — candidates are Canva's document/PDF export or Google Docs export; either must follow the visual tone defined in `marketing/canva-graphic-briefs.md` for consistency with the graphic assets).
- DOCX templates: built directly from the `templates/` files' formatting notes (single column, plain font, no tables/graphics) — not auto-converted from Markdown, since exact Word formatting needs manual attention per the notes in each template file.
- The Prompt Library sheet is the only asset reformatted from a document structure into a tabular one — this is intentional, since customers copy-pasting prompts benefit from a flat, searchable list more than from prose.
- Filenames above use "Marmalio Apply," the owner-approved working public name (see `product-identity.md`). It is provisionally approved for production but has not yet cleared a formal trademark search — if that clearance changes the name, regenerate every filename in this manifest before shipping any customer file.

## Country editions vs. language editions (for future releases)

Two independent dimensions, don't conflate them:

- **Country editions** — same English language, different market conventions. Only the master (`en`) is in scope for the first launch; an `en-GB` edition (adjusted length/spelling for UK/Australia per `00b-market-conventions.md`) is a possible later addition, not a translation project.
- **Language editions** — Polish, German, Spanish, French, per `localization/localization-manifest.md`. Each may itself later need a country-edition split (e.g., `es` for Spain vs. `es-MX` for Latin America, `fr` for France vs. `fr-CA` for Quebec — see that manifest's per-language notes).

### Filename convention

None of the files above are locale-suffixed today because the current, only release is the English master. When a country or language edition is produced, append its code before the extension so the master and every variant coexist in one folder without collision:

`Marmalio-Apply_Start-Here-Guide_[LOCALE].pdf`

Locale codes: `en` (master, American spelling), `en-GB` (optional country edition), `pl`, `de`, `es` / `es-MX`, `fr` / `fr-CA`. The English master ships without a suffix until a second edition exists, at which point add `_en` retroactively for consistency across all editions.

### Shopify listing implication

Each country or language edition above corresponds to a separate Shopify listing (or a Shopify Markets-managed variant of one listing) with its own localized product-page copy from `marketing/shopify-product-page.md`'s translated/adapted version — not a single listing with a language switcher bolted on. This is a store-configuration decision for whoever manages Shopify at publish time, noted here only so packaging and store setup stay in sync.

## Not yet produced (blocked on this manifest + owner approval)

- Any PDF, DOCX, XLSX, or ZIP file — none exist yet; only the Markdown source content in this directory exists.
- Any Canva asset (see `marketing/canva-graphic-briefs.md` for the brief).
- Any video file (see `marketing/shot-list-and-voiceover.md` for the brief).

## Explicitly out of scope for this manifest

- Shopify store/listing configuration itself (a publishing action, not a packaging one). This product is sold through the main Marmalio World Shopify store — no separate domain is purchased or configured for it.
- Payment, tax, or account setup (see the product's `README.md` and the Sprint 001 recommendation for what requires owner approval).
