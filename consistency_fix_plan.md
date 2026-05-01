# BMS Frontend Consistency Fix Plan

> **Purpose:** Detailed problem → cause → fix guide for every issue found in the SRS audit.  
> **Structure:** Each fix has: Problem, File, Offending Code, and How To Fix.

---

## 🔴 CRITICAL FIXES (2)

---

### Fix #1 — Instructor Dashboard Session Form Sends Wrong Fields

**Problem:** When an instructor creates a session from their dashboard, it sends `{ bootcampId, time }` but the backend expects `{ bootcamp, startTime, durationH, location }`. The session **silently fails** to create.

**File:** [Instructor Dashboard.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/instructor/Dashboard.tsx)

**Offending Code (Line 42):**
```ts
const [form, setForm] = useState({ title: '', bootcampId: '', date: '', time: '' });
```

**Also the form JSX (Lines 191–208):** The `<select>` binds to `form.bootcampId` and the time input binds to `form.time`. There's no `durationH` or `location` field.

**How To Fix:**
1. Change the state shape on line 42:
```ts
const [form, setForm] = useState({ 
  title: '', bootcamp: '', date: '', startTime: '', durationH: 1, instructor: '', location: 'TBD' 
});
```
2. Update all form inputs in the JSX (lines 191–208):
   - Change `form.bootcampId` → `form.bootcamp` in the select's `value` and `onChange`
   - Change `form.time` → `form.startTime`
   - Add two new `<FormField>` inputs for `durationH` (number, step 0.5) and `location` (text)
3. This matches the pattern already used in the Admin Dashboard session modal (line 65 of admin/Dashboard.tsx).

---

### Fix #2 — TasksPage Double-Unwraps Session Data

**Problem:** Sessions service already returns `response.data`, but TasksPage tries `res.data.data` which will be `undefined` — causing an empty sessions dropdown in the task creation form.

**File:** [TasksPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/tasks/TasksPage.tsx)

**Offending Code (Line 83):**
```ts
sessionsService.getSessions().then((res) => setAllSessions(res.data.data || []));
```

**How To Fix:** Change to single unwrap:
```ts
sessionsService.getSessions().then((res) => setAllSessions(res.data || []));
```

---

## 🟠 HIGH PRIORITY FIXES (5)

---

### Fix #3 — Admin Sidebar Missing 6 Navigation Links

**Problem:** Admin users can only see 4 links (Overview, Divisions, User Directory, System Reports) but routes exist for Sessions, Bootcamps, Groups, Feedback, Notifications, and Settings. These pages are unreachable without typing URLs.

**File:** [Sidebar.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/components/layout/Sidebar.tsx)

**Offending Code (Lines 54–69):** The `menuConfig.ADMIN` array:
```ts
ADMIN: [
  { type: "separator", label: "Operations" },
  { to: "/dashboard/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/admin/divisions", icon: Building2, label: "Divisions" },
  { to: "/dashboard/admin/users", icon: UserCheck, label: "User Directory" },
  { type: "separator", label: "Analytics" },
  { to: "/dashboard/admin/reports", icon: BarChart3, label: "System Reports" },
],
```

**How To Fix:** Add the missing links. Suggested structure:
```ts
ADMIN: [
  { type: "separator", label: "Operations" },
  { to: "/dashboard/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/admin/divisions", icon: Building2, label: "Divisions" },
  { to: "/dashboard/admin/users", icon: UserCheck, label: "User Directory" },
  { to: "/dashboard/admin/groups", icon: Users2, label: "Groups" },
  { type: "separator", label: "Academics" },
  { to: "/dashboard/admin/sessions", icon: Calendar, label: "Sessions" },
  { to: "/dashboard/admin/feedback", icon: MessageCircle, label: "Feedback" },
  { type: "separator", label: "Analytics" },
  { to: "/dashboard/admin/reports", icon: BarChart3, label: "System Reports" },
  { to: "/dashboard/admin/notifications", icon: Bell, label: "Notifications" },
  { to: "/dashboard/admin/settings", icon: Settings, label: "Settings" },
],
```
Also do the same for `SUPER ADMIN` (lines 70–93). Note: `Calendar`, `Bell`, `Settings` icons are already imported at the top of the file.

---

### Fix #4 — Instructor Sidebar Missing 6 Navigation Links

**Problem:** Same issue — Instructor can't reach Divisions, Attendance, Resources, Submissions, Feedback, Notifications.

**File:** [Sidebar.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/components/layout/Sidebar.tsx)

**Offending Code (Lines 94–122):** `menuConfig.INSTRUCTOR` only has 5 items.

**How To Fix:** Add:
```ts
{ to: "/dashboard/instructor/attendance", icon: UserCheck, label: "Attendance" },
{ to: "/dashboard/instructor/resources", icon: FileText, label: "Resources" },
{ to: "/dashboard/instructor/submissions", icon: ClipboardList, label: "Submissions" },
{ to: "/dashboard/instructor/feedback", icon: MessageCircle, label: "Feedback" },
{ to: "/dashboard/instructor/notifications", icon: Bell, label: "Alerts" },
```
Icons `FileText`, `ClipboardList`, `Bell` are already imported.

---

### Fix #5 — Student Sidebar Missing 5 Navigation Links

**Problem:** Student can't reach Attendance, Resources, Feedback, Notifications, or Submit page from sidebar.

**File:** [Sidebar.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/components/layout/Sidebar.tsx)

**Offending Code (Lines 123–153):** `menuConfig.STUDENT` only has 6 items.

**How To Fix:** Add under "Daily Activity":
```ts
{ to: "/dashboard/student/attendance", icon: UserCheck, label: "Attendance" },
{ to: "/dashboard/student/resources", icon: FileText, label: "Resources" },
{ to: "/dashboard/student/submit", icon: ClipboardList, label: "Submit Work" },
{ to: "/dashboard/student/feedback", icon: MessageCircle, label: "Feedback" },
{ to: "/dashboard/student/notifications", icon: Bell, label: "Alerts" },
```

---

### Fix #6 — Instructor SubmissionsPage Grade Modal is Unstyled

**Problem:** The grade modal uses raw HTML `<input className="w-full border p-2">` and `<select className="w-full border p-2">` instead of design system components. It looks like a prototype.

**File:** [SubmissionsPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/instructor/SubmissionsPage.tsx)

**Offending Code (Lines 216–255):**
```tsx
<input type="number" value={gradeData.grade} onChange={...} className="w-full border p-2" />
<textarea placeholder="Feedback" value={gradeData.feedback} onChange={...} className="w-full border p-2" />
<select value={gradeData.status} onChange={...} className="w-full border p-2">
```

**How To Fix:**
1. Import `FormField`, `Input`, `Textarea` from `@/components/ui`
2. Replace the raw elements with:
```tsx
<FormField label="Score" required>
  <Input type="number" value={gradeData.grade} onChange={...} />
</FormField>
<FormField label="Feedback">
  <Textarea value={gradeData.feedback} onChange={...} rows={4} />
</FormField>
<FormField label="Status">
  <select className="w-full px-4 py-2.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm font-medium outline-none focus:border-brand-accent" ...>
```
3. Also update the Submit button from `<Button type="submit">Submit</Button>` to include proper styling:
```tsx
<div className="flex gap-3 pt-4">
  <Button variant="outline" className="flex-1" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
  <Button type="submit" className="flex-1">Finalize Grade</Button>
</div>
```

---

### Fix #7 — FeedbackForm Component is Unstyled

**Problem:** The feedback form modal uses plain browser-default `<select>`, `<textarea>` styling. Looks completely different from every other modal.

**File:** [FeedbackForm.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/components/feedback/FeedbackForm.tsx)

**Offending Code (Lines 58–84):** The entire modal body uses `className="w-full border px-3 py-2 rounded-md"`.

**How To Fix:**
1. Replace the outer `<div>` wrapper with the `<Modal>` component from `@/components/ui`
2. Wrap form fields in `<FormField>` with proper labels
3. Replace `<select>` class with the design-system select styling: `className="w-full px-4 py-2.5 bg-brand-primary/40 border border-transparent rounded-lg text-sm font-medium outline-none focus:border-brand-accent"`
4. Replace the `<textarea>` with `<Textarea>` from UI components
5. Use star-rating UI instead of a plain dropdown (optional but recommended)

---

### Fix #8 — ReportsPage Uses Different Design Language

**Problem:** ReportsPage defines its own local `StatCard`, uses `bg-blue-600` button, `text-gray-500` text, and plain `<button>` instead of the design system.

**File:** [ReportsPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/admin/ReportsPage.tsx)

**Offending Code (Lines 8–23):** Local `StatCard` component with `bg-blue-50`, `text-gray-500`.  
**Also Line 62:** `<button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">`

**How To Fix:**
1. Delete the local `StatCard` component (lines 8–23)
2. Import `{ StatCard, Button, Card, Skeleton }` from `@/components/ui`
3. Replace the header to match the app pattern:
```tsx
<h1 className="text-3xl font-black text-text-main uppercase tracking-tight">System Reports</h1>
<p className="text-sm text-text-muted mt-1 font-medium italic">...</p>
```
4. Replace `<button className="bg-blue-600...">` with `<Button onClick={handleGenerate}><FileText .../> Generate</Button>`
5. Use `text-text-muted` instead of `text-gray-500`, `border-brand-border` instead of `border`, etc.
6. Wrap content sections in `<Card className="border-none bg-white">` to match other pages

---

## 🟡 MEDIUM PRIORITY FIXES (5)

---

### Fix #9 — ProgressPage Never Fetches Data

**Problem:** The page reads from `state.progress.reports` but never dispatches `fetchMyProgress()`. All 3 stat cards are hardcoded ("88.5%", "02 / 12", "High").

**File:** [ProgressPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/student/ProgressPage.tsx)

**Offending Code:** No `useEffect` exists. Lines 23–34 show hardcoded values.

**How To Fix:**
1. Add imports: `import { useDispatch } from 'react-redux'` and `import { fetchMyProgress } from '../../features/progress/progressSlice'`
2. Add a dispatch call (needs a bootcampId — get it from enrollments or a route param):
```tsx
const dispatch = useDispatch() as any;
useEffect(() => {
  // You'll need a bootcampId — either from props, route params, or first enrollment
  if (bootcampId) dispatch(fetchMyProgress(bootcampId));
}, [dispatch, bootcampId]);
```
3. Replace hardcoded stat values with computed values from `reports` array
4. Add loading/empty states using `<Skeleton>` and `<EmptyState>`

---

### Fix #10 — Attendance Page Only Supports "Present"

**Problem:** SRS requires Present/Absent/Late/Excused statuses, but the Mark button only sends `status: "present"`.

**File:** [AttendancePage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/shared/AttendancePage.tsx)

**Offending Code (Lines 54–58):**
```ts
const data = { userId, sessionId, status: "present" };
```

**How To Fix:**
1. Add a status selector per student row — either a dropdown or button group with 4 options
2. Pass the selected status to `markAttendanceAsync`:
```tsx
<select onChange={(e) => handleMarkAttendance(studentId, e.target.value)}>
  <option value="present">Present</option>
  <option value="late">Late</option>
  <option value="absent">Absent</option>
  <option value="excused">Excused</option>
</select>
```
3. Update `handleMarkAttendance` to accept a `status` parameter
4. If "excused" is selected, show a note input (SRS: "Excused requires note")

---

### Fix #11 — Navbar Profile/Logout Links Go Nowhere

**Problem:** The navbar user dropdown has "Profile Settings" → `/dashboard/profile` and "Log out" → `/logout`. Neither route exists.

**File:** [Navbar.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/components/layout/Navbar.tsx)

**Offending Code (Lines 153–158):**
```tsx
<DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>Profile Settings</DropdownMenuItem>
<DropdownMenuItem onClick={() => navigate("/logout")}>Log out</DropdownMenuItem>
```

**How To Fix:**
1. For "Log out": Import `logout` from authSlice and dispatch it:
```tsx
<DropdownMenuItem onClick={() => { dispatch(logout()); navigate('/'); }}>Log out</DropdownMenuItem>
```
2. For "Profile Settings": Either create a `/dashboard/profile` route + page, or remove the menu item and replace with the admin settings link:
```tsx
<DropdownMenuItem onClick={() => navigate("/dashboard/admin/settings")}>Settings</DropdownMenuItem>
```

---

### Fix #12 — Register Page Contradicts SRS

**Problem:** SRS §4.1 says "Admin creates users (no self-registration)" but a Register page exists at `/register`, and the Login page links to it.

**Files:**
- [Register.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/auth/Register.tsx)
- [Login.tsx L130](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/auth/Login.tsx#L130)
- [AppRouter.tsx L115](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/routes/AppRouter.tsx#L115)

**How To Fix (choose one):**
- **Option A (Enforce SRS):** Remove the `/register` route from AppRouter.tsx line 115, and remove the "Register here" link from Login.tsx line 130.
- **Option B (Update SRS):** If you want self-registration, update SRS §4.1 to allow it and add an approval workflow.

---

### Fix #13 — SettingsPage is Fully Static

**Problem:** Every value is hardcoded ("CSEC Portal", "24 Hours", "Hourly"). The "Commit Changes" and "Configure" buttons do nothing.

**File:** [SettingsPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/admin/SettingsPage.tsx)

**Offending Code (Lines 6–33):** All field values are hardcoded strings.

**How To Fix:**
- If you plan to build a settings API: Convert fields to `useState`, add `onChange` handlers, wire "Commit Changes" to a `PUT /api/settings` call.
- If not planned for MVP: Add a banner at the top: `"Settings management coming soon"` and disable the buttons with `disabled` prop.

---

## 🟢 LOW PRIORITY FIXES (3)

---

### Fix #14 — Resource Upload Only Accepts PDF

**Problem:** SRS §4.5 says "Upload types: PDF, Video, Image, ZIP" but the upload input restricts to PDF only.

**File:** [ResourcesPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/shared/ResourcesPage.tsx)

**Offending Code (Line 178):**
```tsx
<input accept="application/pdf" onChange={...} type="file" />
```

**How To Fix:** Expand the accept attribute:
```tsx
<input accept="application/pdf,video/*,image/*,.zip,.rar" onChange={...} type="file" />
```
Also update the label from "File (PDF)" to "File" and the file-type badge in the resource card (line 142) to show actual file type instead of hardcoded "PDF".

---

### Fix #15 — No Submission Version History

**Problem:** SRS §4.7 says "Resubmission allowed (version tracking)" but students see no history of past submissions.

**File:** [SubmissionFormPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/student/SubmissionFormPage.tsx)

**How To Fix:** In the "Recent Activity" sidebar (lines 308–331), enhance each submission entry to show:
- Submission date
- Link/file that was submitted
- Grade received (if graded)
- A "Resubmit" button for returned submissions

---

### Fix #16 — No Group Size Validation

**Problem:** SRS §4.9 says "Group size: 2–8 students" but no validation exists.

**File:** [GroupsPage.tsx](file:///c:/Users/ThinkPad/Documents/_web_dev_files/CSEC-DEV/csec-astu-bms-project/frontend/src/pages/shared/GroupsPage.tsx)

**Offending Code (Line 68):** `handleCreateGroup` submits without checking member count.

**How To Fix:** Add validation before dispatch:
```ts
if (formData.members.length < 2 || formData.members.length > 8) {
  toast.error('Groups must have between 2 and 8 members');
  return;
}
```

---

## Quick Reference: Files Changed Per Fix

| Fix | File(s) |
|---|---|
| #1 | `pages/instructor/Dashboard.tsx` |
| #2 | `pages/tasks/TasksPage.tsx` |
| #3–5 | `components/layout/Sidebar.tsx` |
| #6 | `pages/instructor/SubmissionsPage.tsx` |
| #7 | `components/feedback/FeedbackForm.tsx` |
| #8 | `pages/admin/ReportsPage.tsx` |
| #9 | `pages/student/ProgressPage.tsx` |
| #10 | `pages/shared/AttendancePage.tsx` |
| #11 | `components/layout/Navbar.tsx` |
| #12 | `pages/auth/Register.tsx` + `routes/AppRouter.tsx` + `pages/auth/Login.tsx` |
| #13 | `pages/admin/SettingsPage.tsx` |
| #14 | `pages/shared/ResourcesPage.tsx` |
| #15 | `pages/student/SubmissionFormPage.tsx` |
| #16 | `pages/shared/GroupsPage.tsx` |
