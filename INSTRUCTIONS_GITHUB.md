# 🐙 Guía para Alojar tu Web App en GitHub

Este proyecto de React está completamente estructurado bajo los lineamientos contemporáneos, lo que significa que puedes **subirlo inmediatamente a un repositorio de GitHub** y publicarlo para que otras personas lo utilicen.

---

## 🗂️ ¿Qué archivos debes subir? (Y cuáles ignorar)

En la raíz del proyecto contamos con un archivo llamado **`.gitignore`**. Este archivo se encarga de dar instrucciones para que las carpetas pesadas de compilación local no se suban a internet.

### **NO DEBES SUBIR O COPIAR:**
- ❌ `node_modules/` (Carpeta con miles de librerías locales temporales auto-generadas al instalar dependencias).
- ❌ `dist/` o `build/` (Las carpetas temporales resultantes de compilar el proyecto).

### **SÍ DEBES SUBIR O ARRASTRAR:**
- Los directorios: `src/` (tu código fuente), `public/` (imágenes, iconos y recursos públicos), `skills/`, etc.
- Los archivos en la raíz como: `package.json` (declaración de paquetes), `tsconfig.json` (configuraciones de TypeScript), `vite.config.ts`, `index.html`, `postcss.config.js`, `tailwind.config.js`, `.env.example`, y los manuales explicativos `.md`.

---

## 🚀 Método 1: Arrastrar el código desde la Web (Recomendado para principiantes)

Si no cuentas con Git instalado en tu computadora o prefieres un método rápido y visual, realiza estos pasos:

1. **Exportar el Proyecto de AI Studio**: 
   - En el menú lateral o superior de la plataforma de desarrollo, busca el menú de **Settings / Configuración**.
   - Haz clic en **Export to ZIP** (Exportar como .ZIP) o descarga el contenido completo del proyecto a tu computadora local.
   
2. **Descomprimir**:
   - Extrae el archivo `.zip` en una carpeta local de tu computadora.

3. **Crear tu Repositorio en GitHub**:
   - Ingresa a [github.com](https://github.com/) e inicia sesión en tu cuenta.
   - Haz clic en el botón verde **"New"** (Nuevo) o ve a `New Repository`.
   - Asígnale un nombre descriptivo, por ejemplo: `evaluador-docente-básica`.
   - Déjalo como **Público** o Privado según desees.
   - **IMPORTANTE:** No marques ninguna casilla que diga *"Add a README"*, *"Add .gitignore"*, ni *"Choose a license"*. Mantén el repositorio completamente vacío de arranque. Haz clic en **Create repository**.

4. **Arrastrar Archivos**:
   - En la página del repositorio vacío que se te muestra, verás la opción azul: **"uploading an existing file"** (subir un archivo existente). Haz clic ahí.
   - Abre la carpeta descomprimida en tu explorador de archivos local.
   - Selecciona **todos los archivos y carpetas** (excepto `node_modules` si es que estuviera allí) y **arrástralo todo** directamente en el centro de tu ventana del navegador.
   - Escribe un comentario descriptivo en el fondo (ejemplo: `First commit / Inicializar evaluador docente`) y haz clic en **Commit changes**.
   - ¡Listo! Tu código quedará archivado de forma óptima.

---

## 💻 Método 2: Inicializar y Subir mediante Terminal (Método profesional para desarrolladores)

Si ya cuentas con `git` y la consola de comandos abierta en tu máquina, abre tu terminal dentro del directorio descomprimido y ejecuta las siguientes directrices correspondientes para vincular e iniciar tu repositorio en la nube:

```bash
# 1. Inicializar el repositorio Git localmente
git init

# 2. Agregar todos los archivos preparados (esto respetará automáticamente tu archivo .gitignore)
git add .

# 3. Realizar tu primer registro con comentario descriptivo
git commit -m "feat: setup evaluador docente conector apps script"

# 4. Cambiar el nombre de la rama principal por convención
git branch -M main

# 5. Conectar tu repositorio de tu computadora con el enlace de GitHub que creaste
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 6. Subir tus archivos a GitHub
git push -u origin main
```

---

## 🌟 Cómo publicar tu App Gratis después de subirla a GitHub (Vercel, Netlify o GitHub Pages)

Dado que es una aplicación de React súper ligera que corre del lado del navegador (Client-Side), puedes desplegarla en linea y de forma gratuita en menos de 1 minuto:

### **Opción sugerida: Vercel (Recomendado)**
1. Crea una cuenta gratuita en [Vercel.com](https://vercel.com/) usando tu cuenta de GitHub.
2. Haz clic en el botón **Add New** > **Project**.
3. Vercel detectará instantáneamente el repositorio que acabas de crear. Presiona **Import/Importar**.
4. ¡Haz clic en **Deploy/Desplegar**! Sin configurar nada más, Vercel compilará la aplicación y te otorgará un link público para que puedas realizar exámenes a tus docentes desde cualquier dispositivo móvil o computadora en el aula de ingresos.
