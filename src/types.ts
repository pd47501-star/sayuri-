export interface CandidateData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: number | "";
  experienciaTipo: string;
  experienciaTiempo: number | "";
  licenciatura: string;
  telefono: string;
  correo: string;
  nivelEducativo: string;
  materias: string;
  cursosCertificaciones: string;
}

export enum LikertScale {
  Nunca = 1,
  CasiNunca = 2,
  AVeces = 3,
  Frecuentemente = 4,
  Siempre = 5
}

export interface Question {
  id: string;
  text: string;
  category: string;
  importance?: "high" | "normal"; // To highlight soft skills
}

export interface OpenQuestion {
  id: string;
  text: string;
  placeholder: string;
}

export interface TeacherEvaluation {
  id: string; // Evaluation unique ID
  candidate: CandidateData;
  answers: Record<string, number>; // likert scale responses
  openAnswers: Record<string, string>; // open text responses
  fortalecimientoAreas: string[]; // areas needing improvement
  date: string;
  // Interactive 360 reviews added to satisfy the user's "Recomendación importante"
  reviews360Group: {
    autoevaluacion: number; // calculated from answers
    evaluacionDirectiva: number; // scale 1-5
    observacionClase: number; // scale 1-5
    opinionEstudiantes: number; // scale 1-5
    opinionPadres: number; // scale 1-5
  };
}
