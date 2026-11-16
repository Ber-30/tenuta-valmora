@echo off
title Tenuta Valmora - Server Locale con Stripe API
echo ========================================================
echo Avvio del server locale per Tenuta Valmora con Stripe...
echo Porta: 3000
echo Indirizzo: http://localhost:3000
echo ========================================================
echo.
start http://localhost:3000
python "%~dp0server.py"
pause
