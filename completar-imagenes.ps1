$imagesFolder = "src\images\phones"

# Copiar imagenes existentes como placeholder para las faltantes
if (Test-Path "$imagesFolder\iphone-15.jpg") {
    Copy-Item "$imagesFolder\iphone-15.jpg" "$imagesFolder\iphone-15-pro.jpg" -Force
    Write-Host "[OK] iphone-15-pro.jpg creado" -ForegroundColor Green
}

if (Test-Path "$imagesFolder\iphone-14-pro.jpg") {
    Copy-Item "$imagesFolder\iphone-14-pro.jpg" "$imagesFolder\iphone-14.jpg" -Force
    Write-Host "[OK] iphone-14.jpg creado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verificando imagenes..." -ForegroundColor Cyan
Get-ChildItem $imagesFolder | ForEach-Object {
    Write-Host "[OK] $($_.Name)" -ForegroundColor Green
}

