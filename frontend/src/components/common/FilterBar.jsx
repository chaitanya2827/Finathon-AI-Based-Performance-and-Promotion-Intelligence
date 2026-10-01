import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * FilterBar with Navy Blue + Cyan Glassmorphism dropdowns and reset action
 */
export default function FilterBar({
  filters,
  onFilterChange,
  onReset,
  departments = ['All', 'Engineering', 'Product', 'Design', 'Data & AI', 'Operations'],
  readinessOptions = ['All', 'Ready', 'Nearly Ready', 'Developing'],
  performanceOptions = ['All', 'Exceptional', 'Strong', 'Developing', 'Needs Attention']
}) {
  const hasActiveFilters =
    (filters.department && filters.department !== 'All') ||
    (filters.readiness && filters.readiness !== 'All') ||
    (filters.performance && filters.performance !== 'All') ||
    (filters.role && filters.role !== 'All');

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Department Filter */}
      <div className="flex items-center gap-1.5 text-xs text-[#567285] dark:text-[#7F9BB2]">
        <Filter className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
        <select
          value={filters.department || 'All'}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="bg-white/90 dark:bg-[#061426]/90 border border-cyan-500/25 text-[#08243D] dark:text-[#F0F9FF] text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.2)] shadow-glass cursor-pointer hover:border-cyan-400/50 backdrop-blur-md transition-all"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept} className="bg-white dark:bg-[#081A2F] text-[#08243D] dark:text-[#F0F9FF]">
              {dept === 'All' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Promotion Readiness Filter */}
      <div className="flex items-center text-xs text-[#567285] dark:text-[#7F9BB2]">
        <select
          value={filters.readiness || 'All'}
          onChange={(e) => onFilterChange('readiness', e.target.value)}
          className="bg-white/90 dark:bg-[#061426]/90 border border-cyan-500/25 text-[#08243D] dark:text-[#F0F9FF] text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.2)] shadow-glass cursor-pointer hover:border-cyan-400/50 backdrop-blur-md transition-all"
        >
          {readinessOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-white dark:bg-[#081A2F] text-[#08243D] dark:text-[#F0F9FF]">
              {opt === 'All' ? 'All Readiness' : `Readiness: ${opt}`}
            </option>
          ))}
        </select>
      </div>

      {/* Performance Filter */}
      <div className="flex items-center text-xs text-[#567285] dark:text-[#7F9BB2]">
        <select
          value={filters.performance || 'All'}
          onChange={(e) => onFilterChange('performance', e.target.value)}
          className="bg-white/90 dark:bg-[#061426]/90 border border-cyan-500/25 text-[#08243D] dark:text-[#F0F9FF] text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.2)] shadow-glass cursor-pointer hover:border-cyan-400/50 backdrop-blur-md transition-all"
        >
          {performanceOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-white dark:bg-[#081A2F] text-[#08243D] dark:text-[#F0F9FF]">
              {opt === 'All' ? 'All Performance' : `Rating: ${opt}`}
            </option>
          ))}
        </select>
      </div>

      {/* Reset button if active */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-200 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 px-3 py-1.5 rounded-xl transition-all shadow-[0_0_10px_rgba(34,211,238,0.15)]"
        >
          <RotateCcw className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          Reset Filters
        </button>
      )}
    </div>
  );
}
