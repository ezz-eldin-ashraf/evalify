import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Evalify cut my grading time by 80%. What used to take an entire weekend now takes 20 minutes. The OCR accuracy is genuinely impressive.",
    name: 'Dr. Sarah Al-Hassan',
    role: 'Professor of Mathematics',
    university: 'Cairo University',
    initials: 'SH',
    color: 'from-primary/20 to-primary/40',
  },
  {
    quote: "I was skeptical at first, but the AI handles different handwriting styles extremely well. It even caught partial answers I might have missed manually.",
    name: 'Prof. Ahmed Khalil',
    role: 'Head of Physics Dept.',
    university: 'Ain Shams University',
    initials: 'AK',
    color: 'from-[#6366F1]/20 to-[#6366F1]/40',
  },
  {
    quote: "The template mapping tool is brilliant. I defined question regions once and now every exam batch evaluates automatically. A true time-saver.",
    name: 'Dr. Mona Ibrahim',
    role: 'Lecturer, Computer Science',
    university: 'American University Cairo',
    initials: 'MI',
    color: 'from-success/20 to-success/40',
  },
];

const TestimonialsSection: React.FC = () => (
  <div className="py-24 bg-gradient-to-b from-[#E8EEFF] to-[#F8FAFC] border-y border-border/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">Testimonials</span>
        <h2 className="text-4xl font-bold text-text-primary mb-4">Loved by Professors</h2>
        <p className="text-lg text-text-muted">Join thousands of educators who've transformed their workflow with Evalify.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-white rounded-[2rem] shadow-strong border border-border/40 p-8 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {Array(5).fill(0).map((_, si) => (
                <Star key={si} size={16} className="text-warning fill-warning" strokeWidth={0} />
              ))}
            </div>

            {/* Quote */}
            <p className="text-text-secondary font-medium leading-relaxed flex-1 mb-8 italic">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-border/40">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-text-primary flex-shrink-0`}>
                {t.initials}
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm">{t.name}</p>
                <p className="text-xs text-text-muted font-medium mt-0.5">{t.role}</p>
                <p className="text-xs text-primary font-semibold mt-0.5">{t.university}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TestimonialsSection;
