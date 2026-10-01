import React from 'react';

/**
 * Enterprise LoadingState skeleton loader with Navy Blue + Cyan Glass styling
 */
export default function LoadingState({ message = 'Loading intelligence telemetry...', rows = 4 }) {
  return (
    <div className="w-full space-y-4 p-6 bg-[#081A2F]/65 border border-cyan-500/20 rounded-2xl shadow-glass animate-pulse backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-1/4 bg-[#0B223D] rounded-lg" />
          <div className="h-3 w-1/3 bg-[#061426] rounded-lg" />
        </div>
      </div>

      <div className="space-y-2.5 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-[#0B223D]/80 rounded-lg"
            style={{ width: `${95 - (i % 3) * 15}%` }}
          />
        ))}
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-cyan-400/80 font-bold tracking-wide">{message}</span>
      </div>
    </div>
  );
}
