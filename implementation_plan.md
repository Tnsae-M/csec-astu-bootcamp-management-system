# Frontend Overhaul Plan — CSEC ASTU BMS

> **Objective:** Transform the frontend from a generic, AI-generated-looking prototype into a production-quality, visually alive dashboard application.

---

## 1. Executive Summary of Current Problems

After scanning **every single file** across the frontend (`src/`) and all backend models, here is the honest diagnosis:

| Area | Severity | Summary |
|------|----------|---------|
| Color System | 🔴 Critical | Two competing color systems (custom brand tokens + shadcn oklch vars) fighting each other. Zero chromatic energy — everything is navy-on-white monotone. |
| UI Components (`/ui`) | 🔴 Critical | Only 6 primitives exist (button, card, table, modal, chart). No Input, Select, Badge, Textarea, Tooltip, Avatar, Dropdown, Tabs, Skeleton — pages inline raw HTML elements instead. |
| Visual Identity | 🔴 Critical | Every piece of text is `font-black uppercase tracking-widest text-[10px]` — the "military blueprint" aesthetic is overdone and screams "AI prompt gone wrong." |
| Page Consistency | 🟡 Major | Each page uses a different styling approach. Admin Dashboard uses the `Card` component; Instructor Dashboard uses raw `div` with `bg-white rounded-lg border border-gray-100`; Student Dashboard does the same. Reports page uses raw `bg-white rounded-lg p-6 shadow-sm border`. |
| Modals / Forms | 🟡 Major | The shared `Modal` component has a hardcoded indigo-to-navy gradient header, but TasksPage and SubmissionsPage modals contain raw unstyled `<input className="w-full border p-2">` elements — no labels, no spacing, no design. |
| Empty States | 🟡 Major | Loading states are just `<p>Loading...</p>`. No skeletons, no spinners, no empty-state illustrations. |
| Responsiveness | 🟡 Major | Sidebar handles mobile but most page layouts break on small screens. Tables are not responsive. |
| Hardcoded Data | 🟠 Moderate | Student Dashboard has hardcoded mock data (`upcomingMock`, `ongoingTask`). Progress page shows hardcoded `88.5%`. Reports has hardcoded `92%`, `99.9%`. |
| FeedbackForm | 🟠 Moderate | Uses a completely different modal pattern (manual `fixed inset-0` overlay) bypassing the shared `Modal` component. Uses non-existent `variant="ghost"` on Button. |
| Logo Fallback | 🟠 Moderate | Logo error fallback text says "PharmaLink" — a leftover from another project. |

---

## 2. Color & Design System Overhaul

### 2.1 The Problem

The current `index.css` has **three competing color layers**:
1. Custom `--brand-*` tokens (lines 25-37) — navy + white, zero vibrancy
2. Shadcn `oklch` variables (lines 162-228) — all achromatic (zero chroma), completely gray
3. Shadcn sidebar-specific vars — also gray

**Result:** The entire app is a flat, lifeless navy-and-white void. The charts use hardcoded `#1e40af`. Cards are white-on-white. Everything blends together.

### 2.2 The Fix — A Living Color Palette

Replace the monotone navy system with a **curated, role-aware color palette** that has actual chromatic energy:

```
Primary Accent:    hsl(225, 73%, 57%)  → Vibrant Sapphire Blue (not the dead #003366)
Secondary Accent:  hsl(262, 60%, 58%)  → Electric Violet (for highlights, badges)
Success:           hsl(152, 60%, 45%)  → Emerald Green
Warning:           hsl(38, 92%, 55%)   → Warm Amber
Danger:            hsl(0, 72%, 56%)    → Coral Red
Info:              hsl(199, 89%, 55%)  → Sky Cyan

Surface layers (light mode):
  Page bg:         hsl(225, 25%, 97%)  → Slightly tinted, not dead white
  Card bg:         hsl(0, 0%, 100%)    → Clean white
  Sidebar bg:      hsl(225, 30%, 15%)  → DARK sidebar (gives life + contrast)
  Sidebar text:    hsl(225, 20%, 80%)

  Accent surfaces: hsl(225, 73%, 57%, 0.06) → for hover states, selected rows
```

### 2.3 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Dark sidebar** | The current white sidebar with white content area creates zero visual hierarchy. A dark sidebar gives the app instant "real product" energy and clear navigation. |
| **Tinted page background** | Pure `#f9fbfe` is almost invisible. A lightly blue-tinted bg (`hsl(225, 25%, 97%)`) creates depth between page and cards. |
| **Kill the monotone navy** | `#003366` as the single accent for everything (buttons, active nav, text, icons) is suffocating. Introduce a brighter primary + a secondary violet for visual variety. |
| **Semantic status colors** | Currently there's just `bg-blue-50` everywhere. Status colors (green/amber/red) need to be part of the design system, not ad-hoc Tailwind classes. |
| **Role-specific accent tints** | Admin pages get a subtle indigo tint, Instructor gets teal, Student gets blue. Adds identity without being jarring. |

### 2.4 Typography Reset

**Current problem:** Everything is `font-black uppercase tracking-widest text-[10px]`. This makes everything scream at the same volume. Nothing has visual hierarchy.

**Fix:**
- Page titles: `text-2xl font-bold tracking-tight` (not uppercase, not font-black)
- Section headers: `text-sm font-semibold text-muted uppercase tracking-wide`  
- Body text: `text-sm font-normal`
- Labels: `text-xs font-medium text-muted`
- Badges/tags: `text-[11px] font-semibold uppercase tracking-wider`

**Rule:** Only badges, navigation labels, and section dividers should be uppercase. Headings and body text should be **normal case**.

---

## 3. UI Component Library Rebuild

### 3.1 Current State (6 components)

| Component | Issues |
|-----------|--------|
| `Button` | Works but has overly aggressive styling. `text-[10px] font-black uppercase tracking-widest` makes buttons look like military labels. Missing `ghost` variant (used by FeedbackForm). |
| `Card` | This is the shadcn card — data-slot based, complex. The custom `geo-card` utility also exists. Two card systems competing. |
| `Table` | Replace with **shadcn Table**. Current version has overly small text and lacks structural flexibility for responsiveness. |
| `Modal` | Replace with **shadcn Dialog**. Current custom implementation has a hardcoded gradient and inconsistent entrance animations. |
| `Chart` | Full shadcn chart wrapper — unused. Admin dashboard uses recharts directly instead. |
| `index.ts` | Only exports Button, Card, Table, Modal. Chart not exported. |

### 3.2 New Components Needed (shadcn/ui First)

Instead of building ad-hoc components, we will leverage **shadcn/ui** for all primitive building blocks. This ensures accessibility, consistency, and a professional "built-by-humans" foundation.

| Component | Priority | shadcn Component | Implementation |
|-----------|----------|------------------|----------------|
| **Input** | 🟢 High | `Input` | Standardize all text inputs across forms |
| **Textarea** | 🟢 High | `Textarea` | For descriptions, feedback, and grading |
| **Select** | 🟢 High | `Select` | Custom styled select for bootcamp/role picking |
| **Badge** | 🟢 High | `Badge` | Status indicators for users, tasks, and submissions |
| **Avatar** | 🟡 Med | `Avatar` | Profile pictures and initials in Navbar/Tables |
| **Skeleton** | 🟡 Med | `Skeleton` | Content-aware loading states for all dashboards |
| **Tabs** | 🟡 Med | `Tabs` | Organize complex dashboard metrics and filters |
| **Tooltip** | 🟡 Med | `Tooltip` | Consistent hover information across the app |
| **Dropdown** | 🟡 Med | `DropdownMenu` | Role switchers and action menus |
| **Form** | 🟢 High | `Form` | shadcn/react-hook-form integration for validation |
| **StatCard** | 🟢 High | Custom | Built using shadcn `Card` + counting animations |
| **EmptyState** | 🟡 Med | Custom | Unified "No Data" view with illustrations |
| **Confirm** | 🟡 Med | `AlertDialog` | High-polish replacement for `window.confirm` |

### 3.3 Modal Standardization

**Current mess:**

| Location | Modal Pattern Used |
|----------|-------------------|
| UsersPage | Shared `Modal` component with icon, subtitle ✅ |
| Admin Dashboard (Bootcamp) | Shared `Modal` component, no icon/subtitle |
| Admin Dashboard (Session) | Shared `Modal` component, no icon/subtitle |
| TasksPage | Shared `Modal` but form inputs are completely unstyled (`className="w-full border p-2"`) |
| SubmissionsPage (Grade) | Shared `Modal` but form inputs completely unstyled |
| FeedbackForm | **Completely different modal** — manual overlay, own styling, no shared Modal |
| Instructor Dashboard (Session) | Shared `Modal` but different form styling than Admin |

**Fix:** Every modal must be migrated to the **shadcn Dialog** primitive. We will create a shared `DialogContent` wrapper that enforces consistent padding, brand-accent headers, and responsive sizing.

---

## 4. Page-by-Page Audit & Fix Plan

### 4.1 Landing Page
- **Status:** Best-designed page in the app. Decent layout and structure.
- **Issues:** 
  - The marquee ticker is generic filler
  - "Scholar Interface Preview" placeholder block with MessageSquare icon is lazy
  - Footer links (#Terms, #Security, #Bylaws) go nowhere
- **Fix:** Keep structure, update colors to new palette, replace placeholder preview with real dashboard screenshot or animated mockup.

### 4.2 Login Page  
- **Status:** Clean but sterile
- **Issues:**
  - Label "Identity Key" for password is confusing jargon
  - "Educational Email" — just say "Email"
  - "New Researcher?" — users aren't researchers, they're students
  - Role labels at bottom (`ADMIN | INSTRUCTOR | STUDENT`) expose internal architecture to users
- **Fix:** Simplify labels, remove role labels, add subtle background pattern/gradient for visual warmth.

### 4.3 Register Page
- **Status:** Placeholder only — shows "Registration Locked" message
- **No changes needed** beyond color palette update.

### 4.4 Admin Dashboard
- **Status:** Most complete page. Has stat cards + chart + modals.
- **Issues:**
  - Stat cards all use `bg-blue-50` — no color differentiation (Users=blue, Sessions=blue, Bootcamps=blue, Attendance=blue)
  - Hardcoded `+12%`, `+4%`, `3 Upcoming` — fake data
  - Chart tabs are unstyled inline buttons
  - "Activity Metrics" chart uses hardcoded `#1e40af` fill color
  - Bootcamp form and Session form in modals are functional but form styling is inconsistent with UsersPage form
- **Fix:** Color-code stat cards (blue/violet/emerald/amber), use `StatCard` component, extract `Tabs` component, use new form components inside modals, remove fake percentages.

### 4.5 Admin UsersPage
- **Status:** Best-designed inner page. Consistent form styling in modal.
- **Issues:**
  - Title "User Directory" is styled completely differently than other pages' titles
  - Button says "Provision New User" / "Deploy User" — robot language
  - Uses custom inline button for "Provision New User" instead of the shared `Button` component
  - Division column shows raw IDs or "Unassigned" with no visual treatment
- **Fix:** Normalize title styling, humanize labels, use shared Button, add division badges.

### 4.6 Admin ReportsPage
- **Status:** Completely different design language from rest of app
- **Issues:**
  - Defines its own inline `StatCard` component instead of using shared one
  - Uses `bg-white rounded-lg p-6 shadow-sm border` instead of `geo-card` or `Card`
  - Uses Tailwind `text-gray-500`, `bg-blue-50` etc. instead of design tokens
  - "Generate" button is raw `bg-blue-600` — doesn't use the `Button` component
  - Report list items use raw `border rounded p-4` instead of Table or Card
- **Fix:** Complete rewrite using shared components and design tokens.

### 4.7 Admin SettingsPage
- **Status:** Well-styled but entirely static/fake
- **Issues:** All values are hardcoded strings. "Initiate Protocol" button does nothing. Maintenance mode card is decorative only.
- **Fix:** Keep design, wire to actual settings when backend supports it, or add clear "Coming Soon" indicators.

### 4.8 Instructor Dashboard
- **Status:** Completely inconsistent with Admin Dashboard
- **Issues:**
  - Uses raw `bg-white rounded-lg border border-gray-100` for everything instead of `Card`/`geo-card`
  - Stat cards are raw divs, not the same pattern as Admin stat cards
  - `totalStudents` and `engagementScore` are always `null` — renders as empty
  - Session list items use `border-gray-100` (Tailwind default) instead of design tokens
  - "View Session Details" button is raw inline styling
- **Fix:** Rebuild using `StatCard` component, `Card` component, design tokens, shared Button.

### 4.9 Instructor SubmissionsPage
- **Status:** Functional but **completely unstyled**
- **Issues:**
  - Header is just `<h1 className="text-3xl font-bold">` — different from every other page
  - Task selector is raw `<select className="border p-2 rounded">`
  - Loading state is `<p>Loading...</p>`
  - Grade modal form inputs are completely raw: `<input className="w-full border p-2">`
  - Status badge is inline `<span className="px-2 py-1 rounded text-xs">` — no shared Badge
  - Grade column shows `sub.grade || '-'` — no formatting
- **Fix:** Complete redesign using shared components. This page needs the most work.

### 4.10 Student Dashboard
- **Status:** Generic and mostly hardcoded
- **Issues:**
  - Uses raw `bg-white rounded-lg border border-gray-100` (same as Instructor)
  - `ongoingTask` is 100% hardcoded fake data: `{ title: 'Custom Hook Lab', due: 'Sep 25, 2024' }`
  - Attendance shows `0%` when API fails (which it likely does)
  - "My Group" section shows `S` in a gray circle — no avatar component
  - Mock upcoming sessions from 2024
- **Fix:** Rebuild with real data bindings, `StatCard`, `Card`, `Avatar` components.

### 4.11 Student SubmissionFormPage
- **Status:** Actually well-designed. Best student page.
- **Issues:** Minor — "Execute Submission" button text is robot-speak. "Integrity Protocol" sidebar card is filler.
- **Fix:** Humanize labels, keep layout.

### 4.12 Student ProgressPage
- **Status:** Well-styled but entirely driven by Redux state that may be empty
- **Issues:** Hardcoded stats (`88.5%`, `02 / 12`, `High`). Table column headers are jargon: "Timeline Sector", "Performance Metric", "System Status", "Registry Remarks"
- **Fix:** Humanize headers, connect to real progress API data.

### 4.13 TasksPage (shared)
- **Status:** Most broken page visually
- **Issues:**
  - Task cards are raw `<div className="p-6 border rounded-xl">` — no Card component
  - Icons (`BookOpen`, `Clock`, `Edit`, `Trash2`) are unstyled — no hover states, no color
  - Edit/Delete icons have no button wrapper — accessibility issue
  - Modal form inputs are completely unstyled: `<input className="w-full border p-2">`
  - Missing fields in form: backend Task model has `bootcampId` (required), `sessionId`, `maxScore`, `createdBy` — form only shows title, description, dueDate
  - Submit button in modal just says "Create" or "Update" — no loading state
- **Fix:** Complete rebuild. Use Card, FormField, Input, Select. Add all model fields to form.

### 4.14 FeedbackForm Component
- **Status:** Broken patterns
- **Issues:**
  - Uses own modal overlay instead of shared `Modal`
  - Uses `variant="ghost"` on Button — variant doesn't exist (only primary/secondary/outline/danger)
  - No form validation
  - Star rating is a `<select>` dropdown instead of a visual star picker
- **Fix:** Rewrite using `Modal`, add star picker, fix Button variant.

---

## 5. Backend Model → Frontend Form Gap Analysis

What each backend model expects vs what the frontend forms currently collect:

### User Model
| Backend Field | Frontend Form | Status |
|--------------|---------------|--------|
| `name` | ✅ Collected | OK |
| `email` | ✅ Collected | OK |
| `password` | ✅ Collected | OK |
| `role` (enum: super admin, admin, instructor, student) | ✅ Via checkbox/locked | OK |
| `status` (enum: active, suspended, graduated) | ✅ Via select | OK |
| `bootcamps[]` | ❌ Not in form | Missing — should allow assigning bootcamps |

### Task Model
| Backend Field | Frontend Form | Status |
|--------------|---------------|--------|
| `title` | ✅ Collected | OK |
| `description` | ✅ Collected | OK |
| `bootcampId` (required, ref) | ❌ Not in form | **CRITICAL** — required by backend but not in create form |
| `sessionId` (optional, ref) | ❌ Not in form | Missing — should be a select |
| `dueDate` (required) | ✅ Collected | OK |
| `maxScore` (default 100) | ❌ Not in form | Missing — should be an input |
| `createdBy` (required, ref) | ⚠️ Auto-set from `user.id` | OK but fragile |

### Session Model
| Backend Field | Frontend Form | Status |
|--------------|---------------|--------|
| `title` | ✅ | OK |
| `description` | ❌ Not in form | Missing |
| `bootcamp` (required, ref) | ✅ Via select | OK |
| `instructor` (optional, ref) | ⚠️ Partial (Admin form has it, Instructor form doesn't) | Inconsistent |
| `location` | ❌ Not in form | **Missing** — backend requires location OR onlineLink |
| `onlineLink` | ❌ Not in form | **Missing** — same requirement |
| `startTime` (required) | ⚠️ Sent as `date` + `time` separately | Needs validation |
| `endTime` (required) | ❌ Not in form | **Missing** — backend requires it |
| `status` (enum: scheduled/cancelled/completed) | ❌ Not in form | Missing |

### Bootcamp Model
| Backend Field | Frontend Form | Status |
|--------------|---------------|--------|
| `name` | ✅ | OK |
| `divisionId` (required, ref) | ✅ Via select | OK |
| `startDate` | ✅ | OK |
| `endDate` | ✅ | OK |
| `instructors[]` | ❌ Not in form | Missing — should allow multi-select |
| `status` (enum: upcoming/active/completed) | ❌ Not in form | Missing |

### Submission Model
| Backend Field | Frontend Form | Status |
|--------------|---------------|--------|
| `taskId` | ✅ | OK |
| `studentId` | Auto from auth | OK |
| `content` (text/link) | ✅ | OK |
| `fileUrl` | ✅ (file upload) | OK |
| `status` | N/A (backend sets) | OK |
| `score` | ✅ In grade form | OK |
| `feedback` | ✅ In grade form | OK |

### Feedback Model
| Backend Field | Frontend Form | Status |
|--------------|---------------|--------|
| `rating` (1-5, required) | ✅ Via select | OK (but should be star picker) |
| `comment` | ✅ | OK |
| `isAnonymous` | ✅ Via checkbox | OK |
| `sessionId` | ✅ Passed as prop | OK |
| `instructorId` | ✅ Passed as prop | OK |
| `bootcampId` | ✅ Passed as prop | OK |

---

## 6. Micro-Animations & "Life" Additions

What makes it feel alive vs. dead:

| Element | Current State | Proposed |
|---------|--------------|----------|
| Page transitions | None — instant swap | Fade-in with `motion.div` (already have framer-motion installed) |
| Stat card numbers | Static render | Count-up animation on mount |
| Table rows | Instant render | Staggered fade-in on load |
| Sidebar active indicator | Background color only | Left border accent bar + subtle glow |
| Hover states on cards | `hover:border-brand-accent` (barely visible) | Subtle lift (`translateY(-2px)`) + shadow increase |
| Empty states | Plain text | Illustrated empty states with action buttons |
| Loading states | `<p>Loading...</p>` | Skeleton loaders matching content shape |
| Modal entrance | `scale-100` (no animation) | Scale from 0.95→1 + opacity 0→1 |
| Notification badge | Static red dot | Subtle pulse animation |
| Button click | `active:scale-[0.98]` (good) | Keep, add ripple effect option |
| Chart | Instant render | Animate bars growing from bottom |

---

## 7. Implementation Priority & Phases

### Phase 1: Foundation (Design System)
- [ ] Overhaul `index.css` — new color palette, kill duplicate vars, clean typography
- [ ] Build missing UI components: `Input`, `Select`, `Textarea`, `Badge`, `FormField`, `Avatar`, `Skeleton`, `EmptyState`, `StatCard`, `Tabs`, `ConfirmDialog`
- [ ] Fix Modal — remove hardcoded gradient, add size variants, animate entrance
- [ ] Fix Button — soften styling, add `ghost` variant, normalize sizes
- [ ] Update `ui/index.ts` barrel exports
- [ ] Fix Logo fallback ("PharmaLink" → "CSEC")

### Phase 2: Layout & Navigation
- [ ] Dark sidebar redesign
- [ ] Navbar polish — better notification dropdown, avatar dropdown
- [ ] Breadcrumbs — use actual page names, not URL segments
- [ ] DashboardLayout — add page transition animations

### Phase 3: Page Rebuilds (highest-impact first)
- [ ] **TasksPage** — full rebuild, add missing form fields (bootcampId, sessionId, maxScore)
- [ ] **Instructor SubmissionsPage** — full rebuild, style grade modal
- [ ] **Instructor Dashboard** — rebuild with shared components
- [ ] **Student Dashboard** — rebuild with shared components, remove hardcoded data
- [ ] **Admin Dashboard** — polish stat cards, fix chart, fix modals
- [ ] **Admin ReportsPage** — full rebuild with design tokens
- [ ] **FeedbackForm** — rewrite with shared Modal, add star picker

### Phase 4: Polish
- [ ] Add skeleton loaders to all data-fetching pages
- [ ] Add empty state illustrations
- [ ] Add page transition animations
- [ ] Add stat counter animations
- [ ] Responsive audit — fix table overflow, mobile layouts
- [ ] Fix all forms to include missing backend model fields (Session: location/onlineLink/endTime, Task: bootcampId/maxScore)

---

## Open Questions

> [!IMPORTANT]
> **Dark sidebar vs. light sidebar?** The plan proposes a dark sidebar for visual hierarchy. If you prefer keeping it light, the color system still needs fixing but the approach changes.

> [!IMPORTANT]
> **How aggressive should the jargon cleanup be?** Currently things are labeled "Provision New Identity", "Deploy User", "Terminate Session", "Identity Key", "Execute Submission", "Engagement Vector", "Progress DNA". Should we humanize everything or keep some of the technical flavor?

> [!IMPORTANT]
> **Should missing backend fields (Session endTime/location, Task bootcampId/maxScore, Bootcamp instructors) be added to forms now, or deferred?** Adding them requires the forms to actually work with the backend validation rules (e.g., Session requires either location or onlineLink, duration ≥ 30 min).

> [!IMPORTANT]
> **Color palette preference?** The plan proposes sapphire blue + electric violet. Do you have a different color direction in mind, or should I proceed with this?
