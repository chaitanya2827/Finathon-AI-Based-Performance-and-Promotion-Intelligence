import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Target,
  GitFork,
  Award,
  SlidersHorizontal,
  Settings
} from 'lucide-react';
import WorkVistaLogo from '../common/WorkVistaLogo';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employees', path: '/employees', icon: Users, badge: '16' },
  { name: 'Performance', path: '/performance', icon: TrendingUp },
  { name: 'Skills & Gaps', path: '/skills', icon: Target, badge: '47' },
  { name: 'Career Path', path: '/career-path', icon: GitFork },
  { name: 'Promotion Readiness', path: '/promotion-readiness', icon: Award, badge: '31', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' },
  { name: 'Manager Calibration', path: '/calibration', icon: SlidersHorizontal },
  { name: 'Settings', path: '/settings', icon: Settings }
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#061426]/80 backdrop-blur-md lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#081A2F]/95 lg:bg-[#081A2F]/90 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.35)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Official Work Vista Brand Header */}
          <div className="h-16 px-4 border-b border-cyan-500/15 flex items-center justify-between">
            <WorkVistaLogo size="md" subtitle="HR Intelligence" />
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4">
            <div className="text-[11px] font-bold text-[#7F9BB2] uppercase tracking-wider px-3 mb-2.5">
              Workforce Intelligence
            </div>
            <nav className="space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-700 dark:text-cyan-200 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.18)]'
                          : 'text-[#36566D] dark:text-[#B6C9D9] border-transparent hover:text-[#08243D] dark:hover:text-[#F0F9FF] hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 hover:border-cyan-500/20'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                                : 'text-[#567285] dark:text-[#7F9BB2] group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isActive
                                ? 'bg-cyan-400/20 text-cyan-700 dark:text-cyan-200 border-cyan-400/40'
                                : item.badgeColor || 'bg-[#0B223D]/60 text-[#36566D] dark:text-[#B6C9D9] border-cyan-500/20 group-hover:border-cyan-400/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom System Status & Version */}
        <div className="p-3.5 m-3 bg-[#0B223D]/65 rounded-xl border border-cyan-500/20 backdrop-blur-md shadow-glass">
          <div className="flex items-center justify-between text-xs font-semibold text-[#08243D] dark:text-[#F0F9FF] mb-1">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              Engine Online
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-300 font-mono">v2.4-saas</span>
          </div>
          <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2] leading-tight">
            Decision-support rubric loaded for Q3 review cycle.
          </p>
        </div>
      </aside>
    </>
  );
}
