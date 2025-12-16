# 📥 Guía para Descargar Imágenes de Teléfonos

## Método 1: Script PowerShell (Recomendado para Windows)

1. **Abre PowerShell** en la carpeta del proyecto
2. **Ejecuta el script**:
   ```powershell
   .\descargar-imagenes.ps1
   ```
3. El script te mostrará:
   - Estado de las imágenes (cuáles faltan)
   - Enlaces directos a las páginas de productos
   - Opción para abrir los enlaces automáticamente

## Método 2: Descarga Manual (Más Confiable)

### Paso 1: Obtener URLs de Imágenes

#### Para Apple iPhone:

1. Visita: https://www.apple.com/mx/iphone-15-pro/
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **Network** (Red)
4. Recarga la página (F5)
5. Filtra por **Img** (imágenes)
6. Busca imágenes grandes del iPhone (generalmente tienen nombres como `hero`, `product`, etc.)
7. Haz clic derecho en la imagen → **Copy → Copy image address**
8. Copia la URL completa

#### Para Samsung Galaxy:

1. Visita: https://www.samsung.com/mx/smartphones/galaxy-s24/
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **Network** (Red)
4. Recarga la página (F5)
5. Filtra por **Img** (imágenes)
6. Busca imágenes del Galaxy (generalmente en `images.samsung.com`)
7. Haz clic derecho en la imagen → **Copy → Copy image address**
8. Copia la URL completa

### Paso 2: Descargar las Imágenes

#### Opción A: Usando el Navegador

1. Pega la URL en la barra de direcciones
2. Presiona Enter
3. Haz clic derecho en la imagen → **Guardar imagen como...**
4. Guarda en: `src/images/phones/`
5. Usa estos nombres exactos:
   - `iphone-15-pro.jpg`
   - `iphone-15.jpg`
   - `iphone-14-pro.jpg`
   - `iphone-14.jpg`
   - `galaxy-s24.jpg`
   - `galaxy-s23.jpg`
   - `galaxy-a54.jpg`
   - `galaxy-a34.jpg`

#### Opción B: Usando PowerShell

```powershell
# Ejemplo para descargar una imagen
$url = "URL_DE_LA_IMAGEN_AQUI"
$output = "src\images\phones\iphone-15-pro.jpg"
Invoke-WebRequest -Uri $url -OutFile $output
```

#### Opción C: Usando curl (Windows 10+)

```bash
curl -o "src/images/phones/iphone-15-pro.jpg" "URL_DE_LA_IMAGEN_AQUI"
```

### Paso 3: Actualizar el Código

Una vez descargadas las imágenes, actualiza `src/js/fallback-db.js`:

```javascript
const modelImages = {
    'iPhone 15 Pro': 'src/images/phones/iphone-15-pro.jpg',
    'iPhone 15': 'src/images/phones/iphone-15.jpg',
    // ... etc
};
```

## Método 3: Usar URLs Directas del CDN

Si encuentras las URLs directas de las imágenes en los CDN de Apple/Samsung, puedes usarlas directamente:

```javascript
const modelImages = {
    'iPhone 15 Pro': 'https://www.apple.com/v/iphone-15-pro/.../hero.jpg',
    'Galaxy S24': 'https://images.samsung.com/.../galaxy-s24.jpg',
    // ... etc
};
```

## 🔍 Cómo Encontrar URLs de Imágenes

### En Chrome/Edge:

1. Abre la página del producto
2. Presiona **F12** (Herramientas de Desarrollador)
3. Ve a la pestaña **Network**
4. Filtra por **Img**
5. Recarga la página (**F5**)
6. Busca imágenes grandes (mira el tamaño en la columna "Size")
7. Haz clic derecho → **Open in new tab**
8. Copia la URL de la nueva pestaña

### En Firefox:

1. Abre la página del producto
2. Presiona **F12** (Herramientas de Desarrollador)
3. Ve a la pestaña **Network**
4. Filtra por **Images**
5. Recarga la página (**F5**)
6. Busca imágenes grandes
7. Haz clic derecho → **Copy Image Location**

## ✅ Verificación

Después de descargar las imágenes:

1. Verifica que existan en `src/images/phones/`
2. Verifica que tengan los nombres correctos
3. Abre la aplicación y verifica que se muestren correctamente

## 📝 Notas Importantes

- ⚠️ Las imágenes están protegidas por derechos de autor
- ✅ Para uso educativo/personal generalmente está permitido
- ❌ Para uso comercial puede requerir permisos
- 🔒 Algunas imágenes pueden tener protección CORS
- 💡 Si las imágenes no cargan, verifica las rutas y permisos

