import React from 'react';

/**
 * Enterprise StatusBadge with dark glass surfaces and luminous indicator dots
 */
export default function StatusBadge({ status, type = 'default', size = 'md' }) {
  if (!status) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }[size] || 'px-2.5 py-0.5 text-xs';

  // Determine color scheme based on status text or type
  const normalized = String(status).toLowerCase();

  let colorClasses = 'bg-[#0B223D]/70 text-[#B6C9D9] border-cyan-500/20';
  let dotColor = 'bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]';

  if (normalized.includes('ready') && !normalized.includes('nearly')) {
    colorClasses = 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30';
    dotColor = 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]';
  } else if (normalized.includes('nearly') || normalized.includes('strong') || normalized.includes('achieved')) {
    colorClasses = 'bg-cyan-950/60 text-cyan-200 border-cyan-400/35';
    dotColor = 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]';
  } else if (normalized.includes('exceptional') || normalized.includes('exceeded')) {
    colorClasses = 'bg-cyan-900/40 text-cyan-100 border-cyan-300/40';
    dotColor = 'bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]';
  } else if (normalized.includes('developing') || normalized.includes('track') || normalized.includes('moderate')) {
    colorClasses = 'bg-amber-950/50 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]';
  } else if (normalized.includes('attention') || normalized.includes('risk') || normalized.includes('strict')) {
    colorClasses = 'bg-rose-950/50 text-rose-300 border-rose-500/30';
    dotColor = 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]';
  } else if (normalized.includes('balanced') || normalized.includes('completed') || normalized.includes('active')) {
    colorClasses = 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30';
    dotColor = 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${sizeClasses} ${colorClasses} tracking-tight select-none backdrop-blur-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}
