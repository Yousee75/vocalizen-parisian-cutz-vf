@echo off
echo RESTRUCTURATION EN COURS...
cd ..
powershell -ExecutionPolicy Bypass -File automation\force-restructure.ps1
pause