# Script de PowerShell para ayudar a tomar capturas de pantalla del sistema
# Ejecuta este script para abrir el sistema en el navegador y guiarte paso a paso

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Guía de Capturas de Pantalla" -ForegroundColor Cyan
Write-Host "Sistema Pito Pérez" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = "http://localhost:8000"
if (Test-Path "index.html") {
    Write-Host "Abriendo el sistema en el navegador..." -ForegroundColor Green
    Start-Process "http://localhost:8000"
} else {
    Write-Host "No se encontró index.html. Asegúrate de estar en el directorio correcto." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Lista de capturas a tomar:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Pantalla principal con menú y gráficos" -ForegroundColor White
Write-Host "2. Botón de autenticación en header" -ForegroundColor White
Write-Host "3. Modal de autenticación con pestañas" -ForegroundColor White
Write-Host "4. Formulario de registro con validación" -ForegroundColor White
Write-Host "5. Header después de iniciar sesión" -ForegroundColor White
Write-Host "6. Modal de inicio de sesión" -ForegroundColor White
Write-Host "7. Menú principal completo" -ForegroundColor White
Write-Host "8. Panel General con gráficos" -ForegroundColor White
Write-Host "9. Búsqueda Avanzada con filtros" -ForegroundColor White
Write-Host "10. Resultados de búsqueda" -ForegroundColor White
Write-Host "11. Modo Fácil - Pregunta presupuesto" -ForegroundColor White
Write-Host "12. Modo Fácil - Pregunta uso" -ForegroundColor White
Write-Host "13. Resultados Modo Fácil" -ForegroundColor White
Write-Host "14. Tabla comparativa" -ForegroundColor White
Write-Host "15. Botón flotante comparación" -ForegroundColor White
Write-Host "16. Mi Cuenta - Vista general" -ForegroundColor White
Write-Host "17. Pestaña Favoritos" -ForegroundColor White
Write-Host "18. Pestaña Historial" -ForegroundColor White
Write-Host "19. Búsqueda en tiempo real" -ForegroundColor White
Write-Host "20. Filtros aplicados" -ForegroundColor White
Write-Host "21. Botón favoritos en tarjeta" -ForegroundColor White
Write-Host "22. Botón comparar" -ForegroundColor White
Write-Host "23. Modal detalles con comentarios" -ForegroundColor White
Write-Host "24. Lista de comentarios" -ForegroundColor White
Write-Host "25. Botón chatbot" -ForegroundColor White
Write-Host "26. Ventana chatbot abierta" -ForegroundColor White
Write-Host ""
Write-Host "Usa Windows + Shift + S para tomar capturas" -ForegroundColor Green
Write-Host "O presiona PrtScn para captura completa" -ForegroundColor Green
Write-Host ""
Write-Host "Guarda las capturas como: captura-01.jpg, captura-02.jpg, etc." -ForegroundColor Yellow
Write-Host ""

# Crear carpeta para capturas si no existe
if (-not (Test-Path "capturas-manual")) {
    New-Item -ItemType Directory -Path "capturas-manual" | Out-Null
    Write-Host "Carpeta 'capturas-manual' creada." -ForegroundColor Green
}

Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

