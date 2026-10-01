import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Main Application Layout
 * Features top horizontal navigation, natural document-flow sticky header,
 * clean responsive container, and enterprise footer.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      {/* Top Horizontal Dashboard Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Outlet />
      </main>

      {/* Global Enterprise Footer with Decision Support Notice */}
      <footer className="border-t border-cyan-500/15 bg-[#081a2f]/60 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#567285] dark:text-[#7F9BB2] mt-auto">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 <strong className="text-[#08243D] dark:text-[#F0F9FF] font-semibold">WORKVISTA</strong> — AI-Assisted Performance &amp; Promotion Intelligence.
          </p>
          <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">
            Decision-support system for HR review. AI insights do not make final promotion determinations.
          </p>
        </div>
      </footer>
    </div>
  );
}
