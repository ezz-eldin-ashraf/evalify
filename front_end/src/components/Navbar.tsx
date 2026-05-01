import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 pointer-events-none">
      <nav className="mx-auto max-w-6xl pointer-events-auto bg-white/80 backdrop-blur-xl shadow-strong border border-border/50 rounded-full transition-all duration-300">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Evalify Logo" className="h-8 object-contain" />
          </Link>

          {/* Links */}
          <ul className="hidden md:flex items-center gap-2 font-bold text-text-primary text-sm absolute left-1/2 -translate-x-1/2">
            <li>
              <Link to="/" className="inline-block text-text-secondary hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-0.5">
                Home
              </Link>
            </li>
            <li>
              <a href="#about" className="inline-block text-text-secondary hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-0.5">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="inline-block text-text-secondary hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-0.5">
                Contact Us
              </a>
            </li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isRegister && (
              <Link to="/register">
                <Button variant="ghost" className="hidden sm:inline-flex rounded-full">Register</Button>
              </Link>
            )}
            {!isLogin && (
              <Link to="/login">
                <Button variant="primary" className="rounded-full shadow-none hover:shadow-md">Log In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

