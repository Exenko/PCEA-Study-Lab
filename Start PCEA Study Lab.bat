@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is needed to save progress as files.
  echo Install it from https://nodejs.org/ and run this again.
  echo.
  echo Or open index.html directly to use the app with progress saved in your browser.
  pause
  exit /b 1
)
node server.js
pause
