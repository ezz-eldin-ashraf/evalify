import React from 'react';
import { Facebook, Mail, MessageCircle, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-bg-surface border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* About Column */}
          <div className="space-y-4">
            <Link to="/">
              <img src="/images/logo.png" alt="Evalify Logo" className="h-10 object-contain" />
            </Link>
            <p className="text-text-muted mt-4 leading-relaxed">
              Automating handwritten exam evaluation with AI. Fast, fair, and scalable grading combined into one intuitive ecosystem for instructors.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-6">Quick Links</h3>
            <ul className="space-y-3 font-medium text-text-muted">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Instructor Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-6">Legal & Privacy</h3>
            <ul className="space-y-3 font-medium text-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Security</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-6">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="text-text-secondary hover:text-white hover:bg-blue-600 transition-all bg-bg-main p-3 rounded-full shadow-light hover:shadow-strong hover:-translate-y-1">
                <Facebook className="w-5 h-5" fill="currentColor" />
              </a>
              <a href="#" className="text-text-secondary hover:text-white hover:bg-blue-400 transition-all bg-bg-main p-3 rounded-full shadow-light hover:shadow-strong hover:-translate-y-1">
                <Twitter className="w-5 h-5" fill="currentColor" />
              </a>
              <a href="#" className="text-text-secondary hover:text-white hover:bg-pink-600 transition-all bg-bg-main p-3 rounded-full shadow-light hover:shadow-strong hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-white hover:bg-red-500 transition-all bg-bg-main p-3 rounded-full shadow-light hover:shadow-strong hover:-translate-y-1">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-text-muted mt-6 text-sm">
              support@evalify.com <br/>
              +1 (800) 123-4567
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-text-muted text-sm">
          <p>© {new Date().getFullYear()} Evalify Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for educational excellence.</p>
        </div>
      </div>
    </footer>
  );
};
