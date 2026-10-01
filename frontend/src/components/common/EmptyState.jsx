import React from 'react';
import { SearchX } from 'lucide-react';

/**
 * Enterprise EmptyState component with Navy Blue + Cyan Glass styling
 */
export default function EmptyState({
  title = 'No Data Available',
  description = 'No matching records were found for the selected criteria.',
  icon: Icon = SearchX,
  actionLabel = null,
  onAction = null
}) {
  return (
    <div className="card p-8 md:p-12 text-center flex flex-col items-center justify-center border-dashed border-cyan-500/25 bg-[#081A2F]/50">
      <div className="w-12 h-12 rounded-2xl bg-[#061426] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-[#F0F9FF] tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-[#7F9BB2] max-w-sm mt-1 mb-4 leading-relaxed font-medium">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
