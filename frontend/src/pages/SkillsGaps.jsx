import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  Search,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import ChartCard from '../components/common/ChartCard';
import SkillBar from '../components/common/SkillBar';
import DevelopmentGapCard from '../components/common/DevelopmentGapCard';
import StatusBadge from '../components/common/StatusBadge';
import EmployeeAvatar from '../components/common/EmployeeAvatar';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';
import { useTheme } from '../context/ThemeContext';

import { getSkillsData, getEmployees } from '../services/api';

export default function SkillsGaps() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [skillsData, setSkillsData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP-1001');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [sData, empList] = await Promise.all([
          getSkillsData(),
          getEmployees()
        ]);
        setSkillsData(sData);
        setEmployees(empList);
      } catch (err) {
        console.error('Failed to load skills data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !skillsData) {
    return <LoadingState message="Mapping organizational skill competencies..." rows={6} />;
  }

  const { organizationRadar, commonGaps, topInDemandSkills, developmentPrograms } = skillsData;
  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  return (
    <div className="space-y-6">
      {/* Header and Employee Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight">
            Skills & Development Gaps
          </h2>
          <p className="text-xs sm:text-sm text-[#B6C9D9] mt-0.5">
            Competency rubrics, proficiency benchmarks, and personalized growth pathways
          </p>
        </div>

        {/* Employee context selector */}
        <div className="flex items-center gap-2 bg-[#0B223D]/60 border border-cyan-500/25 rounded-xl p-1.5 shadow-subtle backdrop-blur-md">
          <span className="text-xs font-semibold text-[#7F9BB2] pl-2">Focus Profile:</span>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="text-xs font-semibold text-[#F0F9FF] bg-[#081A2F] border border-cyan-500/20 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-cyan-400 transition-all"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-[#081A2F]">
                {emp.name} — {emp.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AIDisclaimerBanner
        variant="subtle"
        message="Competencies are calibrated against Level Matrices and reviewed quarterly during 360 cycles."
      />

      {/* Focus Employee Summary Banner */}
      {currentEmployee && (
        <div className="card p-5 bg-[#0A1E34]/80 border border-cyan-500/25 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <EmployeeAvatar name={currentEmployee.name} src={currentEmployee.avatar} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F0F9FF]">{currentEmployee.name}</h3>
                <span className="text-xs font-mono text-[#7F9BB2]">{currentEmployee.id}</span>
                <StatusBadge status={currentEmployee.readinessStatus} size="sm" />
              </div>
              <p className="text-xs text-cyan-400 font-semibold">{currentEmployee.role} • {currentEmployee.department}</p>
              <p className="text-xs text-[#B6C9D9] mt-0.5">
                Target Role: <strong className="text-cyan-300 font-medium">{currentEmployee.careerPath?.targetRole}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-2.5 rounded-xl bg-[#081A2F] border border-cyan-500/20 text-center min-w-[100px]">
              <span className="text-[#7F9BB2] block text-[10px] uppercase font-semibold">Skill Score</span>
              <span className="text-lg font-extrabold text-[#F0F9FF]">{currentEmployee.skillScore}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#081A2F] border border-cyan-500/20 text-center min-w-[100px]">
              <span className="text-[#7F9BB2] block text-[10px] uppercase font-semibold">Active Gaps</span>
              <span className="text-lg font-extrabold text-amber-400">
                {currentEmployee.developmentGaps?.length || 0} Gaps
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Radar Chart & Gap Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <ChartCard
          title="Organizational Competency Radar"
          subtitle="Cohort average current proficiency vs required promotion target benchmark"
        >
          <ResponsiveContainer width="100%" height={290}>
            <RadarChart data={organizationRadar}>
              <PolarGrid stroke={isDark ? "rgba(34, 211, 238, 0.15)" : "rgba(8, 145, 178, 0.2)"} />
              <PolarAngleAxis dataKey="skill" tick={{ fill: isDark ? '#B6C9D9' : '#36566D', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[60, 100]} stroke={isDark ? "rgba(34, 211, 238, 0.2)" : "rgba(8, 145, 178, 0.25)"} fontSize={10} />
              <Radar
                name="Current Proficiency"
                dataKey="current"
                stroke={isDark ? "#22d3ee" : "#0891B2"}
                fill={isDark ? "#22d3ee" : "#0891B2"}
                fillOpacity={isDark ? 0.35 : 0.25}
              />
              <Radar
                name="Required Target"
                dataKey="required"
                stroke={isDark ? "#06b6d4" : "#16415F"}
                fill={isDark ? "#06b6d4" : "#16415F"}
                fillOpacity={isDark ? 0.15 : 0.15}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: isDark ? '#B6C9D9' : '#36566D' }} />
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
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Most Common Company-Wide Skill Gaps */}
        <ChartCard
          title="Top Organizational Skill Gaps"
          subtitle="Highest frequency deficits across candidate promotion pools"
        >
          <div className="w-full space-y-3">
            {commonGaps.map((g, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-cyan-500/20 bg-[#0B223D]/50 hover:bg-[#0B223D]/70 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F0F9FF]">{g.skill}</span>
                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {g.department}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#B6C9D9] mt-1">
                    Affects <strong className="text-[#F0F9FF]">{g.count} team members</strong> with average -{g.avgGap}% gap
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    -{g.avgGap}% Deficit
                  </span>
                  <span className="block text-[10px] font-semibold text-[#7F9BB2] mt-1">
                    {g.severity} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Focus Profile's Complete Skill Matrix: Current vs Required vs Gap */}
      {currentEmployee && (
        <div className="card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-500/10">
            <div>
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Skill Assessment Matrix: {currentEmployee.name}
              </h3>
              <p className="text-xs text-[#B6C9D9]">
                Evaluation against Target Role: <strong className="text-cyan-400">{currentEmployee.careerPath?.targetRole}</strong>
              </p>
            </div>

            {/* Clear Legends */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                Current Skills
              </span>
              <span className="flex items-center gap-1.5 text-[#B6C9D9]">
                <span className="w-2.5 h-2.5 bg-cyan-800 rounded-sm" />
                Required Threshold
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />
                Development Gap
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentEmployee.skills?.map((skill, idx) => (
              <SkillBar
                key={idx}
                name={skill.name}
                category={skill.category}
                current={skill.current}
                required={skill.required}
                gap={skill.gap}
                status={skill.status}
              />
            ))}
          </div>
        </div>
      )}

      {/* Development Recommendations Section */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
              Actionable Development Recommendations
            </h3>
          </div>
          <span className="text-xs font-medium text-[#B6C9D9]">
            Tailored for {currentEmployee?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentEmployee?.developmentGaps?.length > 0 ? (
            currentEmployee.developmentGaps.map((gap, idx) => (
              <DevelopmentGapCard
                key={idx}
                skill={gap.skill}
                current={gap.current}
                required={gap.required}
                gap={gap.gap}
                severity={gap.severity}
                recommendation={gap.recommendation}
              />
            ))
          ) : (
            <div className="p-6 text-center text-[#B6C9D9] col-span-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-[#F0F9FF] text-sm">All Target Skill Thresholds Met</p>
              <p className="text-xs text-[#B6C9D9] mt-1">This candidate exhibits zero critical developmental deficits for their target role.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
