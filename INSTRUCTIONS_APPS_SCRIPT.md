# 📊 Integración del Evaluador Docente con Google Sheets (via Apps Script)

Esta guía paso a paso te explica cómo conectar las evaluaciones que generas en tu web app directamente a una **Hoja de Cálculo de Google (Google Sheets / Excel de Google)** de manera 100% automatizada utilizando **Google Apps Script**.

---

## 🚀 Guía de Configuración en Rápido

### **Paso 1: Preparar tu Google Sheet**
1. Crea una nueva Hoja de Cálculo en Google Drive o abre una existente.
2. Nómbrala (por ejemplo: `Evaluaciones Docentes UVP`).
3. No te preocupes por crear las columnas a mano; **el script las inicializará y les pondrá formato automáticamente** en el primer envío.

### **Paso 2: Abrir el editor de Apps Script**
1. Dentro de tu Hoja de Cálculo, haz clic en la barra del menú superior en:
   👉 **Extensiones** > **Apps Script**.
2. Se abrirá una nueva pestaña del navegador con el editor de desarrollo de Google.

### **Paso 3: Copiar y Guardar el Código**
1. Borra cualquier código existente en el archivo `Código.gs` (normalmente viene con una función vacía de ejemplo).
2. Abre el archivo local **`/google-apps-script.js`** de este proyecto y copia todo su contenido.
3. Pégalo en el editor de Apps Script.
4. Presiona el botón del **Disquete** 💾 en la barra superior del editor o presiona `Ctrl+S` (`Cmd+S` en Mac) para Guardar el archivo.

---

## 🌐 Publicar el Script como Aplicación Web (Paso Crucial)

Para que tu aplicación de React se pueda comunicar de forma directa con Google, debes publicar el Apps Script con accesos universales seguros.

1. En la esquina superior derecha del editor de Apps Script, presiona el botón azul **Implementar** (Deploy) y luego selecciona **Nueva implementación** (New deployment).
2. Haz clic en el icono del **Engranaje** ⚙️ y asegúrate de elegir **Aplicación web** (Web app).
3. Rellena los siguientes campos con suma atención:
   - **Descripción**: `Conector de Evaluador Docente`
   - **Ejecutar como (Execute as)**: Elige **"Yo" (tu_correo@gmail.com o @edu.mx)**.
   - **Quién tiene acceso (Who has access)**: Selecciona **"Cualquiera" (Anyone)**. 
     *(⚠️ **Atención:** Si eliges "Solo yo", la web de React recibirá un mensaje de bloqueo de permisos. "Cualquiera" permite que el formulario de ingreso suba los datos de los candidatos de forma abierta).*
4. Haz clic en el botón azul **Implementar** en la parte inferior.
5. Google te preguntará: *"Autorizar acceso"*. Presiona el botón, selecciona tu cuenta de Google, haz clic en **Avanzado** (Advanced) o *Ir a Proyecto Sin Nombre (No Seguro)* en la parte inferior izquierda, y por último presiona **Permitir** (Allow).
6. Una vez completado, Google te mostrará una ventana con la **URL de la aplicación web**. Se ve similar a esto:
   `https://script.google.com/macros/s/AKfycbz...XYZ/exec`
7. **Copia esta URL completa**.

---

## 💻 Configurar y Sincronizar en la Aplicación Web

1. Abre tu aplicación web ejecutándose o cuando esté desplegada.
2. Abre el reporte de cualquier candidato (por ejemplo, el demo pre-cargado **Gabriela Pérez**).
3. Elige la pestaña **Sincronización Sheets / Excel** que hemos incorporado en el panel.
4. Pega la URL generada en el campo de texto corresponditente.
5. Presiona **"Establecer Conector"** para guardarlo localmente.
6. Haz clic en el gran botón **"Sincronizar Datos"** para enviar el perfil directamente a tu hoja de cálculo.
7. ¡Abre tu hoja de cálculo para observar cómo los datos aparecen de inmediato, con bordes y encabezados formateados en un hermoso color rosa!

---

## 📝 Ventajas del uso de este Apps Script
- **Modularidad e Independencia**: No requieres configuraciones complejas de servidores, bases de datos SQL o cobros. Google aloja el script gratuitamente.
- **Formateo Dinámico**: Colorea automáticamente el encabezado de rosa al crearlo por primera vez para un look impecable.
- **Gestión sin CORS**: Maneja cabeceras preflight (`OPTIONS` y `POST`), evitando problemas de bloqueo cruzado en cualquier navegador contemporáneo.
