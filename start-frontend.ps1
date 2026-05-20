# ============================================================
# APT-AI Frontend Startup Script
# ============================================================
# Kullanım: Proje kökünden çalıştırın
#   .\start-frontend.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot
$frontendDir = Join-Path $projectRoot "frontend"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APT-AI Frontend Başlatılıyor..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Frontend dizini kontrolü
if (-not (Test-Path $frontendDir)) {
    Write-Host "HATA: Frontend dizini bulunamadı: $frontendDir" -ForegroundColor Red
    exit 1
}

# package.json kontrolü
$packageJson = Join-Path $frontendDir "package.json"
if (-not (Test-Path $packageJson)) {
    Write-Host "HATA: package.json bulunamadı: $packageJson" -ForegroundColor Red
    Write-Host "Frontend düzgün kurulmamış olabilir." -ForegroundColor Yellow
    exit 1
}

# node_modules kontrolü
$nodeModules = Join-Path $frontendDir "node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "[!] node_modules bulunamadı. npm install çalıştırılıyor..." -ForegroundColor Yellow
    Set-Location $frontendDir
    npm install
    Write-Host ""
}

Write-Host "[✓] Frontend dizini: $frontendDir" -ForegroundColor Green
Write-Host "[✓] package.json bulundu" -ForegroundColor Green
Write-Host ""

# Çalışma dizinini frontend'e değiştir
Set-Location $frontendDir

Write-Host "[i] Sunucu başlatılıyor: http://localhost:5173" -ForegroundColor Cyan
Write-Host "[i] Durdurmak için: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Vite dev server başlat
npm run dev
