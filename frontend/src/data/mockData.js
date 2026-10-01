// ZEROBUGS — Enterprise Mock Data Store
// Realistic synthetic data representing 16 detailed employee profiles across Engineering, Product, Design, Data & AI, and Operations

export const mockEmployees = [
  {
    id: "EMP-1001",
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Senior Frontend Engineer",
    department: "Engineering",
    manager: "Marcus Vance",
    email: "alex.chen@zerobugs.corp",
    joinDate: "Jan 15, 2022",
    location: "San Francisco, CA (Hybrid)",
    performanceScore: 92,
    skillScore: 89,
    promotionReadiness: 84,
    readinessStatus: "Ready",
    performanceCategory: "Exceptional",
    status: "Active",
    businessImpact: {
      rating: "Very High",
      summary: "Architected micro-frontend design system reducing page load by 44% and accelerating release cycles by 2.5x across 6 teams."
    },
    goals: [
      { goal: "Lead Core UI Component Library Migration to Tailwind & Radix", target: "100% Migration", achievement: "100%", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Reduce Core Web Vitals LCP < 1.2s across primary dashboard", target: "< 1.2s", achievement: "0.98s", status: "Exceeded", period: "Q3 2024", weight: 25 },
      { goal: "Mentor 3 Mid-Level Frontend Engineers on State Architecture", target: "3 Engineers", achievement: "3 Engineers", status: "Achieved", period: "Q3 2024", weight: 20 },
      { goal: "Publish 2 Internal Tech Talks on Enterprise React Performance", target: "2 Talks", achievement: "2 Talks", status: "Achieved", period: "Q3 2024", weight: 20 }
    ],
    projects: [
      { name: "Global Design System v3", role: "Technical Lead", outcome: "Delivered 2 weeks ahead of schedule with 99.8% test coverage", businessImpact: "High", metric: "Used by 42 engineers daily; cut UI regression tickets by 62%", date: "August 2024" },
      { name: "Customer Portal Latency Optimization", role: "Principal Contributor", outcome: "Optimized bundle footprint from 3.2MB to 680KB", businessImpact: "Very High", metric: "+14% checkout conversion rate; $340k ARR impact", date: "June 2024" },
      { name: "Accessibility (WCAG 2.1 AA) Audit & Remediation", role: "Project Owner", outcome: "Achieved full compliance across all 28 core enterprise views", businessImpact: "Medium", metric: "Passed SOC2 and federal compliance audit with zero findings", date: "April 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 4.8, comment: "Alex exhibits world-class frontend architectural chops. Ready for Staff level scope; next growth area is influencing organizational strategy across multiple org silos.", date: "Sep 2024", highlight: "World-class architectural execution & mentorship" },
      { type: "Peer", author: "Priya Patel", role: "Staff Backend Engineer", rating: 4.9, comment: "Working with Alex on the API contract redesign was effortless. He anticipates edge cases and ensures seamless cross-stack synchronization.", date: "Sep 2024", highlight: "Exceptional cross-functional collaborator" },
      { type: "Peer", author: "David Miller", role: "Lead Product Designer", rating: 4.7, comment: "Alex treats design specs with deep fidelity and frequently suggests usability improvements that enhance the user experience.", date: "Aug 2024", highlight: "User-centric engineering mindset" }
    ],
    skills: [
      { name: "React & Modern Web Architecture", category: "Technical", current: 95, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "TypeScript & Type Safety", category: "Technical", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Performance Optimization & Profiling", category: "Technical", current: 90, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "System Design & Distributed UI", category: "Technical", current: 86, required: 85, gap: 0, status: "Meets Requirement" },
      { name: "Engineering Mentorship", category: "Leadership", current: 82, required: 80, gap: 0, status: "Meets Requirement" },
      { name: "Strategic Technical Roadmapping", category: "Leadership", current: 68, required: 85, gap: 17, status: "Developing" },
      { name: "Cross-Functional Influence", category: "Leadership", current: 72, required: 85, gap: 13, status: "Developing" }
    ],
    training: [
      { name: "Distributed Systems & Scalable Frontends", provider: "O'Reilly Enterprise", completionDate: "Jul 2024", status: "Completed", hours: 32, score: "98%" },
      { name: "Engineering Leadership & Executive Presence", provider: "Reforge", completionDate: "Aug 2024", status: "Completed", hours: 24, score: "94%" },
      { name: "Strategic Business Case Building for Tech Leads", provider: "Harvard Online", completionDate: null, status: "In Progress", hours: 18, score: "72% progress" }
    ],
    attendance: {
      overall: "99.2%",
      punctuality: "99.5%",
      workingHoursAvg: "41.8 hrs/wk",
      leaveDaysUsed: 10,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Strategic Technical Roadmapping", current: 68, required: 85, gap: 17, severity: "Medium", recommendation: "Draft the 2025 Multi-Year Frontend Architecture RFC and present to the Engineering Leadership Council." },
      { skill: "Cross-Functional Influence", current: 72, required: 85, gap: 13, severity: "Low", recommendation: "Partner with Product & Business Operations on quarterly metric alignment and ROI tracking." }
    ],
    careerPath: {
      currentRole: "Senior Frontend Engineer",
      targetRole: "Staff Frontend Engineer",
      futureRole: "Principal Engineer / Engineering Director",
      readinessPct: 84,
      timeline: "3-6 Months",
      targetSkills: [
        { name: "Technical Architecture & Scale", current: 92, required: 90, gap: 0, status: "Ready" },
        { name: "Cross-Org Strategic Planning", current: 68, required: 85, gap: 17, status: "Developing" },
        { name: "Staff-Level Mentorship", current: 82, required: 80, gap: 0, status: "Ready" },
        { name: "Multi-Team Governance", current: 70, required: 85, gap: 15, status: "Developing" },
        { name: "Executive Technical Communication", current: 74, required: 80, gap: 6, status: "Nearly Ready" }
      ],
      recommendedActions: [
        { title: "Lead Multi-Team Architecture RFC", type: "Technical Leadership", impact: "High", timeline: "Q4 2024", desc: "Draft and champion the 2025 Front-End Modernization initiative across 4 sibling squads." },
        { title: "Complete Executive Business Case Workshop", type: "Training", impact: "Medium", timeline: "Nov 2024", desc: "Finalize Harvard Business School online certification on tech ROI modeling." },
        { title: "Sponsor Senior-to-Staff Transition Mentee", type: "Mentorship", impact: "High", timeline: "Ongoing", desc: "Formally mentor 2 prospective senior engineers through technical review committees." }
      ]
    },
    aiSummary: {
      overview: "Strong overall performance driven by consistent KPI achievement (100%), exceptional project delivery, and high peer respect. Technical execution is in the top 5th percentile of the engineering org. Cross-org strategic roadmapping remains the primary growth area for Staff-level promotion.",
      explainability: {
        whyThisInsight: "Evaluation synthesizes 4 quarterly goals exceeded, 3 major P0 deliverables, 4.8/5.0 manager calibration, and 98% training completion. The 17% delta in cross-org strategic roadmapping prevents an automatic immediate Staff promotion.",
        confidenceScore: "94% (High Data Completeness)",
        dataSources: ["GitHub Commit & RFC Velocity", "Jira Sprint Outcomes", "360 Peer Reviews (3 Evaluators)", "L&D LMS Progress"],
        strengths: ["Exceptional code quality & system resilience", "Proactive developer tooling and mentorship", "Consistent 100%+ OKR accomplishment"],
        risks: ["Cross-department stakeholder alignment still developing", "Needs broader scope beyond direct squad boundaries"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 96, status: "High", details: "Achieved 100% of core deliverables with 2 stretch OKRs marked as Exceeded." },
      projectImpact: { score: 92, status: "Very High", details: "Saved $340k ARR via latency reduction; shipped Global Design System v3 used across 6 business units." },
      requiredSkills: { score: "8 / 10", status: "Strong", details: "Exceeds or meets 8 of 10 competency thresholds for Staff Engineer level." },
      managerFeedback: { score: 94, status: "Strong", details: "Manager calibration 4.8/5.0; endorsed for promotion review committee in next cycle." },
      trainingCompletion: { score: 92, status: "Strong", details: "Completed 56 hours of advanced distributed systems and tech leadership training." },
      businessImpact: { score: 90, status: "High", details: "Directly attributable to 62% reduction in UI production defect escalations." }
    }
  },
  {
    id: "EMP-1002",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Product Manager II",
    department: "Product",
    manager: "Sarah Jenkins",
    email: "elena.rostova@zerobugs.corp",
    joinDate: "Nov 10, 2021",
    location: "New York, NY (Hybrid)",
    performanceScore: 88,
    skillScore: 85,
    promotionReadiness: 78,
    readinessStatus: "Nearly Ready",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Spearheaded Customer Retention Analytics workflow, expanding expansion ARR by $520k and reducing quarterly churn by 2.8%."
    },
    goals: [
      { goal: "Launch Self-Service Enterprise Onboarding Flow", target: "GA Launch in Q3", achievement: "Launched 1 week early", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Reduce Onboarding Drop-off Rate from 28% to <15%", target: "< 15%", achievement: "13.8%", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Conduct 40 Customer Qualitative Discovery Interviews", target: "40 Sessions", achievement: "42 Sessions", status: "Achieved", period: "Q3 2024", weight: 20 },
      { goal: "Establish Standardized Product Spec KPI Tracking Template", target: "100% Adoption", achievement: "85% Adoption", status: "On Track", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Automated Onboarding Journey", role: "Product Lead", outcome: "Boosted product qualified lead conversion by 34%", businessImpact: "High", metric: "Shortened time-to-value from 14 days to 3.8 days", date: "July 2024" },
      { name: "Enterprise RBAC & Security Admin Suite", role: "Product Owner", outcome: "Unlocked 5 Tier-1 Enterprise Fortune 500 contracts", businessImpact: "Very High", metric: "$1.2M pipeline unblocked in Q2", date: "May 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Sarah Jenkins", role: "VP of Product", rating: 4.6, comment: "Elena is a relentless executor who deeply understands user friction. To reach Senior PM, she needs to elevate her long-term financial modeling and roadmap defense in executive sessions.", date: "Sep 2024", highlight: "Sharp execution and strong customer empathy" },
      { type: "Peer", author: "Marcus Vance", role: "Engineering Director", rating: 4.7, comment: "Elena writes exceptionally crisp specs and respects technical debt tradeoffs. A pleasure to partner with.", date: "Aug 2024", highlight: "Engineering-friendly collaboration" }
    ],
    skills: [
      { name: "User Research & Customer Empathy", category: "Domain", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Product Analytics & SQL", category: "Technical", current: 88, required: 80, gap: 0, status: "Exceeds Requirement" },
      { name: "Agile Sprint Ownership", category: "Domain", current: 90, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Financial & Unit Economic Modeling", category: "Leadership", current: 65, required: 85, gap: 20, status: "Developing" },
      { name: "Competitive Strategy & Pricing", category: "Leadership", current: 68, required: 80, gap: 12, status: "Developing" }
    ],
    training: [
      { name: "SaaS Financial Metrics & Unit Economics", provider: "Reforge", completionDate: null, status: "In Progress", hours: 20, score: "60% complete" },
      { name: "Executive Stakeholder Storytelling", provider: "McKinsey Academy", completionDate: "Jun 2024", status: "Completed", hours: 16, score: "92%" }
    ],
    attendance: {
      overall: "98.7%",
      punctuality: "98.0%",
      workingHoursAvg: "42.5 hrs/wk",
      leaveDaysUsed: 12,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Financial & Unit Economic Modeling", current: 65, required: 85, gap: 20, severity: "High", recommendation: "Pair with Strategic Finance on Q4 pricing tier analysis." },
      { skill: "Competitive Strategy & Pricing", current: 68, required: 80, gap: 12, severity: "Medium", recommendation: "Lead the 2025 Competitive Teardown for the European expansion line." }
    ],
    careerPath: {
      currentRole: "Product Manager II",
      targetRole: "Senior Product Manager",
      futureRole: "Group Product Manager (GPM)",
      readinessPct: 78,
      timeline: "6-9 Months",
      targetSkills: [
        { name: "Discovery & User Testing", current: 92, required: 85, gap: 0, status: "Ready" },
        { name: "Product Delivery & Agility", current: 90, required: 85, gap: 0, status: "Ready" },
        { name: "Commercial & Business Acumen", current: 65, required: 85, gap: 20, status: "Developing" },
        { name: "Cross-Functional Alignment", current: 84, required: 85, gap: 1, status: "Nearly Ready" }
      ],
      recommendedActions: [
        { title: "SaaS Financial Mastery Course", type: "Training", impact: "High", timeline: "Oct 2024", desc: "Complete final project on Gross Margin Optimization." },
        { title: "Own Tier-1 Pricing Packaging RFC", type: "Business Strategy", impact: "High", timeline: "Q4 2024", desc: "Draft pricing proposal with Finance & Sales Ops for Q1 rollout." }
      ]
    },
    aiSummary: {
      overview: "Consistently hits delivery milestones with outstanding customer insight and cross-functional rapport. Nearing promotion threshold; requires demonstration of financial modeling and long-term pricing strategy before Senior PM approval.",
      explainability: {
        whyThisInsight: "High metric performance on delivery (96%) and stakeholder satisfaction (4.6/5.0). However, 20% gap in financial modeling must be bridged for enterprise-level Senior PM responsibilities.",
        confidenceScore: "91%",
        dataSources: ["Product Delivery Epics", "Churn Reduction Metrics", "Manager Review", "Stakeholder Feedback"],
        strengths: ["Customer-first execution", "High-clarity documentation", "Strong empathy with engineering constraints"],
        risks: ["Needs deeper comfort with EBITDA and monetization modeling"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 92, status: "Strong", details: "All core onboarding OKRs exceeded; customer satisfaction up 18%." },
      projectImpact: { score: 88, status: "High", details: "Delivered self-serve onboarding, cutting drop-off rate by half." },
      requiredSkills: { score: "7 / 10", status: "Progressing", details: "Meets 7 of 10 Senior PM benchmark qualifications." },
      managerFeedback: { score: 90, status: "Strong", details: "Manager calibration 4.6/5.0; noted strong delivery drive." },
      trainingCompletion: { score: 85, status: "On Track", details: "Completed Executive Storytelling; currently enrolled in Financial Modeling." },
      businessImpact: { score: 88, status: "High", details: "$520k ARR expansion and $1.2M pipeline unlocked." }
    }
  },
  {
    id: "EMP-1003",
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Engineering Director",
    department: "Engineering",
    manager: "Sarah Jenkins",
    email: "marcus.vance@zerobugs.corp",
    joinDate: "Feb 14, 2020",
    location: "San Francisco, CA (Onsite)",
    performanceScore: 94,
    skillScore: 92,
    promotionReadiness: 90,
    readinessStatus: "Ready",
    performanceCategory: "Exceptional",
    status: "Active",
    businessImpact: {
      rating: "Very High",
      summary: "Scaled engineering team from 22 to 64 with 96% retention; maintained 99.99% uptime while slashing cloud infrastructure costs by $1.4M."
    },
    goals: [
      { goal: "Maintain Zero P0 Production Outages for 365 Days", target: "0 P0 Outages", achievement: "0 Outages (380 days)", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Cloud Infrastructure FinOps Savings of $1M+", target: "$1,000,000", achievement: "$1,420,000", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Employee Retention > 92% across all 5 engineering squads", target: "> 92%", achievement: "96.4%", status: "Exceeded", period: "Q3 2024", weight: 20 },
      { goal: "Reduce Average MTTR for Sev-1 Incidents < 15 mins", target: "< 15 mins", achievement: "11.2 mins", status: "Exceeded", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Multi-Region Kubernetes Migration", role: "Executive Sponsor", outcome: "Achieved zero downtime failover capability", businessImpact: "Very High", metric: "Saved $1.4M AWS bill annually", date: "June 2024" },
      { name: "Engineering Career Ladder Matrix v2", role: "Program Director", outcome: "Instituted objective promotion rubrics across 7 disciplines", businessImpact: "High", metric: "Reduced evaluation inconsistency variance by 40%", date: "March 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Sarah Jenkins", role: "VP of Engineering & HR Sponsor", rating: 4.9, comment: "Marcus is an exemplary engineering executive. He balances technical mastery with genuine empathy for his teams. Clear candidate for VP of Engineering.", date: "Sep 2024", highlight: "Exemplary operational excellence and culture builder" },
      { type: "Peer", author: "Elena Rostova", role: "Product Manager II", rating: 4.8, comment: "Marcus treats product partnership with top priority. His teams deliver on time and with zero drama.", date: "Aug 2024", highlight: "Trusted product ally" }
    ],
    skills: [
      { name: "Organizational Leadership & Scaling", category: "Leadership", current: 96, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Cloud Infrastructure & FinOps", category: "Technical", current: 94, required: 88, gap: 0, status: "Exceeds Requirement" },
      { name: "Strategic Executive Planning", category: "Leadership", current: 90, required: 88, gap: 0, status: "Exceeds Requirement" },
      { name: "Incident Response & Reliability", category: "Technical", current: 95, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Investor & Board Presentation", category: "Leadership", current: 80, required: 85, gap: 5, status: "Nearly Ready" }
    ],
    training: [
      { name: "Executive C-Suite Governance", provider: "Stanford Executive Program", completionDate: "May 2024", status: "Completed", hours: 40, score: "99%" },
      { name: "FinOps Certified Practitioner (FOCP)", provider: "Linux Foundation", completionDate: "Jan 2024", status: "Completed", hours: 30, score: "100%" }
    ],
    attendance: {
      overall: "99.8%",
      punctuality: "99.9%",
      workingHoursAvg: "45.0 hrs/wk",
      leaveDaysUsed: 8,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Investor & Board Presentation", current: 80, required: 85, gap: 5, severity: "Low", recommendation: "Shadow the CTO and VP during Q4 Board of Directors technical review." }
    ],
    careerPath: {
      currentRole: "Engineering Director",
      targetRole: "VP of Engineering",
      futureRole: "Chief Technology Officer (CTO)",
      readinessPct: 90,
      timeline: "Immediate / Q1 2025",
      targetSkills: [
        { name: "Scale Management (100+)", current: 94, required: 90, gap: 0, status: "Ready" },
        { name: "P&L Budget Accountability", current: 92, required: 90, gap: 0, status: "Ready" },
        { name: "Executive Board Presence", current: 80, required: 85, gap: 5, status: "Nearly Ready" },
        { name: "Global Talent Acquisition", current: 92, required: 85, gap: 0, status: "Ready" }
      ],
      recommendedActions: [
        { title: "Co-present Q4 Board Tech Session", type: "Executive Exposure", impact: "High", timeline: "Nov 2024", desc: "Present 2025 Technology Infrastructure Roadmap to the Board Audit Committee." }
      ]
    },
    aiSummary: {
      overview: "Exemplary track record of strategic execution, team scaling, and multi-million dollar operational efficiency. Displays top-tier promotion readiness for VP of Engineering.",
      explainability: {
        whyThisInsight: "Evaluation reflects 99% goal achievement, $1.4M FinOps cloud savings, 96% team retention, and near-perfect peer calibration (4.9/5.0). Only minor growth area is direct Board committee exposure.",
        confidenceScore: "97%",
        dataSources: ["FinOps Audit Reports", "HR Retention Records", "System Uptime Metrics (Datadog)", "360 Reviews"],
        strengths: ["FinOps fiscal responsibility", "Culturally trusted leader", "Flawless uptime metrics"],
        risks: ["Low risk; high executive readiness"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 98, status: "Exceeded", details: "All 4 director-level KPIs exceeded, notably $1.42M savings vs $1M goal." },
      projectImpact: { score: 96, status: "Very High", details: "Multi-region Kubernetes migration eliminated single points of failure." },
      requiredSkills: { score: "9 / 10", status: "Ready", details: "Satisfies 9 of 10 VP-level competencies." },
      managerFeedback: { score: 98, status: "Exceptional", details: "Manager calibration 4.9/5.0; endorsed by VP." },
      trainingCompletion: { score: 98, status: "Completed", details: "Completed Stanford Executive Leadership and FinOps certification." },
      businessImpact: { score: 96, status: "Exceptional", details: "$1.4M cloud savings directly boosted gross margins by 2.1%." }
    }
  },
  {
    id: "EMP-1004",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "Lead Data Scientist",
    department: "Data & AI",
    manager: "Marcus Vance",
    email: "priya.sharma@zerobugs.corp",
    joinDate: "Aug 01, 2022",
    location: "Austin, TX (Remote)",
    performanceScore: 89,
    skillScore: 91,
    promotionReadiness: 81,
    readinessStatus: "Ready",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Developed predictive churn model with 89% precision, preventing $840k in enterprise customer churn."
    },
    goals: [
      { goal: "Deploy Churn Prediction Model v2 into Realtime Pipeline", target: "Precision > 85%", achievement: "Precision 89.2%", status: "Exceeded", period: "Q3 2024", weight: 40 },
      { goal: "Reduce Model Inference Latency to < 45ms", target: "< 45ms", achievement: "38ms", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Train 4 Junior Analysts on Feature Engineering Best Practices", target: "4 Analysts", achievement: "4 Analysts", status: "Achieved", period: "Q3 2024", weight: 20 },
      { goal: "Publish Data Governance Guidelines for LLM Fine-Tuning", target: "Published Spec", achievement: "Published Spec", status: "Achieved", period: "Q3 2024", weight: 10 }
    ],
    projects: [
      { name: "Enterprise Customer Churn AI Engine", role: "Lead Scientist", outcome: "De-risked $840k ARR across 18 enterprise accounts", businessImpact: "High", metric: "Identified high-risk churn signals 60 days before contract renewal", date: "August 2024" },
      { name: "Semantic Search Index for Support Tickets", role: "ML Architect", outcome: "Reduced first-response ticket resolution time by 32%", businessImpact: "Medium", metric: "Saved 240 hours/mo of customer support engineering time", date: "May 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 4.7, comment: "Priya delivers mathematically rigorous models that generate tangible dollars. She is ready for Principal Data Scientist.", date: "Sep 2024", highlight: "High rigor and commercial impact" },
      { type: "Peer", author: "David Kim", role: "Data Engineering Manager", rating: 4.6, comment: "Priya produces production-ready code with tests, making pipeline deployment seamless.", date: "Aug 2024", highlight: "Clean ML engineering discipline" }
    ],
    skills: [
      { name: "Machine Learning & Statistical Modeling", category: "Technical", current: 96, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Python, PyTorch & Scikit-Learn", category: "Technical", current: 95, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "MLOps & Real-time Feature Stores", category: "Technical", current: 88, required: 85, gap: 0, status: "Meets Requirement" },
      { name: "Executive AI Strategy Communication", category: "Leadership", current: 70, required: 85, gap: 15, status: "Developing" },
      { name: "Budget Management for GPU Clusters", category: "Domain", current: 74, required: 85, gap: 11, status: "Developing" }
    ],
    training: [
      { name: "Advanced LLM Fine-Tuning & Quantization", provider: "DeepLearning.AI", completionDate: "Jul 2024", status: "Completed", hours: 28, score: "97%" },
      { name: "Executive AI Strategy & Enterprise Governance", provider: "MIT Sloan", completionDate: null, status: "In Progress", hours: 20, score: "70% progress" }
    ],
    attendance: {
      overall: "98.9%",
      punctuality: "99.0%",
      workingHoursAvg: "42.0 hrs/wk",
      leaveDaysUsed: 9,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Executive AI Strategy Communication", current: 70, required: 85, gap: 15, severity: "Medium", recommendation: "Lead the AI Ethics and Strategy Quarterly Briefing for C-suite leaders." },
      { skill: "Budget Management for GPU Clusters", current: 74, required: 85, gap: 11, severity: "Low", recommendation: "Partner with Cloud FinOps on cluster auto-scaling thresholds." }
    ],
    careerPath: {
      currentRole: "Lead Data Scientist",
      targetRole: "Principal Data Scientist",
      futureRole: "Head of AI & Analytics",
      readinessPct: 81,
      timeline: "3-6 Months",
      targetSkills: [
        { name: "Algorithm Innovation", current: 96, required: 90, gap: 0, status: "Ready" },
        { name: "MLOps Architecture", current: 88, required: 85, gap: 0, status: "Ready" },
        { name: "Enterprise AI Strategy", current: 70, required: 85, gap: 15, status: "Developing" },
        { name: "Research Publication / Patent", current: 82, required: 80, gap: 0, status: "Ready" }
      ],
      recommendedActions: [
        { title: "Complete MIT Sloan AI Executive Series", type: "Training", impact: "High", timeline: "Oct 2024", desc: "Gain credential in enterprise AI alignment and governance." },
        { title: "Establish AI Model Governance Framework", type: "Internal Program", impact: "High", timeline: "Q4 2024", desc: "Define company-wide model testing and validation protocols." }
      ]
    },
    aiSummary: {
      overview: "Outstanding data science acumen combined with disciplined engineering practices. Has proven tangible commercial impact through churn prevention. Ready for promotion to Principal pending executive AI roadmap ownership.",
      explainability: {
        whyThisInsight: "High technical KPI metrics (89.2% precision model delivered) and high manager evaluation (4.7/5.0). 15% communication gap on enterprise-level strategy is the sole remaining milestone.",
        confidenceScore: "93%",
        dataSources: ["MLflow Experiment Registry", "Jira Epics", "Salesforce Churn Telemetry", "360 Reviews"],
        strengths: ["High-impact predictive models", "Clean production coding", "Mentoring junior analysts"],
        risks: ["GPU cluster budget forecasting needs tighter oversight"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 94, status: "Exceeded", details: "Model accuracy and latency targets both beat SLA benchmarks." },
      projectImpact: { score: 90, status: "High", details: "De-risked $840k in renewal ARR; reduced support ticket handle time by 32%." },
      requiredSkills: { score: "8 / 10", status: "Ready", details: "Meets 8 of 10 Principal Data Scientist requirements." },
      managerFeedback: { score: 92, status: "Strong", details: "Manager calibration 4.7/5.0; praised for reliability." },
      trainingCompletion: { score: 90, status: "Strong", details: "Advanced LLM training completed with honors." },
      businessImpact: { score: 90, status: "High", details: "Tangible $840k churn impact verified by Finance." }
    }
  },
  {
    id: "EMP-1005",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "Engineering Manager (Data Platform)",
    department: "Data & AI",
    manager: "Marcus Vance",
    email: "david.kim@zerobugs.corp",
    joinDate: "Jan 10, 2021",
    location: "Seattle, WA (Remote)",
    performanceScore: 78,
    skillScore: 82,
    promotionReadiness: 62,
    readinessStatus: "Developing",
    performanceCategory: "Developing",
    status: "Active",
    businessImpact: {
      rating: "Medium",
      summary: "Maintained data pipeline reliability at 99.4%, though migration of legacy Airflow DAGs slipped by two sprint cycles."
    },
    goals: [
      { goal: "Migrate 120 Legacy Airflow DAGs to Dagster Pipeline", target: "120 DAGs", achievement: "82 DAGs", status: "At Risk", period: "Q3 2024", weight: 40 },
      { goal: "Data Warehouse Query Cost Optimization", target: "Save 20%", achievement: "Saved 22%", status: "Achieved", period: "Q3 2024", weight: 30 },
      { goal: "Conduct Weekly 1:1s and Career Development with 7 Direct Reports", target: "100% cadence", achievement: "94% cadence", status: "Achieved", period: "Q3 2024", weight: 15 },
      { goal: "Implement Data Quality Anomaly Detection with Monte Carlo", target: "100% Datasets", achievement: "70% Datasets", status: "On Track", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Snowflake Query Optimization Initiative", role: "Project Lead", outcome: "Reduced monthly warehouse credits by 22%", businessImpact: "Medium", metric: "Saved $78,000 on annual cloud compute budget", date: "July 2024" },
      { name: "Dagster Pipeline Overhaul", role: "Engineering Manager", outcome: "Partially delayed due to data modeling scope changes", businessImpact: "Medium", metric: "82 of 120 DAGs cut over with zero downtime", date: "August 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 3.8, comment: "David is technically astute, but his squad experienced scope creep and slipped key deadlines on the Dagster migration. Needs to improve proactive stakeholder escalation and capacity planning.", date: "Sep 2024", highlight: "Requires tighter timeline accountability and scope control" },
      { type: "Peer", author: "Priya Sharma", role: "Lead Data Scientist", rating: 4.2, comment: "David is very supportive of data science needs, though pipeline dependency changes were communicated later than ideal.", date: "Aug 2024", highlight: "Collaborative, needs earlier change notification" }
    ],
    skills: [
      { name: "Data Architecture & Distributed Pipelines", category: "Technical", current: 90, required: 85, gap: 0, status: "Meets Requirement" },
      { name: "SQL & Warehouse Performance", category: "Technical", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Sprint Capacity & Scope Management", category: "Leadership", current: 62, required: 85, gap: 23, status: "Developing" },
      { name: "Cross-Functional Dependency Escalation", category: "Leadership", current: 60, required: 85, gap: 25, status: "Developing" },
      { name: "Team Motivation & Retention", category: "Leadership", current: 78, required: 85, gap: 7, status: "Nearly Ready" }
    ],
    training: [
      { name: "Agile Project Governance & Risk Management", provider: "Coursera Enterprise", completionDate: null, status: "In Progress", hours: 24, score: "45% progress" },
      { name: "Advanced Data Engineering with Dagster", provider: "Dagster Labs", completionDate: "Apr 2024", status: "Completed", hours: 16, score: "94%" }
    ],
    attendance: {
      overall: "97.5%",
      punctuality: "97.2%",
      workingHoursAvg: "39.8 hrs/wk",
      leaveDaysUsed: 14,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Sprint Capacity & Scope Management", current: 62, required: 85, gap: 23, severity: "High", recommendation: "Implement bi-weekly sprint burn-down reviews and scope buffer rules." },
      { skill: "Cross-Functional Dependency Escalation", current: 60, required: 85, gap: 25, severity: "High", recommendation: "Establish formal Slack notification SLAs when schema breaking changes occur." }
    ],
    careerPath: {
      currentRole: "Engineering Manager (Data Platform)",
      targetRole: "Senior Engineering Manager",
      futureRole: "Director of Data Engineering",
      readinessPct: 62,
      timeline: "9-12 Months",
      targetSkills: [
        { name: "Technical Governance", current: 88, required: 85, gap: 0, status: "Ready" },
        { name: "Predictable Delivery & Scope", current: 62, required: 85, gap: 23, status: "Developing" },
        { name: "Multi-Team Coordination", current: 60, required: 85, gap: 25, status: "Developing" },
        { name: "People Development", current: 78, required: 85, gap: 7, status: "Nearly Ready" }
      ],
      recommendedActions: [
        { title: "Complete Agile Delivery Coaching Series", type: "Leadership", impact: "High", timeline: "Q4 2024", desc: "Work with agile coach on estimation frameworks and blocker resolution." },
        { title: "Successfully Deliver Dagster Milestone 3", type: "Delivery Milestone", impact: "High", timeline: "Oct 2024", desc: "Deliver remaining 38 DAGs without further sprint slippage." }
      ]
    },
    aiSummary: {
      overview: "Solid technical core and cost optimization results, but delivery unpredictability and late communication of timeline slippages currently hinder promotion readiness. Focus should remain on delivery consistency.",
      explainability: {
        whyThisInsight: "Sprint milestone slippage on 40% of Q3 deliverables combined with manager calibration rating (3.8/5.0). Identified clear development needs in agile velocity predictability and stakeholder communication.",
        confidenceScore: "90%",
        dataSources: ["Jira Release Velocity", "Airflow Migration Epics", "1:1 Logs", "Manager Calibration"],
        strengths: ["Deep database and warehousing knowledge", "$78k cloud savings delivered", "Supportive 1:1 cadence"],
        risks: ["Chronic sprint deadline slippage", "Need tighter project estimation"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 72, status: "At Risk", details: "Key migration goal completed at 68% (82/120 DAGs)." },
      projectImpact: { score: 78, status: "Medium", details: "Cost savings achieved; migration delayed." },
      requiredSkills: { score: "5 / 10", status: "Developing", details: "Meets 5 of 10 Senior Engineering Manager competencies." },
      managerFeedback: { score: 74, status: "Moderate", details: "Manager calibration 3.8/5.0; needs tighter scope discipline." },
      trainingCompletion: { score: 70, status: "Incomplete", details: "Agile Risk Management course currently at 45% completion." },
      businessImpact: { score: 76, status: "Moderate", details: "Saved $78k in compute, but migration delay added technical debt." }
    }
  },
  {
    id: "EMP-1006",
    name: "Jessica Taylor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "Senior Product Designer",
    department: "Design",
    manager: "David Miller",
    email: "jessica.taylor@zerobugs.corp",
    joinDate: "May 20, 2022",
    location: "New York, NY (Hybrid)",
    performanceScore: 91,
    skillScore: 90,
    promotionReadiness: 86,
    readinessStatus: "Ready",
    performanceCategory: "Exceptional",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Overhauled enterprise design tokens and design-to-code pipeline, cutting design QA turnaround time by 65%."
    },
    goals: [
      { goal: "Lead Figma Tokens 2.0 System Architecture", target: "100% Component Coverage", achievement: "100% Coverage", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Increase Usability SUS Score from 74 to > 85", target: "> 85 SUS", achievement: "88.4 SUS", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Establish Usability Benchmarking Cadence with 20 Enterprises", target: "20 Enterprises", achievement: "22 Enterprises", status: "Achieved", period: "Q3 2024", weight: 15 },
      { goal: "Mentor 2 Associate Product Designers", target: "2 Mentees", achievement: "2 Mentees", status: "Achieved", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Enterprise Design System (Figma to Code)", role: "Lead Designer", outcome: "Unified 4 divergent product lines under one accessible visual system", businessImpact: "High", metric: "65% reduction in frontend UI regression tickets", date: "August 2024" },
      { name: "Executive Analytics Dashboard UX", role: "Staff Designer", outcome: "Increased weekly active usage by 41% among VP-level users", businessImpact: "High", metric: "Awarded Best Enterprise UX 2024 internally", date: "June 2024" }
    ],
    feedback: [
      { type: "Manager", author: "David Miller", role: "Head of Design", rating: 4.8, comment: "Jessica is one of the strongest design systems architects in the industry. Ready for Staff Product Designer title.", date: "Sep 2024", highlight: "Superb systems thinking and craft" },
      { type: "Peer", author: "Alex Chen", role: "Senior Frontend Engineer", rating: 4.9, comment: "Jessica's specs are so thorough that engineering requires almost zero back-and-forth. Absolute rockstar.", date: "Aug 2024", highlight: "Impeccable engineer-designer collaboration" }
    ],
    skills: [
      { name: "Design Systems & Token Architecture", category: "Technical", current: 98, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "User Research & Usability Testing (SUS)", category: "Domain", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Information Architecture & Data Density", category: "Technical", current: 94, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Strategic Product Roadmapping", category: "Leadership", current: 75, required: 85, gap: 10, status: "Developing" },
      { name: "Executive Design Storytelling", category: "Leadership", current: 82, required: 85, gap: 3, status: "Nearly Ready" }
    ],
    training: [
      { name: "Design Leadership & Business Strategy", provider: "Dribbble Certified", completionDate: "May 2024", status: "Completed", hours: 24, score: "98%" },
      { name: "Accessible Design Systems (WCAG 2.2)", provider: "Interaction Design Foundation", completionDate: "Jan 2024", status: "Completed", hours: 20, score: "96%" }
    ],
    attendance: {
      overall: "99.1%",
      punctuality: "99.0%",
      workingHoursAvg: "41.5 hrs/wk",
      leaveDaysUsed: 11,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Strategic Product Roadmapping", current: 75, required: 85, gap: 10, severity: "Low", recommendation: "Co-own Q1 2025 product roadmap prioritization with Elena Rostova." }
    ],
    careerPath: {
      currentRole: "Senior Product Designer",
      targetRole: "Staff Product Designer",
      futureRole: "Design Director",
      readinessPct: 86,
      timeline: "3 Months",
      targetSkills: [
        { name: "Systems Craft", current: 98, required: 90, gap: 0, status: "Ready" },
        { name: "Design Leadership", current: 88, required: 85, gap: 0, status: "Ready" },
        { name: "Product Business Influence", current: 75, required: 85, gap: 10, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Present 2025 Design Vision to Product Council", type: "Strategy", impact: "High", timeline: "Oct 2024", desc: "Showcase design ROI and cross-product consolidation savings." }
      ]
    },
    aiSummary: {
      overview: "World-class design craft and peer collaboration. Delivers measurable customer satisfaction improvements (SUS 88.4) and engineering efficiency. Strong recommendation for Staff Designer.",
      explainability: {
        whyThisInsight: "Supported by 4.8/5.0 manager evaluation, 88.4 SUS usability score, and glowing reviews from technical leads across 3 squads.",
        confidenceScore: "95%",
        dataSources: ["Figma Analytics", "SUS Benchmark Surveys", "Jira Design QA Velocity", "Manager Review"],
        strengths: ["Design system mastery", "Zero-friction handoffs to engineering", "High peer trust"],
        risks: ["Minimal risk; ready for title transition"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 96, status: "Exceeded", details: "Achieved 88.4 SUS usability score vs 85 target; 100% token coverage." },
      projectImpact: { score: 92, status: "Very High", details: "Cut design QA cycle by 65%; enterprise active usage up 41%." },
      requiredSkills: { score: "9 / 10", status: "Ready", details: "Meets 9 of 10 Staff Designer expectations." },
      managerFeedback: { score: 96, status: "Strong", details: "Manager calibration 4.8/5.0 with full endorsement." },
      trainingCompletion: { score: 95, status: "Completed", details: "Completed Design Leadership & WCAG 2.2 masterclasses." },
      businessImpact: { score: 92, status: "High", details: "Unified 4 product lines, saving hundreds of hours of design rework." }
    }
  },
  {
    id: "EMP-1007",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    role: "DevOps & Cloud Engineer II",
    department: "Engineering",
    manager: "Marcus Vance",
    email: "james.wilson@zerobugs.corp",
    joinDate: "Oct 12, 2022",
    location: "Chicago, IL (Remote)",
    performanceScore: 84,
    skillScore: 86,
    promotionReadiness: 74,
    readinessStatus: "Nearly Ready",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Automated CI/CD build matrix reducing average PR merge pipeline duration from 26 minutes to 7.4 minutes."
    },
    goals: [
      { goal: "Reduce CI/CD Pipeline Duration to < 10 mins", target: "< 10 mins", achievement: "7.4 mins", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Migrate 40 Microservices to Automated Terraform IaC", target: "40 Services", achievement: "38 Services", status: "Achieved", period: "Q3 2024", weight: 30 },
      { goal: "Achieve AWS Certified DevOps Professional Certification", target: "Certification", achievement: "Passed (Score 880)", status: "Exceeded", period: "Q3 2024", weight: 20 },
      { goal: "Participate in On-Call Rotation with Zero Escalated Breaches", target: "0 Breaches", achievement: "0 Breaches", status: "Achieved", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "GitHub Actions Enterprise Runner Migration", role: "Lead DevOps", outcome: "Sped up developer feedback loop by 3.5x", businessImpact: "High", metric: "Saved ~45 engineering developer hours every week", date: "August 2024" },
      { name: "Automated Secret Rotation with HashiCorp Vault", role: "Security Contributor", outcome: "Automated rotation for 480 production secrets", businessImpact: "High", metric: "Zero credentials leaked; automated compliance auditing", date: "April 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 4.4, comment: "James is a phenomenal individual contributor on infrastructure automation. Next growth step for Senior DevOps is leading disaster recovery architecture drills.", date: "Sep 2024", highlight: "Outstanding automation skills, needs DR lead experience" },
      { type: "Peer", author: "Alex Chen", role: "Senior Frontend Engineer", rating: 4.7, comment: "James fixed our deployment cache issues in less than an hour. Immensely responsive.", date: "Aug 2024", highlight: "Customer-first internal service mindset" }
    ],
    skills: [
      { name: "Kubernetes & Container Orchestration", category: "Technical", current: 88, required: 85, gap: 0, status: "Meets Requirement" },
      { name: "Terraform & Infrastructure as Code", category: "Technical", current: 90, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "CI/CD Pipeline Optimization", category: "Technical", current: 94, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Disaster Recovery & Chaos Engineering", category: "Technical", current: 65, required: 85, gap: 20, status: "Developing" },
      { name: "Technical Documentation & Runbooks", category: "Domain", current: 78, required: 85, gap: 7, status: "Nearly Ready" }
    ],
    training: [
      { name: "AWS Certified DevOps Engineer — Professional", provider: "Amazon Web Services", completionDate: "Aug 2024", status: "Completed", hours: 45, score: "Passed (88%)" },
      { name: "Chaos Engineering & Disaster Preparedness", provider: "Gremlin Academy", completionDate: null, status: "In Progress", hours: 15, score: "40% complete" }
    ],
    attendance: {
      overall: "98.5%",
      punctuality: "98.0%",
      workingHoursAvg: "41.0 hrs/wk",
      leaveDaysUsed: 10,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Disaster Recovery & Chaos Engineering", current: 65, required: 85, gap: 20, severity: "Medium", recommendation: "Run the annual mock ransomware failover simulation in staging." }
    ],
    careerPath: {
      currentRole: "DevOps & Cloud Engineer II",
      targetRole: "Senior DevOps Engineer",
      futureRole: "Principal Infrastructure Architect",
      readinessPct: 74,
      timeline: "6 Months",
      targetSkills: [
        { name: "Cloud Automation", current: 90, required: 85, gap: 0, status: "Ready" },
        { name: "CI/CD Architecture", current: 94, required: 85, gap: 0, status: "Ready" },
        { name: "Resilience & DR", current: 65, required: 85, gap: 20, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Complete Gremlin Chaos Certification", type: "Training", impact: "Medium", timeline: "Oct 2024", desc: "Gain credential in proactive chaos testing." },
        { title: "Lead Q4 Staging Multi-AZ Failover Drill", type: "Project", impact: "High", timeline: "Nov 2024", desc: "Verify sub-5-minute failover without data corruption." }
      ]
    },
    aiSummary: {
      overview: "Superb execution on developer tooling and CI/CD pipelines. Nearing Senior DevOps readiness; completing the disaster recovery and resilience milestones will qualify James for the promotion cycle.",
      explainability: {
        whyThisInsight: "Exceeded CI/CD duration goals (7.4 mins vs 10 mins target) and certified on AWS Professional. 20% gap in Disaster Recovery needs fulfillment.",
        confidenceScore: "92%",
        dataSources: ["GitHub Actions Telemetry", "AWS Certification Registry", "PagerDuty Incident Logs"],
        strengths: ["Fast issue triage", "Terraform IaC consistency", "High developer satisfaction"],
        risks: ["Needs formal DR drill leadership experience"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 88, status: "Strong", details: "All CI/CD benchmarks met or exceeded." },
      projectImpact: { score: 86, status: "High", details: "Saved 45 developer hours weekly by speeding up test suites." },
      requiredSkills: { score: "7 / 10", status: "Nearly Ready", details: "Meets 7 of 10 Senior DevOps competency requirements." },
      managerFeedback: { score: 88, status: "Strong", details: "Manager calibration 4.4/5.0." },
      trainingCompletion: { score: 90, status: "Strong", details: "Earned AWS DevOps Professional certification." },
      businessImpact: { score: 84, status: "High", details: "3.5x faster deploy feedback loop accelerated overall product ship cadence." }
    }
  },
  {
    id: "EMP-1008",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    role: "VP of Product",
    department: "Product",
    manager: "Chief Executive Officer",
    email: "sarah.jenkins@zerobugs.corp",
    joinDate: "Jan 05, 2019",
    location: "San Francisco, CA (Onsite)",
    performanceScore: 96,
    skillScore: 95,
    promotionReadiness: 94,
    readinessStatus: "Ready",
    performanceCategory: "Exceptional",
    status: "Active",
    businessImpact: {
      rating: "Very High",
      summary: "Defined product vision driving $28M ARR growth (+42% YoY) while maintaining 118% net revenue retention."
    },
    goals: [
      { goal: "Achieve $28M ARR Annual Run Rate Target", target: "$28,000,000", achievement: "$29,400,000", status: "Exceeded", period: "Q3 2024", weight: 40 },
      { goal: "Net Dollar Retention > 115%", target: "> 115%", achievement: "118.2%", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Launch AI-Assisted Core Enterprise Capabilities", target: "GA Q3", achievement: "GA Shipped", status: "Exceeded", period: "Q3 2024", weight: 20 },
      { goal: "NPS Score > 60 across Enterprise Tier", target: "> 60 NPS", achievement: "67 NPS", status: "Exceeded", period: "Q3 2024", weight: 10 }
    ],
    projects: [
      { name: "ZEROBUGS AI Intelligence Suite Rollout", role: "Executive Sponsor", outcome: "Signed 14 new Fortune 500 pilots in first 60 days", businessImpact: "Very High", metric: "Generated $4.2M new qualified pipeline", date: "August 2024" },
      { name: "Product Organization Re-structuring", role: "VP Leader", outcome: "Formed 6 agile domain pods with dedicated UX & Data leads", businessImpact: "High", metric: "Time-to-market improved by 38%", date: "April 2024" }
    ],
    feedback: [
      { type: "Manager", author: "CEO", role: "Chief Executive Officer", rating: 5.0, comment: "Sarah operates as an owner. Visionary product instincts combined with disciplined fiscal governance.", date: "Sep 2024", highlight: "Visionary executive leadership" },
      { type: "Peer", author: "Marcus Vance", role: "Engineering Director", rating: 4.9, comment: "Sarah provides crystal clear north-star vision and gives teams the autonomy to execute.", date: "Aug 2024", highlight: "Empowering partner to Engineering" }
    ],
    skills: [
      { name: "Executive Product Strategy", category: "Leadership", current: 98, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "P&L Ownership & Growth Modeling", category: "Leadership", current: 96, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Org Design & Talent Development", category: "Leadership", current: 94, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "M&A Integration & Strategic Partnerships", category: "Leadership", current: 88, required: 85, gap: 0, status: "Meets Requirement" }
    ],
    training: [
      { name: "Board Governance & Public Company Readiness", provider: "NACD Institute", completionDate: "Jun 2024", status: "Completed", hours: 40, score: "100%" }
    ],
    attendance: {
      overall: "99.5%",
      punctuality: "99.5%",
      workingHoursAvg: "46.0 hrs/wk",
      leaveDaysUsed: 7,
      leaveDaysTotal: 25
    },
    developmentGaps: [],
    careerPath: {
      currentRole: "VP of Product",
      targetRole: "Chief Product Officer (CPO)",
      futureRole: "Chief Executive Officer / Board Member",
      readinessPct: 94,
      timeline: "Immediate / Q4 2024",
      targetSkills: [
        { name: "Enterprise Vision", current: 98, required: 90, gap: 0, status: "Ready" },
        { name: "Multi-Product P&L", current: 96, required: 90, gap: 0, status: "Ready" },
        { name: "Investor Relations", current: 92, required: 90, gap: 0, status: "Ready" }
      ],
      recommendedActions: [
        { title: "Lead Series C Product Presentation", type: "Executive", impact: "High", timeline: "Q4 2024", desc: "Present growth strategy to lead institutional investors." }
      ]
    },
    aiSummary: {
      overview: "Exemplary performance across every business and leadership dimension. Direct driver of $29.4M ARR and top-tier product NPS (67). Full readiness for Chief Product Officer.",
      explainability: {
        whyThisInsight: "Evaluation synthesizes 100%+ goal attainment across revenue, NPS, and retention targets, with unanimous 5.0 CEO evaluation.",
        confidenceScore: "98%",
        dataSources: ["Stripe / Salesforce Billing Data", "Executive 360", "Board Pack Review"],
        strengths: ["Flawless commercial execution", "High organizational clarity", "Customer retention at 118% NDR"],
        risks: ["None identified"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 99, status: "Exceptional", details: "$29.4M ARR achieved vs $28M target; 118.2% NDR." },
      projectImpact: { score: 98, status: "Very High", details: "AI Suite generated $4.2M pipeline in 60 days." },
      requiredSkills: { score: "10 / 10", status: "Mastery", details: "Meets or exceeds all 10 C-suite competencies." },
      managerFeedback: { score: 100, status: "Exceptional", details: "CEO calibration 5.0/5.0." },
      trainingCompletion: { score: 100, status: "Completed", details: "NACD Board governance certified." },
      businessImpact: { score: 98, status: "Exceptional", details: "Direct driver of company's core recurring revenue growth." }
    }
  },
  {
    id: "EMP-1009",
    name: "Michael Chang",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    role: "Backend Engineer II",
    department: "Engineering",
    manager: "Marcus Vance",
    email: "michael.chang@zerobugs.corp",
    joinDate: "Feb 01, 2023",
    location: "Austin, TX (Hybrid)",
    performanceScore: 81,
    skillScore: 80,
    promotionReadiness: 66,
    readinessStatus: "Developing",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "Medium",
      summary: "Refactored user permissions service in Go, decreasing auth verification latency from 18ms to 3.2ms."
    },
    goals: [
      { goal: "Reduce Auth Microservice Latency < 5ms", target: "< 5ms", achievement: "3.2ms", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Implement Distributed Tracing with OpenTelemetry", target: "90% Service Coverage", achievement: "78% Coverage", status: "On Track", period: "Q3 2024", weight: 30 },
      { goal: "Achieve 90%+ Code Coverage on Go Services", target: "90%", achievement: "88%", status: "On Track", period: "Q3 2024", weight: 20 },
      { goal: "Complete Go Concurrency Patterns Course", target: "Course Completion", achievement: "Completed", status: "Achieved", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Auth Service v2 Architecture", role: "Backend Contributor", outcome: "Replaced legacy Ruby service with high-throughput Go daemon", businessImpact: "Medium", metric: "Handled 15k requests/second at 99.99% reliability", date: "July 2024" },
      { name: "Database Read-Replica Load Balancing", role: "Contributor", outcome: "Prevented weekend replication lag spikes", businessImpact: "Medium", metric: "Zero database timeouts during Q3 marketing surge", date: "May 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 4.1, comment: "Michael writes clean, fast Go code. To step into a Senior Engineer role, he needs to take ownership of system design RFCs and mentor junior engineers.", date: "Sep 2024", highlight: "Solid coding fundamentals, needs broader technical ownership" },
      { type: "Peer", author: "Alex Chen", role: "Senior Frontend Engineer", rating: 4.4, comment: "Michael responds quickly on backend bug triage and provided excellent REST/gRPC docs.", date: "Aug 2024", highlight: "Dependable and collaborative" }
    ],
    skills: [
      { name: "Golang & Concurrency Patterns", category: "Technical", current: 88, required: 85, gap: 0, status: "Meets Requirement" },
      { name: "PostgreSQL & Query Optimization", category: "Technical", current: 84, required: 80, gap: 0, status: "Meets Requirement" },
      { name: "Distributed System Design & RFCs", category: "Technical", current: 65, required: 85, gap: 20, status: "Developing" },
      { name: "Junior Engineer Mentorship", category: "Leadership", current: 60, required: 80, gap: 20, status: "Developing" }
    ],
    training: [
      { name: "Distributed Systems Engineering in Go", provider: "Ardan Labs", completionDate: "Jun 2024", status: "Completed", hours: 24, score: "92%" },
      { name: "Software Architecture & RFC Writing", provider: "O'Reilly", completionDate: null, status: "In Progress", hours: 16, score: "50% complete" }
    ],
    attendance: {
      overall: "98.2%",
      punctuality: "98.5%",
      workingHoursAvg: "40.5 hrs/wk",
      leaveDaysUsed: 11,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Distributed System Design & RFCs", current: 65, required: 85, gap: 20, severity: "High", recommendation: "Author the RFC for the Event-Driven Audit Log microservice." },
      { skill: "Junior Engineer Mentorship", current: 60, required: 80, gap: 20, severity: "Medium", recommendation: "Pair with the Q4 engineering intern for onboarding mentorship." }
    ],
    careerPath: {
      currentRole: "Backend Engineer II",
      targetRole: "Senior Backend Engineer",
      futureRole: "Staff Backend Engineer",
      readinessPct: 66,
      timeline: "6-9 Months",
      targetSkills: [
        { name: "Core Coding & Go Mastery", current: 88, required: 85, gap: 0, status: "Ready" },
        { name: "Distributed Architecture", current: 65, required: 85, gap: 20, status: "Developing" },
        { name: "Mentorship", current: 60, required: 80, gap: 20, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Author Event-Driven RFC", type: "Technical Leadership", impact: "High", timeline: "Q4 2024", desc: "Present distributed architecture proposal to Architecture Guild." }
      ]
    },
    aiSummary: {
      overview: "Capable backend engineer with strong code quality and performance optimization skills. Needs to expand scope into system design ownership and active peer mentorship to meet Senior criteria.",
      explainability: {
        whyThisInsight: "Good goal execution on auth optimization (3.2ms latency), but gaps remain in architecture RFC leadership (20% gap) and mentorship track record.",
        confidenceScore: "89%",
        dataSources: ["GitHub PR Reviews", "Service Latency Telemetry", "1:1 Review Notes"],
        strengths: ["High-speed Go microservice implementation", "Consistent sprint velocity", "Great documentation"],
        risks: ["Has not yet led a multi-service technical proposal"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 82, status: "On Track", details: "Met core throughput and latency OKRs; test coverage at 88%." },
      projectImpact: { score: 80, status: "Medium", details: "Cut auth latency from 18ms to 3.2ms, serving 15k req/sec." },
      requiredSkills: { score: "6 / 10", status: "Developing", details: "Meets 6 of 10 Senior Backend Engineer competencies." },
      managerFeedback: { score: 82, status: "Positive", details: "Manager calibration 4.1/5.0." },
      trainingCompletion: { score: 80, status: "In Progress", details: "Go concurrency certified; RFC writing in progress." },
      businessImpact: { score: 78, status: "Medium", details: "Auth reliability directly reduced login drop-off errors." }
    }
  },
  {
    id: "EMP-1010",
    name: "Rachel Zane",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "HR Operations Lead",
    department: "Operations",
    manager: "Sarah Jenkins",
    email: "rachel.zane@zerobugs.corp",
    joinDate: "Mar 15, 2021",
    location: "New York, NY (Hybrid)",
    performanceScore: 90,
    skillScore: 88,
    promotionReadiness: 83,
    readinessStatus: "Ready",
    performanceCategory: "Exceptional",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Modernized automated HR onboarding and compliance workflows, cutting onboarding administrative hours by 72% across 85 new hires."
    },
    goals: [
      { goal: "Reduce Employee Onboarding Cycle Time < 3 Days", target: "< 3 Days", achievement: "1.8 Days", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Attain 100% SOC2 HR Compliance Attestation", target: "100%", achievement: "100%", status: "Achieved", period: "Q3 2024", weight: 35 },
      { goal: "Deploy Employee Engagement Pulse Survey (90%+ Participation)", target: "> 90%", achievement: "94.2%", status: "Exceeded", period: "Q3 2024", weight: 15 },
      { goal: "Conduct Manager Calibration Workshop for 24 People Managers", target: "24 Managers", achievement: "24 Managers", status: "Achieved", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Enterprise HRIS & Payroll Automation", role: "Project Owner", outcome: "Automated benefits provisioning and zero-day access workflows", businessImpact: "High", metric: "Saved $110,000 in third-party contractor processing fees", date: "August 2024" },
      { name: "Diversity & Inclusion Mentorship Program", role: "Program Director", outcome: "Connected 48 underrepresented employees with senior mentors", businessImpact: "High", metric: "96% program satisfaction rating", date: "June 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Sarah Jenkins", role: "VP Sponsor", rating: 4.7, comment: "Rachel runs HR operations with military precision and immense emotional intelligence. A natural candidate for Head of People Operations.", date: "Sep 2024", highlight: "Flawless operational execution & empathy" },
      { type: "Peer", author: "Marcus Vance", role: "Engineering Director", rating: 4.8, comment: "Onboarding new engineering hires used to take 2 weeks of IT tickets. Rachel made it happen in 24 hours.", date: "Aug 2024", highlight: "Transformational speed for hiring teams" }
    ],
    skills: [
      { name: "HRIS Systems & Automation", category: "Technical", current: 95, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Labor Law & Global Employment Compliance", category: "Domain", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Employee Relations & Conflict Resolution", category: "Leadership", current: 90, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Executive Compensation Modeling", category: "Domain", current: 72, required: 85, gap: 13, status: "Developing" }
    ],
    training: [
      { name: "SHRM Senior Certified Professional (SHRM-SCP)", provider: "SHRM", completionDate: "May 2024", status: "Completed", hours: 60, score: "Passed" },
      { name: "Executive Compensation & Equity Design", provider: "WorldatWork", completionDate: null, status: "In Progress", hours: 24, score: "65% complete" }
    ],
    attendance: {
      overall: "99.4%",
      punctuality: "99.8%",
      workingHoursAvg: "42.0 hrs/wk",
      leaveDaysUsed: 8,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Executive Compensation Modeling", current: 72, required: 85, gap: 13, severity: "Medium", recommendation: "Partner with CFO on 2025 executive equity benchmark refresh." }
    ],
    careerPath: {
      currentRole: "HR Operations Lead",
      targetRole: "Head of People Operations",
      futureRole: "Chief People Officer (CPO)",
      readinessPct: 83,
      timeline: "3-6 Months",
      targetSkills: [
        { name: "HR Compliance & Operations", current: 95, required: 90, gap: 0, status: "Ready" },
        { name: "Strategic People Leadership", current: 90, required: 85, gap: 0, status: "Ready" },
        { name: "Total Rewards & Compensation", current: 72, required: 85, gap: 13, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Complete WorldatWork Executive Comp Program", type: "Certification", impact: "High", timeline: "Nov 2024", desc: "Gain credential in modern equity and executive incentive structures." }
      ]
    },
    aiSummary: {
      overview: "High-performing People leader who transformed onboarding and achieved 100% compliance. Ready for Head of People Operations pending completion of the executive total rewards module.",
      explainability: {
        whyThisInsight: "Strong rating of 4.7/5.0, 94.2% engagement score, and 72% administrative reduction. 13% delta in executive compensation modeling is easily addressed in next quarter.",
        confidenceScore: "94%",
        dataSources: ["HRIS Audit Logs", "Engagement Survey Analytics", "Manager 360"],
        strengths: ["Seamless employee onboarding", "SOC2 compliance attestation", "Trusted advisor across departments"],
        risks: ["Needs deeper familiarity with executive equity grant models"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 94, status: "Exceeded", details: "Reduced onboarding time to 1.8 days (vs 3 days target)." },
      projectImpact: { score: 90, status: "High", details: "Saved $110k in contractor fees and improved hire ramp speed." },
      requiredSkills: { score: "8 / 10", status: "Ready", details: "Meets 8 of 10 Head of People competencies." },
      managerFeedback: { score: 94, status: "Strong", details: "Manager calibration 4.7/5.0." },
      trainingCompletion: { score: 92, status: "Strong", details: "SHRM-SCP certified; Executive Comp coursework underway." },
      businessImpact: { score: 88, status: "High", details: "Achieved flawless SOC2 compliance with zero exceptions." }
    }
  },
  {
    id: "EMP-1011",
    name: "Daniel Foster",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    role: "Senior Security Engineer",
    department: "Engineering",
    manager: "Marcus Vance",
    email: "daniel.foster@zerobugs.corp",
    joinDate: "Jun 10, 2022",
    location: "Austin, TX (Remote)",
    performanceScore: 87,
    skillScore: 89,
    promotionReadiness: 79,
    readinessStatus: "Nearly Ready",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Implemented automated SAST/DAST scanning in build pipelines, remediating 84 high-severity vulnerabilities prior to production release."
    },
    goals: [
      { goal: "Zero Critical Vulnerabilities in Production > 30 Days", target: "0 Criticals", achievement: "0 Criticals (310 days)", status: "Exceeded", period: "Q3 2024", weight: 35 },
      { goal: "Automate Vulnerability Triage SLA < 48 hours", target: "< 48 hrs", achievement: "18.4 hrs", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Conduct Red Team Penetration Exercise on API Endpoints", target: "1 Pentest", achievement: "Completed", status: "Achieved", period: "Q3 2024", weight: 20 },
      { goal: "Security Champions Training for 15 Software Engineers", target: "15 Champions", achievement: "12 Champions", status: "On Track", period: "Q3 2024", weight: 15 }
    ],
    projects: [
      { name: "Zero Trust Architecture Rollout", role: "Security Architect", outcome: "Transitioned internal VPN to Identity-Aware Proxy (Cloudflare Access)", businessImpact: "High", metric: "Eliminated lateral network movement risk across 300+ endpoints", date: "July 2024" },
      { name: "Bug Bounty Program Optimization", role: "Lead Reviewer", outcome: "Resolved 42 valid external researcher disclosures within SLA", businessImpact: "Medium", metric: "Paid $32,000 bounties; zero critical breaches", date: "May 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 4.5, comment: "Daniel is a vigilant security guardian. Highly respected by devs because he suggests practical code fixes rather than just blocking PRs.", date: "Sep 2024", highlight: "Empathetic and practical security partner" }
    ],
    skills: [
      { name: "Cloud Security & Zero Trust Architecture", category: "Technical", current: 94, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Application Security & Code Auditing", category: "Technical", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Threat Modeling & Incident Handling", category: "Technical", current: 88, required: 85, gap: 0, status: "Meets Requirement" },
      { name: "Executive Risk Communication", category: "Leadership", current: 68, required: 85, gap: 17, status: "Developing" }
    ],
    training: [
      { name: "Certified Information Systems Security Professional (CISSP)", provider: "ISC2", completionDate: "Apr 2024", status: "Completed", hours: 80, score: "Passed" },
      { name: "Enterprise Cyber Risk for Board Committees", provider: "SANS Institute", completionDate: null, status: "In Progress", hours: 20, score: "40% complete" }
    ],
    attendance: {
      overall: "99.0%",
      punctuality: "99.2%",
      workingHoursAvg: "41.5 hrs/wk",
      leaveDaysUsed: 9,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Executive Risk Communication", current: 68, required: 85, gap: 17, severity: "Medium", recommendation: "Draft the Monthly Cyber Risk Heatmap for the Executive Risk Council." }
    ],
    careerPath: {
      currentRole: "Senior Security Engineer",
      targetRole: "Staff Security Architect",
      futureRole: "Chief Information Security Officer (CISO)",
      readinessPct: 79,
      timeline: "6 Months",
      targetSkills: [
        { name: "Application Security", current: 94, required: 90, gap: 0, status: "Ready" },
        { name: "Threat Intelligence", current: 88, required: 85, gap: 0, status: "Ready" },
        { name: "Executive Governance", current: 68, required: 85, gap: 17, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Complete SANS Executive Risk Series", type: "Training", impact: "High", timeline: "Nov 2024", desc: "Sharpen skills in presenting quantifiable cyber risk to business executives." }
      ]
    },
    aiSummary: {
      overview: "Outstanding application security specialist who successfully transitioned company to Zero Trust. High promotion readiness for Staff Security Architect pending executive risk framing.",
      explainability: {
        whyThisInsight: "Maintained zero critical vulnerabilities for 310 consecutive days and holds CISSP credentials. 17% delta in executive risk communication.",
        confidenceScore: "93%",
        dataSources: ["Vulnerability Scanners (Snyk, SonarQube)", "CISSP Verification", "Manager Review"],
        strengths: ["Zero Trust execution", "Speedy 18hr vulnerability SLA", "Engineers value his guidance"],
        risks: ["Needs comfort translating technical CVEs into enterprise dollars at risk"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 92, status: "Strong", details: "Zero critical production vulnerabilities maintained for 300+ days." },
      projectImpact: { score: 88, status: "High", details: "Zero Trust architecture deployed across entire remote workforce." },
      requiredSkills: { score: "7 / 10", status: "Nearly Ready", details: "Meets 7 of 10 Staff Architect competencies." },
      managerFeedback: { score: 90, status: "Strong", details: "Manager calibration 4.5/5.0." },
      trainingCompletion: { score: 88, status: "Strong", details: "CISSP certified." },
      businessImpact: { score: 86, status: "High", details: "Avoided potential multi-million dollar data breach risks." }
    }
  },
  {
    id: "EMP-1012",
    name: "Amara Okonjo",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    role: "Full Stack Engineer I",
    department: "Engineering",
    manager: "Marcus Vance",
    email: "amara.okonjo@zerobugs.corp",
    joinDate: "Jan 16, 2024",
    location: "Atlanta, GA (Remote)",
    performanceScore: 76,
    skillScore: 74,
    promotionReadiness: 48,
    readinessStatus: "Developing",
    performanceCategory: "Developing",
    status: "Active",
    businessImpact: {
      rating: "Medium",
      summary: "Delivered 18 feature tickets in the employee feedback module with steady velocity and rising test coverage."
    },
    goals: [
      { goal: "Complete 15 Feature Tickets in Feedback Module", target: "15 Tickets", achievement: "18 Tickets", status: "Exceeded", period: "Q3 2024", weight: 40 },
      { goal: "Maintain PR Review Turnaround Time < 24 Hours", target: "< 24 hrs", achievement: "22 hrs", status: "Achieved", period: "Q3 2024", weight: 30 },
      { goal: "Complete Advanced TypeScript Bootcamp", target: "Bootcamp Completion", achievement: "Completed", status: "Achieved", period: "Q3 2024", weight: 30 }
    ],
    projects: [
      { name: "Peer Feedback UI Components", role: "Frontend Developer", outcome: "Built 8 accessible, reusable feedback widgets in React", businessImpact: "Medium", metric: "Zero accessibility violations; 92% unit test coverage", date: "August 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 3.9, comment: "Amara has shown tremendous learning speed in her first 8 months. On track for Mid-Level Engineer in 6-12 months as she tackles more ambiguous backend tasks.", date: "Sep 2024", highlight: "High hunger to learn, progressing nicely" },
      { type: "Peer", author: "Alex Chen", role: "Senior Frontend Engineer", rating: 4.5, comment: "Amara takes feedback constructively and immediately incorporates linting and architectural pointers into her PRs.", date: "Aug 2024", highlight: "High receptivity to mentorship" }
    ],
    skills: [
      { name: "React & Component Development", category: "Technical", current: 80, required: 80, gap: 0, status: "Meets Requirement" },
      { name: "TypeScript Basics & Generics", category: "Technical", current: 74, required: 80, gap: 6, status: "Nearly Ready" },
      { name: "Backend APIs & Node.js", category: "Technical", current: 65, required: 80, gap: 15, status: "Developing" },
      { name: "System Debugging & Observability", category: "Technical", current: 58, required: 75, gap: 17, status: "Developing" }
    ],
    training: [
      { name: "Fullstack Node.js & Microservices", provider: "Frontend Masters", completionDate: null, status: "In Progress", hours: 20, score: "55% complete" }
    ],
    attendance: {
      overall: "98.8%",
      punctuality: "99.0%",
      workingHoursAvg: "40.2 hrs/wk",
      leaveDaysUsed: 5,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Backend APIs & Node.js", current: 65, required: 80, gap: 15, severity: "High", recommendation: "Take ownership of a new API endpoint implementation in the Q4 sprint." },
      { skill: "System Debugging & Observability", current: 58, required: 75, gap: 17, severity: "Medium", recommendation: "Shadow on-call secondary engineer during next triage week." }
    ],
    careerPath: {
      currentRole: "Full Stack Engineer I",
      targetRole: "Full Stack Engineer II",
      futureRole: "Senior Full Stack Engineer",
      readinessPct: 48,
      timeline: "9-12 Months",
      targetSkills: [
        { name: "Frontend Fluency", current: 80, required: 80, gap: 0, status: "Ready" },
        { name: "Backend Autonomy", current: 65, required: 80, gap: 15, status: "Developing" },
        { name: "Production Debugging", current: 58, required: 75, gap: 17, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Complete Node.js Microservices Course", type: "Training", impact: "Medium", timeline: "Oct 2024", desc: "Build confidence in async handlers and relational DB schemas." },
        { title: "Own 1 Full-Stack Epic End-to-End", type: "Project", impact: "High", timeline: "Q4 2024", desc: "Build both the API schema and UI modal for new notifications feature." }
      ]
    },
    aiSummary: {
      overview: "Promising early-career engineer with high learning velocity and positive team feedback. Currently in foundational development stage; promotion review expected in 9-12 months.",
      explainability: {
        whyThisInsight: "Tenure of 8 months with solid execution on scoped individual tickets (18 tickets). Developing backend autonomy and debugging depth are prerequisites for level II.",
        confidenceScore: "88%",
        dataSources: ["Sprint Velocity", "GitHub PR Records", "1:1 Coaching Notes"],
        strengths: ["Quick learner", "High enthusiasm", "Quality code with high test coverage"],
        risks: ["Needs more reps tackling independent ambiguous problems"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 80, status: "On Track", details: "Completed 18 tickets vs 15 target; on-schedule ramp." },
      projectImpact: { score: 72, status: "Medium", details: "Delivered feedback UI components with zero bugs." },
      requiredSkills: { score: "4 / 10", status: "Developing", details: "Early tenure; satisfies 4 of 10 Level II benchmarks." },
      managerFeedback: { score: 78, status: "Encouraging", details: "Manager calibration 3.9/5.0." },
      trainingCompletion: { score: 75, status: "Progressing", details: "Completed TS Bootcamp; Node course underway." },
      businessImpact: { score: 70, status: "Moderate", details: "Helped team ship feedback release on schedule." }
    }
  },
  {
    id: "EMP-1013",
    name: "Carlos Mendez",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "Senior QA & Automation Engineer",
    department: "Engineering",
    manager: "Marcus Vance",
    email: "carlos.mendez@zerobugs.corp",
    joinDate: "Nov 01, 2021",
    location: "Miami, FL (Remote)",
    performanceScore: 86,
    skillScore: 87,
    promotionReadiness: 76,
    readinessStatus: "Nearly Ready",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "High",
      summary: "Built Playwright end-to-end regression suite covering 320 critical customer journeys, slashing regression test cycle from 12 hours to 22 minutes."
    },
    goals: [
      { goal: "Reduce End-to-End Test Suite Duration < 30 Mins", target: "< 30 mins", achievement: "22 mins", status: "Exceeded", period: "Q3 2024", weight: 40 },
      { goal: "Increase Automated Test Flakiness Recovery Rate > 95%", target: "> 95%", achievement: "97.4%", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Train 8 Engineers on Playwright Parallel Test Execution", target: "8 Engineers", achievement: "8 Engineers", status: "Achieved", period: "Q3 2024", weight: 30 }
    ],
    projects: [
      { name: "Parallelized Playwright Test Grid", role: "Lead QA Architect", outcome: "Executed 1,200 test cases per PR with zero test environment collisions", businessImpact: "High", metric: "Reduced escaped production regressions by 74%", date: "August 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Marcus Vance", role: "Engineering Director", rating: 4.4, comment: "Carlos has revolutionized our release safety. Ready to step up to QA Staff / Quality Engineering Lead.", date: "Sep 2024", highlight: "Dramatic speedup in test execution safety" }
    ],
    skills: [
      { name: "Playwright & Cypress Automation", category: "Technical", current: 95, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "CI Pipeline Integration & Test Sharding", category: "Technical", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Performance & Load Testing (k6 / Locust)", category: "Technical", current: 72, required: 85, gap: 13, status: "Developing" },
      { name: "Cross-Squad Quality Governance", category: "Leadership", current: 70, required: 85, gap: 15, status: "Developing" }
    ],
    training: [
      { name: "Distributed Load Testing with k6", provider: "Grafana Labs", completionDate: null, status: "In Progress", hours: 16, score: "60% complete" }
    ],
    attendance: {
      overall: "98.6%",
      punctuality: "98.9%",
      workingHoursAvg: "41.0 hrs/wk",
      leaveDaysUsed: 11,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Performance & Load Testing (k6 / Locust)", current: 72, required: 85, gap: 13, severity: "Medium", recommendation: "Conduct synthetic Black Friday 50k RPS load test simulation." },
      { skill: "Cross-Squad Quality Governance", current: 70, required: 85, gap: 15, severity: "Medium", recommendation: "Chair the bi-weekly Engineering Bug Scrub and Quality council." }
    ],
    careerPath: {
      currentRole: "Senior QA & Automation Engineer",
      targetRole: "Staff Quality Engineer",
      futureRole: "Director of Quality Assurance",
      readinessPct: 76,
      timeline: "6 Months",
      targetSkills: [
        { name: "Automation Frameworks", current: 95, required: 90, gap: 0, status: "Ready" },
        { name: "Scalable Load Testing", current: 72, required: 85, gap: 13, status: "Developing" },
        { name: "Org Quality Standards", current: 70, required: 85, gap: 15, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Lead Black Friday Load Testing", type: "Technical", impact: "High", timeline: "Oct 2024", desc: "Simulate peak traffic and document performance bottlenecks." }
      ]
    },
    aiSummary: {
      overview: "Instrumental in cutting regression test duration by 95% and lowering escaped defects. Nearly ready for Staff level; expanding into load testing and company-wide quality governance are the target milestones.",
      explainability: {
        whyThisInsight: "22-minute test suite execution exceeded the 30-minute target by 26%. Quality governance across all squads will bridge the remaining gap.",
        confidenceScore: "91%",
        dataSources: ["Playwright Test Analytics", "Bug Scrub Logs", "Manager Review"],
        strengths: ["Outstanding test automation", "Zero flakiness discipline", "Dev team ally"],
        risks: ["Needs deeper experience with large-scale distributed load testing"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 90, status: "Exceeded", details: "Test suite sped up from 12 hours to 22 minutes." },
      projectImpact: { score: 88, status: "High", details: "74% drop in customer-reported bugs." },
      requiredSkills: { score: "7 / 10", status: "Nearly Ready", details: "Meets 7 of 10 Staff QA benchmarks." },
      managerFeedback: { score: 88, status: "Strong", details: "Manager calibration 4.4/5.0." },
      trainingCompletion: { score: 82, status: "On Track", details: "k6 performance testing course in progress." },
      businessImpact: { score: 86, status: "High", details: "Faster engineering deploys with far fewer rollbacks." }
    }
  },
  {
    id: "EMP-1014",
    name: "Zoe Kravitz",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Talent Acquisition Lead",
    department: "Operations",
    manager: "Sarah Jenkins",
    email: "zoe.kravitz@zerobugs.corp",
    joinDate: "Apr 18, 2022",
    location: "San Francisco, CA (Hybrid)",
    performanceScore: 92,
    skillScore: 90,
    promotionReadiness: 85,
    readinessStatus: "Ready",
    performanceCategory: "Exceptional",
    status: "Active",
    businessImpact: {
      rating: "Very High",
      summary: "Filled 38 specialized technical and product roles with an average time-to-hire of 28 days vs 45-day industry average, saving $420k in agency recruitment fees."
    },
    goals: [
      { goal: "Reduce Average Time-to-Hire to < 32 Days", target: "< 32 Days", achievement: "28 Days", status: "Exceeded", period: "Q3 2024", weight: 40 },
      { goal: "Increase Candidate Offer Acceptance Rate > 88%", target: "> 88%", achievement: "91.5%", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Achieve 40%+ Diversity in Engineering Hires", target: "40%", achievement: "43.2%", status: "Exceeded", period: "Q3 2024", weight: 30 }
    ],
    projects: [
      { name: "Global Technical Talent Sourcing Engine", role: "Talent Lead", outcome: "Built proactive pipeline of 600+ vetted senior engineers", businessImpact: "High", metric: "Saved $420,000 in agency headhunter fees", date: "August 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Sarah Jenkins", role: "VP Sponsor", rating: 4.8, comment: "Zoe is an exceptional partner to hiring managers. She understands exactly what technical teams need.", date: "Sep 2024", highlight: "Superb hiring calibration and velocity" }
    ],
    skills: [
      { name: "Technical Talent Sourcing & Closing", category: "Domain", current: 96, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Hiring Manager Calibration & Coaching", category: "Leadership", current: 94, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Workforce Planning & Headcount Modeling", category: "Leadership", current: 78, required: 85, gap: 7, status: "Nearly Ready" }
    ],
    training: [
      { name: "Strategic Workforce Planning & Analytics", provider: "Cornell ILR", completionDate: "Jul 2024", status: "Completed", hours: 30, score: "96%" }
    ],
    attendance: {
      overall: "99.2%",
      punctuality: "99.5%",
      workingHoursAvg: "42.0 hrs/wk",
      leaveDaysUsed: 9,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Workforce Planning & Headcount Modeling", current: 78, required: 85, gap: 7, severity: "Low", recommendation: "Co-author the 2025 company-wide headcount budgeting model with Finance." }
    ],
    careerPath: {
      currentRole: "Talent Acquisition Lead",
      targetRole: "Director of Talent Acquisition",
      futureRole: "VP of People & Talent",
      readinessPct: 85,
      timeline: "3 Months",
      targetSkills: [
        { name: "Recruiting Excellence", current: 96, required: 90, gap: 0, status: "Ready" },
        { name: "Strategic Headcount Modeling", current: 78, required: 85, gap: 7, status: "Nearly Ready" },
        { name: "Employer Branding", current: 90, required: 85, gap: 0, status: "Ready" }
      ],
      recommendedActions: [
        { title: "Lead 2025 Headcount Allocation Plan", type: "Strategy", impact: "High", timeline: "Oct 2024", desc: "Partner with Executive team on next year's hiring quotas." }
      ]
    },
    aiSummary: {
      overview: "Premier talent acquisition professional who smashed hiring speed and diversity goals while saving hundreds of thousands in agency fees. Ready for Director of Talent Acquisition.",
      explainability: {
        whyThisInsight: "28-day time to hire (vs 45-day benchmark) and 91.5% acceptance rate with 4.8/5.0 manager score.",
        confidenceScore: "95%",
        dataSources: ["Greenhouse ATS Telemetry", "Offer Acceptance Logs", "Finance Agency Spend Records"],
        strengths: ["Fast hiring velocity", "High candidate empathy", "Massive cost savings"],
        risks: ["None; high execution standard"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 96, status: "Exceeded", details: "All 3 core recruiting OKRs surpassed." },
      projectImpact: { score: 94, status: "Very High", details: "Saved $420k in recruitment agency fees." },
      requiredSkills: { score: "9 / 10", status: "Ready", details: "Meets 9 of 10 Director of Talent qualifications." },
      managerFeedback: { score: 96, status: "Strong", details: "Manager calibration 4.8/5.0." },
      trainingCompletion: { score: 94, status: "Completed", details: "Cornell Strategic Workforce certified." },
      businessImpact: { score: 94, status: "Very High", details: "Directly fueled engineering and product capacity growth." }
    }
  },
  {
    id: "EMP-1015",
    name: "Brandon Lee",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Senior Solutions Architect",
    department: "Operations",
    manager: "Sarah Jenkins",
    email: "brandon.lee@zerobugs.corp",
    joinDate: "May 04, 2021",
    location: "Seattle, WA (Remote)",
    performanceScore: 89,
    skillScore: 91,
    promotionReadiness: 82,
    readinessStatus: "Ready",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "Very High",
      summary: "Architected enterprise proof-of-concept integrations for 12 Fortune 500 customers, closing $3.8M in new annual contract value."
    },
    goals: [
      { goal: "Influence $3.5M+ in New Enterprise ARR", target: "$3,500,000", achievement: "$3,820,000", status: "Exceeded", period: "Q3 2024", weight: 40 },
      { goal: "Reduce Enterprise Technical Win Rate Cycle < 21 Days", target: "< 21 Days", achievement: "16.5 Days", status: "Exceeded", period: "Q3 2024", weight: 30 },
      { goal: "Author 5 Enterprise Reference Architectures", target: "5 Architectures", achievement: "5 Architectures", status: "Achieved", period: "Q3 2024", weight: 30 }
    ],
    projects: [
      { name: "Fortune 50 Financial Services Integration Blueprint", role: "Lead Architect", outcome: "Passed stringent multi-cloud security and data segregation audits", businessImpact: "Very High", metric: "Secured $1.6M 3-year enterprise contract", date: "August 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Sarah Jenkins", role: "VP Sponsor", rating: 4.7, comment: "Brandon is a powerhouse in customer-facing technical strategy. Ready for Principal Solutions Architect.", date: "Sep 2024", highlight: "Supreme technical credibility with enterprise buyers" }
    ],
    skills: [
      { name: "Enterprise Solution Architecture", category: "Technical", current: 95, required: 90, gap: 0, status: "Exceeds Requirement" },
      { name: "Executive Technical Sales Alignment", category: "Leadership", current: 92, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Partner Ecosystem Development", category: "Leadership", current: 74, required: 85, gap: 11, status: "Developing" }
    ],
    training: [
      { name: "TOGAF 9.2 Enterprise Architecture Certified", provider: "The Open Group", completionDate: "Jan 2024", status: "Completed", hours: 40, score: "Passed" }
    ],
    attendance: {
      overall: "99.0%",
      punctuality: "99.1%",
      workingHoursAvg: "43.0 hrs/wk",
      leaveDaysUsed: 10,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Partner Ecosystem Development", current: 74, required: 85, gap: 11, severity: "Medium", recommendation: "Build co-sell technical integration with AWS and Azure Marketplace teams." }
    ],
    careerPath: {
      currentRole: "Senior Solutions Architect",
      targetRole: "Principal Solutions Architect",
      futureRole: "VP of Customer Engineering",
      readinessPct: 82,
      timeline: "3-6 Months",
      targetSkills: [
        { name: "Architecture Mastery", current: 95, required: 90, gap: 0, status: "Ready" },
        { name: "Commercial Acumen", current: 92, required: 85, gap: 0, status: "Ready" },
        { name: "Alliance Strategy", current: 74, required: 85, gap: 11, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Lead Hyperscaler Partner Technical Blueprint", type: "Partnerships", impact: "High", timeline: "Q4 2024", desc: "Publish AWS Joint Solutions reference guide." }
      ]
    },
    aiSummary: {
      overview: "Outstanding commercial architect whose technical credibility directly unlocked $3.82M in enterprise deals. High promotion readiness for Principal Solutions Architect.",
      explainability: {
        whyThisInsight: "Strong ARR influence ($3.82M) and 16.5-day technical win cycle, backed by 4.7/5.0 manager calibration.",
        confidenceScore: "94%",
        dataSources: ["Salesforce Opportunity Closed-Won Data", "Customer Technical Win Slates", "Manager Review"],
        strengths: ["High buyer trust", "Rigorous security architecture", "Fast technical validation"],
        risks: ["Partner ecosystem integration could be accelerated"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 94, status: "Exceeded", details: "$3.82M influenced vs $3.5M target." },
      projectImpact: { score: 92, status: "Very High", details: "Uncapped Fortune 50 banking deal worth $1.6M." },
      requiredSkills: { score: "8 / 10", status: "Ready", details: "Meets 8 of 10 Principal Architect standards." },
      managerFeedback: { score: 94, status: "Strong", details: "Manager calibration 4.7/5.0." },
      trainingCompletion: { score: 95, status: "Completed", details: "TOGAF 9.2 certified." },
      businessImpact: { score: 94, status: "Exceptional", details: "Direct top-line revenue driver for enterprise expansion." }
    }
  },
  {
    id: "EMP-1016",
    name: "Sophia Martinez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "Product Operations Analyst",
    department: "Product",
    manager: "Elena Rostova",
    email: "sophia.martinez@zerobugs.corp",
    joinDate: "Sep 01, 2023",
    location: "New York, NY (Hybrid)",
    performanceScore: 82,
    skillScore: 81,
    promotionReadiness: 64,
    readinessStatus: "Developing",
    performanceCategory: "Strong",
    status: "Active",
    businessImpact: {
      rating: "Medium",
      summary: "Standardized customer feedback tagging taxonomy across 4,200 Zendesk tickets, enabling product squads to identify top 5 churn bugs."
    },
    goals: [
      { goal: "Categorize 100% of Incoming Enterprise Feedback Tickets", target: "100%", achievement: "100%", status: "Achieved", period: "Q3 2024", weight: 40 },
      { goal: "Publish Weekly Product Insights Executive Digest", target: "12 Digests", achievement: "12 Digests", status: "Achieved", period: "Q3 2024", weight: 35 },
      { goal: "Automate Weekly Metrics Dashboard in Tableau", target: "Automated", achievement: "Automated", status: "Achieved", period: "Q3 2024", weight: 25 }
    ],
    projects: [
      { name: "Customer Voice Insights Engine", role: "Product Ops Lead", outcome: "Connected customer complaints to engineering Jira tickets automatically", businessImpact: "Medium", metric: "Sped up high-priority bug resolution by 3.2 days", date: "August 2024" }
    ],
    feedback: [
      { type: "Manager", author: "Elena Rostova", role: "Product Manager II", rating: 4.2, comment: "Sophia is diligent, analytical, and highly structured. Ready to take on wider Product Manager or Senior Ops scope with continued mentorship.", date: "Sep 2024", highlight: "High structure and analytical diligence" }
    ],
    skills: [
      { name: "Product Analytics & Tableau", category: "Technical", current: 86, required: 80, gap: 0, status: "Meets Requirement" },
      { name: "User Feedback Categorization", category: "Domain", current: 90, required: 85, gap: 0, status: "Exceeds Requirement" },
      { name: "Product Roadmap Influence", category: "Leadership", current: 62, required: 80, gap: 18, status: "Developing" }
    ],
    training: [
      { name: "Product Analytics Certification", provider: "Mixpanel", completionDate: "Jun 2024", status: "Completed", hours: 18, score: "94%" }
    ],
    attendance: {
      overall: "98.8%",
      punctuality: "99.0%",
      workingHoursAvg: "40.5 hrs/wk",
      leaveDaysUsed: 8,
      leaveDaysTotal: 25
    },
    developmentGaps: [
      { skill: "Product Roadmap Influence", current: 62, required: 80, gap: 18, severity: "Medium", recommendation: "Draft the Q1 product roadmap recommendation for the self-serve workflow." }
    ],
    careerPath: {
      currentRole: "Product Operations Analyst",
      targetRole: "Senior Product Operations Manager",
      futureRole: "Head of Product Operations",
      readinessPct: 64,
      timeline: "6-9 Months",
      targetSkills: [
        { name: "Analytics & Telemetry", current: 86, required: 80, gap: 0, status: "Ready" },
        { name: "Cross-Functional Ops", current: 80, required: 80, gap: 0, status: "Ready" },
        { name: "Strategic Influence", current: 62, required: 80, gap: 18, status: "Developing" }
      ],
      recommendedActions: [
        { title: "Lead Quarterly Product Review Prep", type: "Leadership", impact: "High", timeline: "Oct 2024", desc: "Synthesize all voice-of-customer findings for executive prioritization." }
      ]
    },
    aiSummary: {
      overview: "Dependable analyst who has streamlined product feedback loops and telemetry. Progressing well; building strategic roadmap leadership will prepare her for the Senior level.",
      explainability: {
        whyThisInsight: "Consistent 100% goal delivery and positive manager review (4.2/5.0). Needs to demonstrate independent roadmap influence to cross the promotion threshold.",
        confidenceScore: "89%",
        dataSources: ["Tableau Dashboard Usage", "Zendesk Tagging Logs", "Manager Review"],
        strengths: ["Analytical clarity", "Systematic taxonomy organization", "Dependable delivery"],
        risks: ["Needs greater confidence defending roadmap recommendations to PMs"]
      }
    },
    promotionEvidence: {
      kpiAchievement: { score: 86, status: "Achieved", details: "All 3 product ops OKRs delivered with 100% accuracy." },
      projectImpact: { score: 78, status: "Medium", details: "Cut bug escalation time by 3.2 days." },
      requiredSkills: { score: "6 / 10", status: "Developing", details: "Meets 6 of 10 Senior Ops competencies." },
      managerFeedback: { score: 84, status: "Strong", details: "Manager calibration 4.2/5.0." },
      trainingCompletion: { score: 88, status: "Completed", details: "Mixpanel Product Analytics certified." },
      businessImpact: { score: 80, status: "Medium", details: "Empowered 6 product squads with clean VoC data." }
    }
  }
];

// Company-wide KPI Aggregate Data
export const companyStats = {
  totalEmployees: 248,
  averagePerformance: 82.4,
  performanceChange: "+3.2%",
  promotionReady: 31,
  promotionReadyChange: "+6",
  developmentGaps: 47,
  developmentGapsChange: "-12",
  trainingCompletion: 86,
  trainingCompletionChange: "+5.4%",
  activeReviewCycle: "Q3 2024 Performance Calibration",
  lastCalibrationUpdate: "September 28, 2024"
};

// Historical Monthly Performance Trend (for Recharts)
export const performanceTrendData = [
  { month: "Jan", engineering: 79.2, product: 81.0, design: 83.5, operations: 78.4, overall: 80.2 },
  { month: "Feb", engineering: 80.5, product: 81.8, design: 84.0, operations: 79.1, overall: 81.1 },
  { month: "Mar", engineering: 81.1, product: 82.4, design: 85.2, operations: 80.0, overall: 81.8 },
  { month: "Apr", engineering: 82.0, product: 83.1, design: 86.0, operations: 80.8, overall: 82.5 },
  { month: "May", engineering: 81.4, product: 82.6, design: 86.8, operations: 80.2, overall: 82.0 },
  { month: "Jun", engineering: 83.2, product: 84.5, design: 87.5, operations: 81.4, overall: 83.6 },
  { month: "Jul", engineering: 82.8, product: 85.0, design: 88.0, operations: 82.0, overall: 83.8 },
  { month: "Aug", engineering: 83.9, product: 85.8, design: 89.2, operations: 82.9, overall: 84.7 },
  { month: "Sep", engineering: 84.6, product: 86.4, design: 90.1, operations: 83.5, overall: 85.4 }
];

// Performance Distribution
export const performanceDistribution = [
  { name: "Exceptional (90-100%)", count: 54, percentage: 22, color: "#10b981", badge: "Exceptional" },
  { name: "Strong (80-89%)", count: 134, percentage: 54, color: "#4f46e5", badge: "Strong" },
  { name: "Developing (70-79%)", count: 45, percentage: 18, color: "#f59e0b", badge: "Developing" },
  { name: "Needs Attention (<70%)", count: 15, percentage: 6, color: "#ef4444", badge: "Needs Attention" }
];

// Most Common Skill Gaps across Organization
export const commonSkillGaps = [
  { skill: "Leadership & People Management", count: 32, avgGap: 18, department: "Engineering & Product", severity: "High" },
  { skill: "Strategic Technical Roadmapping", count: 24, avgGap: 16, department: "Engineering", severity: "Medium" },
  { skill: "Financial & Unit Economics Modeling", count: 18, avgGap: 21, department: "Product & Operations", severity: "High" },
  { skill: "Cross-Functional Dependency Alignment", count: 16, avgGap: 14, department: "All Departments", severity: "Medium" },
  { skill: "Cloud FinOps & Infrastructure Cost", count: 14, avgGap: 15, department: "Engineering", severity: "Low" },
  { skill: "Executive Stakeholder Storytelling", count: 12, avgGap: 12, department: "Design & Data", severity: "Medium" }
];

// Promotion Readiness Distribution
export const promotionReadinessDistribution = [
  { status: "Ready", count: 31, percentage: 12.5, color: "#10b981", description: "Demonstrates consistent mastery across 80%+ competencies with solid KPI delivery." },
  { status: "Nearly Ready", count: 74, percentage: 29.8, color: "#6366f1", description: "Meets primary delivery standards; 1-2 addressable skill or leadership gaps remain." },
  { status: "Developing", count: 143, percentage: 57.7, color: "#94a3b8", description: "Currently focused on foundational leveling or newly onboarded within 12 months." }
];

// Explainable AI Insights for Dashboard
export const dashboardAIInsights = [
  {
    id: "ai-1",
    title: "12 engineers exceed KPI delivery but require leadership development before target Staff roles",
    summary: "High individual execution scores (avg 92.4%) contrast with lower scores in cross-org strategic roadmapping (avg 66.8%).",
    confidence: "94%",
    evidenceCount: "12 Profiles Analyzed",
    evidence: [
      "Average technical goal attainment: 98.2%",
      "Average strategic roadmapping proficiency: 66.8% vs 85% requirement",
      "Recommending enrollment in Q4 Cross-Functional Tech Leadership cohort"
    ],
    category: "Promotion Bottleneck",
    severity: "warning"
  },
  {
    id: "ai-2",
    title: "31 promotion-ready candidates supported by verified multi-quarter evidence",
    summary: "Candidates meet or exceed 85%+ competency thresholds with confirmed business impact ($14.2M combined value).",
    confidence: "96%",
    evidenceCount: "31 Candidates",
    evidence: [
      "100% have completed required enterprise compliance and skill milestones",
      "Average manager calibration rating of 4.74 / 5.0",
      "Zero unaddressed critical development flags"
    ],
    category: "Talent Mobility",
    severity: "success"
  },
  {
    id: "ai-3",
    title: "Noticeable variation in evaluation distribution across department managers",
    summary: "Manager calibration variance detected: Engineering leads grade with 0.42 higher strictness compared to Operations teams.",
    confidence: "91%",
    evidenceCount: "5 Managers Evaluated",
    evidence: [
      "Manager B (Data) average score: 3.6 / 5.0 vs Manager A (Eng) 4.4 / 5.0",
      "Contextual factors include team seniority and high percentage of newly onboarded squads",
      "Neutral HR calibration session recommended to align rubric expectations"
    ],
    category: "Calibration Signal",
    severity: "info"
  },
  {
    id: "ai-4",
    title: "Training completion directly correlates with 14% faster promotion velocity",
    summary: "Employees completing 40+ annual L&D hours achieve promotion benchmarks 4.2 months earlier on average.",
    confidence: "93%",
    evidenceCount: "248 Records",
    evidence: [
      "LMS completion rate at 86% (+5.4% YoY)",
      "High correlation (r=0.78) between course completion and subsequent quarterly project impact scores",
      "Recommend expanding specialized Cloud and Reforge subscriptions"
    ],
    category: "L&D Impact",
    severity: "success"
  }
];

// Manager Calibration Profiles
export const managerCalibrationData = [
  {
    managerId: "MGR-001",
    managerName: "Sarah Jenkins",
    role: "VP of Product",
    department: "Product",
    teamSize: 18,
    averageRating: 4.4,
    benchmarkDifference: "+0.3",
    distribution: { exceptional: 44, strong: 50, developing: 6, needsAttention: 0 },
    varianceSignal: "Moderate",
    varianceLabel: "Slightly Lenient / Growth Focused",
    contextNote: "Team includes established senior product leads who recently delivered core company revenue targets ($29.4M ARR).",
    lastReviewed: "Sep 26, 2024"
  },
  {
    managerId: "MGR-002",
    managerName: "David Kim",
    role: "Engineering Manager (Data)",
    department: "Data & AI",
    teamSize: 14,
    averageRating: 3.6,
    benchmarkDifference: "-0.5",
    distribution: { exceptional: 14, strong: 64, developing: 22, needsAttention: 0 },
    varianceSignal: "Strict",
    varianceLabel: "Strict / High Standard",
    contextNote: "Evaluated strictly around recent Airflow migration timeline delays; 3 team members are new hires in ramping phase.",
    lastReviewed: "Sep 25, 2024"
  },
  {
    managerId: "MGR-003",
    managerName: "Elena Rostova",
    role: "Product Manager II (Pod Lead)",
    department: "Product",
    teamSize: 16,
    averageRating: 4.1,
    benchmarkDifference: "0.0",
    distribution: { exceptional: 31, strong: 63, developing: 6, needsAttention: 0 },
    varianceSignal: "Balanced",
    varianceLabel: "Balanced / Calibrated",
    contextNote: "Normal distribution mirroring cross-company benchmarks closely.",
    lastReviewed: "Sep 27, 2024"
  },
  {
    managerId: "MGR-004",
    managerName: "Marcus Vance",
    role: "Engineering Director",
    department: "Engineering",
    teamSize: 20,
    averageRating: 4.3,
    benchmarkDifference: "+0.2",
    distribution: { exceptional: 40, strong: 55, developing: 5, needsAttention: 0 },
    varianceSignal: "Balanced",
    varianceLabel: "Balanced / Calibrated",
    contextNote: "Senior technical team with multiple high-performing Staff and Lead level contributors.",
    lastReviewed: "Sep 28, 2024"
  },
  {
    managerId: "MGR-005",
    managerName: "David Miller",
    role: "Head of Design",
    department: "Design",
    teamSize: 12,
    averageRating: 4.2,
    benchmarkDifference: "+0.1",
    distribution: { exceptional: 33, strong: 58, developing: 9, needsAttention: 0 },
    varianceSignal: "Balanced",
    varianceLabel: "Balanced / Calibrated",
    contextNote: "Consistent ratings backed by measurable usability SUS benchmarking and design token adoption metrics.",
    lastReviewed: "Sep 24, 2024"
  }
];

// Department Comparisons for Performance Analytics
export const departmentPerformanceData = [
  { department: "Engineering", avgScore: 84.6, goalCompletion: 92, retentionRate: 96, teamCount: 98, budgetEfficiency: 94 },
  { department: "Product", avgScore: 86.4, goalCompletion: 94, retentionRate: 95, teamCount: 42, budgetEfficiency: 91 },
  { department: "Design", avgScore: 90.1, goalCompletion: 96, retentionRate: 98, teamCount: 24, budgetEfficiency: 95 },
  { department: "Data & AI", avgScore: 82.8, goalCompletion: 87, retentionRate: 92, teamCount: 38, budgetEfficiency: 88 },
  { department: "Operations", avgScore: 83.5, goalCompletion: 91, retentionRate: 94, teamCount: 46, budgetEfficiency: 93 }
];
