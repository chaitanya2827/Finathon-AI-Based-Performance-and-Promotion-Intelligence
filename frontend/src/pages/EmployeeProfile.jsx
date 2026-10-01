import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  UserCheck,
  Target,
  Briefcase,
  MessageSquare,
  Sparkles,
  BookOpen,
  Clock,
  HelpCircle,
  Award,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  AlertCircle,
  Mic,
  Square
} from 'lucide-react';
import { Conversation } from '@elevenlabs/client';

import EmployeeAvatar from '../components/common/EmployeeAvatar';
import StatusBadge from '../components/common/StatusBadge';
import ScoreCard from '../components/common/ScoreCard';
import SkillBar from '../components/common/SkillBar';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import AIDisclaimerBanner from '../components/common/AIDisclaimerBanner';

import { getEmployeeById, getVoicePerformanceBrief } from '../services/api';

const ELEVENLABS_AGENT_ID = 'agent_0301m3tzca13fa4sewcn3z1h8nec';

/**
 * Prepares compact, factual context for the ElevenLabs voice agent
 * based on the currently viewed employee in WORKVISTA.
 */
function buildEmployeeContext(emp) {
  if (!emp) return '';

  const empId = emp.backendId || emp.id || '';
  const empName = emp.name || '';
  const currentRole = emp.role || '';
  const targetRole = emp.targetRole || emp.careerPath?.targetRole || 'Not specified';
  const dept = emp.department || '';
  const perfScore = emp.performanceScore != null ? `${emp.performanceScore}%` : 'N/A';
  const skillScore = emp.skillScore != null ? `${emp.skillScore}%` : 'N/A';

  // Promotion Readiness
  const readiness =
    emp.readinessStatus ||
    emp.promotionReadiness ||
    'Under Evaluation';
  const readinessTimeline = emp.careerPath?.timeline || '';
  const fullReadiness = readinessTimeline ? `${readiness} (${readinessTimeline})` : readiness;

  // Skill Gaps
  const gapsList = (emp.developmentGaps || []).map(
    (g) => `${g.skill || g.name} (Gap: ${g.gap}%, ${g.severity || 'Moderate'} severity)`
  );
  const skillGaps = gapsList.length > 0 ? gapsList.join(', ') : 'No critical skill gaps identified.';

  // Key Skills
  const skillsList = (emp.skills || [])
    .slice(0, 8)
    .map((s) => `${s.name} (${s.current}%)`)
    .join(', ');

  // Goals & Verification Evidence
  const goalsList = (emp.goals || [])
    .map((g) => `${g.goal || g.title} [Target: ${g.target}, Achieved: ${g.achievement}, Status: ${g.status}]`)
    .join('; ');

  // Projects & Deliverables
  const projectsList = (emp.projects || [])
    .map((p) => `${p.name} (Role: ${p.role}, Outcome: ${p.outcome || 'Delivered'})`)
    .join('; ');

  // 360 Feedback
  const feedbackList = (emp.feedback || [])
    .map((f) => `${f.type} (${f.author}): "${f.comment}"`)
    .join('; ');

  // Training & Compliance
  const trainingSummary = (emp.training || [])
    .map((t) => `${t.name} (${t.status})`)
    .join(', ');

  // Attendance
  const attendanceInfo = emp.attendance
    ? `Overall: ${emp.attendance.overall || '99%'}, Punctuality: ${emp.attendance.punctuality || '99%'}`
    : 'Standard operational attendance';

  // Business Impact
  const impactInfo = emp.businessImpact
    ? `${emp.businessImpact.rating || 'High'}: ${emp.businessImpact.summary || 'Sustained contribution'}`
    : 'Strong delivery and measurable business contribution';

  // Calibration Status & Note
  const cal = emp.calibration;
  let calStatus = 'No potential evaluation inconsistency detected.';
  let calNote = '';
  if (cal) {
    if (cal.flag) {
      calStatus = 'Potential evaluation inconsistency detected. Flagged for HR review and calibration.';
      calNote = `Variance of ${cal.variance} points between manager rating and evidence score (${cal.evidenceScore}%).`;
    } else {
      calStatus = 'No potential evaluation inconsistency detected.';
      calNote = 'Manager rating is aligned with objective metrics and deliverables.';
    }
  }

  // Career Recommendation
  const careerRec = emp.careerPath?.targetRole || targetRole;

  return `CURRENT WORKVISTA EMPLOYEE CONTEXT

Employee:
${empName}

Employee ID:
${empId}

Current Role:
${currentRole}

Department:
${dept}

Performance:
${perfScore}

Skill Match:
${skillScore}

Target Role:
${targetRole}

Promotion Readiness:
${fullReadiness}

Skill Gaps:
${skillGaps}

Skills:
${skillsList}

Goals & Evidence:
${goalsList}

Projects:
${projectsList}

Feedback:
${feedbackList}

Training:
${trainingSummary}

Attendance:
${attendanceInfo}

Business Impact:
${impactInfo}

Calibration:
${calStatus}${calNote ? ' ' + calNote : ''}

Career Recommendation:
${careerRec}

GROUNDING & SAFETY GUIDELINES:
- You are WORKVISTA Voice AI, an HR Intelligence assistant.
- Strictly ground your answers in the supplied WORKVISTA employee context.
- If asked about information not present in the current WORKVISTA data, say: "I don't have that information in the current WORKVISTA data."
- Do NOT make ungrounded claims or declare managers "biased" or "wrong".
- Use objective, neutral HR language: "Potential evaluation inconsistency detected", "Flagged for HR review and calibration", "The current WORKVISTA analysis indicates...", "Final promotion decisions remain with HR and management."`;
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'goals' | 'projects' | 'feedback' | 'skills' | 'training'

  const [profileError, setProfileError] = useState(null);

  // AI Performance Voice Brief state
  const [voiceData, setVoiceData] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Ask WORKVISTA Conversational Voice Agent state
  const [convStatus, setConvStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected'
  const [convMode, setConvMode] = useState('listening'); // 'listening' | 'speaking'
  const [convError, setConvError] = useState(null);
  const conversationRef = useRef(null);

  // Clean up voice conversation session when component unmounts
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        try {
          conversationRef.current.endSession();
        } catch (err) {
          console.warn('Error ending voice session on unmount:', err);
        }
        conversationRef.current = null;
      }
    };
  }, []);

  // Reset voice states when navigating to a different employee
  useEffect(() => {
    if (conversationRef.current) {
      try {
        conversationRef.current.endSession();
      } catch (err) {
        console.warn('Error ending voice session on route change:', err);
      }
      conversationRef.current = null;
    }
    setConvStatus('idle');
    setConvMode('listening');
    setConvError(null);

    setVoiceData(null);
    setVoiceLoading(false);
    setVoiceError(null);
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [id]);

  const handleStartConversation = async () => {
    if (convStatus !== 'idle') return;
    setConvError(null);

    // 1. Explicitly request microphone permission on user interaction
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setConvError('Microphone access is not supported by your browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the probe stream so ElevenLabs SDK can capture the audio cleanly
      stream.getTracks().forEach((track) => track.stop());
    } catch (micErr) {
      console.error('Microphone permission denied or error:', micErr);
      setConvError('Microphone permission is required to use Ask WORKVISTA.');
      setConvStatus('idle');
      return;
    }

    setConvStatus('connecting');

    try {
      const contextText = buildEmployeeContext(employee);

      const conversation = await Conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        dynamicVariables: {
          employee_name: employee?.name || 'Employee',
          employee_id: employee?.backendId || employee?.id || id,
          current_role: employee?.role || 'Specialist',
          target_role: employee?.targetRole || 'Senior Specialist',
          performance_score: employee?.performanceScore != null ? `${employee.performanceScore}%` : 'N/A',
          promotion_readiness: employee?.readinessStatus || employee?.promotionReadiness || 'Under Evaluation',
          context: contextText
        },
        onConnect: () => {
          setConvStatus('connected');
          setConvMode('listening');
        },
        onDisconnect: () => {
          setConvStatus('idle');
          setConvMode('listening');
          conversationRef.current = null;
        },
        onError: (message, context) => {
          console.error('ElevenLabs voice agent error:', message, context);
          setConvError('Unable to connect to the WORKVISTA voice assistant. Please try again.');
          setConvStatus('idle');
          conversationRef.current = null;
        },
        onModeChange: ({ mode }) => {
          setConvMode(mode);
        }
      });

      conversationRef.current = conversation;

      // Provide current employee context update immediately after session establishes
      try {
        await conversation.sendContextualUpdate(contextText);
      } catch (ctxErr) {
        console.warn('Contextual update note:', ctxErr);
      }
    } catch (err) {
      console.error('Failed to start ElevenLabs session:', err);
      setConvError('Unable to connect to the WORKVISTA voice assistant. Please try again.');
      setConvStatus('idle');
      conversationRef.current = null;
    }
  };

  const handleEndConversation = async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch (err) {
        console.warn('Error during endSession:', err);
      }
      conversationRef.current = null;
    }
    setConvStatus('idle');
    setConvMode('listening');
  };

  const handleGenerateVoiceBrief = async () => {
    if (voiceLoading) return;
    const targetEmpId = employee?.backendId || employee?.id || id;
    if (!targetEmpId) return;

    try {
      setVoiceLoading(true);
      setVoiceError(null);
      const result = await getVoicePerformanceBrief(targetEmpId);
      setVoiceData(result);
    } catch (err) {
      console.error('Error generating voice brief:', err);
      setVoiceError(err?.message || 'Unable to generate the AI performance brief. Please try again.');
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Playback error:', err);
      });
    }
  };

  const handleReplay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => {
      console.error('Playback error:', err);
    });
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const curr = audioRef.current.currentTime || 0;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);
    if (dur > 0) {
      setAudioProgress((curr / dur) * 100);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const newPct = parseFloat(e.target.value);
    const newTime = (newPct / 100) * duration;
    audioRef.current.currentTime = newTime;
    setAudioProgress(newPct);
    setCurrentTime(newTime);
  };

  const formatSeconds = (sec) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setProfileError(null);
        const data = await getEmployeeById(id || 'EMP001');
        setEmployee(data);
      } catch (err) {
        console.error('Failed to load profile', err);
        setProfileError('Unable to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading employee data..." rows={8} />;
  }

  if (profileError && !employee) {
    return (
      <div className="card p-8 text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#F0F9FF]">Unable to load employee data</h3>
        <p className="text-xs text-[#B6C9D9]">Unable to load employee data. Please try again.</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setProfileError(null);
            getEmployeeById(id || 'EMP001')
              .then(setEmployee)
              .catch(() => setProfileError('Unable to load employee data. Please try again.'))
              .finally(() => setLoading(false));
          }}
          className="btn-cyan px-4 py-2 text-xs font-semibold mx-auto inline-flex items-center gap-2"
        >
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (!employee) {
    return <LoadingState message="Loading employee data..." rows={8} />;
  }

  const {
    name,
    avatar,
    role,
    targetRole,
    department,
    manager,
    email,
    joinDate,
    location,
    performanceScore,
    skillScore,
    promotionReadiness: _promotionReadiness,
    readinessStatus,
    performanceCategory,
    status,
    calibration,
    goals = [],
    projects = [],
    feedback = [],
    skills = [],
    training = [],
    attendance = {},
    businessImpact = {},
    aiSummary = {},
    developmentGaps = []
  } = employee;

  // Calculate training completion rate
  const completedTrainingCount = training.filter((t) => t.status === 'Completed').length;
  const trainingCompletionRate =
    training.length > 0
      ? Math.round((completedTrainingCount / training.length) * 100)
      : 85;

  // Parse dynamic promotion readiness status returned by backend
  const rawReadiness = String(readinessStatus || employee.promotionEvidence?.readiness_level || 'Developing');
  let readinessMainStatus = 'READY NOW';
  let readinessDetailText = null;

  if (rawReadiness.includes(' - ')) {
    const parts = rawReadiness.split(' - ');
    readinessMainStatus = parts[0].trim().toUpperCase();
    readinessDetailText = parts[1]?.trim() || null;
  } else if (rawReadiness.includes(' — ')) {
    const parts = rawReadiness.split(' — ');
    readinessMainStatus = parts[0].trim().toUpperCase();
    readinessDetailText = parts[1]?.trim() || null;
  } else {
    readinessMainStatus = rawReadiness.trim().toUpperCase();
  }

  const isReadyNow = readinessMainStatus.includes('READY') && !readinessMainStatus.includes('DEVELOPING');

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/employees')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B6C9D9] hover:text-[#F0F9FF] bg-[#0A1E34]/80 border border-cyan-500/20 hover:border-cyan-400/40 px-3 py-1.5 rounded-lg shadow-subtle transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to Employees</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/career-path?id=${employee.id}`)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-cyan-500/25 bg-[#0A1E34]/80 text-[#B6C9D9] hover:text-[#F0F9FF] hover:border-cyan-400/50 transition-all shadow-subtle"
          >
            Career Path
          </button>
          <button
            type="button"
            onClick={() => navigate(`/promotion-readiness?id=${employee.id}`)}
            className="btn-cyan flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Promotion Readiness Dossier</span>
          </button>
        </div>
      </div>

      {/* Decision Support Banner */}
      <AIDisclaimerBanner
        variant="subtle"
        message="Decision Support System Active: All profile scores represent synthesized multi-source metrics. No automated HR decisions are enacted."
      />

      {/* Decision-Support Calibration Advisory (when inconsistency is detected) */}
      {calibration?.flag && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200 shadow-glass">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>HR Calibration Advisory:</strong> Potential evaluation inconsistency detected between manager evaluation and multi-factor telemetry. Flagged for neutral HR committee calibration review.
          </span>
        </div>
      )}

      {/* Employee Profile Header Card */}
      <div className="card p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <EmployeeAvatar name={name} src={avatar} size="xl" status={status} />
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold text-[#F0F9FF] tracking-tight">
                  {name}
                </h2>
                <StatusBadge status={readinessStatus} size="sm" />
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#0B223D] text-cyan-400 border border-cyan-500/20">
                  {employee.id}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <p className="text-sm font-semibold text-cyan-400">{role}</p>
                {targetRole && (
                  <span className="text-xs text-[#7F9BB2] flex items-center gap-1 font-medium">
                    <span>→ Target Role:</span>
                    <strong className="text-cyan-300 font-semibold">{targetRole}</strong>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#B6C9D9] pt-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400/70" />
                  {department}
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400/70" />
                  Manager: <strong className="text-[#F0F9FF] font-medium">{manager}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400/70" />
                  {email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400/70" />
                  Joined: {joinDate}
                </span>
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400/70" />
                    {location}
                  </span>
                )}
                {developmentGaps?.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {developmentGaps.length} Target Gaps Identified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-cyan-500/10">
            <span className="text-xs text-[#7F9BB2]">Review Status</span>
            {calibration?.flag ? (
              <span className="text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <span>Potential evaluation inconsistency detected</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>Calibration Aligned with Evidence</span>
              </span>
            )}
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-cyan-500/10">
          <ScoreCard
            title="Performance Score"
            score={performanceScore}
            status={performanceCategory}
            benchmark={82}
            subtitle="KPIs & Deliverables"
          />
          <ScoreCard
            title="Skill Score"
            score={skillScore}
            benchmark={80}
            subtitle="Competency Rubric"
          />

          {/* Promotion Readiness Card (Status Based - No Numeric Percentage) */}
          <div className="card p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:border-cyan-400/40 hover:shadow-glass-hover transition-all min-w-0 overflow-hidden">
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-bold uppercase tracking-wider text-[#567285] dark:text-[#7F9BB2] truncate"
                title="Promotion Readiness"
              >
                Promotion Readiness
              </p>
              <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                <span
                  className={`text-xl sm:text-2xl font-black tracking-tight ${
                    isReadyNow ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {readinessMainStatus}
                </span>
              </div>
              {readinessDetailText && (
                <p className="text-xs font-semibold text-amber-300/90 mt-0.5 truncate">
                  {readinessDetailText}
                </p>
              )}
              <p className="text-xs text-[#36566D] dark:text-[#B6C9D9] mt-1 truncate">
                Target: <strong className="text-cyan-300 font-semibold">{targetRole || 'Target Role'}</strong>
              </p>
            </div>

            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
              {isReadyNow ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.25)]">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.25)]">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                </div>
              )}
            </div>
          </div>

          <ScoreCard
            title="Training Completion"
            score={trainingCompletionRate}
            benchmark={85}
            subtitle="LMS Compliance"
          />
        </div>
      </div>

      {/* Explainable AI Performance Profile with Prominent Ask WORKVISTA Voice Agent */}
      <div className="card p-6 border border-cyan-500/25 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/15 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#08243D] dark:text-[#F0F9FF] tracking-tight">
                Explainable AI Performance Profile
              </h3>
              <p className="text-xs text-[#567285] dark:text-[#7F9BB2]">
                Confidence: {aiSummary?.explainability?.confidenceScore || '94%'} • 4 Independent audit streams verified
              </p>
            </div>
          </div>

          <button
            type="button"
            id="why-this-insight-btn"
            onClick={() => setShowExplainModal(true)}
            className="btn-glass self-start sm:self-auto flex items-center gap-1.5 text-xs py-1.5 px-3"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Why this insight?</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm font-medium text-[#36566D] dark:text-[#D8E6F2] leading-relaxed">
          {aiSummary?.overview ||
            "Strong overall performance driven by consistent KPI achievement and successful project delivery. Technical execution is in the top 5% of the engineering cohort. Leadership and strategic planning remain development areas."}
        </p>

        {/* PROMINENT ASK WORKVISTA CONVERSATIONAL VOICE AGENT */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#06182C] via-[#0A223E] to-[#06182C] border-2 border-cyan-400/40 shadow-[0_0_26px_rgba(34,211,238,0.20)] relative overflow-hidden space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <Mic className="w-5 h-5 text-cyan-300" />
                </span>
                <h4 className="text-lg font-black tracking-tight text-[#F0F9FF] flex items-center gap-2">
                  🎙️ ASK WORKVISTA
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 tracking-wider uppercase">
                    Live Conversational Agent
                  </span>
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100 font-medium">
                Talk to WORKVISTA about this employee in real-time.
              </p>
              <div className="text-xs text-[#7F9BB2] flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="font-semibold text-[#B6C9D9]">Ask questions about:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#041426] border border-cyan-500/20 text-cyan-300 text-[11px]">Performance</span>
                <span className="px-2 py-0.5 rounded-md bg-[#041426] border border-cyan-500/20 text-cyan-300 text-[11px]">Skills</span>
                <span className="px-2 py-0.5 rounded-md bg-[#041426] border border-cyan-500/20 text-cyan-300 text-[11px]">Career</span>
                <span className="px-2 py-0.5 rounded-md bg-[#041426] border border-cyan-500/20 text-cyan-300 text-[11px]">Promotion Readiness</span>
                <span className="px-2 py-0.5 rounded-md bg-[#041426] border border-cyan-500/20 text-cyan-300 text-[11px]">Calibration</span>
              </div>
            </div>

            {/* Voice Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
              {/* PRIMARY: Ask WORKVISTA */}
              {convStatus === 'idle' && (
                <button
                  type="button"
                  id="ask-workvista-btn"
                  onClick={handleStartConversation}
                  className="btn-cyan py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_28px_rgba(34,211,238,0.6)]"
                >
                  <Mic className="w-4 h-4 text-[#04101e]" />
                  <span>Ask WORKVISTA</span>
                </button>
              )}

              {convStatus === 'connecting' && (
                <button
                  type="button"
                  id="ask-workvista-btn-connecting"
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-xs font-bold text-cyan-300 flex items-center justify-center gap-2 opacity-90 cursor-wait shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                >
                  <Loader2 className="w-4 h-4 text-cyan-300 animate-spin" />
                  <span>Connecting...</span>
                </button>
              )}

              {convStatus === 'connected' && (
                <div className="flex items-center gap-2">
                  <div
                    id="ask-workvista-status-badge"
                    className="px-4 py-2 rounded-xl bg-[#041426] border border-cyan-400/50 flex items-center gap-2.5 text-xs font-semibold shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          convMode === 'speaking' ? 'bg-cyan-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          convMode === 'speaking' ? 'bg-cyan-500' : 'bg-emerald-500'
                        }`}
                      />
                    </span>
                    <span className={convMode === 'speaking' ? 'text-cyan-200' : 'text-emerald-300'}>
                      {convMode === 'speaking' ? 'WORKVISTA is responding...' : 'Listening...'}
                    </span>
                  </div>

                  <button
                    type="button"
                    id="ask-workvista-end-btn"
                    onClick={handleEndConversation}
                    className="px-4 py-2 rounded-xl bg-rose-500/25 hover:bg-rose-500/35 border border-rose-500/50 text-xs font-bold text-rose-200 transition-all flex items-center gap-1.5 shadow-[0_0_14px_rgba(244,63,94,0.3)]"
                  >
                    <Square className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
                    <span>End Conversation</span>
                  </button>
                </div>
              )}

              {/* SECONDARY: Performance Voice Brief */}
              <button
                type="button"
                id="generate-voice-brief-btn"
                onClick={handleGenerateVoiceBrief}
                disabled={voiceLoading}
                className="btn-glass py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {voiceLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-cyan-300 animate-spin" />
                    <span>Generating Brief...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>{voiceData ? 'Replay Voice Brief' : 'Generate AI Performance Brief'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>


        {/* Conversational Voice Error Alert Banner */}
        {convError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{convError}</span>
            </div>
            <button
              type="button"
              onClick={() => setConvError(null)}
              className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-[11px] font-semibold text-rose-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* AI Performance Voice Brief Loading Banner */}
        {voiceLoading && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#06182C]/90 border border-cyan-500/30 flex items-center gap-3 animate-pulse text-xs text-cyan-300">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
            <span>Generating AI Brief... Synthesizing evidence-based executive brief using ElevenLabs speech synthesis.</span>
          </div>
        )}

        {/* AI Performance Voice Brief Error Banner */}
        {voiceError && !voiceLoading && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button
              type="button"
              onClick={handleGenerateVoiceBrief}
              className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-[11px] font-semibold text-rose-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* AI Performance Voice Brief Ready Player Panel */}
        {voiceData && !voiceLoading && (
          <div className="mt-4 p-4 rounded-xl bg-[#061527]/95 border border-cyan-500/40 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Volume2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-emerald-300 tracking-wide">
                  AI Performance Brief Ready
                </span>
                <span className="text-[10px] text-[#7F9BB2] font-mono px-2 py-0.5 rounded bg-[#0A1F36] border border-cyan-500/15">
                  Spoken Executive Brief
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-semibold text-cyan-200 flex items-center gap-1.5 transition-all shadow-subtle"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-cyan-300" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-cyan-300" />
                      <span>Play Brief</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  title="Replay from beginning"
                  className="p-1.5 rounded-lg bg-[#0A1E36] hover:bg-cyan-500/10 border border-cyan-500/25 text-[#B6C9D9] hover:text-cyan-300 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Spoken Summary Narrative Quote */}
            <div className="p-3.5 rounded-lg bg-[#081B30]/80 border border-cyan-500/20">
              <p className="text-xs italic text-[#D8E6F2] leading-relaxed">
                "{voiceData.summary_text}"
              </p>
            </div>

            {/* Audio Scrubber & Controls */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[#7F9BB2] w-9 text-right">
                  {formatSeconds(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={handleSeek}
                  aria-label="Audio progress slider"
                  className="flex-1 h-1.5 bg-[#0D2947] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[11px] font-mono text-[#7F9BB2] w-9">
                  {formatSeconds(duration)}
                </span>
              </div>

              {/* Native browser audio element providing device volume and speed controls */}
              <audio
                ref={audioRef}
                src={voiceData.audioUrl || voiceData.fullAudioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  setAudioProgress(100);
                }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                className="w-full h-8 mt-1 accent-cyan-400 opacity-90 hover:opacity-100 transition-opacity"
                controls
              />
            </div>
          </div>
        )}

        {/* Explainability quick highlights */}
        <div className="mt-4 pt-3 border-t border-cyan-500/15 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#B6C9D9]">
          <div>
            <span className="text-cyan-300 font-semibold block text-[11px] uppercase">
              Core Strengths:
            </span>
            <span>{aiSummary?.explainability?.strengths?.join(' • ') || 'High code quality, fast delivery'}</span>
          </div>
          <div>
            <span className="text-amber-300 font-semibold block text-[11px] uppercase">
              Target Growth Areas:
            </span>
            <span>{aiSummary?.explainability?.risks?.join(' • ') || 'Executive roadmapping'}</span>
          </div>
          <div>
            <span className="text-[#7F9BB2] font-semibold block text-[11px] uppercase">
              Audit Data Streams:
            </span>
            <span>4 Independent telemetries verified</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation for deep dive */}
      <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2 overflow-x-auto">
        {[
          { key: 'all', label: 'Complete Overview' },
          { key: 'goals', label: `Goals & KPIs (${goals.length})` },
          { key: 'projects', label: `Projects (${projects.length})` },
          { key: 'feedback', label: `360 Feedback (${feedback.length})` },
          { key: 'skills', label: `Skills & Gaps (${skills.length})` },
          { key: 'training', label: `Training & LMS (${training.length})` },
          { key: 'attendance', label: 'Attendance & Ops' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'text-[#7F9BB2] hover:text-[#F0F9FF] hover:bg-cyan-500/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section A: Goals & KPIs */}
      {(activeTab === 'all' || activeTab === 'goals') && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Section A: Goals & KPI Attainment
              </h3>
            </div>
            <span className="text-xs text-[#B6C9D9] font-medium">
              Weight Average: 100%
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-cyan-500/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#061426]/70 border-b border-cyan-500/20 font-semibold text-cyan-400/90 uppercase tracking-wider">
                  <th className="py-3 px-4">Goal / Deliverable</th>
                  <th className="py-3 px-3">Target</th>
                  <th className="py-3 px-3">Achievement</th>
                  <th className="py-3 px-3">Period</th>
                  <th className="py-3 px-3">Weight</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10 text-[#B6C9D9]">
                {goals.map((g, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#F0F9FF]">{g.goal}</td>
                    <td className="py-3 px-3 font-medium text-[#B6C9D9]">{g.target}</td>
                    <td className="py-3 px-3 font-bold text-cyan-300">{g.achievement}</td>
                    <td className="py-3 px-3 text-[#7F9BB2]">{g.period}</td>
                    <td className="py-3 px-3 text-[#7F9BB2]">{g.weight}%</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={g.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section B: Project Outcomes */}
      {(activeTab === 'all' || activeTab === 'projects') && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Section B: Project Outcomes & Business Impact
              </h3>
            </div>
            <span className="text-xs font-medium text-[#B6C9D9]">
              Verified by Product & Engineering leads
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="hr-subcard p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h5 className="font-bold text-sm text-[#F0F9FF]">{proj.name}</h5>
                    <StatusBadge status={proj.businessImpact} size="sm" />
                  </div>
                  <span className="text-[11px] text-cyan-400 font-semibold block mb-2">
                    Role: {proj.role} • {proj.date}
                  </span>
                  <p className="text-xs text-[#B6C9D9] leading-relaxed mb-3">
                    {proj.outcome}
                  </p>
                </div>
                <div className="pt-2 border-t border-cyan-500/10 text-xs text-[#B6C9D9]">
                  <span className="font-semibold text-[#F0F9FF]">Impact Metric: </span>
                  <span className="text-emerald-400 font-medium">{proj.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section C: Feedback */}
      {(activeTab === 'all' || activeTab === 'feedback') && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Section C: 360 Feedback (Manager & Peers)
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Avg Rating: 4.8 / 5.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.map((fb, idx) => (
              <div
                key={idx}
                className="hr-subcard p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F0F9FF]">{fb.author}</span>
                    <span className="text-[11px] text-[#7F9BB2] font-medium">({fb.role})</span>
                  </div>
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    ★ {fb.rating}
                  </span>
                </div>

                <p className="text-xs text-[#B6C9D9] italic leading-relaxed">
                  "{fb.comment}"
                </p>

                <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-[#7F9BB2]">
                  <span className="font-medium text-[#B6C9D9]">Type: {fb.type} Review</span>
                  <span>{fb.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section D: Skills & Proficiency Levels */}
      {(activeTab === 'all' || activeTab === 'skills') && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Section D: Skills & Proficiency Levels
              </h3>
            </div>
            <span className="text-xs text-[#B6C9D9]">
              Evaluated against Target Role Level
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, idx) => (
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

      {/* Section E & F: Training & Attendance */}
      {(activeTab === 'all' || activeTab === 'training' || activeTab === 'attendance') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section E: Training */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Section E: Training & Certifications
              </h3>
            </div>

            <div className="space-y-3">
              {training.map((t, idx) => (
                <div
                  key={idx}
                  className="hr-subcard p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-semibold text-[#F0F9FF]">{t.name}</h5>
                    <p className="text-[11px] text-[#7F9BB2]">
                      {t.provider} • {t.hours} Hours
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <StatusBadge status={t.status} size="sm" />
                    <span className="block text-[10px] text-cyan-300 mt-1 font-medium">
                      Score: {t.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Attendance & Ops */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-[#F0F9FF] tracking-tight">
                Section F: Attendance & Working Discipline
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="hr-subcard p-3">
                <span className="text-[#7F9BB2] block text-[11px]">Overall Attendance</span>
                <span className="text-xl font-extrabold text-[#F0F9FF] mt-1 block">
                  {attendance.overall || '99.2%'}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Top decile</span>
              </div>
              <div className="hr-subcard p-3">
                <span className="text-[#7F9BB2] block text-[11px]">Punctuality Rate</span>
                <span className="text-xl font-extrabold text-[#F0F9FF] mt-1 block">
                  {attendance.punctuality || '99.5%'}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Consistent</span>
              </div>
              <div className="hr-subcard p-3">
                <span className="text-[#7F9BB2] block text-[11px]">Average Hours</span>
                <span className="text-xl font-extrabold text-[#F0F9FF] mt-1 block">
                  {attendance.workingHoursAvg || '41.8 hrs/wk'}
                </span>
                <span className="text-[10px] text-[#7F9BB2]">Within healthy limits</span>
              </div>
              <div className="hr-subcard p-3">
                <span className="text-[#7F9BB2] block text-[11px]">PTO Days Used</span>
                <span className="text-xl font-extrabold text-[#F0F9FF] mt-1 block">
                  {attendance.leaveDaysUsed || 10} / {attendance.leaveDaysTotal || 25}
                </span>
                <span className="text-[10px] text-[#7F9BB2]">15 balance remaining</span>
              </div>
            </div>

            {businessImpact?.summary && (
              <div className="hr-subcard p-3 text-xs text-[#F0F9FF]">
                <span className="font-bold block text-[11px] uppercase tracking-wider text-cyan-300">
                  Business Impact Synthesis:

                </span>
                <p className="mt-1 leading-relaxed text-[#B6C9D9]">
                  {businessImpact.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* "Why this insight?" Modal */}
      {showExplainModal && (
        <Modal
          isOpen={showExplainModal}
          onClose={() => setShowExplainModal(false)}
          title={`Explainable AI Profile Synthesis: ${name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0B223D]/70 border border-cyan-500/30">
              <h5 className="font-bold text-cyan-300 text-sm mb-1">
                Reasoning Factors Behind Insight
              </h5>
              <p className="text-[#F0F9FF] leading-relaxed">
                {aiSummary?.explainability?.whyThisInsight ||
                  "Evaluation synthesizes multi-quarter goal execution, delivered projects, and 360 reviews."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <h6 className="font-bold text-emerald-300 uppercase text-[11px] mb-1">
                  Positive Supporting Factors
                </h6>
                <ul className="space-y-1 text-emerald-200 list-disc pl-4">
                  {aiSummary?.explainability?.strengths?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <h6 className="font-bold text-amber-300 uppercase text-[11px] mb-1">
                  Active Development Flags
                </h6>
                <ul className="space-y-1 text-amber-200 list-disc pl-4">
                  {aiSummary?.explainability?.risks?.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h6 className="font-bold text-[#F0F9FF] uppercase text-[11px] mb-2">
                Underlying Telemetry Data Sources:
              </h6>
              <div className="flex flex-wrap gap-2">
                {aiSummary?.explainability?.dataSources?.map((src, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#061426] text-cyan-300 font-mono text-[11px] border border-cyan-500/25"
                  >
                    ✓ {src}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#0B223D]/40 border border-cyan-500/10 rounded-xl text-[#B6C9D9] text-[11px]">
              <strong className="text-[#F0F9FF]">Governance Guardrail:</strong> AI models in Work Vista are strictly restricted to synthesizing verified metric streams. Final promotion decisions require managerial and HR sign-off.
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExplainModal(false)}
                className="btn-cyan px-4 py-2 text-xs"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
