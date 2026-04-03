param(
  [Parameter(Mandatory = $true)]
  [string] $EnvFile
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $EnvFile)) {
  Write-Error "File not found: $EnvFile"
  exit 1
}
Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*DATABASE_URL\s*=\s*(.+)\s*$') {
    $env:DATABASE_URL = $Matches[1].Trim().Trim('"').Trim("'")
  }
}
if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL missing in $EnvFile"
  exit 1
}
Set-Location $PSScriptRoot\..
pnpm exec drizzle-kit migrate
