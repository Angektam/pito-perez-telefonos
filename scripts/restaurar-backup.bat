@echo off
echo 🔄 Restaurando copia de seguridad de Pito Pérez
echo ================================================
echo.

echo ⚠️  ADVERTENCIA: Esto sobrescribirá los archivos actuales
echo.
set /p confirm="¿Estás seguro de que quieres restaurar? (s/n): "
if /i not "%confirm%"=="s" (
    echo ❌ Restauración cancelada
    pause
    exit /b 1
)

echo.
echo 📁 Restaurando archivos...

REM Restaurar archivos principales
copy backup-pito-perez\*.html . /Y
copy backup-pito-perez\*.css . /Y
copy backup-pito-perez\*.js . /Y
copy backup-pito-perez\*.md . /Y
copy backup-pito-perez\*.yml . /Y
copy backup-pito-perez\*.toml . /Y
copy backup-pito-perez\*.py . /Y
copy backup-pito-perez\*.bat . /Y

REM Restaurar directorio .github
xcopy backup-pito-perez\.github .github\ /E /I /Y

echo.
echo ✅ Archivos restaurados exitosamente
echo.
echo 📤 ¿Quieres subir los cambios a GitHub? (s/n)
set /p push="Respuesta: "
if /i "%push%"=="s" (
    echo.
    echo 🚀 Subiendo a GitHub...
    git add .
    git commit -m "Restaurar desde copia de seguridad"
    git push origin main
    echo.
    echo ✅ Cambios subidos a GitHub
)

echo.
echo 🎉 ¡Restauración completada!
echo 🌐 Tu sitio estará en: https://Angektam.github.io/pito-perez-telefonos
echo.
pause
