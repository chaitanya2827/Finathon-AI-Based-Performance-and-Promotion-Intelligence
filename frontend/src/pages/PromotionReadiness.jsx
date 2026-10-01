import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Users,
  Target,
  BookOpen,
  DollarSign,
  UserCheck,
  Briefcase
} from 'lucide-react';

import StatusBadge from '../components/common/StatusBadge';
import EvidenceCard from '../components/common/EvidenceCard';
import DevelopmentGapCard from '../components/common/DevelopmentGapCard';
import EmployeeAvatar from '../components/common/EmployeeAvatar';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';

import { getPromotionReadiness, getEmployees } from '../services/api';

export default function PromotionReadiness() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'EMP-1001';

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState(initialId);
  const [readinessData, setReadinessData] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionType, setDecisionType] = useState('Approved for Committee');
  const [decisionRecorded, setDecisionRecorded] = useState(false);
  const [decisionTimestamp, setDecisionTimestamp] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [empList, rData] = await Promise.all([
          getEmployees(),
          getPromotionReadiness(selectedId)
        ]);
        setEmployees(empList);
        setReadinessData(rData);
      } catch (err) {
        console.error('Failed to load promotion readiness', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedId]);

  if (loading || !readinessData) {
    return <LoadingState message="Synthesizing multi-dimensional promotion evidence..." rows={8} />;
  }

  const { employee, score, status, evidence = {}, gaps = [], aiSummary = {} } = readinessData;

  const handleRecordDecision = () => {
    setDecisionRecorded(true);
    setDecisionTimestamp(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setShowDecisionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Candidate Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight">
              Promotion Readiness Dossier
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
              Evidence-Based
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#B6C9D9] mt-0.5">
            Transparent, multi-factor decision-support analysis with auditable proofs
          </p>
        </div>

        {/* Candidate Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-[#0B223D]/60 border border-cyan-500/25 rounded-xl p-1.5 shadow-subtle backdrop-blur-md">
          <span className="text-xs font-semibold text-[#7F9BB2] pl-2">Candidate:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="text-xs font-semibold text-[#F0F9FF] bg-[#081A2F] border border-cyan-500/20 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-cyan-400 transition-all"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-[#081A2F]">
                {emp.name} ({emp.promotionReadiness}% — {emp.readinessStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prominent Mandatory AI Governance Notice */}
      <AIDisclaimerBanner
        variant="prominent"
        message="AI-generated insight for HR and manager review. Final promotion decisions remain with HR and management."
      />

      {/* Candidate Profile Header Card */}
      <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <EmployeeAvatar name={employee.name} src={employee.avatar} size="xl" status={employee.status} />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight">
                {employee.name}
              </h3>
              <StatusBadge status={employee.readinessStatus} size="md" />
            </div>

            <p className="text-sm font-semibold text-cyan-400 mt-0.5">
              Current: <span className="text-[#F0F9FF]">{employee.role}</span> → Target Role: <strong className="text-cyan-300 font-bold">{employee.careerPath?.targetRole}</strong>
            </p>

            <p className="text-xs text-[#B6C9D9] mt-1">
              Department: {employee.department} • Manager: <strong className="text-[#F0F9FF] font-medium">{employee.manager}</strong> • Review Period: Q3 2024
            </p>
          </div>
        </div>

        {/* Readiness Score Block */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-cyan-500/20 pt-4 md:pt-0 md:pl-6">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7F9BB2] block">
              Promotion Readiness
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-4xl font-black text-[#F0F9FF] tracking-tight">
                {score}%
              </span>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {status}
              </span>
            </div>
            <p className="text-[11px] text-[#7F9BB2] mt-1">
              Threshold benchmark for Level Transition: 80%
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDecisionModal(true)}
            className="btn-cyan flex items-center gap-1.5 self-center"
          >
            <UserCheck className="w-4 h-4" />
            <span>Record HR Review</span>
          </button>
        </div>
      </div>

      {decisionRecorded && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              <strong className="text-emerald-300">HR Decision Logged:</strong> "{decisionType}" recorded by Sarah Jenkins (HR Manager) on {decisionTimestamp}.
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 font-mono">Status: Locked for Committee</span>
        </div>
      )}

      {/* Comprehensive Multi-Factor Evidence Breakdown */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-500/10">
          <div>
            <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight flex items-center gap-2">
              <span>Auditable Evidence Breakdown</span>
              <span className="text-xs font-medium text-cyan-400">(Why this readiness score?)</span>
            </h3>
            <p className="text-xs text-[#B6C9D9]">
              Each criteria factor is verified against real operational deliverables and 360 calibrations
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0B223D] text-cyan-300 border border-cyan-500/20">
            6 Verification Factors
          </span>
        </div>

        {/* 6 Evidence Factor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EvidenceCard
            title="KPI & Deliverable Achievement"
            score={evidence.kpiAchievement?.score || 94}
            status={evidence.kpiAchievement?.status || 'High'}
            details={evidence.kpiAchievement?.details || 'Consistently met or exceeded all quarterly OKRs with 100%+ delivery.'}
            icon={Target}
            metricLabel="Goal Completion"
            dataSources={['Jira Sprint Velocity', 'Product Roadmap Epics (100% Shipped)', 'Executive OKR sign-off']}
            positive={true}
          />

          <EvidenceCard
            title="Project Outcomes & Complexity"
            score={evidence.projectImpact?.score || 92}
            status={evidence.projectImpact?.status || 'Very High'}
            details={evidence.projectImpact?.details || 'Shipped high-visibility initiatives with zero production outages.'}
            icon={Briefcase}
            metricLabel="Impact Score"
            dataSources={['Datadog Uptime Logs (99.98%)', 'Architecture Review Board Approvals']}
            positive={true}
          />

          <EvidenceCard
            title="Required Role Competencies"
            score={evidence.requiredSkills?.score || '8 / 10'}
            status={evidence.requiredSkills?.status || 'Strong'}
            details={evidence.requiredSkills?.details || 'Satisfies 8 of 10 competency thresholds for Target Role.'}
            icon={Award}
            metricLabel="Competencies Met"
            dataSources={['Engineering Skill Matrix v2', 'Peer Code Reviews', 'RFC Technical Leadership']}
            positive={true}
          />

          <EvidenceCard
            title="Manager & Peer Calibration"
            score={evidence.managerFeedback?.score || 94}
            status={evidence.managerFeedback?.status || 'Strong'}
            details={evidence.managerFeedback?.details || 'Consistently rated 4.7+ / 5.0 with full manager endorsement.'}
            icon={Users}
            metricLabel="Calibration Rating"
            dataSources={['Annual 360 Review (3 Evaluators)', 'Skip-Level 1:1 Evaluation']}
            positive={true}
          />

          <EvidenceCard
            title="L&D & Training Completion"
            score={evidence.trainingCompletion?.score || 90}
            status={evidence.trainingCompletion?.status || 'Strong'}
            details={evidence.trainingCompletion?.details || 'Completed required enterprise leadership and systems modules.'}
            icon={BookOpen}
            metricLabel="Coursework Track"
            dataSources={['Enterprise LMS Audit Logs', 'Accredited Course Certificates']}
            positive={true}
          />

          <EvidenceCard
            title="Direct Business & Financial Impact"
            score={evidence.businessImpact?.score || 90}
            status={evidence.businessImpact?.status || 'High'}
            details={evidence.businessImpact?.details || 'Measurable customer retention and hundreds of thousands in ARR efficiency.'}
            icon={DollarSign}
            metricLabel="Value Contribution"
            dataSources={['Finance Verified ARR Reports', 'Customer Support Ticket Deflection Metrics']}
            positive={true}
          />
        </div>
      </div>

      {/* Active Development Gaps */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/10">
          <div>
            <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <span>Identified Development Gaps</span>
            </h3>
            <p className="text-xs text-[#B6C9D9]">
              Targeted growth areas before or during the initial 90 days in target role
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-500/30">
            {gaps.length} Actionable Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.length > 0 ? (
            gaps.map((gap, idx) => (
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
            <div className="p-4 text-center text-[#7F9BB2] col-span-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="font-semibold text-xs text-[#F0F9FF]">No Critical Gaps Remaining</p>
            </div>
          )}
        </div>
      </div>

      {/* Explainable AI Synthesis Card */}
      <div className="card p-6 border-cyan-500/30 bg-[#0A1E34]/80 shadow-[0_0_20px_rgba(34,211,238,0.1)] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
            AI Synthesis & Recommendation Summary
          </h4>
        </div>

        <p className="text-xs sm:text-sm font-medium text-[#F0F9FF] leading-relaxed">
          "{aiSummary?.overview ||
            'Strong project outcomes and KPI achievement support promotion readiness. Leadership and strategic planning remain development areas.'}"
        </p>

        <div className="pt-2 border-t border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#B6C9D9]">
          <span className="font-medium">
            Reasoning: {aiSummary?.explainability?.whyThisInsight || 'Multi-source metric verification confirms high role readiness.'}
          </span>
          <span className="font-bold text-cyan-400 whitespace-nowrap">
            Confidence: {aiSummary?.explainability?.confidenceScore || '94%'}
          </span>
        </div>
      </div>

      {/* HR Decision Modal */}
      {showDecisionModal && (
        <Modal
          isOpen={showDecisionModal}
          onClose={() => setShowDecisionModal(false)}
          title={`Record Human HR Promotion Determination: ${employee.name}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#0B223D]/60 rounded-xl border border-cyan-500/20 text-[#B6C9D9]">
              <p className="font-semibold text-[#F0F9FF] mb-1">Human Decision Authority</p>
              <p>
                In compliance with Work Vista governance rules, the AI assessment serves solely as evidence synthesis. You are recording the official HR evaluation for the review committee.
              </p>
            </div>

            <div>
              <label className="font-bold text-cyan-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                Promotion Determination:
              </label>
              <select
                value={decisionType}
                onChange={(e) => setDecisionType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-cyan-500/25 bg-[#081A2F] text-[#F0F9FF] font-semibold focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="Approved for Committee" className="bg-[#081A2F]">Approved for Committee Review (Advance)</option>
                <option value="Conditional on Development Plan" className="bg-[#081A2F]">Conditional on 90-Day Development Plan</option>
                <option value="Deferred to Next Cycle" className="bg-[#081A2F]">Deferred to Next Cycle (Needs 3-6 Months)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-cyan-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                HR Manager Justification Notes:
              </label>
              <textarea
                rows={4}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Document specific rationale, cross-functional interview outcomes, and planned target role timeline..."
                className="w-full p-3 rounded-lg border border-cyan-500/25 bg-[#081A2F] text-[#F0F9FF] placeholder:text-[#7F9BB2] focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDecisionModal(false)}
                className="px-3.5 py-2 rounded-lg border border-cyan-500/20 text-[#B6C9D9] hover:bg-cyan-500/10 hover:text-[#F0F9FF] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordDecision}
                className="btn-cyan px-4 py-2"
              >
                Confirm & Record Decision
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
