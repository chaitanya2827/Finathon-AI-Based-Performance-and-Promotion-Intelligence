import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Bell,
  Database,
  Check,
  Download,
  RotateCcw
} from 'lucide-react';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';

export default function Settings() {
  const [weights, setWeights] = useState({
    kpi: 35,
    projectImpact: 25,
    feedback: 20,
    skills: 15,
    training: 5
  });

  const [thresholds, setThresholds] = useState({
    promotionMinScore: 80,
    calibrationVarianceTolerance: 0.4,
    minTenureMonths: 6
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setWeights({
      kpi: 35,
      projectImpact: 25,
      feedback: 20,
      skills: 15,
      training: 5
    });
    setThresholds({
      promotionMinScore: 80,
      calibrationVarianceTolerance: 0.4,
      minTenureMonths: 6
    });
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
            Platform Settings & Governance
          </h2>
          <p className="text-xs sm:text-sm text-[#567285] dark:text-[#7F9BB2] mt-0.5">
            Configure decision-support rubric weightings, calibration tolerances, and audit policies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-cyan-500/25 bg-white/90 dark:bg-[#081A2F]/90 text-[#36566D] dark:text-[#B6C9D9] hover:bg-cyan-500/10 dark:hover:bg-[#0B223D] transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Restore Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-cyan text-xs flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <AIDisclaimerBanner
        variant="subtle"
        message="Governance configurations control how Work Vista calculates explainability scores and flags calibration variance."
      />

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Governance configuration updated successfully! New weights applied to review pipeline.</span>
        </div>
      )}

      {/* Rubric Weightings Card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
                Decision-Support Factor Weightings
              </h3>
              <p className="text-xs text-[#567285] dark:text-[#7F9BB2]">
                Adjust the relative contribution of each evidence dimension to promotion readiness
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              totalWeight === 100
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
            }`}
          >
            Total Weight: {totalWeight}% {totalWeight !== 100 && '(Must equal 100%)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-[#061426]/70 border border-cyan-500/20 space-y-2">
            <div className="flex justify-between font-semibold text-[#08243D] dark:text-[#F0F9FF]">
              <span>KPI & OKR Attainment</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">{weights.kpi}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.kpi}
              onChange={(e) => setWeights({ ...weights, kpi: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Measures completion rate on quarterly business and sprint goals.</p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-[#061426]/70 border border-cyan-500/20 space-y-2">
            <div className="flex justify-between font-semibold text-[#08243D] dark:text-[#F0F9FF]">
              <span>Project Deliverables & Impact</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">{weights.projectImpact}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.projectImpact}
              onChange={(e) => setWeights({ ...weights, projectImpact: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Complexity, architecture scope, and uptime resilience.</p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-[#061426]/70 border border-cyan-500/20 space-y-2">
            <div className="flex justify-between font-semibold text-[#08243D] dark:text-[#F0F9FF]">
              <span>360 Manager & Peer Reviews</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">{weights.feedback}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={weights.feedback}
              onChange={(e) => setWeights({ ...weights, feedback: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Cross-functional feedback and teamwork evaluations.</p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-[#061426]/70 border border-cyan-500/20 space-y-2">
            <div className="flex justify-between font-semibold text-[#08243D] dark:text-[#F0F9FF]">
              <span>Skills Matrix Alignment</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">{weights.skills}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={weights.skills}
              onChange={(e) => setWeights({ ...weights, skills: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Percentage of target role competency criteria met.</p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-[#061426]/70 border border-cyan-500/20 space-y-2 md:col-span-2">
            <div className="flex justify-between font-semibold text-[#08243D] dark:text-[#F0F9FF]">
              <span>LMS Training & Compliance</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">{weights.training}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={weights.training}
              onChange={(e) => setWeights({ ...weights, training: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Mandatory security certifications and professional development courses.</p>
          </div>
        </div>
      </div>

      {/* Threshold Governance Card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/15">
          <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
              Thresholds & Calibration Governance
            </h3>
            <p className="text-xs text-[#567285] dark:text-[#7F9BB2]">
              Set sensitivity triggers for committee flagging and manager variance alerts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-[#061426]/70 border border-cyan-500/25 space-y-2">
            <span className="font-semibold text-[#08243D] dark:text-[#F0F9FF] block">
              Promotion Readiness Cutoff
            </span>
            <input
              type="number"
              value={thresholds.promotionMinScore}
              onChange={(e) => setThresholds({ ...thresholds, promotionMinScore: Number(e.target.value) })}
              className="w-full p-2 rounded-lg border border-cyan-500/30 bg-white dark:bg-[#081A2F] font-bold text-[#08243D] dark:text-[#F0F9FF] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Score at which a candidate is flagged as 'Ready'.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 dark:bg-[#061426]/70 border border-cyan-500/25 space-y-2">
            <span className="font-semibold text-[#08243D] dark:text-[#F0F9FF] block">
              Calibration Variance Tolerance (Δ)
            </span>
            <input
              type="number"
              step="0.1"
              value={thresholds.calibrationVarianceTolerance}
              onChange={(e) => setThresholds({ ...thresholds, calibrationVarianceTolerance: Number(e.target.value) })}
              className="w-full p-2 rounded-lg border border-cyan-500/30 bg-white dark:bg-[#081A2F] font-bold text-[#08243D] dark:text-[#F0F9FF] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Delta from company average before flagging potential variance.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 dark:bg-[#061426]/70 border border-cyan-500/25 space-y-2">
            <span className="font-semibold text-[#08243D] dark:text-[#F0F9FF] block">
              Minimum Tenure Before Review
            </span>
            <input
              type="number"
              value={thresholds.minTenureMonths}
              onChange={(e) => setThresholds({ ...thresholds, minTenureMonths: Number(e.target.value) })}
              className="w-full p-2 rounded-lg border border-cyan-500/30 bg-white dark:bg-[#081A2F] font-bold text-[#08243D] dark:text-[#F0F9FF] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            />
            <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">Months of active service required for promotion review.</p>
          </div>
        </div>
      </div>

      {/* Service Layer & API Status */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
                API Integration & Data Export
              </h3>
              <p className="text-xs text-[#567285] dark:text-[#7F9BB2]">
                Service layer is currently connected to synthetic client store. Ready for REST API endpoints.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            Mock Service Active
          </span>
        </div>

        <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-[#061426]/70 border border-cyan-500/20 text-xs text-[#36566D] dark:text-[#B6C9D9] space-y-2 font-mono">
          <p className="text-[#08243D] dark:text-[#F0F9FF] font-bold font-sans">Data Endpoints Configured in src/services/api.js:</p>
          <ul className="space-y-1 text-[#567285] dark:text-[#7F9BB2] pl-2">
            <li>• GET /api/v1/workforce/dashboard-stats</li>
            <li>• GET /api/v1/employees?search=&dept=&role=</li>
            <li>• GET /api/v1/employees/:id</li>
            <li>• GET /api/v1/performance/analytics</li>
            <li>• GET /api/v1/skills/radar</li>
            <li>• GET /api/v1/promotion-readiness/:id</li>
            <li>• GET /api/v1/calibration/matrix</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
