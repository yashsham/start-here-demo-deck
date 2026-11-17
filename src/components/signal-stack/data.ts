export const navGroups = [
  {
    label: "WORKSPACE",
    items: [
      { id: "overview", label: "Overview", icon: "layout" },
      { id: "setup", label: "Company setup", icon: "building" },
      { id: "research", label: "Company research", icon: "search" },
      { id: "interview", label: "Founder interview", icon: "messages" },
      { id: "profile", label: "Intelligence profile", icon: "layers" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { id: "signals", label: "Signal Stack", icon: "stack" },
      { id: "sources", label: "Source manager", icon: "sources" },
      { id: "feed", label: "Intelligence feed", icon: "feed" },
      { id: "brief", label: "Monday morning brief", icon: "brief" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { id: "automation", label: "Automation", icon: "automation" },
      { id: "operations", label: "Operations", icon: "operations" },
      { id: "settings", label: "Settings", icon: "settings" },
    ],
  },
] as const;

export type Section = (typeof navGroups)[number]["items"][number]["id"];
export type CompanyName = "EDXSO" | "MeetUniversity" | "HealthPlix Technologies" | "Pine Labs" | "Northstar Health";

export interface CompanyInfo {
  name: CompanyName;
  domain: string;
  tagline: string;
  industry: string;
  stage: string;
  monogram: string;
  hue: "brand" | "cyan" | "success";
}

export const companies: CompanyInfo[] = [
  {
    name: "EDXSO",
    domain: "edxso.com",
    tagline: "Strategic growth consulting & institutional EduCore transformation",
    industry: "Education Strategy & Institutional Growth",
    stage: "Series A / Enterprise",
    monogram: "EX",
    hue: "brand",
  },
  {
    name: "MeetUniversity",
    domain: "meetuniversity.com",
    tagline: "Empowering students and universities with trusted discovery & enrollment pathways",
    industry: "EdTech & Higher Education Marketplace",
    stage: "Growth / Scaling",
    monogram: "MU",
    hue: "cyan",
  },
  {
    name: "HealthPlix Technologies",
    domain: "healthplix.com",
    tagline: "AI-powered Electronic Medical Records & clinical decision support for 100,000+ doctors",
    industry: "HealthTech & Clinical AI Infrastructure",
    stage: "Series C / Scaleup",
    monogram: "HP",
    hue: "cyan",
  },
  {
    name: "Pine Labs",
    domain: "pinelabs.com",
    tagline: "Omnichannel merchant commerce, enterprise POS terminals & fintech issuing platforms",
    industry: "FinTech & Enterprise Payment Processing",
    stage: "Pre-IPO / Unicorn",
    monogram: "PL",
    hue: "brand",
  },
  {
    name: "Northstar Health",
    domain: "northstar.example",
    tagline: "Modern clinician-guided patient navigation and digital health networks",
    industry: "Digital Health & Clinical Operations",
    stage: "Seed / Pilot",
    monogram: "NH",
    hue: "success",
  },
];

export const categories = ["Customers", "Competitors", "Market", "Internal"] as const;
export type Category = (typeof categories)[number];

export const sectionTitles: Record<Section, { title: string; description: string }> = {
  overview: {
    title: "Executive Intelligence Cockpit",
    description: "A synthesized, decision-ready overview of market signals, opportunities, source health, and briefing readiness.",
  },
  setup: {
    title: "Company Setup & Research Pipeline",
    description: "Initialize and monitor the automated web discovery and semantic extraction pipeline for your target company.",
  },
  research: {
    title: "Company Research Dossier",
    description: "Structured corporate intelligence separating verified public facts from unverified operating assumptions.",
  },
  interview: {
    title: "Founder Discovery Interview",
    description: "A focused, 10-question conversational intake extracting institutional nuances into a live profile.",
  },
  profile: {
    title: "Company Intelligence Profile",
    description: "The core business blueprint that calibrates signal relevance, risk thresholds, and opportunity detection.",
  },
  signals: {
    title: "The Signal Stack",
    description: "Curated intelligence streams organized by the four pillars of enterprise awareness with credibility scoring.",
  },
  sources: {
    title: "Enterprise Source Manager",
    description: "Central catalog of active intelligence feeds, crawl cadences, relevance thresholds, and health audits.",
  },
  feed: {
    title: "Chronological Intelligence Feed",
    description: "Real-time stream of parsed signals with explicit evidence separation, impact ratings, and recommended actions.",
  },
  brief: {
    title: "Monday Morning Executive Brief",
    description: "A ten-part editorial briefing synthesizing weekly developments into clear strategic priorities and assigned tasks.",
  },
  automation: {
    title: "Schedules & Automation",
    description: "Configure briefing schedules, timezone delivery, automated source health audits, and manual run triggers.",
  },
  operations: {
    title: "Operational Telemetry & System Health",
    description: "Real-time instrumentation of crawler throughput, queue backlog, AI token consumption, and error rates.",
  },
  settings: {
    title: "Workspace Settings & Governance",
    description: "Manage intelligence thresholds, notification channels, data retention policies, and security configurations.",
  },
};

export const questionsByCompany: Record<CompanyName, string[]> = {
  EDXSO: [
    "Which institutional challenges are most critical to resolve for your partner schools this quarter?",
    "Which school leaders and leadership personas represent your highest-impact engagements?",
    "Where do partner institutions most frequently encounter friction during strategic implementation?",
    "What specific evidence or proof-points give school management confidence in your interventions?",
    "Which alternative solutions or status-quo practices do education leaders compare before engaging EDXSO?",
    "Which regulatory policies (e.g. NEP 2020, affiliation criteria) are currently altering school budgets?",
    "What are your top 3 institutional expansion priorities over the next 6 to 12 months?",
    "Which internal delivery metrics best signal when an institution requires remedial support?",
    "Are there sensitive pricing tiers, proprietary frameworks, or confidential partnerships to respect?",
    "What single executive decision would be most empowered by a concise weekly intelligence briefing?",
  ],
  MeetUniversity: [
    "Which international study decisions do you most want to help prospective students make with confidence?",
    "Which student and parent demographics represent your core high-conversion cohort?",
    "Where do students encounter the greatest friction when shortlisting foreign universities?",
    "What builds prospective families' trust in digital discovery compared to legacy offline consultancies?",
    "Which direct competitors and aggregator portals do applicants use alongside MeetUniversity?",
    "Which visa policy shifts (e.g., UK, Canada, Australia) pose the greatest volume risk this admissions cycle?",
    "What are your primary institutional monetization and university partnership targets this year?",
    "Which student search queries or drop-off signals indicate unmet demand for counseling services?",
    "Are there confidential revenue share agreements or university exclusive contracts to consider?",
    "What strategic leadership decision should this intelligence engine accelerate each Monday?",
  ],
  "HealthPlix Technologies": [
    "Which hospital clinical workflows (outpatient consultation vs inpatient EHR) present the greatest adoption barrier?",
    "Which physician specialties (cardiology, diabetology, oncology) represent your highest clinical data density?",
    "Where do clinicians encounter operational friction when transitioning from paper prescriptions to AI EMR?",
    "What clinical validation metrics give chief medical officers confidence in your AI Clinical Decision Support (CDS)?",
    "Which incumbent hospital software systems (Napier, Practo, legacy on-prem HIS) do hospital CIOs compare against?",
    "Which National Health Authority (NHA) Ayushman Bharat Digital Mission (ABDM) mandates are altering hospital tech budgets?",
    "What are your target enterprise hospital and multi-specialty clinic onboarding targets over the next 12 months?",
    "Which doctor daily active usage (DAU) and prescription completion indicators highlight churn risk earliest?",
    "Are there confidential hospital enterprise agreements or strict DPDP patient data localization rules to uphold?",
    "What single executive decision around ABDM monetization should the Monday morning intelligence brief accelerate?",
  ],
  "Pine Labs": [
    "Which enterprise merchant verticals (large retail chains, quick-service dining, petrol retail) drive your core volume?",
    "Which merchant persona (CFO, store operations manager, IT director) is the key stakeholder for smart POS adoption?",
    "Where do enterprise merchants face settlement or reconciliation friction across omnichannel payment modes?",
    "What uptime and latency benchmarks give multi-lane retailers confidence in Pine Labs Android Smart POS terminals?",
    "Which competitors and terminal vendors (Paytm POS, PhonePe Smart POS, Innoviti, Razorpay) compete for counter space?",
    "Which Reserve Bank of India (RBI) directives (card tokenization, credit lines on UPI) impact interchange and merchant margins?",
    "What are your top expansion priorities across Tier-2/3 merchant networks and Southeast Asian markets?",
    "Which terminal transaction failure rates or settlement delay metrics signal immediate merchant dissatisfaction?",
    "Are there confidential banking partner agreements (HDFC, ICICI, Axis) or proprietary acquiring agreements to protect?",
    "What executive decision on merchant cash advance (MCA) risk or terminal deployment should the Monday brief empower?",
  ],
  "Northstar Health": [
    "Which care pathways and specialty referrals create the highest patient anxiety and navigation drop-off?",
    "Which patient demographics and payer networks are the strongest fit for your primary offerings?",
    "Where do clinicians and care coordinators face operational friction when coordinating multidisciplinary care?",
    "What clinical quality metrics establish provider credibility when introducing digital care protocols?",
    "Which health networks or telemedicine platforms do healthcare providers benchmark against?",
    "Which compliance and reimbursement policy changes (e.g., telehealth parity) impact operating margins?",
    "What are the target milestones for clinical expansion and facility onboardings over the next year?",
    "Which internal patient wait-time or satisfaction indicators highlight bottlenecks earliest?",
    "Are there confidential HIPAA protocols, licensing agreements, or clinical trial constraints?",
    "What clinical operations decision needs proactive weekly intelligence instead of reactive review?",
  ],
};

export const questionGuidance: Record<number, { hint: string; suggestedAreas: string[] }> = {
  0: {
    hint: "Identify the root operational or strategic friction your target customer is actively trying to eliminate.",
    suggestedAreas: ["Academic performance", "Leadership turnover", "Resource constraints", "Enrollment targets"],
  },
  1: {
    hint: "Specify decision-maker titles, organizational scale, and geographic or budgetary profile.",
    suggestedAreas: ["K-12 Principals", "Trustees & Board Members", "Higher Ed Deans", "EdTech Founders"],
  },
  2: {
    hint: "Detail where initiatives stall—e.g., change resistance, budget cycles, or lack of internal champions.",
    suggestedAreas: ["Teacher adoption", "Multi-stakeholder consensus", "Legacy infrastructure", "Budget release"],
  },
  3: {
    hint: "Describe quantitative proof, accreditation gains, or peer endorsements that close trust gaps.",
    suggestedAreas: ["Standardized test outcomes", "Case studies", "Alumni success", "ROI testimonials"],
  },
  4: {
    hint: "Identify internal DIY efforts, traditional agencies, or point software tools you displace.",
    suggestedAreas: ["In-house training", "Boutique consultants", "Free open tools", "Status-quo inaction"],
  },
  5: {
    hint: "Highlight recent statutory, accreditation, or curricular shifts that create urgency.",
    suggestedAreas: ["National Education Policy", "Board examinations", "Foreign university branch campuses"],
  },
  6: {
    hint: "Focus on measurable 12-month outcomes like institutional footprint, retained revenue, or new product lines.",
    suggestedAreas: ["Geographic expansion", "Enterprise licensing", "Consulting retainer growth", "EduCore platform"],
  },
  7: {
    hint: "Name specific leading indicators—before lag metrics like cancellations or student attrition appear.",
    suggestedAreas: ["Meeting attendance", "Action item completion", "NPS dips", "Leadership communication frequency"],
  },
  8: {
    hint: "Flag any intellectual property, non-public pilots, or sensitive pricing tiers to protect.",
    suggestedAreas: ["Proprietary audit rubric", "Enterprise rate cards", "Pre-announcement institutional partners"],
  },
  9: {
    hint: "Focus on capital allocation, resource redeployment, partnership signing, or executive escalation.",
    suggestedAreas: ["Weekly resource allocation", "Account intervention priority", "Hiring trigger points"],
  },
};

export interface PreviewSource {
  id: string;
  name: string;
  url: string;
  category: Category;
  rationale: string;
  specificity: number;
  credibility: number;
  recency: string;
  health: "Healthy" | "Review" | "New" | "Stale";
  status: "Approved" | "Pending" | "Rejected";
  type: "Official" | "Community" | "News" | "Internal";
  isDuplicate?: boolean;
  lastCrawl?: string;
  coverageTopic?: string;
}

export const previewSources: PreviewSource[] = [
  {
    id: "src-1",
    name: "National Education Policy Portal (NEP 2020)",
    url: "education.gov.in/nep",
    category: "Market",
    rationale: "Primary regulatory source for pedagogical reforms, accreditation shifts, and public school mandates.",
    specificity: 94,
    credibility: 99,
    recency: "3 hours ago",
    health: "Healthy",
    status: "Approved",
    type: "Official",
    lastCrawl: "Today, 04:30 AM",
    coverageTopic: "Curricular Frameworks & Regulatory Guidelines",
  },
  {
    id: "src-2",
    name: "Central Board of Secondary Education (CBSE) Circulars",
    url: "cbse.gov.in/cbsenew/circulars",
    category: "Market",
    rationale: "Statutory curriculum revisions, assessment guidelines, and affiliation bylaws directly impacting partner schools.",
    specificity: 96,
    credibility: 98,
    recency: "Yesterday",
    health: "Healthy",
    status: "Approved",
    type: "Official",
    lastCrawl: "Today, 06:15 AM",
    coverageTopic: "Board Exam Reforms & Skill Education Directives",
  },
  {
    id: "src-3",
    name: "EdTech Review Insights & Case Studies",
    url: "edtechreview.in/trends",
    category: "Competitors",
    rationale: "Monitors competing B2B education consulting practices, LMS vendor acquisitions, and institution tech spend.",
    specificity: 82,
    credibility: 85,
    recency: "2 days ago",
    health: "Healthy",
    status: "Approved",
    type: "News",
    lastCrawl: "Yesterday, 11:20 PM",
    coverageTopic: "K-12 School Tech Stacks & Vendor Benchmark",
  },
  {
    id: "src-4",
    name: "Principals & School Leaders Forum (LinkedIn Group)",
    url: "linkedin.com/groups/education-leaders-india",
    category: "Customers",
    rationale: "Unfiltered discussions among K-12 principals regarding teacher attrition, parent friction, and implementation struggles.",
    specificity: 88,
    credibility: 78,
    recency: "4 hours ago",
    health: "Review",
    status: "Pending",
    type: "Community",
    lastCrawl: "Today, 07:00 AM",
    coverageTopic: "Operational Friction Points & Retention Concerns",
  },
  {
    id: "src-5",
    name: "The Ken & Morning Context Education Briefs",
    url: "the-ken.com/edtech-schools",
    category: "Competitors",
    rationale: "Investigative coverage of private school chains, VC-backed EdTech consolidation, and leadership transitions.",
    specificity: 91,
    credibility: 92,
    recency: "5 days ago",
    health: "Healthy",
    status: "Approved",
    type: "News",
    lastCrawl: "3 days ago",
    coverageTopic: "Private K-12 M&A and Operating Margins",
  },
  {
    id: "src-6",
    name: "University World News — Asia Hub",
    url: "universityworldnews.com/asia",
    category: "Market",
    rationale: "International university partnerships, cross-border branch campus rules, and higher education policy.",
    specificity: 79,
    credibility: 90,
    recency: "Weekly",
    health: "New",
    status: "Pending",
    type: "News",
    lastCrawl: "Nov 14, 2026",
    coverageTopic: "Higher Ed Global Mobility & Regulatory Shifts",
  },
  {
    id: "src-7",
    name: "Reddit · r/Indian_Academia & r/StudyAbroad",
    url: "reddit.com/r/Indian_Academia",
    category: "Customers",
    rationale: "Direct feedback from students and parents discussing university admissions, quality doubts, and career pathways.",
    specificity: 85,
    credibility: 68,
    recency: "1 hour ago",
    health: "Review",
    status: "Pending",
    type: "Community",
    lastCrawl: "Today, 08:15 AM",
    coverageTopic: "Student Sentiment & Institutional Reputation",
    isDuplicate: true,
  },
  {
    id: "src-8",
    name: "Partner Institution Health Logs (CRM Feed)",
    url: "internal://crm.edxso.internal/partner-notes",
    category: "Internal",
    rationale: "Aggregated anonymized feedback from ongoing consulting sprints and school engagement diagnostics.",
    specificity: 98,
    credibility: 95,
    recency: "Pending Connection",
    health: "Stale",
    status: "Rejected",
    type: "Internal",
    lastCrawl: "Not connected",
    coverageTopic: "Client Satisfaction & Sprint Delivery Milestones",
  },
];

export interface PreviewSignal {
  id: string;
  category: Category;
  event: string;
  why: string;
  evidence: string;
  source: string;
  sourceUrl: string;
  pubDate: string;
  discoveryDate: string;
  type: "Opportunity" | "Threat" | "Neutral";
  urgency: "Low" | "Medium" | "High";
  businessArea: string;
  recommendedAction: string;
  actionOwner: string;
  relevanceScore: number;
  company: CompanyName;
}

export const previewSignals: PreviewSignal[] = [
  {
    id: "sig-1",
    category: "Market",
    event: "CBSE mandates progressive experiential learning and vocational integration in K-12 affiliations for 2027.",
    why: "Affiliated schools face mandatory curriculum audits. Most lack qualified in-house pedagogical designers, creating urgent demand for turnkey EduCore advisory modules.",
    evidence: "CBSE Official Notification CBSE/DIR/ACAD/2026/89 issued Nov 12, citing 15% minimum credit allocation for applied skill labs.",
    source: "CBSE Central Circulars",
    sourceUrl: "https://cbse.gov.in/cbsenew/circulars",
    pubDate: "Nov 12, 2026",
    discoveryDate: "Nov 13, 2026 · 04:15 AM",
    type: "Opportunity",
    urgency: "High",
    businessArea: "EduCore Service Expansion",
    recommendedAction: "Package an 'Affiliation-Ready Experiential Lab' compliance blueprint and brief partner school principals this week.",
    actionOwner: "Academic Director (Priya R.)",
    relevanceScore: 96,
    company: "EDXSO",
  },
  {
    id: "sig-2",
    category: "Customers",
    event: "Tier-2 private school chains report 22% increase in mid-year teacher turnover across STEM faculties.",
    why: "Teacher churn threatens parent retention and academic outcomes. School trustees cite acute fatigue from unstructured professional development mandates.",
    evidence: "Aggregated surveys across 42 private schools in Maharashtra and Karnataka presented at the National Principals Conclave.",
    source: "Principals & School Leaders Forum",
    sourceUrl: "https://linkedin.com/groups/education-leaders-india",
    pubDate: "Nov 14, 2026",
    discoveryDate: "Nov 15, 2026 · 09:30 AM",
    type: "Opportunity",
    urgency: "High",
    businessArea: "Teacher Training & Retention",
    recommendedAction: "Position EDXSO's structured Teacher Mentorship Cohorts as a direct retention stabilizer with verifiable satisfaction metrics.",
    actionOwner: "Client Success Head (Vikram S.)",
    relevanceScore: 93,
    company: "EDXSO",
  },
  {
    id: "sig-3",
    category: "Competitors",
    event: "Legacy school management consultancy launches discounted AI grading software bundle targeting K-12 budgets.",
    why: "Competitor attempts to commoditize strategic consulting by tying it to cheap commodity AI tooling without implementation support.",
    evidence: "Product press release and pricing portal showing ₹1.8L/year introductory bundle for paper grading with minimal onboarding.",
    source: "EdTech Review Insights",
    sourceUrl: "https://edtechreview.in/trends",
    pubDate: "Nov 15, 2026",
    discoveryDate: "Nov 16, 2026 · 11:00 AM",
    type: "Threat",
    urgency: "Medium",
    businessArea: "Positioning & Pricing Defense",
    recommendedAction: "Publish a comparative teardown demonstrating why software without leadership coaching fails to improve board exam averages.",
    actionOwner: "Strategic Marketing (Ananya M.)",
    relevanceScore: 88,
    company: "EDXSO",
  },
  {
    id: "sig-4",
    category: "Internal",
    event: "Partner schools completing the initial diagnostic phase exhibit 40% faster milestone execution than unassisted cohorts.",
    why: "Validates the core thesis that institutional diagnostic audits prevent scope creep and align leadership incentives early.",
    evidence: "Internal pilot benchmark of 8 partner schools over Q2-Q3 across Mumbai and Bangalore clusters.",
    source: "Consulting Operations Benchmark (Sample)",
    sourceUrl: "internal://benchmarks/cohort-diagnostic",
    pubDate: "Nov 10, 2026",
    discoveryDate: "Nov 11, 2026 · 02:00 PM",
    type: "Neutral",
    urgency: "Low",
    businessArea: "Service Methodology Validation",
    recommendedAction: "Incorporate the 40% acceleration metric into Q1 enterprise proposal decks as proof of ROI.",
    actionOwner: "Founding Partner (EDXSO)",
    relevanceScore: 91,
    company: "EDXSO",
  },
  {
    id: "sig-hp-1",
    category: "Market",
    event: "National Health Authority (NHA) issues mandatory ABDM Milestone 3 integration deadline for multi-specialty hospitals.",
    why: "Hospitals failing ABDM compliance face revocation of empanelment under PM-JAY and central health schemes, creating urgent demand for turnkey ABDM-certified EMR infrastructure.",
    evidence: "NHA Circular NHA/ABDM/2026/114 issued Nov 14, mandating digital health record exchange across all accredited tertiary facilities by Q2 2027.",
    source: "National Health Authority Portal",
    sourceUrl: "https://abdm.gov.in/circulars",
    pubDate: "Nov 14, 2026",
    discoveryDate: "Nov 15, 2026 · 05:30 AM",
    type: "Opportunity",
    urgency: "High",
    businessArea: "ABDM Inpatient EMR Enterprise Suite",
    recommendedAction: "Launch turnkey 'ABDM M1-M3 Fast-Track Compliance Suite' for hospital CIOs, guaranteeing certification in 30 days.",
    actionOwner: "Head of Enterprise Solutions",
    relevanceScore: 97,
    company: "HealthPlix Technologies",
  },
  {
    id: "sig-hp-2",
    category: "Competitors",
    event: "Incumbent legacy hospital information system vendor delays cloud migration, causing client dissatisfaction.",
    why: "On-premise legacy HIS architectures are failing to comply with fast-moving NHA API specifications, creating an immediate hospital displacement window.",
    evidence: "Healthcare Technology India Report, Nov 2026: 34% of hospital CIOs cite legacy HIS vendor inflexibility as primary modernization block.",
    source: "Healthcare Technology India Review",
    sourceUrl: "https://healthtechindia.internal/his-benchmark",
    pubDate: "Nov 13, 2026",
    discoveryDate: "Nov 14, 2026 · 10:15 AM",
    type: "Opportunity",
    urgency: "High",
    businessArea: "Enterprise Hospital Displacement",
    recommendedAction: "Target top 50 private hospital chains using legacy on-prem systems with zero-downtime ABDM migration playbook.",
    actionOwner: "VP Enterprise Sales",
    relevanceScore: 94,
    company: "HealthPlix Technologies",
  },
  {
    id: "sig-pl-1",
    category: "Market",
    event: "Reserve Bank of India (RBI) expands Credit Lines on UPI to merchant smart POS terminals nationwide.",
    why: "Enables instant unsecured credit at point-of-sale directly through smart Android POS terminals, significantly boosting merchant ticket size and terminal transaction velocity.",
    evidence: "RBI Notification RBI/2026-27/88 on Unified Payments Interface (UPI) Credit Line expansion at physical merchant terminals.",
    source: "Reserve Bank of India Official Notifications",
    sourceUrl: "https://rbi.org.in/notifications",
    pubDate: "Nov 12, 2026",
    discoveryDate: "Nov 13, 2026 · 08:00 AM",
    type: "Opportunity",
    urgency: "High",
    businessArea: "Merchant POS Credit & Financing",
    recommendedAction: "Roll out automated Credit Line on UPI firmware update across 450,000 Android Smart POS terminals with merchant co-marketing.",
    actionOwner: "Chief Product Officer (Payments)",
    relevanceScore: 96,
    company: "Pine Labs",
  },
  {
    id: "sig-pl-2",
    category: "Competitors",
    event: "Competitor QR network introduces low-cost smart terminal bundle for quick-service restaurants.",
    why: "Rival attempts to encroach into Pine Labs core retail merchant relationships with aggressive zero-MDR hardware subsidies.",
    evidence: "Competitor public press release and merchant marketing flyer offering subsidized Android terminals with soundbox bundle.",
    source: "FinTech Asia Monitor",
    sourceUrl: "https://fintechasiamonitor.internal/pos-wars",
    pubDate: "Nov 14, 2026",
    discoveryDate: "Nov 15, 2026 · 11:45 AM",
    type: "Threat",
    urgency: "Medium",
    businessArea: "Enterprise Merchant Retention",
    recommendedAction: "Reinforce omnichannel settlement guarantees and proprietary loyalty engine integration for enterprise retail accounts.",
    actionOwner: "Enterprise Merchant Relations Head",
    relevanceScore: 89,
    company: "Pine Labs",
  },
  {
    id: "sig-5",
    category: "Customers",
    event: "Prospective international students prioritize guaranteed internship visas and post-study work over global rank.",
    why: "Students and sponsor parents have become heavily ROI-conscious, demanding transparent employability outcomes before shortlisting.",
    evidence: "Comparative analysis of 12,000+ student enquiry logs and destination preferences.",
    source: "Reddit & Student Discussion Boards",
    sourceUrl: "https://reddit.com/r/StudyAbroad",
    pubDate: "Nov 11, 2026",
    discoveryDate: "Nov 12, 2026",
    type: "Opportunity",
    urgency: "Medium",
    businessArea: "Discovery Algorithm & Advising",
    recommendedAction: "Elevate Post-Study Work Visa calculators to the primary university discovery card filters.",
    actionOwner: "Product Lead",
    relevanceScore: 89,
    company: "MeetUniversity",
  },
  {
    id: "sig-6",
    category: "Market",
    event: "Stricter international student intake caps finalized for Canada and Australia entry cohorts.",
    why: "Rejection rates and visa processing latency are creating user churn and requiring fast pivots to alternative European and Asian destinations.",
    evidence: "Official Immigration Gazette releases from IRCC and Home Affairs Australia.",
    source: "University World News",
    sourceUrl: "https://universityworldnews.com/asia",
    pubDate: "Nov 13, 2026",
    discoveryDate: "Nov 14, 2026",
    type: "Threat",
    urgency: "High",
    businessArea: "Counseling Playbooks",
    recommendedAction: "Publish immediate alternative pathway briefings for students targeting Germany, Ireland, and Singapore.",
    actionOwner: "Admissions Advisory Team",
    relevanceScore: 95,
    company: "MeetUniversity",
  },
];

export const briefSections = [
  "Executive Summary",
  "Customer Signals",
  "Competitor Intelligence",
  "Market Intelligence",
  "Internal Business Intelligence",
  "Opportunities Identified",
  "Risks & Threats",
  "Recommended Actions for This Week",
  "What We Should Watch",
  "Source Appendix",
] as const;

export interface BriefContent {
  sectionTitle: (typeof briefSections)[number];
  headline: string;
  summary: string;
  keyInsights: { text: string; citation: string; category?: Category }[];
  actionItems?: { task: string; owner: string; priority: "P0" | "P1" | "P2"; status: boolean }[];
  watchList?: { item: string; threshold: string; source: string }[];
}

export const mondayBriefSample: BriefContent[] = [
  {
    sectionTitle: "Executive Summary",
    headline: "Strategic Window Opens for Turnkey School Compliance & Leadership Mentorship",
    summary:
      "This week's intelligence indicates a critical convergence of regulatory mandate shifts and severe frontline teacher fatigue across K-12 school systems. The newly issued CBSE 2027 curriculum directives mandate practical experiential integration, catching most standalone institutions unprepared. Simultaneously, competitor pricing attacks on commodity software open a major differentiation opportunity for EDXSO's high-touch leadership consulting model.",
    keyInsights: [
      { text: "Regulatory urgency has reached an inflection point: schools must demonstrate experiential frameworks within 120 days.", citation: "CBSE Notification 2026/89" },
      { text: "Teacher attrition is the #1 pain point keeping trustees awake, elevating teacher mentoring from 'nice-to-have' to retention-critical.", citation: "Principals Conclave Survey" },
      { text: "Competitors are lowering prices on point tools, leaving a vacuum for institutional partners who guarantee holistic transformation.", citation: "EdTech Review Market Watch" },
    ],
  },
  {
    sectionTitle: "Customer Signals",
    headline: "School Principals Overwhelmed by Execution Deficit and Faculty Disengagement",
    summary:
      "Direct qualitative signals from regional principal associations reveal that school heads have sufficient strategic awareness but lack implementation bandwidth. Principals report that ad-hoc workshops produce zero lasting behavioral changes among senior teachers, leading to leadership burnout.",
    keyInsights: [
      { text: "78% of surveyed academic heads express frustration with one-off vendor training sessions that don't include classroom shadowing.", citation: "Principals Forum Discourse", category: "Customers" },
      { text: "Management teams are demanding measurable student engagement metrics prior to renewing external consulting retainers.", citation: "Quarterly Academic Review Feed", category: "Customers" },
    ],
  },
  {
    sectionTitle: "Competitor Intelligence",
    headline: "Competitor Discount Bundling Fails to Address Pedagogical Culture",
    summary:
      "Competitors in the education consulting space are aggressively repackaging generic LLM grading interfaces at deep discounts. However, feedback from early school adopters shows widespread dissatisfaction due to high false-positive rates and zero teacher buy-in.",
    keyInsights: [
      { text: "Key rival 'EduConsult Asia' launched a ₹1.5L AI classroom monitoring suite; feedback highlights acute privacy pushback from parent associations.", citation: "Sector Intelligence Scan", category: "Competitors" },
      { text: "No direct competitor currently offers embedded institutional change management with guaranteed board score benchmarks.", citation: "Proprietary Competitor Teardown", category: "Competitors" },
    ],
  },
  {
    sectionTitle: "Market Intelligence",
    headline: "Statutory Shifts Create Immediate Commercial Urgency Across Tier-1 and Tier-2 Hubs",
    summary:
      "The Central Board of Secondary Education and State Curriculum Councils have synchronized timelines for vocational lab integration. Institutions that fail compliance reviews risk status downgrades, making board-level consulting an urgent line item.",
    keyInsights: [
      { text: "New affiliation bylaws require documented 120 hours of hands-on vocational modules for grades 6-10 by academic year 2027.", citation: "CBSE Statutory Gazette", category: "Market" },
      { text: "Private equity interest in mid-sized school chains has increased by 35%, forcing management to institutionalize quality governance.", citation: "The Ken Education Report", category: "Market" },
    ],
  },
  {
    sectionTitle: "Internal Business Intelligence",
    headline: "Diagnostic Sprint Cohorts Exhibit 40% Faster Metric Attainment",
    summary:
      "A preliminary analysis of EDXSO's active consulting engagements reveals that partner schools participating in our proprietary 360° Diagnostic Sprint reach key operational milestones 40% faster than those adopting piecemeal interventions.",
    keyInsights: [
      { text: "Early alignment of trustee expectations and principal authority correlates with a 92% renewal propensity.", citation: "EDXSO Internal Sprint Metrics", category: "Internal" },
      { text: "Onboarding bottlenecks currently average 14 business days due to manual document collection from schools.", citation: "Operations Pipeline Audit", category: "Internal" },
    ],
  },
  {
    sectionTitle: "Opportunities Identified",
    headline: "Three Immediate Commercial Windows for Enterprise Growth",
    summary:
      "Based on synthesis of market compliance needs and competitive vacancies, we recommend three immediate strategic motions to accelerate institutional retainers.",
    keyInsights: [
      { text: "Launch the 'NEP 2027 Rapid Compliance Package' targeting 150 regional CBSE partner institutions.", citation: "Market Synthesis Sig-1" },
      { text: "Package 'Faculty Retention Retainers' for private school chains facing severe STEM teacher churn.", citation: "Customer Need Sig-2" },
      { text: "Establish an executive peer roundtable for School Trustees to build trusted advisory pipeline.", citation: "Founder Interview Item 4" },
    ],
  },
  {
    sectionTitle: "Risks & Threats",
    headline: "Key Strategic Vulnerabilities to Counter This Quarter",
    summary:
      "While macro tailwinds are favorable, leadership must actively manage two operational hazards: market price anchoring by low-cost AI vendors, and delivery bottlenecks during rapid multi-campus expansions.",
    keyInsights: [
      { text: "Budget dilution risk: School boards may delay holistic consulting purchases hoping commodity software solves systemic problems.", citation: "Threat Sig-3" },
      { text: "Consultant bandwidth constraint: Rapid simultaneous school audits could strain EDXSO's core senior mentor roster.", citation: "Operations Telemetry" },
    ],
  },
  {
    sectionTitle: "Recommended Actions for This Week",
    headline: "Actionable Operational Priorities with Assigned Executive Owners",
    summary:
      "The following four prioritized tasks require immediate founder and leadership authorization during Monday's standup meeting.",
    keyInsights: [],
    actionItems: [
      { task: "Approve and publish the 'CBSE 2027 Experiential Compliance Blueprint' for school trustees.", owner: "Priya R. (Academic Director)", priority: "P0", status: false },
      { task: "Conduct briefing call with 12 shortlist principals experiencing faculty turnover.", owner: "Vikram S. (Client Success)", priority: "P0", status: false },
      { task: "Finalize comparative teardown: 'Why Point AI Software Fails School Transformation'.", owner: "Ananya M. (Marketing)", priority: "P1", status: false },
      { task: "Initiate monthly source health review for the 3 new intelligence feeds.", owner: "Ops Lead (Signal Stack)", priority: "P2", status: true },
    ],
  },
  {
    sectionTitle: "What We Should Watch",
    headline: "Leading Indicators & Metric Triggers for the Coming Week",
    summary:
      "Continuous monitoring thresholds are configured to alert the executive team when the following external metrics shift.",
    keyInsights: [],
    watchList: [
      { item: "State Education Department gazette on private school fee caps", threshold: "Any statutory announcement", source: "Official Gazette Tracker" },
      { item: "Mid-tier school chain teacher attrition rates", threshold: "> 25% annualized churn", source: "Principals Forum Monitor" },
      { item: "Competitor vendor pricing for school LMS add-ons", threshold: "Price cuts > 15%", source: "EdTech Review Crawler" },
    ],
  },
  {
    sectionTitle: "Source Appendix",
    headline: "Traceable Citations & Verification Audit Trail",
    summary:
      "All conclusions in this brief are derived exclusively from verified, approved intelligence feeds with established credibility thresholds.",
    keyInsights: [
      { text: "Central Board of Secondary Education Circular 2026/89 (Credibility: 98%, Specificity: 96%)", citation: "Official Gazette" },
      { text: "EdTech Review K-12 Industry Benchmark Report Nov 2026 (Credibility: 85%, Specificity: 82%)", citation: "Analyst Publication" },
      { text: "Principals Conclave Primary Survey Sample n=42 (Credibility: 78%, Specificity: 88%)", citation: "Peer Group Audit" },
      { text: "EDXSO Internal Pilot Engagement Cohort Q2-Q3 (Credibility: 95%, Specificity: 98%)", citation: "Internal Diagnostic Benchmark" },
    ],
  },
];

export interface ResearchDossier {
  company: CompanyName;
  overview: string;
  productsAndServices: { title: string; description: string; maturity: "Live" | "Pilot" | "Planned" }[];
  businessModel: { stream: string; model: string; targetShare: string }[];
  customerSegments: { name: string; profile: string; painPoint: string }[];
  positioning: { pillar: string; differentiator: string }[];
  factsVsAssumptions: {
    statement: string;
    type: "Verified Fact" | "Operating Assumption" | "Public Stated Claim";
    evidenceSource: string;
    sourceUrl?: string;
    evidenceSnippet?: string;
    confidence: number;
  }[];
}

export const researchDossiers: Record<CompanyName, ResearchDossier> = {
  EDXSO: {
    company: "EDXSO",
    overview:
      "EDXSO is an institutional growth and strategic consulting enterprise empowering schools, universities, and education ventures. Bringing 35+ years of leadership pedigree, EDXSO designs and deploys proprietary EduCore frameworks, leadership mentorship cohorts, and technology innovations to transform institutional performance.",
    productsAndServices: [
      { title: "Institutional Diagnostic Audits", description: "Comprehensive 360° evaluation of academic, operational, and financial health for K-12 schools and colleges.", maturity: "Live" },
      { title: "EduCore Transformation Framework", description: "Turnkey pedagogical reform, modern curriculum design, and hands-on faculty mentoring systems.", maturity: "Live" },
      { title: "Executive Leadership Coaching", description: "Direct mentorship for trustees, school principals, and academic deans to execute long-term strategic plans.", maturity: "Live" },
      { title: "EdTech Innovation Labs", description: "Integration of modern classroom technology, digital assessment pipelines, and administrative automation.", maturity: "Pilot" },
    ],
    businessModel: [
      { stream: "Strategic Consulting Retainers", model: "Annual multi-term advisory agreements with institutional school groups", targetShare: "55%" },
      { stream: "EduCore Framework Licensing", model: "Per-student curriculum and pedagogical audit platform fee", targetShare: "25%" },
      { stream: "Leadership Coaching Cohorts", model: "Tiered executive seats for school heads and management teams", targetShare: "20%" },
    ],
    customerSegments: [
      { name: "Progressive K-12 Private Schools", profile: "CBSE/ICSE/IB schools with 800–3,500 students seeking academic differentiation", painPoint: "High faculty turnover, stagnant board exam rankings, parent dissatisfaction." },
      { name: "Education Conglomerates & Trusts", profile: "Multi-campus trusts operating 5–30 regional campuses", painPoint: "Inconsistent delivery standards and lack of centralized quality governance." },
      { name: "Emerging EdTech & Higher Ed Ventures", profile: "Institutions scaling innovative hybrid degree models", painPoint: "Accreditation delays and lack of institutional credibility." },
    ],
    positioning: [
      { pillar: "Implementation Over Theory", differentiator: "We do not leave behind PowerPoint decks; our mentors embed inside school hallways to execute change." },
      { pillar: "Pedagogical & Financial Rigor", differentiator: "Balancing measurable academic excellence with sustained institutional balance sheet health." },
      { pillar: "Deep Sector Pedigree", differentiator: "Over 35 years of proven school leadership leadership and trust." },
    ],
    factsVsAssumptions: [
      {
        statement: "EDXSO provides holistic growth consulting, EduCore services, and institutional tech innovations.",
        type: "Verified Fact",
        evidenceSource: "EDXSO Official Public Portal (edxso.com)",
        sourceUrl: "https://www.edxso.com",
        evidenceSnippet: "EDXSO official portal states: 'EDXSO brings 35+ years of leadership pedigree, institutional diagnostic audits, proprietary EduCore frameworks, and edtech innovation labs to transform school and university outcomes.'",
        confidence: 99,
      },
      {
        statement: "Primary customer profiles are school principals, academic heads, and educational trust entrepreneurs.",
        type: "Verified Fact",
        evidenceSource: "EDXSO Published Case Studies",
        sourceUrl: "https://www.edxso.com",
        evidenceSnippet: "Published case summaries highlight core engagements with K-12 private school trustees, university deans, and education entrepreneurs across progressive regional campuses.",
        confidence: 95,
      },
      {
        statement: "Consulting interventions deliver measurable increases in student retention and board outcomes.",
        type: "Public Stated Claim",
        evidenceSource: "Executive Marketing Statements",
        sourceUrl: "https://www.edxso.com",
        evidenceSnippet: "Executive leadership keynote and publication: 'Interventions consistently produce verifiable increases in student retention, teacher satisfaction, and national board examination results.'",
        confidence: 85,
      },
      {
        statement: "Average consulting onboarding cycle requires 3 to 6 weeks from initial diagnostic agreement.",
        type: "Operating Assumption",
        evidenceSource: "Sales Pipeline Modeling (Requires CRM validation)",
        sourceUrl: "https://www.edxso.com",
        evidenceSnippet: "Operating model pipeline assumption: Requires initial 360-degree diagnostic audit, campus site visits, and leadership alignment before full EduCore rollout.",
        confidence: 70,
      },
      {
        statement: "Tier-2 school trustees are willing to allocate up to 3% of annual OPEX to external transformation.",
        type: "Operating Assumption",
        evidenceSource: "Founder Intake Hypothesis (To verify)",
        sourceUrl: "https://www.edxso.com",
        evidenceSnippet: "Strategic planning hypothesis: Budget allocation modeled from regional private school financial disclosures and fee collection trends.",
        confidence: 60,
      },
    ],
  },
  MeetUniversity: {
    company: "MeetUniversity",
    overview:
      "MeetUniversity is a student discovery and university recruitment platform connecting ambitious applicants with higher education institutions worldwide through trusted advice and personalized pathways.",
    productsAndServices: [
      { title: "University Discovery Marketplace", description: "AI-matched course and university exploration for international applicants.", maturity: "Live" },
      { title: "Visa & Admission Guidance", description: "End-to-end counselor assistance from document verification to visa mock interviews.", maturity: "Live" },
      { title: "Institutional Recruitment Engine", description: "Direct student enrollment solutions for foreign universities.", maturity: "Live" },
    ],
    businessModel: [
      { stream: "University Placement Success Fees", model: "Per-enrolled-student commission from foreign university partners", targetShare: "70%" },
      { stream: "Premium Student Advisory", model: "B2C advisory packages for elite scholarship applications", targetShare: "20%" },
      { stream: "Sponsored University Profiles", model: "Annual digital marketing and lead qualification retainers", targetShare: "10%" },
    ],
    customerSegments: [
      { name: "Aspiring Study Abroad Students", profile: "Undergraduate and graduate applicants targeting UK, US, Canada, EU", painPoint: "Opaque visa requirements and high offline consultant agent fees." },
      { name: "Foreign University Admissions Offices", profile: "International recruitment heads seeking verified, high-intent student leads", painPoint: "High drop-off rates and fraudulent application paperwork." },
    ],
    positioning: [
      { pillar: "Transparent Guidance", differentiator: "No hidden agent commissions; objective university rankings and visa transparency." },
    ],
    factsVsAssumptions: [
      {
        statement: "MeetUniversity operates an active digital marketplace connecting students to international universities.",
        type: "Verified Fact",
        evidenceSource: "MeetUniversity Web Registry",
        sourceUrl: "https://meetuniversity.com",
        evidenceSnippet: "Official portal index: 'Connecting over 50,000 international students with verified degree programs across the UK, USA, Canada, and Europe with transparent counselor advisory.'",
        confidence: 98,
      },
      {
        statement: "Visa policy changes in 2026 have shifted student demand toward European and Asian universities.",
        type: "Operating Assumption",
        evidenceSource: "Market Observation Feed",
        sourceUrl: "https://meetuniversity.com",
        evidenceSnippet: "Internal applicant interest shift analysis: 32% increase in non-UK European university queries following recent bilateral work visa policy updates.",
        confidence: 75,
      },
    ],
  },
  "HealthPlix Technologies": {
    company: "HealthPlix Technologies",
    overview:
      "HealthPlix Technologies is India's leading AI-powered electronic medical records (EMR) and healthcare data platform. Empowering over 100,000 clinicians across outpatient and inpatient settings, HealthPlix enables rapid clinical documentation, predictive prescription insights, and seamless Ayushman Bharat Digital Mission (ABDM) compliance.",
    productsAndServices: [
      { title: "HealthPlix AI EMR Suite", description: "Physician-first clinical assistant with voice prescription, drug interaction alerts, and automated vitals charting.", maturity: "Live" },
      { title: "ABDM Gateway & M1-M3 Certification", description: "Direct NHA bridge supporting ABHA creation, health record linking, and unified health interface (UHI) exchange.", maturity: "Live" },
      { title: "Hospital Inpatient Clinical Intelligence", description: "Enterprise bed management, nursing station telemetry, and discharge summary analytics for hospital systems.", maturity: "Pilot" },
      { title: "Clinical Insights & Real-World Evidence Engine", description: "Anonymized longitudinal epidemiological analytics for clinical research organizations.", maturity: "Live" },
    ],
    businessModel: [
      { stream: "Enterprise Hospital Subscriptions", model: "Annual per-bed / per-clinician SaaS license for inpatient EHR and analytics", targetShare: "50%" },
      { stream: "Clinical Decision Support & Value-Added Services", model: "Specialty-specific diagnostic guidance and e-prescribing modules", targetShare: "30%" },
      { stream: "Real-World Evidence & Pharma Analytics", model: "Anonymized aggregated disease trend insights for research bodies", targetShare: "20%" },
    ],
    customerSegments: [
      { name: "Enterprise Hospital Chains", profile: "100–1,000 bed multispecialty hospital groups requiring ABDM accreditation", painPoint: "Legacy on-prem HIS inflexibility and complex regulatory compliance." },
      { name: "Super-Specialty Clinics & Polyclinics", profile: "Cardiology, Diabetology, and Oncology clinics with high patient throughput", painPoint: "Time-consuming manual documentation and lack of longitudinal tracking." },
    ],
    positioning: [
      { pillar: "Physician Speed & Ease", differentiator: "Generates complete compliant prescriptions and EHR notes in under 30 seconds." },
      { pillar: "Native ABDM Interoperability", differentiator: "Pre-certified for all National Health Authority milestones with zero third-party middleware." },
    ],
    factsVsAssumptions: [
      {
        statement: "HealthPlix powers clinical documentation for over 100,000 doctors across 300+ Indian cities.",
        type: "Verified Fact",
        evidenceSource: "HealthPlix Corporate Registry & Clinical Reports",
        sourceUrl: "https://healthplix.com",
        evidenceSnippet: "Corporate clinical milestone disclosure: 'Over 100,000 licensed physicians across 300+ cities use HealthPlix daily to generate longitudinal electronic health records.'",
        confidence: 99,
      },
      {
        statement: "Platform is certified for Ayushman Bharat Digital Mission (ABDM) M1, M2, and M3 APIs.",
        type: "Verified Fact",
        evidenceSource: "National Health Authority Certified Integrators List",
        sourceUrl: "https://abdm.gov.in",
        evidenceSnippet: "National Health Authority (NHA) certified integrator register confirms HealthPlix compliance across Milestone 1 (ABHA creation), Milestone 2 (Health records linking), and Milestone 3 (Health information exchange).",
        confidence: 98,
      },
      {
        statement: "Enterprise hospital chains will transition from legacy on-prem HIS to cloud EMR within 18 months.",
        type: "Operating Assumption",
        evidenceSource: "Executive Strategic Roadmap (Requires CIO validation)",
        sourceUrl: "https://healthplix.com",
        evidenceSnippet: "Product strategy working hypothesis: ABDM mandates and cloud cost savings are accelerating migration from legacy on-premise HIS to microservice cloud EMR suites.",
        confidence: 75,
      },
    ],
  },
  "Pine Labs": {
    company: "Pine Labs",
    overview:
      "Pine Labs is a leading omnichannel merchant commerce and payments platform. Operating across India, the Middle East, and Southeast Asia, Pine Labs powers enterprise smart POS terminals, merchant acquiring, issuing technology, and embedded financial services for over 500,000 merchants.",
    productsAndServices: [
      { title: "Android Smart POS Terminals", description: "Next-generation touch devices supporting multi-mode payment acceptance, EMI calculations, and billing apps.", maturity: "Live" },
      { title: "Plural Online Payment Gateway", description: "Full-stack developer API for high-conversion web and mobile checkout with automated routing.", maturity: "Live" },
      { title: "Merchant Working Capital & MCA", description: "Data-driven merchant cash advances repaid seamlessly through daily terminal settlement deductions.", maturity: "Live" },
      { title: "Issuing & Prepaid Card Solutions (Qwikcilver)", description: "Enterprise gift card management and closed-loop brand loyalty engines.", maturity: "Live" },
    ],
    businessModel: [
      { stream: "Merchant Discount Rate (MDR) & Transaction Processing", model: "Percentage fee per transaction across card, UPI, and EMI rails", targetShare: "55%" },
      { stream: "Smart Terminal Hardware & SaaS Subscription", model: "Monthly POS terminal lease and cloud inventory management software", targetShare: "25%" },
      { stream: "Embedded Financial Services & Credit Origination", model: "Origination and servicing fee on merchant cash advances and consumer EMI", targetShare: "20%" },
    ],
    customerSegments: [
      { name: "Enterprise Multi-Lane Retail Chains", profile: "Supermarket, apparel, and electronics chains requiring high-speed multi-terminal sync", painPoint: "Settlement discrepancies and slow peak checkout times." },
      { name: "Quick-Service Restaurants & Hospitality", profile: "High-volume food chains needing integrated billing and tableside ordering", painPoint: "Hardware unreliability and lack of integrated loyalty schemes." },
    ],
    positioning: [
      { pillar: "Enterprise Reliability & Speed", differentiator: "99.99% terminal uptime with sub-second payment confirmation." },
      { pillar: "Comprehensive Financial Services Ecosystem", differentiator: "Single terminal handles card, UPI, brand EMI, and instant working capital." },
    ],
    factsVsAssumptions: [
      {
        statement: "Pine Labs serves over 500,000 merchant accounts across 3,700 cities in India and Southeast Asia.",
        type: "Verified Fact",
        evidenceSource: "Pine Labs Corporate Disclosures & Regulatory Filings",
        sourceUrl: "https://www.pinelabs.com",
        evidenceSnippet: "Annual regulatory and corporate filing: 'Network footprint exceeds 500,000 active merchant touchpoints across 3,700 cities, processing billions in annualized payment volume.'",
        confidence: 99,
      },
      {
        statement: "Credit Lines on UPI will drive a 25% increase in smart POS average transaction value.",
        type: "Operating Assumption",
        evidenceSource: "Merchant Payments Strategy Desk",
        sourceUrl: "https://www.pinelabs.com",
        evidenceSnippet: "Market trend projection: Pre-approved bank credit lines on UPI rails will increase high-ticket consumer electronics purchases at POS terminals.",
        confidence: 72,
      },
    ],
  },
  "Northstar Health": {
    company: "Northstar Health",
    overview:
      "Northstar Health is a modern patient navigation and digital clinical coordination system bridging complex hospital specialty referrals with personalized post-discharge care.",
    productsAndServices: [
      { title: "Care Navigator App", description: "Mobile-first patient companion for oncology and cardiology care pathways.", maturity: "Pilot" },
      { title: "Clinical Handoff Dashboard", description: "Real-time communication tool for primary physicians and hospital specialists.", maturity: "Live" },
    ],
    businessModel: [
      { stream: "Hospital Enterprise Subscriptions", model: "Per-patient-episode coordination fee", targetShare: "80%" },
      { stream: "Payer Value-Based Shared Savings", model: "Readmission reduction outcome incentives", targetShare: "20%" },
    ],
    customerSegments: [
      { name: "Multispecialty Hospital Networks", profile: "Regional hospital systems seeking reduced 30-day readmissions", painPoint: "Fragmented outpatient communication and patient drop-off." },
    ],
    positioning: [
      { pillar: "Clinician in the Loop", differentiator: "Software never replaces human judgment; every care pathway is clinician-supervised." },
    ],
    factsVsAssumptions: [
      {
        statement: "Northstar Health focuses on reducing readmission rates via guided outpatient workflows.",
        type: "Verified Fact",
        evidenceSource: "Clinical Pilot Whitepaper",
        sourceUrl: "https://healthplix.com",
        evidenceSnippet: "Clinical navigation pilot data: Post-acute surgical and cardiology care pathways demonstrated an 18% reduction in 30-day emergency readmissions.",
        confidence: 92,
      },
      {
        statement: "Payer reimbursement parity will extend to asynchronous clinical messaging in Q2 2027.",
        type: "Operating Assumption",
        evidenceSource: "Regulatory Speculation",
        sourceUrl: "https://healthplix.com",
        evidenceSnippet: "Healthcare policy outlook: IRDAI and NHA policy drafts project dedicated CPT/insurance reimbursement codes for remote clinical messaging.",
        confidence: 65,
      },
    ],
  },
};

export interface OperationsTelemetry {
  apiAvailability: { service: string; status: "Healthy" | "Degraded" | "Offline"; latencyMs: number; uptime: string }[];
  crawlSuccessRate: number;
  activeJobQueue: { id: string; taskName: string; queueTime: string; status: "Processing" | "Queued" | "Retrying" }[];
  tokenUsageSummary: { model: string; tokensThisMonth: string; costUsd: string; quotaPercent: number };
  systemLogs: { timestamp: string; level: "INFO" | "WARN" | "ERROR"; message: string; source: string }[];
}

export const operationsTelemetrySample: OperationsTelemetry = {
  apiAvailability: [
    { service: "Web Crawler & Scraper Mesh", status: "Healthy", latencyMs: 142, uptime: "99.94%" },
    { service: "Semantic Embedding Vector Engine", status: "Healthy", latencyMs: 68, uptime: "99.98%" },
    { service: "LLM Synthesis & Briefing Gateway", status: "Healthy", latencyMs: 420, uptime: "99.85%" },
    { service: "Regulatory Gazette Monitor", status: "Healthy", latencyMs: 210, uptime: "100%" },
    { service: "CRM Internal Ingestion Pipeline", status: "Degraded", latencyMs: 1250, uptime: "94.20%" },
  ],
  crawlSuccessRate: 98.4,
  activeJobQueue: [
    { id: "job-101", taskName: "CBSE Notification Deep Crawl", queueTime: "2 mins ago", status: "Processing" },
    { id: "job-102", taskName: "Principals Forum Sentiment Vectorization", queueTime: "5 mins ago", status: "Queued" },
    { id: "job-103", taskName: "Weekly Brief Candidate Assembly", queueTime: "12 mins ago", status: "Queued" },
  ],
  tokenUsageSummary: {
    model: "Gemini 2.5 Pro / Flash & Claude 3.5 Sonnet",
    tokensThisMonth: "4,821,500 tokens",
    costUsd: "$14.46",
    quotaPercent: 32,
  },
  systemLogs: [
    { timestamp: "17:15:22", level: "INFO", message: "Source health check completed for 8 active feeds. 1 duplicate flagged.", source: "Source Auditor" },
    { timestamp: "17:08:44", level: "WARN", message: "CRM Internal Ingestion responded with HTTP 429 rate limit. Backing off 30s.", source: "Ingestion Worker" },
    { timestamp: "16:54:10", level: "INFO", message: "Synthesized 6 new verified signal candidates from CBSE circulars.", source: "Signal Extractor" },
    { timestamp: "16:30:00", level: "INFO", message: "Automated daily vector index maintenance completed in 3.4s.", source: "Vector DB" },
  ],
};