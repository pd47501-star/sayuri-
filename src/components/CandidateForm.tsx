import React, { useState } from 'react';
import { CandidateData } from '../types';
import { 
  User, Calendar, Phone, Mail, Award, BookOpen, 
  GraduationCap, Briefcase, ChevronRight, Sparkles 
} from 'lucide-react';
import { PencilDoodle, BookDoodle } from './EducationalDoodles';

interface CandidateFormProps {
  initialData: CandidateData;
  onSubmit: (data: CandidateData) => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<CandidateData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellidoPaterno.trim()) tempErrors.apellidoPaterno = "El apellido paterno es obligatorio";
    if (!formData.apellidoMaterno.trim()) tempErrors.apellidoMaterno = "El apellido materno es obligatorio";
    
    if (!formData.edad) {
      tempErrors.edad = "La edad es obligatoria";
    } else if (Number(formData.edad) < 18 || Number(formData.edad) > 75) {
      tempErrors.edad = "Ingresa una edad válida (18 a 75 años)";
    }

    if (!formData.licenciatura.trim()) tempErrors.licenciatura = "La licenciatura o formación académica es requerida";
    if (!formData.telefono.trim()) {
      tempErrors.telefono = "El teléfono es requerido";
    } else if (!/^\+?[\d\s-]{8,15}$/.test(formData.telefono.trim())) {
      tempErrors.telefono = "Ingresa un número telefónico de 8 a 15 dígitos";
    }

    if (!formData.correo.trim()) {
      tempErrors.correo = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) {
      tempErrors.correo = "Ingresa una dirección de correo válida";
    }

    if (!formData.experienciaTipo.trim()) tempErrors.experienciaTipo = "Especifica el tipo de experiencia docente";
    if (formData.experienciaTiempo === "") {
      tempErrors.experienciaTiempo = "Los años de experiencia son requeridos";
    } else if (Number(formData.experienciaTiempo) < 0) {
      tempErrors.experienciaTiempo = "Los años no pueden ser negativos";
    }

    if (!formData.nivelEducativo) tempErrors.nivelEducativo = "Selecciona un nivel educativo";
    if (!formData.materias.trim()) tempErrors.materias = "Especifica las materias que imparte";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' || name === 'experienciaTiempo' ? (value === "" ? "" : Number(value)) : value
    }));
    // Clear error dynamically
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div id="registration-card" className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-rose-100 border border-rose-100 overflow-hidden relative">
      
      {/* Playful Doodles floating around card header */}
      <div className="absolute top-4 left-4 hidden sm:block">
        <PencilDoodle className="w-10 h-10 opacity-60" />
      </div>
      <div className="absolute top-4 right-4 hidden sm:block">
        <BookDoodle className="w-12 h-12 opacity-60" />
      </div>

      <div className="p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-150 px-4 py-1.5 rounded-full text-rose-600 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Paso 1: Perfil y Datos Generales
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Registro General Docente</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mt-2">
            Por favor, completa tus datos de contacto, nivel de formación y experiencia profesional. Esta información iniciará tu perfil para evaluar tus competencias socioemocionales y aptitudes.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <h3 className="text-rose-600 font-bold text-sm tracking-wide uppercase border-b border-rose-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4" /> Datos de Identidad
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Nombre(s) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. María Elena"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.nombre ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.nombre && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Apellido Paterno *</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                placeholder="Ej. Gómez"
                className={`w-full px-4 py-2.5 bg-rose-50/30 border ${errors.apellidoPaterno ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
              />
              {errors.apellidoPaterno && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.apellidoPaterno}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Apellido Materno *</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                placeholder="Ej. Salazar"
                className={`w-full px-4 py-2.5 bg-rose-50/30 border ${errors.apellidoMaterno ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
              />
              {errors.apellidoMaterno && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.apellidoMaterno}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Edad (años) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  min="18"
                  max="75"
                  placeholder="Ej. 28"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.edad ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.edad && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.edad}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Número de Teléfono *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej. 2221234567"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.telefono ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.telefono && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.telefono}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Correo Electrónico *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.correo ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.correo && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.correo}</p>}
            </div>
          </div>

          <h3 className="text-rose-600 font-bold text-sm tracking-wide uppercase border-b border-rose-100 pt-4 pb-2 flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5" /> Formación y Trayectoria Profesional
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Licenciatura / Formación Académica *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="licenciatura"
                  value={formData.licenciatura}
                  onChange={handleChange}
                  placeholder="Ej. Licenciatura en Educación Primaria"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.licenciatura ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.licenciatura && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.licenciatura}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Nivel Educativo de Interés *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <BookOpen className="w-4 h-4" />
                </span>
                <select
                  name="nivelEducativo"
                  value={formData.nivelEducativo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.nivelEducativo ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800 appearance-none`}
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="Preescolar / Kínder">Preescolar / Kínder</option>
                  <option value="Primaria Primarios">Primaria (Común)</option>
                  <option value="Secundaria">Secundaria / Bachillerato medio</option>
                  <option value="Educación Especial">Educación Especial / Inicial</option>
                </select>
              </div>
              {errors.nivelEducativo && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.nivelEducativo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">¿De qué tipo es tu Experiencia Docente? *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <Briefcase className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="experienciaTipo"
                  value={formData.experienciaTipo}
                  onChange={handleChange}
                  placeholder="Ej. Docente suplente, Asistente, Titular primaria"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.experienciaTipo ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.experienciaTipo && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.experienciaTipo}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">¿Cuánto Tiempo de Experiencia tienes? (Años) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  name="experienciaTiempo"
                  value={formData.experienciaTiempo}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ej. 3"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.experienciaTiempo ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.experienciaTiempo && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.experienciaTiempo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Materias que Enseña / Domina *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <BookOpen className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="materias"
                  value={formData.materias}
                  onChange={handleChange}
                  placeholder="Ej. Matemáticas, Español, Ciencias Sociales"
                  className={`w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border ${errors.materias ? 'border-red-400 focus:ring-red-200' : 'border-rose-100 focus:ring-rose-250'} rounded-xl focus:outline-none focus:ring-4 transition duration-250 text-slate-800`}
                />
              </div>
              {errors.materias && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.materias}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Cursos o Certificaciones Recientes (Opcional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-400 pointer-events-none">
                  <Award className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="cursosCertificaciones"
                  value={formData.cursosCertificaciones}
                  onChange={handleChange}
                  placeholder="Ej. Curso de Aprendizaje Inclusivo, Certificación Google Classroom"
                  className="w-full pl-10 pr-3 py-2.5 bg-rose-50/30 border border-rose-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-250 transition duration-250 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-rose-100 flex justify-end">
            <button
              type="submit"
              id="advance-assessment-btn"
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-750 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer group"
            >
              Iniciar Evaluación Pedagógica
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
