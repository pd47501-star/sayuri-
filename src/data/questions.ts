import { Question, OpenQuestion } from '../types';

export interface CategoryInfo {
  id: string;
  title: string;
  description: string;
  color: string;
  iconName: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  pedagogia: {
    id: "pedagogia",
    title: "Conocimiento Pedagógico y Disciplinar",
    description: "Evaluación del dominio de contenidos curriculares, planeación didáctica y estrategias de enseñanza.",
    color: "pink",
    iconName: "BookOpen"
  },
  gestion: {
    id: "gestion",
    title: "Gestión del Aula",
    description: "Habilidad para mantener un ambiente de respeto, orden, disciplina positiva y uso óptimo del tiempo.",
    color: "rose",
    iconName: "Layers"
  },
  blandas: {
    id: "blandas",
    title: "Habilidades Blandas",
    description: "Área crítica: empatía, comunicación asertiva, inteligencia emocional, liderazgo, adaptabilidad y trabajo en equipo.",
    color: "emerald", // Highlight with a supportive color or distinct warm tone
    iconName: "Heart"
  },
  inclusion: {
    id: "inclusion",
    title: "Inclusión y Diversidad",
    description: "Atención a ritmos de aprendizaje, respeto mutuo, equidad y adaptaciones curriculares para estudiantes con rezago.",
    color: "violet",
    iconName: "Users"
  },
  tecnologia: {
    id: "tecnologia",
    title: "Tecnología Educativa",
    description: "Uso de herramientas web, plataformas e interactivos digitales para el enriquecimiento didáctico.",
    color: "indigo",
    iconName: "Laptop"
  },
  comunidad: {
    id: "comunidad",
    title: "Relación con la Comunidad Escolar",
    description: "Comunicación constructiva con madres, padres de familia, tutores, directivos y compañeros docentes.",
    color: "amber",
    iconName: "MessageCircle"
  },
  etica: {
    id: "etica",
    title: "Ética y Profesionalismo",
    description: "Compromiso institucional, confidencialidad, puntualidad y mejora del perfil profesional constante.",
    color: "teal",
    iconName: "ShieldAlert"
  }
};

export const LIKERT_QUESTIONS: Question[] = [
  // Conocimiento pedagógico y disciplinar (6)
  { id: "q1", text: "Explica los temas de clase con claridad y lenguaje adecuado al nivel.", category: "pedagogia" },
  { id: "q2", text: "Relaciona los contenidos curriculares con ejemplos cotidianos o prácticos.", category: "pedagogia" },
  { id: "q3", text: "Diseña actividades de aprendizaje adecuadas para la edad y nivel de los alumnos.", category: "pedagogia" },
  { id: "q4", text: "Utiliza diferentes estrategias activas de enseñanza para mantener el interés.", category: "pedagogia" },
  { id: "q5", text: "Evalúa el aprendizaje de manera justa, objetiva y continua.", category: "pedagogia" },
  { id: "q6", text: "Retroalimenta a los estudiantes oportunamente para que puedan mejorar.", category: "pedagogia" },

  // Gestión de aula (5)
  { id: "q7", text: "Mantiene el orden en el aula sin recurrir a gritos, amenazas o humillaciones.", category: "gestion" },
  { id: "q8", text: "Fomenta la participación activa de todos los estudiantes durante las clases.", category: "gestion" },
  { id: "q9", text: "Aprovecha adecuadamente el tiempo de clase evitando distracciones innecesarias.", category: "gestion" },
  { id: "q10", text: "Establece y comunica reglas claras de convivencia grupal desde el inicio.", category: "gestion" },
  { id: "q11", text: "Resuelve los conflictos entre estudiantes de manera pacífica, justa y oportuna.", category: "gestion" },

  // Habilidades Blandas - Muy Importante (10)
  { id: "q12", text: "Escucha las opiniones y comentarios de los estudiantes con absoluto respeto.", category: "blandas", importance: "high" },
  { id: "q13", text: "Muestra empatía ante las dificultades académicas o personales de los alumnos.", category: "blandas", importance: "high" },
  { id: "q14", text: "Mantiene una actitud serena, paciente y positiva ante situaciones complejas del grupo.", category: "blandas", importance: "high" },
  { id: "q15", text: "Trabaja colaborativamente con otros docentes en proyectos o planeaciones escolares.", category: "blandas", importance: "high" },
  { id: "q16", text: "Acepta sugerencias, retroalimentación y críticas constructivas de coordinadores y compañeros.", category: "blandas", importance: "high" },
  { id: "q17", text: "Se adapta ágilmente a cambios institucionales, metodologías nuevas o imprevistos didácticos.", category: "blandas", importance: "high" },
  { id: "q18", text: "Promueve proactivamente un ambiente inclusivo libre de burlas o discriminación.", category: "blandas", importance: "high" },
  { id: "q19", text: "Controla adecuadamente sus emociones ante provocaciones, cansancio o estrés frente al grupo.", category: "blandas", importance: "high" },
  { id: "q20", text: "Motiva y entusiasma constantemente a los estudiantes a participar y aprender.", category: "blandas", importance: "high" },
  { id: "q21", text: "Tiene disposición abierta para guiar y apoyar a compañeros docentes y padres de familia.", category: "blandas", importance: "high" },

  // Inclusión y atención a la diversidad (5)
  { id: "q22", text: "Adapta la planeación y actividades para responder a diferentes estilos o ritmos de aprendizaje.", category: "inclusion" },
  { id: "q23", text: "Trata a todos los estudiantes con igualdad, equidad y respeto sin favoritismos.", category: "inclusion" },
  { id: "q24", text: "Diseña dinámicas que promueven activamente el respeto y la tolerancia a la diversidad.", category: "inclusion" },
  { id: "q25", text: "Identifica dificultades de aprendizaje o rezagos de manera oportuna para intervenir.", category: "inclusion" },
  { id: "q26", text: "Favorece activamente la integración plena de estudiantes con barreras físicas, intelectuales o sociales.", category: "inclusion" },

  // Uso de tecnología educativa (4)
  { id: "q27", text: "Utiliza herramientas y recursos digitales (pantallas, proyectores, apps) durante sus sesiones.", category: "tecnologia" },
  { id: "q28", text: "Emplea materiales audiovisuales dinámicos para respaldar de forma lúdica los aprendizajes.", category: "tecnologia" },
  { id: "q29", text: "Conoce y usa adecuadamente plataformas educativas o sistemas de gestión escolar.", category: "tecnologia" },
  { id: "q30", text: "Integra dinámicas tecnológicas interactivas que estimulan el autoaprendizaje del alumno.", category: "tecnologia" },

  // Relación con padres y comunidad escolar (4)
  { id: "q31", text: "Sostiene conversaciones respetuosas, claras y cordiales con los padres de familia.", category: "comunidad" },
  { id: "q32", text: "Informa oportunamente y con empatía a las familias sobre el progreso de sus hijos.", category: "comunidad" },
  { id: "q33", text: "Se involucra proactivamente en festivales, juntas, talleres u otras actividades del plantel.", category: "comunidad" },
  { id: "q34", text: "Colabora de manera respetuosa con directores, personal administrativo y de apoyo.", category: "comunidad" },

  // Ética y profesionalismo (4)
  { id: "q35", text: "Cumple puntualmente con los horarios laborales, plazos de entregas y guardias.", category: "etica" },
  { id: "q36", text: "Se comporta en todo momento dentro y fuera de la escuela bajo una ética profesional intachable.", category: "etica" },
  { id: "q37", text: "Resguarda estrictamente la confidencialidad de la información de alumnos y familias.", category: "etica" },
  { id: "q38", text: "Muestra compromiso firme por su mejora profesional y capacitación pedagógica constante.", category: "etica" }
];

export const OPEN_QUESTIONS: OpenQuestion[] = [
  {
    id: "open1",
    text: "¿Cuál considera que es su mayor fortaleza como docente en el aula?",
    placeholder: "Ej. Mi facilidad para conectar emocionalmente con los niños, mi paciencia y el diseño lúdico..."
  },
  {
    id: "open2",
    text: "¿Qué aspecto de su práctica docente identifica con mayor necesidad de mejora?",
    placeholder: "Ej. La dosificación del tiempo de cierre en sesiones complejas, o incorporar más herramientas digitales..."
  },
  {
    id: "open3",
    text: "¿En qué temas o metodologías de capacitación le gustaría recibir formación próxima?",
    placeholder: "Ej. Inteligencia emocional aplicada al aula de preescolar, o estrategias de diseño universal para el aprendizaje..."
  },
  {
    id: "open4",
    text: "¿Qué tipo de dificultades o barreras suele enfrentar con mayor frecuencia en su aula de educación básica?",
    placeholder: "Ej. Falta de apoyo de algunos padres de familia para el repaso extraescolar, o grupos numerosos con ritmos diversos..."
  }
];

export const AREAS_FORTALECIMIENTO = [
  { id: "manejo_grupo", label: "Manejo de grupo y control de conducta" },
  { id: "planeacion", label: "Planeación didáctica e innovación curricular" },
  { id: "evaluacion", label: "Evaluación formativa y diseño de instrumentos" },
  { id: "tec_educativa", label: "Tecnología educativa e interactivos digitales" },
  { id: "inclusiva", label: "Educación inclusiva y adecuaciones para rezago" },
  { id: "inte_emocional", label: "Inteligencia emocional y contención" },
  { id: "com_efectiva", label: "Comunicación asertiva con padres y directivos" },
  { id: "colaborativo", label: "Trabajo colaborativo y dinámicas entre docentes" }
];
