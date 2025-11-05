# 📡 Documentación de la API

## 🔗 Endpoints Utilizados

### Fake Store API
- **URL**: `https://fakestoreapi.com/products`
- **Método**: GET
- **Límite**: 20 productos
- **Propósito**: Obtener datos de productos para mapear a teléfonos

## 🗄️ Base de Datos Local

### Estructura de Datos
```javascript
{
  id: number,
  name: string,
  brand: string,
  price: number, // En MXN
  specs: string,
  image: string,
  os: string,
  condition: string,
  camera: string,
  battery: number,
  screen: string,
  storage: string,
  ram: string,
  fullSpecs: object
}
```

### Marcas Soportadas
- **Apple**: iPhone 15 Pro, iPhone 15, iPhone 14 Pro, iPhone 14
- **Samsung**: Galaxy S24, Galaxy S23, Galaxy A54, Galaxy A34
- **Google**: Pixel 8 Pro, Pixel 8, Pixel 7 Pro, Pixel 7
- **Xiaomi**: Xiaomi 14, Xiaomi 13, Redmi Note 13, Redmi 12
- **OnePlus**: OnePlus 12, OnePlus 11, OnePlus 10T, OnePlus Nord

## 🔄 Flujo de Datos

1. **Carga Inicial**: Se intenta cargar desde Fake Store API
2. **Fallback**: Si falla, se usa la base de datos local
3. **Mapeo**: Los datos se transforman al formato de teléfonos
4. **Imágenes**: Se asignan imágenes reales de Unsplash
5. **Precios**: Se convierten a pesos mexicanos (MXN)

## 🛡️ Seguridad

### Validación de Datos
- Sanitización de inputs
- Validación de tipos
- Escape de HTML
- Rate limiting

### Headers de Seguridad
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📊 Precios del Mercado (MXN)

### Gama Premium ($20,000+)
- iPhone 15 Pro: $24,999
- Galaxy S24: $22,999
- Pixel 8 Pro: $21,999

### Gama Media-Alta ($15,000-$19,999)
- iPhone 15: $19,999
- Galaxy S23: $17,999
- Pixel 8: $15,999

### Gama Media ($10,000-$14,999)
- Galaxy A54: $13,999
- Pixel 7 Pro: $13,499
- Xiaomi 13: $12,999

### Gama Económica ($6,000-$9,999)
- Redmi Note 13: $8,999
- Redmi 12: $6,999

## 🔧 Configuración

### Variables de Entorno
```javascript
const FAKE_STORE_API_URL = 'https://fakestoreapi.com/products?limit=20';
const EXCHANGE_RATE = 18.5; // USD a MXN
```

### Fallback Database
- 20 teléfonos con especificaciones reales
- Imágenes verificadas de Unsplash
- Precios actualizados del mercado mexicano
- Especificaciones técnicas completas
