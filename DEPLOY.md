# 🚀 Guía de Despliegue - Pito Pérez Guía de Teléfonos

## 📋 Opciones de Despliegue

### 1. 🏠 **Servidor Local (Desarrollo)**

#### Opción A: Python (Recomendado)
```bash
# Instalar Python si no lo tienes
# Descargar desde: https://python.org

# Ejecutar servidor
python server.py
# O simplemente doble clic en start.bat (Windows)
```

#### Opción B: Node.js
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server -p 8000 -c-1
```

#### Opción C: PHP
```bash
# Si tienes PHP instalado
php -S localhost:8000
```

### 2. 🌐 **Despliegue en Internet**

#### A. **GitHub Pages (Gratis)**
1. Sube tu código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona "GitHub Actions" como fuente
4. El workflow automático desplegará tu sitio

**URL resultante**: `https://tu-usuario.github.io/nombre-repositorio`

#### B. **Netlify (Gratis)**
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra tu carpeta del proyecto
3. ¡Listo! Tu sitio estará en línea

**URL resultante**: `https://nombre-aleatorio.netlify.app`

#### C. **Vercel (Gratis)**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Despliega automáticamente

#### D. **Firebase Hosting (Gratis)**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar proyecto
firebase init hosting

# Desplegar
firebase deploy
```

### 3. 🔧 **Configuración Avanzada**

#### Variables de Entorno
```javascript
// Para configurar URLs de API en producción
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-api.com' 
  : 'http://localhost:3000';
```

#### Headers de Seguridad
Los archivos ya incluyen headers de seguridad:
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### 4. 📱 **Optimizaciones para Producción**

#### Minificación
```bash
# Instalar herramientas de minificación
npm install -g html-minifier cssnano-cli uglify-js

# Minificar archivos
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

#### Compresión
```bash
# Comprimir archivos estáticos
gzip -k *.html *.css *.js
```

### 5. 🚀 **Comandos Rápidos**

#### Iniciar servidor local
```bash
# Windows
start.bat

# Linux/Mac
python3 server.py
```

#### Verificar funcionamiento
```bash
# Abrir en navegador
http://localhost:8000
```

### 6. 🔍 **Troubleshooting**

#### Puerto ocupado
```bash
# Cambiar puerto en server.py
PORT = 8080  # En lugar de 8000
```

#### CORS Issues
```javascript
// Agregar headers CORS si es necesario
self.send_header('Access-Control-Allow-Origin', '*')
```

#### HTTPS en local
```bash
# Usar mkcert para certificados locales
mkcert localhost
python server.py --ssl
```

## 📞 **Soporte**

Si tienes problemas:
1. Verifica que todos los archivos estén en la misma carpeta
2. Asegúrate de que el puerto no esté ocupado
3. Revisa la consola del navegador para errores
4. Verifica que Python esté instalado correctamente

## 🎯 **Recomendación**

Para desarrollo: **Servidor local con Python**
Para producción: **Netlify o Vercel** (más fácil)
Para control total: **GitHub Pages con Actions**
