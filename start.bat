@echo off
echo 🚀 Iniciando servidor para Pito Pérez - Guía de Teléfonos
echo =====================================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python no está instalado o no está en el PATH
    echo 💡 Instala Python desde: https://python.org
    pause
    exit /b 1
)

REM Iniciar servidor
echo ✅ Python encontrado, iniciando servidor...
python server.py

pause
