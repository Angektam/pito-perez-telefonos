# Script para descargar imágenes oficiales de teléfonos Samsung y Apple
# Ejecutar en PowerShell: .\descargar-imagenes.ps1

Write-Host "Script de Descarga de Imagenes de Telefonos" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Crear carpeta si no existe
$imagesFolder = "src\images\phones"
if (-not (Test-Path $imagesFolder)) {
    New-Item -ItemType Directory -Path $imagesFolder -Force | Out-Null
    Write-Host "[OK] Carpeta creada: $imagesFolder" -ForegroundColor Green
}

Write-Host ""
Write-Host "[!] NOTA: Este script requiere que descargues las imagenes manualmente" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pasos a seguir:" -ForegroundColor Cyan
Write-Host "1. Visita los sitios oficiales:" -ForegroundColor White
Write-Host "   - Samsung: https://www.samsung.com/mx/smartphones/" -ForegroundColor White
Write-Host "   - Apple: https://www.apple.com/mx/iphone/" -ForegroundColor White
Write-Host ""
Write-Host "2. Para cada modelo, haz clic derecho en la imagen y 'Guardar imagen como...'" -ForegroundColor White
Write-Host ""
Write-Host "3. Guarda las imagenes en: $imagesFolder" -ForegroundColor White
Write-Host ""
Write-Host "Nombres de archivos requeridos:" -ForegroundColor Cyan
Write-Host ""

$files = @(
    "iphone-15-pro.jpg",
    "iphone-15.jpg",
    "iphone-14-pro.jpg",
    "iphone-14.jpg",
    "galaxy-s24.jpg",
    "galaxy-s23.jpg",
    "galaxy-a54.jpg",
    "galaxy-a34.jpg"
)

Write-Host "Apple iPhone:" -ForegroundColor Green
for ($i = 0; $i -lt 4; $i++) {
    $file = $files[$i]
    $fullPath = Join-Path $imagesFolder $file
    if (Test-Path $fullPath) {
        Write-Host "   [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "   [X] $file (FALTA)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Samsung Galaxy:" -ForegroundColor Blue
for ($i = 4; $i -lt 8; $i++) {
    $file = $files[$i]
    $fullPath = Join-Path $imagesFolder $file
    if (Test-Path $fullPath) {
        Write-Host "   [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "   [X] $file (FALTA)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Enlaces directos a las paginas de productos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Apple iPhone:" -ForegroundColor Green
Write-Host "  - iPhone 15 Pro: https://www.apple.com/mx/iphone-15-pro/" -ForegroundColor White
Write-Host "  - iPhone 15: https://www.apple.com/mx/iphone-15/" -ForegroundColor White
Write-Host "  - iPhone 14 Pro: https://www.apple.com/mx/iphone-14-pro/" -ForegroundColor White
Write-Host "  - iPhone 14: https://www.apple.com/mx/iphone-14/" -ForegroundColor White
Write-Host ""
Write-Host "Samsung Galaxy:" -ForegroundColor Blue
Write-Host "  - Galaxy S24: https://www.samsung.com/mx/smartphones/galaxy-s24/" -ForegroundColor White
Write-Host "  - Galaxy S23: https://www.samsung.com/mx/smartphones/galaxy-s23/" -ForegroundColor White
Write-Host "  - Galaxy A54: https://www.samsung.com/mx/smartphones/galaxy-a54/" -ForegroundColor White
Write-Host "  - Galaxy A34: https://www.samsung.com/mx/smartphones/galaxy-a34/" -ForegroundColor White
Write-Host ""

# Intentar abrir los enlaces en el navegador
$openLinks = Read-Host "Deseas abrir los enlaces en el navegador? (S/N)"
if ($openLinks -eq "S" -or $openLinks -eq "s") {
    Write-Host ""
    Write-Host "Abriendo enlaces..." -ForegroundColor Cyan
    
    # Apple
    Start-Process "https://www.apple.com/mx/iphone-15-pro/"
    Start-Sleep -Seconds 1
    Start-Process "https://www.apple.com/mx/iphone-15/"
    Start-Sleep -Seconds 1
    Start-Process "https://www.apple.com/mx/iphone-14-pro/"
    Start-Sleep -Seconds 1
    Start-Process "https://www.apple.com/mx/iphone-14/"
    Start-Sleep -Seconds 2
    
    # Samsung
    Start-Process "https://www.samsung.com/mx/smartphones/galaxy-s24/"
    Start-Sleep -Seconds 1
    Start-Process "https://www.samsung.com/mx/smartphones/galaxy-s23/"
    Start-Sleep -Seconds 1
    Start-Process "https://www.samsung.com/mx/smartphones/galaxy-a54/"
    Start-Sleep -Seconds 1
    Start-Process "https://www.samsung.com/mx/smartphones/galaxy-a34/"
    
    Write-Host "[OK] Enlaces abiertos en el navegador" -ForegroundColor Green
}

Write-Host ""
Write-Host "Consejo: Usa las herramientas de desarrollador del navegador (F12) para encontrar las URLs directas de las imagenes" -ForegroundColor Yellow
Write-Host ""

