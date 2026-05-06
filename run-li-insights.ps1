# LinkedIn Engagement Insights - Terminal Activation Script
# Run this in Antigravity IDE: .\run-li-insights.ps1

param(
    [switch]$Install,
    [switch]$Build
)

$ErrorActionPreference = "Stop"

if ($Install) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
    Write-Host "Dependencies installed!" -ForegroundColor Green
    exit 0
}

if ($Build) {
    Write-Host "Building application..." -ForegroundColor Cyan
    npm run build
    Write-Host "Build complete!" -ForegroundColor Green
    exit 0
}

Write-Host "Starting LinkedIn Engagement Insights..." -ForegroundColor Cyan
Write-Host ""

$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmPath) {
    Write-Host "ERROR: npm not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

$nodeModulesPath = Join-Path $PSScriptRoot "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting Vite dev server..." -ForegroundColor Green
npm run dev