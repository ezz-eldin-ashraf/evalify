import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const { token, userId, fullName, email: userEmail } = response.data;
      
      login({
        token,
        userId,
        fullName,
        email: userEmail
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.title || err.response.data.detail || 'Login failed');
      } else {
        setError('An error occurred during login. Please try again later.');
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
              Welcome back
            </h1>
            <p className="text-text-muted text-sm font-medium">
              Log in to access your Evalify dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="flex w-full justify-end mt-2">
              <a href="#" className="text-text-muted hover:text-primary text-xs font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Login Action */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm font-medium text-text-muted">
              Don't have an account? <Link to="/register" className="text-primary hover:text-primary-hover font-bold ml-1 transition-colors">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
