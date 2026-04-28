# 📋 Frontend Overhaul Execution Board

> **Objective:** Execute the high-fidelity UI/UX transformation of CSEC ASTU BMS.
> **Tracking:** Mark items `[/]` when starting, `[x]` when completed.

---

## 📊 Project Status Dashboard

| Phase | Milestone | Focus Area | Status | Progress |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | **Foundation** | Design System & Components | ✅ DONE | 100% |
| **Phase 2** | **Navigation** | Sidebar, Navbar & Layouts | ✅ DONE | 100% |
| **Phase 3** | **Rebuilds** | Page-by-Page Logic & UI | ✅ DONE | 100% |
| **Phase 4** | **Polish** | Animations & Responsive Audit | 🔵 ACTIVE | 20% |

---

## 🏗️ Phase 1: Design System Foundation
> **Focus:** Establishing the core visual language and primitive components.

### 1.1 🎨 Color & Typography Reset
*Consolidating the competing systems into a single, vibrant palette.*

- [x] **Consolidate `index.css`:** Remove duplicate shadcn oklch achromatic variables (lines 162-228).
- [x] **Primary Accent:** Replace `#003366` with Sapphire Blue `hsl(225, 73%, 57%)`.
- [x] **Secondary Accent:** Add Electric Violet `hsl(262, 60%, 58%)`.
- [x] **Semantic Tokens:** Add success/warning/danger/info variables to the CSS token system.
- [x] **Background Depth:** Change page background from `#f9fbfe` to `hsl(225, 25%, 97%)`.
- [x] **Typography Reset:** reserve uppercase for badges/nav; Page titles → `text-2xl font-bold tracking-tight`.

### 1.2 🧩 shadcn/ui Installation & Config
*Installing the industrial-grade primitives.*

- [x] **Core Installation:** `npx shadcn@latest add input textarea select badge avatar skeleton tabs tooltip dropdown-menu alert-dialog dialog -y`
- [x] **Input/Textarea Styling:** Update to use `brand-primary` backgrounds and `brand-accent` focus rings.
- [x] **Badge Variants:** Map `success`, `warning`, `destructive` to semantic status tokens.
- [x] **Custom Compositions:**
  - [x] **StatCard:** Create using `Card` + counting logic.
  - [x] **EmptyState:** Create unified "No Data" view with illustrations.
  - [x] **FormField:** Wrap labels and inputs with consistent spacing.

### 1.3 🛠️ Legacy Component Migration
*Refactoring existing custom components to match the new standard.*

- [x] **Button:** Soften typography (`text-[11px] font-semibold`) and add `ghost` variant.
- [x] **Dialog (Modal):** Replace custom `Modal.tsx` logic with shadcn `Dialog`.
- [x] **Card:** Consolidate `geo-card` and shadcn `Card`; add hover-lift animation.
- [x] **Table:** Migrate all data grids to shadcn `Table` primitives.

---

## 🗺️ Phase 2: Layout & Navigation
> **Focus:** Improving the user's journey and application shell.

### 2.1 ⚓ Global Navigation
- [x] **Sidebar Redesign:** Switch to dark background (`hsl(225, 30%, 15%)`) for visual hierarchy.
- [x] **Navbar Polish:** Replace raw divs with new `Avatar` and `DropdownMenu` components.
- [x] **Breadcrumbs:** Use a human-readable label map (e.g., `"users"` → `"User Directory"`).

### 2.2 🖼️ Layout Enhancements
- [x] **Page Transitions:** Add `motion.div` fade-in wrapper to `DashboardLayout`.
- [x] **Container Audit:** Normalize `max-w-7xl` usage across different page types.

---

## ⚡ Phase 3: Page-by-Phase Rebuilds
> **Focus:** Swapping raw HTML for design system components and fixing data gaps.

### 🔴 High Priority: Core Dashboards & Tasks
| Component | Key Tasks | Status |
| :--- | :--- | :---: |
| **TasksPage** | Full rebuild; add `bootcampId`, `sessionId`, `maxScore` to form. | [x] |
| **Submissions** | Replace raw inputs; add grade formatting; fix modal. | [x] |
| **Instructor DB** | Switch to `StatCard`; fix `totalStudents` null values. | [x] |
| **Student DB** | Remove hardcoded mock data; connect to real APIs. | [x] |

### 🟡 Medium Priority: Management & Reports
- [ ] **Admin Reports:** Full rewrite using design tokens; replace raw `bg-white` divs.
- [ ] **Admin Users:** Humanize labels ("Provision" → "Add"); add division badges.
- [ ] **FeedbackForm:** Rewrite with shared `Modal`; add visual star rating picker.
- [ ] **Student Progress:** Humanize jargon headers; use real API data for stats.

### 🔵 Low Priority: Polish & Static Pages
- [ ] **Login/Register:** Simplify labels; add background gradient/warmth.
- [ ] **Landing Page:** Update colors; replace placeholder mockups with real content.
- [ ] **Settings:** Add "Coming Soon" indicators; fix dead buttons.

---

## ✨ Phase 4: Polish & Animation
> **Focus:** The "Magic" that makes the app feel alive and premium.

### 4.1 🎬 Micro-Animations
- [ ] **Counting Stats:** Add count-up animation on `StatCard` mount.
- [ ] **Staggered Lists:** Add staggered fade-in on table rows.
- [ ] **Sidebar Glow:** Add active-item left-border accent glow.
- [ ] **Notifications:** Add subtle pulse on the navbar notification badge.

### 4.2 🧹 Final Cleanup Sweep
- [ ] **Loading States:** Replace every `<p>Loading...</p>` with a `Skeleton` loader.
- [ ] **Jargon Cleanup:** Replace "Execute Submission", "Engagement Vector", etc. with human terms.
- [ ] **Responsive Audit:** Ensure every table has a horizontal scroll wrapper.
- [ ] **Token Audit:** Verify NO hardcoded hex codes (`#1e40af`) or Tailwind gray classes (`text-gray-500`) remain.

---
