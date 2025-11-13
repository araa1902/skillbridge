# SkillBridge High-Fidelity Prototype

## Overview

This repository contains the source for the SkillBridge high-fidelity prototype web application. SkillBridge is a platform connecting university students to real-world industry projects, enabling skill development, verified micro-credentials, and career readiness.

The prototype demonstrates an interactive, polished MVP design covering key user journeys for students, employers, and universities. It uses modern React, TailwindCSS, ShadCN UI components, and framer-motion animations.

---

## Design System & Technology Stack

- **Color Palette:** Muted, professional tones including Slate Blue, Soft Grey, and Muted Sky Blue
- **Typography:** Inter / Poppins with medium font weights for clear readability
- **Components:** ShadCN UI React components with Radix UI primitives
- **Icons:** Minimal line icons via Lucide
- **Animations:** Framer Motion for smooth transitions and hover effects
- **Layout:** Responsive grid-based layouts with a consistent top navigation bar and sidebar
- **Package Manager:** `pnpm` (preferred), compatible with Bun if needed
- **Tooling:** Vite.js (React framework), TailwindCSS with extended design tokens

---

## Key Pages & Features

### 1. Landing Page
- Introduces platform and core value proposition
- Prominent call-to-actions for sign-up or learning more

### 2. Signup / Login
- Role-select tabs: Student, Employer, University
- University SSO support and secure login flows

### 3. Student Dashboard
- Welcome banner with progress summary
- Searchable and filterable project feed
- Application status panel with real-time updates

### 4. Browse Projects
- Industry, Duration, Skill filters
- Detailed project cards and pagination

### 5. Project Details
- Tabbed interface showing Overview, Requirements, Deliverables
- Direct "Apply Now" CTA with micro-credential preview

### 6. Application Form
- Multi-field forms with portfolio upload and availability picker
- Confirmation dialogs and error validation

### 7. Application Status
- Process tracker and chat communication with employer
- Option to withdraw applications

### 8. Micro-Credentials
- Verified badges and digital certificates viewable in modal

### 9. Employer & University Dashboards
- Manage projects, applicants, analytics
- Data export and dashboard overview cards

### 10. Profile & Settings
- Editable user profile and skills
- Security controls with password/reset and 2FA

---

## Developer Setup

1. Clone repository  
2. Install dependencies:  
3. Set up Tailwind config and global styles as per `tailwind.config.js` and `app/globals.css`  
4. Run the development server
