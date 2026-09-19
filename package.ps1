# Build a distributable zip of the extension (also valid for Chrome Web Store upload).
# Keep this file ASCII-only: PowerShell 5.1 reads BOM-less UTF-8 as Shift-JIS and breaks parsing.
$version = (Get-Content "$PSScriptRoot/manifest.json" -Raw -Encoding UTF8 | ConvertFrom-Json).version
$dist = Join-Path $PSScriptRoot "dist"
New-Item -ItemType Directory -Force $dist | Out-Null
$zip = Join-Path $dist "translate-in-split-window-$version.zip"
if (Test-Path $zip) { Remove-Item $zip -Confirm:$false }
$files = "manifest.json", "background.js", "content.js" | ForEach-Object { Join-Path $PSScriptRoot $_ }
Compress-Archive -Path $files -DestinationPath $zip
Write-Output $zip
