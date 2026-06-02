import React from 'react';
import { motion } from 'motion/react';

// Animation variants for floating effects
export const floatVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Cute school pencil doodle
export const PencilDoodle: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} transform rotate-12`}>
    <path d="M10 80 L30 90 L15 65 Z" fill="#F43F5E" stroke="#881337" strokeWidth="3" strokeLinejoin="round" />
    <path d="M30 90 L85 35 L70 20 L15 75 Z" fill="#FDA4AF" stroke="#881337" strokeWidth="3" strokeLinejoin="round" />
    <path d="M70 20 L80 10 C85 5, 95 15, 90 20 L80 30 Z" fill="#F43F5E" stroke="#881337" strokeWidth="3" strokeLinejoin="round" />
    <path d="M10 80 L18 82 L14 74 Z" fill="#374151" />
  </svg>
);

// Cute apple doodle
export const AppleDoodle: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 30 C30 15, 15 35, 20 60 C25 85, 45 85, 50 78 C55 85, 75 85, 80 60 C85 35, 70 15, 50 30 Z" fill="#E11D48" stroke="#4C0519" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M50 30 C50 20, 52 10, 58 5" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M54 20 C64 12, 70 12, 72 15 C74 18, 70 28, 54 22 Z" fill="#10B981" stroke="#064E3B" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// Cute notebook doodle
export const BookDoodle: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} -rotate-6`}>
    <rect x="20" y="15" width="60" height="75" rx="8" fill="#F472B6" stroke="#4C0519" strokeWidth="3.5" />
    <rect x="15" y="15" width="10" height="75" rx="2" fill="#BE185D" stroke="#4C0519" strokeWidth="3.5" />
    {/* Page lines */}
    <line x1="35" y1="35" x2="70" y2="35" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <line x1="35" y1="50" x2="70" y2="50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <line x1="35" y1="65" x2="70" y2="65" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    {/* Spiral rings */}
    <path d="M10 25 C5 25, 5 30, 15 30" stroke="#4B5563" strokeWidth="2.5" />
    <path d="M10 45 C5 45, 5 50, 15 50" stroke="#4B5563" strokeWidth="2.5" />
    <path d="M10 65 C5 65, 5 70, 15 70" stroke="#4B5563" strokeWidth="2.5" />
  </svg>
);

// Classroom teacher doodle scene
export const TeacherIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-64' }) => {
  return (
    <motion.div 
      variants={floatVariants}
      animate="animate"
      className={`${className} flex items-center justify-center p-2`}
    >
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        {/* Soft pink board behind */}
        <rect x="30" y="20" width="340" height="180" rx="12" fill="#FCE7F3" stroke="#F472B6" strokeWidth="4" strokeDasharray="6 4" />
        <text x="70" y="60" fill="#BE185D" fontSize="14" fontWeight="bold" fontFamily="monospace">A + B = C</text>
        <text x="250" y="70" fill="#BE185D" fontSize="16" fontFamily="sans-serif">✏️ 🏫 🧠</text>
        <path d="M70 120 C100 110, 150 140, 200 120" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
        
        {/* Big Heart in background representing empathy & soft skills */}
        <path d="M290 120 C270 100, 250 120, 290 155 C330 120, 310 100, 290 120 Z" fill="#F43F5E" opacity="0.15" />

        {/* Floating Stars */}
        <polygon points="340,50 343,57 350,58 345,63 346,70 340,66 334,70 335,63 330,58 337,57" fill="#FBBF24" />
        <polygon points="50,150 52,154 57,155 53,158 54,163 50,160 46,163 47,158 43,155 48,154" fill="#FBBF24" />

        {/* Cute plant pot on the desk side */}
        <rect x="320" y="165" width="25" height="35" fill="#D1D5DB" stroke="#374151" strokeWidth="2" />
        <path d="M315 165 C310 145, 325 140, 325 150 C325 130, 345 135, 335 155" fill="#34D399" />

        {/* Main Teacher Figure */}
        {/* Body and clothes (pink sweater) */}
        <path d="M150 280 C150 230, 170 210, 210 210 C250 210, 270 230, 270 280 Z" fill="#F472B6" stroke="#4C0519" strokeWidth="4" />
        <path d="M185 210 L210 235 L235 210" fill="#FCE7F3" stroke="#4C0519" strokeWidth="3" />
        {/* Glasses necklace / details */}
        <circle cx="210" cy="242" r="6" fill="#F1F5F9" stroke="#4C0519" strokeWidth="2" />

        {/* Teacher Face */}
        <circle cx="210" cy="160" r="42" fill="#FFE4E6" stroke="#4C0519" strokeWidth="4" />
        {/* Teacher Hair (cute brown bun or neat haircut) */}
        <circle cx="210" cy="115" r="22" fill="#78350F" stroke="#4C0519" strokeWidth="3" />
        <path d="M164 150 C160 110, 260 110, 256 150 C262 135, 230 125, 210 135 C190 125, 158 135, 164 150 Z" fill="#78350F" stroke="#4C0519" strokeWidth="3" />

        {/* Glasses */}
        <circle cx="195" cy="155" r="14" stroke="#4C0519" strokeWidth="3.5" />
        <circle cx="225" cy="155" r="14" stroke="#4C0519" strokeWidth="3.5" />
        <line x1="209" y1="155" x2="211" y2="155" stroke="#4C0519" strokeWidth="3.5" />
        
        {/* Happy eyes and cheeks */}
        <circle cx="195" cy="155" r="3" fill="#374151" />
        <circle cx="225" cy="155" r="3" fill="#374151" />
        <circle cx="180" cy="170" r="6" fill="#FDA4AF" />
        <circle cx="240" cy="170" r="6" fill="#FDA4AF" />

        {/* Wide happy smile */}
        <path d="M200 180 Q210 192 220 180" stroke="#4C0519" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Hand holding pointer or marker */}
        <circle cx="138" cy="235" r="10" fill="#FFE4E6" stroke="#4C0519" strokeWidth="3" />
        {/* Board pointer wooden stick */}
        <path d="M138 235 L70 185" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
        {/* Playful energy sparkles in pointing tip */}
        <path d="M60 175 L55 170 M60 195 L55 200 M65 175 L70 170" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

// SocioEmotional Empathy doodle for Soft Skills
export const EmpathyIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => {
  return (
    <motion.div 
      variants={pulseVariants}
      animate="animate"
      className={`${className} flex items-center justify-center`}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        {/* Background pink circles */}
        <circle cx="100" cy="100" r="85" fill="#FFE4E6" opacity="0.6" stroke="#FECDD3" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="65" fill="#FCE7F3" opacity="0.8" />
        
        {/* Two faces communicating or counseling */}
        {/* Face 1 (Left - Teacher listening) */}
        <path d="M45 140 C45 100, 65 95, 75 105 C85 115, 80 140, 45 140 Z" fill="#FDA4AF" stroke="#BE185D" strokeWidth="3" />
        {/* Face 2 (Right - Child student sharing) */}
        <path d="M155 140 C155 105, 135 100, 125 110 C115 120, 120 140, 155 140 Z" fill="#F87171" stroke="#991B1B" strokeWidth="3" />
        
        {/* Hearts and speech bubbles making a visual connection */}
        {/* Big empathy heart at the center */}
        <path d="M100 80 C90 65, 75 75, 100 105 C125 75, 110 65, 100 80 Z" fill="#F43F5E" stroke="#881337" strokeWidth="3.5" />
        
        {/* Small floating sparkles and stars */}
        <polygon points="100,25 102,30 108,31 104,35 105,40 100,37 95,40 96,35 92,31 98,30" fill="#FBBF24" />
        <circle cx="60" cy="50" r="5" fill="#F472B6" />
        <circle cx="140" cy="50" r="4" fill="#60A5FA" />
        <path d="M40 75 Q45 65 55 70" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M160 75 Q155 65 145 70" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  );
};

// School bus / School elements background doodle icons for bottom of pages
export const ClassroomBannerDoodle: React.FC = () => {
  return (
    <div className="w-full overflow-hidden opacity-10 pointer-events-none select-none h-20 relative border-t border-rose-100 mt-8">
      <div className="absolute inset-0 flex items-center justify-around text-4xl grayscale-0 saturate-150">
        <span>🏫</span>
        <span>🎒</span>
        <span>📚</span>
        <span>🎨</span>
        <span>🧩</span>
        <span>👩‍🏫</span>
        <span>👦</span>
        <span>👧</span>
        <span>🍎</span>
        <span>✏️</span>
        <span>📏</span>
        <span>🧸</span>
        <span>🧬</span>
        <span>🎭</span>
      </div>
    </div>
  );
};
