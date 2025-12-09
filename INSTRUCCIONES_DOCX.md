# Instrucciones para Agregar Capturas de Pantalla al Documento .docx

## Opción 1: Usar el Script de Python (Recomendado)

### Requisitos:
1. Instalar Python (si no lo tienes)
2. Instalar la librería `python-docx`:
   ```bash
   pip install python-docx
   ```

### Pasos:
1. Asegúrate de tener todas las capturas de pantalla en la carpeta `capturas-manual/` con los nombres correctos:
   - `captura-01-panel-general.jpg`
   - `captura-02-boton-autenticacion.jpg`
   - ... (y así sucesivamente hasta captura-26)

2. Ejecuta el script:
   ```bash
   python scripts/actualizar-docx-con-imagenes.py
   ```

3. El script creará o actualizará `ManualUsuario.docx` con referencias a las imágenes.

4. Si alguna imagen no se insertó automáticamente, abre el documento en Word y reemplaza los marcadores `[CAPTURA X]` con las imágenes correspondientes.

---

## Opción 2: Manualmente en Microsoft Word

### Pasos:

1. **Abre el documento** `ManualUsuario.docx` en Microsoft Word.

2. **Para cada captura de pantalla:**

   a. Busca el texto `[CAPTURA DE PANTALLA X]` en el documento.
   
   b. Elimina el texto del marcador.
   
   c. Ve a la pestaña **Insertar** > **Imágenes** > **Este dispositivo**.
   
   d. Selecciona la imagen correspondiente desde la carpeta `capturas-manual/`.
   
   e. Ajusta el tamaño de la imagen:
      - Haz clic derecho en la imagen > **Tamaño y posición**
      - Establece el ancho a aproximadamente **14 cm** (5.5 pulgadas)
      - Mantén la proporción de aspecto
      - Centra la imagen
   
   f. Agrega un pie de foto:
      - Haz clic derecho en la imagen > **Insertar título**
      - O manualmente: agrega texto debajo como "Figura X: Descripción"

3. **Lista de imágenes a insertar:**

   | # | Nombre del Archivo | Descripción |
   |---|-------------------|-------------|
   | 1 | `captura-01-panel-general.jpg` | Pantalla principal con menú y gráficos |
   | 2 | `captura-02-boton-autenticacion.jpg` | Botón de autenticación en header |
   | 3 | `captura-03-modal-registro.jpg` | Modal de registro |
   | 4 | `captura-04-formulario-registro.jpg` | Formulario de registro |
   | 5 | `captura-05-header-autenticado.jpg` | Header después de login |
   | 6 | `captura-06-modal-login.jpg` | Modal de inicio de sesión |
   | 7 | `captura-07-menu-principal.jpg` | Menú principal completo |
   | 8 | `captura-08-panel-graficos.jpg` | Panel con gráficos |
   | 9 | `captura-09-busqueda-filtros.jpg` | Búsqueda con filtros |
   | 10 | `captura-10-resultados-busqueda.jpg` | Resultados de búsqueda |
   | 11 | `captura-11-modo-facil-presupuesto.jpg` | Modo Fácil - Presupuesto |
   | 12 | `captura-12-modo-facil-uso.jpg` | Modo Fácil - Tipo de uso |
   | 13 | `captura-13-resultados-modo-facil.jpg` | Resultados Modo Fácil |
   | 14 | `captura-14-tabla-comparativa.jpg` | Tabla comparativa |
   | 15 | `captura-15-boton-flotante.jpg` | Botón flotante |
   | 16 | `captura-16-mi-cuenta-vista.jpg` | Mi Cuenta - Vista general |
   | 17 | `captura-17-favoritos-vacio.jpg` | Pestaña Favoritos |
   | 18 | `captura-18-historial.jpg` | Pestaña Historial |
   | 19 | `captura-19-busqueda-tiempo-real.jpg` | Búsqueda tiempo real |
   | 20 | `captura-20-filtros-aplicados.jpg` | Filtros aplicados |
   | 21 | `captura-21-boton-favoritos.jpg` | Botón favoritos |
   | 22 | `captura-22-boton-comparar.jpg` | Botón comparar |
   | 23 | `captura-23-modal-comentarios.jpg` | Modal con comentarios |
   | 24 | `captura-24-lista-comentarios.jpg` | Lista de comentarios |
   | 25 | `captura-25-boton-chatbot.jpg` | Botón chatbot |
   | 26 | `captura-26-ventana-chatbot.jpg` | Ventana chatbot |

---

## Consejos para Insertar Imágenes en Word:

1. **Tamaño consistente**: Usa el mismo tamaño para todas las imágenes (recomendado: 14 cm de ancho).

2. **Calidad**: Asegúrate de que las imágenes sean de alta resolución (al menos 1920px de ancho).

3. **Formato**: Preferiblemente JPG o PNG.

4. **Pies de foto**: Agrega un pie de foto descriptivo debajo de cada imagen:
   - Ejemplo: "Figura 1: Vista principal del sistema Pito Pérez"

5. **Alineación**: Centra todas las imágenes.

6. **Espaciado**: Deja espacio antes y después de cada imagen para mejor legibilidad.

---

## Verificación Final:

Después de insertar todas las imágenes, verifica:
- [ ] Todas las 26 imágenes están insertadas
- [ ] Cada imagen tiene un pie de foto descriptivo
- [ ] Las imágenes están centradas
- [ ] El tamaño es consistente
- [ ] La calidad de las imágenes es buena
- [ ] El documento se ve bien en vista de impresión

---

## Nota Importante:

Si prefieres que el script haga todo automáticamente, asegúrate de:
1. Tener todas las imágenes en `capturas-manual/` con los nombres exactos
2. Ejecutar el script de Python
3. Revisar el documento resultante en Word

