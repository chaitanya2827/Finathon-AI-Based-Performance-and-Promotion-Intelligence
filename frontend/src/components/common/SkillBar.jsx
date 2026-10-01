import React from 'react';
import StatusBadge from './StatusBadge';

/**
 * SkillBar component visualizing current vs required proficiency with gap calculation
 * in Navy Blue + Cyan Glassmorphism styling
 */
export default function SkillBar({
  name,
  category,
  current = 0,
  required = 80,
  gap = 0,
  status = 'Meets Requirement',
  showDetails = true
}) {
  const calculatedGap = Math.max(0, required - current);
  const effectiveGap = gap !== undefined ? gap : calculatedGap;
  const isMeeting = current >= required;

  return (
    <div className="p-3.5 bg-[#081A2F]/65 border border-cyan-500/20 rounded-xl hover:border-cyan-400/40 hover:bg-[#0B223D]/65 transition-all shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#F0F9FF] tracking-tight">
            {name}
          </span>
          {category && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#0B223D] text-cyan-300 border border-cyan-500/25">
              {category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={status} size="sm" />
          {effectiveGap > 0 ? (
            <span className="text-xs font-semibold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Gap: -{effectiveGap}%
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Meets Threshold
            </span>
          )}
        </div>
      </div>

      {/* Progress representation */}
      <div className="relative w-full bg-slate-200 dark:bg-[#061426] border border-cyan-500/20 h-2.5 rounded-full overflow-hidden">
        {/* Current bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isMeeting
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
              : 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
          }`}
          style={{ width: `${Math.min(100, current)}%` }}
        />
        {/* Target requirement marker line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-cyan-300 z-10 shadow-[0_0_8px_rgba(103,232,249,0.9)]"
          style={{ left: `${Math.min(99, required)}%` }}
          title={`Required Proficiency: ${required}%`}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-xs text-[#7F9BB2] mt-2 font-medium">
          <span>
            Current:{' '}
            <strong className="text-[#F0F9FF] font-bold">{current}%</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full inline-block shadow-[0_0_4px_rgba(103,232,249,0.8)]" />
            Target Benchmark:{' '}
            <strong className="text-[#F0F9FF] font-bold">{required}%</strong>
          </span>
        </div>
      )}
    </div>
  );
}
