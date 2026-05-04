import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import api from '../api/axios';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least 1 uppercase letter.";
    if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(pwd)) return "Password must contain at least 1 symbol.";
    if (/(0123|1234|2345|3456|4567|5678|6789)/.test(pwd)) return "Password should not contain simple sequences like 1234.";
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd.length > 0) {
      setPasswordError(validatePassword(pwd));
    } else {
      setPasswordError(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (passwordError) {
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/register', {
        fullName,
        email,
        password
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.title || err.response.data.detail || 'Registration failed');
      } else {
        setError('An error occurred during registration. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

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

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium text-center">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Name Input */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`w-full bg-bg-input text-text-primary placeholder-gray-400 text-sm font-semibold border-2 rounded-xl py-3.5 pl-11 pr-11 transition-all duration-300 outline-none shadow-sm ${passwordError && password.length > 0 ? 'border-error/50 focus:border-error' : 'border-transparent focus:border-primary/20 focus:bg-white'}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && password.length > 0 && (
                <p className="text-error text-xs font-bold mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> {passwordError}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/50 bg-bg-input border-transparent cursor-pointer" 
              />
              <label htmlFor="terms" className="text-xs text-text-muted font-medium cursor-pointer">
                I agree to the <a href="#" className="text-primary hover:text-primary-hover hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-hover hover:underline transition-colors">Privacy Policy</a>
              </label>
            </div>

            {/* Register Action */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading || success || !!passwordError}
                className="w-full flex justify-center items-center bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
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
