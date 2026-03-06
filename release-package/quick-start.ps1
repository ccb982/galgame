# Galgame Player - Quick Start

Write-Host "Starting Galgame Player..." -ForegroundColor Cyan
Write-Host ""

try {
    java -jar galgame-backend-1.0.0.jar --spring.profiles.active=prod
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
}