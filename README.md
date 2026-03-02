# SkillBridge

**SkillBridge** is a full-stack, multi-sided marketplace connecting university students with real-world industry projects. The platform bridges the gap between academic learning and professional experience — enabling SMEs to source verified talent affordably, while allowing students to build micro-credentials and robust portfolios.

**Live Platform:** [skillbridge-rose.vercel.app](https://skillbridge-rose.vercel.app/)

---

## Core Workflows

### Students

- **Opportunity Discovery** — Algorithmic filtering of projects based on skills, duration, and budget.
- **Application Pipeline** — Track application statuses from submission through review to acceptance.
- **Verified Credentials** — Upon project completion, automatically receive verifiable skills badges and detailed employer references.
- **Performance Dashboard** — A data-driven overview of aggregate ratings, skill competency breakdowns, and recommendation rates.

### Employers

- **Project Workspaces** — Post fixed-scope projects ranging from micro-tasks to capstone engagements, with defined budget ranges.
- **Applicant Tracking** — A centralised queue to review applications, cover letters, and student profiles.
- **Escrow State Machine** — End-to-end project lifecycle management from *In Progress* to *Approve Deliverable*.
- **Reference Engine** — A frictionless slide-over UI to evaluate students across core competency metrics and generate public references.

### Universities

> **Status:** This portal is currently under active development. The features below reflect the intended specification.

- **Automated Cohort Linking** — New student accounts are automatically linked to their respective university portal based on email domain.
- **Strict Data Siloing** — Security policies ensure university staff only access data pertaining to their enrolled student cohort.
- **Employability Analytics** — Live dashboards tracking student interactions, active applications, and aggregate competency scores.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 (Vite) | UI framework and build tooling |
| TypeScript | End-to-end type safety |
| Tailwind CSS | Utility-first responsive styling |
| Shadcn/UI & Radix UI | Accessible, unstyled UI primitives |
| Framer Motion | Layout transitions and micro-interactions |
| Lucide / Phosphor Icons | Consistent iconography |

### Backend & Infrastructure

| Technology | Purpose |
|---|---|
| Supabase Auth | Secure authentication, session management, and email verification |
| Supabase Realtime | Live messaging between students and employers |
| Vercel | Hosting and continuous deployment |
