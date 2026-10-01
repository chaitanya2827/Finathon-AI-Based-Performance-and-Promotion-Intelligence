import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Enterprise SearchBar with Navy Blue + Cyan Glassmorphism styling
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search by name, role, department or ID...',
  className = ''
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-white/85 dark:bg-[#061426]/80 border border-cyan-500/25 rounded-xl text-[#08243D] dark:text-[#F0F9FF] placeholder-[#8EABB9] dark:placeholder-[#7F9BB2] focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all backdrop-blur-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-md text-[#567285] dark:text-[#7F9BB2] hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
