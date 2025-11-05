# Guía de Despliegue en Vercel

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub/GitLab/Bitbucket
3. Proyecto configurado localmente

## 🚀 Pasos para Desplegar

### Opción 1: Desde la Web de Vercel

1. **Inicia sesión en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub

2. **Importa tu proyecto**
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente la configuración

3. **Configura el proyecto**
   - Framework Preset: "Other" o "Static Site"
   - Root Directory: `./` (raíz del proyecto)
   - Build Command: (dejar vacío - no se necesita)
   - Output Directory: `./` (raíz del proyecto)
   - Install Command: (dejar vacío)

4. **Despliega**
   - Haz clic en "Deploy"
   - Espera a que termine el proceso
   - ¡Listo! Tu sitio estará en línea

### Opción 2: Desde la Línea de Comandos

```bash
# Instala Vercel CLI globalmente
npm i -g vercel

# Inicia sesión
vercel login

# Despliega
vercel

# Para producción
vercel --prod
```

## 📁 Estructura del Proyecto

```
/
├── index.html          # Página principal
├── manifest.json       # Configuración PWA
├── package.json        # Metadatos del proyecto
├── vercel.json         # Configuración de Vercel
├── .gitignore          # Archivos ignorados por Git
│
├── public/             # Assets estáticos (iconos, imágenes)
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── screenshot-*.png
│
├── src/                # Código fuente
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── script.js
│   │   ├── security.js
│   │   ├── fallback-db.js
│   │   └── sw.js
│   └── images/
│
├── docs/               # Documentación
├── scripts/            # Scripts de desarrollo
└── config/             # Archivos de configuración
```

## ⚙️ Configuración de Vercel

El archivo `vercel.json` está configurado con:

- **Rewrites**: Todas las rutas redirigen a `index.html` (SPA)
- **Headers de Seguridad**: 
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
- **Cache**: Imágenes con cache de 1 año

## 🔧 Variables de Entorno (si las necesitas)

Si necesitas variables de entorno:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables necesarias
4. Redespliega el proyecto

## 📝 Notas Importantes

- **Iconos PWA**: Asegúrate de tener los iconos en la raíz del proyecto:
  - `icon-192x192.png`
  - `icon-512x512.png`

- **Screenshots**: Opcionales pero recomendados:
  - `screenshot-mobile.png`
  - `screenshot-desktop.png`

- **Service Worker**: El SW se registra automáticamente desde `src/js/sw.js`

## 🔄 Actualizaciones Futuras

Cada vez que hagas push a la rama principal (main), Vercel automáticamente:
1. Detectará los cambios
2. Reconstruirá el proyecto
3. Desplegará la nueva versión

## 🌐 Dominio Personalizado

Para agregar un dominio personalizado:

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio
4. Sigue las instrucciones de DNS

## 📞 Soporte

Si tienes problemas:
- [Documentación de Vercel](https://vercel.com/docs)
- [Comunidad de Vercel](https://github.com/vercel/vercel/discussions)

