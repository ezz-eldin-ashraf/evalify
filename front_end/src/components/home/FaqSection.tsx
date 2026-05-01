import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'How accurate is the OCR handwriting recognition?',
    answer: 'Evalify\'s OCR engine achieves 92–97% accuracy on standard academic handwriting. The system is trained on diverse writing styles, including mixed print and cursive. Teachers can always manually adjust borderline cases before finalizing grades.',
  },
  {
    question: 'Does Evalify support Arabic handwriting?',
    answer: 'Yes. Evalify has dedicated support for Arabic script recognition, including both Modern Standard Arabic and common regional handwriting variations. Our model is continuously improved with new Arabic dataset contributions.',
  },
  {
    question: 'Is student data secure and private?',
    answer: 'Absolutely. All uploaded exam files are encrypted in transit (TLS 1.3) and at rest (AES-256). Student data is processed ephemerally and is never shared with third parties or used for AI training without explicit institutional consent.',
  },
  {
    question: 'Can I export grades to my university\'s system?',
    answer: 'Yes. Evalify supports exporting finalized grade sheets to Excel (.xlsx), CSV, and PDF formats. We also offer an open REST API for direct LMS integration with systems like Moodle, Blackboard, and Canvas.',
  },
  {
    question: 'What happens if the AI makes a grading mistake?',
    answer: 'Every automated grade is flagged with a confidence score. Low-confidence answers are highlighted for teacher review. You retain full control — Evalify is a powerful assistant, not a replacement for your judgment.',
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="py-24 bg-white border-t border-border/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">FAQ</span>
          <h2 className="text-4xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-text-muted">Everything you need to know before getting started.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                openIndex === i ? 'border-primary/30 shadow-md bg-white' : 'border-border/40 bg-bg-surface/60'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left group"
              >
                <span className={`text-base font-bold transition-colors ${openIndex === i ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={2.5}
                  className={`flex-shrink-0 text-text-muted transition-transform duration-300 ml-4 ${openIndex === i ? 'rotate-180 text-primary' : ''}`}
                />
              </button>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-7 pb-6 text-text-secondary font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
