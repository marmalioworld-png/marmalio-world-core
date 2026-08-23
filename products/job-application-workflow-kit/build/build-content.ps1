param()
$ErrorActionPreference = "Stop"
. "$PSScriptRoot\build-release.ps1"

function Strip-Leading-H1([string]$mdText) {
  $lines = $mdText -split "`r?`n"
  return ($lines | Select-Object -Skip 1) -join "`n"
}

# ============================================================
# 1-2. Resume templates (DOCX)
# ============================================================
function Build-ResumeTemplate($srcFile, $titleText, $subtitleText, $footerLabel, $outName, $introLines) {
  $md = Get-Content -Raw -Encoding UTF8 "$Root\templates\$srcFile"
  $bodyLines = Get-FencedBlock $md

  $doc = New-WDoc
  Add-Title $doc $titleText $subtitleText
  foreach ($intro in $introLines) { Add-Body $doc $intro }
  Add-H2 $doc "Template"
  Add-Body $doc "Replace every blue, italicized placeholder in brackets with your own real information. Do not leave a placeholder in the final document you submit."
  Add-ResumeTemplateBody $doc $bodyLines
  Add-HeaderFooter $doc $footerLabel

  $docxPath = "$Release\$outName"
  Save-Docx $doc $docxPath
  $qaPdf = "$QaDir\qa-$outName.pdf"
  Export-Pdf $doc $qaPdf
  Close-Doc $doc
  return @{ Docx = $docxPath; QaPdf = $qaPdf }
}

$r1 = Build-ResumeTemplate "resume-template-1-onecolumn.md" "Resume Template 1" "One-Column, Experience-Forward" "Resume Template 1" "Marmalio-Apply_Resume-Template-1-OneColumn.docx" @(
  "Use this version when your work history is your strongest asset -- the most common choice for most candidates and most roles.",
  "This layout is deliberately generic across the USA, Canada, UK, and Australia: no photo, no date of birth, city/region only instead of a full street address, and written-out dates. See the Market Distinctions chapter of the Complete Guide for what to adjust by country, including target length -- one page under about eight to ten years of experience for the USA and Canada, two pages as the UK standard, two to three pages commonly accepted in Australia."
)

$r2 = Build-ResumeTemplate "resume-template-2-onecolumn.md" "Resume Template 2" "One-Column, Skills-Forward" "Resume Template 2" "Marmalio-Apply_Resume-Template-2-OneColumn.docx" @(
  "Use this version if you are changing careers, are a recent graduate with a thinner work history, or are applying for a role where a specific skill set matters more than job titles.",
  "Same generic-by-design structure as Template 1 -- no photo, no date of birth, city/region only, written-out dates -- see the Market Distinctions chapter of the Complete Guide for what to adjust by country.",
  "Tip: the Core Strengths group labels work best when drawn from the recurring themes in the specific job posting you are applying to (Prompt 01 in the Prompt Library), not from generic category names."
)

# ============================================================
# 3. Cover letter template (DOCX)
# ============================================================
$mdCL = Get-Content -Raw -Encoding UTF8 "$Root\templates\cover-letter-template.md"
$clLines = Get-FencedBlock $mdCL
$doc = New-WDoc
Add-Title $doc "Cover Letter Template" "Plain single-column business letter format"
Add-Body $doc "Match this letter's font and header style to your resume so the two documents read as one consistent package."
Add-Body $doc "Keep the finished letter to 250-350 words -- resist the urge to lengthen it. Length is a content decision made while drafting with Prompt 05 in the Prompt Library, not a formatting one."
Add-H2 $doc "Template"
Add-Body $doc "Replace every blue, italicized placeholder in brackets with your own real information. Do not leave a placeholder in the final document you submit."
Add-ResumeTemplateBody $doc $clLines
Add-HeaderFooter $doc "Cover Letter Template"
$clDocx = "$Release\Marmalio-Apply_Cover-Letter-Template.docx"
Save-Docx $doc $clDocx
$clQaPdf = "$QaDir\qa-coverletter.pdf"
Export-Pdf $doc $clQaPdf
Close-Doc $doc

Write-Output "TEMPLATES_DONE"

function Load-Body($relPath) {
  $md = Get-Content -Raw -Encoding UTF8 "$Root\$relPath"
  return Strip-Leading-H1 $md
}

# ============================================================
# 4. Start Here Guide (PDF)
# ============================================================
$doc = New-WDoc
Add-Title $doc "Marmalio Apply" "Start Here Guide -- English Master v1.0"
Add-Markdown $doc (Load-Body "00-start-here-guide.md")
Add-HeaderFooter $doc "Start Here Guide"
$startHerePdf = "$Release\Marmalio-Apply_Start-Here-Guide.pdf"
Export-Pdf $doc $startHerePdf
Close-Doc $doc
Write-Output "START_HERE_DONE"

# ============================================================
# 5. Complete Guide (PDF, with TOC)
# ============================================================
$doc = New-WDoc
Add-Title $doc "Marmalio Apply" "Complete Guide -- English Master v1.0"
Add-H1 $doc "Table of Contents"
Add-TOC $doc
Add-PageBreak $doc

Add-H1 $doc "Market Distinctions"
Add-Markdown $doc (Load-Body "00b-market-conventions.md")

Add-H1 $doc "Workflow Overview"
Add-Markdown $doc (Load-Body "01-workflow-overview.md")

Add-H1 $doc "LinkedIn Optimization Workflow"
Add-Markdown $doc (Load-Body "workflows\linkedin-optimization-workflow.md")

Add-H1 $doc "STAR Interview Preparation Workflow"
Add-Markdown $doc (Load-Body "workflows\star-interview-prep-workflow.md")

Add-H1 $doc "Salary Negotiation Workflow"
Add-Markdown $doc (Load-Body "workflows\salary-negotiation-workflow.md")

Add-H1 $doc "Career-Change Workflow"
Add-Markdown $doc (Load-Body "workflows\career-change-workflow.md")

Add-H1 $doc "Limitations and Safe Use"
Add-Markdown $doc (Load-Body "quality\limitations-and-safe-use.md")

Add-H1 $doc "Worked Examples"
Add-Body $doc "Three complete, fictional, start-to-finish walkthroughs of the system. None of these people are real; no fact in any of them was invented for a real candidate -- they exist only to demonstrate the workflow."
Add-H2 $doc "Mid-Career Professional"
Add-Markdown $doc (Load-Body "examples\example-mid-career-professional.md") @('^# ')
Add-H2 $doc "Career Changer"
Add-Markdown $doc (Load-Body "examples\example-career-changer.md") @('^# ')
Add-H2 $doc "Recent Graduate"
Add-Markdown $doc (Load-Body "examples\example-recent-graduate.md") @('^# ')

Add-H1 $doc "Before and After Examples"
Add-Markdown $doc (Load-Body "before-after\before-after-examples.md")

Add-HeaderFooter $doc "Complete Guide"
$completeGuidePdf = "$Release\Marmalio-Apply_Complete-Guide.pdf"
Export-Pdf $doc $completeGuidePdf
Close-Doc $doc
Write-Output "COMPLETE_GUIDE_DONE"

# ============================================================
# 6. Prompt Library (PDF, with TOC)
# ============================================================
$promptFiles = @(
  @{ File = "01-job-posting-analysis.md"; Title = "Prompt 01 -- Job Posting Analysis" },
  @{ File = "02-experience-inventory.md"; Title = "Prompt 02 -- Experience Inventory" },
  @{ File = "03-resume-bullet-rewrite.md"; Title = "Prompt 03 -- Resume Bullet Rewrite" },
  @{ File = "04-resume-tailoring.md"; Title = "Prompt 04 -- Resume Tailoring" },
  @{ File = "05-cover-letter.md"; Title = "Prompt 05 -- Cover Letter" },
  @{ File = "06-linkedin-headline-summary.md"; Title = "Prompt 06 -- LinkedIn Headline and Summary" },
  @{ File = "07-star-interview-prep.md"; Title = "Prompt 07 -- STAR Interview Preparation" },
  @{ File = "08-salary-negotiation.md"; Title = "Prompt 08 -- Salary Negotiation" },
  @{ File = "09-career-change-narrative.md"; Title = "Prompt 09 -- Career-Change Narrative" }
)

$doc = New-WDoc
Add-Title $doc "Marmalio Apply" "Prompt Library -- English Master v1.0"
Add-H1 $doc "Table of Contents"
Add-TOC $doc
Add-PageBreak $doc

Add-H1 $doc "Overview"
Add-Markdown $doc (Load-Body "prompts\00-prompt-library-overview.md")

foreach ($p in $promptFiles) {
  Add-H1 $doc $p.Title
  Add-Markdown $doc (Load-Body "prompts\$($p.File)")
}

Add-HeaderFooter $doc "Prompt Library"
$promptLibraryPdf = "$Release\Marmalio-Apply_Prompt-Library.pdf"
Export-Pdf $doc $promptLibraryPdf
Close-Doc $doc
Write-Output "PROMPT_LIBRARY_PDF_DONE"

# ============================================================
# 7. Truth, Quality & Safe-Use Checklist (PDF)
# ============================================================
$doc = New-WDoc
Add-Title $doc "Marmalio Apply" "Truth, Quality and Safe-Use Checklist -- English Master v1.0"
Add-H1 $doc "Truth and Quality Checklist"
Add-Markdown $doc (Load-Body "quality\truth-and-quality-checklist.md")
Add-H1 $doc "Limitations and Safe Use"
Add-Markdown $doc (Load-Body "quality\limitations-and-safe-use.md")
Add-HeaderFooter $doc "Truth, Quality and Safe-Use Checklist"
$checklistPdf = "$Release\Marmalio-Apply_Truth-Quality-Safe-Use-Checklist.pdf"
Export-Pdf $doc $checklistPdf
Close-Doc $doc
Write-Output "CHECKLIST_DONE"

$word.Quit()
