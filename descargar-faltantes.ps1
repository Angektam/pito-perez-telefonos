# Descargar imagenes faltantes
$ErrorActionPreference = 'Continue'

$imagesFolder = "src\images\phones"

$failed = @{
    'iphone-15-pro.jpg' = 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=800&h=800&fit=crop'
    'iphone-14.jpg' = 'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=800&h=800&fit=crop'
}

Write-Host "Descargando imagenes faltantes..." -ForegroundColor Cyan
Write-Host ""

foreach ($img in $failed.GetEnumerator()) {
    $filePath = Join-Path $imagesFolder $img.Key
    Write-Host "Intentando $($img.Key)..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $img.Value -OutFile $filePath -UseBasicParsing -TimeoutSec 30
        if (Test-Path $filePath) {
            $fileSize = (Get-Item $filePath).Length
            Write-Host "[OK] $($img.Key) descargado ($([math]::Round($fileSize/1KB, 2)) KB)" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] $($img.Key) no se descargo" -ForegroundColor Red
        }
    } catch {
        Write-Host "[ERROR] $($img.Key): $($_.Exception.Message)" -ForegroundColor Red
        # Intentar con URL alternativa sin parámetros
        try {
            $altUrl = $img.Value -replace '\?.*$', ''
            Write-Host "Intentando URL alternativa para $($img.Key)..." -ForegroundColor Yellow
            Invoke-WebRequest -Uri $altUrl -OutFile $filePath -UseBasicParsing -TimeoutSec 30
            if (Test-Path $filePath) {
                Write-Host "[OK] $($img.Key) descargado con URL alternativa" -ForegroundColor Green
            }
        } catch {
            Write-Host "[ERROR] Tambien fallo la URL alternativa" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Cyan

