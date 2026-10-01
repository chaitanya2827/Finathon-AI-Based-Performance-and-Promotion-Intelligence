import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Enterprise StatCard for KPI summaries with Navy Blue + Cyan Glassmorphism styling
 */
export default function StatCard({
  title,
  value,
  trend,
  trendPositive = true,
  trendLabel = 'vs last review cycle',
  icon: Icon,
  badge = null
}) {
  const isPositive = trend && (trendPositive !== undefined ? trendPositive : !trend.startsWith('-'));
  const isNeutral = !trend || trend === '0' || trend === '0%';

  const isHighlighted =
    title?.includes('Promotion Ready') ||
    title?.includes('Average Performance') ||
    title?.includes('Training Completion');

  return (
    <div className={`card p-5 relative overflow-hidden group hover:border-cyan-400/40 hover:shadow-glass-hover transition-all duration-200 ${
      isHighlighted ? 'border-cyan-500/40 dark:border-cyan-400/40 bg-cyan-500/5 dark:bg-[#0B223D]/60' : ''
    }`}>
      {/* Subtle top cyan glow corner */}
      {isHighlighted && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/15 dark:bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#567285] dark:text-[#7F9BB2]">
            {title}
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <h3 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
              isHighlighted ? 'text-cyan-800 dark:text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]' : 'text-[#08243D] dark:text-[#F0F9FF]'
            }`}>
              {value}
            </h3>
            {badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-400/30">
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-cyan-50/80 dark:bg-[#081A2F]/80 border border-cyan-500/25 flex items-center justify-center text-cyan-700 dark:text-cyan-400 group-hover:border-cyan-400/60 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || trendLabel) && (
        <div className="mt-3 pt-3 border-t border-cyan-500/15 flex items-center text-xs text-[#B6C9D9] gap-1.5 relative z-10">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ${
                isNeutral
                  ? 'text-[#7F9BB2]'
                  : isPositive
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend}
            </span>
          )}
          <span className="truncate text-[#7F9BB2]">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
