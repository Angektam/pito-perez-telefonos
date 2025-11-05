@echo off
echo 🔧 Configuración de Git para GitHub
echo ====================================
echo.

echo 🔍 Verificando instalación de Git...
echo.

REM Verificar rutas comunes de Git
if exist "C:\Program Files\Git\bin\git.exe" (
    echo ✅ Git encontrado en: C:\Program Files\Git\bin\git.exe
    set "GIT_PATH=C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    echo ✅ Git encontrado en: C:\Program Files (x86)\Git\bin\git.exe
    set "GIT_PATH=C:\Program Files (x86)\Git\bin\git.exe"
) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin\git.exe" (
    echo ✅ Git encontrado en: C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin\git.exe
    set "GIT_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin\git.exe"
) else (
    echo ❌ Git no encontrado en las rutas comunes
    echo.
    echo 📥 DESCARGAR GIT:
    echo 1. Ve a: https://git-scm.com/download/win
    echo 2. Descarga "Git for Windows"
    echo 3. Instala con configuración por defecto
    echo 4. Reinicia tu terminal
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Configurando Git...
echo.

REM Configurar Git
"%GIT_PATH%" config --global user.name "Tu Nombre"
"%GIT_PATH%" config --global user.email "tu-email@ejemplo.com"

echo ✅ Git configurado correctamente
echo.

echo 📋 PRÓXIMOS PASOS:
echo.
echo 1️⃣ CREAR REPOSITORIO EN GITHUB:
echo    - Ve a: https://github.com
echo    - Haz clic en "New repository"
echo    - Nombre: pito-perez-telefonos
echo    - Descripción: Guía interactiva de smartphones
echo    - Marca "Public"
echo    - NO marques "Add README"
echo    - Haz clic en "Create repository"
echo.

echo 2️⃣ EJECUTAR COMANDOS DE GIT:
echo    "%GIT_PATH%" init
echo    "%GIT_PATH%" add .
echo    "%GIT_PATH%" commit -m "Primera versión de Pito Pérez Guía de Teléfonos"
echo    "%GIT_PATH%" branch -M main
echo    "%GIT_PATH%" remote add origin https://github.com/TU-USUARIO/pito-perez-telefonos.git
echo    "%GIT_PATH%" push -u origin main
echo.

echo 3️⃣ ACTIVAR GITHUB PAGES:
echo    - Ve a Settings de tu repositorio
echo    - Busca "Pages" en el menú izquierdo
echo    - En "Source" selecciona "GitHub Actions"
echo.

echo 🌍 Tu sitio estará en: https://TU-USUARIO.github.io/pito-perez-telefonos
echo.

pause
