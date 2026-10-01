import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Target,
  GitFork,
  Award,
  SlidersHorizontal,
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import WorkVistaLogo from '../common/WorkVistaLogo';
import EmployeeAvatar from '../common/EmployeeAvatar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = location.pathname;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/' || pathname === '/dashboard'
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: Users,
      isActive: pathname.startsWith('/employees')
    },
    {
      name: 'Performance',
      path: '/performance',
      icon: TrendingUp,
      isActive: pathname === '/performance'
    },
    {
      name: 'Skills',
      path: '/skills',
      icon: Target,
      isActive: pathname === '/skills'
    },
    {
      name: 'Career',
      path: '/career',
      icon: GitFork,
      isActive: pathname === '/career' || pathname === '/career-path'
    },
    {
      name: 'Promotion',
      path: '/promotion',
      icon: Award,
      isActive: pathname === '/promotion' || pathname === '/promotion-readiness'
    },
    {
      name: 'Calibration',
      path: '/calibration',
      icon: SlidersHorizontal,
      isActive: pathname === '/calibration'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#040D1A]/96 dark:bg-[#040D1A]/96 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.45)] transition-colors duration-200">
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
        {/* Left: WORKVISTA Brand Logo with distinct contrast */}
        <div className="flex items-center flex-shrink-0">
          <WorkVistaLogo size="md" to="/dashboard" />
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 flex-shrink min-w-0"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`relative px-1.5 xl:px-2.5 py-1.5 xl:py-2 rounded-xl text-[11px] xl:text-xs font-semibold flex items-center gap-1 xl:gap-1.5 whitespace-nowrap transition-all duration-200 ease-out group select-none flex-shrink-0 ${
                  active
                    ? 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/15 border border-cyan-400/35 shadow-[0_0_12px_rgba(34,211,238,0.18)] font-bold'
                    : 'text-[#36566D] dark:text-[#B6C9D9] border border-transparent hover:text-cyan-700 dark:hover:text-cyan-200 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 hover:border-cyan-500/20'
                }`}
              >
                {/* Micro-interaction: icon smoothly slides 1.5px up on hover */}
                <Icon
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 ${
                    active
                      ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                      : 'text-[#567285] dark:text-[#7F9BB2] group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
                  }`}
                />
                <span className="whitespace-nowrap">{item.name}</span>

                {/* Subtle underline slides from left to right (180–250ms) */}
                <span
                  className={`absolute bottom-0.5 left-1.5 right-1.5 h-[2px] rounded-full transition-transform duration-200 ease-out origin-left ${
                    active
                      ? 'bg-cyan-500 dark:bg-cyan-400 scale-x-100 shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                      : 'bg-cyan-500/60 dark:bg-cyan-400/60 scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Theme Toggle, HR Manager Profile Pill, Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 flex-shrink-0">
          {/* Visual Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 xl:p-2 rounded-xl text-[#36566D] dark:text-[#B6C9D9] hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 border border-cyan-500/20 bg-[#061426]/50 transition-all duration-200 flex items-center justify-center flex-shrink-0 group"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
            )}
          </button>

          {/* HR Manager Profile Pill — Clean Horizontal User Block */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 xl:px-3 xl:py-1.5 rounded-xl bg-[#061426]/75 border border-cyan-500/20 backdrop-blur-md flex-shrink-0 select-none">
            <EmployeeAvatar
              name={user?.name || 'Sarah Jenkins'}
              src={user?.avatar || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'}
              size="xs"
            />
            <div className="flex flex-col justify-center text-left leading-none whitespace-nowrap">
              <span className="text-xs font-bold text-[#08243D] dark:text-[#F0F9FF] whitespace-nowrap leading-tight">
                {user?.name || 'Sarah Jenkins'}
              </span>
              <span className="text-[10px] font-medium text-cyan-700 dark:text-cyan-400 whitespace-nowrap leading-tight mt-0.5">
                {user?.role || 'HR Manager'}
              </span>
            </div>
          </div>

          {/* Logout Action — ALWAYS FULLY VISIBLE WITHOUT CLIPPING */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs font-semibold rounded-xl text-[#567285] dark:text-[#B6C9D9] hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-500/10 border border-cyan-500/20 hover:border-rose-500/30 transition-all duration-200 select-none flex-shrink-0"
            title="Sign out of WORKVISTA"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">Logout</span>
          </button>

          {/* Mobile Navigation Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#36566D] dark:text-[#B6C9D9] hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 border border-cyan-500/20 transition-colors flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cyan-500/20 bg-[#040D1A]/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fadeIn shadow-2xl">
          <div className="flex items-center gap-3 p-2 mb-2 rounded-xl bg-[#061426]/80 border border-cyan-500/20">
            <EmployeeAvatar
              name={user?.name || 'Sarah Jenkins'}
              src={user?.avatar}
              size="sm"
            />
            <div>
              <p className="text-xs font-bold text-[#F0F9FF]">{user?.name || 'Sarah Jenkins'}</p>
              <p className="text-[10px] text-cyan-400 font-semibold">{user?.role || 'HR Manager'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.isActive;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 font-bold'
                      : 'text-[#B6C9D9] hover:text-cyan-200 hover:bg-cyan-500/10 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-[#7F9BB2]'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-2 border-t border-cyan-500/15">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout from WORKVISTA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
