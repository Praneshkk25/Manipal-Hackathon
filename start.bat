@echo off
setlocal enabledelayedexpansion
title MedRipple AI Launcher

echo ============================================================
echo               MedRipple AI System Launcher
echo       Digital Twin for Medicine Shortage Cascades
echo      FastAPI (Port 8000)  ^|  React 19 Vite (Port 5173)
echo ============================================================
echo.

:: Detect root directory dynamically
set "SCRIPT_DIR=%~dp0"

if exist "%SCRIPT_DIR%backend\app\main.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%"
) else if exist "%SCRIPT_DIR%..\backend\app\main.py" (
    set "PROJECT_ROOT=%SCRIPT_DIR%..\"
) else (
    echo [ERROR] Could not locate backend\app\main.py!
    echo Please make sure this script is located in the project root.
    echo.
    pause
    exit /b 1
)

set "BACKEND_DIR=%PROJECT_ROOT%backend"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

echo [1/4] Checking System Environment...

:: Check Python prerequisite
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python was not found in your PATH!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%v in ('python --version 2^>^&1') do set "PY_VER=%%v"
    echo  [+] Python found: !PY_VER!
)

:: Check Node.js and npm prerequisite
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js was not found in your PATH!
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
    echo  [+] Node.js found: !NODE_VER!
)

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm was not found in your PATH!
    echo Please install Node.js and npm from https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%v in ('npm -v') do set "NPM_VER=%%v"
    echo  [+] npm found: v!NPM_VER!
)

echo.
echo [2/4] Checking Dependencies...

:: Check Python backend dependencies
python -c "import fastapi, uvicorn, networkx, numpy, pydantic" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [*] Installing missing Python backend dependencies...
    python -m pip install -r "%BACKEND_DIR%\requirements.txt"
    if %ERRORLEVEL% neq 0 (
        echo [WARNING] Dependency installation encountered issues. Will attempt to start anyway.
    ) else (
        echo  [+] Python dependencies verified.
    )
) else (
    echo  [+] Python backend dependencies verified.
)

:: Check Frontend dependencies
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [*] Frontend node_modules missing. Installing npm packages...
    pushd "%FRONTEND_DIR%"
    call npm install
    popd
    echo  [+] Frontend npm dependencies installed.
) else (
    echo  [+] Frontend node_modules verified.
)

echo.
echo [3/4] Starting Services in Dedicated Windows...

:: Launch FastAPI Backend Server on Port 8000
echo  [*] Starting FastAPI Backend on http://localhost:8000 ...
start "MedRipple AI - Backend (Port 8000)" /D "%BACKEND_DIR%" cmd /k "title MedRipple AI - Backend (Port 8000) & python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: Launch Vite Frontend Dev Server on Port 5173
echo  [*] Starting React 19 Frontend on http://localhost:5173 ...
start "MedRipple AI - Frontend (Port 5173)" /D "%FRONTEND_DIR%" cmd /k "title MedRipple AI - Frontend (Port 5173) & npm run dev"

echo.
echo [4/4] Opening Web Dashboard...
:: Wait 3 seconds for dev servers to bind ports
ping -n 4 127.0.0.1 >nul
start http://localhost:5173/

echo.
echo ============================================================
echo           MedRipple AI is running successfully!
echo ============================================================
echo   Frontend Dashboard:  http://localhost:5173/
echo   FastAPI Backend:     http://localhost:8000/
echo   Interactive Docs:    http://localhost:8000/docs
echo   System Health Check: http://localhost:8000/api/health
echo ============================================================
echo   NOTE: Keep the two service command windows open.
echo   To stop the application, simply close those two windows.
echo ============================================================
echo.

pause
