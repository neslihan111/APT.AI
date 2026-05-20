# ============================================================
# APT-AI Backend Startup Script
# ============================================================
# Kullanım: Proje kökünden çalıştırın
#   .\start-backend.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot
$backendDir = Join-Path $projectRoot "backend"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APT-AI Backend Başlatılıyor..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend dizini kontrolü
if (-not (Test-Path $backendDir)) {
    Write-Host "HATA: Backend dizini bulunamadı: $backendDir" -ForegroundColor Red
    exit 1
}

# Virtual environment kontrolü
$venvPath = Join-Path $backendDir ".venv\Scripts\Activate.ps1"
if (-not (Test-Path $venvPath)) {
    Write-Host "HATA: Virtual environment bulunamadı!" -ForegroundColor Red
    Write-Host "Önce oluşturun: python -m venv backend\.venv" -ForegroundColor Yellow
    exit 1
}

Write-Host "[✓] Backend dizini: $backendDir" -ForegroundColor Green
Write-Host "[✓] Virtual environment bulundu" -ForegroundColor Green
Write-Host ""

# Çalışma dizinini backend'e değiştir
Set-Location $backendDir

# Virtual environment'ı aktif et
& $venvPath

Write-Host "[i] Sunucu başlatılıyor: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "[i] API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "[i] Durdurmak için: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Uvicorn başlat
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
