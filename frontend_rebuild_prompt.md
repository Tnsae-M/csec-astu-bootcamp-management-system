# CSEC-ASTU Bootcamp Management System — Frontend Build Specification

> **Use this file as a prompt to build the entire frontend from scratch.**  
> Stack: React 19 + Vite + TypeScript + zustrand Toolkit + Tailwind CSS v4 + shadcn/ui  
> Backend runs at `http://localhost:5000/api` — every response follows `{ success, message?, data }`.

---

## §1 — PROJECT SCAFFOLD

```
frontend/
├── src/
│   ├── api/             # Axios instance with interceptors
│   │   └── axios.ts
│   ├── app/             # Redux store configuration
│   │   └── store.ts
│   ├── assets/          # Static images, SVGs
│   ├── components/
│   │   ├── common/      # Logo, StatCard, EmptyState, etc.
│   │   ├── layout/      # Sidebar, Navbar, DashboardLayout
│   │   └── ui/          # shadcn/ui primitives (Button, Card, Modal, Input, Badge, Table, Skeleton, FormField, Textarea, DropdownMenu)
│   ├---store
|   |     |-store.js #authstore,divisionStore,....
│   ├── lib/
│   │   └── utils.ts     # cn() helper (clsx + twMerge)
│   ├── pages/
│   │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
│   │   ├── landing/     # LandingPage (public)
│   │   └── dashboard/   # ALL role pages live here — rendered inside DashboardLayout
│   │       ├── DivisionsPage.tsx
│   │       ├── BootcampsPage.tsx
│   │       ├── BootcampDetailPage.tsx   # Tabs: Sessions | Groups | Projects
│   │       ├── SessionDetailPage.tsx    # Tabs: Attendance | Tasks | Submissions | Resources | Feedback
│   │       ├── UsersPage.tsx            # Admin only
│   │       ├── ReportsPage.tsx          # Admin only
│   │       ├── SettingsPage.tsx         # Admin only
│   │       ├── NotificationsPage.tsx
│   │       ├── ProgressPage.tsx         # Student only
│   │       └── OverviewPage.tsx         # Role-aware dashboard home
│   ├── routes/
│   │   └── AppRouter.tsx
│   └── services/        # One file per backend module
│       ├── auth.service.ts
│       ├── users.service.ts
│       ├── divisions.service.ts
│       ├── bootcamps.service.ts
│       ├── sessions.service.ts
│       ├── attendance.service.ts
│       ├── tasks.service.ts
│       ├── submissions.service.ts
│       ├── groups.service.ts
│       ├── enrollments.service.ts
│       ├── feedback.service.ts
│       ├── progress.service.ts
│       └── resources.service.ts
```

> [!IMPORTANT]
> Pages are NOT split by role folder. Every page is shared and uses permission checks internally. The sidebar and routes control what each role can access.

---

## §2 — BACKEND DATA MODELS (Mongoose Schemas)

Build all TypeScript interfaces from these. Every `_id` is a MongoDB ObjectId string.

note: `_id` of every model refer to `objectID` of mongoDB. beware of that.

### User
```ts
interface User {
  _id: string; name: string; email: string;
  role: "super admin" | "admin" | "instructor" | "student";
  status: "active" | "suspended" | "graduated";
  bootcamps: { bootcampId: string }[];
  isEmailVerified: boolean;
}
```

### Division
```ts
interface Division {
  _id: string; name: string; description: string;
  createdBy: string | User;
}
```

### Bootcamp
```ts
interface Bootcamp {
  _id: string; name: string;
  divisionId: string | Division;
  startDate: string; endDate: string;
  createdBy: string | User;
  instructors: (string | User)[];
  status: "upcoming" | "active" | "completed";
}
```

### Session
```ts
interface Session {
  _id: string; title: string; description?: string;
  bootcamp: string | Bootcamp;
  instructor?: string | User;
  location?: string; onlineLink?: string;
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime — duration must be >= 30 min
  status: "scheduled" | "cancelled" | "completed";
}
```

### Attendance
```ts
interface Attendance {
  _id: string;
  userId: string | User;
  sessionId: string | Session;
  bootcampId: string | Bootcamp;
  status: "present" | "absent" | "late";
  markedBy: string | User;
}
```

### Task
```ts
interface Task {
  _id: string; title: string; description?: string;
  bootcampId: string | Bootcamp;
  sessionId?: string | Session;
  dueDate: string; maxScore: number;
  createdBy: string | User;
}
```

### Submission
```ts
interface Submission {
  _id: string;
  taskId: string | Task;
  studentId: string | User;
  content?: string; fileUrl?: string;
  submittedAt: string;
  status: "submitted" | "late" | "graded";
  score?: number; feedback?: string;
  gradedBy?: string | User;
}
// Unique index: { taskId, studentId }
```

### Group
```ts
interface Group {
  _id: string; name: string;
  bootcampId: string | Bootcamp;
  members: (string | User)[];
  mentor?: string | User;
  createdBy: string | User;
}
```

### Enrollment
```ts
interface Enrollment {
  _id: string;
  userId: string | User;
  bootcampId: string | Bootcamp;
  status: "active" | "completed" | "dropped";
  enrolledAt: string;
}
```

### Feedback
```ts
interface Feedback {
  _id: string;
  studentId: string | User;
  bootcampId?: string; sessionId?: string; instructorId?: string;
  rating: number; // 1–5
  comment?: string; isAnonymous: boolean;
}
// Unique index: { studentId, bootcampId, sessionId }
```

### Notification
```ts
interface Notification {
  _id: string;
  type: "session_created" | "session_cancelled" | "task_reminder" | "submission_graded" | "weekly_progress_alert";
  title: string; message: string;
  recipient: string | User;
  is_read: boolean;
  related_id?: string;
  channels: { inApp: boolean; email: boolean };
  metadata?: { sessionId?: string; taskId?: string; submissionId?: string };
}
```
### Resources
```ts
interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: "document" | "link" | "other";
  url?: string;
  fileUrl?: string;
  bootcampId: string | Bootcamp;
  sessionId?: string | Session;
  createdBy: string | User;
}
```

### Progress (computed — no model, returned by service)
```ts
interface ProgressReport {
  attendanceRate: number;     // 0–100
  taskCompletionRate: number; // 0–100
  avgScore: number;           // 0–100
  overallProgress: number;    // weighted: attendance*0.3 + tasks*0.4 + score*0.3
}
```

---

## §3 — API ENDPOINTS (Complete Reference)

Every service file wraps these. All services must return `response.data` (unwrap Axios).

### Auth
| Method | URL | Auth | Body/Params |
|---|---|---|---|
| POST | `/auth/register` | None | `{ name, email, password, role? }` |
| POST | `/auth/login` | None | `{ email, password }` → `{ data: { accessToken, refreshToken, user } }` |
| POST | `/auth/refresh` | None | `{ refreshToken }` |
| GET | `/auth/me` | Bearer | — |

### Users
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/users` | Admin | `{ name, email, password, role, status?, bootcamps? }` |
| GET | `/users?role=&status=` | Admin | Filter by role/status |
| GET | `/users/:id` | Admin | Single user |
| PUT | `/users/:id` | Admin | Update (no password) |

### Divisions
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/divisions` | Admin | `{ name, description }` |
| GET | `/divisions` | Any | All divisions |
| GET | `/divisions/:id` | Any | Single |
| PUT | `/divisions/:id` | Admin | `{ name?, description? }` |
| DELETE | `/divisions/:id` | Admin | — |
| GET | `/divisions/:divisionId/bootcamps` | Any | Bootcamps under division |
| POST | `/divisions/:divisionId/bootcamps` | Admin | Create bootcamp |

### Bootcamps
| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/bootcamps/:id` | Any | Single bootcamp |
| PUT | `/bootcamps/:id` | Admin | Update |
| DELETE | `/bootcamps/:id` | Admin | Delete |

### Sessions
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/sessions` | Admin/Instructor | `{ title, bootcamp, instructor?, location?, onlineLink?, startTime, endTime, status? }` |
| GET | `/sessions` | Any | All sessions |
| GET | `/sessions/bootcamp/:bootcampId` | Any | By bootcamp |
| PUT | `/sessions/:id` | Admin/Instructor | Update |
| DELETE | `/sessions/:id` | Admin | Delete |

### Attendance
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/attendance` | Admin/Instructor | `{ userId, sessionId, bootcampId, status }` |
| GET | `/attendance/session/:sessionId` | Any | Records for session |
| GET | `/attendance/me` | Any | My records |

### Tasks
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/tasks` | Admin/Instructor | `{ title, description?, bootcampId, sessionId?, dueDate, maxScore?, createdBy }` |
| GET | `/tasks/bootcamp/:bootcampId` | Any | Tasks for bootcamp |
| GET | `/tasks/:id` | Any | Single task |
| PUT | `/tasks/:id` | Admin/Instructor | Update |
| DELETE | `/tasks/:id` | Admin | Delete |

### Submissions
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/submissions` | Student | `{ taskId, content?, fileUrl? }` |
| GET | `/submissions/me` | Student | My submissions |
| GET | `/submissions/task/:taskId` | Admin/Instructor | All for a task |
| PUT | `/submissions/:id/grade` | Admin/Instructor | `{ score, feedback, status:"graded" }` |

### Groups
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/groups` | Admin/Instructor | `{ name, bootcampId, members?, mentor? }` |
| GET | `/groups/bootcamp/:bootcampId` | Any | By bootcamp |
| PUT | `/groups/:id/add` | Admin/Instructor | `{ userId }` |
| PUT | `/groups/:id/remove/:userId` | Admin/Instructor | Remove member |
| DELETE | `/groups/:id` | Admin | Delete |

### Enrollments
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/enrollments` | Admin/Instructor | `{ userId, bootcampId }` |
| GET | `/enrollments/bootcamp/:id` | Admin/Instructor | Bootcamp roster |
| GET | `/enrollments/me` | Any | My enrollments |
| PUT | `/enrollments/:id` | Admin | Update status |

### Feedback
| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/feedback` | Student | `{ studentId, bootcampId?, sessionId?, instructorId?, rating, comment?, isAnonymous }` |
| GET | `/feedback/bootcamp/:id` | Admin/Instructor | — |
| GET | `/feedback/instructor/:id` | Admin/Instructor | — |

### Progress
| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/progress/:bootcampId/me` | Any | Returns `{ attendanceRate, taskCompletionRate, avgScore, overallProgress }` |

---

## §4 — DESIGN SYSTEM

### Color Palette (CSS Custom Properties)
```css
:root {
  --brand-primary: hsl(225, 25%, 97%);      /* Page background */
  --brand-sidebar: hsl(225, 30%, 15%);       /* Dark sidebar */
  --brand-accent: hsl(225, 73%, 57%);        /* Sapphire Blue — primary action */
  --brand-secondary: hsl(262, 60%, 58%);     /* Electric Violet — highlights */
  --brand-border: hsl(225, 20%, 90%);        /* Subtle borders */
  --brand-card: #ffffff;                      /* Card backgrounds */
  --text-main: hsl(225, 30%, 20%);           /* Primary text */
  --text-muted: hsl(225, 15%, 45%);          /* Secondary text */
  --success: hsl(152, 60%, 45%);
  --warning: hsl(38, 92%, 55%);
  --danger: hsl(0, 72%, 56%);
  --info: hsl(199, 89%, 55%);
}
```

### Typography
- Font: `Inter` for body, `JetBrains Mono` for code/badges
- Labels: `text-[10px] font-black uppercase tracking-widest text-text-muted`
- Headings: `text-3xl font-black tracking-tight uppercase`

### Component Patterns
- **All forms** must use `<FormField>` + `<Input>` / `<Textarea>` from shadcn/ui — never raw `<input>` or `<select>` with plain `border p-2` classes
- **All modals** must use the shared `<Modal>` component with `title`, `subtitle`, `icon` props
- **All selects** use: `className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none"`
- **Cards** use the `geo-card` utility: `bg-brand-card border border-brand-border rounded-xl shadow-sm`
- **Status badges** use `<Badge variant="default|secondary|destructive|outline">`

---

## §5 — NAVIGATION FLOW (The Core Architecture)

### Main Flow (Hierarchical Drill-Down)
```
Divisions → Bootcamps → BootcampDetail
                              ├── Sessions Tab → SessionDetail
                              │                     ├── Attendance
                              │                     ├── Tasks
                              │                     ├── Submissions
                              │                     ├── Resources
                              │                     └── Feedback
                              ├── Groups Tab
                              └── Projects Tab
```

### Route Structure
```
/                                          → LandingPage
/login                                     → Login
/dashboard                                 → OverviewPage (role-aware home)
/dashboard/divisions                       → DivisionsPage
/dashboard/divisions/:divisionId/bootcamps → BootcampsPage
/dashboard/divisions/:divisionId/bootcamps/:bootcampId → BootcampDetailPage
/dashboard/divisions/:divisionId/bootcamps/:bootcampId/sessions/:sessionId → SessionDetailPage
/dashboard/users                           → UsersPage (admin only)
/dashboard/reports                         → ReportsPage (admin only)
/dashboard/notifications                   → NotificationsPage
/dashboard/progress                        → ProgressPage (student only)
/dashboard/settings                        → SettingsPage (admin only)
```

> [!IMPORTANT]
> Routes are NOT prefixed with `/dashboard/admin/` or `/dashboard/student/`. All roles share the same routes. Access is controlled by the `ProtectedRoute` component checking `user.role`.

---
## navbar
navbar should have:
logo   - logo of the organization with text
🔔     → /dashboard/notifications
👤     → /dashboard/profile

## §6 — SIDEBAR DESIGN (Multi-Role with Quick Access)

The sidebar has TWO sections per role:

1. **Main Flow** — The hierarchical navigation icons (the primary drill-down path)
2. **Quick Access** — Shortcut links that jump to specific points in the main flow

### Admin and Super Admin Sidebar
```
─── MAIN FLOW ───
🏠 Overview          → /dashboard
🏛 Divisions          → /dashboard/divisions         (entry point to the flow)
👥 Users              → /dashboard/users
📊 Reports            → /dashboard/reports
⚙️ Settings           → /dashboard/settings

─── QUICK ACCESS ───
💬 Feedback Overview  → /dashboard/feedback
```

### Instructor Sidebar
```
─── MAIN FLOW ───
🏠 Overview          → /dashboard
🏛 Divisions          → /dashboard/divisions
📋 My Tasks           → /dashboard/tasks
📝 Submissions        → /dashboard/submissions

─── QUICK ACCESS ───
📅 My Sessions        → /dashboard/sessions
✅ Attendance          → /dashboard/attendance
👥 My Groups          → /dashboard/groups
💬 My Feedback        → /dashboard/feedback
```

### Student Sidebar
```
─── MAIN FLOW ───
🏠 Overview          → /dashboard
🏛 Divisions          → /dashboard/divisions
📋 My Tasks           → /dashboard/tasks
📈 My Progress        → /dashboard/progress

─── QUICK ACCESS ───
📤 Submit Work        → /dashboard/submit
👥 My Group           → /dashboard/groups
💬 Give Feedback      → /dashboard/feedback
```

### Visual Design
- Main Flow icons: **larger, with label, full-width row**, accent-colored active state
- Quick Access icons: **smaller, compact grid or smaller list**, muted color, with a subtle separator label "QUICK ACCESS" above them
- Active state: `bg-brand-accent text-white` with a left border indicator
- Hover: `bg-brand-accent/10 text-brand-accent`

---

## §7 — PAGE SPECIFICATIONS

### OverviewPage (Dashboard Home)
- **Role-aware**: Show different stat cards per role
- **Admin**: Total users, divisions, active bootcamps, total sessions (all from API)
- **Instructor**: My sessions count, pending submissions, avg feedback rating
- **Student**: My attendance count, my tasks count, my feedback count
- Include a Recharts bar/area chart (sessions over time or attendance trends)
- **NO hardcoded mock data** — every number comes from API

### DivisionsPage
- Grid of division cards with name + description
- Admin: Create/Edit/Delete buttons
- Click → navigates to `/dashboard/divisions/:id/bootcamps`

### BootcampsPage
- Shows bootcamps under the selected division
- Admin: Create bootcamp modal with `{ name, startDate, endDate, instructors[], status }`
- Card shows: name, date range, status badge, instructor count
- Click → navigates to BootcampDetailPage

### BootcampDetailPage
- **3 tabs**: Sessions | Groups | Projects
- Each tab has its own Create button (admin/instructor only)
- **Sessions tab**: Card grid, click → SessionDetailPage
- **Groups tab**: Card with members list, add/remove member modals
- **Projects tab**: Card grid (future feature, basic CRUD)

### SessionDetailPage
- **5 tabs**: Attendance | Tasks | Submissions | Resources | Feedback
- Header shows session title, date, time, instructor, location, status
- Each tab renders its own sub-component with full CRUD

### Attendance Tab
- Table: Student name | Status (dropdown: present/absent/late) | Marked By | Timestamp
- Instructor/Admin: Status dropdown per row to mark attendance
- Student: Read-only view of their own record
- Payload: `{ userId, sessionId, bootcampId, status }`

### Tasks Tab
- Card grid of tasks for this session's bootcamp, filtered by sessionId
- Create/Edit modal: title, description, bootcamp (pre-filled), session (pre-filled), dueDate, maxScore
- Student: "Submit" button → navigate to submit page
- Instructor: "View Submissions" button

### Submissions Tab (Instructor View)
- Table: Student | Task | Status | Score | Actions
- "Grade" button opens modal with: score (number), feedback (textarea), status (select: graded/submitted)
- **Must use design system components** — FormField, Input, Textarea, Button

### Resources Tab
- Card list of uploaded resources with download button
- Instructor: Upload modal (title, description, file — accept PDF/video/image/zip)
- Download via blob URL

### Feedback Tab
- Card grid showing anonymous feedback with star rating + comment
- Student: "Give Feedback" button opens FeedbackForm modal
- FeedbackForm: rating (1–5 star selector), comment textarea, anonymous checkbox
- **Must use Modal + FormField components** — not raw HTML

### UsersPage (Admin Only)
- Table with columns: Name, Email, Role, Status, Actions
- Create user modal: name, email, password, role dropdown, status dropdown
- Edit modal (same fields, no password)

### ReportsPage (Admin Only)
- Stat cards: Total divisions, bootcamps, sessions, users (from API)
- Chart: Sessions per division, attendance rates
- **Must use brand design tokens** — no `bg-blue-600` or `text-gray-500`

### NotificationsPage
- List of notifications from API (not hardcoded)
- Unread: accent left border + highlight
- Mark as read / Mark all as read buttons
- Icon per type: session_created → Calendar, task_reminder → Clock, etc.

### ProgressPage (Student Only)
- Fetches from `GET /progress/:bootcampId/me`
- 4 stat cards: Attendance Rate, Task Completion, Avg Score, Overall Progress
- Progress bars for each metric
- **Must call `dispatch(fetchMyProgress(bootcampId))` on mount**

---

## §8 — STATE MANAGEMENT (Redux Toolkit)

### Store Shape
```ts
{
  auth:          { user, token, loading, error }
  divisions:     { items[], loading, error }
  bootcamps:     { items[], loading, error }
  sessions:      { items[], loading, error }
  attendance:    { records[], loading, error }
  tasks:         { tasks[], submissions[], selectedSubmissions[], loading, error }
  groups:        { groups[], loading, error }
  enrollments:   { enrollments[], loading, error }
  feedback:      { feedbacks[], loading, error }
  progress:      { report: ProgressReport | null, loading, error }
  notifications: { items[], loading, error }
  reports:       { data: any, loading, error }
  users:         { users[], loading, error }
  ui:            { searchTerm, sidebarOpen }
}
```

### Key Rules
1. Every slice uses `createAsyncThunk` with `rejectWithValue` for error handling
2. Every thunk catches `error.response?.data?.message || error.message`
3. Services return `response.data` (single unwrap) — slices access `.data` from that
4. Toast notifications via `sonner` on success/failure — `toast.success()` / `toast.error()`

---

## §9 — CRITICAL RULES (Avoid Past Mistakes)

> [!CAUTION]
> These are the exact bugs found in the previous frontend. DO NOT repeat them.

1. **Session form fields**: Backend expects `{ bootcamp, startTime, endTime, location }`. NOT `{ bootcampId, time, durationH }`.
2. **No double-unwrap**: Services return `response.data`. In components, use `res.data` not `res.data.data`.
3. **No hardcoded mock data**: Every stat, count, notification MUST come from API calls.
4. **No raw HTML forms**: Every `<input>`, `<select>`, `<textarea>` must use shadcn/ui components with design tokens.
5. **No dead links**: Every sidebar item and dropdown item must have a working route.
6. **No role-specific route prefixes**: Use `/dashboard/divisions` not `/dashboard/admin/divisions`.
7. **Attendance status**: Support all 3 values — `present`, `absent`, `late`. Not just "present".
8. **FeedbackForm**: Must use `<Modal>` component, not a custom `<div className="fixed">` overlay.
9. **Consistent icon imports**: Use `lucide-react` exclusively.
10. **User role field**: Backend stores `role` as a single string (not an array). Access as `user.role`, not `user.roles[0]`.
