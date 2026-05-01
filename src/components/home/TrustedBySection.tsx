import React from 'react';
import { GraduationCap, BookOpen, School, Building2, Microscope, Globe } from 'lucide-react';

const LOGOS = [
  { icon: <GraduationCap size={28} />, name: 'Cairo University' },
  { icon: <BookOpen size={28} />,      name: 'AUC' },
  { icon: <School size={28} />,        name: 'Ain Shams' },
  { icon: <Building2 size={28} />,     name: 'Alex University' },
  { icon: <Microscope size={28} />,    name: 'Zewail City' },
  { icon: <Globe size={28} />,         name: 'MUST University' },
];

const TrustedBySection: React.FC = () => (
  <div className="py-16 px-4 sm:px-6 max-w-[90rem] mx-auto w-full">
    <div className="text-center mb-10">
      <p className="text-sm font-bold uppercase tracking-widest text-text-muted">Trusted by Innovative Educators</p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
      {LOGOS.map((logo, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-border/40 shadow-sm text-text-muted hover:text-primary hover:border-primary/20 transition-all duration-300 group"
        >
          <span className="text-text-muted group-hover:text-primary transition-colors">{logo.icon}</span>
          <span className="text-sm font-bold whitespace-nowrap">{logo.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TrustedBySection;
