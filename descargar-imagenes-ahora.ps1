# Script para descargar imagenes de telefonos
$ErrorActionPreference = 'Continue'

$imagesFolder = "src\images\phones"
if (-not (Test-Path $imagesFolder)) {
    New-Item -ItemType Directory -Path $imagesFolder -Force | Out-Null
}

$images = @{
    'iphone-15-pro.jpg' = 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=800&h=800&fit=crop&q=90'
    'iphone-15.jpg' = 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop&q=90'
    'iphone-14-pro.jpg' = 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=800&h=800&fit=crop&q=90'
    'iphone-14.jpg' = 'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=800&h=800&fit=crop&q=90'
    'galaxy-s24.jpg' = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop&q=90'
    'galaxy-s23.jpg' = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&q=90'
    'galaxy-a54.jpg' = 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop&q=90'
    'galaxy-a34.jpg' = 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&h=800&fit=crop&q=90'
}

Write-Host "Descargando imagenes..." -ForegroundColor Cyan
Write-Host ""

foreach ($img in $images.GetEnumerator()) {
    $filePath = Join-Path $imagesFolder $img.Key
    Write-Host "Descargando $($img.Key)..." -ForegroundColor Yellow
    
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
    }
}

Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Cyan

