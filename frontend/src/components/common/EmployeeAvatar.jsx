import React, { useState } from 'react';

/**
 * Enterprise Employee Avatar with cyan glass border and dark glowing initials
 */
export default function EmployeeAvatar({
  name = 'User',
  src = '',
  size = 'md',
  status = null,
  className = ''
}) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold'
  }[size] || 'w-10 h-10 text-sm';

  const dotSize = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2'
  }[size] || 'w-2.5 h-2.5 ring-2';

  // Extract initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  // Deterministic dark glass colors with cyan/teal text
  const colors = [
    'bg-[#0B223D] text-cyan-300 border-cyan-500/30',
    'bg-[#0a233f] text-cyan-200 border-cyan-400/30',
    'bg-[#081a2f] text-cyan-300 border-cyan-500/40',
    'bg-[#0f2c4c] text-cyan-100 border-cyan-300/30'
  ];
  const charCode = name.charCodeAt(0) || 0;
  const colorClass = colors[charCode % colors.length];

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClasses} rounded-full object-cover border border-cyan-400/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full flex items-center justify-center font-bold ${colorClass} border shadow-glass select-none`}
        >
          {initials || 'U'}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-[#081a2f] bg-cyan-400 ${dotSize} shadow-[0_0_8px_rgba(34,211,238,0.8)]`}
          title="Active Status"
        />
      )}
    </div>
  );
}
