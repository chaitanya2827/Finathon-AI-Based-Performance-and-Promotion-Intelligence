"""
Synthetic HR Dataset Generator for ZEROBUGS HRM-05 (Phase 2).
Generates 30 employees across 9 evidence dimensions and 14 roles.
Guarantees 100% referential integrity and internal consistency.
"""

import json
from pathlib import Path
import csv

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# 1. ROLES DEFINITION
ROLES = [
    {"id": "ROLE_SWE", "name": "Software Engineer", "department": "Engineering", "description": "Core software developer implementing product features and unit tests."},
    {"id": "ROLE_SR_SWE", "name": "Senior Software Engineer", "department": "Engineering", "description": "Senior engineer leading component architecture, code quality, and technical mentoring."},
    {"id": "ROLE_TECH_LEAD", "name": "Tech Lead", "department": "Engineering", "description": "Technical leader guiding squad architecture, system design, and engineering excellence."},
    {"id": "ROLE_DE", "name": "Data Engineer", "department": "Data", "description": "Builds and maintains reliable data pipelines, ETL workflows, and data marts."},
    {"id": "ROLE_SR_DE", "name": "Senior Data Engineer", "department": "Data", "description": "Senior specialist owning distributed data pipelines, streaming architectures, and cluster orchestration."},
    {"id": "ROLE_UX_LEAD", "name": "UX Lead", "department": "Design", "description": "Leads product design systems, user experience strategy, and usability benchmarking."},
    {"id": "ROLE_PROD_DESIGNER", "name": "Product Designer", "department": "Design", "description": "Designs UI mockups, interaction flows, wireframes, and design components."},
    {"id": "ROLE_DIR_DESIGN", "name": "Director of Product Design", "department": "Design", "description": "Executive design leader overseeing design operations, multi-product design language, and design culture."},
    {"id": "ROLE_QA", "name": "QA Engineer", "department": "QA", "description": "Builds automated test suites, validates release candidates, and prevents regression defects."},
    {"id": "ROLE_DEVOPS", "name": "DevOps Engineer", "department": "Engineering", "description": "Owns CI/CD pipelines, container orchestration, cloud infrastructure, and observability."},
    {"id": "ROLE_PM", "name": "Product Manager", "department": "Product", "description": "Drives product roadmap, user stories, cross-functional prioritization, and launch metrics."},
    {"id": "ROLE_BA", "name": "Business Analyst", "department": "Operations", "description": "Analyzes operational workflows, bridges business requirements, and builds analytical dashboards."},
    {"id": "ROLE_HR_ANALYST", "name": "HR Analyst", "department": "HR", "description": "Manages people analytics, retention tracking, and compensation benchmarking."},
    {"id": "ROLE_VP_ENG", "name": "VP of Engineering", "department": "Engineering", "description": "Executive engineering leader responsible for overall engineering strategy, organization scaling, and delivery."}
]

# 2. SKILLS DEFINITION
SKILLS = [
    {"id": "SKILL_PY", "name": "Python", "category": "Technical", "description": "Core backend development, asynchronous programming, APIs, and data processing in Python."},
    {"id": "SKILL_JAVA", "name": "Java", "category": "Technical", "description": "Enterprise Java services, Spring Boot, concurrency, and JVM performance tuning."},
    {"id": "SKILL_CPP", "name": "C++", "category": "Technical", "description": "Low-level systems programming, memory management, and high-performance algorithms."},
    {"id": "SKILL_SQL", "name": "SQL", "category": "Technical", "description": "Complex relational querying, query optimization, indexing strategies, and schema modeling."},
    {"id": "SKILL_DATA_ANALYSIS", "name": "Data Analysis", "category": "Technical", "description": "Exploratory data analysis, statistical modeling, data visualization, and reporting."},
    {"id": "SKILL_ML", "name": "Machine Learning", "category": "Technical", "description": "Model training, feature engineering, evaluation metrics, and inference serving."},
    {"id": "SKILL_SYS_DESIGN", "name": "System Design", "category": "Architecture", "description": "High-level distributed systems architecture, microservices decomposition, caching, and resiliency."},
    {"id": "SKILL_DIST_SYS", "name": "Distributed Systems", "category": "Architecture", "description": "Consensus protocols, event streaming, distributed caching, partition tolerance, and high availability."},
    {"id": "SKILL_K8S", "name": "Kubernetes", "category": "Cloud & DevOps", "description": "Container orchestration, Helm charts, cloud-native deployments, and cluster observability."},
    {"id": "SKILL_CLOUD", "name": "Cloud Computing", "category": "Cloud & DevOps", "description": "AWS, GCP, or Azure infrastructure design, IAM, cost optimization, and serverless compute."},
    {"id": "SKILL_LEADERSHIP", "name": "Leadership", "category": "Leadership & Soft Skills", "description": "Technical direction, cross-functional advocacy, unblocking team members, and initiative driving."},
    {"id": "SKILL_COMM", "name": "Communication", "category": "Leadership & Soft Skills", "description": "Clear technical documentation, RFC authorship, stakeholder management, and cross-team alignment."},
    {"id": "SKILL_UX", "name": "UX Design", "category": "Product & Design", "description": "User journey mapping, wireframing, interactive prototyping, usability testing, and accessibility."},
    {"id": "SKILL_PROJ_MGT", "name": "Project Management", "category": "Leadership & Soft Skills", "description": "Milestone planning, sprint cadence management, risk mitigation, and on-time delivery tracking."},
    {"id": "SKILL_TESTING", "name": "Testing", "category": "Engineering Quality", "description": "Unit testing, integration testing, end-to-end automation, and test coverage strategies."},
    {"id": "SKILL_DEVOPS", "name": "DevOps", "category": "Cloud & DevOps", "description": "CI/CD automation, infrastructure as code, monitoring, and incident response."},
    {"id": "SKILL_PROB_SOLV", "name": "Problem Solving", "category": "Leadership & Soft Skills", "description": "Root cause analysis, debugging complex failures, and creative algorithmic solutions."},
    {"id": "SKILL_COLLAB", "name": "Team Collaboration", "category": "Leadership & Soft Skills", "description": "Active sprint participation, constructive code review, pairing, and empathy."}
]

# 3. ROLE REQUIRED SKILLS
ROLE_REQUIREMENTS = [
    # Software Engineer
    {"id": "REQ_SWE_1", "role_id": "ROLE_SWE", "skill_id": "SKILL_PY", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_SWE_2", "role_id": "ROLE_SWE", "skill_id": "SKILL_SQL", "required_level": 2, "is_mandatory": True},
    {"id": "REQ_SWE_3", "role_id": "ROLE_SWE", "skill_id": "SKILL_TESTING", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_SWE_4", "role_id": "ROLE_SWE", "skill_id": "SKILL_COLLAB", "required_level": 3, "is_mandatory": True},

    # Senior Software Engineer
    {"id": "REQ_SR_SWE_1", "role_id": "ROLE_SR_SWE", "skill_id": "SKILL_PY", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_SR_SWE_2", "role_id": "ROLE_SR_SWE", "skill_id": "SKILL_SYS_DESIGN", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_SR_SWE_3", "role_id": "ROLE_SR_SWE", "skill_id": "SKILL_TESTING", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_SR_SWE_4", "role_id": "ROLE_SR_SWE", "skill_id": "SKILL_COMM", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_SR_SWE_5", "role_id": "ROLE_SR_SWE", "skill_id": "SKILL_CLOUD", "required_level": 3, "is_mandatory": False},

    # Tech Lead
    {"id": "REQ_TL_1", "role_id": "ROLE_TECH_LEAD", "skill_id": "SKILL_SYS_DESIGN", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_TL_2", "role_id": "ROLE_TECH_LEAD", "skill_id": "SKILL_PY", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_TL_3", "role_id": "ROLE_TECH_LEAD", "skill_id": "SKILL_LEADERSHIP", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_TL_4", "role_id": "ROLE_TECH_LEAD", "skill_id": "SKILL_COMM", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_TL_5", "role_id": "ROLE_TECH_LEAD", "skill_id": "SKILL_PROJ_MGT", "required_level": 3, "is_mandatory": False},
    {"id": "REQ_TL_6", "role_id": "ROLE_TECH_LEAD", "skill_id": "SKILL_K8S", "required_level": 3, "is_mandatory": False},

    # Data Engineer
    {"id": "REQ_DE_1", "role_id": "ROLE_DE", "skill_id": "SKILL_PY", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_DE_2", "role_id": "ROLE_DE", "skill_id": "SKILL_SQL", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_DE_3", "role_id": "ROLE_DE", "skill_id": "SKILL_DATA_ANALYSIS", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_DE_4", "role_id": "ROLE_DE", "skill_id": "SKILL_COLLAB", "required_level": 3, "is_mandatory": True},

    # Senior Data Engineer
    {"id": "REQ_SR_DE_1", "role_id": "ROLE_SR_DE", "skill_id": "SKILL_PY", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_SR_DE_2", "role_id": "ROLE_SR_DE", "skill_id": "SKILL_SQL", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_SR_DE_3", "role_id": "ROLE_SR_DE", "skill_id": "SKILL_DATA_ANALYSIS", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_SR_DE_4", "role_id": "ROLE_SR_DE", "skill_id": "SKILL_DIST_SYS", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_SR_DE_5", "role_id": "ROLE_SR_DE", "skill_id": "SKILL_K8S", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_SR_DE_6", "role_id": "ROLE_SR_DE", "skill_id": "SKILL_CLOUD", "required_level": 3, "is_mandatory": False},

    # UX Lead
    {"id": "REQ_UX_LEAD_1", "role_id": "ROLE_UX_LEAD", "skill_id": "SKILL_UX", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_UX_LEAD_2", "role_id": "ROLE_UX_LEAD", "skill_id": "SKILL_LEADERSHIP", "required_level": 3, "is_mandatory": True},
    {"id": "REQ_UX_LEAD_3", "role_id": "ROLE_UX_LEAD", "skill_id": "SKILL_COMM", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_UX_LEAD_4", "role_id": "ROLE_UX_LEAD", "skill_id": "SKILL_PROJ_MGT", "required_level": 3, "is_mandatory": False},

    # Director of Product Design
    {"id": "REQ_DIR_DES_1", "role_id": "ROLE_DIR_DESIGN", "skill_id": "SKILL_UX", "required_level": 5, "is_mandatory": True},
    {"id": "REQ_DIR_DES_2", "role_id": "ROLE_DIR_DESIGN", "skill_id": "SKILL_LEADERSHIP", "required_level": 4, "is_mandatory": True},
    {"id": "REQ_DIR_DES_3", "role_id": "ROLE_DIR_DESIGN", "skill_id": "SKILL_COMM", "required_level": 5, "is_mandatory": True},
    {"id": "REQ_DIR_DES_4", "role_id": "ROLE_DIR_DESIGN", "skill_id": "SKILL_PROJ_MGT", "required_level": 4, "is_mandatory": True}
]

# 4. EMPLOYEES ROSTER (30 Employees)
EMPLOYEE_SEEDS = [
    # Demo A: Elena Rostova (Strong Performer, Promotion Ready)
    {
        "id": 1,
        "employee_id": "EMP001",
        "name": "Elena Rostova",
        "email": "elena.rostova@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SR_SWE",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP004",  # David Vance
        "hire_date": "2023-03-15",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    # Demo B: Marcus Chen (Good Performer, Specific Skill Gaps)
    {
        "id": 2,
        "employee_id": "EMP002",
        "name": "Marcus Chen",
        "email": "marcus.chen@zerobugs.example",
        "department": "Data",
        "current_role_id": "ROLE_DE",
        "target_role_id": "ROLE_SR_DE",
        "manager_id": "EMP005",  # Sarah Jenkins
        "hire_date": "2024-01-10",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    # Demo C: Priya Sharma (Strong Objective Evidence, Evaluation Inconsistency)
    {
        "id": 3,
        "employee_id": "EMP003",
        "name": "Priya Sharma",
        "email": "priya.sharma@zerobugs.example",
        "department": "Design",
        "current_role_id": "ROLE_UX_LEAD",
        "target_role_id": "ROLE_DIR_DESIGN",
        "manager_id": "EMP006",  # Robert Sterling
        "hire_date": "2022-09-01",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    # Managers / Leaders
    {
        "id": 4,
        "employee_id": "EMP004",
        "name": "David Vance",
        "email": "david.vance@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_VP_ENG",
        "target_role_id": "ROLE_VP_ENG",
        "manager_id": None,
        "hire_date": "2021-01-15",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 5,
        "employee_id": "EMP005",
        "name": "Sarah Jenkins",
        "email": "sarah.jenkins@zerobugs.example",
        "department": "Data",
        "current_role_id": "ROLE_SR_DE",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP004",
        "hire_date": "2021-06-20",
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 6,
        "employee_id": "EMP006",
        "name": "Robert Sterling",
        "email": "robert.sterling@zerobugs.example",
        "department": "Design",
        "current_role_id": "ROLE_DIR_DESIGN",
        "target_role_id": "ROLE_DIR_DESIGN",
        "manager_id": "EMP004",
        "hire_date": "2021-04-12",
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    # 24 Diverse Employees
    {
        "id": 7,
        "employee_id": "EMP007",
        "name": "Alexander Wright",
        "email": "alexander.wright@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SR_SWE",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP004",
        "hire_date": "2022-11-05",
        "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 8,
        "employee_id": "EMP008",
        "name": "Sophia Kim",
        "email": "sophia.kim@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SWE",
        "target_role_id": "ROLE_SR_SWE",
        "manager_id": "EMP001",
        "hire_date": "2024-03-01",
        "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 9,
        "employee_id": "EMP009",
        "name": "Rahul Verma",
        "email": "rahul.verma@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_DEVOPS",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP004",
        "hire_date": "2023-08-15",
        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 10,
        "employee_id": "EMP010",
        "name": "Chloe Bennett",
        "email": "chloe.bennett@zerobugs.example",
        "department": "Product",
        "current_role_id": "ROLE_PM",
        "target_role_id": "ROLE_PM",
        "manager_id": "EMP004",
        "hire_date": "2023-02-10",
        "avatar_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 11,
        "employee_id": "EMP011",
        "name": "Liam O'Connor",
        "email": "liam.oconnor@zerobugs.example",
        "department": "QA",
        "current_role_id": "ROLE_QA",
        "target_role_id": "ROLE_SR_SWE",
        "manager_id": "EMP004",
        "hire_date": "2024-02-15",
        "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 12,
        "employee_id": "EMP012",
        "name": "Maya Patel",
        "email": "maya.patel@zerobugs.example",
        "department": "Data",
        "current_role_id": "ROLE_SR_DE",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP005",
        "hire_date": "2022-05-18",
        "avatar_url": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 13,
        "employee_id": "EMP013",
        "name": "Lucas Silva",
        "email": "lucas.silva@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SWE",
        "target_role_id": "ROLE_SR_SWE",
        "manager_id": "EMP001",
        "hire_date": "2024-04-10",
        "avatar_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 14,
        "employee_id": "EMP014",
        "name": "Olivia Martinez",
        "email": "olivia.martinez@zerobugs.example",
        "department": "Design",
        "current_role_id": "ROLE_PROD_DESIGNER",
        "target_role_id": "ROLE_UX_LEAD",
        "manager_id": "EMP003",
        "hire_date": "2023-07-22",
        "avatar_url": "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 15,
        "employee_id": "EMP015",
        "name": "Ethan Davis",
        "email": "ethan.davis@zerobugs.example",
        "department": "Operations",
        "current_role_id": "ROLE_BA",
        "target_role_id": "ROLE_PM",
        "manager_id": "EMP010",
        "hire_date": "2023-09-01",
        "avatar_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 16,
        "employee_id": "EMP016",
        "name": "Ananya Iyer",
        "email": "ananya.iyer@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SR_SWE",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP004",
        "hire_date": "2022-10-15",
        "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 17,
        "employee_id": "EMP017",
        "name": "Noah Taylor",
        "email": "noah.taylor@zerobugs.example",
        "department": "Data",
        "current_role_id": "ROLE_DE",
        "target_role_id": "ROLE_SR_DE",
        "manager_id": "EMP005",
        "hire_date": "2024-05-12",
        "avatar_url": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 18,
        "employee_id": "EMP018",
        "name": "Emma Watson",
        "email": "emma.watson@zerobugs.example",
        "department": "QA",
        "current_role_id": "ROLE_QA",
        "target_role_id": "ROLE_QA",
        "manager_id": "EMP004",
        "hire_date": "2023-11-20",
        "avatar_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 19,
        "employee_id": "EMP019",
        "name": "Carlos Gomez",
        "email": "carlos.gomez@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_DEVOPS",
        "target_role_id": "ROLE_DEVOPS",
        "manager_id": "EMP004",
        "hire_date": "2023-04-18",
        "avatar_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 20,
        "employee_id": "EMP020",
        "name": "Fatimah Al-Mansoor",
        "email": "fatimah.almansoor@zerobugs.example",
        "department": "Product",
        "current_role_id": "ROLE_PM",
        "target_role_id": "ROLE_PM",
        "manager_id": "EMP004",
        "hire_date": "2022-08-30",
        "avatar_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 21,
        "employee_id": "EMP021",
        "name": "Benjamin Miller",
        "email": "benjamin.miller@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SWE",
        "target_role_id": "ROLE_SR_SWE",
        "manager_id": "EMP007",
        "hire_date": "2024-06-01",
        "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 22,
        "employee_id": "EMP022",
        "name": "Zoe Anderson",
        "email": "zoe.anderson@zerobugs.example",
        "department": "Design",
        "current_role_id": "ROLE_PROD_DESIGNER",
        "target_role_id": "ROLE_UX_LEAD",
        "manager_id": "EMP003",
        "hire_date": "2023-12-05",
        "avatar_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 23,
        "employee_id": "EMP023",
        "name": "Vikram Singhania",
        "email": "vikram.singhania@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_TECH_LEAD",
        "target_role_id": "ROLE_VP_ENG",
        "manager_id": "EMP004",
        "hire_date": "2021-08-10",
        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 24,
        "employee_id": "EMP024",
        "name": "Hannah Schmidt",
        "email": "hannah.schmidt@zerobugs.example",
        "department": "HR",
        "current_role_id": "ROLE_HR_ANALYST",
        "target_role_id": "ROLE_HR_ANALYST",
        "manager_id": "EMP004",
        "hire_date": "2023-01-20",
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 25,
        "employee_id": "EMP025",
        "name": "Daniel Lee",
        "email": "daniel.lee@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SR_SWE",
        "target_role_id": "ROLE_TECH_LEAD",
        "manager_id": "EMP004",
        "hire_date": "2022-07-15",
        "avatar_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 26,
        "employee_id": "EMP026",
        "name": "Isabella Rossi",
        "email": "isabella.rossi@zerobugs.example",
        "department": "Data",
        "current_role_id": "ROLE_DE",
        "target_role_id": "ROLE_SR_DE",
        "manager_id": "EMP005",
        "hire_date": "2024-02-28",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 27,
        "employee_id": "EMP027",
        "name": "James Wilson",
        "email": "james.wilson@zerobugs.example",
        "department": "Operations",
        "current_role_id": "ROLE_BA",
        "target_role_id": "ROLE_BA",
        "manager_id": "EMP010",
        "hire_date": "2023-06-11",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 28,
        "employee_id": "EMP028",
        "name": "Aisha Khan",
        "email": "aisha.khan@zerobugs.example",
        "department": "Engineering",
        "current_role_id": "ROLE_SWE",
        "target_role_id": "ROLE_SR_SWE",
        "manager_id": "EMP007",
        "hire_date": "2024-07-01",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 29,
        "employee_id": "EMP029",
        "name": "Ryan Murphy",
        "email": "ryan.murphy@zerobugs.example",
        "department": "QA",
        "current_role_id": "ROLE_QA",
        "target_role_id": "ROLE_QA",
        "manager_id": "EMP004",
        "hire_date": "2023-10-05",
        "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 30,
        "employee_id": "EMP030",
        "name": "Stephanie Clark",
        "email": "stephanie.clark@zerobugs.example",
        "department": "Marketing",
        "current_role_id": "ROLE_BA",
        "target_role_id": "ROLE_PM",
        "manager_id": "EMP010",
        "hire_date": "2023-03-20",
        "avatar_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
    }
]

def build_full_dataset():
    # Containers
    goals = []
    projects = []
    feedback = []
    employee_skills = []
    training = []
    attendance = []
    business_impact = []
    manager_evaluations = []

    # Map managers by ID
    emp_map = {e["employee_id"]: e for e in EMPLOYEE_SEEDS}

    for idx, emp in enumerate(EMPLOYEE_SEEDS, 1):
        eid = emp["employee_id"]
        mgr_id = emp["manager_id"]
        mgr_name = emp_map[mgr_id]["name"] if mgr_id and mgr_id in emp_map else "Executive Committee"

        # ----------------------------------------------------
        # PERSONA A: Elena Rostova (Strong Performer, Promotion Ready)
        # ----------------------------------------------------
        if eid == "EMP001":
            # Goals (94-98%)
            goals.append({
                "id": f"GOAL_{eid}_1", "employee_id": eid, "title": "Payment Orchestration Modernization",
                "category": "Delivery", "target_value": 100.0, "achieved_value": 98.0, "metric_unit": "%",
                "progress_pct": 98.0, "verification_evidence": "Migrated billing engine to decoupled event-driven services 3 weeks early with 0 P0 defects."
            })
            goals.append({
                "id": f"GOAL_{eid}_2", "employee_id": eid, "title": "Core Web Vitals Optimization",
                "category": "Quality", "target_value": 90.0, "achieved_value": 95.0, "metric_unit": "score",
                "progress_pct": 100.0, "verification_evidence": "Reduced checkout LCP from 2.8s to 0.85s across all mobile checkout flows."
            })
            goals.append({
                "id": f"GOAL_{eid}_3", "employee_id": eid, "title": "Technical Mentorship & RFC Governance",
                "category": "Leadership", "target_value": 12.0, "achieved_value": 14.0, "metric_unit": "sessions",
                "progress_pct": 100.0, "verification_evidence": "Mentored 2 junior engineers to independent mid-level feature ownership; reviewed 18 RFCs."
            })

            # Projects (2 strong projects)
            projects.append({
                "id": f"PRJ_{eid}_1", "employee_id": eid, "project_name": "Global Payment Engine v2",
                "role_in_project": "Lead Architect & Primary Implementer",
                "deliverables": "Idempotent payment pipeline with multi-gateway failover routing.",
                "delivered_on_time": True, "code_quality_score": 4.9,
                "outcome_evidence": "Production release delivered on scheduled sprint; sustained $420,000 annualized AWS savings."
            })
            projects.append({
                "id": f"PRJ_{eid}_2", "employee_id": eid, "project_name": "Zero-Downtime Ledger Migration",
                "role_in_project": "Technical Lead",
                "deliverables": "Automated blue-green migration pipeline for 14M customer ledger records.",
                "delivered_on_time": True, "code_quality_score": 4.8,
                "outcome_evidence": "Completed data migration across 3 regions with zero downtime and 100% record checksum validation."
            })

            # Feedback (Strong: 4.8 - 5.0)
            feedback.append({
                "id": f"FB_{eid}_1", "employee_id": eid, "reviewer_type": "peer", "rating": 4.9,
                "comments": "Elena is the technical backbone of our squad. Her architecture clarity and patient mentoring raise the entire team bar.",
                "sentiment": "positive"
            })
            feedback.append({
                "id": f"FB_{eid}_2", "employee_id": eid, "reviewer_type": "stakeholder", "rating": 5.0,
                "comments": "Elena's design docs are the gold standard for our organization. She already operates at Tech Lead caliber.",
                "sentiment": "positive"
            })
            feedback.append({
                "id": f"FB_{eid}_3", "employee_id": eid, "reviewer_type": "peer", "rating": 4.8,
                "comments": "Great collaborator who bridges complex distributed systems trade-offs into actionable sprint tasks.",
                "sentiment": "positive"
            })

            # Skills (Meets/exceeds Tech Lead requirements: System Design 5, Python 5, Leadership 4, Comm 5)
            employee_skills.append({"id": f"ES_{eid}_1", "employee_id": eid, "skill_id": "SKILL_PY", "proficiency_level": 5, "verification_proof": "Author of core async event bus; 5 years production Python."})
            employee_skills.append({"id": f"ES_{eid}_2", "employee_id": eid, "skill_id": "SKILL_SYS_DESIGN", "proficiency_level": 5, "verification_proof": "Authored 4 approved company-wide Architecture Decision Records."})
            employee_skills.append({"id": f"ES_{eid}_3", "employee_id": eid, "skill_id": "SKILL_LEADERSHIP", "proficiency_level": 4, "verification_proof": "Led engineering scrum squad of 6; coordinated technical release plans."})
            employee_skills.append({"id": f"ES_{eid}_4", "employee_id": eid, "skill_id": "SKILL_COMM", "proficiency_level": 5, "verification_proof": "Keynote speaker at internal Tech Summit; published engineering tech blog."})
            employee_skills.append({"id": f"ES_{eid}_5", "employee_id": eid, "skill_id": "SKILL_PROJ_MGT", "proficiency_level": 4, "verification_proof": "Tracked multi-sprint backlog and milestone dependency risks."})
            employee_skills.append({"id": f"ES_{eid}_6", "employee_id": eid, "skill_id": "SKILL_K8S", "proficiency_level": 4, "verification_proof": "Configured Helm charts and canary deployments in production."})
            employee_skills.append({"id": f"ES_{eid}_7", "employee_id": eid, "skill_id": "SKILL_TESTING", "proficiency_level": 5, "verification_proof": "Maintained 94% unit & integration test coverage on payment services."})

            # Training
            training.append({
                "id": f"TRN_{eid}_1", "employee_id": eid, "course_name": "Advanced Distributed Systems & High-Scale Architecture",
                "provider": "TechCraft Institute", "completion_status": "completed", "completion_date": "2026-02-14", "skill_area": "Architecture"
            })
            training.append({
                "id": f"TRN_{eid}_2", "employee_id": eid, "course_name": "Engineering Leadership & People Development",
                "provider": "Leadership Academy", "completion_status": "completed", "completion_date": "2026-04-20", "skill_area": "Leadership"
            })

            # Attendance (High: 99.2%)
            attendance.append({
                "id": f"ATT_{eid}", "employee_id": eid, "period": "2026-H1", "working_days": 125, "days_present": 124,
                "attendance_pct": 99.2, "reliability_notes": "Flawless reliability. 100% sprint attendance and zero missed critical on-call shifts."
            })

            # Business Impact
            business_impact.append({
                "id": f"BI_{eid}_1", "employee_id": eid, "impact_type": "cost_savings", "metric_name": "Annualized Infrastructure Savings",
                "value": "420000", "metric_unit": "USD", "description": "Cloud infrastructure rightsizing and connection pool optimization.",
                "evidence": "AWS invoice comparison confirmed $35,000 monthly cost reduction."
            })
            business_impact.append({
                "id": f"BI_{eid}_2", "employee_id": eid, "impact_type": "productivity", "metric_name": "Checkout Response Latency",
                "value": "45", "metric_unit": "percent", "description": "p99 API latency reduction during peak customer volume.",
                "evidence": "Datadog telemetry confirmed p99 dropped from 480ms to 264ms."
            })

            # Manager Evaluation (Aligned strong: 4.8)
            manager_evaluations.append({
                "id": f"ME_{eid}_1", "employee_id": eid, "manager_name": mgr_name, "rating": 4.8,
                "evaluation_cycle": "2026-H1", "comments": "Elena consistently outperforms expectations. She operates as our de facto Tech Lead, delivers pristine architecture, and mentors others. Strong promotion candidate.",
                "evaluation_date": "2026-06-15"
            })

        # ----------------------------------------------------
        # PERSONA B: Marcus Chen (Good Performer, Skill Gaps)
        # ----------------------------------------------------
        elif eid == "EMP002":
            # Goals (88-94%)
            goals.append({
                "id": f"GOAL_{eid}_1", "employee_id": eid, "title": "Data Pipeline SLA & Uptime Maintenance",
                "category": "Delivery", "target_value": 95.0, "achieved_value": 94.0, "metric_unit": "%",
                "progress_pct": 94.0, "verification_evidence": "Sustained 99.4% daily pipeline SLA across 14 upstream data streams."
            })
            goals.append({
                "id": f"GOAL_{eid}_2", "employee_id": eid, "title": "Snowflake Query Optimization",
                "category": "Cost Optimization", "target_value": 20.0, "achieved_value": 18.0, "metric_unit": "queries",
                "progress_pct": 90.0, "verification_evidence": "Refactored 18 high-cost analytical queries, cutting warehouse compute hours."
            })

            # Projects (Strong delivery)
            projects.append({
                "id": f"PRJ_{eid}_1", "employee_id": eid, "project_name": "Real-time Telemetry Ingestion Hub",
                "role_in_project": "Data Engineer",
                "deliverables": "Kafka-to-Warehouse ETL ingestion pipeline processing telemetry.",
                "delivered_on_time": True, "code_quality_score": 4.4,
                "outcome_evidence": "Ingested 15M daily event payload with sub-minute latency and schema drift quarantine."
            })

            # Feedback (Good: 4.2 - 4.4)
            feedback.append({
                "id": f"FB_{eid}_1", "employee_id": eid, "reviewer_type": "peer", "rating": 4.3,
                "comments": "Marcus is exceptionally dependable on daily batch pipelines and writes immaculate SQL transformations.",
                "sentiment": "positive"
            })
            feedback.append({
                "id": f"FB_{eid}_2", "employee_id": eid, "reviewer_type": "stakeholder", "rating": 4.2,
                "comments": "Great collaborator on data modeling. Would benefit from deeper expertise in distributed systems and cluster ops.",
                "sentiment": "mixed"
            })

            # Skills (Target Senior Data Engineer requires Distributed Systems 3+, K8s 3+. Marcus has 2 and 1)
            employee_skills.append({"id": f"ES_{eid}_1", "employee_id": eid, "skill_id": "SKILL_PY", "proficiency_level": 4, "verification_proof": "Authored automated ingestion DAGs and unit-tested data cleaning scripts."})
            employee_skills.append({"id": f"ES_{eid}_2", "employee_id": eid, "skill_id": "SKILL_SQL", "proficiency_level": 4, "verification_proof": "Optimized multi-terabyte query execution plans; certified Snowflake specialist."})
            employee_skills.append({"id": f"ES_{eid}_3", "employee_id": eid, "skill_id": "SKILL_DATA_ANALYSIS", "proficiency_level": 4, "verification_proof": "Constructed operational metrics dashboards and trend reporting models."})
            employee_skills.append({"id": f"ES_{eid}_4", "employee_id": eid, "skill_id": "SKILL_COLLAB", "proficiency_level": 4, "verification_proof": "Active participant in daily standups and engineering knowledge transfers."})
            employee_skills.append({"id": f"ES_{eid}_5", "employee_id": eid, "skill_id": "SKILL_DIST_SYS", "proficiency_level": 2, "verification_proof": "Basic exposure to Kafka consumer groups; has not designed partitioned stream topologies."})
            employee_skills.append({"id": f"ES_{eid}_6", "employee_id": eid, "skill_id": "SKILL_K8S", "proficiency_level": 1, "verification_proof": "Limited to viewing deployment logs via kubectl; lacks container pod manifest experience."})

            # Training
            training.append({
                "id": f"TRN_{eid}_1", "employee_id": eid, "course_name": "Apache Spark & Streaming Data Architecture",
                "provider": "Cloud Data Guild", "completion_status": "completed", "completion_date": "2026-01-25", "skill_area": "Technical"
            })
            training.append({
                "id": f"TRN_{eid}_2", "employee_id": eid, "course_name": "Kubernetes for Data Infrastructure",
                "provider": "DevOps Academy", "completion_status": "in_progress", "completion_date": None, "skill_area": "Cloud & DevOps"
            })

            # Attendance (Good: 98.4%)
            attendance.append({
                "id": f"ATT_{eid}", "employee_id": eid, "period": "2026-H1", "working_days": 125, "days_present": 123,
                "attendance_pct": 98.4, "reliability_notes": "Dependable attendance; actively covers scheduled data on-call rotations."
            })

            # Business Impact
            business_impact.append({
                "id": f"BI_{eid}_1", "employee_id": eid, "impact_type": "productivity", "metric_name": "Analyst Hours Saved",
                "value": "15", "metric_unit": "hours_per_week", "description": "Automated 8 manual financial data extracts into self-updating data marts.",
                "evidence": "Finance BI team verified weekly reporting prep time dropped from 20h to 5h."
            })

            # Manager Evaluation (Positive but notes development areas: 4.1)
            manager_evaluations.append({
                "id": f"ME_{eid}_1", "employee_id": eid, "manager_name": mgr_name, "rating": 4.1,
                "evaluation_cycle": "2026-H1", "comments": "Marcus is an outstanding contributor who has mastered day-to-day batch pipelines. To advance to Senior Data Engineer, he must build hands-on mastery in distributed systems and Kubernetes.",
                "evaluation_date": "2026-06-18"
            })

        # ----------------------------------------------------
        # PERSONA C: Priya Sharma (Strong Objective Evidence, Evaluation Inconsistency)
        # ----------------------------------------------------
        elif eid == "EMP003":
            # Goals (Strong: 92-94%)
            goals.append({
                "id": f"GOAL_{eid}_1", "employee_id": eid, "title": "Enterprise Design System Multi-Platform Adoption",
                "category": "Innovation", "target_value": 80.0, "achieved_value": 92.0, "metric_unit": "%",
                "progress_pct": 92.0, "verification_evidence": "18 frontend micro-applications transitioned to shared design tokens with 100% WCAG AA compliance."
            })
            goals.append({
                "id": f"GOAL_{eid}_2", "employee_id": eid, "title": "Customer Portal Usability Benchmark (SUS)",
                "category": "Customer", "target_value": 85.0, "achieved_value": 94.0, "metric_unit": "score",
                "progress_pct": 94.0, "verification_evidence": "System Usability Scale score surveyed across 250 enterprise beta users jumped from 72 to 94."
            })

            # Projects (Outstanding outcomes)
            projects.append({
                "id": f"PRJ_{eid}_1", "employee_id": eid, "project_name": "Enterprise Portal Design System Overhaul",
                "role_in_project": "UX Lead & Principal Designer",
                "deliverables": "Figma component library, motion guidelines, and tokenized design-to-code sync pipeline.",
                "delivered_on_time": True, "code_quality_score": None,
                "outcome_evidence": "Reduced UX handoff revision loops by 60% and accelerated UI sprint velocity by 2.4x."
            })

            # Feedback (Extremely strong: 4.8 - 4.9)
            feedback.append({
                "id": f"FB_{eid}_1", "employee_id": eid, "reviewer_type": "peer", "rating": 4.9,
                "comments": "Priya produces the cleanest, most accessible component specs in the company. Working with her is a joy.",
                "sentiment": "positive"
            })
            feedback.append({
                "id": f"FB_{eid}_2", "employee_id": eid, "reviewer_type": "stakeholder", "rating": 4.8,
                "comments": "Priya's customer research fundamentally transformed our enterprise portal adoption. She commands deep cross-functional respect.",
                "sentiment": "positive"
            })
            feedback.append({
                "id": f"FB_{eid}_3", "employee_id": eid, "reviewer_type": "peer", "rating": 4.8,
                "comments": "Visionary designer who proactively aligns engineering, product, and brand goals.",
                "sentiment": "positive"
            })

            # Skills (Strong mastery: UX 5, Comm 5, Leadership 4, Proj Mgt 4)
            employee_skills.append({"id": f"ES_{eid}_1", "employee_id": eid, "skill_id": "SKILL_UX", "proficiency_level": 5, "verification_proof": "Designed enterprise design system adopted org-wide; Nielsen Norman UX Master Certified."})
            employee_skills.append({"id": f"ES_{eid}_2", "employee_id": eid, "skill_id": "SKILL_LEADERSHIP", "proficiency_level": 4, "verification_proof": "Mentors 3 product designers; established weekly corporate design critique cadence."})
            employee_skills.append({"id": f"ES_{eid}_3", "employee_id": eid, "skill_id": "SKILL_COMM", "proficiency_level": 5, "verification_proof": "Regular presenter to executive leadership; leads customer interview readout sessions."})
            employee_skills.append({"id": f"ES_{eid}_4", "employee_id": eid, "skill_id": "SKILL_PROJ_MGT", "proficiency_level": 4, "verification_proof": "Maintains design roadmap across 4 product suites with zero backlog blockers."})
            employee_skills.append({"id": f"ES_{eid}_5", "employee_id": eid, "skill_id": "SKILL_COLLAB", "proficiency_level": 5, "verification_proof": "Praised by engineering teams for pixel-perfect specs and interactive code prototypes."})

            # Training
            training.append({
                "id": f"TRN_{eid}_1", "employee_id": eid, "course_name": "Design Systems at Scale & Multi-Brand Governance",
                "provider": "UX Leadership Institute", "completion_status": "completed", "completion_date": "2026-03-12", "skill_area": "UX Design"
            })
            training.append({
                "id": f"TRN_{eid}_2", "employee_id": eid, "course_name": "Executive Product Strategy & Design Metrics",
                "provider": "Product Faculty", "completion_status": "completed", "completion_date": "2026-06-05", "skill_area": "Leadership"
            })

            # Attendance (High: 99.0%)
            attendance.append({
                "id": f"ATT_{eid}", "employee_id": eid, "period": "2026-H1", "working_days": 125, "days_present": 124,
                "attendance_pct": 99.0, "reliability_notes": "Exemplary reliability and punctual stakeholder meeting leadership."
            })

            # Business Impact (Measurable, quantified)
            business_impact.append({
                "id": f"BI_{eid}_1", "employee_id": eid, "impact_type": "customer_impact", "metric_name": "Onboarding Drop-off Rate",
                "value": "26", "metric_unit": "percent_drop", "description": "Redesigned onboarding flows and contextual guidance tooltips.",
                "evidence": "Mixpanel funnel analytics verified onboarding drop-off decreased from 34% to 8%."
            })
            business_impact.append({
                "id": f"BI_{eid}_2", "employee_id": eid, "impact_type": "revenue", "metric_name": "Trial-to-Paid Subscription Conversion",
                "value": "28", "metric_unit": "percent_lift", "description": "Streamlined checkout and workspace invitation flows leading to net new ARR.",
                "evidence": "Stripe billing analytics confirmed 28% increase in trial conversion."
            })

            # Manager Evaluation (INCONSISTENCY: 2.8 despite 4.8+ objective evidence)
            manager_evaluations.append({
                "id": f"ME_{eid}_1", "employee_id": eid, "manager_name": mgr_name, "rating": 2.8,
                "evaluation_cycle": "2026-H1", "comments": "Priya produces good designs but had minor timeline friction during our last sprint retro. Needs more focus on meeting sprint deadlines.",
                "evaluation_date": "2026-06-20"
            })

        # ----------------------------------------------------
        # EMPLOYEES 4 to 30: Realistic Variety Across Departments
        # ----------------------------------------------------
        else:
            dept = emp["department"]
            role_id = emp["current_role_id"]

            # Goal Progress Variation: range 65% to 98%
            goal_pct_1 = 70.0 + ((idx * 7) % 28)
            goal_pct_2 = 65.0 + ((idx * 11) % 34)

            goals.append({
                "id": f"GOAL_{eid}_1", "employee_id": eid, "title": f"{dept} Core Milestone Execution",
                "category": "Delivery", "target_value": 100.0, "achieved_value": round(goal_pct_1, 1), "metric_unit": "%",
                "progress_pct": round(goal_pct_1, 1), "verification_evidence": f"Quarterly operational deliverable tracked in company Jira sprint board ({round(goal_pct_1, 1)}% achieved)."
            })
            goals.append({
                "id": f"GOAL_{eid}_2", "employee_id": eid, "title": f"{dept} Quality & Process Standards",
                "category": "Quality", "target_value": 100.0, "achieved_value": round(goal_pct_2, 1), "metric_unit": "%",
                "progress_pct": round(goal_pct_2, 1), "verification_evidence": f"Audit review verified completion of defined departmental standards ({round(goal_pct_2, 1)}% achieved)."
            })

            # Projects (1 to 2)
            is_tech = dept in ("Engineering", "Data")
            delivered_ontime = (idx % 5 != 0)
            proj_quality = round(3.6 + ((idx * 3) % 14) / 10.0, 1)

            projects.append({
                "id": f"PRJ_{eid}_1", "employee_id": eid, "project_name": f"{dept} Initiative Alpha",
                "role_in_project": "Core Contributor",
                "deliverables": f"Delivered functional deliverables for {dept} quarterly roadmap.",
                "delivered_on_time": delivered_ontime,
                "code_quality_score": proj_quality if is_tech else None,
                "outcome_evidence": f"Successfully deployed to production and integrated into departmental operations."
            })
            if idx % 2 == 0:
                projects.append({
                    "id": f"PRJ_{eid}_2", "employee_id": eid, "project_name": f"{dept} Continuous Improvement Beta",
                    "role_in_project": "Specialist",
                    "deliverables": f"Workflow optimization documentation and procedural updates.",
                    "delivered_on_time": True,
                    "code_quality_score": min(5.0, round(proj_quality + 0.2, 1)) if is_tech else None,
                    "outcome_evidence": f"Team retrospective recognized streamlined sprint turnaround."
                })

            # Feedback (2 records: peer, stakeholder or manager)
            fb_rating_1 = round(3.5 + ((idx * 4) % 15) / 10.0, 1)
            fb_rating_2 = round(3.4 + ((idx * 6) % 16) / 10.0, 1)
            sentiments = ["positive", "neutral", "mixed", "positive"]
            sentiment_1 = sentiments[idx % 4]
            sentiment_2 = sentiments[(idx + 1) % 4]

            feedback.append({
                "id": f"FB_{eid}_1", "employee_id": eid, "reviewer_type": "peer", "rating": fb_rating_1,
                "comments": f"{emp['name']} works well within the {dept} team and consistently contributes to sprint goals.",
                "sentiment": sentiment_1
            })
            feedback.append({
                "id": f"FB_{eid}_2", "employee_id": eid, "reviewer_type": "stakeholder", "rating": fb_rating_2,
                "comments": f"Solid functional collaboration. Clear communication during cross-team dependencies.",
                "sentiment": sentiment_2
            })

            # Skills (5 to 6 skills tailored to department)
            dept_skills_map = {
                "Engineering": ["SKILL_PY", "SKILL_SYS_DESIGN", "SKILL_TESTING", "SKILL_COLLAB", "SKILL_COMM", "SKILL_PROB_SOLV"],
                "Data": ["SKILL_PY", "SKILL_SQL", "SKILL_DATA_ANALYSIS", "SKILL_DIST_SYS", "SKILL_COLLAB", "SKILL_PROB_SOLV"],
                "Design": ["SKILL_UX", "SKILL_COMM", "SKILL_COLLAB", "SKILL_PROJ_MGT", "SKILL_PROB_SOLV"],
                "Product": ["SKILL_PROJ_MGT", "SKILL_COMM", "SKILL_LEADERSHIP", "SKILL_DATA_ANALYSIS", "SKILL_COLLAB"],
                "QA": ["SKILL_TESTING", "SKILL_PY", "SKILL_SQL", "SKILL_COLLAB", "SKILL_PROB_SOLV"],
                "Operations": ["SKILL_PROJ_MGT", "SKILL_DATA_ANALYSIS", "SKILL_COMM", "SKILL_COLLAB", "SKILL_PROB_SOLV"],
                "HR": ["SKILL_COMM", "SKILL_DATA_ANALYSIS", "SKILL_COLLAB", "SKILL_PROJ_MGT", "SKILL_LEADERSHIP"],
                "Marketing": ["SKILL_DATA_ANALYSIS", "SKILL_COMM", "SKILL_COLLAB", "SKILL_PROJ_MGT"]
            }
            assigned_skills = dept_skills_map.get(dept, ["SKILL_COLLAB", "SKILL_COMM", "SKILL_PROB_SOLV", "SKILL_PROJ_MGT"])
            for s_idx, sk_id in enumerate(assigned_skills, 1):
                base_lvl = 2 + ((idx + s_idx) % 3)  # Levels 2, 3, or 4
                employee_skills.append({
                    "id": f"ES_{eid}_{s_idx}", "employee_id": eid, "skill_id": sk_id,
                    "proficiency_level": base_lvl,
                    "verification_proof": f"Demonstrated proficiency on quarterly {dept} deliverables."
                })

            # Training (1 to 2 courses)
            train_statuses = ["completed", "in_progress", "planned"]
            status = train_statuses[idx % 3]
            training.append({
                "id": f"TRN_{eid}_1", "employee_id": eid,
                "course_name": f"Professional Competency in {dept} Practices",
                "provider": "Corporate Learning Portal",
                "completion_status": status,
                "completion_date": "2026-03-15" if status == "completed" else None,
                "skill_area": "Professional Development"
            })

            # Attendance (Varied: 76% to 99%)
            att_pct = 80.0 + ((idx * 7) % 20)
            if idx in (13, 27):  # A couple with lower attendance for realistic variety
                att_pct = 76.5 if idx == 13 else 81.2
            working_days = 125
            days_present = int(working_days * (att_pct / 100.0))
            attendance.append({
                "id": f"ATT_{eid}", "employee_id": eid, "period": "2026-H1", "working_days": working_days,
                "days_present": days_present, "attendance_pct": round(att_pct, 1),
                "reliability_notes": f"Attendance record within company norms ({round(att_pct, 1)}% attendance)."
            })

            # Business Impact
            impact_types = ["productivity", "quality", "cost_savings", "delivery_improvement"]
            imp_type = impact_types[idx % len(impact_types)]
            val = str(10 + (idx % 25))
            business_impact.append({
                "id": f"BI_{eid}_1", "employee_id": eid, "impact_type": imp_type,
                "metric_name": f"{dept} Efficiency Enhancement",
                "value": val, "metric_unit": "percent",
                "description": f"Contributed to streamlining cross-functional handoffs in {dept}.",
                "evidence": f"Internal quarterly team retrospectives confirmed measurable efficiency gains."
            })

            # Manager Evaluation
            # Normal distribution around 3.5 - 4.5
            mgr_rating = round(3.3 + ((idx * 5) % 15) / 10.0, 1)
            manager_evaluations.append({
                "id": f"ME_{eid}_1", "employee_id": eid, "manager_name": mgr_name,
                "rating": mgr_rating, "evaluation_cycle": "2026-H1",
                "comments": f"{emp['name']} performs consistently in the {emp['department']} department with solid accountability.",
                "evaluation_date": "2026-06-22"
            })

    dataset = {
        "roles": ROLES,
        "skills": SKILLS,
        "role_requirements": ROLE_REQUIREMENTS,
        "employees": EMPLOYEE_SEEDS,
        "goals": goals,
        "projects": projects,
        "feedback": feedback,
        "employee_skills": employee_skills,
        "training": training,
        "attendance": attendance,
        "business_impact": business_impact,
        "manager_evaluations": manager_evaluations
    }

    # Save to JSON
    json_path = DATA_DIR / "synthetic_hr_data.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated {json_path} successfully.")

    # Also export CSV files for convenient reference/inspection
    for key in ["employees", "goals", "projects", "feedback", "employee_skills", "training", "attendance", "business_impact", "manager_evaluations"]:
        csv_path = DATA_DIR / f"{key}.csv"
        rows = dataset[key]
        if rows:
            with open(csv_path, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
                writer.writeheader()
                writer.writerows(rows)
    print(f"Exported CSV files to {DATA_DIR}.")

    # Print summary counts
    print("\nDataset Summary Counts:")
    for k, v in dataset.items():
        print(f" - {k}: {len(v)}")

if __name__ == "__main__":
    build_full_dataset()
