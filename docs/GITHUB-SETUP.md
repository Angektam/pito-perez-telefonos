# 🚀 Guía Completa para Subir a GitHub

## 📋 Requisitos Previos

### 1. Instalar Git
- Ve a: https://git-scm.com/download/win
- Descarga e instala Git para Windows
- **IMPORTANTE**: Reinicia tu terminal después de instalar

### 2. Crear cuenta en GitHub
- Ve a: https://github.com
- Crea una cuenta gratuita
- Verifica tu email

## 🔧 Configuración Inicial de Git

Abre PowerShell o Command Prompt y ejecuta:

```bash
# Configurar tu identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"

# Verificar instalación
git --version
```

## 📁 Crear Repositorio en GitHub

1. **Ve a GitHub.com** y haz login
2. **Haz clic en "New repository"** (botón verde)
3. **Configura el repositorio**:
   - **Repository name**: `pito-perez-telefonos`
   - **Description**: `Guía interactiva de smartphones con datos en tiempo real`
   - **Marca "Public"**
   - **NO marques** "Add README", "Add .gitignore", ni "Choose a license"
4. **Haz clic en "Create repository"**

## 📤 Subir tu Código

En tu carpeta del proyecto, ejecuta estos comandos uno por uno:

```bash
# 1. Inicializar repositorio Git
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Primera versión de Pito Pérez Guía de Teléfonos"

# 4. Cambiar a rama main
git branch -M main

# 5. Conectar con GitHub (cambia TU-USUARIO por tu nombre de usuario)
git remote add origin https://github.com/TU-USUARIO/pito-perez-telefonos.git

# 6. Subir código
git push -u origin main
```

## 🌐 Activar GitHub Pages

1. **Ve a tu repositorio** en GitHub
2. **Haz clic en "Settings"** (pestaña superior)
3. **Busca "Pages"** en el menú izquierdo
4. **En "Source"** selecciona **"GitHub Actions"**
5. **Guarda los cambios**

## 🔄 Actualizar tu Sitio

Para hacer cambios y actualizar tu sitio:

```bash
# 1. Modificar tus archivos
# 2. Agregar cambios
git add .

# 3. Hacer commit
git commit -m "Descripción de los cambios"

# 4. Subir cambios
git push origin main
```

## 🌍 Tu Sitio Web

Tu aplicación estará disponible en:
**https://TU-USUARIO.github.io/pito-perez-telefonos**

## 📱 Funcionalidades del Sitio

- ✅ **Responsive**: Funciona en móvil y desktop
- ✅ **Gráficos interactivos**: Chart.js
- ✅ **Sistema de comentarios**: Con localStorage
- ✅ **Búsqueda avanzada**: Filtros múltiples
- ✅ **Modo fácil**: Recomendaciones inteligentes
- ✅ **Seguridad**: Headers de protección

## 🛠️ Solución de Problemas

### Error: "git no se reconoce"
- **Solución**: Reinstala Git y reinicia tu terminal

### Error: "Permission denied"
- **Solución**: Verifica tu usuario y email en Git config

### Error: "Repository not found"
- **Solución**: Verifica que el nombre del repositorio sea correcto

### El sitio no se actualiza
- **Solución**: Espera 2-3 minutos, GitHub Pages puede tardar

## 📞 Soporte

Si tienes problemas:
1. Verifica que todos los archivos estén en la carpeta
2. Asegúrate de que Git esté instalado correctamente
3. Revisa que el repositorio sea público
4. Verifica que GitHub Pages esté activado

## 🎉 ¡Listo!

Una vez completado, tu aplicación estará disponible en internet y podrás compartirla con cualquiera usando el link de GitHub Pages.

---

**Archivos incluidos en tu proyecto:**
- `index.html` - Página principal
- `style.css` - Estilos
- `script.js` - Lógica de la aplicación
- `api.js` - Manejo de datos
- `security.js` - Funciones de seguridad
- `fallback-db.js` - Base de datos de respaldo
- `README.md` - Documentación
- `.github/workflows/deploy.yml` - Despliegue automático
