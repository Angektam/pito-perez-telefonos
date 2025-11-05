# 📁 Estructura del Proyecto Pito Pérez

## 🎯 Organización de Archivos

```
pito-perez-telefonos/
├── 📄 index.html              # Página principal
├── 📄 manifest.json           # Configuración PWA
├── 📄 package.json            # Configuración del proyecto
├── 📄 server.py               # Servidor local Python
├── 📄 start.bat               # Script de inicio Windows
├── 📄 project-structure.md    # Este archivo
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml      # GitHub Actions
├── 📁 src/                    # Código fuente organizado
│   ├── 📁 js/                 # JavaScript
│   │   ├── 📄 script.js       # Lógica principal
│   │   ├── 📄 api.js          # Manejo de API
│   │   ├── 📄 security.js     # Funciones de seguridad
│   │   ├── 📄 fallback-db.js  # Base de datos local
│   │   └── 📄 sw.js           # Service Worker
│   ├── 📁 css/                # Estilos
│   │   └── 📄 style.css        # Estilos principales
│   └── 📁 assets/             # Recursos (imágenes, etc.)
├── 📁 backup-pito-perez/      # Copia de seguridad
└── 📁 docs/                   # Documentación
    ├── 📄 README.md
    ├── 📄 SECURITY.md
    ├── 📄 DEPLOY.md
    └── 📄 GITHUB-SETUP.md
```

## 🎨 Características del Proyecto

### ✨ Funcionalidades Principales
- 🔍 **Búsqueda Avanzada**: Filtros por especificaciones
- 🎯 **Modo Fácil**: Recomendaciones personalizadas
- ❤️ **Sistema de Favoritos**: Guardar teléfonos preferidos
- 💬 **Comentarios**: Sistema de reseñas con calificaciones
- 📊 **Gráficos Interactivos**: Visualización de datos
- 📱 **PWA**: Aplicación web progresiva
- 🔒 **Seguridad**: Validación y sanitización de datos

### 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **PWA**: Service Worker, Manifest
- **API**: Fake Store API + Base de datos local
- **Deployment**: GitHub Pages, Netlify, Vercel

### 📱 Responsive Design
- **Desktop**: Navegación horizontal completa
- **Tablet**: Adaptación de grid y espaciado
- **Mobile**: Navegación inferior + optimizaciones touch

### 🔒 Seguridad Implementada
- **XSS Protection**: Sanitización de inputs
- **Rate Limiting**: Límites de búsqueda
- **Input Validation**: Validación robusta
- **Secure Headers**: Meta tags de seguridad
- **Data Integrity**: Verificación de datos

## 🚀 Comandos de Desarrollo

```bash
# Iniciar servidor local
python server.py
# o
python -m http.server 8000

# Desarrollo con hot reload
npm run dev

# Desplegar a GitHub Pages
git push origin main
```

## 📊 Estadísticas del Proyecto
- **Archivos**: 20+ archivos organizados
- **Líneas de código**: 2000+ líneas
- **Funcionalidades**: 15+ características
- **Compatibilidad**: Todos los navegadores modernos
- **Performance**: Optimizado para móvil

## 🎯 Próximas Mejoras
- [ ] Tests automatizados
- [ ] Internacionalización
- [ ] Más filtros de búsqueda
- [ ] Integración con APIs reales
- [ ] Sistema de notificaciones push
