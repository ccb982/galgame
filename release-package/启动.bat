@echo off
chcp 65001 >nul
title Galgame 播放器

echo ========================================
echo    Galgame 播放器 - 便携版
echo ========================================
echo.

echo [1/3] 检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Java 环境
    echo.
    echo 请先安装 Java 17 或更高版本
    echo 下载地址：https://www.oracle.com/java/technologies/downloads/
    echo.
    pause
    exit
)

echo [OK] Java 环境检测通过
echo.

echo [2/3] 检查 JAR 文件...
if not exist "galgame-backend-1.0.0.jar" (
    echo [错误] 未找到 galgame-backend-1.0.0.jar
    echo.
    echo 请确保文件在当前目录
    echo.
    pause
    exit
)

echo [OK] JAR 文件检测通过
echo.

echo [3/3] 正在启动服务...
echo [提示] 服务启动后，请访问 http://localhost:8080
echo [提示] 关闭此窗口将停止服务
echo.
echo ========================================
echo.

java -jar galgame-backend-1.0.0.jar --spring.profiles.active=prod

echo.
echo ========================================
echo 服务已停止
echo ========================================
echo.
pause