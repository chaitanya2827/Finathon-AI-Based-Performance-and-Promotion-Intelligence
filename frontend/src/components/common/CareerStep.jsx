import React from 'react';
import { Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * CareerStep component for visualizing progression stages in Navy Blue + Cyan Glass styling
 */
export default function CareerStep({
  stage, // 'Current Role' | 'Target Role' | 'Future Horizon'
  roleName,
  isCurrent = false,
  isTarget = false,
  isFuture = false,
  timeline = '',
  skills = [],
  readinessPct = null
}) {
  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 backdrop-blur-md ${
        isTarget
          ? 'bg-gradient-to-br from-cyan-50/90 via-white to-cyan-100/60 dark:from-[#0B223D]/95 dark:via-[#0a2544]/85 dark:to-[#081A2F]/90 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.18)] ring-1 ring-cyan-400/30'
          : isCurrent
          ? 'bg-[#081A2F]/75 border-cyan-500/25 shadow-glass'
          : 'bg-[#061426]/50 border-dashed border-cyan-500/25'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            isTarget
              ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
              : isCurrent
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
              : 'bg-[#0B223D] text-[#7F9BB2] border-cyan-500/20'
          }`}
        >
          {stage}
        </span>

        {timeline && (
          <span className="text-xs text-[#7F9BB2] font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {timeline}
          </span>
        )}
      </div>

      <h4 className="text-lg font-extrabold text-[#F0F9FF] tracking-tight">
        {roleName}
      </h4>

      {readinessPct !== null && (
        <div className="mt-3 p-2.5 rounded-xl bg-[#061426]/80 border border-cyan-500/25 flex items-center justify-between shadow-inner">
          <span className="text-xs font-semibold text-[#B6C9D9]">Promotion Alignment</span>
          <span className="text-sm font-black text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
            {readinessPct}%
          </span>
        </div>
      )}

      {/* Skills list */}
      {skills && skills.length > 0 && (
        <div className="mt-4 pt-3 border-t border-cyan-500/15 space-y-2">
          <span className="text-[11px] font-bold text-[#7F9BB2] uppercase tracking-wider block">
            Required Competencies:
          </span>
          <div className="space-y-1.5">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-[#061426]/70 border border-cyan-500/20 text-xs flex items-center justify-between"
              >
                <span className="font-semibold text-[#F0F9FF]">{skill.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#7F9BB2]">
                    {skill.current}% → {skill.required}%
                  </span>
                  <StatusBadge status={skill.status || (skill.current >= skill.required ? 'Ready' : 'Developing')} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
