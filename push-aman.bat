@echo off
REM Jalankan push-aman.ps1 tanpa terblokir Execution Policy Windows
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0push-aman.ps1" %*
echo.
pause
