import React from 'react';
import StatusBadge from './StatusBadge';

/**
 * ScoreCard component for presenting readiness/performance scores with circular gauge or rating blocks
 * in Navy Blue + Cyan Glassmorphism style
 */
export default function ScoreCard({
  score,
  maxScore = 100,
  title,
  subtitle,
  benchmark,
  status = null
}) {
  const percentage = Math.round((score / maxScore) * 100);

  // SVG Circular Gauge calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#22d3ee'; // Cyan primary
  if (percentage >= 85) strokeColor = '#2dd4bf'; // Bright teal-cyan
  else if (percentage >= 70) strokeColor = '#06b6d4'; // Cyan
  else if (percentage >= 55) strokeColor = '#f59e0b'; // Amber
  else strokeColor = '#f43f5e'; // Rose

  return (
    <div className="card p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:border-cyan-400/40 hover:shadow-glass-hover transition-all min-w-0 overflow-hidden">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[#567285] dark:text-[#7F9BB2] truncate" title={title}>
          {title}
        </p>
        <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
            {score}%
          </span>
          {status && <StatusBadge status={status} size="sm" />}
        </div>
        {subtitle && <p className="text-xs text-[#36566D] dark:text-[#B6C9D9] mt-1 truncate">{subtitle}</p>}
        {benchmark && (
          <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2] mt-1 truncate">
            Org Benchmark: <span className="font-bold text-cyan-700 dark:text-cyan-300">{benchmark}%</span>
          </p>
        )}
      </div>

      {/* Circular Progress Gauge with Cyan Glow */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90 drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-[#E2EFF6] dark:stroke-[#061426]"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-xs sm:text-sm font-black text-[#08243D] dark:text-[#F0F9FF]">
          {score}
        </span>
      </div>
    </div>
  );
}
