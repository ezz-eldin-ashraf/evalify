import React, { useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileUp, 
  PlayCircle, 
  Users, 
  LifeBuoy,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  BarChart2,
  User,
  ChevronDown,
  Sun,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard',       label: 'Dashboard',        icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
  { to: '/exams',           label: 'Exams',            icon: <BookOpen size={20} strokeWidth={2.5} /> },
  { to: '/upload-template', label: 'Upload Template',  icon: <FileUp size={20} strokeWidth={2.5} /> },
  { to: '/students',        label: 'Students Lists',   icon: <Users size={20} strokeWidth={2.5} /> },
  { to: '/evaluate',        label: 'Start Evaluation', icon: <PlayCircle size={20} strokeWidth={2.5} /> },
  { to: '/reports',         label: 'Reports',          icon: <BarChart2 size={20} strokeWidth={2.5} /> },
];

const HELP_LINKS = [
  { to: '/support', label: 'Support', icon: <LifeBuoy size={20} strokeWidth={2.5} /> },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/dashboard':       'Overview',
      '/exams':           'My Exams',
      '/upload-template': 'Upload Template',
      '/students':        'Students Lists',
      '/evaluate':        'Start Evaluation',
      '/reports':         'Reports',
      '/support':         'Support & Help Center',
      '/profile':         'My Profile',
    };
    return map[location.pathname] ?? (location.pathname.includes('/results') ? 'Evaluation Results' : location.pathname.includes('/edit-template') ? 'Edit Template' : 'Dashboard');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary/10 text-primary font-bold'
        : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary font-semibold'
    }`;

  // Shared sidebar markup
  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-8 border-b border-border/40 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <img src="/images/logo.png" alt="Evalify" className="h-7 object-contain" />
        </Link>
        <button className="ml-auto md:hidden p-2 text-text-muted hover:text-text-primary transition-colors" onClick={closeMobileMenu}>
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <p className="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Main Menu</p>
        <nav className="space-y-1.5">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={closeMobileMenu}>
              {link.icon}<span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <p className="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mt-8 mb-4">Help & Info</p>
        <nav className="space-y-1.5">
          {HELP_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={closeMobileMenu}>
              {link.icon}<span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-text-primary font-sans overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-border/40 flex-col flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm" onClick={closeMobileMenu} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-border/40 flex items-center justify-between px-4 md:px-8 lg:px-12 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-bold text-text-primary">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Search — desktop only */}
            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-3 text-gray-400" size={18} strokeWidth={2.5} />
              <input type="text" placeholder="Search exams, templates..." className="w-64 bg-bg-input text-sm font-semibold rounded-full py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-primary/20 focus:bg-white transition-all shadow-sm" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-text-primary transition-colors rounded-xl hover:bg-gray-50">
              <Bell size={22} strokeWidth={2.5} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>

            <div className="w-px h-8 bg-border/50"></div>

            {/* ── Profile Dropdown Trigger ── */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 flex-shrink-0 group-hover:border-primary/50 transition-colors uppercase">
                  {user?.fullName?.substring(0, 2) || 'U'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-text-primary leading-none">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-text-muted mt-1 font-medium">Instructor</p>
                </div>
                <ChevronDown size={16} className={`hidden md:block text-text-muted transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-border/40 overflow-hidden z-50 animate-fade-in">
                  {/* User Info Header */}
                  <div className="p-5 bg-gradient-to-r from-primary/5 to-[#6366F1]/5 border-b border-border/40 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0 uppercase">
                      {user?.fullName?.substring(0, 2) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-text-primary truncate">{user?.fullName || 'User'}</p>
                      <p className="text-xs text-text-muted font-medium truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold mt-1.5">
                        ● Active
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-text-secondary hover:text-primary transition-all text-sm font-semibold text-left"
                    >
                      <User size={17} strokeWidth={2.5} />
                      View Full Profile
                    </button>

                    {/* Dark Mode Toggle — dummy */}
                    <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary text-sm font-semibold select-none">
                      <div className="flex items-center gap-3">
                        <Sun size={17} strokeWidth={2.5} />
                        Dark Mode
                      </div>
                      <div className="relative w-10 h-5 rounded-full bg-border flex-shrink-0 cursor-not-allowed opacity-60">
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="p-2 border-t border-border/40">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/10 text-text-secondary hover:text-error transition-all text-sm font-semibold"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                    >
                      <LogOut size={17} strokeWidth={2.5} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full flex-1 animate-fade-in-up">
            <Outlet />
          </div>

          {/* Minimal Footer */}
          <footer className="h-20 mt-auto border-t border-border/40 bg-white px-8 flex items-center justify-between text-sm text-text-muted shrink-0">
            <p>© 2026 Evalify. All rights reserved.</p>
            <div className="hidden md:flex items-center gap-6 font-medium">
              <Link to="/support" className="hover:text-primary transition-colors">Support Center</Link>
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
