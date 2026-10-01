import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Info,
  AlertCircle,
  CheckCircle2,
  Users,
  TrendingUp,
  Scale,
  Sparkles,
  HelpCircle,
  FileEdit,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';

import ChartCard from '../components/common/ChartCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';
import { useTheme } from '../context/ThemeContext';

import { getCalibrationData } from '../services/api';

export default function Calibration() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [calibrationData, setCalibrationData] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [calibrationNote, setCalibrationNote] = useState('');
  const [savedNotes, setSavedNotes] = useState({});

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getCalibrationData();
        setCalibrationData(res);
      } catch (err) {
        console.error('Failed to load calibration data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !calibrationData) {
    return <LoadingState message="Loading manager calibration consistency matrices..." rows={6} />;
  }

  const { managers, overallAverageRating, totalEvaluations, systemInsight } = calibrationData;

  const handleOpenNoteModal = (mgr) => {
    setSelectedManager(mgr);
    setCalibrationNote(savedNotes[mgr.managerId] || mgr.contextNote || '');
    setNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedManager) {
      setSavedNotes((prev) => ({
        ...prev,
        [selectedManager.managerId]: calibrationNote
      }));
    }
    setNoteModalOpen(false);
  };

  // Stacked distribution data for chart
  const stackedDistributionData = managers.map((m) => ({
    name: m.managerName.split(' ')[0], // first name for clean label
    fullName: m.managerName,
    exceptional: m.distribution.exceptional,
    strong: m.distribution.strong,
    developing: m.distribution.developing,
    rating: m.averageRating
  }));

  return (
    <div className="space-y-6">
      {/* Header and Calibration Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
            Manager Calibration Governance
          </h2>
          <p className="text-xs sm:text-sm text-[#567285] dark:text-[#7F9BB2] mt-0.5">
            Identify potential evaluation pattern variance and align rubric standards across departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#081A2F]/90 border border-cyan-500/25 text-[#36566D] dark:text-[#B6C9D9] shadow-subtle backdrop-blur-md">
            Benchmark Baseline: <strong className="text-cyan-700 dark:text-cyan-300 font-bold">{overallAverageRating} / 5.0</strong>
          </span>
        </div>
      </div>

      <AIDisclaimerBanner
        variant="subtle"
        message="Calibration governance uses neutral pattern detection. Differences in distribution reflect team maturity, project complexity, or onboarding phases."
      />

      {/* Neutral System Insight Callout */}
      <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-[#0B223D]/60 border border-cyan-500/25 text-[#08243D] dark:text-[#F0F9FF] space-y-1.5 backdrop-blur-md shadow-glass">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
            Calibration Pattern Insight
          </h4>
        </div>
        <p className="text-xs text-[#36566D] dark:text-[#B6C9D9] font-medium leading-relaxed">
          "{systemInsight.summary}"
        </p>
        <p className="text-[11px] text-[#567285] dark:text-[#7F9BB2] leading-normal">
          {systemInsight.guidance}
        </p>
      </div>

      {/* Charts Row: Average Rating Comparison & Rating Distribution Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Rating vs Baseline */}
        <ChartCard
          title="Average Rating by Evaluator"
          subtitle="Manager score mean compared to company benchmark (4.12)"
          action={
            <span className="text-xs text-[#567285] dark:text-[#7F9BB2] font-medium">
              Baseline: 4.12
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={managers}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(34, 211, 238, 0.08)" : "rgba(8, 145, 178, 0.12)"} vertical={false} />
              <XAxis dataKey="managerName" stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} />
              <YAxis domain={[3.0, 5.0]} stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} />
              <RechartsTooltip
                formatter={(val) => [`${val} / 5.0`, 'Average Rating']}
                contentStyle={{
                  backgroundColor: isDark ? '#081A2F' : '#FFFFFF',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(103, 232, 249, 0.25)' : '1px solid rgba(8, 145, 178, 0.25)',
                  fontSize: '12px',
                  color: isDark ? '#F0F9FF' : '#08243D',
                  boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.35)' : '0 8px 30px rgba(8, 36, 61, 0.1)'
                }}
                itemStyle={{ color: isDark ? '#F0F9FF' : '#08243D' }}
                labelStyle={{ color: isDark ? '#67E8F9' : '#0891B2', fontWeight: 600 }}
              />
              <ReferenceLine
                y={overallAverageRating}
                stroke={isDark ? "#22d3ee" : "#0891B2"}
                strokeDasharray="4 4"
                label={{ value: 'Org Benchmark (4.12)', fill: isDark ? '#22d3ee' : '#0891B2', fontSize: 10, position: 'top' }}
              />
              <Bar dataKey="averageRating" radius={[6, 6, 0, 0]}>
                {managers.map((entry, index) => {
                  let barColor = isDark ? '#06b6d4' : '#0891B2';
                  if (entry.varianceSignal === 'Strict') barColor = '#f59e0b';
                  if (entry.varianceSignal === 'Moderate') barColor = isDark ? '#38bdf8' : '#0284c7';
                  if (entry.varianceSignal === 'Balanced') barColor = '#10b981';
                  return <Cell key={`bar-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Distribution Comparison Stacked */}
        <ChartCard
          title="Evaluation Distribution Across Teams"
          subtitle="Share of Exceptional, Strong, and Developing ratings given"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={stackedDistributionData}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(34, 211, 238, 0.08)" : "rgba(8, 145, 178, 0.12)"} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} />
              <YAxis unit="%" stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: isDark ? '#081A2F' : '#FFFFFF',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(103, 232, 249, 0.25)' : '1px solid rgba(8, 145, 178, 0.25)',
                  fontSize: '12px',
                  color: isDark ? '#F0F9FF' : '#08243D',
                  boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.35)' : '0 8px 30px rgba(8, 36, 61, 0.1)'
                }}
                itemStyle={{ color: isDark ? '#F0F9FF' : '#08243D' }}
                labelStyle={{ color: isDark ? '#67E8F9' : '#0891B2', fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: isDark ? '#B6C9D9' : '#36566D' }} />
              <Bar dataKey="exceptional" name="Exceptional (%)" stackId="a" fill="#10b981" />
              <Bar dataKey="strong" name="Strong (%)" stackId="a" fill={isDark ? "#06b6d4" : "#0891B2"} />
              <Bar dataKey="developing" name="Developing (%)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Managers Calibration Table */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div>
            <h3 className="text-base font-bold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
              Manager Evaluation Consistency Matrix
            </h3>
            <p className="text-xs text-[#567285] dark:text-[#7F9BB2]">
              Evaluator team size, mean rating, variance indicators, and contextual review notes
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 dark:bg-[#0B223D] text-[#36566D] dark:text-[#B6C9D9] border border-cyan-500/20">
            {managers.length} People Managers
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-cyan-500/20">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cyan-50/80 dark:bg-[#061426]/90 border-b border-cyan-500/20 font-semibold text-[#567285] dark:text-cyan-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Manager</th>
                <th className="py-3.5 px-3">Department</th>
                <th className="py-3.5 px-3">Team Size</th>
                <th className="py-3.5 px-3">Average Rating</th>
                <th className="py-3.5 px-3">Rating Distribution</th>
                <th className="py-3.5 px-3">Potential Variance</th>
                <th className="py-3.5 px-4">Contextual Notes</th>
                <th className="py-3.5 px-3 text-right">HR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-[#36566D] dark:text-[#B6C9D9]">
              {managers.map((m) => {
                const currentNote = savedNotes[m.managerId] || m.contextNote;
                return (
                  <tr key={m.managerId} className="hover:bg-cyan-500/5 dark:hover:bg-cyan-950/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#08243D] dark:text-[#F0F9FF] block">{m.managerName}</span>
                      <span className="text-[11px] text-[#567285] dark:text-[#7F9BB2]">{m.role}</span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-[#36566D] dark:text-[#B6C9D9]">{m.department}</td>
                    <td className="py-3.5 px-3 font-semibold text-[#08243D] dark:text-[#F0F9FF]">
                      {m.teamSize} reports
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-bold text-[#08243D] dark:text-[#F0F9FF] text-sm">
                        <span>{m.averageRating}</span>
                        <span className="text-[11px] font-normal text-[#567285] dark:text-[#7F9BB2]">
                          ({m.benchmarkDifference >= 0 ? `+${m.benchmarkDifference}` : m.benchmarkDifference})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{m.distribution.exceptional}% Ex</span>
                        <span className="text-slate-400 dark:text-slate-600">|</span>
                        <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{m.distribution.strong}% Str</span>
                        <span className="text-slate-400 dark:text-slate-600">|</span>
                        <span className="text-amber-700 dark:text-amber-300 font-semibold">{m.distribution.developing}% Dev</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={m.varianceSignal} size="sm" />
                      <span className="block text-[10px] text-[#567285] dark:text-[#7F9BB2] mt-0.5">
                        {m.varianceLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-[11px] text-[#36566D] dark:text-[#B6C9D9] leading-snug">
                      {currentNote}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenNoteModal(m)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 dark:bg-[#0B223D] border border-cyan-500/25 text-cyan-800 dark:text-cyan-200 transition-colors"
                      >
                        <FileEdit className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        <span>Edit Note</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note Editing Modal */}
      {noteModalOpen && selectedManager && (
        <Modal
          isOpen={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          title={`HR Calibration Context: ${selectedManager.managerName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-cyan-50/70 dark:bg-[#061426]/80 border border-cyan-500/25 rounded-lg text-[#36566D] dark:text-[#B6C9D9]">
              <span className="font-semibold text-[#08243D] dark:text-[#F0F9FF] block mb-0.5">
                Evaluator: {selectedManager.managerName} ({selectedManager.role})
              </span>
              <p className="text-[11px]">
                Average Team Rating: <strong className="text-cyan-700 dark:text-cyan-300">{selectedManager.averageRating}</strong> ({selectedManager.benchmarkDifference} vs company benchmark)
              </p>
            </div>

            <div>
              <label className="font-bold text-[#08243D] dark:text-[#F0F9FF] block mb-1 uppercase tracking-wider text-[11px]">
                Document Organizational & Contextual Factors:
              </label>
              <textarea
                rows={4}
                value={calibrationNote}
                onChange={(e) => setCalibrationNote(e.target.value)}
                placeholder="E.g., Team recently absorbed 4 junior engineers, project delivered ahead of schedule, or specific evaluation criteria context..."
                className="w-full p-3 rounded-lg border border-cyan-500/30 bg-white dark:bg-[#061426] text-[#08243D] dark:text-[#F0F9FF] text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-cyan-500/25 text-[#567285] dark:text-[#7F9BB2] hover:bg-cyan-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="btn-cyan text-xs"
              >
                Save Contextual Note
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
