import React, { useState, useMemo } from 'react';
import { TeacherEvaluation, LikertScale } from '../types';
import { CATEGORIES, LIKERT_QUESTIONS, OPEN_QUESTIONS, AREAS_FORTALECIMIENTO } from '../data/questions';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { 
  Heart, BookOpen, Layers, Users, Laptop, MessageCircle, 
  ShieldAlert, Award, FileText, Printer, CheckCircle2, 
  AlertTriangle, RefreshCw, ArrowRightLeft, BookMarked, UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { EmpathyIllustration } from './EducationalDoodles';
import { SheetsSyncPanel } from './SheetsSyncPanel';

interface ScoreDashboardProps {
  evaluation: TeacherEvaluation;
  onReset: () => void;
  onUpdateEvaluation: (updated: TeacherEvaluation) => void;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ evaluation, onReset, onUpdateEvaluation }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'blandas' | 'eval360' | 'respuestas' | 'sheets'>('overview');
  const [showPrintMode, setShowPrintMode] = useState(false);

  // 1. Calculate scores per category based on Candidate's responses
  const categoryStats = useMemo(() => {
    // Initialize
    const stats: Record<string, { total: number; count: number; max: number }> = {};
    Object.keys(CATEGORIES).forEach(key => {
      stats[key] = { total: 0, count: 0, max: 0 };
    });

    LIKERT_QUESTIONS.forEach(q => {
      const answer = evaluation.answers[q.id] || 3; // Default to neutral if missing
      if (stats[q.category]) {
        stats[q.category].total += answer;
        stats[q.category].count += 1;
        stats[q.category].max += 5;
      }
    });

    return Object.entries(stats).map(([key, value]) => {
      const avg = value.count > 0 ? Number((value.total / value.count).toFixed(2)) : 0;
      const percentage = value.max > 0 ? Math.round((value.total / value.max) * 100) : 0;
      return {
        key,
        name: CATEGORIES[key]?.title || key,
        alias: CATEGORIES[key]?.title.split(' ')[0] || key, // short name
        avg,
        percentage,
        color: CATEGORIES[key]?.color || 'pink',
        count: value.count
      };
    });
  }, [evaluation.answers]);

  // Overall candidate self-evaluation score
  const overallCandidateScore = useMemo(() => {
    if (categoryStats.length === 0) return 0;
    const sum = categoryStats.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / categoryStats.length);
  }, [categoryStats]);

  // 2. Specific Soft Skills Mapping (Habilidades Blandas - 10 questions)
  const softSkillsDetails = useMemo(() => {
    const questions = LIKERT_QUESTIONS.filter(q => q.category === 'blandas');
    const labelsMap: Record<string, { name: string; desc: string }> = {
      q12: { name: "Escucha Activa", desc: "Escucha opiniones de estudiantes con absoluto respeto y atención." },
      q13: { name: "Empatía Docente", desc: "Sensibilidad y comprensión de necesidades socioemocionales de alumnos." },
      q14: { name: "Actitud Positiva", desc: "Mantiene el optimismo ante el cansancio o situaciones críticas de aula." },
      q15: { name: "Trabajo en Equipo", desc: "Colabora asertivamente con el cuerpo de profesores y asesores." },
      q16: { name: "Apertura al Feedback", desc: "Aceptación constructiva de sugerencias de directores y directivas." },
      q17: { name: "Adaptabilidad", desc: "Capacidad de adaptarse ágilmente a cambios metodológicos de nivel." },
      q18: { name: "Promoción Inclusiva", desc: "Crea ambientes escolares equitativos e incluyentes." },
      q19: { name: "Inteligencia Emocional", desc: "Autorregulación del estrés y balance emocional frente a incidentes." },
      q20: { name: "Liderazgo Motivador", desc: "Habilidad para encender el interés duradero por el estudio académico." },
      q21: { name: "Servicio a la Comunidad", desc: "Facilidad de colaboración con padres de familia y docentes dadores." }
    };

    return questions.map(q => {
      const value = evaluation.answers[q.id] || 3;
      return {
        id: q.id,
        skill: labelsMap[q.id]?.name || "Habilidad Blanda",
        desc: labelsMap[q.id]?.desc || q.text,
        score: value,
        percentage: Math.round((value / 5) * 100)
      };
    });
  }, [evaluation.answers]);

  // Soft Skills Overall Average
  const softSkillsAverage = useMemo(() => {
    const total = softSkillsDetails.reduce((acc, curr) => acc + curr.score, 0);
    return softSkillsDetails.length > 0 ? Number((total / softSkillsDetails.length).toFixed(1)) : 0;
  }, [softSkillsDetails]);

  // 3. Consolidated 360° Assessment Score weighting
  // 360 weights (Autoevaluación: 40%, Observación clase: 25%, Evaluación Directiva: 15%, Opinión Alumnos: 10%, Opinión Padres: 10%)
  const consolidated360Score = useMemo(() => {
    const { evaluacionDirectiva, observacionClase, opinionEstudiantes, opinionPadres } = evaluation.reviews360Group;
    const autoPct = overallCandidateScore; // 0 - 100
    // Sliders are 1-5, convert to percentage
    const dirPct = (evaluacionDirectiva / 5) * 100;
    const obsPct = (observacionClase / 5) * 100;
    const estPct = (opinionEstudiantes / 5) * 100;
    const pdrPct = (opinionPadres / 5) * 100;

    const final = (autoPct * 0.35) + (obsPct * 0.30) + (dirPct * 0.15) + (estPct * 0.10) + (pdrPct * 0.10);
    return Math.round(final);
  }, [overallCandidateScore, evaluation.reviews360Group]);

  // Hiring Recommendation Category
  const hiringRecommendation = useMemo(() => {
    const score = consolidated360Score;
    if (score >= 90) {
      return {
        label: "Recomendado con Alta Prioridad",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
        pillColor: "bg-emerald-500",
        message: "El docente exhibe un perfil excepcional, con sobresaliente madurez socioemocional (habilidades blandas) y sólidos conocimientos pedagógicos. Excelente candidato para contratación inmediata."
      };
    } else if (score >= 75) {
      return {
        label: "Apto / Recomendado",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        pillColor: "bg-blue-500",
        message: "El docente es completamente apto para impartir clases en educación básica. Cuenta con habilidades interpersonales y disciplinares en rangos óptimos. Se sugiere un plan introductorio estándar."
      };
    } else if (score >= 60) {
      return {
        label: "Apto con Plan de Acompañamiento",
        color: "bg-amber-100 text-amber-800 border-amber-300",
        pillColor: "bg-amber-500",
        message: "Apto para contratación, pero requiere fortalecimiento técnico o contención en áreas de tecnología u organización del aula. Se aconseja asignarle un mentor durante su primer ciclo escolar."
      };
    } else {
      return {
        label: "Bajo Observación / No Idóneo",
        color: "bg-rose-100 text-rose-800 border-rose-300",
        pillColor: "bg-rose-500",
        message: "Las puntuaciones demuestran áreas críticas de atención en gestión conductual del grupo, empatía escolar o autorregulación emocional. No se aconseja contratación sin antes someterse a entrevistas más rigurosas o simulaciones presenciales."
      };
    }
  }, [consolidated360Score]);

  // Handler for recruiter 360 evaluations update
  const handleReview360Change = (name: keyof typeof evaluation.reviews360Group, val: number) => {
    const updated = {
      ...evaluation,
      reviews360Group: {
        ...evaluation.reviews360Group,
        [name]: val
      }
    };
    onUpdateEvaluation(updated);
  };

  const formattedDate = new Date(evaluation.date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Category Icon Component helper
  const renderCategoryIcon = (iconName: string, colorClass: string) => {
    const props = { className: `w-5 h-5 ${colorClass}` };
    switch (iconName) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'MessageCircle': return <MessageCircle {...props} />;
      default: return <ShieldAlert {...props} />;
    }
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${showPrintMode ? 'bg-white p-6 shadow-none border-none' : ''}`}>
      
      {/* Mini top toolbar */}
      {!showPrintMode && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-rose-100 px-6 py-4 rounded-2xl shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-rose-50 rounded-lg text-rose-500">
              <UserCheck className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Docente Evaluado</p>
              <h4 className="font-bold text-slate-800">{evaluation.candidate.nombre} {evaluation.candidate.apellidoPaterno} {evaluation.candidate.apellidoMaterno}</h4>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-slate-600 border border-slate-200 hover:bg-slate-50 font-medium rounded-xl text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Imprimir Reporte
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Nueva Evaluación
            </button>
          </div>
        </div>
      )}

      {/* Main Print Layout / Interactive Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-rose-100 relative overflow-hidden">
        {/* Playful Doodles sitting in background */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 20 C35 20, 25 35, 25 50 C25 65, 35 80, 50 80 C65 80, 75 65, 75 50 C75 35, 65 20, 50 20 Z M50 90 L50 95 C50 98, 48 100, 45 100 C42 100, 40 98, 40 95 L40 90 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-block bg-white/20 border border-white/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Folio de Evaluación de Ingreso
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Reporte de Aptitudes Pedagógicas
            </h1>
            <p className="text-rose-100 text-sm mt-3 max-w-xl">
              Candidato(a): <strong>{evaluation.candidate.nombre} {evaluation.candidate.apellidoPaterno} {evaluation.candidate.apellidoMaterno}</strong> ({evaluation.candidate.edad} años)<br />
              Nivel: <strong>{evaluation.candidate.nivelEducativo}</strong> | Especialidad: {evaluation.candidate.materias}<br />
              Fecha de Registro: {formattedDate}
            </p>
          </div>

          {/* Interactive Unified Weighted Circle */}
          <div className="flex flex-col items-center bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 text-center shrink-0 min-w-48">
            <p className="text-xs uppercase font-extrabold tracking-widest text-pink-100 mb-1">Evaluación 360°</p>
            <div className="relative flex items-center justify-center my-2">
              <svg className="w-24 h-24">
                <circle cx="48" cy="48" r="40" className="stroke-white/20 fill-none" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" className="stroke-white fill-none" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * consolidated360Score) / 100} strokeLinecap="round" />
              </svg>
              <span className="absolute text-2xl font-black">{consolidated360Score}%</span>
            </div>
            <p className="text-xs font-semibold text-rose-50">Score Ponderado</p>
          </div>
        </div>
      </div>

      {/* HIRING RECOMMENDATION WARNING BANNER */}
      <div className={`p-6 rounded-2xl border ${hiringRecommendation.color} flex flex-col sm:flex-row gap-4 items-start shadow-sm`}>
        <div className={`p-3 rounded-xl shrink-0 ${hiringRecommendation.pillColor} text-white`}>
          <GiftOrBadge hiringScore={consolidated360Score} />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wide opacity-85">Dictamen de Reclutamiento & Habilidades Blandas</span>
          <h4 className="text-xl font-extrabold tracking-tight mt-0.5">{hiringRecommendation.label}</h4>
          <p className="text-sm mt-1.5 opacity-90 leading-relaxed">{hiringRecommendation.message}</p>
        </div>
      </div>

      {/* NAVIGATION TABS FOR HR VIEWS */}
      {!showPrintMode && (
        <div className="flex border-b border-rose-100 overflow-x-auto gap-4 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-bold border-b-2 text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === 'overview' ? 'border-rose-500 text-rose-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Vista General de Competencias
          </button>
          <button
            onClick={() => setActiveTab('blandas')}
            className={`py-3 px-4 font-bold border-b-2 text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'blandas' ? 'border-rose-500 text-rose-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Heart className="w-4 h-4 text-emerald-500 fill-emerald-100" />
            Habilidades Blandas (Crítico)
          </button>
          <button
            onClick={() => setActiveTab('eval360')}
            className={`py-3 px-4 font-bold border-b-2 text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'eval360' ? 'border-rose-500 text-rose-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
            Calibrador 360° (Directivo / Alumnos)
          </button>
          <button
            onClick={() => setActiveTab('respuestas')}
            className={`py-3 px-4 font-bold border-b-2 text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === 'respuestas' ? 'border-rose-500 text-rose-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Autoevaluación Abierta
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-4 font-bold border-b-2 text-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'sheets' ? 'border-rose-500 text-rose-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileSpreadsheet className="w-4 h-4 text-pink-500" />
            Sincronización Sheets / Excel
          </button>
        </div>
      )}

      {/* TAB CONTENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO-COLUMNS PANEL */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {(activeTab === 'overview' || showPrintMode) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-500" /> Desempeño por Eje Pedagógico
                </h3>
                <p className="text-slate-400 text-xs mt-1">Comparativa porcentual del docente basada en los reactivos evaluados en el sistema.</p>
              </div>

              {/* RECHARTS SIMPLE BAR GRAPH (PINK INSPIRED) */}
              <div className="h-64 sm:h-80 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="alias" stroke="#94a3b8" fontSize={11} strokeLinecap="round" />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Cumplimiento']} 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #fecdd3' }}
                    />
                    <Bar dataKey="percentage" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* DETAILED CATEGORIES CARDS PROGRESS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryStats.map(stat => (
                  <div key={stat.key} className="p-4 bg-rose-50/10 hover:bg-rose-50/35 border border-rose-50/60 rounded-2xl transition duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 bg-rose-50 rounded-lg shrink-0">
                          {renderCategoryIcon(CATEGORIES[stat.key]?.iconName, `text-${stat.color}-600`)}
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm leading-tight">{stat.name}</h5>
                      </div>
                      <span className="font-mono text-xs font-bold bg-white text-slate-700 px-2.5 py-1 border border-rose-100 rounded-lg">{stat.avg} / 5</span>
                    </div>

                    {/* Progress Slider Display */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
                        <span>Puntuación promedio</span>
                        <span>{stat.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SOFT SKILLS DEPTH VIEW (CRITICAL ASSESSMENT) */}
          {(activeTab === 'blandas' && !showPrintMode) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-50 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-100" /> Inteligencia Emocional & Habilidades Blandas
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">El indicador más importante de la inteligencia pedagógica en educación básica escolar.</p>
                </div>
                <div className="text-center bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 shrink-0">
                  <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">Calificación Promedio</span>
                  <span className="text-3xl font-black text-emerald-800">{softSkillsAverage} <span className="text-sm font-semibold text-emerald-500">/ 5</span></span>
                </div>
              </div>

              {/* Heart Warming Illustration & Description */}
              <div className="bg-rose-50/20 border border-rose-50/50 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center">
                <EmpathyIllustration className="w-32 h-32 shrink-0" />
                <div className="text-slate-600 space-y-2 text-sm">
                  <h4 className="font-extrabold text-slate-800 text-base">¿Por qué evaluamos esto con mayor rigor?</h4>
                  <p className="leading-relaxed">
                    Un docente con alto conocimiento de materias pero deficientes habilidades blandas no puede contener situaciones críticas de berrinche o estrés grupal. Las siguientes métricas evalúan la comunicación asertiva, escucha de dudas, tolerancia, empatía familiar, y liderazgo afectuoso del aspirante.
                  </p>
                </div>
              </div>

              {/* Detailed answers grid for Soft Skills */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider border-b border-rose-50 pb-1">Métricas Socioemocionales Individuales</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {softSkillsDetails.map((skill, index) => (
                    <div key={skill.id} className="p-4 bg-slate-50 hover:bg-rose-50/10 border border-slate-200/60 rounded-xl transition duration-150">
                      <div className="flex justify-between items-center mb-1 bg-white p-2 rounded-lg border border-slate-100">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-extrabold uppercase">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                          {skill.skill}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{skill.score} de 5</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 font-medium">{skill.desc}</p>
                      
                      {/* Sub progress bar */}
                      <div className="w-full bg-slate-205 h-1.5 rounded-full overflow-hidden mt-3">
                        <div 
                          className={`h-full rounded-full ${skill.score >= 4.5 ? 'bg-emerald-500' : skill.score >= 3.5 ? 'bg-blue-500' : skill.score >= 2.5 ? 'bg-amber-400' : 'bg-rose-500'}`}
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CALIBRADOR 360° INTERACTIVO */}
          {(activeTab === 'eval360' && !showPrintMode) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-rose-500" /> Calibrador y Evaluación Integral 360°
                </h3>
                <p className="text-slate-400 text-xs mt-1">Suma otras fuentes de retroalimentación para obtener un puntaje unificado y libre de sesgo.</p>
              </div>

              {/* Informative warning alert */}
              <div className="p-4 bg-blue-50 border border-blue-105 rounded-2xl text-xs text-blue-700 leading-relaxed">
                <strong>Recomendación Institucional:</strong> Las autoevaluaciones pedagógicas del docente pueden estar sesgadas por su percepción personal. Calibra adecuadamente este dictamen sumando tus observaciones directas de clase y opiniones secundarias de la comunidad escolar.
              </div>

              {/* SLIDERS MODULE */}
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider mb-2">Ponderación de Evaluaciones Externas</h4>

                {/* Autoevaluación (calculated) */}
                <div className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase">1. Autoevaluación del Docente</span>
                    <p className="text-xs text-slate-400">Calculada automáticamente del test escrito.</p>
                  </div>
                  <span className="font-mono text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg shrink-0">{overallCandidateScore}% (Peso: 35%)</span>
                </div>

                {/* Observación de clase */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="uppercase">2. Observación de Clase Práctica (Peso: 30%)</span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-mono">{evaluation.reviews360Group.observacionClase} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={evaluation.reviews360Group.observacionClase}
                    onChange={(e) => handleReview360Change('observacionClase', Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>1 = Deficiente</span>
                    <span>3 = Regular</span>
                    <span>5 = Excelente</span>
                  </div>
                </div>

                {/* Evaluación Directiva */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="uppercase font-bold">3. Evaluación Técnica / Entrevista Directiva (Peso: 15%)</span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-mono">{evaluation.reviews360Group.evaluacionDirectiva} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={evaluation.reviews360Group.evaluacionDirectiva}
                    onChange={(e) => handleReview360Change('evaluacionDirectiva', Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>1 = Insatisfecho</span>
                    <span>3 = Promedio</span>
                    <span>5 = Altamente Capacitado</span>
                  </div>
                </div>

                {/* Opinión de los estudiantes */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="uppercase">4. Encuestas / Opinión de Estudiantes Básica (Peso: 10%)</span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-mono">{evaluation.reviews360Group.opinionEstudiantes} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={evaluation.reviews360Group.opinionEstudiantes}
                    onChange={(e) => handleReview360Change('opinionEstudiantes', Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>1 = Desinterés</span>
                    <span>3 = Buena aceptación</span>
                    <span>5 = Gran Carisma y Aceptación</span>
                  </div>
                </div>

                {/* Opinión de padres de familia */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="uppercase font-bold">5. Sondeo / Opinión de los Padres de Familia (Peso: 10%)</span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-mono">{evaluation.reviews360Group.opinionPadres} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={evaluation.reviews360Group.opinionPadres}
                    onChange={(e) => handleReview360Change('opinionPadres', Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                    <span>1 = Quejas constantes</span>
                    <span>3 = Comunicación cordial</span>
                    <span>5 = Confianza y Colaboración Plena</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUTOREVALUACIÓN DE PREGUNTAS ABIERTAS */}
          {(activeTab === 'respuestas' || showPrintMode) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" /> Autodiagnóstico del Aspirante (Respuestas Abiertas)
                </h3>
                <p className="text-slate-400 text-xs mt-1">La visión del docente por escrito respecto a su desempeño, fortalezas y puntos críticos.</p>
              </div>

              <div className="space-y-6">
                {OPEN_QUESTIONS.map(item => (
                  <div key={item.id} className="p-5 bg-rose-50/10 border border-slate-100 rounded-2xl relative">
                    <div className="absolute top-4 left-4 text-rose-100 opacity-20 pointer-events-none text-4xl font-extrabold font-serif">“</div>
                    <div className="pl-6">
                      <h4 className="text-sm font-extrabold text-slate-700 leading-snug">{item.text}</h4>
                      <div className="mt-3 p-4 bg-white/70 rounded-xl border border-rose-50/50 text-slate-600 text-xs leading-relaxed italic">
                        {evaluation.openAnswers[item.id] ? evaluation.openAnswers[item.id] : "Sin respuesta proveída."}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SINCRONIZACIÓN GOOGLE SHEETS */}
          {(activeTab === 'sheets' && !showPrintMode) && (
            <SheetsSyncPanel 
              evaluation={evaluation}
              overallCandidateScore={overallCandidateScore}
              consolidated360Score={consolidated360Score}
              categoryStats={categoryStats}
            />
          )}
        </div>

        {/* RIGHT SIDEBAR MODULE: TRAINING RECOMMENDATION & REPORT OVERVIEW */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* PROFILE SUMMARY SIDEBAR */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-lg border-b border-rose-50 pb-3">Resumen de Candidato</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase">Edad</span>
                <span className="font-bold text-slate-700">{evaluation.candidate.edad} años</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase">Licenciatura</span>
                <span className="font-bold text-slate-700 text-right truncate max-w-[150px]" title={evaluation.candidate.licenciatura}>{evaluation.candidate.licenciatura}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-55">
                <span className="text-slate-400 font-bold uppercase">Experiencia</span>
                <span className="font-bold text-slate-700 text-right">{evaluation.candidate.experienciaTiempo} años ({evaluation.candidate.experienciaTipo})</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase">Nivel</span>
                <span className="font-bold text-slate-700 text-right">{evaluation.candidate.nivelEducativo}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-bold uppercase">Materias</span>
                <span className="font-bold text-slate-700 text-right truncate max-w-[150px]" title={evaluation.candidate.materias}>{evaluation.candidate.materias}</span>
              </div>
              {evaluation.candidate.cursosCertificaciones && (
                <div className="p-3 bg-rose-50/30 rounded-xl border border-rose-150/40 mt-2">
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block mb-1">Cursos / Logros</span>
                  <p className="text-xs text-slate-600 italic leading-snug">{evaluation.candidate.cursosCertificaciones}</p>
                </div>
              )}
            </div>
          </div>

          {/* TRAINING RECOMMENDATIONS MODULE */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-lg border-b border-rose-55 pb-3 flex items-center gap-1.5">
              <BookMarked className="w-5 h-5 text-pink-500" /> Plan de Capacitación
            </h3>

            {/* Selected improvement areas */}
            {evaluation.fortalecimientoAreas.length > 0 ? (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block">Áreas prioritarias declaradas</span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.fortalecimientoAreas.map(id => {
                    const found = AREAS_FORTALECIMIENTO.find(a => a.id === id);
                    return (
                      <span key={id} className="text-[10px] font-bold bg-pink-50 text-pink-600 border border-pink-100 px-2 py-1 rounded-md">
                        {found?.label || id}
                      </span>
                    );
                  })}
                </div>

                <div className="space-y-3.5 pt-3">
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block">Talleres Sugeridos</span>
                  <div className="space-y-3">
                    {evaluation.fortalecimientoAreas.map(id => {
                      const rec = getTrainingRecommendation(id);
                      return (
                        <div key={id} className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl text-xs space-y-1">
                          <p className="font-extrabold text-slate-700 text-xs">📖 {rec.title}</p>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{rec.action}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" strokeWidth={1.5} />
                <p className="text-slate-700 font-bold text-xs mt-2">Sin áreas de fortalecimiento prioritarias</p>
                <p className="text-slate-400 text-[10px] mt-1">El docente no ha solicitado capacitación específica.</p>
              </div>
            )}
          </div>

          {/* SIGNATURE AREA FOR OFFICIAL PRINT REPORTS */}
          <div className="bg-slate-50 border border-dashed border-slate-205 rounded-3xl p-6 text-center space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Espacio de Validación</h4>
            <div className="h-16 flex items-end justify-center border-b border-dashed border-slate-300 mx-4">
              {/* Dummy line for physical signature */}
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Firma y Sello del Director Evaluador de Educación Básica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons or tags based on Score
const GiftOrBadge: React.FC<{ hiringScore: number }> = ({ hiringScore }) => {
  if (hiringScore >= 90) return <Award className="w-6 h-6 animate-pulse" />;
  if (hiringScore >= 75) return <CheckCircle2 className="w-6 h-6" />;
  return <AlertTriangle className="w-6 h-6 text-amber-500" />;
};

// Helper function to map areas of improvement into actions training suggestions
function getTrainingRecommendation(areaId: string): { title: string; action: string } {
  switch (areaId) {
    case "manejo_grupo":
      return {
        title: "Taller de Disciplina Positiva y Gestión de Aula",
        action: "Fomentar convivencia armónica con dinámicas socioemocionales grupales sin recurrir a autoritarismo."
      };
    case "planeacion":
      return {
        title: "Estrategias de Planeación Didáctica Inclusiva",
        action: "Herramientas de diseño curricular flexible alineadas a la NEM (Nueva Escuela Mexicana)."
      };
    case "evaluacion":
      return {
        title: "Diplomado sobre Evaluación Formativa Escolar",
        action: "Construcción de rúbricas lúdicas, listas de cotejo afectivas y retroalimentación interactiva."
      };
    case "tec_educativa":
      return {
        title: "Formación de Tecnologías Flexibles para Primaria",
        action: "Utilización de tablets, interactivos en la nube, y gamificación guiada lúdicamente en computadoras."
      };
    case "inclusiva":
      return {
        title: "Metodologías de Inclusión y Estilos de Aprendizaje",
        action: "Diseño Universal para el Aprendizaje (DUA) enfocado en barreras familiares y retraso escolar."
      };
    case "inte_emocional":
      return {
        title: "Seminario de Inteligencia Emocional Afectiva",
        action: "Manejo positivo del estrés docente, autocontrol frente a disrupciones, y canalización constructiva de crisis."
      };
    case "com_efectiva":
      return {
        title: "Curso de Comunicación Asertiva con Familias",
        action: "Estrategias para mediar llamadas de atención, asambleas de grado armoniosas, y resolución cordial de descontentos."
      };
    case "colaborativo":
      return {
        title: "Taller formativo de Comunidades de Aprendizaje",
        action: "Fortalecer dinámicas integradoras en el Consejo Técnico Escolar (CTE) para co-diseñar lecciones."
      };
    default:
      return {
        title: "Curso de Capacitación Docente Integral",
        action: "Habilidades docentes holísticas para afrontar el inicio escolar de manera eficiente."
      };
  }
}
