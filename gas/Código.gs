/**
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
          "Hola " + datos.nombre + ",\n\n¡Felicitaciones por completar con éxito la Operación Informático 2026!\nAdjuntamos tu constancia oficial de bienvenida.\n\nComunidad Educativa Educar",
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
