@echo off
echo 🚀 Configuración para GitHub - Pito Pérez Guía de Teléfonos
echo ============================================================
echo.

echo 📋 PASOS PARA MONTAR EN GITHUB:
echo.

echo 1️⃣ INSTALAR GIT:
echo    - Ve a: https://git-scm.com/download/win
echo    - Descarga e instala Git para Windows
echo    - Reinicia tu terminal después de instalar
echo.

echo 2️⃣ CREAR CUENTA EN GITHUB:
echo    - Ve a: https://github.com
echo    - Crea una cuenta gratuita si no tienes una
echo.

echo 3️⃣ CREAR REPOSITORIO:
echo    - En GitHub, haz clic en "New repository"
echo    - Nombre: pito-perez-telefonos
echo    - Descripción: Guía interactiva de smartphones
echo    - Marca "Public"
echo    - NO marques "Add README" (ya tenemos archivos)
echo    - Haz clic en "Create repository"
echo.

echo 4️⃣ EJECUTAR COMANDOS (después de instalar Git):
echo    git init
echo    git add .
echo    git commit -m "Primera versión de Pito Pérez Guía de Teléfonos"
echo    git branch -M main
echo    git remote add origin https://github.com/TU-USUARIO/pito-perez-telefonos.git
echo    git push -u origin main
echo.

echo 5️⃣ ACTIVAR GITHUB PAGES:
echo    - Ve a Settings de tu repositorio
echo    - Busca "Pages" en el menú izquierdo
echo    - En "Source" selecciona "GitHub Actions"
echo    - Tu sitio estará en: https://TU-USUARIO.github.io/pito-perez-telefonos
echo.

echo 📁 ARCHIVOS LISTOS PARA SUBIR:
dir /b *.html *.css *.js *.json *.md *.py *.bat *.toml

echo.
echo ✅ Todo está listo para subir a GitHub!
echo.

pause
