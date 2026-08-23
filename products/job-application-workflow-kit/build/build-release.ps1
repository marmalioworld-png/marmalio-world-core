param()
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

# $Root is the product directory (parent of this build/ folder) so this
# script works regardless of where the repo is cloned. Callers that need a
# different locale's release (see localization/localization-manifest.md)
# should override $Release after dot-sourcing this file, before generating
# any document.
$Root = Split-Path -Parent $PSScriptRoot
$Release = "$Root\release\en-v1.0"
$QaDir = "$env:TEMP\marmalio-apply-qa"
New-Item -ItemType Directory -Force -Path $Release | Out-Null
New-Item -ItemType Directory -Force -Path $QaDir | Out-Null

function Ole([int]$r,[int]$g,[int]$b) {
  return [System.Drawing.ColorTranslator]::ToOle([System.Drawing.Color]::FromArgb($r,$g,$b))
}
$Navy      = Ole 17 38 71
$SlateGray = Ole 90 98 110
$LightGray = Ole 222 227 235
$White     = Ole 255 255 255
$Auto      = -16777216  # wdColorAutomatic

$BodyFont = "Calibri"
$MonoFont = "Consolas"
$Dash = [string][char]0x2014
$ProductHeader = "Marmalio Apply $Dash Global Job Application Workflow Kit"

# Built-in style IDs (locale-independent -- Word UI may be non-English, so
# string style names like "Normal" can fail; numeric WdBuiltinStyle IDs always work)
$StyleNormal      = -1
$StyleHeading1    = -2
$StyleHeading2    = -3
$StyleHeading3    = -4
$StyleTitle       = -63
$StyleSubtitle    = -75
$StyleListBullet  = -68
$StyleListNumber  = -71
$StyleIntenseQuote = -182
$StyleQuote       = -181

# ---------------- Word ----------------
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

function New-WDoc {
  $doc = $word.Documents.Add()
  $doc.PageSetup.LeftMargin = 62; $doc.PageSetup.RightMargin = 62
  $doc.PageSetup.TopMargin = 62; $doc.PageSetup.BottomMargin = 62
  $sel = $word.Selection
  $sel.Style = $doc.Styles($StyleNormal)
  $sel.Font.Name = $BodyFont
  $sel.Font.Size = 11
  return $doc
}

function Sel { return $word.Selection }

function Set-Style($doc, $name) {
  (Sel).Style = $doc.Styles($name)
}

function Reset-RunFormat {
  # Deliberately does NOT touch Font.Color -- callers that want a specific
  # heading/title color set it right before Type-Rich, and Type-Rich must
  # not clobber that. Callers that want default black call Reset-Color too.
  $s = Sel
  $s.Font.Bold = 0; $s.Font.Italic = 0
  $s.Font.Name = $BodyFont; $s.Font.Size = 11
}

function Reset-Color {
  (Sel).Font.Color = $Auto
}

# types one paragraph of text handling **bold** and `code` inline spans
function Type-Rich([string]$text) {
  $s = Sel
  Reset-RunFormat
  if ([string]::IsNullOrEmpty($text)) { return }
  $parts = [regex]::Split($text, '(\*\*[^\*]+\*\*|`[^`]+`)')
  foreach ($p in $parts) {
    if ($p -eq "") { continue }
    if ($p -match '^\*\*(.+)\*\*$') {
      $s.Font.Bold = 1
      $s.TypeText($matches[1])
      $s.Font.Bold = 0
    } elseif ($p -match '^`(.+)`$') {
      $s.Font.Name = $MonoFont; $s.Font.Size = 10
      $s.TypeText($matches[1])
      $s.Font.Name = $BodyFont; $s.Font.Size = 11
    } else {
      $s.TypeText($p)
    }
  }
}

function Add-Title($doc, $title, $subtitle) {
  Set-Style $doc $StyleTitle
  (Sel).Font.Color = $Navy
  Type-Rich $title
  (Sel).TypeParagraph()
  if ($subtitle) {
    Set-Style $doc $StyleSubtitle
    (Sel).Font.Color = $SlateGray
    Type-Rich $subtitle
    (Sel).TypeParagraph()
  }
  Set-Style $doc $StyleNormal
  Reset-RunFormat; Reset-Color
}

function Add-H1($doc, $text) {
  Set-Style $doc $StyleHeading1
  (Sel).Font.Color = $Navy
  Type-Rich ($text -replace '^#+\s*','')
  (Sel).TypeParagraph()
  Set-Style $doc $StyleNormal
}

function Add-H2($doc, $text) {
  Set-Style $doc $StyleHeading2
  (Sel).Font.Color = $Navy
  Type-Rich ($text -replace '^#+\s*','')
  (Sel).TypeParagraph()
  Set-Style $doc $StyleNormal
}

function Add-H3($doc, $text) {
  Set-Style $doc $StyleHeading3
  (Sel).Font.Color = $SlateGray
  Type-Rich ($text -replace '^#+\s*','')
  (Sel).TypeParagraph()
  Set-Style $doc $StyleNormal
}

function Add-Body($doc, $text) {
  Set-Style $doc $StyleNormal
  Reset-RunFormat; Reset-Color
  Type-Rich $text
  (Sel).TypeParagraph()
}

$BulletChar = [string][char]0x2022

# Draws a literal bullet + hanging indent on the current paragraph before
# typing. ListFormat.ApplyBulletDefault() is unreliable through PowerShell's
# late-bound COM interop in this environment (property resolves to nothing
# even though the same call works fine from VBA), so this sidesteps it
# entirely -- visually identical result in the rendered PDF/DOCX.
function Start-BulletParagraph {
  $s = Sel
  $s.ParagraphFormat.LeftIndent = 18
  $s.ParagraphFormat.FirstLineIndent = -18
  $s.TypeText("$BulletChar`t")
}

function Add-Bullet($doc, $text) {
  Set-Style $doc $StyleNormal
  Reset-RunFormat; Reset-Color
  Start-BulletParagraph
  Type-Rich $text
  (Sel).TypeParagraph()
  $s = Sel
  $s.ParagraphFormat.LeftIndent = 0
  $s.ParagraphFormat.FirstLineIndent = 0
}

function Add-Number($doc, $text, [int]$n) {
  Set-Style $doc $StyleNormal
  Reset-RunFormat; Reset-Color
  $s = Sel
  $s.ParagraphFormat.LeftIndent = 18
  $s.ParagraphFormat.FirstLineIndent = -18
  $s.TypeText("$n.`t")
  Type-Rich $text
  (Sel).TypeParagraph()
  $s = Sel
  $s.ParagraphFormat.LeftIndent = 0
  $s.ParagraphFormat.FirstLineIndent = 0
}

function Add-Quote($doc, $text) {
  Set-Style $doc $StyleIntenseQuote
  Reset-Color
  Type-Rich $text
  (Sel).TypeParagraph()
  Set-Style $doc $StyleNormal
}

# shaded, monospace "boxed" block for full prompt text -- built as a
# borderless 1-column table with cell shading, since table-cell shading
# renders reliably via COM (paragraph shading does not).
function Add-CodeBlock($doc, [string[]]$lines) {
  $s = Sel
  $startRange = $s.Range
  $tbl = $doc.Tables.Add($startRange, 1, 1)
  $tbl.Borders.Enable = 0
  $cell = $tbl.Cell(1, 1)
  $cell.Shading.Texture = 1000
  $cell.Shading.ForegroundPatternColor = $LightGray
  $cell.TopPadding = 8; $cell.BottomPadding = 8
  $cell.LeftPadding = 10; $cell.RightPadding = 10

  $cellSel = $word.Selection
  $cellSel.SetRange($cell.Range.Start, $cell.Range.Start)
  $cellSel.Font.Name = $MonoFont
  $cellSel.Font.Size = 9.5
  $cellSel.Font.Color = $Auto
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $cellSel.TypeText($lines[$i])
    if ($i -lt $lines.Count - 1) {
      $cellSel.TypeParagraph()
      $cellSel.Font.Name = $MonoFont
      $cellSel.Font.Size = 9.5
      $cellSel.Font.Color = $Auto
    }
  }
  $tbl.AutoFitBehavior(1) # wdAutoFitWindow

  # move selection to end of document, ensure normal formatting resumes
  $endRange = $doc.Content
  $endRange.Collapse(0)
  $word.Selection.SetRange($endRange.Start, $endRange.End)
  Set-Style $doc $StyleNormal
  Reset-RunFormat; Reset-Color
}

function Add-Table($doc, [string[]]$header, [System.Collections.ArrayList]$rows) {
  $s = Sel
  $startRange = $s.Range
  $rowCount = $rows.Count + 1
  $colCount = $header.Count
  $tbl = $doc.Tables.Add($startRange, $rowCount, $colCount)
  $tbl.Borders.Enable = 1
  $tbl.Range.Font.Name = $BodyFont
  $tbl.Range.Font.Size = 9.5
  for ($c = 1; $c -le $colCount; $c++) {
    $cell = $tbl.Cell(1, $c)
    $cell.Range.Text = $header[$c-1]
    $cell.Range.Font.Bold = 1
    $cell.Shading.BackgroundPatternColor = $Navy
    $cell.Range.Font.Color = $White
  }
  for ($r = 0; $r -lt $rows.Count; $r++) {
    $rowVals = $rows[$r]
    for ($c = 1; $c -le $colCount; $c++) {
      $tbl.Cell($r+2, $c).Range.Text = [string]$rowVals[$c-1]
    }
  }
  $tbl.AutoFitBehavior(1) # wdAutoFitWindow
  # move selection to end of document, ensure paragraph after table
  $endRange = $doc.Content
  $endRange.Collapse(0)
  $word.Selection.SetRange($endRange.Start, $endRange.End)
  Set-Style $doc $StyleNormal
  Reset-RunFormat
}

function Add-PageBreak($doc) {
  (Sel).InsertBreak(7) | Out-Null # wdPageBreak = 7
}

function Add-TOC($doc) {
  $rng = (Sel).Range
  $doc.TablesOfContents.Add($rng, $true, 1, 3) | Out-Null
  (Sel).EndKey(6) | Out-Null
  (Sel).TypeParagraph()
}

function Add-HeaderFooter($doc, $footerLabel) {
  foreach ($section in $doc.Sections) {
    $hdr = $section.Headers.Item(1) # wdHeaderFooterPrimary
    $hdr.Range.Text = ""
    $hdr.Range.Font.Name = $BodyFont
    $hdr.Range.Font.Size = 9
    $hdr.Range.Font.Color = $SlateGray
    $hdr.Range.Text = $ProductHeader
    $hdr.Range.ParagraphFormat.Alignment = 0

    $ftr = $section.Footers.Item(1)
    $ftr.Range.Text = "$footerLabel  |  Page "
    $ftr.Range.Font.Name = $BodyFont
    $ftr.Range.Font.Size = 9
    $ftr.Range.Font.Color = $SlateGray
    $ftr.Range.ParagraphFormat.Alignment = 1 # center

    $insertPoint = $ftr.Range
    $insertPoint.Collapse(0) # wdCollapseEnd
    $ftr.Range.Fields.Add($insertPoint, -1, "PAGE", $true) | Out-Null

    $insertPoint2 = $ftr.Range
    $insertPoint2.Collapse(0)
    $insertPoint2.InsertAfter(" of ")

    $insertPoint3 = $ftr.Range
    $insertPoint3.Collapse(0)
    $ftr.Range.Fields.Add($insertPoint3, -1, "NUMPAGES", $true) | Out-Null

    $ftr.Range.Font.Name = $BodyFont
    $ftr.Range.Font.Size = 9
    $ftr.Range.Font.Color = $SlateGray
    $ftr.Range.ParagraphFormat.Alignment = 1
  }
  $doc.Fields.Update() | Out-Null
}

function Export-Pdf($doc, $path) {
  # Generic Fields.Update() does not reliably rescan heading structure for a
  # TOC field created earlier via TablesOfContents.Add() in this headless COM
  # session -- it can leave the TOC showing only the "Table of Contents"
  # heading itself. Explicitly updating each TOC object forces a full rescan.
  foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
  $doc.Fields.Update() | Out-Null
  $doc.Repaginate() | Out-Null
  foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
  $doc.Repaginate() | Out-Null
  $doc.ExportAsFixedFormat($path, 17, $false, 0, 0, 1, 1, 0, $true, $true, 1, $true, $true, $false)
}

function Save-Docx($doc, $path) {
  $doc.SaveAs2($path, 16) # wdFormatXMLDocument = 16 (.docx)
}

function Close-Doc($doc) {
  $doc.Close(0)
}

Write-Output "SCRIPT_LOADED_OK"

function Close-Enable { }

# ---------------- Markdown -> Word content parser ----------------

function Clean-CrossRefs([string]$text) {
  $map = @(
    @('`00b-market-conventions\.md`', 'the Market Distinctions chapter of this guide'),
    @('00b-market-conventions\.md', 'the Market Distinctions chapter'),
    @('`01-workflow-overview\.md`', 'the Workflow Overview chapter'),
    @('01-workflow-overview\.md', 'the Workflow Overview chapter'),
    @('`templates/resume-template-1-onecolumn\.md`', 'Resume Template 1'),
    @('templates/resume-template-1-onecolumn\.md', 'Resume Template 1'),
    @('`templates/resume-template-2-onecolumn\.md`', 'Resume Template 2'),
    @('templates/resume-template-2-onecolumn\.md', 'Resume Template 2'),
    @('`templates/cover-letter-template\.md`', 'the Cover Letter Template'),
    @('templates/cover-letter-template\.md', 'the Cover Letter Template'),
    @('`quality/truth-and-quality-checklist\.md`', 'the Truth, Quality & Safe-Use Checklist'),
    @('quality/truth-and-quality-checklist\.md', 'the Truth, Quality & Safe-Use Checklist'),
    @('`truth-and-quality-checklist\.md`', 'the Truth, Quality & Safe-Use Checklist'),
    @('truth-and-quality-checklist\.md', 'the Truth, Quality & Safe-Use Checklist'),
    @('`quality/limitations-and-safe-use\.md`', 'the Limitations & Safe Use chapter'),
    @('quality/limitations-and-safe-use\.md', 'the Limitations & Safe Use chapter'),
    @('`limitations-and-safe-use\.md`', 'the Limitations & Safe Use chapter'),
    @('limitations-and-safe-use\.md', 'the Limitations & Safe Use chapter'),
    @('using one of the templates in `templates/`', 'using one of the resume templates'),
    @('`templates/`', 'the resume templates'),
    @('\(see `templates/`\)', ''),
    @('`prompts/`', 'the prompt library'),
    @('prompts/(?!\d)', 'the prompt library'),
    @('`marketing/shopify-product-page\.md`', 'the product page where you purchased this kit'),
    @('the Shopify product page at time of purchase \(see the product page where you purchased this kit and `marketing/shopify-faq\.md`\)', 'the product page where you purchased this kit'),
    @('`prompts/01-job-posting-analysis\.md`', 'Prompt 01, Job Posting Analysis, in the Prompt Library'),
    @('`prompts/02-experience-inventory\.md`', 'Prompt 02, Experience Inventory, in the Prompt Library'),
    @('`prompts/03-resume-bullet-rewrite\.md`', 'Prompt 03, Resume Bullet Rewrite, in the Prompt Library'),
    @('`prompts/04-resume-tailoring\.md`', 'Prompt 04, Resume Tailoring, in the Prompt Library'),
    @('`prompts/05-cover-letter\.md`', 'Prompt 05, Cover Letter, in the Prompt Library'),
    @('`prompts/06-linkedin-headline-summary\.md`', 'Prompt 06, LinkedIn Headline & Summary, in the Prompt Library'),
    @('`prompts/07-star-interview-prep\.md`', 'Prompt 07, STAR Interview Preparation, in the Prompt Library'),
    @('`prompts/08-salary-negotiation\.md`', 'Prompt 08, Salary Negotiation, in the Prompt Library'),
    @('`prompts/09-career-change-narrative\.md`', 'Prompt 09, Career-Change Narrative, in the Prompt Library'),
    @('`workflows/career-change-workflow\.md`', 'the Career-Change Workflow chapter'),
    @('`workflows/linkedin-optimization-workflow\.md`', 'the LinkedIn Optimization Workflow chapter'),
    @('`workflows/star-interview-prep-workflow\.md`', 'the STAR Interview Preparation Workflow chapter'),
    @('`workflows/salary-negotiation-workflow\.md`', 'the Salary Negotiation Workflow chapter'),
    @('`before-after/before-after-examples\.md`', 'the Before & After Examples chapter'),
    @('`examples/`', 'the worked examples'),
    @('\(see `localization/localization-manifest\.md`[^)]*\)', ''),
    @('see `product-identity\.md`', 'see the product packaging materials'),
    @('README\.md', 'the package overview'),
    @('CLAUDE\.md', 'internal project guidance'),
    @('`', '')
  )
  foreach ($pair in $map) {
    $text = [regex]::Replace($text, $pair[0], $pair[1])
  }
  # Safety net: any replacement above that itself starts with "the" can
  # collide with a preceding "The "/"the " already in the source text (e.g.
  # "The `x.md` file" -> "The the Y file"). Collapse that duplication
  # generically, preserving whichever case started it, rather than chasing
  # every individual case by hand.
  $text = [regex]::Replace($text, '\bThe\s+the\b', 'The')
  $text = [regex]::Replace($text, '\bthe\s+the\b', 'the')
  return $text
}

# Parses markdown body text (no leading "# Title" line) into Word content.
# Handles: ## / ### headings, - bullets, 1. numbered lists, > blockquotes,
# ```fenced code blocks```, | table | rows |, **bold**, `inline code`, and
# plain paragraphs. Skips lines matched by $SkipPatterns (regex array).
function Add-Markdown($doc, [string]$mdText, [string[]]$SkipPatterns = @()) {
  $mdText = Clean-CrossRefs $mdText
  $lines = $mdText -split "`r?`n"
  $i = 0
  $numberCounter = 0
  while ($i -lt $lines.Count) {
    $line = $lines[$i]

    $skip = $false
    foreach ($pat in $SkipPatterns) { if ($line -match $pat) { $skip = $true; break } }
    if ($skip) { $i++; continue }

    if ($line.Trim() -eq "") { $i++; continue }
    if ($line.Trim() -eq "---") { $i++; continue }
    if ($line -notmatch '^\d+\. ') { $numberCounter = 0 }

    if ($line -match '^```') {
      $codeLines = New-Object System.Collections.ArrayList
      $i++
      while ($i -lt $lines.Count -and $lines[$i] -notmatch '^```') {
        $codeLines.Add($lines[$i]) | Out-Null
        $i++
      }
      $i++ # skip closing ```
      Add-CodeBlock $doc $codeLines.ToArray()
      continue
    }

    if ($line -match '^\|.*\|\s*$') {
      $tableLines = New-Object System.Collections.ArrayList
      while ($i -lt $lines.Count -and $lines[$i] -match '^\|.*\|\s*$') {
        $tableLines.Add($lines[$i]) | Out-Null
        $i++
      }
      $header = ($tableLines[0].Trim().Trim('|') -split '\|') | ForEach-Object { $_.Trim() }
      $rows = [System.Collections.ArrayList]@()
      for ($r = 2; $r -lt $tableLines.Count; $r++) {
        $cells = ($tableLines[$r].Trim().Trim('|') -split '\|') | ForEach-Object { $_.Trim() }
        $rows.Add($cells) | Out-Null
      }
      Add-Table $doc $header $rows
      continue
    }

    if ($line -match '^### (.+)') { Add-H3 $doc $matches[1]; $i++; continue }
    if ($line -match '^## (.+)')  { Add-H2 $doc $matches[1]; $i++; continue }
    if ($line -match '^# (.+)')   { Add-H1 $doc $matches[1]; $i++; continue }
    if ($line -match '^- (.+)')   { Add-Bullet $doc $matches[1]; $i++; continue }
    if ($line -match '^\d+\. (.+)') { $numberCounter++; Add-Number $doc $matches[1] $numberCounter; $i++; continue }
    if ($line -match '^> (.+)')   { Add-Quote $doc $matches[1]; $i++; continue }

    Add-Body $doc $line
    $i++
  }
}

function Strip-Line([string]$text, [string]$pattern) {
  return ($text -split "`r?`n" | Where-Object { $_ -notmatch $pattern }) -join "`n"
}

Write-Output "PARSER_LOADED_OK"

# ---------------- Resume/cover-letter template body renderer ----------------
# Real editable prose (not a shaded code box) with bracketed [placeholders]
# colored and italicized so the customer can spot exactly what to replace.

$PlaceholderColor = Ole 30 80 160

function Type-TemplateLine([string]$text) {
  $s = Sel
  if ($text -eq "") { return }
  $parts = [regex]::Split($text, '(\[[^\]]*\])')
  foreach ($p in $parts) {
    if ($p -eq "") { continue }
    if ($p -match '^\[.*\]$') {
      $s.Font.Color = $PlaceholderColor
      $s.Font.Italic = 1
      $s.TypeText($p)
      $s.Font.Italic = 0
      $s.Font.Color = $Auto
    } else {
      $s.TypeText($p)
    }
  }
}

function Add-ResumeTemplateBody($doc, [string[]]$lines) {
  foreach ($ln in $lines) {
    if ($ln.Trim() -eq "") {
      Set-Style $doc $StyleNormal
      $s = Sel
      $s.Font.Size = 6
      $s.TypeParagraph()
      $s.Font.Size = 10.5
      continue
    }
    if ($ln -match '^\s*.\s*(.+)' -and $ln.TrimStart().StartsWith([string][char]0x2022)) {
      $bulletText = $ln.TrimStart().Substring(1).Trim()
      Set-Style $doc $StyleNormal
      $s = Sel; $s.Font.Name = $BodyFont; $s.Font.Size = 10.5; $s.Font.Bold = 0; $s.Font.Italic = 0; $s.Font.Color = $Auto
      Start-BulletParagraph
      Type-TemplateLine $bulletText
      $s.TypeParagraph()
      $s.ParagraphFormat.LeftIndent = 0
      $s.ParagraphFormat.FirstLineIndent = 0
      continue
    }
    $trimmed = $ln.Trim()
    if ($trimmed -cmatch '^[A-Z0-9 &()\-]+$' -and $trimmed.Length -gt 1) {
      Set-Style $doc $StyleNormal
      $s = Sel
      $s.Font.Name = $BodyFont; $s.Font.Size = 11; $s.Font.Bold = 1; $s.Font.Color = $Navy
      $s.ParagraphFormat.SpaceBefore = 10
      $s.ParagraphFormat.SpaceAfter = 3
      $s.TypeText($trimmed)
      $s.TypeParagraph()
      $s.ParagraphFormat.SpaceBefore = 0
      $s.Font.Bold = 0; $s.Font.Color = $Auto
      continue
    }
    Set-Style $doc $StyleNormal
    $s = Sel; $s.Font.Name = $BodyFont; $s.Font.Size = 10.5; $s.Font.Bold = 0; $s.Font.Italic = 0; $s.Font.Color = $Auto
    Type-TemplateLine $ln
    $s.TypeParagraph()
  }
}

function Get-FencedBlock([string]$mdText) {
  $m = [regex]::Match($mdText, '(?s)```\r?\n(.*?)```')
  if (-not $m.Success) { throw "No fenced code block found" }
  return ($m.Groups[1].Value -split "`r?`n")
}

Write-Output "TEMPLATE_RENDERER_LOADED_OK"
