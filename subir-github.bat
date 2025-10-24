@echo off
echo 🚀 Subiendo Pito Pérez Guía de Teléfonos a GitHub
echo ================================================
echo.

echo 📋 INSTRUCCIONES PASO A PASO:
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

echo 2️⃣ CONFIGURAR GIT (ejecuta estos comandos uno por uno):
echo    git config --global user.name "Tu Nombre"
echo    git config --global user.email "tu-email@ejemplo.com"
echo.

echo 3️⃣ INICIALIZAR Y SUBIR CÓDIGO:
echo    git init
echo    git add .
echo    git commit -m "Primera versión de Pito Pérez Guía de Teléfonos"
echo    git branch -M main
echo    git remote add origin https://github.com/TU-USUARIO/pito-perez-telefonos.git
echo    git push -u origin main
echo.

echo 4️⃣ ACTIVAR GITHUB PAGES:
echo    - Ve a Settings de tu repositorio
echo    - Busca "Pages" en el menú izquierdo
echo    - En "Source" selecciona "GitHub Actions"
echo.

echo 🌍 Tu sitio estará en: https://TU-USUARIO.github.io/pito-perez-telefonos
echo.

echo 📁 ARCHIVOS LISTOS PARA SUBIR:
dir /b *.html *.css *.js *.md *.json *.yml *.toml *.py *.bat

echo.
echo ✅ Todo está listo!
echo.

pause
