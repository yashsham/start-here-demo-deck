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
export type CompanyName = "MeetUniversity" | "EDXSO" | "Northstar Health";

export const companies: { name: CompanyName; domain: string; monogram: string; hue: string }[] = [
  { name: "MeetUniversity", domain: "meetuniversity.com", monogram: "MU", hue: "brand" },
  { name: "EDXSO", domain: "edxso.com", monogram: "EX", hue: "cyan" },
  { name: "Northstar Health", domain: "northstar.example", monogram: "NH", hue: "success" },
];

export const categories = ["Customers", "Competitors", "Market", "Internal"] as const;

export const questionsByCompany: Record<CompanyName, string[]> = {
  MeetUniversity: [
    "Which student decisions do you most want to help families make with confidence?",
    "Which student or parent segments are the best fit for your current offering?",
    "Where do students get stuck when comparing international study options?",
    "What earns a family’s trust when they choose a university discovery platform?",
    "Which alternatives do prospective students consider before finding you?",
    "Which admission or visa changes could most affect your users this year?",
    "What are your most important growth priorities over the next 6–12 months?",
    "Which internal signals best show where prospective students need more support?",
    "Is there a confidential business consideration the brief should account for?",
    "What founder decision should this intelligence help you make each week?",
  ],
  EDXSO: [
    "Which institutional challenges are most important to address in your engagements?",
    "Which school leaders and education teams are the strongest-fit partners?",
    "Where do institutions most often struggle to turn a plan into implementation?",
    "What makes a school leader confident that an intervention will deliver lasting impact?",
    "Which other approaches do school leaders compare before choosing a partner?",
    "Which education-policy or curriculum shifts could most shape the work ahead?",
    "What are the most important institutional growth priorities this year?",
    "Which internal delivery signals best reveal where a school needs support?",
    "Is there a confidential partnership priority the brief should account for?",
    "What leadership decision would be easier with a weekly intelligence brief?",
  ],
  "Northstar Health": [
    "Which care journeys would you most like to make clearer for your patients?",
    "Which patient communities are the strongest fit for your current programs?",
    "Where do patients face the most friction when comparing care options?",
    "What helps patients and clinicians feel confident in a health service?",
    "Which care providers or approaches are your closest alternatives?",
    "Which healthcare rules or clinical shifts might affect your service?",
    "What are the most important patient or service priorities this year?",
    "Which internal feedback signals best reveal a patient need?",
    "Is there a confidential clinical or operational context to consider?",
    "Which leadership decision should weekly intelligence support?",
  ],
};

export type PreviewSource = {
  name: string;
  url: string;
  category: (typeof categories)[number];
  rationale: string;
  specificity: number;
  credibility: number;
  recency: string;
  health: "Healthy" | "Review" | "New";
  status: "Approved" | "Pending" | "Rejected";
  type: "Official" | "Community" | "News" | "Internal";
};

export const previewSources: PreviewSource[] = [
  { name: "University Grants Commission", url: "ugc.gov.in", category: "Market", rationale: "Public guidance and notices that can shape the higher-education environment.", specificity: 92, credibility: 96, recency: "Illustrative · weekly", health: "Healthy", status: "Approved", type: "Official" },
  { name: "Ministry of Education", url: "education.gov.in", category: "Market", rationale: "Policy updates relevant to students, institutions and education providers.", specificity: 87, credibility: 98, recency: "Illustrative · weekly", health: "Healthy", status: "Approved", type: "Official" },
  { name: "Reddit · Study abroad", url: "reddit.com/r/StudyAbroad", category: "Customers", rationale: "A place to observe student questions and compare recurring decision barriers.", specificity: 89, credibility: 64, recency: "Illustrative · daily", health: "Review", status: "Pending", type: "Community" },
  { name: "Education Times", url: "timesofindia.indiatimes.com/education", category: "Market", rationale: "Education reporting and sector announcements for context.", specificity: 74, credibility: 76, recency: "Illustrative · daily", health: "Healthy", status: "Approved", type: "News" },
  { name: "University World News", url: "universityworldnews.com", category: "Competitors", rationale: "International higher-education developments and institutional changes.", specificity: 78, credibility: 87, recency: "Illustrative · weekly", health: "New", status: "Pending", type: "News" },
  { name: "Student support notes", url: "Internal source · not connected", category: "Internal", rationale: "Future placeholder for support themes; no company files are connected.", specificity: 97, credibility: 51, recency: "Not collected", health: "Review", status: "Rejected", type: "Internal" },
];

export const previewSignals = [
  { category: "Customers", event: "Students compare total cost and scholarship access before shortlisting destinations.", why: "A comparison aid could surface affordability questions earlier in the student journey.", source: "Student discussion · illustrative preview", type: "Opportunity", urgency: "Medium", date: "Preview record" },
  { category: "Competitors", event: "University comparison tools increasingly foreground programme and destination filters.", why: "Review how discovery criteria shape the path from exploration to enquiry.", source: "Category observation · illustrative preview", type: "Neutral", urgency: "Low", date: "Preview record" },
  { category: "Market", event: "Education policy and admission notices can change quickly across institutions.", why: "A dated update log may help teams distinguish fresh guidance from older assumptions.", source: "Public notice theme · illustrative preview", type: "Threat", urgency: "High", date: "Preview record" },
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

export const sectionTitles: Record<Section, { title: string; description: string }> = {
  overview: { title: "Intelligence overview", description: "A considered view of the signals and work in your intelligence workspace." },
  setup: { title: "Company setup", description: "Choose a company to prepare a workspace for research and monitoring." },
  research: { title: "Company research", description: "A structured starting profile, with example context kept separate from verified facts." },
  interview: { title: "Founder interview", description: "Capture context one thoughtful question at a time." },
  profile: { title: "Intelligence profile", description: "The business context that helps future signals stay relevant." },
  signals: { title: "Signal Stack", description: "A deliberate set of sources, grouped by the intelligence they can contribute." },
  sources: { title: "Source manager", description: "Review the source catalogue and its example health labels." },
  feed: { title: "Intelligence feed", description: "A chronological view of illustrative signals, with evidence and interpretation kept distinct." },
  brief: { title: "Monday morning brief", description: "A ten-part editorial briefing template, ready for real evidence when connected." },
  automation: { title: "Automation", description: "A schedule preview for future briefing and source health checks." },
  operations: { title: "Operations", description: "A clearly marked layout preview for operational monitoring panels." },
  settings: { title: "Settings", description: "Personal, company and monitoring preferences for this workspace." },
};