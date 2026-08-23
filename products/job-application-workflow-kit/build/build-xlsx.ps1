param()
$ErrorActionPreference = "Stop"
. "$PSScriptRoot\build-release.ps1" | Out-Null

function Parse-PromptFile($path) {
  $raw = Get-Content -Raw -Encoding UTF8 $path
  $result = @{}
  $sections = [regex]::Split($raw, '(?m)^## ')
  foreach ($sec in $sections) {
    if ($sec -match '^(Purpose|Required Inputs|The Prompt|Expected Output|Truth Check|Refinement Step)\r?\n') {
      $name = $matches[1]
      $body = $sec.Substring($matches[0].Length).Trim()
      if ($name -eq "The Prompt" -or $name -eq "Refinement Step") {
        $m = [regex]::Match($body, '(?s)```\r?\n(.*?)```')
        if ($m.Success) { $body = $m.Groups[1].Value.Trim() }
        else {
          # Refinement Step sometimes has intro text + fenced block; grab the fenced block, else keep body
          $m2 = [regex]::Match($body, '(?s)```\r?\n(.*?)```')
          if ($m2.Success) { $body = $m2.Groups[1].Value.Trim() }
        }
      }
      $result[$name] = $body
    }
  }
  return $result
}

$prompts = @(
  @{ Stage = "Step 1"; File = "01-job-posting-analysis.md"; Name = "Job Posting Analysis"; Market = "None -- job posting analysis works the same in every market." },
  @{ Stage = "Step 2"; File = "02-experience-inventory.md"; Name = "Experience Inventory"; Market = "None -- describe your background in your own words regardless of market." },
  @{ Stage = "Step 3"; File = "03-resume-bullet-rewrite.md"; Name = "Resume Bullet Rewrite"; Market = "None beyond standard resume/CV terminology (see Market Distinctions chapter)." },
  @{ Stage = "Step 4"; File = "04-resume-tailoring.md"; Name = "Resume Tailoring"; Market = "Choose the template and target length for your market (USA/Canada, UK, or Australia) -- see Market Distinctions chapter." },
  @{ Stage = "Step 5"; File = "05-cover-letter.md"; Name = "Cover Letter"; Market = "None beyond standard resume/CV terminology." },
  @{ Stage = "Step 6"; File = "06-linkedin-headline-summary.md"; Name = "LinkedIn Headline & Summary"; Market = "None -- LinkedIn conventions are broadly consistent across English-speaking markets." },
  @{ Stage = "Step 7"; File = "07-star-interview-prep.md"; Name = "STAR Interview Preparation"; Market = "None -- interview preparation works the same in every market." },
  @{ Stage = "Step 8"; File = "08-salary-negotiation.md"; Name = "Salary Negotiation"; Market = "Use your own currency and local salary-research sources (see Market Distinctions chapter for the list per market)." },
  @{ Stage = "Step 9"; File = "09-career-change-narrative.md"; Name = "Career-Change Narrative"; Market = "None beyond standard resume/CV terminology." }
)

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Add()
$ws = $wb.Worksheets.Item(1)
$ws.Name = "Prompt Library"

$headers = @("Workflow Stage","Prompt Name","Purpose","Required Inputs","Copy-Ready Prompt","Expected Output","Truth Check","Refinement Step","Market Notes")
for ($c = 1; $c -le $headers.Count; $c++) { $ws.Cells.Item(1, $c) = $headers[$c-1] }

$row = 2
foreach ($p in $prompts) {
  $data = Parse-PromptFile "$Root\prompts\$($p.File)"
  $ws.Cells.Item($row, 1) = $p.Stage
  $ws.Cells.Item($row, 2) = $p.Name
  $ws.Cells.Item($row, 3) = $data["Purpose"]
  $ws.Cells.Item($row, 4) = $data["Required Inputs"]
  $ws.Cells.Item($row, 5) = $data["The Prompt"]
  $ws.Cells.Item($row, 6) = $data["Expected Output"]
  $ws.Cells.Item($row, 7) = $data["Truth Check"]
  $ws.Cells.Item($row, 8) = $data["Refinement Step"]
  $ws.Cells.Item($row, 9) = $p.Market
  $row++
}
$lastRow = $row - 1

$headerRange = $ws.Range($ws.Cells.Item(1,1), $ws.Cells.Item(1, $headers.Count))
$headerRange.Font.Bold = $true
$headerRange.Interior.Color = $Navy
$headerRange.Font.Color = $White
$headerRange.RowHeight = 30
$headerRange.VerticalAlignment = -4108 # xlCenter
$headerRange.WrapText = $true

$fullRange = $ws.Range($ws.Cells.Item(1,1), $ws.Cells.Item($lastRow, $headers.Count))
$fullRange.WrapText = $true
$fullRange.VerticalAlignment = -4160 # xlTop
$fullRange.Borders.LineStyle = 1
$fullRange.Font.Name = $BodyFont
$fullRange.Font.Size = 10

$widths = @(11, 24, 34, 30, 62, 34, 34, 34, 34)
for ($c = 1; $c -le $headers.Count; $c++) { $ws.Columns.Item($c).ColumnWidth = $widths[$c-1] }

$dataRows = $ws.Range($ws.Cells.Item(2,1), $ws.Cells.Item($lastRow, $headers.Count))
$dataRows.Rows.AutoFit() | Out-Null

$ws.Application.ActiveWindow.SplitRow = 1
$ws.Application.ActiveWindow.FreezePanes = $true

$fullRange.AutoFilter() | Out-Null
$ws.Application.ActiveWindow.Zoom = 100

$xlsxPath = "$Release\Marmalio-Apply_Prompt-Library.xlsx"
$wb.SaveAs($xlsxPath, 51) # xlOpenXMLWorkbook
$wb.Close($false)
$excel.Quit()
$word.Quit()

Write-Output "XLSX_DONE: $(Test-Path $xlsxPath)"
