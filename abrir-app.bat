@echo off
REM ==========================================================================
REM  USwap - arranca la app en el navegador (Windows)
REM  Doble clic en este archivo. No hace falta instalar nada.
REM ==========================================================================
cd /d "%~dp0"

echo Arrancando USwap en http://localhost:8000 ...
start "USwap - servidor local" /min cmd /c "py serve.py 8000"
timeout /t 2 >nul
start "" http://localhost:8000

echo.
echo Si el navegador no se abre solo, entra en: http://localhost:8000
echo Para parar el servidor, cierra la ventana minimizada "USwap - servidor local".
echo.
pause
