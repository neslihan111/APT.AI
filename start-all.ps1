# ============================================================
# APT-AI Full Stack Startup Script
# ============================================================
# Backend ve Frontend'i aynı anda başlatır
# Kullanım: Proje kökünden çalıştırın
#   .\start-all.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  APT-AI Full Stack Başlatılıyor..." -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Backend'i yeni bir PowerShell penceresinde başlat
Write-Host "[1/2] Backend başlatılıyor..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass", "-NoExit", "-Command", "Set-Location '$projectRoot'; .\start-backend.ps1" -WindowStyle Normal

# Kısa bekleme
Start-Sleep -Seconds 3

# Frontend'i yeni bir PowerShell penceresinde başlat
Write-Host "[2/2] Frontend başlatılıyor..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass", "-NoExit", "-Command", "Set-Location '$projectRoot'; .\start-frontend.ps1" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Her iki sunucu da başlatıldı!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Sunucuları durdurmak için açılan terminal" -ForegroundColor Gray
Write-Host "  pencerelerinde Ctrl+C tuşlarına basın." -ForegroundColor Gray
Write-Host ""
