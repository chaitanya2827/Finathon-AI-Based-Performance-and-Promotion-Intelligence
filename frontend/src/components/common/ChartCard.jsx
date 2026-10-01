import React from 'react';

/**
 * ChartCard container with Navy Blue + Cyan Glass styling
 */
export default function ChartCard({
  title,
  subtitle,
  children,
  action = null,
  footer = null,
  className = ''
}) {
  return (
    <div className={`card p-5 flex flex-col justify-between hover:border-cyan-400/40 hover:shadow-glass-hover ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h4 className="text-base font-bold text-[#F0F9FF] tracking-tight">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-[#7F9BB2] mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      <div className="w-full flex-1 min-h-[260px] flex items-center justify-center">
        {children}
      </div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-cyan-500/15 text-xs text-[#7F9BB2]">
          {footer}
        </div>
      )}
    </div>
  );
}
