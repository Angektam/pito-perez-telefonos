@echo off
echo 🚀 Crear Repositorio en GitHub - Pito Pérez Guía de Teléfonos
echo ============================================================
echo.

echo 📋 PASOS PARA CREAR EL REPOSITORIO:
echo.

echo 1️⃣ ABRIR GITHUB:
echo    - Ve a: https://github.com
echo    - Haz login con tu cuenta Angektam
echo.

echo 2️⃣ CREAR NUEVO REPOSITORIO:
echo    - Haz clic en el botón "+" (esquina superior derecha)
echo    - Selecciona "New repository"
echo.

echo 3️⃣ CONFIGURAR REPOSITORIO:
echo    - Repository name: pito-perez-telefonos
echo    - Description: Guía interactiva de smartphones
echo    - Marca "Public" ✅
echo    - NO marques "Add README" ❌
echo    - NO marques "Add .gitignore" ❌
echo    - NO marques "Choose a license" ❌
echo.

echo 4️⃣ CREAR REPOSITORIO:
echo    - Haz clic en "Create repository"
echo.

echo 5️⃣ DESPUÉS DE CREAR, EJECUTA ESTOS COMANDOS:
echo    git remote add origin https://github.com/Angektam/pito-perez-telefonos.git
echo    git push -u origin main
echo.

echo 6️⃣ ACTIVAR GITHUB PAGES:
echo    - Ve a Settings de tu repositorio
echo    - Busca "Pages" en el menú izquierdo
echo    - En "Source" selecciona "GitHub Actions"
echo.

echo 🌍 TU SITIO ESTARÁ EN:
echo    https://Angektam.github.io/pito-perez-telefonos
echo.

echo 📁 ARCHIVOS LISTOS PARA SUBIR:
dir /b *.html *.css *.js *.md *.json *.yml *.toml *.py *.bat

echo.
echo ✅ ¡Sigue los pasos y tu aplicación estará en internet!
echo.

pause
