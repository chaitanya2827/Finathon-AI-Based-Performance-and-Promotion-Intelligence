import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Enterprise Modal with accessible esc-key closing and Navy Blue + Cyan Glass styling
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-[#040d1a]/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${maxWidth} bg-white/95 dark:bg-[#081A2F]/95 rounded-2xl shadow-glass-hover border border-cyan-500/30 p-6 z-10 transform transition-all animate-scaleUp backdrop-blur-2xl text-[#08243D] dark:text-[#F0F9FF]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
            <h3 className="text-base font-bold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#567285] dark:text-[#7F9BB2] hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
