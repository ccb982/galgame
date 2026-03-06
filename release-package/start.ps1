# Galgame Player - PowerShell Launcher

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Galgame Player" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Java
Write-Host "[1/3] Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host "[OK] Java detected" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Java not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Java 17 or higher" -ForegroundColor Yellow
    Write-Host "Download: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}
Write-Host ""

# Check JAR file
Write-Host "[2/3] Checking JAR file..." -ForegroundColor Yellow
if (-not (Test-Path "galgame-backend-1.0.0.jar")) {
    Write-Host "[ERROR] galgame-backend-1.0.0.jar not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure the file is in current directory" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}
Write-Host "[OK] JAR file found" -ForegroundColor Green
Write-Host ""

# Start service
Write-Host "[3/3] Starting service..." -ForegroundColor Yellow
Write-Host "[INFO] After service starts, visit http://localhost:8080" -ForegroundColor Cyan
Write-Host "[INFO] Closing this window will stop the service" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

java -jar galgame-backend-1.0.0.jar --spring.profiles.active=prod

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Service stopped" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"