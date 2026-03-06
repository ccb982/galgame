@echo off
chcp 65001 >nul
title Galgame 播放器

echo 正在启动 Galgame 播放器...
echo.

java -jar galgame-backend-1.0.0.jar --spring.profiles.active=prod

if %errorlevel% neq 0 (
    echo.
    echo 启动失败，错误代码：%errorlevel%
    echo.
    pause
)