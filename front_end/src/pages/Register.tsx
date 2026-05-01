import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../components/Navbar';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]">
      <Navbar />

      {/* Abstract Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-12 w-full">
        <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-strong border border-border/50 animate-fade-in-up">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create an account
            </h1>
            <p className="text-text-muted text-sm font-medium">
              Start automating your grading today
            </p>
          </div>

          <form className="space-y-4">
            {/* Name Input */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-bg-input text-text-primary placeholder-gray-400 text-sm font-semibold border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 transition-all duration-300 outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="w-full bg-bg-input text-text-primary placeholder-gray-400 text-sm font-semibold border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 transition-all duration-300 outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  className="w-full bg-bg-input text-text-primary placeholder-gray-400 text-sm font-semibold border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl py-3.5 pl-11 pr-11 transition-all duration-300 outline-none shadow-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/50 bg-bg-input border-transparent cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-text-muted font-medium cursor-pointer">
                I agree to the <a href="#" className="text-primary hover:text-primary-hover hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-hover hover:underline transition-colors">Privacy Policy</a>
              </label>
            </div>

            {/* Register Action */}
            <div className="pt-4">
              <button 
                type="button" 
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm font-medium text-text-muted">
              Already have an account? <Link to="/login" className="text-primary hover:text-primary-hover font-bold ml-1 transition-colors">Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
