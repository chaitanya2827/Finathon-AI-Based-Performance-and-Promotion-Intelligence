import React from 'react';
import { Target, ArrowUpRight, BookOpen } from 'lucide-react';
import ProgressBar from './ProgressBar';

/**
 * DevelopmentGapCard displays targeted development areas with Navy Blue + Cyan Glassmorphism styling
 */
export default function DevelopmentGapCard({
  skill,
  current,
  required,
  gap,
  severity = 'Medium',
  recommendation,
  onActionClick = null
}) {
  const calculatedGap = gap !== undefined ? gap : Math.max(0, required - current);

  const severityBadge = {
    High: 'bg-rose-950/50 text-rose-300 border-rose-500/30',
    Medium: 'bg-amber-950/50 text-amber-300 border-amber-500/30',
    Low: 'bg-cyan-950/50 text-cyan-300 border-cyan-400/30'
  }[severity] || 'bg-[#0B223D] text-[#B6C9D9] border-cyan-500/20';

  return (
    <div className="border border-cyan-500/20 rounded-xl p-4 bg-[#081A2F]/65 backdrop-blur-md hover:border-cyan-400/40 transition-all shadow-glass flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
              <Target className="w-4 h-4" />
            </span>
            <h5 className="font-bold text-sm text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
              {skill}
            </h5>
          </div>

          <span className={`text-[11px] font-bold border px-2 py-0.5 rounded-full ${severityBadge}`}>
            {severity} Priority
          </span>
        </div>

        {/* Progress and gap comparison */}
        <div className="my-3 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-[#36566D] dark:text-[#B6C9D9]">
            <span>Current: <strong className="text-[#08243D] dark:text-[#F0F9FF]">{current}%</strong></span>
            <span>Target: <strong className="text-[#08243D] dark:text-[#F0F9FF]">{required}%</strong></span>
          </div>
          <ProgressBar
            value={current}
            max={100}
            showValue={false}
            color={current >= required ? 'emerald' : 'amber'}
            benchmark={required}
          />
          <div className="flex justify-between text-[11px] text-[#567285] dark:text-[#7F9BB2] pt-1">
            <span>Deficit to role readiness:</span>
            <span className="font-bold text-amber-600 dark:text-amber-300">-{calculatedGap}% gap</span>
          </div>
        </div>

        {/* Recommended action */}
        {recommendation && (
          <div className="mt-3 p-2.5 rounded-xl bg-cyan-50/70 dark:bg-[#061426]/80 border border-cyan-500/20 text-xs text-[#36566D] dark:text-[#B6C9D9] flex items-start gap-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">
              <span className="font-bold text-cyan-700 dark:text-cyan-300">Action: </span>
              {recommendation}
            </p>
          </div>
        )}
      </div>

      {onActionClick && (
        <div className="mt-3 pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onActionClick(skill)}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
          >
            Assign Development Plan
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
