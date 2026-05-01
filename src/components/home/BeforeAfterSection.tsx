import React from 'react';
import { Wand2, ArrowRight, FileText, CheckCircle2, Star } from 'lucide-react';

const BeforeAfterSection: React.FC = () => (
  <div className="py-24 bg-gradient-to-b from-[#F8FAFC] to-white border-y border-border/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">Transformation</span>
        <h2 className="text-4xl font-bold text-text-primary mb-4">See the Magic</h2>
        <p className="text-lg text-text-muted">From messy handwritten papers to clean structured grades — instantly.</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
        {/* Before Card */}
        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-strong border border-border/40 p-8 flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-warning/10 rounded-xl">
              <FileText size={20} className="text-warning" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Before</p>
              <p className="text-sm font-bold text-text-primary">Handwritten Exam Paper</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Q1: scrawled text answer', 'Q2: partially legible notes', 'Q3: crossed-out attempts', 'Q4: ink smudges + correction'].map((line, i) => (
              <div key={i} className="h-8 bg-[#FFF9F0] border border-warning/20 rounded-lg px-3 flex items-center">
                <span className="text-xs text-warning/70 font-medium italic">{line}</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-border/40 flex justify-between text-xs font-semibold text-text-muted">
              <span>Manual grading time</span>
              <span className="text-warning font-bold">~45 min / paper</span>
            </div>
          </div>
        </div>

        {/* Center Arrow */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_8px_32px_rgba(79,70,229,0.35)]">
            <Wand2 size={28} className="text-white" strokeWidth={2} />
          </div>
          <ArrowRight size={28} className="text-primary hidden lg:block" strokeWidth={2.5} />
          <p className="text-xs font-bold text-primary text-center">Evalify AI</p>
        </div>

        {/* After Card */}
        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-strong border-2 border-primary/20 p-8 flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success/10 rounded-xl">
              <CheckCircle2 size={20} className="text-success" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">After</p>
              <p className="text-sm font-bold text-text-primary">Evalify Digital Output</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Q1', answer: 'The mitochondria is the powerhouse...', score: '5/5', ok: true },
              { q: 'Q2', answer: 'Newton\'s second law states F=ma...', score: '4/5', ok: true },
              { q: 'Q3', answer: 'Partial answer detected', score: '2/5', ok: false },
              { q: 'Q4', answer: 'Correct definition provided', score: '5/5', ok: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-bg-surface rounded-lg px-3 py-2 gap-3">
                <span className="text-xs font-bold text-primary w-6 flex-shrink-0">{item.q}</span>
                <span className="text-xs text-text-secondary flex-1 truncate">{item.answer}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.ok ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {item.score}
                </span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-border/40 flex justify-between text-xs font-semibold">
              <span className="text-text-muted">AI grading time</span>
              <span className="text-success font-bold">~8 seconds</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
            <span className="text-sm font-bold text-text-primary">Final Grade</span>
            <span className="text-2xl font-bold text-primary">16 / 20</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BeforeAfterSection;
