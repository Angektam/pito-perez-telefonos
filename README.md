# 📱 Pito Pérez - Guía Interactiva de Smartphones

Una aplicación web progresiva (PWA) para buscar, comparar y obtener recomendaciones personalizadas de smartphones.

## 🚀 Características

- **Panel General**: Gráficos interactivos del mercado de smartphones
- **Búsqueda Avanzada**: Filtros detallados para encontrar el teléfono perfecto
- **Modo Fácil**: Recomendaciones personalizadas con preguntas simples
- **Comparación**: Compara múltiples teléfonos lado a lado
- **Comentarios**: Sistema de opiniones y calificaciones
- **PWA**: Instalable como aplicación móvil

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
│   │   ├── api.js          # Cliente API
│   │   ├── script.js       # Lógica principal
│   │   ├── security.js     # Medidas de seguridad
│   │   ├── fallback-db.js  # Base de datos de respaldo
│   │   └── sw.js           # Service Worker (PWA)
│   └── images/
│
├── docs/               # Documentación
│   ├── README.md
│   ├── API-DOCS.md
│   ├── SECURITY.md
│   ├── VERCEL-DEPLOY.md
│   └── ...
│
├── scripts/            # Scripts de desarrollo
│   ├── server.py       # Servidor de desarrollo
│   ├── start.bat       # Iniciar servidor local
│   └── ...
│
└── config/             # Archivos de configuración
    ├── dev-config.json
    └── ...
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Tailwind CSS** - Framework de utilidades CSS
- **Chart.js** - Gráficos interactivos
- **Service Worker** - Funcionalidad PWA

## 📦 Instalación y Desarrollo Local

### Requisitos

- Python 3.x (para servidor de desarrollo)
- Navegador moderno con soporte para ES6+

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Angektam/pito-perez-telefonos.git
   cd pito-perez-telefonos
   ```

2. **Iniciar servidor local**
   ```bash
   # Opción 1: Usando Python
   python scripts/server.py
   
   # Opción 2: Usando el script de Windows
   scripts\start.bat
   
   # Opción 3: Servidor HTTP simple
   python -m http.server 8000
   ```

3. **Abrir en el navegador**
   - Navega a `http://localhost:8000`

## 🚀 Despliegue en Vercel

Consulta la guía completa en [docs/VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md)

### Despliegue Rápido

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión**
   ```bash
   vercel login
   ```

3. **Desplegar**
   ```bash
   vercel --prod
   ```

O simplemente conecta tu repositorio en [vercel.com](https://vercel.com) y Vercel detectará automáticamente la configuración.

## 📚 Documentación

- [API Documentation](docs/API-DOCS.md) - Documentación de la API
- [Security](docs/SECURITY.md) - Medidas de seguridad implementadas
- [Vercel Deploy](docs/VERCEL-DEPLOY.md) - Guía de despliegue en Vercel
- [Project Structure](docs/project-structure.md) - Estructura detallada del proyecto

## 🔒 Seguridad

Este proyecto implementa múltiples medidas de seguridad:
- Headers de seguridad HTTP
- Sanitización de inputs
- Protección contra XSS
- Service Worker seguro

Ver [docs/SECURITY.md](docs/SECURITY.md) para más detalles.

## 📝 Licencia

MIT License - Ver el archivo LICENSE para más detalles

## 👤 Autor

**Pito Pérez**

- GitHub: [@Angektam](https://github.com/Angektam)

## 🙏 Agradecimientos

- Datos proporcionados por API externa
- Iconos y recursos de diseño propios

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

