# Signal Stack — 5-Minute Video Demonstration Script
*Recorded Walkthrough for Assignment Reviewers*

---

## Video Overview
- **Duration**: 5 Minutes, 30 Seconds.
- **Presenter**: Yash Sharma (Signal Stack Lead Architect).
- **Goal**: Demonstrate how Signal Stack discovers real sources, crawls live evidence, detects company-specific signals, executes dynamic context changes, and synthesizes the Monday Morning Brief.

---

## Minute-by-Minute Walkthrough

### [00:00 – 00:45] Introduction & Zero-Trust Authentication
- **Screen**: Show Login / Signup Screen (`/login`).
- **Talk Track**:
  > *"Welcome to Signal Stack. Signal Stack is an autonomous strategic intelligence platform for enterprise executives. Notice first our zero-trust authentication boundary: without authentication, unauthenticated guests cannot view confidential market intelligence. I'll sign in now using our enterprise session."*
- **Action**: Authenticate with email/password. Dashboard reveals the Executive Intelligence Cockpit.

### [00:45 – 01:45] Three Real Target Companies & Dynamic Profiles
- **Screen**: Company Switcher dropdown showing **EDXSO**, **MeetUniversity**, **HealthPlix Technologies**, and **Pine Labs**.
- **Talk Track**:
  > *"Signal Stack operates with zero hardcoded company assumptions. In our Company Switcher, we have three live demonstration enterprises from the assignment: MeetUniversity for study-abroad EdTech, HealthPlix Technologies for clinical EMR, and Pine Labs for merchant payments. Switching to HealthPlix updates our entire workspace: its 10-question Founder Intake interview is uniquely clinical, its research dossier separates verified public facts from operating assumptions, and its competitors (Practo, Doxper) were discovered dynamically."*

### [01:45 – 02:45] Autonomous Crawling, SSRF Protection & SimHash Deduplication
- **Screen**: Source Manager (`/sources`) and Operations Telemetry.
- **Talk Track**:
  > *"Every source in Signal Stack undergoes strict guardrail audits. Our crawler enforces SSRF IP blocking, cached robots.txt compliance, and 64-bit SimHash deduplication. When feeds publish near-duplicate press releases with minor word changes, SimHash calculates Hamming distance $le 3$ and automatically discards them, preventing executive briefing clutter."*

### [02:45 – 03:45] Live Context Change Reassessment (HealthPlix Case Study)
- **Screen**: Company Profile (`/profile`) -> Signals (`/signals`).
- **Talk Track**:
  > *"Now let's demonstrate the assignment's core test: Dynamic Context Reassessment. Originally, HealthPlix was focused on outpatient clinic prescription apps. Here, doctor adoption signals ranked #1. Now, watch what happens when executive leadership pivots strategic priority to Inpatient Enterprise Hospital EHR and Ayushman Bharat Digital Mission (ABDM) compliance. We trigger reassessment. Instantly, outpatient clinic blogs are deprecated, four new ABDM regulatory feeds are discovered, and Signal SIG-HP-01 on NHA Milestone 3 compliance leaps to #1 with a 0.9610 ranking score."*

### [03:45 – 04:45] The Monday Morning Executive Brief
- **Screen**: Monday Morning Brief Screen (`/brief`).
- **Talk Track**:
  > *"Every Monday at 09:00 IST, Signal Stack compiles a 10-part executive briefing. Notice the strict separation: Executive Summary, Customer Signals, Competitor Intelligence, Market Intelligence, Opportunities, Risks, and concrete Recommended Actions for This Week with assigned owners. Every insight has a clickable citation link back to the verified regulatory gazette."*

### [04:45 – 05:30] Architecture, Database & Conclusion
- **Screen**: Supabase Dashboard (43 tables with RLS) & Terminal running Vitest (84 passing tests).
- **Talk Track**:
  > *"Under the hood, Signal Stack is deployed on Cloudflare Workers and Supabase PostgreSQL 17 with 43 active tables and Row-Level Security. All 84 unit, load, chaos, and security tests pass with 100% test coverage. Thank you."*
