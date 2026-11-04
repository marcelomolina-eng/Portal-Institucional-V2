# GUÍA RÁPIDA DE DESPLIEGUE: PORTAL ONBOARDING 2026
### Colegio Informático (Educar SRL) • Google Apps Script & Google Sheets

Esta guía explica cómo vincular este código a una planilla de Google Sheets institucional y publicarlo como Aplicación Web abierta a los ingresantes.

---

### PASO 1: Crear la Hoja de Cálculo
1. Abre [Google Sheets](https://sheets.new) con tu cuenta de `@educarsrl.com.ar`.
2. Asigna como título de la hoja: **"Base de Datos - Onboarding Colegio Informatico 2026"**.

---

### PASO 2: Abrir el Editor de Apps Script
1. En el menú superior de la hoja, haz clic en **Extensiones > Apps Script**.
2. Nombra el proyecto como: **"Portal Onboarding Educar 2026"**.

---

### PASO 3: Cargar los 4 Archivos
1. En el archivo por defecto **`Código.gs`**, reemplaza todo el código con el contenido de `gas/Código.gs`.
2. Haz clic en el ícono `+` (Añadir un archivo) > selecciona **HTML**:
   - Nombre: **`Index`** -> Pega el contenido de `gas/Index.html`.
3. Crea un segundo archivo **HTML**:
   - Nombre: **`Estilos`** -> Pega el contenido de `gas/Estilos.html`.
4. Crea el tercer archivo **HTML**:
   - Nombre: **`JavaScript`** -> Pega el contenido de `gas/JavaScript.html`.

---

### PASO 4: Ejecutar `setupDatabase()` para Crear las 5 Pestañas
1. En la barra de herramientas del editor, selecciona la función **`setupDatabase`**.
2. Haz clic en **Ejecutar**.
3. Google te pedirá revisar y autorizar los permisos de lectura/escritura en la hoja. Concede los permisos.
4. Vuelve a tu Google Sheet: ¡Verás las 5 pestañas creadas automáticamente con su formato oficial!
   - `Usuarios_Admin` (Cuentas autorizadas: rrhh@educarsrl.com.ar y marcelo.molina@educarsrl.com.ar)
   - `Respuestas_Diplomas` (Registro de folios, nombres, fechas y constancias)
   - `Calendario_Eventos` (Hitos anuales editables por RRHH)
   - `Novedades_Avisos` (Comunicados institucionales)
   - `Feedback_Satisfaccion` (Encuestas de inducción)

---

### PASO 5: Desplegar como Aplicación Web
1. En la esquina superior derecha de Apps Script, presiona **Implementar > Nueva implementación**.
2. Haz clic en el ícono de engranaje ⚙️ y selecciona **Aplicación web**.
3. Parámetros requeridos:
   - **Descripción**: `Versión Oficial Onboarding 2026`
   - **Ejecutar como**: `Yo (tu cuenta corporativa)`
   - **Quién tiene acceso**: **`Cualquier usuario`** *(Imprescindible para que los nuevos ingresantes accedan por link o código QR sin tener que iniciar sesión)*.
4. Presiona **Implementar**.
5. Copia la URL generada y genera el código QR para imprimir o compartir a los nuevos integrantes.

---

### SEGURIDAD Y ACCESO ADMINISTRADOR:
- El panel de RRHH y Sistemas valida exclusivamente los correos:
  1. `rrhh@educarsrl.com.ar`
  2. `marcelo.molina@educarsrl.com.ar`
- La clave inicial configurada en hash SHA-256 es: `educar2026`.
