/**
 * GOOGLE APPS SCRIPT: Conector de Evaluaciones Docentes
 * 
 * Este script vincula tu Web App con esta Hoja de Cálculo de Google.
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. En tu Hoja de Cálculo, ve al menú superior: Extensiones > Apps Script.
 * 2. Borra todo el código que aparezca por defecto en el editor.
 * 3. Pega este código completo.
 * 4. Guarda el proyecto (icono de disquete o Ctrl+S).
 * 5. Haz clic en el botón superior azul: "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 6. Tipo de implementación: Selecciona "Aplicación web" (Web app) haciendo clic en el engranaje.
 * 7. Configura los accesos exactos:
 *    - Descripción: "Conector Evaluador Docente"
 *    - Ejecutar como (Execute as): "Yo" (Tu correo institucional/personal)
 *    - Quién tiene acceso (Who has access): "Cualquiera" (Anyone) <-- ¡CRÍTICO para permitir envíos directos!
 * 8. Haz clic en "Implementar". Concede los permisos que Google te solicite.
 * 9. Copia la "URL de la aplicación web" generada (termina en /exec).
 * 10. ¡Pega esa URL en la pestaña de Google Sheets de esta web app y presiona sincronizar!
 */

function doPost(e) {
  // CORS Preflight handles responses correctly
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };

  try {
    // Check if payload exists
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Payload vacío o inválido. Envía datos por POST en formato JSON."
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }

    // Parse the incoming JSON content
    var payload = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Check if the sheet is freshly empty and needs headers
    if (sheet.getLastRow() === 0) {
      var headerRow = [
        "ID Evaluación",
        "Fecha Registro",
        "Nombre Completo",
        "Correo Electrónico",
        "Teléfono",
        "Edad",
        "Licenciatura",
        "Nivel Académico vacante",
        "Materias Especialidad",
        "Experiencia Tipo",
        "Años de Experiencia",
        "Cursos y Certificaciones",
        "Autoevaluación (%)",
        "Puntaje Ponderado 360 (%)",
        "Dictamen de Reclutamiento",
        "R360: Observación de Clase (1-5)",
        "R360: Evaluación Directiva (1-5)",
        "R360: Opinión Estudiantes (1-5)",
        "R360: Opinión Padres (1-5)",
        "Áreas de Fortalecimiento Sugeridas",
        "Fortalezas (Abierta)",
        "Áreas de Mejora (Abierta)",
        "Temarios Deseados (Abierta)",
        "Retos Identificados (Abierta)"
      ];
      sheet.appendRow(headerRow);
      // Format header row to look professional
      var range = sheet.getRange(1, 1, 1, headerRow.length);
      range.setFontWeight("bold");
      range.setBackground("#fbcfe8"); // Light Pink background matching the design mood
      range.setFontColor("#1e293b"); // Deep slate label colors
      sheet.setFrozenRows(1);
    }

    // Formulate a beautiful display name
    var candidate = payload.candidate || {};
    var fullName = (candidate.nombre || "") + " " + (candidate.apellidoPaterno || "") + " " + (candidate.apellidoMaterno || "");
    
    // Map open answers nicely
    var openAnswers = payload.openAnswers || {};
    var open1 = openAnswers.open1 || "";
    var open2 = openAnswers.open2 || "";
    var open3 = openAnswers.open3 || "";
    var open4 = openAnswers.open4 || "";

    // Determine Dictamen category from overall weighted 360 score
    var r360 = payload.reviews360Group || {};
    var score360 = payload.score360Ponderado != null ? payload.score360Ponderado : 0;
    var dictamen = "No Idóneo";
    if (score360 >= 90) {
      dictamen = "Recomendado con Alta Prioridad";
    } else if (score360 >= 75) {
      dictamen = "Apto / Recomendado";
    } else if (score360 >= 60) {
      dictamen = "Apto con Plan de Acompañamiento";
    } else {
      dictamen = "Bajo Observación";
    }

    // Prepare row data values
    var rowData = [
      payload.id || "N/A",
      payload.date ? new Date(payload.date) : new Date(),
      fullName.trim() || "Anónimo",
      candidate.correo || "N/A",
      candidate.telefono || "N/A",
      candidate.edad || "",
      candidate.licenciatura || "",
      candidate.nivelEducativo || "",
      candidate.materias || "",
      candidate.experienciaTipo || "",
      candidate.experienciaTiempo || "",
      candidate.cursosCertificaciones || "",
      payload.overallCandidateSelfScore || 0,
      score360,
      dictamen,
      r360.observacionClase || "",
      r360.evaluacionDirectiva || "",
      r360.opinionEstudiantes || "",
      r360.opinionPadres || "",
      payload.fortalecimientoAreas ? payload.fortalecimientoAreas.join(", ") : "",
      open1,
      open2,
      open3,
      open4
    ];

    // Append to sheet
    sheet.appendRow(rowData);

    // Return friendly JSON response
    var responseOutput = JSON.stringify({
      status: "success",
      message: "¡La evaluación de " + fullName.trim() + " se guardó con éxito en Google Sheets!",
      rowInserted: sheet.getLastRow(),
      candidateName: fullName.trim()
    });

    return ContentService.createTextOutput(responseOutput)
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch(err) {
    // Handle error gracefully & return error details
    var errorOutput = JSON.stringify({
      status: "error",
      message: "Error de Apps Script al guardar datos.",
      details: err.toString()
    });
    
    return ContentService.createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

/**
 * Handles OPTIONS requests for CORS Preflight checks.
 * This prevents modern browsers from getting blocked on cross-origin script triggers.
 */
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}
