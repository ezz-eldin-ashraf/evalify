import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

// ── Home Section Components ──────────────────────────────────────────────────
import TrustedBySection    from '../components/home/TrustedBySection';
import BeforeAfterSection  from '../components/home/BeforeAfterSection';
import PricingSection      from '../components/home/PricingSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FaqSection          from '../components/home/FaqSection';
import CtaBanner           from '../components/home/CtaBanner';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <div className="pt-32 lg:pt-36 px-4 sm:px-6 max-w-[90rem] mx-auto w-full">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E8EEFF] to-[#F1F5F9] rounded-[2rem] shadow-sm border border-border/40 py-8 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between">
            {/* Left Content */}
            <div className="lg:w-1/2 mb-4 lg:mb-0 space-y-4 lg:space-y-6">
              {!loading ? (
                <img src="/images/logo.png" alt="Evalify" className="h-12 lg:h-20 object-contain mb-4 lg:mb-6 animate-fade-in-up" />
              ) : (
                <div className="h-12 lg:h-20 w-40 lg:w-48 bg-gray-200 rounded animate-pulse mb-4 lg:mb-6"></div>
              )}

              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight animate-fade-in-up-delay">
                Electronic Exam Grading
              </h1>

              <p className="text-lg lg:text-xl text-text-muted max-w-lg animate-fade-in-up-delay-2">
                Automate handwritten exam evaluation using AI and computer vision
              </p>

              <div className="pt-2 lg:pt-4 animate-fade-in-up-delay-2 flex flex-wrap gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="rounded-full shadow-md hover:shadow-lg">
                    Start Now
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg" className="rounded-full">
                    See How It Works
                  </Button>
                </a>
              </div>
            </div>

            {/* Right — Robot Illustration */}
            <div className="lg:w-1/2 flex justify-end relative animate-fade-in mt-[-1rem] lg:mt-0">
              <img
                src="/images/robot2.png"
                alt="AI Robot grading exam"
                className="w-full max-w-2xl object-cover drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
                style={{ maxHeight: '550px' }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── 2. TRUSTED BY ───────────────────────────────────────────────── */}
      <TrustedBySection />

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <div id="how-it-works" className="py-24 bg-gradient-to-b from-[#E8EEFF] to-white border-y border-border/30 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">Process</span>
            <h2 className="text-4xl font-bold text-text-primary mb-4">How Evalify Operates</h2>
            <p className="text-lg text-text-muted">A simple 3-step pipeline from raw papers to final exported grades.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
            <div className="lg:w-1/2 space-y-8">
              {[
                { n: 1, title: 'Upload Templates', body: 'Define the regions for each question by drawing simple bounding boxes over a blank exam layout.' },
                { n: 2, title: 'Process the Papers', body: 'Upload all student responses. Let our AI extract handwritten ink natively and match it using deep semantics.' },
                { n: 3, title: 'Review & Export', body: 'Examine the automated grades, adjust any OCR margins securely, and export your final grades to Excel.' },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-md">
                    {step.n}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-primary mb-2">{step.title}</h4>
                    <p className="text-text-muted leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-1/2 w-full">
              {/* Visual Pipeline Card */}
              <div className="w-full bg-white rounded-[2rem] shadow-strong border border-border/40 p-8 space-y-4">
                {[
                  { emoji: '📄', label: 'Blank Template Upload', color: 'bg-primary/10 text-primary' },
                  { emoji: '🖊️', label: 'Handwritten Paper Scan', color: 'bg-warning/10 text-warning' },
                  { emoji: '🤖', label: 'AI OCR Extraction', color: 'bg-[#6366F1]/10 text-[#6366F1]' },
                  { emoji: '✅', label: 'Graded Results & Export', color: 'bg-success/10 text-success' },
                ].map((step, i, arr) => (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl ${step.color.split(' ')[0]}`}>
                      <span className="text-2xl">{step.emoji}</span>
                      <span className={`font-bold ${step.color.split(' ')[1]}`}>{step.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-border/60"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. WHY CHOOSE EVALIFY ───────────────────────────────────────── */}
      <div className="bg-white py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">Features</span>
            <h2 className="text-4xl font-bold text-text-primary mb-4">Why Choose Evalify?</h2>
            <p className="text-lg text-text-muted">
              Discover how AI-powered grading improves accuracy, saves time, and provides transparent analytics for any scale of testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '⚖️',
                title: 'Objective & Fair',
                body: 'Remove human bias entirely. Our models grade every handwritten answer consistently against your exact criteria.',
                color: 'bg-primary/10 text-primary',
              },
              {
                emoji: '⚡',
                title: 'Extremely Fast',
                body: 'Grade hundreds of papers in minutes, not days. Focus your time on teaching and analytics instead of administration.',
                color: 'bg-[#6366F1]/10 text-[#6366F1]',
              },
              {
                emoji: '📊',
                title: 'Deep Analytics',
                body: 'Gain macro and micro insights into student performance. Export final results automatically to standard university systems.',
                color: 'bg-success/10 text-success',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-bg-surface p-8 rounded-[2rem] shadow-sm border border-border/40 hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${feature.color.split(' ')[0]} group-hover:scale-110 transition-transform`}>
                  {feature.emoji}
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. BEFORE & AFTER ───────────────────────────────────────────── */}
      <BeforeAfterSection />

      {/* ── 6. PRICING ──────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 8. FAQ ──────────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── 9. FINAL CTA ────────────────────────────────────────────────── */}
      <CtaBanner />

      <Footer />
    </div>
  );
};

export default Home;
