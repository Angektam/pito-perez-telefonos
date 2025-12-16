# Instrucciones para Obtener Imágenes Oficiales de Teléfonos

## 📱 Samsung Galaxy

Para obtener imágenes oficiales de los teléfonos Samsung:

1. **Visita el sitio oficial**: https://www.samsung.com/mx/smartphones/
2. **Selecciona el modelo específico**:
   - Galaxy S24: https://www.samsung.com/mx/smartphones/galaxy-s24/
   - Galaxy S23: https://www.samsung.com/mx/smartphones/galaxy-s23/
   - Galaxy A54: https://www.samsung.com/mx/smartphones/galaxy-a54/
   - Galaxy A34: https://www.samsung.com/mx/smartphones/galaxy-a34/
3. **Obtén la imagen**:
   - Opción A: Haz clic derecho sobre la imagen del teléfono → "Copiar dirección de imagen"
   - Opción B: Descarga la imagen → "Guardar imagen como..."
4. **Si descargaste la imagen**:
   - Crea la carpeta: `src/images/phones/` (si no existe)
   - Guarda con el nombre: `galaxy-s24.jpg`, `galaxy-s23.jpg`, etc.
5. **Actualiza el código** en `src/js/fallback-db.js` (ver sección "Cómo Actualizar")

### Modelos Samsung en el sistema:
- ✅ Galaxy S24
- ✅ Galaxy S23
- ✅ Galaxy A54
- ✅ Galaxy A34

## 🍎 Apple iPhone

Para obtener imágenes oficiales de los iPhones:

1. **Visita el sitio oficial**: https://www.apple.com/mx/iphone/
2. **Selecciona el modelo específico**:
   - iPhone 15 Pro: https://www.apple.com/mx/iphone-15-pro/
   - iPhone 15: https://www.apple.com/mx/iphone-15/
   - iPhone 14 Pro: https://www.apple.com/mx/iphone-14-pro/
   - iPhone 14: https://www.apple.com/mx/iphone-14/
3. **Obtén la imagen**:
   - Opción A: Haz clic derecho sobre la imagen del iPhone → "Copiar dirección de imagen"
   - Opción B: Descarga la imagen → "Guardar imagen como..."
4. **Si descargaste la imagen**:
   - Crea la carpeta: `src/images/phones/` (si no existe)
   - Guarda con el nombre: `iphone-15-pro.jpg`, `iphone-15.jpg`, etc.
5. **Actualiza el código** en `src/js/fallback-db.js` (ver sección "Cómo Actualizar")

### Modelos iPhone en el sistema:
- ✅ iPhone 15 Pro
- ✅ iPhone 15
- ✅ iPhone 14 Pro
- ✅ iPhone 14

## 🔧 Cómo Actualizar las URLs

### Método 1: Usar URLs oficiales del CDN (Recomendado)

1. Abre el archivo `src/js/fallback-db.js`
2. Busca el objeto `modelImages` (línea ~6)
3. Reemplaza la URL de Unsplash con la URL oficial que copiaste

**Ejemplo:**
```javascript
const modelImages = {
    'iPhone 15 Pro': 'https://www.apple.com/v/iphone-15-pro/.../hero.jpg', // URL oficial
    'Galaxy S24': 'https://images.samsung.com/.../galaxy-s24.jpg', // URL oficial
    // ... etc
};
```

### Método 2: Usar imágenes locales descargadas

1. Descarga las imágenes desde los sitios oficiales
2. Colócalas en `src/images/phones/` con estos nombres:
   - `iphone-15-pro.jpg`
   - `iphone-15.jpg`
   - `iphone-14-pro.jpg`
   - `iphone-14.jpg`
   - `galaxy-s24.jpg`
   - `galaxy-s23.jpg`
   - `galaxy-a54.jpg`
   - `galaxy-a34.jpg`

3. Actualiza `src/js/fallback-db.js`:
```javascript
const modelImages = {
    'iPhone 15 Pro': 'src/images/phones/iphone-15-pro.jpg',
    'Galaxy S24': 'src/images/phones/galaxy-s24.jpg',
    // ... etc
};
```

## 📋 Nombres de Archivos Sugeridos

Para que funcionen automáticamente, usa estos nombres exactos:

**Apple:**
- `iphone-15-pro.jpg`
- `iphone-15.jpg`
- `iphone-14-pro.jpg`
- `iphone-14.jpg`

**Samsung:**
- `galaxy-s24.jpg`
- `galaxy-s23.jpg`
- `galaxy-a54.jpg`
- `galaxy-a34.jpg`

## ⚖️ Nota Legal

⚠️ **Importante**: Asegúrate de revisar los términos de uso de Samsung y Apple antes de utilizar sus imágenes. 

- Para uso personal/educativo: Generalmente permitido
- Para uso comercial: Puede requerir permisos específicos
- Contacta a los departamentos de prensa de Samsung/Apple para uso comercial

## ✅ Verificación

Después de actualizar las imágenes:
1. Abre la aplicación en el navegador
2. Navega a la sección de búsqueda
3. Verifica que cada modelo muestre su imagen oficial correcta
4. Si una imagen no carga, verifica:
   - La URL es correcta
   - El archivo existe en la ruta especificada
   - El nombre del archivo coincide exactamente

