@echo off
chcp 65001 >nul
title Galgame 播放器

REM 检查 Java 是否安装
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Java 环境
    echo.
    echo 请先安装 Java 17 或更高版本
    echo 下载地址：https://www.oracle.com/java/technologies/downloads/
    echo.
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

REM 检查后端 JAR 文件是否存在
if not exist "galgame-backend-1.0.0.jar" (
    echo [错误] 未找到后端 JAR 文件
    echo 请确保 galgame-backend-1.0.0.jar 在当前目录
    echo.
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

REM 启动后端服务
java -jar galgame-backend-1.0.0.jar --spring.profiles.active=prod