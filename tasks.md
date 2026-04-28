# Frontend Improvement Tasks

> Step-by-step execution checklist derived from `implementation_plan.md`.
> Mark items `[/]` when in progress, `[x]` when done.

---

## Phase 1 — Design System Foundation

> Everything else depends on this. No page work until this is solid.

### 1.1 Color Palette Overhaul (`index.css`)
- [ ] Remove the duplicate shadcn oklch achromatic variables (lines 162-228) — consolidate into one set of tokens
- [ ] Replace `--brand-accent: #003366` (dead navy) with vibrant sapphire `hsl(225, 73%, 57%)`
- [ ] Add secondary accent variable — electric violet `hsl(262, 60%, 58%)`
- [ ] Add semantic status colors to the token system (success/warning/danger/info) instead of ad-hoc Tailwind classes
- [ ] Change page background from `#f9fbfe` to a lightly tinted `hsl(225, 25%, 97%)` for depth
- [ ] Set up dark sidebar tokens (`--sidebar-bg`, `--sidebar-text`, `--sidebar-active`)
- [ ] Update the `geo-card` and `geo-border` utilities to use new tokens
- [ ] Verify chart colors reference design tokens, not hardcoded hex (`#1e40af`)

### 1.2 Typography Reset
- [ ] Define a clear typographic hierarchy in `index.css` (heading, subheading, body, label, badge)
- [ ] Kill the global `font-black uppercase tracking-widest text-[10px]` pattern — reserve uppercase only for badges, nav labels, section dividers
- [ ] Page titles → `text-2xl font-bold tracking-tight` (normal case)
- [ ] Section headers → `text-sm font-semibold uppercase tracking-wide text-muted`
- [ ] Body text → `text-sm font-normal`
- [ ] Form labels → `text-xs font-medium text-muted`

### 1.3 Install and Configure shadcn/ui Components

> We will use the shadcn/ui CLI to add components and then apply our custom `brand-*` styling to their `index.css` variables.

- [ ] Ensure shadcn/ui is properly initialized in the project (check `components.json`)
- [ ] **Install Core Primitives:**
  - [ ] `npx shadcn-ui@latest add input textarea select badge avatar skeleton tabs tooltip dropdown-menu alert-dialog`
- [ ] **Standardize Components:**
  - [ ] **Input/Textarea/Select:** Update to use `brand-primary` backgrounds and `brand-accent` focus rings.
  - [ ] **Badge:** Map variants (`default`, `success`, `warning`, `destructive`) to our new semantic status colors.
  - [ ] **Avatar:** Ensure clean fallback styles using `brand-accent`.
  - [ ] **Skeleton:** Customize pulse animation to be more subtle and brand-aligned.
- [ ] **Build Custom Composition Components (using shadcn primitives):**
  - [ ] **StatCard:** Create using `Card` + `brand` icon backgrounds + count-up logic.
  - [ ] **EmptyState:** Create using `Card` + icons + coordinated typography.
  - [ ] **FormField:** Use shadcn `Form` primitives to wrap labels and inputs consistently.

### 1.4 Fix Existing UI Components

#### 1.4.1 `Button` fixes
- [ ] Soften the aggressive styling — `text-[11px] font-semibold uppercase tracking-wider` instead of `font-black tracking-widest`
- [ ] Add missing `ghost` variant (used by FeedbackForm, currently breaks)
- [ ] Normalize size padding to feel less cramped

#### 1.4.2 `Modal` (Dialog) migration
- [ ] Install shadcn Dialog: `npx shadcn-ui@latest add dialog`
- [ ] Replace custom `Modal.tsx` logic with shadcn `Dialog` primitives
- [ ] Create a shared `BrandDialog` wrapper that handles:
  - [ ] Standardized `brand-accent` header/icon treatment
  - [ ] Entrance/exit animations (scale + fade)
  - [ ] Responsive sizing (`sm` to `xl`)

#### 1.4.3 `Card` consolidation
- [ ] Decide: use shadcn `Card` or custom `geo-card`. Pick one, delete the other
- [ ] Add hover lift animation variant (`hover:translate-y-[-2px] hover:shadow-md`)

#### 1.4.4 `Table` migration
- [ ] Install shadcn Table: `npx shadcn-ui@latest add table`
- [ ] Migrate all data grids (Users, Submissions, Progress) to the new shadcn `Table`
- [ ] Apply brand typography to headers (slightly larger than the current `text-[10px]`)
- [ ] Ensure horizontal responsiveness via a standard `overflow-x-auto` wrapper

### 1.5 Update barrel exports
- [ ] Update `components/ui/index.ts` to export ALL new components (Input, Select, Textarea, Badge, Avatar, StatCard, Skeleton, EmptyState, Tabs, ConfirmDialog, FormField, Tooltip)

### 1.6 Quick Fixes
- [ ] Fix Logo fallback text from "PharmaLink" → "CSEC" (`components/common/Logo.tsx` line 34)

---

## Phase 2 — Layout & Navigation

### 2.1 Sidebar Redesign
- [ ] Switch sidebar to dark background using new dark sidebar tokens
- [ ] Restyle nav items for dark context (light text, accent highlight bar on active)
- [ ] Restyle separator labels for dark context
- [ ] Update collapse toggle button styling
- [ ] Update mobile drawer overlay colors
- [ ] Fix tooltip styling for dark sidebar

### 2.2 Navbar Polish
- [ ] Restyle notification dropdown — use Card-like styling, add empty state
- [ ] Restyle role switcher dropdown — use shared DropdownMenu pattern
- [ ] Replace avatar div with new `Avatar` component
- [ ] Uncomment and restore the search bar (currently commented out), or remove it entirely

### 2.3 Breadcrumbs
- [ ] Use human-readable page names, not raw URL segments
- [ ] Add a label map (e.g. `"users"` → `"User Directory"`, `"sessions"` → `"Sessions"`)
- [ ] Style breadcrumb separators with softer visual treatment

### 2.4 Dashboard Layout
- [ ] Add page transition animation using `motion.div` (fade-in on route change)
- [ ] Evaluate content max-width — `max-w-7xl` may need adjusting per page type

---

## Phase 3 — Page Rebuilds

> Ordered by impact. Each page task includes swapping to shared components.

### 3.1 TasksPage (shared) — Full Rebuild
- [ ] Replace raw card divs with `Card` component
- [ ] Style task card layout — icon, title, bootcamp name, due date, actions
- [ ] Wrap Edit/Trash2 icons in proper button elements (accessibility)
- [ ] Add hover states and cursor pointer to action icons
- [ ] Replace `<p>Loading...</p>` with task card `Skeleton` loaders
- [ ] Add `EmptyState` when no tasks exist
- [ ] **Fix modal form — add missing fields:**
  - [ ] `bootcampId` select (REQUIRED by backend)
  - [ ] `sessionId` select (optional)
  - [ ] `maxScore` number input (default 100)
- [ ] Replace raw `<input className="w-full border p-2">` with `FormField` + `Input`
- [ ] Replace raw `<textarea>` with `FormField` + `Textarea`
- [ ] Add loading state to submit button
- [ ] Replace `window.confirm` in delete with `ConfirmDialog`

### 3.2 Instructor SubmissionsPage — Full Rebuild
- [ ] Restyle page header to match design system
- [ ] Replace raw `<select className="border p-2 rounded">` task picker with styled `Select`
- [ ] Replace `<p>Loading...</p>` with table `Skeleton`
- [ ] Add `EmptyState` when no submissions
- [ ] Replace inline status `<span>` with `Badge` component
- [ ] Format grade display (show `/100`, color-code)
- [ ] **Fix grade modal form:**
  - [ ] Replace raw `<input type="number" className="w-full border p-2">` with `FormField` + `Input`
  - [ ] Replace raw `<textarea>` with `FormField` + `Textarea`
  - [ ] Replace raw `<select>` with `FormField` + `Select`
  - [ ] Add loading state to submit button

### 3.3 Instructor Dashboard — Rebuild with Shared Components
- [ ] Replace raw stat divs with `StatCard` component (3 cards)
- [ ] Fix `totalStudents` and `engagementScore` — currently always null/undefined
- [ ] Replace raw session list divs with `Card` component
- [ ] Replace "View Session Details" raw button with `Button` component
- [ ] Replace `border-gray-100` everywhere with design tokens (`border-brand-border`)
- [ ] Fix session creation modal to include missing fields (description, location/onlineLink, endTime)
- [ ] Add `Skeleton` loader for session list
- [ ] Add `EmptyState` for empty session list

### 3.4 Student Dashboard — Rebuild with Shared Components
- [ ] Replace raw stat/card divs with `StatCard` and `Card` components
- [ ] Remove hardcoded `ongoingTask` — fetch real data from tasks API
- [ ] Remove hardcoded `upcomingMock` — keep API fetch, improve fallback
- [ ] Replace gray circle avatar with `Avatar` component
- [ ] Replace `border-gray-100` with design tokens
- [ ] Add `Skeleton` loaders
- [ ] Add `EmptyState` components

### 3.5 Admin Dashboard — Polish
- [ ] Swap all 4 stat cards to `StatCard` component with **different** icon background colors (blue/violet/emerald/amber — not all `bg-blue-50`)
- [ ] Remove hardcoded fake trends (`+12%`, `+4%`, `3 Upcoming`) or make dynamic
- [ ] Replace inline tab buttons with `Tabs` component
- [ ] Fix chart bar color to use design token
- [ ] Normalize bootcamp modal form to use `FormField` + `Input` + `Select`
- [ ] Normalize session modal form:
  - [ ] Add missing fields: description, location/onlineLink, endTime
  - [ ] Use `FormField` + `Input` + `Select`

### 3.6 Admin ReportsPage — Full Rebuild
- [ ] Delete the inline `StatCard` component definition — use shared `StatCard`
- [ ] Replace raw `bg-white rounded-lg p-6 shadow-sm border` with `Card`
- [ ] Replace raw `bg-blue-600` button with `Button` component
- [ ] Replace report list items with `Card` or `Table`
- [ ] Replace all `text-gray-500`, `bg-blue-50` etc. with design tokens
- [ ] Replace hardcoded stats (`92%`, `99.9%`) with real data or "N/A"
- [ ] Add `Skeleton` loader and `EmptyState`

### 3.7 Admin UsersPage — Minor Fixes
- [ ] Normalize page title styling to match new typography system
- [ ] Humanize button labels: "Provision New User" → "Add User", "Deploy User" → "Create User"
- [ ] Replace inline "Provision New User" `<button>` with shared `Button` component
- [ ] Add division name display instead of raw ID in table
- [ ] Consider adding the `bootcamps[]` field to the user form (backend supports it)

### 3.8 FeedbackForm — Rewrite
- [ ] Replace custom manual overlay with shared `Modal` component
- [ ] Fix `variant="ghost"` → use `variant="secondary"` or add `ghost` variant to Button
- [ ] Replace `<select>` rating picker with a visual star rating component
- [ ] Use `FormField` + `Textarea` for comment
- [ ] Add form validation

### 3.9 Student ProgressPage — Minor Fixes
- [ ] Humanize table headers: "Timeline Sector" → "Week", "Performance Metric" → "Score", "System Status" → "Status", "Registry Remarks" → "Remarks"
- [ ] Replace hardcoded stats (`88.5%`, `02 / 12`, `High`) with real API data
- [ ] Use `StatCard` component for the 3 top cards
- [ ] Use shared `Table` component instead of raw `<table>`
- [ ] Add `Skeleton` and `EmptyState`

### 3.10 Student SubmissionFormPage — Minor Fixes
- [ ] Humanize "Execute Submission" → "Submit"
- [ ] Humanize "Receipt Confirmed" → "Submission Successful"
- [ ] Keep layout — it's already well-designed
- [ ] Update colors to new palette

### 3.11 Login Page — Minor Fixes
- [ ] Simplify labels: "Educational Email" → "Email", "Identity Key" → "Password"
- [ ] Remove "New Researcher?" → "New here?" or "Don't have an account?"
- [ ] Remove role labels at bottom (`ADMIN | INSTRUCTOR | STUDENT`)
- [ ] Add subtle background gradient or pattern for visual warmth
- [ ] Use new `Input` component for email/password fields

### 3.12 Landing Page — Minor Fixes
- [ ] Update colors to new palette
- [ ] Replace "Scholar Interface Preview" placeholder with real content or remove
- [ ] Fix dead footer links (`#Terms`, `#Security`, `#Bylaws`) — remove or link to real pages
- [ ] Keep overall structure — it's the best-designed page

### 3.13 Settings Page — Minor Fixes
- [ ] Update colors to new palette
- [ ] Add "Coming Soon" indicators on non-functional settings
- [ ] Keep design — it's already polished

---

## Phase 4 — Polish & Animation

### 4.1 Micro-Animations
- [ ] Add page transition fade-in via `motion.div` wrapper in `DashboardLayout`
- [ ] Add count-up animation on `StatCard` values
- [ ] Add staggered fade-in on table rows
- [ ] Add entrance animation on `Modal` (scale + opacity)
- [ ] Add subtle pulse on notification badge (Navbar)
- [ ] Add sidebar active item left-border accent glow

### 4.2 Loading & Empty States (sweep all pages)
- [ ] Verify every page that fetches data has a `Skeleton` loader
- [ ] Verify every page that can be empty has an `EmptyState`
- [ ] Verify no page still shows raw `<p>Loading...</p>` text

### 4.3 Responsive Audit
- [ ] Test all pages on mobile viewport (375px)
- [ ] Ensure tables have horizontal scroll wrappers
- [ ] Ensure modals are usable on mobile (not cut off)
- [ ] Ensure sidebar mobile drawer works with new dark styling
- [ ] Ensure landing page is fully responsive

### 4.4 Jargon Cleanup Sweep
- [ ] Search all `.tsx` files for overly technical labels and humanize them
- [ ] Key replacements:
  - "Provision New Identity" → "Add User"
  - "Deploy User" → "Create User"  
  - "Commit Changes" → "Save Changes"
  - "Terminate Session" → "Log Out"
  - "Logout System" → "Log Out"
  - "Execute Submission" → "Submit"
  - "Engagement Vector" → "Engagement"
  - "Progress DNA" → "My Progress"
  - "Timeline Sector" → "Week"
  - "Performance Metric" → "Score"
  - "Registry Remarks" → "Remarks"
  - "Active Pulse" → "Dashboard"
  - "Task Registry" → "Tasks"
  - "Session Hub" → "Sessions"

### 4.5 Final Consistency Check
- [ ] Every page title uses the same typography pattern
- [ ] Every card uses the same `Card` component (no raw `bg-white border rounded-lg`)
- [ ] Every form uses `FormField` + `Input`/`Select`/`Textarea`
- [ ] Every status indicator uses `Badge`
- [ ] Every user avatar uses `Avatar`
- [ ] Every stat display uses `StatCard`
- [ ] Every modal uses the shared `Modal` component
- [ ] Every delete action uses `ConfirmDialog`
- [ ] No hardcoded Tailwind color classes remain (no `text-gray-500`, `bg-blue-50`, `border-gray-100`)
