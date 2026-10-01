import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * Enterprise Decision Support Disclaimer Banner
 * Reinforces that AI provides evidence-backed intelligence rather than autonomous decisions
 */
export default function AIDisclaimerBanner({
  message = "AI-generated insight for HR and manager review. Final promotion decisions remain strictly with HR and executive management.",
  variant = "subtle", // "subtle" | "prominent"
  className = ""
}) {
  if (variant === "prominent") {
    return (
      <div className={`p-4 rounded-xl bg-gradient-to-r from-cyan-50/80 via-white to-cyan-50/70 dark:from-cyan-950/40 dark:via-[#081A2F]/90 dark:to-[#0B223D]/80 border border-cyan-500/30 text-[#08243D] dark:text-[#F0F9FF] flex items-start gap-3.5 shadow-glass backdrop-blur-md ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-950 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(34,211,238,0.35)]">
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              Decision-Support Architecture
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/30 font-semibold px-2 py-0.5 rounded-full">
              Non-Autonomous
            </span>
          </div>
          <p className="text-xs text-[#08243D] dark:text-[#F0F9FF] mt-1 leading-relaxed font-medium">
            {message}
          </p>
          <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2] mt-1">
            All algorithms synthesize auditable data streams (sprint deliverables, 360 evaluations, and L&D certifications) into human-interpretable reasoning factors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-2 px-3.5 rounded-xl bg-white/70 dark:bg-[#081A2F]/60 border border-cyan-500/20 text-[#36566D] dark:text-[#B6C9D9] flex items-center justify-between text-xs gap-3 backdrop-blur-md shadow-glass ${className}`}>
      <div className="flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
        <span className="font-medium text-[#08243D] dark:text-[#F0F9FF]/90">{message}</span>
      </div>
      <span className="text-[10px] text-cyan-700 dark:text-cyan-400/80 uppercase tracking-wider font-semibold hidden md:inline-block">
        HR Governance Guardrails Active
      </span>
    </div>
  );
}
