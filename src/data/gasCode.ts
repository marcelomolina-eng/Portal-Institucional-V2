/**
 * Source code for Google Apps Script and Google Sheets integration
 * Ready to copy and paste directly into script.google.com
 */

export const CODIGO_GS = `/**
 * ====================================================================
 * PORTAL DIGITAL DE ONBOARDING 2026 - COLEGIO INFORMÁTICO (EDUCAR)
 * "Operación Informático: Una misión: descubrir todo lo que nos une"
 * ====================================================================
 * Backend en Google Apps Script para Google Sheets, Google Slides & Drive
 * 
 * Cuentas Administradoras Autorizadas:
 * 1. rrhh@educarsrl.com.ar
 * 2. marcelo.molina@educarsrl.com.ar
 */

// Configuración Global
const CONFIG = {
  NOMBRE_INSTITUCION: "Colegio Informático (Educar SRL)",
  SLOGAN: "Operación Informático: Una misión: descubrir todo lo que nos une",
  ADMINS_AUTORIZADOS: [
    "rrhh@educarsrl.com.ar",
    "marcelo.molina@educarsrl.com.ar"
  ],
  // Hashes SHA-256 autorizados ('educar2026')
  ADMIN_HASHES: {
    "rrhh@educarsrl.com.ar": "a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf",
    "marcelo.molina@educarsrl.com.ar": "a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf"
  },
  NOMBRE_HOJAS: {
    USUARIOS_ADMIN: "Usuarios_Admin",
    RESPUESTAS_DIPLOMAS: "Respuestas_Diplomas",
    CALENDARIO_EVENTOS: "Calendario_Eventos",
    NOVEDADES_AVISOS: "Novedades_Avisos",
    FEEDBACK_SATISFACCION: "Feedback_Satisfaccion"
  },
  // ID de la plantilla de Google Slides para diplomas (opcional, configurar en script)
  ID_PLANTILLA_SLIDES: "CONFIGURAR_ID_SLIDES_AQUI",
  ID_CARPETA_DIPLOMAS_DRIVE: "CONFIGURAR_ID_CARPETA_DRIVE"
};

/**
 * Función de entrada HTTP para la Web App (HTML Service)
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.appConfig = {
    institutionName: CONFIG.NOMBRE_INSTITUCION,
    slogan: CONFIG.SLOGAN
  };
  
  return template.evaluate()
    .setTitle("Portal Onboarding 2026 | Colegio Informático")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Función auxiliar para incluir archivos modulares en HTML Service
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Crea o inicializa la estructura de base de datos en Google Sheets
 * Ejecutar esta función una sola vez desde el Editor de Apps Script.
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("No hay una hoja de cálculo vinculada activa. Cree una hoja en Google Sheets y abra Extensiones > Apps Script.");
  }
  
  var sheetsDef = [
    {
      name: CONFIG.NOMBRE_HOJAS.USUARIOS_ADMIN,
      headers: ["Email", "Nombre", "Rol", "Password_SHA256", "Fecha_Creacion", "Estado"],
      initialData: [
        ["rrhh@educarsrl.com.ar", "Natali Miño / RRHH", "Administrador RRHH", "a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf", new Date(), "Activo"],
        ["marcelo.molina@educarsrl.com.ar", "Marcelo Molina", "Administrador Sistemas", "a8d4f4e7240cbbd3ef711fa7ec4a390d4a7c88b5ba8fafe2547b3be61fc0f8cf", new Date(), "Activo"]
      ]
    },
    {
      name: CONFIG.NOMBRE_HOJAS.RESPUESTAS_DIPLOMAS,
      headers: ["ID_Folio", "Timestamp", "Nombre_Apellido", "Puesto_Sector", "Email", "Fecha_Ingreso", "URL_PDF_Certificado", "Hash_Verificacion", "Estado_Envio"],
      initialData: []
    },
    {
      name: CONFIG.NOMBRE_HOJAS.CALENDARIO_EVENTOS,
      headers: ["ID", "Mes_Numero", "Mes_Nombre", "Fecha_Texto", "Titulo_Evento", "Categoria", "Responsable", "Descripcion", "Publico_Destino"],
      initialData: [
        ["EVT-01", 2, "Febrero 2026", "16 de Febrero", "Reincorporación Docente y Bienvenida Institucional", "Institucional", "Dirección Académica & RRHH", "Jornada inaugural del ciclo lectivo 2026", "Todo el personal"],
        ["EVT-02", 3, "Marzo 2026", "02 de Marzo", "Inicio Oficial de Clases Ciclo Lectivo 2026", "Académico", "Equipo Directivo", "Apertura en todos los niveles", "Comunidad escolar"],
        ["EVT-03", 5, "Mayo 2026", "18 de Mayo", "Lanzamiento Copa Informática 2026", "Deportes", "Coti Basualdo", "Torneo deportivo e intercasas", "Estudiantes y docentes"],
        ["EVT-04", 10, "Octubre 2026", "23 de Octubre", "Gran Gala Anual: EXPO PROYECTO 2026", "Innovación", "Sofi Lorenzo", "Feria de Ciencias y ABP", "Comunidad provincial"]
      ]
    },
    {
      name: CONFIG.NOMBRE_HOJAS.NOVEDADES_AVISOS,
      headers: ["ID", "Fecha", "Titulo", "Contenido", "Autor", "Prioridad", "Fijado"],
      initialData: [
        ["NOV-01", "2026-11-03", "¡Bienvenidos a la Operación Informático 2026!", "Iniciamos la inducción interactiva para el nuevo talento del Colegio Informático.", "Natali Miño (RRHH)", "alta", true],
        ["NOV-02", "2026-10-28", "Activación de cuentas @educarsrl.com.ar", "Todas las casillas de correo corporativo están activas. Contactar a Sistemas por consultas.", "Marcelo Molina (Sistemas)", "normal", false]
      ]
    },
    {
      name: CONFIG.NOMBRE_HOJAS.FEEDBACK_SATISFACCION,
      headers: ["ID", "Timestamp", "Nombre_Colaborador", "Puesto", "Calificacion_General", "Calificacion_Claridad", "Seccion_Mas_Util", "Sugerencias", "Recomendaria"],
      initialData: []
    }
  ];
  
  sheetsDef.forEach(function(def) {
    var sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    // Si la hoja está vacía, agregar encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      var headerRange = sheet.getRange(1, 1, 1, def.headers.length);
      headerRange.setBackground("#DE4034").setFontColor("#FFFFFF").setFontWeight("bold");
      
      if (def.initialData && def.initialData.length > 0) {
        def.initialData.forEach(function(row) {
          sheet.appendRow(row);
        });
      }
    }
  });
  
  Logger.log("Base de datos inicializada correctamente con las 5 pestañas.");
  return { success: true, message: "Base de datos creada exitosamente." };
}

/**
 * Valida acceso al Panel Administrador mediante SHA-256
 */
function loginAdmin(email, passHash) {
  var cleanEmail = (email || "").trim().toLowerCase();
  
  // Validar si el email pertenece a los administradores autorizados
  if (CONFIG.ADMINS_AUTORIZADOS.indexOf(cleanEmail) === -1) {
    return {
      success: false,
      message: "Acceso denegado: Esta dirección de correo no está autorizada para administrar el portal."
    };
  }
  
  // Validar hash SHA-256
  var expectedHash = CONFIG.ADMIN_HASHES[cleanEmail];
  if (passHash === expectedHash) {
    return {
      success: true,
      user: {
        email: cleanEmail,
        name: cleanEmail.indexOf("marcelo") !== -1 ? "Marcelo Molina (Sistemas)" : "RRHH Colegio Informático",
        role: "Administrador Autorizado"
      }
    };
  } else {
    return {
      success: false,
      message: "Contraseña o credencial de seguridad incorrecta."
    };
  }
}

/**
 * Genera el diploma en Google Slides/PDF y lo registra en Google Sheets
 */
function generarDiplomaPDF(datos) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.NOMBRE_HOJAS.RESPUESTAS_DIPLOMAS);
    
    var timestamp = new Date();
    var folio = "CI-2026-" + Math.floor(1000 + Math.random() * 9000);
    var hashVerificacion = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, 
      datos.nombre + datos.puesto + folio + timestamp.getTime()
    ).map(function(byte) {
      var v = (byte < 0 ? byte + 256 : byte).toString(16);
      return v.length == 1 ? "0" + v : v;
    }).join("");
    
    var urlPdf = "";
    
    // Si hay plantilla de Google Slides configurada:
    if (CONFIG.ID_PLANTILLA_SLIDES && CONFIG.ID_PLANTILLA_SLIDES !== "CONFIGURAR_ID_SLIDES_AQUI") {
      var templateFile = DriveApp.getFileById(CONFIG.ID_PLANTILLA_SLIDES);
      var copy = templateFile.makeCopy("Diploma_" + datos.nombre + "_" + folio);
      var slideDoc = SlidesApp.openById(copy.getId());
      
      slideDoc.replaceAllText("{{NOMBRE}}", datos.nombre);
      slideDoc.replaceAllText("{{PUESTO}}", datos.puesto);
      slideDoc.replaceAllText("{{FECHA}}", datos.fechaIngreso || Utilities.formatDate(timestamp, "GMT-3", "dd/MM/yyyy"));
      slideDoc.replaceAllText("{{FOLIO}}", folio);
      slideDoc.saveAndClose();
      
      var pdfBlob = copy.getAs("application/pdf");
      var carpeta = CONFIG.ID_CARPETA_DIPLOMAS_DRIVE !== "CONFIGURAR_ID_CARPETA_DRIVE" 
        ? DriveApp.getFolderById(CONFIG.ID_CARPETA_DIPLOMAS_DRIVE) 
        : DriveApp.getRootFolder();
      
      var finalPdf = carpeta.createFile(pdfBlob).setName("Diploma_Colegio_Informatico_" + datos.nombre + ".pdf");
      finalPdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      urlPdf = finalPdf.getUrl();
      
      // Eliminar copia temporal de Slides
      copy.setTrashed(true);
      
      // Enviar por correo electrónico al ingresante
      if (datos.email && datos.email.indexOf("@") !== -1) {
        GmailApp.sendEmail(datos.email, "¡Felicitaciones! Diploma Operación Informático 2026", 
          "Hola " + datos.nombre + ",\\n\\n¡Felicitaciones por completar con éxito la Operación Informático 2026!\\nAdjuntamos tu constancia oficial de bienvenida.\\n\\nComunidad Educativa Educar",
          {
            attachments: [pdfBlob],
            name: "Colegio Informático - RRHH"
          }
        );
      }
    } else {
      urlPdf = "Generado Directamente en Navegador / Verificado en Sistema";
    }
    
    // Registrar en Google Sheets
    if (sheet) {
      sheet.appendRow([
        folio,
        timestamp,
        datos.nombre,
        datos.puesto,
        datos.email || "No provisto",
        datos.fechaIngreso || Utilities.formatDate(timestamp, "GMT-3", "yyyy-MM-dd"),
        urlPdf,
        hashVerificacion,
        datos.email ? "Enviado por Correo" : "Generado Digital"
      ]);
    }
    
    return {
      success: true,
      folio: folio,
      hashVerificacion: hashVerificacion,
      urlPdf: urlPdf,
      timestamp: Utilities.formatDate(timestamp, "GMT-3", "dd/MM/yyyy HH:mm")
    };
  } catch (err) {
    Logger.log("Error generando diploma: " + err.toString());
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * Guarda feedback de satisfacción
 */
function guardarFeedback(datos) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.NOMBRE_HOJAS.FEEDBACK_SATISFACCION);
    if (!sheet) return { success: false, error: "Hoja de feedback no encontrada" };
    
    var id = "FB-" + new Date().getTime();
    sheet.appendRow([
      id,
      new Date(),
      datos.fullName || "Anónimo",
      datos.role || "No especificado",
      datos.overallRating || 5,
      datos.clarityRating || 5,
      datos.mostUsefulSection || "",
      datos.suggestions || "",
      datos.wouldRecommend ? "Sí" : "No"
    ]);
    
    return { success: true, id: id };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Obtiene el calendario de eventos anuales
 */
function obtenerCalendario() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.NOMBRE_HOJAS.CALENDARIO_EVENTOS);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var eventos = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    eventos.push({
      id: row[0],
      month: row[1],
      monthName: row[2],
      dateStr: row[3],
      title: row[4],
      category: row[5],
      responsible: row[6],
      description: row[7],
      targetAudience: row[8]
    });
  }
  return eventos;
}
`;

export const INDEX_HTML_GAS = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal Onboarding 2026 | Colegio Informático</title>
  <!-- Google Fonts & Tailwind CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <!-- Iconos Lucide CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <?!= include('Estilos'); ?>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col font-sans">
  
  <!-- CABECERA INSTITUCIONAL -->
  <header class="sticky top-0 z-50 bg-[#1C1A17] text-white shadow-lg border-b-2 border-[#CFB07A]">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="/assets/aistudio/escudo_colegio_informatico.png" alt="Escudo Verita Vinci" class="w-10 h-12 object-contain drop-shadow-sm" />
        <div>
          <h1 class="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Colegio Informático
            <span class="text-xs bg-[#01913F] text-white px-2 py-0.5 rounded-full font-medium tracking-normal">Educar 2026</span>
          </h1>
          <p class="text-xs text-[#CFB07A] font-serif-title font-medium">Verita Vinci • Una misión: descubrir todo lo que nos une</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button onclick="mostrarModalAdmin()" class="text-xs bg-[#DE4034] hover:bg-[#8F1F17] text-white px-3 py-1.5 rounded-lg border border-[#CFB07A]/40 transition flex items-center gap-1.5">
          <i data-lucide="lock" class="w-3.5 h-3.5"></i>
          <span>Gestión RRHH</span>
        </button>
      </div>
    </div>
  </header>

  <!-- CONTENIDO PRINCIPAL DINÁMICO -->
  <main id="app-root" class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
    <!-- Se inyectan las vistas de las misiones vía JavaScript.html -->
  </main>

  <footer class="bg-[#1C1A17] text-slate-400 py-6 text-center text-xs border-t-2 border-[#CFB07A]">
    <p>Colegio Informático Educar SRL © 2026 • Corrientes, Argentina</p>
    <p class="mt-1 text-[#CFB07A] font-serif-title">Verita Vinci • Excelencia, calidez y cultura tecnológica.</p>
  </footer>

  <?!= include('JavaScript'); ?>
</body>
</html>
`;

export const ESTILOS_HTML_GAS = `<style>
  :root {
    --color-escudo-rojo: #DE4034;
    --color-escudo-verde: #01913F;
    --color-escudo-arena: #CFB07A;
    --color-escudo-negro: #1C1A17;
    --color-granate: #DE4034;
    --color-verde: #01913F;
    --color-dorado: #CFB07A;
  }
  
  body {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }
  
  .font-serif-title {
    font-family: 'Cinzel', serif;
  }
  
  /* Gradientes institucionales */
  .bg-institucional-gradient {
    background: linear-gradient(135deg, #DE4034 0%, #8F1F17 100%);
  }
  
  .card-hover-effect {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover-effect:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(222, 64, 52, 0.2);
  }
  
  /* Diploma styling */
  .diploma-border {
    border: 8px double #CFB07A;
    background: radial-gradient(circle at center, #FFFFFF 0%, #FAF8F2 100%);
  }
</style>
`;

export const JAVASCRIPT_HTML_GAS = `<script>
  // Inicialización de iconos Lucide y estado cliente
  document.addEventListener("DOMContentLoaded", function() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Llamada RPC de ejemplo para validar admin con SHA-256
  async function autenticarAdminGAS(email, password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    google.script.run
      .withSuccessHandler(function(response) {
        if (response.success) {
          alert("Acceso concedido a: " + response.user.name);
          // Redirigir al panel
        } else {
          alert("Error: " + response.message);
        }
      })
      .withFailureHandler(function(error) {
        alert("Error de comunicación con Google Apps Script: " + error.message);
      })
      .loginAdmin(email, passHash);
  }

  // Llamada RPC para emitir diploma
  function solicitarDiplomaGAS(nombre, puesto, email, fecha) {
    google.script.run
      .withSuccessHandler(function(res) {
        if (res.success) {
          alert("¡Diploma emitido con éxito! Folio: " + res.folio);
          if (window.confetti) confetti();
        } else {
          alert("Error al emitir diploma: " + res.error);
        }
      })
      .generarDiplomaPDF({
        nombre: nombre,
        puesto: puesto,
        email: email,
        fechaIngreso: fecha
      });
  }
</script>
`;

export const GUIA_DESPLIEGUE_GAS = `# GUÍA DE DESPLIEGUE EN GOOGLE APPS SCRIPT & GOOGLE SHEETS
### Colegio Informático (Educar SRL) - Portal Onboarding 2026

Sigue estos 5 sencillos pasos para tener la aplicación funcionando en tu cuenta institucional de Google Workspace:

---

### PASO 1: Crear la Hoja de Cálculo (Google Sheets)
1. Ve a [Google Sheets](https://sheets.new) y crea una nueva planilla en blanco.
2. Nómbrala: **"Base de Datos - Onboarding Colegio Informatico 2026"**.

---

### PASO 2: Abrir el Editor de Google Apps Script
1. En el menú superior de la hoja de cálculo, haz clic en **Extensiones > Apps Script**.
2. Nombra el proyecto: **"Portal Onboarding Educar 2026"**.

---

### PASO 3: Copiar los 4 Archivos
1. En el archivo predeterminado **\`Código.gs\`**, borra todo el contenido y pega el código provisto en este portal.
2. Haz clic en el botón **\`+\` (Añadir un archivo)** junto a "Archivos" y selecciona **HTML**:
   - Nombre: **\`Index\`** -> Pega el contenido de \`Index.html\`.
3. Repite el proceso para crear otro archivo **HTML**:
   - Nombre: **\`Estilos\`** -> Pega el contenido de \`Estilos.html\`.
4. Repite el proceso para crear el último archivo **HTML**:
   - Nombre: **\`JavaScript\`** -> Pega el contenido de \`JavaScript.html\`.

---

### PASO 4: Inicializar la Base de Datos
1. En el editor de Apps Script, selecciona la función **\`setupDatabase\`** en la barra superior.
2. Haz clic en **Ejecutar**.
3. Acepta los permisos de autorización de tu cuenta de Google.
4. Revisa tu Google Sheet: ¡Se habrán creado automáticamente las 5 pestañas con sus encabezados y estilos institucionales!
   - \`Usuarios_Admin\`
   - \`Respuestas_Diplomas\`
   - \`Calendario_Eventos\`
   - \`Novedades_Avisos\`
   - \`Feedback_Satisfaccion\`

---

### PASO 5: Desplegar como Aplicación Web
1. En la esquina superior derecha, haz clic en **Implementar > Nueva implementación**.
2. Haz clic en el icono del engranaje (⚙️) y selecciona **Aplicación web**.
3. Configura:
   - **Descripción**: \`Portal Onboarding v1.0 2026\`
   - **Ejecutar como**: \`Yo (tu cuenta)\`
   - **Quién tiene acceso**: **\`Cualquier usuario\`** *(Para permitir que los ingresantes accedan por link o código QR sin necesidad de iniciar sesión)*.
4. Haz clic en **Implementar**.
5. ¡Copia la URL de la aplicación web y compártela a los nuevos colaboradores!
`;
