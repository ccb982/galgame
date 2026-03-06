@echo off
title Galgame Player

echo ========================================
echo    Galgame Player
echo ========================================
echo.

echo [1/3] Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java not found
    echo.
    echo Please install Java 17 or higher
    echo Download: https://www.oracle.com/java/technologies/downloads/
    echo.
    pause
    exit
)

echo [OK] Java detected
echo.

echo [2/3] Checking JAR file...
if not exist "galgame-backend-1.0.0.jar" (
    echo [ERROR] galgame-backend-1.0.0.jar not found
    echo.
    echo Please ensure the file is in current directory
    echo.
    pause
    exit
)

echo [OK] JAR file found
echo.

echo [3/3] Starting service...
echo [INFO] After service starts, visit http://localhost:8080
echo [INFO] Closing this window will stop the service
echo.
echo ========================================
echo.

java -jar galgame-backend-1.0.0.jar --spring.profiles.active=prod

echo.
echo ========================================
echo Service stopped
echo ========================================
echo.
pause