import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GitFork,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
  Compass,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ChevronDown
} from 'lucide-react';

import CareerStep from '../components/common/CareerStep';
import SkillBar from '../components/common/SkillBar';
import EmployeeAvatar from '../components/common/EmployeeAvatar';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';

import { getCareerPath, getEmployees } from '../services/api';

export default function CareerPath() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialId = searchParams.get('id') || 'EMP-1001';

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState(initialId);
  const [careerData, setCareerData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [empList, cPath] = await Promise.all([
          getEmployees(),
          getCareerPath(selectedId)
        ]);
        setEmployees(empList);
        setCareerData(cPath);
      } catch (err) {
        console.error('Failed to load career path', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedId]);

  if (loading || !careerData) {
    return <LoadingState message="Modeling intelligent career trajectory pathways..." rows={6} />;
  }

  const { employee, careerPath, developmentGaps } = careerData;

  return (
    <div className="space-y-6">
      {/* Header and Employee Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight flex items-center gap-2">
            <span>Career Path Recommendations</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
              AI Mobility Assistant
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B6C9D9] mt-0.5">
            Role progression pathways, transition competency gaps, and accelerated development actions
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0B223D]/60 border border-cyan-500/25 rounded-xl p-1.5 shadow-subtle backdrop-blur-md">
          <span className="text-xs font-semibold text-[#7F9BB2] pl-2">Employee:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
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
        message="Career progression pathways suggest personalized milestones based on organizational ladder rubrics."
      />

      {/* Selected Employee Summary */}
      <div className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <EmployeeAvatar name={employee.name} src={employee.avatar} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F0F9FF]">{employee.name}</h3>
              <StatusBadge status={employee.readinessStatus} size="sm" />
            </div>
            <p className="text-xs text-[#B6C9D9]">
              {employee.role} • {employee.department} • Manager: <strong className="text-[#F0F9FF] font-medium">{employee.manager}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/employees/${employee.id}`)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-cyan-500/25 bg-[#081A2F] text-[#B6C9D9] hover:text-[#F0F9FF] hover:border-cyan-400/40 transition-all shadow-subtle"
          >
            View Full Profile
          </button>
          <button
            type="button"
            onClick={() => navigate(`/promotion-readiness?id=${employee.id}`)}
            className="btn-cyan"
          >
            Check Promotion Readiness
          </button>
        </div>
      </div>

      {/* Visual Career Pathway Sequence */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
              Progression Horizon: Current → Target → Future
            </h3>
          </div>
          <span className="text-xs text-[#B6C9D9] font-medium">
            Projected Horizon: <strong className="text-cyan-300 font-semibold">{careerPath?.timeline || '6-12 Months'}</strong>
          </span>
        </div>

        {/* 3 Step Visual Progression Cards with connecting arrows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <CareerStep
            stage="Current Role"
            roleName={careerPath?.currentRole || employee.role}
            isCurrent={true}
            timeline="Present"
          />

          <CareerStep
            stage="Target Role"
            roleName={careerPath?.targetRole}
            isTarget={true}
            timeline={careerPath?.timeline || '3-6 Months'}
            readinessPct={careerPath?.readinessPct || employee.promotionReadiness}
            skills={careerPath?.targetSkills || []}
          />

          <CareerStep
            stage="Future Horizon"
            roleName={careerPath?.futureRole}
            isFuture={true}
            timeline="12-24 Months"
          />
        </div>
      </div>

      {/* Target Role Transition Competencies: Current -> Required -> Gap */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/10">
          <div>
            <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
              Competencies Required for: {careerPath?.targetRole}
            </h3>
            <p className="text-xs text-[#B6C9D9]">
              Detailed transition rubric breakdown (Current Proficiency → Required Target → Gap)
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {careerPath?.targetSkills?.filter((s) => s.current >= s.required).length || 0} of{' '}
            {careerPath?.targetSkills?.length || 0} Thresholds Met
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {careerPath?.targetSkills?.map((skill, idx) => (
            <SkillBar
              key={idx}
              name={skill.name}
              current={skill.current}
              required={skill.required}
              gap={skill.gap}
              status={skill.status}
            />
          ))}
        </div>
      </div>

      {/* Recommended Development Actions */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
              Recommended Development Actions for Transition
            </h3>
          </div>
          <span className="text-xs font-medium text-[#B6C9D9]">
            Synthesized by AI Career Assistant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {careerPath?.recommendedActions?.map((act, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-cyan-500/20 bg-[#0B223D]/50 hover:bg-[#0B223D]/80 hover:border-cyan-400/40 transition-all flex flex-col justify-between shadow-subtle"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {act.type}
                  </span>
                  <span className="text-xs text-[#7F9BB2] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {act.timeline}
                  </span>
                </div>

                <h5 className="font-bold text-sm text-[#F0F9FF] mb-1">
                  {act.title}
                </h5>
                <p className="text-xs text-[#B6C9D9] leading-relaxed mb-3">
                  {act.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-xs">
                <span className="text-[#7F9BB2]">Priority Impact:</span>
                <span className="font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {act.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
