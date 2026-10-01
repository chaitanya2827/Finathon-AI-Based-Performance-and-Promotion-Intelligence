import React from 'react';

/**
 * Reusable animated progress bar with cyan glass track, luminous gradient fill, and benchmark marker
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showValue = true,
  height = 'h-2',
  color = 'cyan', // 'cyan' | 'emerald' | 'amber' | 'rose' | 'auto'
  benchmark = null
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  // Determine auto color based on threshold if 'auto'
  let barColor = 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]';
  if (color === 'emerald' || (color === 'auto' && percentage >= 85)) {
    barColor = 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]';
  } else if (color === 'amber' || (color === 'auto' && percentage >= 70 && percentage < 85)) {
    barColor = 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]';
  } else if (color === 'rose' || (color === 'auto' && percentage < 70)) {
    barColor = 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
  } else if (color === 'cyan' || color === 'indigo' || color === 'primary') {
    barColor = 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.45)]';
  }

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1 font-medium text-[#B6C9D9]">
          <span>{label}</span>
          {showValue && <span className="font-bold text-[#F0F9FF]">{percentage}%</span>}
        </div>
      )}
      <div className={`relative w-full bg-slate-200 dark:bg-[#061426] border border-cyan-500/20 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        {benchmark !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-300 z-10 shadow-[0_0_6px_rgba(103,232,249,0.8)]"
            style={{ left: `${benchmark}%` }}
            title={`Benchmark: ${benchmark}%`}
          />
        )}
      </div>
    </div>
  );
}
