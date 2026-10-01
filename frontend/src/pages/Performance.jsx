import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Award,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle,
  Filter,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import ProgressBar from '../components/common/ProgressBar';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';
import { useTheme } from '../context/ThemeContext';

import { getPerformanceData } from '../services/api';

export default function Performance() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedDept, setSelectedDept] = useState('All');
  const [timeframe, setTimeframe] = useState('9M');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getPerformanceData(selectedDept, timeframe);
        setData(res);
      } catch (err) {
        console.error('Failed to load performance analytics', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedDept, timeframe]);

  if (loading || !data) {
    return <LoadingState message="Calculating organizational performance telemetry..." rows={6} />;
  }

  const { overview, monthlyTrend, departmentComparison, goalCompletionStats, impactHighlights } = data;

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight">
            Performance Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#B6C9D9] mt-0.5">
            Holistic cross-functional metric evaluation, goal delivery, and enterprise value generated
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold bg-[#0B223D] border border-cyan-500/25 rounded-xl px-3 py-2 text-[#F0F9FF] shadow-subtle cursor-pointer focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          >
            <option value="All" className="bg-[#081A2F]">All Departments</option>
            <option value="Engineering" className="bg-[#081A2F]">Engineering</option>
            <option value="Product" className="bg-[#081A2F]">Product</option>
            <option value="Design" className="bg-[#081A2F]">Design</option>
            <option value="Data & AI" className="bg-[#081A2F]">Data & AI</option>
            <option value="Operations" className="bg-[#081A2F]">Operations</option>
          </select>

          <div className="flex items-center p-1 bg-[#0B223D]/60 rounded-xl border border-cyan-500/20 backdrop-blur-md text-xs font-semibold">
            {['3M', '6M', '9M', '1Y'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeframe === t
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                    : 'text-[#7F9BB2] hover:text-[#F0F9FF]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AIDisclaimerBanner
        variant="subtle"
        message="Synthesizes sprint delivery rates, objective OKRs, peer calibrations, and business impact indicators."
      />

      {/* Top Overview KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Overall Performance"
          value={`${overview.averagePerformanceScore}%`}
          trend="+3.2%"
          trendPositive={true}
          trendLabel="org average"
          icon={TrendingUp}
        />
        <StatCard
          title="KPI Achievement Rate"
          value={overview.kpiAchievementRate}
          trend="+4.8%"
          trendPositive={true}
          trendLabel="OKRs on track"
          icon={Target}
        />
        <StatCard
          title="High Impact Projects"
          value={overview.highImpactProjectPct}
          trend="+12%"
          trendPositive={true}
          trendLabel="rated High / Very High"
          icon={Briefcase}
        />
        <StatCard
          title="Avg 360 Feedback"
          value={overview.managerSatisfactionScore}
          trend="+0.2"
          trendPositive={true}
          trendLabel="out of 5.0"
          icon={Users}
        />
        <StatCard
          title="Business Value"
          value={overview.quantifiedBusinessImpact}
          trend="+$2.4M"
          trendPositive={true}
          trendLabel="net ARR delivered"
          icon={DollarSign}
        />
      </div>

      {/* Charts Row 1: Monthly Performance Trend & Goal Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend (2 cols) */}
        <ChartCard
          title="Monthly Performance Progression"
          subtitle="Longitudinal performance trajectories by discipline"
          className="lg:col-span-2"
          action={
            <span className="text-xs text-cyan-400 font-medium">
              Review Cycle: Jan - Sep 2024
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(34, 211, 238, 0.08)" : "rgba(8, 145, 178, 0.12)"} vertical={false} />
              <XAxis dataKey="month" stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} />
              <YAxis domain={[75, 95]} stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} unit="%" />
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
              <Line type="monotone" dataKey="overall" name="Org Average" stroke={isDark ? "#22d3ee" : "#0891B2"} strokeWidth={3} dot={{ r: 3, fill: isDark ? '#22d3ee' : '#0891B2' }} />
              <Line type="monotone" dataKey="engineering" name="Engineering" stroke={isDark ? "#06b6d4" : "#0284c7"} strokeWidth={1.8} />
              <Line type="monotone" dataKey="product" name="Product" stroke={isDark ? "#67e8f9" : "#16415F"} strokeWidth={1.8} />
              <Line type="monotone" dataKey="design" name="Design" stroke={isDark ? "#38bdf8" : "#08243D"} strokeWidth={1.8} />
              <Line type="monotone" dataKey="operations" name="Operations" stroke={isDark ? "#34d399" : "#059669"} strokeWidth={1.8} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Goal Completion Donut (1 col) */}
        <ChartCard
          title="Goal & OKR Delivery"
          subtitle="Status breakdown across 248 total individual goals"
        >
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalCompletionStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {goalCompletionStats.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
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
                    formatter={(val, name, item) => [`${val} Goals (${item.payload.pct}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-1.5 mt-2 text-xs">
              {goalCompletionStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[#B6C9D9]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-[#F0F9FF]">{item.count} ({item.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2: Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Department Performance & Goal Attainment"
          subtitle="Comparative rating indices across organizational units"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={departmentComparison}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(34, 211, 238, 0.08)" : "rgba(8, 145, 178, 0.12)"} vertical={false} />
              <XAxis dataKey="department" stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} />
              <YAxis domain={[70, 100]} stroke={isDark ? "#7F9BB2" : "#6B8496"} fontSize={11} tickLine={false} unit="%" />
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
              <Bar dataKey="avgScore" name="Avg Performance" fill={isDark ? "#06b6d4" : "#0891B2"} radius={[4, 4, 0, 0]} />
              <Bar dataKey="goalCompletion" name="Goal Completion" fill={isDark ? "#22d3ee" : "#06b6d4"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Quantified Business Impact Highlights */}
        <ChartCard
          title="Verified Business Impact Milestones"
          subtitle="Audited financial and operational outcomes delivered in Q3 review period"
        >
          <div className="w-full space-y-3">
            {impactHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#0B223D]/50 hover:bg-[#0B223D]/70 transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-[#F0F9FF] text-sm block">
                    {item.label}
                  </span>
                  <p className="text-[#B6C9D9] text-xs mt-0.5 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-base font-extrabold text-cyan-400 block">
                    {item.metric}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Finance Audited
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
