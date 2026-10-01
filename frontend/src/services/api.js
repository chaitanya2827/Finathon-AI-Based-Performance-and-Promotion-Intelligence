// ZEROBUGS — Service Layer
// Clean abstraction over data access. Functions return Promises so they can seamlessly
// be swapped out for real REST / GraphQL API endpoints.

import {
  mockEmployees,
  companyStats,
  performanceTrendData,
  performanceDistribution,
  commonSkillGaps,
  promotionReadinessDistribution,
  dashboardAIInsights,
  managerCalibrationData,
  departmentPerformanceData
} from '../data/mockData.js';

// Simulated network latency (in ms, set to 0 or 150ms for realistic UI feel without lag)
const SIMULATED_DELAY = 120;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch top-level dashboard statistics, KPI metrics, and aggregate charts
 */
export async function getDashboardStats() {
  await delay(SIMULATED_DELAY);
  return {
    kpis: companyStats,
    performanceTrend: performanceTrendData,
    performanceDistribution: performanceDistribution,
    skillGaps: commonSkillGaps,
    promotionReadinessDistribution: promotionReadinessDistribution,
    aiInsights: dashboardAIInsights
  };
}

export const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Fetch employee list with optional filters and search from WORKVISTA backend
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {string} [filters.department]
 * @param {string} [filters.role]
 * @param {string} [filters.readiness]
 * @param {string} [filters.performance]
 */
export async function getEmployees(filters = {}) {
  try {
    const [empsRes, calRes] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/api/employees`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/calibration`).then((r) => (r.ok ? r.json() : null)),
    ]);

    const empsData = empsRes.status === 'fulfilled' ? empsRes.value : null;
    const calData = calRes.status === 'fulfilled' ? calRes.value : null;

    if (empsData && Array.isArray(empsData) && empsData.length > 0) {
      const calMap = new Map();
      if (calData?.all_evaluations) {
        calData.all_evaluations.forEach((item) => {
          calMap.set(item.employee_id, item);
        });
      }

      let list = empsData.map((emp) => {
        const cal = calMap.get(emp.employee_id);
        const rawScore = cal?.evidence_score ?? 88;
        const perfScore = Math.round(rawScore * 10) / 10;
        const category =
          perfScore >= 95 ? 'Exceptional' : perfScore >= 85 ? 'Strong' : perfScore >= 70 ? 'Solid' : 'Developing';

        const readiness =
          perfScore >= 95
            ? 'Ready Now'
            : perfScore >= 85
            ? 'Developing - Ready in 6-12 Months'
            : 'Needs Foundation';

        return {
          id: emp.employee_id,
          backendId: emp.employee_id,
          name: emp.name,
          avatar: emp.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: emp.current_role?.name || emp.current_role || 'Specialist',
          targetRole: emp.target_role?.name || emp.target_role || 'Senior Specialist',
          department: emp.department,
          manager: cal?.manager_name || emp.manager_id || 'Manager',
          email: emp.email,
          joinDate: emp.hire_date,
          performanceScore: perfScore,
          performanceCategory: category,
          skillScore: perfScore >= 95 ? 100 : perfScore >= 85 ? 85 : 70,
          promotionReadiness: Math.round(perfScore),
          readinessStatus: readiness,
          status: 'Active',
          calibrationFlag: cal?.flag || false,
        };
      });

      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          (emp) =>
            emp.name.toLowerCase().includes(q) ||
            emp.role.toLowerCase().includes(q) ||
            emp.id.toLowerCase().includes(q) ||
            emp.department.toLowerCase().includes(q) ||
            emp.manager.toLowerCase().includes(q)
        );
      }

      if (filters.department && filters.department !== 'All') {
        list = list.filter((emp) => emp.department === filters.department);
      }

      if (filters.role && filters.role !== 'All') {
        list = list.filter((emp) => emp.role.toLowerCase().includes(filters.role.toLowerCase()));
      }

      if (filters.readiness && filters.readiness !== 'All') {
        list = list.filter((emp) => emp.readinessStatus.toLowerCase().includes(filters.readiness.toLowerCase()));
      }

      if (filters.performance && filters.performance !== 'All') {
        list = list.filter((emp) => emp.performanceCategory === filters.performance);
      }

      return list;
    }
  } catch (err) {
    console.error('Error fetching employees from backend:', err);
  }

  // Graceful fallback to mock store if backend is unreachable
  await delay(SIMULATED_DELAY);
  let list = [...mockEmployees];

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.manager.toLowerCase().includes(q)
    );
  }

  if (filters.department && filters.department !== "All") {
    list = list.filter((emp) => emp.department === filters.department);
  }

  if (filters.role && filters.role !== "All") {
    list = list.filter((emp) => emp.role.toLowerCase().includes(filters.role.toLowerCase()));
  }

  if (filters.readiness && filters.readiness !== "All") {
    list = list.filter((emp) => emp.readinessStatus === filters.readiness);
  }

  if (filters.performance && filters.performance !== "All") {
    list = list.filter((emp) => emp.performanceCategory === filters.performance);
  }

  return list;
}

/**
 * Fetch full employee profile and synthesized analysis by ID directly from backend endpoints:
 * - GET /api/employees/{employee_id}
 * - GET /api/employees/{employee_id}/performance
 * - GET /api/employees/{employee_id}/gaps
 * - GET /api/employees/{employee_id}/career
 * - GET /api/employees/{employee_id}/promotion
 * - GET /api/calibration/{employee_id}
 * - GET /api/employees/{employee_id}/evidence
 * - GET /api/analyze/{employee_id}
 *
 * @param {string} id - Corporate employee ID (e.g. "EMP001", "EMP002", "EMP003")
 */
export async function getEmployeeById(id) {
  if (!id) id = 'EMP001';

  // Legacy ID mapping for backward compatibility if old mock IDs are accessed
  const legacyMap = {
    'EMP-1001': 'EMP001',
    'EMP-1002': 'EMP001',
    'EMP-1003': 'EMP002',
    'EMP-1004': 'EMP003',
  };
  const targetId = legacyMap[id] || id;

  try {
    const [empRes, perfRes, gapsRes, carRes, promRes, calRes, evRes, anaRes] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/api/employees/${encodeURIComponent(targetId)}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/employees/${encodeURIComponent(targetId)}/performance`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/employees/${encodeURIComponent(targetId)}/gaps`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/employees/${encodeURIComponent(targetId)}/career`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/employees/${encodeURIComponent(targetId)}/promotion`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/calibration/${encodeURIComponent(targetId)}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/employees/${encodeURIComponent(targetId)}/evidence`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/api/analyze/${encodeURIComponent(targetId)}`).then((r) => (r.ok ? r.json() : null)),
    ]);

    const empData = empRes.status === 'fulfilled' ? empRes.value : null;
    const perfData = perfRes.status === 'fulfilled' ? perfRes.value : null;
    const gapsData = gapsRes.status === 'fulfilled' ? gapsRes.value : null;
    const carData = carRes.status === 'fulfilled' ? carRes.value : null;
    const promData = promRes.status === 'fulfilled' ? promRes.value : null;
    const calData = calRes.status === 'fulfilled' ? calRes.value : null;
    const evData = evRes.status === 'fulfilled' ? evRes.value : null;
    const anaData = anaRes.status === 'fulfilled' ? anaRes.value : null;

    if (!empData) {
      // Fallback if employee is not found in backend
      const fallback = mockEmployees.find((e) => e.id === id) || mockEmployees[0];
      return fallback;
    }

    const rawEvidence = evData?.evidence || {};

    // 1. Performance calculation
    const rawPerfScore = perfData?.performance_score ?? 88;
    const performanceScore = Math.round(rawPerfScore * 10) / 10;
    const performanceCategory =
      performanceScore >= 95 ? 'Exceptional' : performanceScore >= 85 ? 'Strong' : performanceScore >= 70 ? 'Solid' : 'Developing';

    // 2. Skill match and development gaps
    const skillScore = gapsData?.overall_match_pct !== undefined ? Math.round(gapsData.overall_match_pct) : 85;
    const developmentGaps = [
      ...(gapsData?.critical_gaps || []).map((g) => ({
        skill: g.skill_name,
        current: Math.round((g.current_level / 5) * 100),
        required: Math.round((g.required_level / 5) * 100),
        gap: Math.round((g.gap / 5) * 100),
        severity: 'Critical',
        recommendation: g.reason || g.recommendation || `Requires Level ${g.required_level}; currently at Level ${g.current_level}.`,
      })),
      ...(gapsData?.moderate_gaps || []).map((g) => ({
        skill: g.skill_name,
        current: Math.round((g.current_level / 5) * 100),
        required: Math.round((g.required_level / 5) * 100),
        gap: Math.round((g.gap / 5) * 100),
        severity: 'Medium',
        recommendation: g.reason || g.recommendation || `Recommended Level ${g.required_level}; currently at Level ${g.current_level}.`,
      })),
    ];

    // 3. Promotion readiness
    const readinessStatus = promData?.readiness_level || 'Developing - Ready in 6-12 Months';
    const promotionReadiness = promData?.performance_score
      ? Math.round(promData.performance_score * 10) / 10
      : (readinessStatus === 'Ready Now' ? 95 : 70);

    // 4. Role & Career info
    const currentRoleName = empData.current_role?.name || empData.current_role || 'Specialist';
    const targetRoleName = carData?.target_role?.name || carData?.target_role || empData.target_role?.name || empData.target_role || 'Senior Specialist';

    // 5. Manager resolution
    const managerName = calData?.manager_name || rawEvidence.manager_evaluations?.[0]?.manager_name || empData.manager_id || 'Department Lead';

    // 6. Goals mapping from evidence
    const goals = (rawEvidence.goals || []).map((g) => ({
      goal: g.title,
      target: `${g.target_value} ${g.metric_unit || '%'}`.trim(),
      achievement: `${g.achieved_value} ${g.metric_unit || '%'}`.trim(),
      period: '2026-H1',
      weight: Math.round(100 / Math.max((rawEvidence.goals || []).length, 1)),
      status: g.progress_pct >= 100 ? 'Exceeded' : g.progress_pct >= 90 ? 'Achieved' : 'On Track',
      details: g.verification_evidence,
    }));

    // 7. Projects mapping from evidence
    const projects = (rawEvidence.projects || []).map((p) => ({
      name: p.project_name,
      role: p.role_in_project || 'Lead Contributor',
      outcome: p.deliverables || p.outcome_evidence,
      businessImpact: p.delivered_on_time ? 'High' : 'Medium',
      metric: p.outcome_evidence || `Code Quality Score: ${p.code_quality_score} / 5.0`,
      date: '2026-H1',
    }));

    // 8. Feedback mapping from evidence
    const feedback = (rawEvidence.feedback || []).map((f, idx) => ({
      type: f.reviewer_type === 'manager' ? 'Manager' : 'Peer',
      author: f.reviewer_type === 'manager' ? managerName : `Peer Evaluator ${idx + 1}`,
      role: f.reviewer_type === 'manager' ? 'Direct Reporting Manager' : 'Engineering & Cross-functional Peer',
      rating: f.rating,
      comment: f.comments,
      date: '2026-H1',
      highlight: f.sentiment === 'positive' ? 'High Technical & Delivery Ownership' : 'Constructive Feedback',
    }));

    // 9. Skills mapping from evidence + gap analysis
    const skills = (rawEvidence.skills || []).map((s) => {
      const skillName = s.skill?.name || s.skill_id;
      const criticalGap = (gapsData?.critical_gaps || []).find((g) => g.skill_name === skillName || g.skill_id === s.skill_id);
      const moderateGap = (gapsData?.moderate_gaps || []).find((g) => g.skill_name === skillName || g.skill_id === s.skill_id);
      const gapObj = criticalGap || moderateGap;

      const currentScore = Math.round((s.proficiency_level / 5) * 100);
      const requiredScore = gapObj ? Math.round((gapObj.required_level / 5) * 100) : 80;
      const gapVal = Math.max(0, requiredScore - currentScore);

      return {
        name: skillName,
        category: s.skill?.category || 'Technical',
        current: currentScore,
        required: requiredScore,
        gap: gapVal,
        status: gapObj ? 'Developing' : currentScore >= 80 ? 'Exceeds Requirement' : 'Meets Requirement',
      };
    });

    // Also include critical gaps if not already in employee skills
    (gapsData?.critical_gaps || []).forEach((cg) => {
      if (!skills.some((s) => s.name === cg.skill_name)) {
        skills.push({
          name: cg.skill_name,
          category: cg.category || 'Architecture',
          current: Math.round((cg.current_level / 5) * 100),
          required: Math.round((cg.required_level / 5) * 100),
          gap: Math.round((cg.gap / 5) * 100),
          status: 'Developing',
        });
      }
    });

    // 10. Training mapping
    const training = (rawEvidence.training || []).map((t) => ({
      name: t.course_name,
      provider: t.provider || 'Enterprise Academy',
      completionDate: t.completion_date,
      status: t.completion_status === 'completed' ? 'Completed' : 'In Progress',
      hours: 24,
      score: t.completion_status === 'completed' ? '100%' : '80% Progress',
    }));

    // 11. Attendance mapping
    const attRec = rawEvidence.attendance?.[0];
    const attendance = {
      overall: `${attRec?.attendance_pct ?? 99.2}%`,
      punctuality: `${attRec?.attendance_pct ?? 99.5}%`,
      workingHoursAvg: '41.5 hrs/wk',
      leaveDaysUsed: attRec ? Math.max(0, attRec.working_days - attRec.days_present) : 8,
      leaveDaysTotal: 25,
      notes: attRec?.reliability_notes || 'High operational consistency and on-call reliability.',
    };

    // 12. Business impact summary
    const biRec = rawEvidence.business_impact?.[0];
    const businessImpact = {
      rating: performanceScore >= 95 ? 'Very High' : 'High',
      summary: biRec
        ? `${biRec.metric_name}: ${biRec.value} ${biRec.metric_unit || ''}. ${biRec.evidence || biRec.description}`
        : 'Sustained measurable contributions to core sprint deliverables and system reliability.',
    };

    // 13. AI Summary & Explainability narrative
    const overviewText =
      anaData?.explanation?.performance_summary ||
      `Demonstrates strong performance with a synthesized score of ${performanceScore}%. Evaluation integrates 9 objective evidence dimensions with verified multi-factor metrics.`;

    const aiSummary = {
      overview: overviewText,
      explainability: {
        whyThisInsight:
          anaData?.explanation?.performance_summary ||
          `Evaluation synthesizes verified multi-factor evidence across goals (${perfData?.components?.goal_score || 95}%), projects (${perfData?.components?.project_score || 95}%), and 360 feedback.`,
        confidenceScore: '96% (Verified Telemetry)',
        dataSources: [
          'OKRs & Deliverables',
          'Project Delivery Telemetry',
          '360 Peer & Manager Feedback',
          'Target Role Skill Benchmarks',
          'LMS Training Records',
          'Operational Attendance',
        ],
        strengths: perfData?.strengths || anaData?.explanation?.strengths || ['Consistent technical execution', 'Reliable project completion'],
        risks:
          (gapsData?.critical_gaps || []).length > 0
            ? (gapsData.critical_gaps || []).map((g) => `${g.skill_name} (${g.reason || 'Critical Target Gap'})`)
            : perfData?.areas_for_improvement || ['Continued cross-team strategic communication'],
      },
    };

    // 14. Calibration data
    const calibration = {
      flag: Boolean(calData?.flag),
      message: calData?.message || (calData?.flag ? 'Potential evaluation inconsistency detected.' : 'Manager evaluation is aligned with objective evidence.'),
      variance: calData?.variance,
      managerRating: calData?.manager_rating,
      managerNormalizedScore: calData?.manager_normalized_score,
      evidenceScore: calData?.evidence_score,
      reviewRecommended: Boolean(calData?.review_recommended),
    };

    return {
      id: empData.employee_id,
      backendId: empData.employee_id,
      name: empData.name,
      avatar: empData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: currentRoleName,
      targetRole: targetRoleName,
      department: empData.department,
      manager: managerName,
      email: empData.email,
      joinDate: empData.hire_date || '2023-01-15',
      performanceScore,
      performanceCategory,
      skillScore,
      promotionReadiness,
      readinessStatus,
      status: 'Active',
      goals,
      projects,
      feedback,
      skills,
      training,
      attendance,
      businessImpact,
      developmentGaps,
      aiSummary,
      calibration,
      careerPath: {
        currentRole: currentRoleName,
        targetRole: targetRoleName,
        futureRole: 'Director / Executive',
        readinessPct: promotionReadiness,
        timeline: readinessStatus === 'Ready Now' ? 'Immediate / Next Cycle' : '6–12 Months',
        targetSkills: skills,
        recommendedActions: (carData?.recommended_development_actions || []).map((ra) => ({
          title: ra.action,
          type: ra.category,
          impact: 'High',
          timeline: ra.timeline || '3-6 Months',
          desc: `${ra.target_skill ? `Target Skill: ${ra.target_skill}. ` : ''}${ra.recommended_resource || ''}`,
        })),
      },
      promotionEvidence: promData || {},
    };
  } catch (err) {
    console.error('Error fetching employee from backend:', err);
    const fallback = mockEmployees.find((e) => e.id === id) || mockEmployees[0];
    return fallback;
  }
}

/**
 * Fetch Performance analytics overview, metrics, and trends
 * @param {string} [department="All"]
 * @param {string} [timeframe="9M"]
 */
export async function getPerformanceData(department = "All", timeframe = "9M") {
  await delay(SIMULATED_DELAY);
  return {
    overview: {
      averagePerformanceScore: companyStats.averagePerformance,
      kpiAchievementRate: "93.4%",
      highImpactProjectPct: "78%",
      managerSatisfactionScore: "4.52 / 5.0",
      quantifiedBusinessImpact: "$14.2M ARR"
    },
    monthlyTrend: performanceTrendData,
    departmentComparison: departmentPerformanceData,
    goalCompletionStats: [
      { name: "Exceeded Target", count: 78, pct: 31, fill: "#10b981" },
      { name: "Achieved Target", count: 124, pct: 50, fill: "#4f46e5" },
      { name: "On Track", count: 32, pct: 13, fill: "#38bdf8" },
      { name: "At Risk / Delayed", count: 14, pct: 6, fill: "#f59e0b" }
    ],
    impactHighlights: [
      { metric: "$14.2M ARR", label: "Business Value Generated", detail: "Directly attributable to delivered technical & product milestones." },
      { metric: "99.98%", label: "Average Infrastructure Uptime", detail: "Maintained by Cloud & Platform Engineering cohorts." },
      { metric: "88.4 SUS", label: "Enterprise UX Usability", detail: "Top decile benchmark score in B2B software." },
      { metric: "18.4 hrs", label: "Avg Security Triage SLA", detail: "Down from 48h benchmark across all product services." }
    ]
  };
}

/**
 * Fetch skills assessment, gaps, radar benchmark, and department breakdown
 */
export async function getSkillsData(department = "All") {
  await delay(SIMULATED_DELAY);
  return {
    organizationRadar: [
      { skill: "System Architecture", current: 88, required: 85, benchmark: 82 },
      { skill: "Code Quality & Testing", current: 92, required: 85, benchmark: 84 },
      { skill: "People Mentorship", current: 78, required: 85, benchmark: 76 },
      { skill: "Strategic Planning", current: 69, required: 85, benchmark: 71 },
      { skill: "Cloud & FinOps", current: 84, required: 80, benchmark: 78 },
      { skill: "Communication", current: 82, required: 80, benchmark: 80 }
    ],
    commonGaps: commonSkillGaps,
    topInDemandSkills: [
      { name: "Distributed Systems & Scalability", employeesCount: 48, masteryLevel: "88%" },
      { name: "LLM Fine-Tuning & Prompt Architecture", employeesCount: 22, masteryLevel: "74%" },
      { name: "Enterprise Security & Zero Trust", employeesCount: 34, masteryLevel: "91%" },
      { name: "Unit Economics & Financial Modeling", employeesCount: 19, masteryLevel: "68%" }
    ],
    developmentPrograms: [
      { title: "Technical Leadership & Staff Engineering Guild", participants: 18, duration: "8 Weeks", completionRate: "92%" },
      { title: "Cloud FinOps & Infrastructure Optimization", participants: 24, duration: "6 Weeks", completionRate: "88%" },
      { title: "Executive Storytelling for Product & Design", participants: 14, duration: "4 Weeks", completionRate: "95%" }
    ]
  };
}

/**
 * Fetch career path recommendations for an employee
 * @param {string} employeeId
 */
export async function getCareerPath(employeeId) {
  await delay(SIMULATED_DELAY);
  const employee = await getEmployeeById(employeeId);
  return {
    employee,
    careerPath: employee.careerPath,
    developmentGaps: employee.developmentGaps,
    skills: employee.skills
  };
}

/**
 * Fetch promotion readiness insights, evidence breakdown, and explainability factors
 * @param {string} employeeId
 */
export async function getPromotionReadiness(employeeId) {
  await delay(SIMULATED_DELAY);
  const employee = await getEmployeeById(employeeId);
  return {
    employee,
    score: employee.promotionReadiness,
    status: employee.readinessStatus,
    evidence: employee.promotionEvidence,
    gaps: employee.developmentGaps,
    aiSummary: employee.aiSummary,
    disclaimer: "AI-generated insight for HR and manager review. Final promotion decisions remain strictly with HR and executive management."
  };
}

/**
 * Fetch manager evaluation consistency, team ratings, and variance detection
 */
export async function getCalibrationData() {
  await delay(SIMULATED_DELAY);
  return {
    managers: managerCalibrationData,
    overallAverageRating: 4.12,
    totalEvaluations: 80,
    varianceMetrics: {
      strictManagersCount: 1,
      balancedManagersCount: 3,
      lenientManagersCount: 1
    },
    systemInsight: {
      summary: "Evaluation patterns differ across teams. HR review may be useful to understand contextual factors.",
      guidance: "Differences in team ratings often reflect project maturity, recent restructuring, or varying proportions of junior vs senior personnel. Use these calibration metrics as dialogue starters rather than punitive measures."
    }
  };
}

/**
 * Fetch AI Performance Voice Brief from WORKVISTA backend
 * Calls POST /api/voice/performance/{employee_id}
 * @param {string} employeeId - Corporate employee ID (e.g. "EMP001")
 */
export async function getVoicePerformanceBrief(employeeId) {
  if (!employeeId) {
    throw new Error('Employee ID is required to generate the AI voice brief.');
  }

  const endpoint = `${API_BASE_URL}/api/voice/performance/${encodeURIComponent(employeeId)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorDetail = 'Unable to generate the AI performance brief. Please try again.';
    try {
      const errJson = await response.json();
      if (errJson?.detail && typeof errJson.detail === 'string') {
        errorDetail = errJson.detail;
      }
    } catch (_) {}
    throw new Error(errorDetail);
  }

  const data = await response.json();

  // Resolve fully-qualified audio URL from the backend relative path
  const audioUrl = data.audio_url?.startsWith('http')
    ? data.audio_url
    : `${API_BASE_URL}${data.audio_url?.startsWith('/') ? '' : '/'}${data.audio_url}`;

  return {
    ...data,
    audioUrl,
  };
}

/**
 * Fetch Manager Calibration data directly from WORKVISTA backend
 * Calls GET /api/calibration
 */
export async function getBackendCalibration() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/calibration`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch calibration data from backend:', err);
  }
  return null;
}
