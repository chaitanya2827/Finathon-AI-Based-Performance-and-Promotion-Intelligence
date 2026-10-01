import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import Modal from './Modal';

/**
 * Enterprise InsightCard with Navy Blue + Cyan Glassmorphism styling
 */
export default function InsightCard({
  insight,
  onActionClick = null,
  actionLabel = 'Explore Profiles'
}) {
  const [showModal, setShowModal] = useState(false);

  const {
    id,
    title,
    summary,
    confidence = '92%',
    evidence = [],
    category = 'General Insight',
    severity = 'info',
    evidenceCount
  } = insight;

  const severityStyles = {
    warning: {
      border: 'border-amber-500/30 hover:border-amber-400/50',
      badge: 'bg-amber-950/50 text-amber-300 border-amber-500/30',
      iconBg: 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
      icon: AlertTriangle
    },
    success: {
      border: 'border-emerald-500/30 hover:border-emerald-400/50',
      badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30',
      iconBg: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
      icon: Check
    },
    info: {
      border: 'border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
      badge: 'bg-cyan-950/50 text-cyan-300 border-cyan-400/30',
      iconBg: 'bg-cyan-950/60 text-cyan-300 border border-cyan-400/35 shadow-[0_0_10px_rgba(34,211,238,0.2)]',
      icon: Sparkles
    }
  }[severity] || {
    border: 'border-cyan-500/20 hover:border-cyan-400/40',
    badge: 'bg-[#0B223D] text-[#B6C9D9] border-cyan-500/20',
    iconBg: 'bg-[#0B223D] text-cyan-400 border border-cyan-500/20',
    icon: Info
  };

  const IconComponent = severityStyles.icon;

  return (
    <>
      <div
        className={`card p-5 border ${severityStyles.border} relative flex flex-col justify-between transition-all hover:shadow-glass-hover`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${severityStyles.iconBg}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </span>
              <span className={`text-[11px] font-bold border px-2 py-0.5 rounded-full ${severityStyles.badge}`}>
                {category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#567285] dark:text-[#7F9BB2] font-semibold">
              <span>Confidence:</span>
              <span className="text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-[#061426] border border-cyan-500/25 px-1.5 py-0.5 rounded font-mono font-bold">
                {confidence}
              </span>
            </div>
          </div>

          {/* Title & Summary */}
          <h4 className="text-sm font-bold text-[#08243D] dark:text-[#F0F9FF] leading-snug">
            {title}
          </h4>
          <p className="text-xs text-[#36566D] dark:text-[#B6C9D9] mt-1.5 leading-relaxed">
            {summary}
          </p>

          {/* Evidence snippet */}
          {evidence && evidence.length > 0 && (
            <div className="mt-3 pt-3 border-t border-cyan-500/15 space-y-1.5">
              <div className="text-[11px] font-bold text-[#567285] dark:text-[#7F9BB2] uppercase tracking-wider flex items-center justify-between">
                <span>Verified Evidence</span>
                {evidenceCount && (
                  <span className="text-cyan-600 dark:text-cyan-400 font-normal">{evidenceCount}</span>
                )}
              </div>
              <ul className="space-y-1">
                {evidence.slice(0, 2).map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#36566D] dark:text-[#B6C9D9] flex items-start gap-1.5"
                  >
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why this insight?</span>
          </button>

          {onActionClick && (
            <button
              type="button"
              onClick={() => onActionClick(insight)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#36566D] dark:text-[#B6C9D9] hover:text-[#08243D] dark:hover:text-[#F0F9FF] transition-colors"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* "Why this insight?" Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Explainable AI Factor Breakdown"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-gradient-to-r from-cyan-950/50 to-[#081A2F] border border-cyan-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h5 className="font-bold text-sm text-[#F0F9FF]">
                  {title}
                </h5>
              </div>
              <p className="text-xs text-[#B6C9D9] leading-relaxed">
                {summary}
              </p>
            </div>

            <div>
              <h6 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                All Corroborating Evidence Points:
              </h6>
              <ul className="space-y-2">
                {evidence.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#081A2F]/80 border border-cyan-500/20 text-xs text-[#F0F9FF] flex items-start gap-2 shadow-sm"
                  >
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              <p className="font-bold mb-0.5 text-amber-300">Decision-Support Governance Notice</p>
              <p className="text-[11px] text-amber-200/90 leading-normal">
                This insight is computed mathematically from objective metric streams (Jira deliverables, 360 reviews, LMS logs) to highlight patterns. It is intended to inform human HR judgment and never acts autonomously.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.35)] transition-all"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
