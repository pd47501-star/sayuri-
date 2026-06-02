import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, X, Link, Check, AlertCircle, Copy, 
  ExternalLink, HelpCircle, Save 
} from 'lucide-react';

interface SheetsConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (url: string) => void;
}

export const SheetsConnectionModal: React.FC<SheetsConnectionModalProps> = ({ 
  isOpen, 
  onClose,
  onSaved 
}) => {
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const savedUrl = localStorage.getItem('google_apps_script_url');
      if (savedUrl) {
        setAppsScriptUrl(savedUrl);
        setIsSaved(true);
      } else {
        setAppsScriptUrl('');
        setIsSaved(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appsScriptUrl.trim()) {
      alert("Por favor ingresa un enlace Web App válido.");
      return;
    }
    if (!appsScriptUrl.includes('script.google.com')) {
      alert("El enlace ingresado no parece ser de Google Apps Script. Debe empezar con 'https://script.google.com/macros/s/.../exec'");
      return;
    }
    
    const cleanUrl = appsScriptUrl.trim();
    localStorage.setItem('google_apps_script_url', cleanUrl);
    setIsSaved(true);
    if (onSaved) {
      onSaved(cleanUrl);
    }
    alert("¡Conector de Google Sheets configurado con éxito! Ahora puedes sincronizar tus evaluaciones desde cualquier reporte.");
  };

  const handleClear = () => {
    localStorage.removeItem('google_apps_script_url');
    setAppsScriptUrl('');
    setIsSaved(false);
    if (onSaved) {
      onSaved('');
    }
  };

  const handleCopyCode = () => {
    const rawCode = `/**
 * GOOGLE APPS SCRIPT: Conector de Evaluaciones Docentes
 * 
 * Este script vincula tu Web App con esta Hoja de Cálculo de Google.
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. En tu Hoja de Cálculo, ve al menú superior: Extensiones > Apps Script.
 * 2. Borra todo el código que aparezca por defecto.
 * 3. Pega este código completo.
 * 4. Guarda el proyecto (Ctrl+S).
 * 5. Haz clic en "Implementar" > "Nueva implementación".
 * 6. Tipo: "Aplicación web". Ejecutar como: "Yo". Quién tiene acceso: "Cualquiera" (Anyone).
 * 7. Copia la "URL de la aplicación web" generada (termina en /exec) y pégala en esta ventana.
 */

function doPost(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload vacío" }))
        .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }

    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      var headerRow = [
        "ID Evaluación", "Fecha Registro", "Nombre Completo", "Correo Electrónico", "Teléfono", 
        "Edad", "Licenciatura", "Nivel Académico vacante", "Materias Especialidad", 
        "Experiencia Tipo", "Años de Experiencia", "Cursos y Certificaciones", "Autoevaluación (%)", 
        "Puntaje Ponderado 360 (%)", "Dictamen de Reclutamiento", "R360: Observación de Clase (1-5)", 
        "R360: Evaluación Directiva (1-5)", "R360: Opinión Estudiantes (1-5)", "R360: Opinión Padres (1-5)", 
        "Áreas de Fortalecimiento Sugeridas", "Fortalezas (Abierta)", "Áreas de Mejora (Abierta)", 
        "Temarios Deseados (Abierta)", "Retos Identificados (Abierta)"
      ];
      sheet.appendRow(headerRow);
      var range = sheet.getRange(1, 1, 1, headerRow.length);
      range.setFontWeight("bold");
      range.setBackground("#fbcfe8"); 
      sheet.setFrozenRows(1);
    }

    var candidate = payload.candidate || {};
    var fullName = (candidate.nombre || "") + " " + (candidate.apellidoPaterno || "") + " " + (candidate.apellidoMaterno || "");
    var openAnswers = payload.openAnswers || {};
    var r360 = payload.reviews360Group || {};
    var score360 = payload.score360Ponderado || 0;
    
    var dictamen = "No Idóneo";
    if (score360 >= 90) dictamen = "Recomendado con Alta Prioridad";
    else if (score360 >= 75) dictamen = "Apto / Recomendado";
    else if (score360 >= 60) dictamen = "Apto con Plan de Acompañamiento";
    else dictamen = "Bajo Observación";

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
      openAnswers.open1 || "",
      openAnswers.open2 || "",
      openAnswers.open3 || "",
      openAnswers.open4 || ""
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "¡Guardado con éxito!",
      rowInserted: sheet.getLastRow(),
      candidateName: fullName.trim()
    })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", details: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}

function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT).setHeaders(headers);
}`;

    navigator.clipboard.writeText(rawCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-rose-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner header decoration */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </span>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none">Enlazar con Google Sheets</h3>
              <p className="text-rose-100 text-xs mt-1">Sincroniza evaluaciones en tiempo real sin bases de datos adicionales</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Form connection */}
          <div className="space-y-3.5 bg-rose-50/25 border border-rose-100/55 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 rounded-lg bg-pink-100/70 text-pink-700 font-extrabold text-[10px] uppercase">Paso Principal</span>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Enlace con Apps Script</h4>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Pega la <strong>URL de tu Aplicación Web / Apps Script</strong> (la dirección de Google que termina con <code className="bg-white/80 px-1 border border-slate-200 rounded text-rose-600 font-mono font-bold text-[10.5px]">/exec</code>) para activar la sincronización general de la app.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  type="url"
                  required
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  value={appsScriptUrl}
                  onChange={(e) => {
                    setAppsScriptUrl(e.target.value);
                    setIsSaved(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-rose-150 outline-none focus:ring-4 focus:ring-rose-250/20 text-xs bg-white text-slate-850"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-700 font-extrabold text-xs text-white rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar Conector
                </button>
              </div>

              {isSaved && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  ¡Enlace guardado y funcionando! Las evaluaciones ya mostrarán la pestaña activa de sincronización.
                  <button 
                    type="button" 
                    onClick={handleClear}
                    className="ml-auto text-slate-400 hover:text-rose-600 underline text-[10px] font-bold"
                  >
                    Desconectar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Quick instructions toggle */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 px-4 py-3 border-b border-slate-100 font-bold text-slate-700 text-xs flex justify-between items-center transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                ¿Cómo obtengo esta URL de Google Sheets? (Instrucciones Rápidas)
              </span>
              <span className="text-slate-400 font-bold text-xs">{showInstructions ? 'Ocultar' : 'Mostrar'}</span>
            </button>

            {showInstructions && (
              <div className="p-5 text-slate-600 text-xs space-y-3 leading-relaxed bg-white">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Abre tu archivo de <strong>Google Sheets (hoja de cálculo)</strong>.
                  </li>
                  <li>
                    En el menú superior, ingresa a <strong>Extensiones &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Haz clic en el botón de abajo para <strong>copiar el código conector</strong> y pégalo todo allí dentro, borrando el que venga por defecto.
                  </li>
                  <li>
                    Presiona el botón de guardar (icono de disquete 💾).
                  </li>
                  <li>
                    Haz clic en el botón azul de la esquina superior derecha: <strong>Implementar &gt; Nueva implementación</strong>.
                  </li>
                  <li>
                    Haz clic en la tuerca ⚙️ de "Tipo" y selecciona <strong>Aplicación web</strong>.
                  </li>
                  <li>
                    Importante: En "Quién tiene acceso" selecciona <strong>Cualquiera (Anyone)</strong>, y en "Ejecutar como" selecciona <strong>Yo (tu correo)</strong>.
                  </li>
                  <li>
                    Haz clic en "Implementar", autoriza los accesos de Google y copia la URL que te otorgan terminada en <code className="font-bold text-rose-500">/exec</code>. ¡Y pégala en el campo de arriba!
                  </li>
                </ol>
                
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopyCode}
                    className="flex-1 px-4 py-2.5 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition hover:bg-slate-800 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    {copiedCode ? '¡Código Copiado!' : 'Copiar Código de Apps Script'}
                  </button>
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="referrer noopener"
                    className="flex-1 px-4 py-2.5 border border-rose-200 text-rose-600 bg-white hover:bg-rose-50 font-bold rounded-xl flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Crear Hoja de Cálculo Nueva
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between text-slate-500 text-[11px]">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            La conexión se guarda localmente en tu navegador de forma segura.
          </span>
          <button
            onClick={onClose}
            className="text-rose-650 hover:underline font-bold cursor-pointer"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
};
