## Plan: Role-based Division → Bootcamp → Session Flow

TL;DR: We will replace the current flat role sidebar with a hierarchical role-aware navigation that starts at `Divisions`, opens into `Bootcamps`, then exposes bootcamp-level `Groups` and `Sessions`. Each session then exposes `Attendance`, `Tasks`, and `Submissions` for the correct roles. This will be implemented in a clean frontend-first way while preserving backend integration points.

### Clarifications

- `Groups` belong at the bootcamp level only.
- `Sessions` expose `Attendance`, `Tasks`, and `Submissions`.
- `Submissions` are student-specific; instructors use `SubmissionsPage` while students use `SubmissionFormPage`.
- `Super Admin` is a more privileged admin role that can create divisions and see extra dashboard metrics, while the rest of the flow remains admin-like.
- Bootcamps are created per division and do not cross divisions.
- Current work is frontend-only; backend should remain untouched unless a missing data contract is documented clearly.

### High-level flow

- `Divisions`
  - `Bootcamps`
    - `Groups`
    - `Sessions`
      - `Attendance`
      - `Tasks`
      - `Submissions`

### Updated route hierarchy

- `/dashboard/{role}/divisions`
- `/dashboard/{role}/divisions/:divisionId/bootcamps`
- `/dashboard/{role}/divisions/:divisionId/bootcamps/:bootcampId/groups`
- `/dashboard/{role}/divisions/:divisionId/bootcamps/:bootcampId/sessions`
- `/dashboard/{role}/divisions/:divisionId/bootcamps/:bootcampId/sessions/:sessionId/attendance`
- `/dashboard/{role}/divisions/:divisionId/bootcamps/:bootcampId/sessions/:sessionId/tasks`
- `/dashboard/{role}/divisions/:divisionId/bootcamps/:bootcampId/sessions/:sessionId/submissions`

### Steps

1. Clarify the final flow and role-specific permissions.
   - Confirm that the canonical experience is `Divisions` → `Bootcamps` → `{Groups, Sessions}`.
   - Confirm that `Groups` appear only at bootcamp level.
   - Confirm that session actions are `Attendance`, `Tasks`, and `Submissions`.
   - Confirm that `Super Admin` is a privilege-level extension of Admin, with division creation and dashboard metrics access.

2. Audit current frontend structure.
   - `frontend/src/routes/AppRouter.tsx` defines all current top-level role routes.
   - `frontend/src/components/layout/Sidebar.tsx` holds the role menu configuration and currently uses static links.
   - `frontend/src/components/layout/DashboardLayout.tsx` provides the shell for sidebar + navbar + page content.
   - `frontend/src/pages/*` contains existing page components that can be reused.

3. Design the navigation.
   - Keep the sidebar focused on top-level role entries, especially `Divisions`.
   - Avoid pre-populating all nested bootcamps/sessions in the sidebar.
   - Use page-level drill-down and breadcrumbs to display the current path.
   - For Instructor/Student, filter visible divisions to what the user is authorized to access.

4. Build reusable frontend components.
   - Create entity cards/list items:
     - `DivisionCard`
     - `BootcampCard`
     - `GroupCard`
     - `SessionCard`
   - Create detail pages:
     - `DivisionDetailPage` or `BootcampDetailPage`
     - `SessionDetailPage`
   - Create `SessionDetailNav` for `Attendance`, `Tasks`, and `Submissions` navigation.
   - Reuse `SubmissionFormPage` for student submissions.

5. Implement route and page behavior.
   - Render bootcamp-level `Groups` alongside session lists within a bootcamp detail view.
   - Render session actions only after a session is selected.
   - Keep the `Divisions` page shared, with role-based access control for create/update/delete actions.

6. Define frontend backend contract (frontend-only planning).
   - Expected endpoints:
     - `GET /divisions` or `GET /divisions?role=...`
     - `GET /divisions/:divisionId/bootcamps`
     - `GET /bootcamps/:bootcampId/groups`
     - `GET /bootcamps/:bootcampId/sessions`
     - `GET /sessions/:sessionId/attendance`
     - `GET /sessions/:sessionId/tasks`
     - `GET /sessions/:sessionId/submissions`
   - Ensure payloads include proper IDs and relationship references.
   - Keep backend unchanged; if any contract is missing, document it clearly and continue frontend work around the API expectations.

7. User testing and refinement.
   - Admin: open `Divisions`, select a division, open a bootcamp, verify `Groups` and `Sessions` appear.
   - Instructor: verify assigned divisions/bootcamps only; verify sessions expose attendance/tasks/submissions as appropriate.
   - Student: verify enrolled division/bootcamp appears; verify session detail shows `Submit` and the relevant session actions.
   - Validate protected routes, deep links, and UI state across role navigation.

### Verification

- Confirm the final flow with actual role users.
- Ensure `Sidebar.tsx` only contains top-level entries and does not hardcode nested content.
- Verify `AppRouter.tsx` supports nested drill-down URLs and role-specific route guards.
- If backend endpoints are not ready, document each gap and continue frontend implementation with the expected contract.

### Decisions / assumptions

- The app should use a URL-driven hierarchical flow.
- `Groups` are bootcamp-level only.
- `Submissions` are student-specific.
- `Super Admin` is an elevated admin role with division creation and dashboard metric visibility.
- Work is frontend-first; backend should remain untouched in this phase.

### Implementation rules

1. Write clean, maintainable, debug-friendly code.
2. Work frontend-only first, keeping backend integration points planned but not modifying backend code.
3. If an API or backend contract is missing, explain what will fail, why, and how to fix it in the chat before changing backend code.
