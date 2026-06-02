import React, { useState, useEffect } from 'react';
import { CandidateData, TeacherEvaluation } from './types';
import { CATEGORIES, LIKERT_QUESTIONS, OPEN_QUESTIONS, AREAS_FORTALECIMIENTO } from './data/questions';
import { CandidateForm } from './components/CandidateForm';
import { ScoreDashboard } from './components/ScoreDashboard';
import { 
  TeacherIllustration, ClassroomBannerDoodle, PencilDoodle, AppleDoodle, BookDoodle
} from './components/EducationalDoodles';
import { 
  Sparkles, BookOpen, Heart, Award, CheckCircle, ChevronLeft, 
  ChevronRight, GraduationCap, UserCheck, ShieldAlert, Users, 
  Laptop, MessageCircle, Info, Calendar, Trash2, ListFilter, ClipboardCheck, ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { SheetsConnectionModal } from './components/SheetsConnectionModal';

const LOCAL_STORAGE_KEY = 'docente_evaluations_v1';

const INITIAL_CANDIDATE: CandidateData = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  edad: "",
  experienciaTipo: "",
  experienciaTiempo: "",
  licenciatura: "",
  telefono: "",
  correo: "",
  nivelEducativo: "",
  materias: "",
  cursosCertificaciones: ""
};

// Demo candidate to prevent empty state & let recruiters immediately explore
const DEMO_EVALUATION: TeacherEvaluation = {
  id: "demo-candidato-1",
  candidate: {
    nombre: "Gabriela",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "Castillo",
    edad: 29,
    experienciaTipo: "Docente de Primaria General",
    experienciaTiempo: 4,
    licenciatura: "Licenciatura en Ciencias de la Educación",
    telefono: "2225893421",
    correo: "gabriela.perez@edu.mx",
    nivelEducativo: "Primaria Primarios",
    materias: "Español, Ciencias Naturales, Geografía",
    cursosCertificaciones: "Diplomado en Educación Emocional para el Aula, Certificado Google Educator L2"
  },
  answers: {
    // Pedagogía
    q1: 5, q2: 4, q3: 4, q4: 5, q5: 4, q6: 5,
    // Gestión
    q7: 4, q8: 5, q9: 4, q10: 5, q11: 4,
    // Blandas (High levels!)
    q12: 5, q13: 5, q14: 4, q15: 5, q16: 4, q17: 5, q18: 5, q19: 4, q20: 5, q21: 4,
    // Inclusión
    q22: 4, q23: 5, q24: 5, q25: 4, q26: 4,
    // Tecnología
    q27: 4, q28: 4, q29: 3, q30: 4,
    // Comunidad
    q31: 5, q32: 4, q33: 4, q34: 5,
    // Ética
    q35: 5, q36: 5, q37: 5, q38: 5
  },
  openAnswers: {
    open1: "Mi mayor fortaleza es la empatía para entender las barreras emocionales de mis alumnos de primaria y conectar con ellos mediante el juego pedagógico.",
    open2: "Me gustaría aprender a dominar de forma más avanzada la evaluación formativa mediante portafolios de evidencias interactivos.",
    open3: "Metodologías de aula invertida (Flipped Classroom) aplicadas a escuelas públicas.",
    open4: "El rezago post-pandémico y la falta de internet estable en ciertos planteles públicos."
  },
  fortalecimientoAreas: ["evaluacion", "tec_educativa", "inte_emocional"],
  date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
  reviews360Group: {
    autoevaluacion: 90,
    evaluacionDirectiva: 4.5,
    observacionClase: 4,
    opinionEstudiantes: 5,
    opinionPadres: 4
  }
};

export default function App() {
  const [viewStep, setViewStep] = useState<'welcome' | 'register' | 'questions' | 'dashboard'>('welcome');
  const [candidate, setCandidate] = useState<CandidateData>(INITIAL_CANDIDATE);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});
  const [fortalecimiento, setFortalecimiento] = useState<string[]>([]);
  const [evaluationsList, setEvaluationsList] = useState<TeacherEvaluation[]>([]);
  const [activeEvaluation, setActiveEvaluation] = useState<TeacherEvaluation | null>(null);

  // Pagination index for questionnaires categories (Page 0 to 8)
  const [sectionIndex, setSectionIndex] = useState(0);

  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isSheetsLinked, setIsSheetsLinked] = useState(false);

  const checkSheetsLink = () => {
    const savedUrl = localStorage.getItem('google_apps_script_url');
    setIsSheetsLinked(!!savedUrl);
  };

  useEffect(() => {
    checkSheetsLink();
    window.addEventListener('storage', checkSheetsLink);
    return () => window.removeEventListener('storage', checkSheetsLink);
  }, []);

  // Loads evaluations on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TeacherEvaluation[];
        if (parsed.length > 0) {
          setEvaluationsList(parsed);
        } else {
          // Initialize with demo candidate
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([DEMO_EVALUATION]));
          setEvaluationsList([DEMO_EVALUATION]);
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([DEMO_EVALUATION]));
        setEvaluationsList([DEMO_EVALUATION]);
      }
    } catch (e) {
      console.error("Failed to load custom evaluations:", e);
    }
  }, []);

  // Save evaluations
  const saveEvaluationsToStorage = (list: TeacherEvaluation[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      setEvaluationsList(list);
    } catch (e) {
      console.error("Failed to save evaluations:", e);
    }
  };

  const handleStartRegister = () => {
    setCandidate(INITIAL_CANDIDATE);
    setAnswers({});
    setOpenAnswers({});
    setFortalecimiento([]);
    setSectionIndex(0);
    setViewStep('register');
  };

  const handleCandidateSubmit = (data: CandidateData) => {
    setCandidate(data);
    setSectionIndex(0);
    setViewStep('questions');
  };

  // Sections definitions
  const LIKERT_SECTIONS = Object.keys(CATEGORIES); // 7 sections
  const totalQuizSections = LIKERT_SECTIONS.length + 2; // 7 categories + 1 autoevaluacion (open) + 1 fortalecimiento = 9 steps

  // Subquestions filters
  const getCurrentSectionQuestions = () => {
    if (sectionIndex < LIKERT_SECTIONS.length) {
      const categoryId = LIKERT_SECTIONS[sectionIndex];
      return LIKERT_QUESTIONS.filter(q => q.category === categoryId);
    }
    return [];
  };

  const handleLikertAnswer = (questionId: string, rating: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleOpenAnswerChange = (qId: string, text: string) => {
    setOpenAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const toggleFortalecimiento = (id: string) => {
    setFortalecimiento(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Navigation handlers
  const handlePrevSection = () => {
    if (sectionIndex > 0) {
      setSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewStep('register');
    }
  };

  const handleNextSection = () => {
    // Validate that all questions in the current section are answered
    if (sectionIndex < LIKERT_SECTIONS.length) {
      const currentQuestions = getCurrentSectionQuestions();
      const unanswered = currentQuestions.filter(q => !answers[q.id]);
      if (unanswered.length > 0) {
        alert("Por favor califica todos los indicadores antes de proseguir.");
        return;
      }
    }

    if (sectionIndex < totalQuizSections - 1) {
      setSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Build Evaluation Object and Save
      const newEvaluation: TeacherEvaluation = {
        id: `candidato-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        candidate,
        answers,
        openAnswers,
        fortalecimientoAreas: fortalecimiento,
        date: new Date().toISOString(),
        reviews360Group: {
          autoevaluacion: 75, // arbitrary default, recalculated dynamically inside component
          evaluacionDirectiva: 4,
          observacionClase: 4,
          opinionEstudiantes: 4,
          opinionPadres: 4
        }
      };

      const newList = [newEvaluation, ...evaluationsList];
      saveEvaluationsToStorage(newList);
      setActiveEvaluation(newEvaluation);
      setViewStep('dashboard');
    }
  };

  // Recruiter triggers specific candidate view
  const handleSelectEvaluation = (evalObj: TeacherEvaluation) => {
    setActiveEvaluation(evalObj);
    setViewStep('dashboard');
  };

  // Recruiter deletes specific candidate profile from database
  const handleDeleteEvaluation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro que deseas eliminar esta evaluación archivada permanentemente?")) {
      const filtered = evaluationsList.filter(item => item.id !== id);
      saveEvaluationsToStorage(filtered);
      if (activeEvaluation?.id === id) {
        setActiveEvaluation(null);
        setViewStep('welcome');
      }
    }
  };

  // Update evaluation internally (for 360 sliders interaction)
  const handleUpdateEvaluation = (updated: TeacherEvaluation) => {
    setActiveEvaluation(updated);
    const index = evaluationsList.findIndex(e => e.id === updated.id);
    if (index !== -1) {
      const updatedList = [...evaluationsList];
      updatedList[index] = updated;
      saveEvaluationsToStorage(updatedList);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-rose-50/70 via-pink-50/50 to-rose-100/40 min-h-screen text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Dynamic header with school doodles icons style */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-rose-100 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl text-white shadow-md shadow-rose-250 animate-pulse">
            <ClipboardCheck className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg text-slate-800 tracking-tight leading-none">Evaluador Docente</h1>
              <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full select-none">Básica</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Enfoque en Habilidades Blandas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Sheets Quick Link Button */}
          <button
            onClick={() => setIsSheetsModalOpen(true)}
            className={`px-3.5 py-2 border rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer select-none ${
              isSheetsLinked 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/80'
            }`}
            title="Enlazar con Google Sheets o Excel"
          >
            <FileSpreadsheet className={`w-4 h-4 ${isSheetsLinked ? 'text-emerald-600' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">
              {isSheetsLinked ? 'Sheets Conectado 🟢' : 'Enlazar Google Sheets 📊'}
            </span>
            <span className="sm:hidden">
              {isSheetsLinked ? 'Sheets 🟢' : 'Sheets 📊'}
            </span>
          </button>

          {viewStep !== 'welcome' && (
            <button
              onClick={() => {
                setViewStep('welcome');
                setActiveEvaluation(null);
              }}
              className="px-4 py-2 text-rose-600 bg-rose-50/50 hover:bg-rose-100 border border-rose-100 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Volver al Inicio
            </button>
          )}
        </div>
      </header>

      {/* Main body Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {viewStep === 'welcome' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side onboarding column */}
            <div className="lg:col-span-7 space-y-8 bg-white/40 p-6 sm:p-8 rounded-3xl border border-rose-50">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 bg-rose-100/90 border border-rose-200 text-rose-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  Educación Básica Interactiva
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                  Evaluemos con <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Empatía</span> y del <span className="underline decoration-pink-300 decoration-wavy">Saber Pedagógico</span>.
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                  La contratación de docentes requiere diagnosticar no solo su conocimiento curricular, sino también su <strong>Inteligencia Emocional, Inteligencia Social y Capacidad Integradora</strong>. Nuestra plataforma evalúa de forma didáctica estas aptitudes.
                </p>
              </div>

              {/* Core evaluation guidelines columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-rose-50 shadow-sm flex gap-3">
                  <span className="p-2 bg-rose-50 rounded-xl text-rose-500 shrink-0 h-10 w-10 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-rose-100" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Foco Socioemocional</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Empatía profunda, resolución pacífica de conflictos de grado y comunicación asertiva docente.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-rose-50 shadow-sm flex gap-3">
                  <span className="p-2 bg-yellow-50 rounded-xl text-yellow-600 shrink-0 h-10 w-10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Dominio Didáctico</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Metodologías activas, planeaciones escolares adaptativas, inclusión y tecnologías educativas.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center">
                <button
                  onClick={handleStartRegister}
                  id="start-assessment-welcome-btn"
                  className="px-8 py-5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-200 hover:shadow-2xl hover:shadow-rose-300 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer group shrink-0"
                >
                  Comenzar tu evaluación
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSheetsModalOpen(true)}
                  className={`px-6 py-5 border font-extrabold text-xs rounded-2xl transition-all duration-350 cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                    isSheetsLinked 
                      ? 'bg-emerald-55 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50/50 hover:border-rose-300'
                  }`}
                >
                  <FileSpreadsheet className={`w-4 h-4 ${isSheetsLinked ? 'text-emerald-600' : 'text-rose-500'}`} />
                  {isSheetsLinked ? 'Sheets Enlazado 🟢' : 'Configurar Google Sheets 📊'}
                </button>
              </div>
            </div>

            {/* Right side interactive recruiter database column */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              
              {/* Cute graphic representation */}
              <div className="bg-gradient-to-br from-pink-100/70 to-rose-200/50 rounded-3xl p-6 border border-pink-200 flex flex-col items-center text-center shadow-inner">
                <TeacherIllustration className="w-full max-w-sm h-56" />
                <span className="text-[11px] font-extrabold text-rose-500 uppercase tracking-widest mt-2 block">Doodles Docentes Interactivos ✏️</span>
              </div>

              {/* HR / Recruiter Panel list */}
              <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl shadow-rose-50/50">
                <div className="flex items-center justify-between border-b border-rose-50 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <ListFilter className="w-4 h-4" />
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Aspirantes Registrados (HR)</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full">{evaluationsList.length}</span>
                </div>

                <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                  {evaluationsList.map(item => {
                    const sampleDate = new Date(item.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectEvaluation(item)}
                        className="p-3.5 bg-slate-50 hover:bg-rose-50/30 border border-slate-200/60 hover:border-rose-250 rounded-2xl cursor-pointer transition duration-150 flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-700 text-sm group-hover:text-rose-600 truncate">
                            {item.candidate.nombre} {item.candidate.apellidoPaterno}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                            {item.candidate.nivelEducativo} • {item.candidate.licenciatura}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-[10px] font-mono font-bold text-slate-405">{sampleDate}</span>
                          <button
                            onClick={(e) => handleDeleteEvaluation(item.id, e)}
                            className="p-1.5 text-slate-350 hover:text-red-500 hover:bg-white rounded-lg transition"
                            title="Eliminar candidato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {evaluationsList.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No hay registros aún. Inicia una evaluación para registrar uno nuevo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewStep === 'register' && (
          <CandidateForm 
            initialData={candidate} 
            onSubmit={handleCandidateSubmit} 
          />
        )}

        {viewStep === 'questions' && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header progress tracker */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] text-rose-500 uppercase font-extrabold tracking-widest block mb-0.5">Diagnóstico Pedagógico</span>
                  <h3 className="font-extrabold text-slate-800 text-base">Cuestionario de Ingreso Docente</h3>
                </div>
                {/* Horizontal Progress bar steps dots */}
                <div className="flex gap-1">
                  {Array.from({ length: totalQuizSections }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2.5 rounded-full transition-all duration-300 ${idx === sectionIndex ? 'w-8 bg-rose-500' : idx < sectionIndex ? 'w-2.5 bg-rose-300' : 'w-2.5 bg-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Progress text */}
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mt-4 pt-4 border-t border-slate-100">
                <span>Eje {sectionIndex + 1} de {totalQuizSections}</span>
                <span>Progreso General: {Math.round((sectionIndex / totalQuizSections) * 100)}%</span>
              </div>
            </div>

            {/* MAIN QUESTIONNAIRE PANEL */}
            <div className="bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-50 overflow-hidden">
              
              {/* LIKERT QUESTIONS PAGES (Page 0 to 6) */}
              {sectionIndex < LIKERT_SECTIONS.length && (() => {
                const categoryId = LIKERT_SECTIONS[sectionIndex];
                const info = CATEGORIES[categoryId];
                const currentQuestions = getCurrentSectionQuestions();

                return (
                  <div>
                    {/* Page Title & category description */}
                    <div className="p-8 sm:p-10 bg-rose-50/40 border-b border-rose-100 flex flex-col sm:flex-row gap-6 items-start">
                      <div className="p-3 bg-white border border-rose-200 text-rose-600 rounded-2xl shrink-0 shadow-sm">
                        {renderSectionHeaderIcon(info.iconName)}
                      </div>
                      <div>
                        <div className="inline-block bg-pink-100 rounded-md text-[10px] text-pink-700 uppercase font-extrabold px-3 py-1 mb-2 tracking-wide">
                          Eje Pedagógico
                        </div>
                        <h4 className="font-black text-slate-800 text-xl tracking-tight leading-snug">{info.title}</h4>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{info.description}</p>
                      </div>
                    </div>

                    {/* Questions items row list */}
                    <div className="p-8 sm:p-10 divide-y divide-slate-100">
                      {currentQuestions.map((q, idx) => {
                        const scoreSelected = answers[q.id] || 0;
                        return (
                          <div key={q.id} className={`py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${idx === 0 ? 'pt-0' : ''}`}>
                            <div className="max-w-xl">
                              <span className="text-xs font-mono font-extrabold text-rose-400 uppercase tracking-widest block mb-1">Indicador {idx + 1}</span>
                              <p className="text-slate-700 font-extrabold text-sm leading-relaxed">{q.text}</p>
                              {q.importance === 'high' && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-2">
                                  <Heart className="w-3 h-3 fill-emerald-100" /> Habilidad Blanda Crítica
                                </span>
                              )}
                            </div>

                            {/* Tactile 1-5 Likert scale selectors with labels list */}
                            <div className="flex flex-col sm:flex-row gap-2 shrink-0 sm:items-center">
                              <div className="flex gap-2.5">
                                {[1, 2, 3, 4, 5].map((val) => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => handleLikertAnswer(q.id, val)}
                                    className={`w-11 h-11 rounded-2xl font-bold font-mono text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer border ${
                                      scoreSelected === val 
                                        ? 'bg-rose-500 text-white border-rose-500 ring-4 ring-rose-200' 
                                        : 'bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-rose-50/50 hover:border-rose-200'
                                    }`}
                                    title={getLikertText(val)}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 text-center sm:text-left sm:min-w-[100px] block mt-1">
                                {scoreSelected > 0 ? `→ ${getLikertText(scoreSelected)}` : "Elige de 1 a 5"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* OPENS QUESTIONS PAGE (Page Index 7) */}
              {sectionIndex === LIKERT_SECTIONS.length && (
                <div>
                  <div className="p-8 sm:p-10 bg-pink-50/40 border-b border-rose-100 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="p-3 bg-white border border-rose-200 text-rose-600 rounded-2xl shrink-0 shadow-sm animate-bounce">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-block bg-pink-100 rounded-md text-[10px] text-pink-700 uppercase font-extrabold px-3 py-1 mb-2 tracking-wide">
                        Eje 8: Autodiagnóstico
                      </div>
                      <h4 className="font-black text-slate-800 text-xl tracking-tight leading-snug">Autoevaluación Docente Reflexiva</h4>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">Describe tu propia práctica docente. Las respuestas abiertas proveen contexto sobre tus fortalezas reflexivas y necesidades inmediatas de apoyo.</p>
                    </div>
                  </div>

                  <div className="p-8 sm:p-10 space-y-8">
                    {OPEN_QUESTIONS.map((oq, index) => (
                      <div key={oq.id} className="space-y-2">
                        <label className="block text-slate-700 text-xs font-extrabold uppercase tracking-wide">
                          {index + 1}. {oq.text}
                        </label>
                        <textarea
                          placeholder={oq.placeholder}
                          value={openAnswers[oq.id] || ""}
                          onChange={(e) => handleOpenAnswerChange(oq.id, e.target.value)}
                          className="w-full h-24 p-4 bg-rose-50/10 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-250 text-xs text-slate-750 leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STRENGTHENING PREFERENCE CHECKLIST (Page Index 8) */}
              {sectionIndex === LIKERT_SECTIONS.length + 1 && (
                <div>
                  <div className="p-8 sm:p-10 bg-amber-50/30 border-b border-rose-100 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="p-3 bg-white border border-rose-200 text-amber-500 rounded-2xl shrink-0 shadow-sm">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-block bg-amber-100 rounded-md text-[10px] text-amber-800 uppercase font-extrabold px-3 py-1 mb-2 tracking-wide">
                        Eje Final: Capacitaciones
                      </div>
                      <h4 className="font-black text-slate-800 text-xl tracking-tight leading-snug">Áreas de Fortalecimiento Sugeridas</h4>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">Selecciona los rubros o temáticas donde consideras indispensable recibir capacitación continua y materiales escolares para robustecer tu quehacer diario.</p>
                    </div>
                  </div>

                  <div className="p-8 sm:p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {AREAS_FORTALECIMIENTO.map(item => {
                        const isChecked = fortalecimiento.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleFortalecimiento(item.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                              isChecked 
                                ? 'bg-pink-50 border-pink-300 shadow-md shadow-pink-100/50' 
                                : 'bg-slate-50 border-slate-205 hover:bg-rose-50/10'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-700">{item.label}</span>
                            <div className={`w-5 h-5 rounded-full border border-pink-400 flex items-center justify-center shrink-0 ${isChecked ? 'bg-pink-500 text-white' : 'bg-white'}`}>
                              {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER CONTROLS ROW */}
              <div className="px-8 py-5 bg-slate-50 border-t border-rose-50 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevSection}
                  className="px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>

                <button
                  type="button"
                  onClick={handleNextSection}
                  className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-md hover:shadow-lg"
                >
                  {sectionIndex === totalQuizSections - 1 ? "Generar Mi Evaluación" : "Avanzar Sección"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {viewStep === 'dashboard' && activeEvaluation && (
          <ScoreDashboard 
            evaluation={activeEvaluation} 
            onReset={() => setViewStep('welcome')}
            onUpdateEvaluation={handleUpdateEvaluation}
          />
        )}
      </main>

      {/* Classroom layout banner doodle footer */}
      <ClassroomBannerDoodle />

      <footer className="bg-white border-t border-rose-50 text-center py-6 text-[10px] text-slate-400 font-medium">
        Plataforma de Evaluación Docente de Educación Básica SED • Habilidades Blandas Calibración 360° • UVP 2026
      </footer>

      {/* Connection Modal */}
      <SheetsConnectionModal 
        isOpen={isSheetsModalOpen} 
        onClose={() => setIsSheetsModalOpen(false)} 
        onSaved={checkSheetsLink}
      />

    </div>
  );
}

// Helper to render section icons nicely inside questionnaire steps
function renderSectionHeaderIcon(iconName: string) {
  const props = { className: "w-6 h-6 text-rose-500" };
  switch (iconName) {
    case 'BookOpen': return <BookOpen {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Laptop': return <Laptop {...props} />;
    case 'MessageCircle': return <MessageCircle {...props} />;
    default: return <ShieldAlert {...props} />;
  }
}

// Convert numbers into standard Spanish Likert Scale Labels
function getLikertText(val: number) {
  switch (val) {
    case 1: return "Nunca";
    case 2: return "Casi nunca";
    case 3: return "A veces";
    case 4: return "Frecuentemente";
    case 5: return "Siempre";
    default: return "";
  }
}

// Dummy helper to resolve standard icons safely inside category containers
interface LayersIconProps { className?: string }
const Layers: React.FC<LayersIconProps> = ({ className }) => <BookOpen className={className} />;
