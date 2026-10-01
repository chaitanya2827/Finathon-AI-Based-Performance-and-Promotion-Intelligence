import React, { useState } from 'react';

/**
 * Enterprise Tooltip component
 */
export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }[position] || 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          className={`absolute z-40 px-2.5 py-1 text-[11px] font-medium text-[#08243D] dark:text-[#F0F9FF] bg-white/95 dark:bg-[#081A2F]/95 border border-cyan-500/30 rounded-lg shadow-glass whitespace-nowrap pointer-events-none transition-opacity duration-150 backdrop-blur-md ${positionClasses}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
