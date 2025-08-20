# Configuration
$ProjectPath = "C:\Users\Yossi Hayoun\Downloads\Vocalizen-parisian-cutz"
$env:CLAUDE_AUTO_APPROVE = "true"
$env:CLAUDE_NO_CONFIRM = "true"

Write-Host "=== DÉMARRAGE RESTRUCTURATION ===" -ForegroundColor Green

# Backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item "$ProjectPath\index.html" "$ProjectPath\index-backup-$timestamp.html"
Write-Host "Backup créé!" -ForegroundColor Yellow

# Lire le prompt
$prompt = Get-Content "$ProjectPath\automation\restructure-prompt.txt" -Raw

# Lancer Claude Code
Set-Location $ProjectPath
claude-code --yes --force --auto-approve --no-confirm --batch --config automation\claude-config.json $prompt

Write-Host "=== TERMINÉ ===" -ForegroundColor Green