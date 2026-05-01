import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

const CtaBanner: React.FC = () => (
  <div className="px-4 sm:px-6 max-w-[90rem] mx-auto w-full pb-20">
    <div className="relative bg-primary rounded-[2.5rem] overflow-hidden px-8 py-16 md:py-20 text-center shadow-[0_20px_80px_rgba(79,70,229,0.35)]">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
      />
      {/* Ambient glow blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
          <Rocket size={30} className="text-white" strokeWidth={2} />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to transform your grading experience?
        </h2>
        <p className="text-lg text-white/80 font-medium mb-10 max-w-xl mx-auto">
          Join thousands of educators saving dozens of hours every semester with Evalify's AI-powered evaluation engine.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center gap-2 mx-auto">
              Get Started for Free
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-[0.98] mx-auto">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default CtaBanner;
